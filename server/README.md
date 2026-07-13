# Node Server

## 启动命令

```
yarn install --frozen-lockfile

yarn dev
```

## 使用须知

Node 服务启动时会自动读取 `server/scenes` 下的所有文件作为可用的场景, 并通过接口 API 返回相关信息。

因此，您需要：

1. 在 `server/scenes` 目录下参考其它 JSON 的格式, 自定义创建一个 `xxxx.json` 文件，用于描述您的场景，其中 xxxx 为场景名称。
2. 确保您的 `.json` 文件符合模版定义（可参考 `default.json`），大小写敏感。
3. 新增场景 JSON 后须重启 Node 服务，保证场景信息被正常读取。
4. 服务端为每个 session 动态生成 RTC RoomId、UserId、Token 与 VoiceChat TaskId，不写回 JSON；AgentConfig.UserId 必须由场景提供。

## Session 契约

- `POST /getScenes` 返回该页面独立的 `SessionID` 和场景运行时配置。
- `POST /proxy?Action=StartVoiceChat|StopVoiceChat` 需要同时传入 `SessionID` 和 `SceneID`。
- 不同 session 的房间、用户和 VoiceChat 任务完全隔离，可并发通话；同一浏览器的多个页面也不互斥。

## 相关参数获取

- `.env.local`
  - `RTC_APP_ID`、`RTC_APP_KEY` 为服务端 RTC 凭证。
  - 第三方 secret 也只保存在此文件，由场景 JSON 通过 `${ENV_NAME}` 引用。
  - 长期 AK/SK 成对配置时直调 OpenAPI；未配置时由 `vertc dev` 注入 CLI runtime。
- VoiceChat
  - 可参考 https://www.volcengine.com/docs/6348/1558163 中参数描述
  - 可通过 [快速跑通 Demo](https://console.volcengine.com/rtc/aigc/run?s=g) 快速获取参数, 跑通后点击右上角 `接入 API` 按钮复制相关代码贴到 JSON 配置文件中即可。

## 注意

- 相关错误会通过服务端接口返回。
- 服务端只代理 StartVoiceChat/StopVoiceChat，不提供 STS HTTP 接口。
- 为方便本地开发，服务端 CORS 允许任意 Origin；该配置不适合直接用于生产环境。
- Node 服务会根据您配置的 `VoiceChat` 中是否存在视觉模型相关的配置返回相关信息给前端页面, 从而控制相关 UI 是否展示。
- 使用时请留意相关服务已开通。
