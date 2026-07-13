# 交互式 AIGC 场景 AIGC Demo

此 Demo 为简化版本, 如您有 1.5.x 版本 UI 的诉求, 可切换至 1.5.1 分支。
跑通阶段时, 无须关心代码实现，仅需按需完成 `server/scenes/*.json` 的场景信息填充即可。

项目代码分为两个并列子项目：

- `web/`：CRA 前端。
- `server/`：Koa 本地开发服务。

根目录 `package.json` 只负责编排并同时启动两个子项目。

## 简介

- 在 AIGC 对话场景下，火山引擎 AIGC-RTC Server 云端服务，通过整合 RTC 音视频流处理，ASR 语音识别，大模型接口调用集成，以及 TTS 语音生成等能力，提供基于流式语音的端到端 AIGC 能力链路。
- 用户只需调用基于标准的 OpenAPI 接口即可配置所需的 ASR、LLM、TTS 类型和参数。火山引擎云端计算服务负责边缘用户接入、云端资源调度、音视频流压缩、文本与语音转换处理以及数据订阅传输等环节。简化开发流程，让开发者更专注在对大模型核心能力的训练及调试，从而快速推进 AIGC 产品应用创新。
- 同时火山引擎 RTC 拥有成熟的音频 3A 处理、视频处理等技术以及大规模音视频聊天能力，可支持 AIGC 产品更便捷的支持多模态交互、多人互动等场景能力，保持交互的自然性和高效性。

## 【必看】环境准备

**Node 版本: 22**

### 1. 运行环境

`yarn dev` 会同时启动服务端和前端页面。

### 2. 服务开通

