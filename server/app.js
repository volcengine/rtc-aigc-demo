/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

const path = require("path");
const { spawn } = require("child_process");
const Koa = require("koa");
const uuid = require("uuid");
const bodyParser = require("koa-bodyparser");
const cors = require("koa2-cors");
const { Signer } = require("@volcengine/openapi");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { wrapper, assert, readFiles } = require("./util");
const TokenManager = require("./token");
const Privileges = require("./token").privileges;

const START_ACTION = "StartVoiceChat";
const STOP_ACTION = "StopVoiceChat";
const ALLOWED_ACTIONS = new Set([START_ACTION, STOP_ACTION]);
const DEFAULT_VERSION = "2025-06-01";
const DEFAULT_ENDPOINT = "https://rtc.volcengineapi.com";

function required(value, name) {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${name} 不能为空`);
  }
  return normalized;
}

function loadRuntimeConfig(env = process.env) {
  const accessKeyId = env.VOLCENGINE_ACCESS_KEY_ID?.trim();
  const secretKey = env.VOLCENGINE_SECRET_ACCESS_KEY?.trim();
  if (Boolean(accessKeyId) !== Boolean(secretKey)) {
    throw new Error(
      "VOLCENGINE_ACCESS_KEY_ID 和 VOLCENGINE_SECRET_ACCESS_KEY 必须同时配置"
    );
  }

  const config = {
    appId: required(env.RTC_APP_ID, "RTC_APP_ID"),
    appKey: required(env.RTC_APP_KEY, "RTC_APP_KEY"),
    businessId: env.VERTC_BUSINESS_ID?.trim() || undefined,
    host: env.HOST?.trim() || "127.0.0.1",
    port: Number(env.PORT || 3001),
    endpoint: env.VOLCENGINE_RTC_ENDPOINT?.trim() || DEFAULT_ENDPOINT,
    version: env.VOLCENGINE_RTC_API_VERSION?.trim() || DEFAULT_VERSION,
    region: env.VOLCENGINE_RTC_REGION?.trim() || "cn-north-1",
    service: env.VOLCENGINE_RTC_SERVICE?.trim() || "rtc",
    env,
  };
  if (!Number.isInteger(config.port) || config.port <= 0) {
    throw new Error("PORT 必须为正整数");
  }

  if (accessKeyId && secretKey) {
    return {
      ...config,
      mode: "openapi",
      credential: { accessKeyId, secretKey },
    };
  }
  return {
    ...config,
    mode: "cli",
    cliPath: required(env.VERTC_CLI_PATH, "VERTC_CLI_PATH"),
    projectDir: required(env.VERTC_PROJECT_DIR, "VERTC_PROJECT_DIR"),
  };
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function validateScene(sceneId, value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${sceneId}: scene 必须为对象`);
  }
  if (!value.SceneConfig || typeof value.SceneConfig !== "object") {
    throw new Error(`${sceneId}: SceneConfig 不能为空`);
  }
  if (!value.VoiceChat?.Config || !value.VoiceChat?.AgentConfig) {
    throw new Error(
      `${sceneId}: VoiceChat.Config 和 VoiceChat.AgentConfig 不能为空`
    );
  }
  if (
    typeof value.VoiceChat.AgentConfig.UserId !== "string" ||
    !value.VoiceChat.AgentConfig.UserId.trim()
  ) {
    throw new Error(`${sceneId}: VoiceChat.AgentConfig.UserId 不能为空`);
  }
}

function createRtcToken(config, roomId, userId) {
  const key = new TokenManager.AccessToken(
    config.appId,
    config.appKey,
    roomId,
    userId
  );
  key.addPrivilege(Privileges.PrivSubscribeStream, 0);
  key.addPrivilege(Privileges.PrivPublishStream, 0);
  key.expireTime(Math.floor(Date.now() / 1000) + 24 * 3600);
  return key.serialize();
}

function createRuntimeScenes(sceneDefinitions, config) {
  return Object.fromEntries(
    Object.entries(sceneDefinitions).map(([sceneId, definition]) => {
      validateScene(sceneId, definition);
      const roomId = uuid.v4();
      const userId = uuid.v4();
      const taskId = uuid.v4();
      const voiceChat = deepClone(definition.VoiceChat);
      const scene = {
        id: sceneId,
        ...deepClone(definition.SceneConfig),
        botName: voiceChat.AgentConfig.UserId,
        isInterruptMode: voiceChat.Config.InterruptMode === 0,
        isVision: Boolean(voiceChat.Config.LLMConfig?.VisionConfig?.Enable),
        isScreenMode:
          voiceChat.Config.LLMConfig?.VisionConfig?.SnapshotConfig
            ?.StreamType === 1,
      };
      return [
        sceneId,
        {
          scene,
          rtc: {
            AppId: config.appId,
            BusinessId: config.businessId,
            RoomId: roomId,
            UserId: userId,
            Token: createRtcToken(config, roomId, userId),
          },
          voiceChat,
          roomId,
          userId,
          taskId,
          status: "idle",
          pending: undefined,
        },
      ];
    })
  );
}

