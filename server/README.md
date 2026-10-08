# Node Server

## 启动命令

先按根目录 [README](../README.md#快速开始) 配置凭证和场景。以下命令均从项目根目录执行：

```shell
yarn --cwd server install --frozen-lockfile
yarn --cwd server dev
```

服务端读取项目根目录 `.env.local`，不是 `server/.env.local`；已有进程环境变量优先于文件中的值。
默认监听 `127.0.0.1:3001`，可通过根目录 `.env.local` 中的 `HOST`、`PORT` 修改。
单独运行、不使用文件监听时执行 `yarn --cwd server start`。

## 使用须知

Node 服务启动时会自动读取 `server/scenes` 下的 `.json` 文件作为可用的场景, 并通过接口 API 返回相关信息。

因此，您需要：

1. 在 `server/scenes` 目录下参考其它 JSON 的格式, 自定义创建一个 `xxxx.json` 文件，用于描述您的场景，其中 xxxx 为场景名称。
2. 确保您的 `.json` 文件符合模版定义（可参考 `default.json`），大小写敏感。
3. 修改场景后重启服务端并刷新页面。`yarn --cwd server dev` 会监听 JS/JSON 变化自动重启，但根目录 `.env.local` 不在监听范围内。
4. 服务端为每个 session 动态生成 RTC RoomId、UserId、Token 与 VoiceChat TaskId，不写回 JSON；AgentConfig.UserId 必须由场景提供。

## 接口约定

- `GET /health` 返回 `{"ok":true}`，不检查云端凭证或服务权限。
- `POST /getScenes`：请求体为 `{}`，每次调用创建新的 session；返回 `{ ResponseMetadata, Result: { SessionID, scenes: [{ scene, rtc }] } }`。
- `POST /proxy?Action=StartVoiceChat` 和 `POST /proxy?Action=StopVoiceChat`：JSON 请求体为 `{ "SessionID": "...", "SceneID": "default" }`；`SceneID` 对应场景文件名。停止请求也接受表单编码，供页面卸载时发送。
- 代理接口返回 OpenAPI 的 `ResponseMetadata` / `Result` 结构；调用方需检查 `ResponseMetadata.Error`，不能仅凭 HTTP 状态判断业务成功。
- 不同 session 使用独立的房间、用户和 VoiceChat 任务；同一 session 同时仅允许一个场景通话。
- session 保存在服务端内存中，重启后失效，前端需刷新页面重新获取。
- 服务端覆盖 VoiceChat 的 AppId、RoomId、TaskId、AgentConfig.TargetUserId，并启用 EnableConversationStateCallback；这些运行时字段无需写入场景。

## 相关参数获取

- 根目录 `.env.local`
  - `RTC_APP_ID`、`RTC_APP_KEY` 为服务端 RTC 凭证。
  - 第三方 secret 也只保存在此文件，由场景 JSON 通过 `${ENV_NAME}` 引用。
  - `VOLCENGINE_ACCESS_KEY_ID`、`VOLCENGINE_SECRET_ACCESS_KEY` 必须成对配置，用于签名调用 OpenAPI。
  - 可选 `RTC_BUSINESS_ID` 同时传给 RTC SDK 和 VoiceChat。
- VoiceChat
  - 参考 [VoiceChat 参数说明](https://docs.volcengine.com/docs/6348/2123348)。
  - 可在 [我的智能体](https://console.volcengine.com/conversational-ai/agentManage) 中创建、配置并保存智能体，再从管理页的 `代码示例` 获取 `StartVoiceChat` 配置。
    将请求体中的 `Config`、`AgentConfig` 分别填入场景 JSON 的 `VoiceChat.Config`、`VoiceChat.AgentConfig`；
    AppId、RoomId、TaskId、TargetUserId 由本 Demo 服务端设置，密钥改用环境变量引用。

## 注意

- 相关错误会通过服务端接口返回。
- 服务端只代理 StartVoiceChat/StopVoiceChat，不提供 STS HTTP 接口。
- 为方便本地开发，服务端 CORS 允许任意 Origin；该配置不适合直接用于生产环境。
- Node 服务会根据您配置的 `VoiceChat` 中是否存在视觉模型相关的配置返回相关信息给前端页面, 从而控制相关 UI 是否展示。