开通 ASR、TTS、LLM、RTC 等服务，可参考 [开通服务](https://www.volcengine.com/docs/6348/1315561?s=g) 进行相关服务的授权与开通。

### 3. 场景配置

`server/scenes/*.json`

您可以自定义具体场景，并按模板填充 `SceneConfig` 和 `VoiceChat`。

`default.json` 是默认场景；您可以复制它新增场景。`vertc auth login`
会保留 `SceneConfig`，并用控制台中选择的智能体更新
`VoiceChat.Config` / `VoiceChat.AgentConfig`。

注意：

- `SceneConfig`：场景的信息，例如名称、头像等。
- `VoiceChat`: 场景下的 AIGC 配置。
  - 可参考 https://www.volcengine.com/docs/6348/1558163 中参数描述，完整填写参数内容。
  - 可通过 [快速跑通 Demo](https://console.volcengine.com/rtc/aigc/run?s=g) 快速获取参数, 跑通后点击右上角 `接入 API` 按钮复制相关代码贴到 JSON 配置文件中即可。

## 快速开始

复制环境变量文件并安装前后端依赖：

```shell
cp .env.example .env.local
yarn install --frozen-lockfile
cp web/.env.example web/.env.local
yarn --cwd web install --frozen-lockfile
yarn --cwd server install --frozen-lockfile
```

`RTC_APP_ID` / `RTC_APP_KEY` 必填；同时按场景填写语音和 LLM 配置。
密钥、Token 等 secret 只放在 `.env.local`，不要写入场景 JSON。运行模式二选一：

- 配置长期 `VOLCENGINE_ACCESS_KEY_ID` / `VOLCENGINE_SECRET_ACCESS_KEY`：
  Node 服务标准签名直调 VoiceChat OpenAPI。
- 不配置长期 AK/SK：使用 `vertc dev`，服务端通过 CLI 的
  `agent start/stop` runtime 启停任务；不会提供 STS HTTP 接口。

服务端会为每个页面 session 分配独立的 SessionID、RoomId、UserId、
Token 和 TaskId，因此不同页面（包括同一浏览器的多个页面）可同时通话。
AgentConfig.UserId 来自场景配置，TargetUserId 由服务端按 session 注入。

启动完整 Demo：

```shell
vertc dev
```

直接使用长期 AK/SK 时也可以运行：

```shell
yarn dev
```

### 常见问题

| 问题                                                                                                                          | 解决方案                                                                                                                                                                                                                                                                                                                                     |
| :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 如何使用第三方模型、Coze Bot                                                                                                  | 在 `server/scenes/` 下的 JSON 填写对应模型参数，并把第三方 secret 放进 `.env.local` 后通过 `${ENV_NAME}` 引用。                                                                                                                                                                                                                              |
| **启动智能体之后, 对话无反馈，或者一直停留在 "AI 准备中, 请稍侯"**                                                            | <li>可能因为控制台中相关权限没有正常授予，请参考[流程](https://www.volcengine.com/docs/6348/1315561?s=g)再次确认下是否完成相关操作。</li><li>参数传递可能有问题，例如参数大小写、类型等问题，请再次确认。</li><li>相关资源可能未开通或者用量不足/欠费，请再次确认。</li>                                                                     |
| **浏览器报了 `Uncaught (in promise) r: token_error` 错误**                                                                    | 请检查您填在项目中的 RTC Token 是否合法，检测用于生成 Token 的 UserId、RoomId 以及 Token 本身是否与项目中填写的一致；或者 Token 可能过期, 可尝试重新生成下。                                                                                                                                                                                 |
| **[StartVoiceChat]Failed(Reason: The task has been started. Please do not call the startup task interface repeatedly.)** 报错 | 如果设置的 RoomId、UserId 为固定值，重复调用 startAgent 会导致出错，只需先调用 stopAgent 后再重新 startAgent 即可。                                                                                                                                                                                                                          |
| 为什么麦克风、摄像头开启失败？浏览器报了`TypeError: Cannot read properties of undefined (reading 'getUserMedia')`             | 检查当前页面是否为[安全上下文](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts)（简单来说，检查当前页面是否为 `localhost` 或者 是否为 https 协议）。浏览器[限制](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts) `getUserMedia` 只能在安全上下文中使用。 |
| 为什么我的麦克风正常、摄像头也正常，但是设备没有正常工作?                                                                     | 可能是设备权限未授予，详情可参考 [Web 排查设备权限获取失败问题](https://www.volcengine.com/docs/6348/1356355?s=g)。                                                                                                                                                                                                                          |
| 接口调用时, 返回 "Invalid 'Authorization' header, Pls check your authorization header" 错误                                   | 检查 `.env.local` 中成对配置的长期 AK/SK；快速开始模式请改用 `vertc dev`。                                                                                                                                                                                                                                                                   |
| 什么是 RTC                                                                                                                    | **R**eal **T**ime **C**ommunication, RTC 的概念可参考[官网文档](https://www.volcengine.com/docs/6348/66812?s=g)。                                                                                                                                                                                                                            |
| 不清楚什么是主账号，什么是子账号                                                                                              | 可以参考[官方概念](https://www.volcengine.com/docs/6257/64963?hyperlink_open_type=lark.open_in_browser&s=g) 。                                                                                                                                                                                                                               |
| 我有自己的服务端了, 我应该怎么让前端调用我的服务端呢                                                                          | 修改 `web/src/config/index.ts` 中的 `AIGC_PROXY_HOST` 请求域名，并在 `web/src/app/api.ts` 中修改接口参数配置 `APIS_CONFIG`。                                                                                                                                                                                                                 |

如果有上述以外的问题，欢迎联系我们反馈。

### 相关文档

- [场景介绍](https://www.volcengine.com/docs/6348/1310537?s=g)
- [Demo 体验](https://www.volcengine.com/docs/6348/1310559?s=g)
- [场景搭建方案](https://www.volcengine.com/docs/6348/1310560?s=g)

## Security and privacy

This project takes security seriously.
For vulnerability reporting and supported versions, see [SECURITY.md](SECURITY.md)

## 更新日志

### OpenAPI 更新

参考 [OpenAPI 更新](https://www.volcengine.com/docs/6348/1544162) 中与 实时对话式 AI 相关的更新内容。

### Demo 更新

#### [1.6.0]

- 2025-07-08
  - 更新 RTC Web SDK 版本至 4.66.20
- 2025-06-26
  - 修复进房有问题的 BUG
- 2025-06-23
  - 简化 Demo 使用, 配置归一化。
  - 删除无用组件。
  - 追加服务端 README。
- 2025-06-18
  - 更新 RTC Web SDK 版本至 4.66.16
  - 更新 UI 和参数配置方式
  - 更新 Readme 文档
  - 追加 Node 服务的参数检测能力
  - 追加 Node 服务的 Token 生成能力