function expandEnvReferences(value, env) {
  if (Array.isArray(value)) {
    return value.map((item) => expandEnvReferences(item, env));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        expandEnvReferences(item, env),
      ])
    );
  }
  if (typeof value !== "string") {
    return value;
  }
  const match = value.match(/^\$\{([A-Z_][A-Z0-9_]*)\}$/);
  if (!match) {
    return value;
  }
  if (!Object.prototype.hasOwnProperty.call(env, match[1])) {
    throw new Error(`缺少环境变量 ${match[1]}`);
  }
  return env[match[1]];
}

function buildStartRequest(runtimeScene, config) {
  const voiceChat = expandEnvReferences(
    deepClone(runtimeScene.voiceChat),
    config.env
  );
  return {
    ...voiceChat,
    AppId: config.appId,
    BusinessId: config.businessId,
    RoomId: runtimeScene.roomId,
    TaskId: runtimeScene.taskId,
    AgentConfig: {
      ...voiceChat.AgentConfig,
      TargetUserId: [runtimeScene.userId],
      EnableConversationStateCallback: true,
    },
  };
}

function buildStopRequest(runtimeScene, config) {
  return {
    AppId: config.appId,
    RoomId: runtimeScene.roomId,
    TaskId: runtimeScene.taskId,
  };
}

function createOpenApiInvoker(config, fetchImpl = fetch) {
  return async (action, body) => {
    const requestData = {
      region: config.region,
      method: "POST",
      params: { Action: action, Version: config.version },
      headers: {
        Host: new URL(config.endpoint).host,
        "Content-type": "application/json",
      },
      body,
    };
    const signer = new Signer(requestData, config.service);
    signer.addAuthorization(config.credential);
    const url = new URL(config.endpoint);
    url.searchParams.set("Action", action);
    url.searchParams.set("Version", config.version);
    const response = await fetchImpl(url.toString(), {
      method: "POST",
      headers: requestData.headers,
      body: JSON.stringify(body),
    });
    return response.json();
  };
}

function runCliAgent(config, action, body, spawnImpl = spawn) {
  const cliAction = action === START_ACTION ? "start" : "stop";
  return new Promise((resolve, reject) => {
    const child = spawnImpl(
      config.cliPath,
      ["agent", cliAction, "--runtime-request-stdin"],
      {
        cwd: config.projectDir,
        stdio: ["pipe", "ignore", "ignore"],
      }
    );
    const timeout = setTimeout(() => child.kill("SIGKILL"), 30000);
    child.once("error", () => {
      clearTimeout(timeout);
      reject(new Error(`无法启动 vertc agent ${cliAction}`));
    });
    child.once("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({
          ResponseMetadata: {
            Action: action,
            RequestId: `vertc-cli-${uuid.v4()}`,
          },
          Result: "ok",
        });
      } else {
        reject(new Error(`vertc agent ${cliAction} 执行失败`));
      }
    });
    child.stdin.on("error", () => undefined);
    child.stdin.end(JSON.stringify(body));
  });
}

function createVoiceChatInvoker(config, options = {}) {
  if (config.mode === "openapi") {
    return createOpenApiInvoker(config, options.fetchImpl);
  }
  return (action, body) => runCliAgent(config, action, body, options.spawnImpl);
}

function responseSucceeded(response) {
  return !response?.ResponseMetadata?.Error;
}

function localSuccess(action) {
  return {
    ResponseMetadata: {
      Action: action,
      RequestId: `local-${uuid.v4()}`,
    },
    Result: "ok",
  };
}

