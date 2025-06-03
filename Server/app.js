/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const { Signer } = require('@volcengine/openapi');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

// 创建专业的 logger
const logger = {
  info: (message, data = {}) => {
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] [INFO] ${message}`, data);
  },
  warn: (message, data = {}) => {
    // eslint-disable-next-line no-console
    console.warn(`[${new Date().toISOString()}] [WARN] ${message}`, data);
  },
  error: (message, error = null) => {
    // eslint-disable-next-line no-console
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, error);
  },
  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.debug(`[${new Date().toISOString()}] [DEBUG] ${message}`, data);
    }
  },
};

dotenv.config();
logger.info('Environment variables loaded');

const app = new Koa();

app.use(cors({
  origin: '*'
}));

app.use(bodyParser());

/**
 * @notes 在 https://console.volcengine.com/iam/keymanage/ 获取 AK/SK
 */
const ACCOUNT_INFO = {
  /**
   * @notes 必填, 在 https://console.volcengine.com/iam/keymanage/ 获取
   */
  accessKeyId: process.env.DOUBAO_AK,
  /**
   * @notes 必填, 在 https://console.volcengine.com/iam/keymanage/ 获取
   */
  secretKey: process.env.DOUBAO_SK,
};

// 验证关键配置
if (!ACCOUNT_INFO.accessKeyId || !ACCOUNT_INFO.secretKey) {
  logger.error(
    'Missing required credentials: DOUBAO_AK or DOUBAO_SK not found in environment variables'
  );
  process.exit(1);
}

logger.info('Account credentials configured', {
  hasAccessKey: !!ACCOUNT_INFO.accessKeyId,
  hasSecretKey: !!ACCOUNT_INFO.secretKey,
});

app.use(async (ctx, next) => {
  const start = Date.now();
  logger.info(`Incoming request: ${ctx.method} ${ctx.url}`, {
    userAgent: ctx.get('User-Agent'),
    ip: ctx.ip,
  });

  try {
    await next();
    const duration = Date.now() - start;
    logger.info(`Request completed: ${ctx.status}`, {
      method: ctx.method,
      url: ctx.url,
      status: ctx.status,
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`Request failed: ${ctx.method} ${ctx.url}`, {
      error: error.message,
      stack: error.stack,
      duration: `${duration}ms`,
    });
    throw error;
  }
});

app.use(async (ctx) => {
  /**
   * @brief 代理 AIGC 的 OpenAPI 请求
   */
  if (ctx.url.startsWith('/proxyAIGCFetch') && ctx.method.toLowerCase() === 'post') {
    const { Action, Version } = ctx.query || {};
    const body = ctx.request.body;

    logger.info('Processing AIGC proxy request', {
      action: Action,
      version: Version,
      bodyKeys: Object.keys(body || {}),
    });

    try {
      /**
       * 参考 https://github.com/volcengine/volc-sdk-nodejs 可获取更多 火山 TOP 网关 SDK 的使用方式
       */
      const openApiRequestData = {
        region: 'cn-north-1',
        method: 'POST',
        params: {
          Action,
          Version,
        },
        headers: {
          Host: 'rtc.volcengineapi.com',
          'Content-type': 'application/json',
        },
        body,
      };

      logger.debug('Signing OpenAPI request', { region: openApiRequestData.region });
      const signer = new Signer(openApiRequestData, 'rtc');
      signer.addAuthorization(ACCOUNT_INFO);

      logger.info('Making OpenAPI request to VolcEngine', {
        action: Action,
        version: Version,
        url: `https://rtc.volcengineapi.com?Action=${Action}&Version=${Version}`,
      });

      /** 参考 https://www.volcengine.com/docs/6348/69828 可获取更多 OpenAPI 的信息 */
      const result = await fetch(
        `https://rtc.volcengineapi.com?Action=${Action}&Version=${Version}`,
        {
          method: 'POST',
          headers: openApiRequestData.headers,
          body: JSON.stringify(body),
        }
      );

      const volcResponse = await result.json();

      logger.info('VolcEngine API response', volcResponse)

      if (result.ok && volcResponse.ResponseMetadata?.Error?.Code) {
        logger.warn('VolcEngine API returned error', {
          errorCode: volcResponse.ResponseMetadata.Error.Code,
          errorMessage: volcResponse.ResponseMetadata.Error.Message,
          action: Action,
        });
        logger.debug('VolcEngine error response details', {
          action: Action,
          responseMetadata: volcResponse.ResponseMetadata,
          httpStatus: result.status,
        });
      } else if (result.ok) {
        logger.info('VolcEngine API request successful', {
          action: Action,
          hasResult: !!volcResponse.Result,
        });
        logger.debug('VolcEngine success response structure', {
          action: Action,
          resultKeys: volcResponse.Result ? Object.keys(volcResponse.Result) : [],
          responseMetadataKeys: volcResponse.ResponseMetadata
            ? Object.keys(volcResponse.ResponseMetadata)
            : [],
          httpStatus: result.status,
        });
      } else {
        logger.error('VolcEngine API request failed', {
          status: result.status,
          statusText: result.statusText,
          action: Action,
        });
        logger.debug('HTTP request failure details', {
          action: Action,
          headers: Object.fromEntries(result.headers.entries()),
          url: result.url,
        });
      }

      logger.info('Returning response to client', {
        action: Action,
        version: Version,
        success: result.ok && !volcResponse.ResponseMetadata?.Error?.Code,
        responseSize: JSON.stringify(volcResponse).length,
        hasError: !!volcResponse.ResponseMetadata?.Error?.Code,
        errorCode: volcResponse.ResponseMetadata?.Error?.Code || null,
      });

      ctx.body = volcResponse;
    } catch (error) {
      logger.error('Error processing AIGC proxy request', {
        error: error.message,
        stack: error.stack,
        action: Action,
        version: Version,
      });

      ctx.status = 500;
      ctx.body = {
        error: 'Internal server error',
        message: error.message,
      };
    }
  } else {
    logger.warn('404 - Route not found', {
      method: ctx.method,
      url: ctx.url,
    });
    ctx.status = 404;
    ctx.body = '<h1>404 Not Found</h1>';
  }
});

app.listen(50602, () => {
  logger.info('AIGC Server started successfully', {
    port: 50602,
    url: 'http://localhost:50602',
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});