function createApp(options = {}) {
  const config = options.config || loadRuntimeConfig(options.env);
  const definitions =
    options.sceneDefinitions || readFiles("./scenes", ".json");
  const invokeVoiceChat =
    options.invokeVoiceChat || createVoiceChatInvoker(config, options);
  const sessions = new Map();
  const app = new Koa();

  const createSession = () => {
    const id = uuid.v4();
    const session = {
      id,
      activeSceneId: undefined,
      scenes: createRuntimeScenes(definitions, config),
    };
    sessions.set(id, session);
    return session;
  };

  const releaseSessionCall = (session, runtimeScene) => {
    runtimeScene.status = "idle";
    if (session.activeSceneId === runtimeScene.scene.id) {
      session.activeSceneId = undefined;
    }
  };

  const startSessionScene = async (session, runtimeScene) => {
    assert(
      !session.activeSceneId || session.activeSceneId === runtimeScene.scene.id,
      "同一 session 只允许一个 scene 进行通话"
    );
    if (runtimeScene.status === "starting") {
      return runtimeScene.pending;
    }
    if (runtimeScene.status === "stopping") {
      await runtimeScene.pending;
      return startSessionScene(session, runtimeScene);
    }
    if (runtimeScene.status === "active") {
      return localSuccess(START_ACTION);
    }

    session.activeSceneId = runtimeScene.scene.id;
    runtimeScene.status = "starting";
    runtimeScene.pending = invokeVoiceChat(
      START_ACTION,
      buildStartRequest(runtimeScene, config)
    );
    try {
      const response = await runtimeScene.pending;
      if (responseSucceeded(response)) {
        runtimeScene.status = "active";
      } else {
        releaseSessionCall(session, runtimeScene);
      }
      return response;
    } catch (error) {
      releaseSessionCall(session, runtimeScene);
      throw error;
    } finally {
      runtimeScene.pending = undefined;
    }
  };

  const stopSessionScene = async (session, runtimeScene) => {
    if (runtimeScene.status === "idle") {
      return localSuccess(STOP_ACTION);
    }
    if (runtimeScene.status === "starting") {
      try {
        await runtimeScene.pending;
      } catch {
        return localSuccess(STOP_ACTION);
      }
      return stopSessionScene(session, runtimeScene);
    }
    if (runtimeScene.status === "stopping") {
      await runtimeScene.pending;
      return localSuccess(STOP_ACTION);
    }
    const previousStatus = runtimeScene.status;
    runtimeScene.status = "stopping";
    runtimeScene.pending = invokeVoiceChat(
      STOP_ACTION,
      buildStopRequest(runtimeScene, config)
    );
    try {
      const response = await runtimeScene.pending;
      if (responseSucceeded(response)) {
        releaseSessionCall(session, runtimeScene);
      } else {
        runtimeScene.status = previousStatus;
      }
      return response;
    } catch (error) {
      runtimeScene.status = previousStatus;
      throw error;
    } finally {
      runtimeScene.pending = undefined;
    }
  };

  // This server is only used for local development, so allow any local web
  // origin to call it without requiring per-port CORS configuration.
  app.use(cors({ origin: "*" }));
  app.use(bodyParser());
  app.use(async (ctx) => {
    if (ctx.method === "GET" && ctx.path === "/health") {
      ctx.body = { ok: true, agentMode: config.mode };
      return;
    }

    await wrapper({
      ctx,
      apiName: "proxy",
      containResponseMetadata: false,
      logic: async () => {
        const { Action } = ctx.query || {};
        assert(
          ALLOWED_ACTIONS.has(Action),
          "Action 仅支持 StartVoiceChat 或 StopVoiceChat"
        );
        const { SessionID, SceneID } = ctx.request.body || {};
        assert(SessionID, "SessionID 不能为空");
        assert(SceneID, "SceneID 不能为空");
        const session = sessions.get(SessionID);
        assert(session, `${SessionID} 不存在`);
        const runtimeScene = session.scenes[SceneID];
        assert(runtimeScene, `${SceneID} 不存在`);

        return Action === START_ACTION
          ? startSessionScene(session, runtimeScene)
          : stopSessionScene(session, runtimeScene);
      },
    });

    await wrapper({
      ctx,
      apiName: "getScenes",
      logic: () => {
        const session = createSession();
        return {
          SessionID: session.id,
          scenes: Object.values(session.scenes).map(({ scene, rtc }) => ({
            scene,
            rtc,
          })),
        };
      },
    });
  });

  app.stopActiveAgents = async () => {
    const activeScenes = [];
    for (const session of sessions.values()) {
      for (const scene of Object.values(session.scenes)) {
        if (scene.status !== "idle") {
          activeScenes.push({ session, scene });
        }
      }
    }
    await Promise.allSettled(
      activeScenes.map(async ({ session, scene }) => {
        if (scene.status === "starting" || scene.status === "stopping") {
          await scene.pending.catch(() => undefined);
        }
        if (scene.status === "active") {
          await stopSessionScene(session, scene);
        }
      })
    );
    for (const { session, scene } of activeScenes) {
      if (scene.status !== "idle") {
        releaseSessionCall(session, scene);
      }
    }
  };
  return app;
}

function startServer(options = {}) {
  const app = createApp(options);
  const config = options.config || loadRuntimeConfig(options.env);
  const server = app.listen(config.port, config.host, () => {
    console.log(
      `AIGC Server is running at http://${config.host}:${config.port}`
    );
  });
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await app.stopActiveAgents();
    await new Promise((resolve) => server.close(resolve));
  };
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      void stop().then(() => process.exit(0));
    });
  }
  return { app, server, stop };
}

if (require.main === module) {
  dotenv.config({
    path:
      process.env.VERTC_ENV_FILE || path.resolve(__dirname, "../.env.local"),
  });
  startServer();
}

module.exports = {
  ALLOWED_ACTIONS,
  START_ACTION,
  STOP_ACTION,
  buildStartRequest,
  buildStopRequest,
  createApp,
  createRuntimeScenes,
  createVoiceChatInvoker,
  expandEnvReferences,
  loadRuntimeConfig,
  runCliAgent,
  startServer,
  validateScene,
};
