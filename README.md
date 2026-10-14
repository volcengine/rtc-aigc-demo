# 交互式 AIGC 场景 AIGC Demo

此 Demo 为简化版本, 如您有 1.5.x 版本 UI 的诉求, 可切换至 1.5.1 分支。
首次运行需要填写根目录 `.env.local` 中的凭证，并配置 `server/scenes/*.json`。

项目代码分为两个并列子项目：

- `web/`：CRA 前端。
- `server/`：Koa 本地开发服务。

根目录 `package.json` 只负责编排并同时启动两个子项目。

## 简介

- 在 AIGC 对话场景下，火山引擎 AIGC-RTC Server 云端服务，通过整合 RTC 音视频流处理，ASR 语音识别，大模型接口调用集成，以及 TTS 语音生成等能力，提供基于流式语音的端到端 AIGC 能力链路。
- 用户只需调用基于标准的 OpenAPI 接口即可配置所需的 ASR、LLM、TTS 类型和参数。火山引擎云端计算服务负责边缘用户接入、云端资源调度、音视频流压缩、文本与语音转换处理以及数据订阅传输等环节。简化开发流程，让开发者更专注在对大模型核心能力的训练及调试，从而快速推进 AIGC 产品应用创新。
- 同时火山引擎 RTC 拥有成熟的音频 3A 处理、视频处理等技术以及大规模音视频聊天能力，可支持 AIGC 产品更便捷的支持多模态交互、多人互动等场景能力，保持交互的自然性和高效性。

## 【必看】环境准备

**Node.js 22，Yarn 1.22.22。**

### 1. 运行环境

以下命令均在项目根目录执行。`yarn dev` 会同时启动服务端和前端页面。

### 2. 场景配置

`server/scenes/*.json`

您可以自定义具体场景，并按模板填充 `SceneConfig` 和 `VoiceChat`。

`default.json` 是默认场景；您可以复制它新增场景，并填写
`VoiceChat.Config` / `VoiceChat.AgentConfig`。

注意：

- `SceneConfig`：场景的信息，例如名称、头像等。
- `VoiceChat`: 场景下的 AIGC 配置。
  - 可参考 [VoiceChat 参数说明](https://docs.volcengine.com/docs/6348/2123348)，填写与接口版本一致的参数。
  - 可在 [我的智能体](https://console.volcengine.com/conversational-ai/agentManage) 中创建、配置并保存智能体，再从管理页的 `代码示例` 获取 `StartVoiceChat` 配置。
    将请求体中的 `Config`、`AgentConfig` 分别填入场景 JSON 的 `VoiceChat.Config`、`VoiceChat.AgentConfig`；
    AppId、RoomId、TaskId、TargetUserId 由本 Demo 服务端设置，密钥改用环境变量引用。

## 快速开始

### 1. 安装依赖并准备配置

首次运行时复制示例文件；已有 `.env.local` 时保留原文件，仅补充所需字段。

```shell
cp -n .env.example .env.local
cp -n web/.env.example web/.env.local
yarn install --frozen-lockfile
yarn --cwd web install --frozen-lockfile
yarn --cwd server install --frozen-lockfile
```

### 2. 填写凭证和场景

在根目录 `.env.local` 中填写 `RTC_APP_ID`、`RTC_APP_KEY`、
`VOLCENGINE_ACCESS_KEY_ID` 和 `VOLCENGINE_SECRET_ACCESS_KEY`，
服务端使用 AK/SK 签名调用 VoiceChat OpenAPI。缺少任一必填凭证时，服务端无法启动。

编辑 `server/scenes/default.json`，按需填写 `VoiceChat.Config` 和 `VoiceChat.AgentConfig`。
`VoiceChat.AgentConfig.UserId` 必须填写，
作为智能体的 RTC 用户标识；`SceneConfig.name` 和 `icon` 用于前端展示。
新增场景时复制 JSON 并使用不同文件名，文件名（不含 `.json`）即 SceneID。
密钥、Token 等 secret 只放在 `.env.local`，场景 JSON 通过 `${ENV_NAME}` 引用。

OpenAPI 使用 `2025-06-01` 版本，接口地址、签名 region 和 service 在
`server/app.js` 中统一定义，无需填写环境变量。升级接口时需同时核对场景字段。
`RTC_BUSINESS_ID` 为可选环境变量，同时传给 RTC SDK 和 VoiceChat，不填则不设置。

服务端会为每个页面 session 分配独立的 SessionID、RoomId、UserId、
Token 和 TaskId，因此不同页面（包括同一浏览器的多个页面）可同时通话。
`VoiceChat` 中的 AppId、RoomId、TaskId 和 AgentConfig.TargetUserId 由服务端覆盖或生成，
无需在场景 JSON 中填写；RTC Token 也由服务端生成。
服务端始终启用 `EnableConversationStateCallback`，用于前端判断 AI 是否就绪。
同一页面同时只能有一个场景通话；切换场景前先挂断。

### 3. 启动并体验

```shell
yarn dev
```

打开 [前端页面](http://localhost:3000)，选择场景并开始通话，按浏览器提示授权麦克风。
服务端默认地址为 `http://127.0.0.1:3001`，
[健康检查](http://127.0.0.1:3001/health) 返回 `{"ok":true}` 仅表示服务已启动，不代表云端凭证或场景可用。

修改根目录 `.env.local` 后需重启服务端；修改 `web/.env.local` 后需重启前端。
修改场景后重启服务端并刷新页面，以获取新的场景和 SessionID。
服务端重启后旧 SessionID 失效，也需要刷新页面。

### 4. 单独启动、测试和构建

```shell
# 分别在两个终端运行
yarn --cwd server dev
yarn --cwd web start

# 自动化测试
yarn --cwd server test
yarn --cwd web test --runInBand

# 前端生产构建，产物位于 web/build/
yarn --cwd web build
```

前端构建不包含 Koa 服务；页面运行时仍需访问服务端。
如需修改服务端端口，在根目录 `.env.local` 中修改 `PORT`，并同步更新
`web/.env.local` 的 `REACT_APP_AIGC_PROXY_HOST`。服务端 `HOST` 默认仅监听本机。
前端端口可在 `web/.env.local` 中设置 `PORT`；避免在运行 `yarn dev` 的 shell 中统一设置
`PORT`，否则前后端会继承同一个端口。

### 常见问题

| 问题                                                                                                                          | 解决方案                                                                                                                                                                                                                                                                                                                                     |
| :---------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 如何使用第三方模型、Coze Bot                                                                                                  | 在 `server/scenes/` 下的 JSON 填写对应模型参数，并把第三方 secret 放进 `.env.local` 后通过 `${ENV_NAME}` 引用。                                                                                                                                                                                                                              |
| **启动后对话无反馈，或一直停留在“AI 准备中”“数字人准备中”** | 检查页面错误和服务端日志，按 [VoiceChat 参数说明](https://docs.volcengine.com/docs/6348/2123348) 核对字段大小写、类型及配置值。数字人场景还需检查数字人 AppId、Token 和并发限制。 |
| **浏览器报了 `token_error` 错误** | 检查根目录 `.env.local` 中 RTC_APP_ID 与 RTC_APP_KEY 是否属于同一应用；Token 由服务端生成，不需要手填。修改凭证后重启服务端并刷新页面；页面长时间未刷新时也应重新获取 Token。 |
| **StartVoiceChat 提示任务已启动** | 正常页面流程会合并同一 session 的重复启动请求。若自行修改了请求逻辑，检查是否重复调用云端接口，并使用对应的 AppId、RoomId、TaskId 停止原任务后再启动；不要通过在场景 JSON 中修改 RoomId 或 TaskId 排查，它们由服务端生成。 |
| 为什么麦克风、摄像头开启失败？浏览器报了`TypeError: Cannot read properties of undefined (reading 'getUserMedia')`             | 检查当前页面是否为[安全上下文](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts)（简单来说，检查当前页面是否为 `localhost` 或者 是否为 https 协议）。浏览器[限制](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts/features_restricted_to_secure_contexts) `getUserMedia` 只能在安全上下文中使用。 |
| 为什么我的麦克风正常、摄像头也正常，但是设备没有正常工作?                                                                     | 可能是设备权限未授予，详情可参考 [Web 排查设备权限获取失败问题](https://www.volcengine.com/docs/6348/1356355?s=g)。                                                                                                                                                                                                                          |
| 接口调用时, 返回 "Invalid 'Authorization' header, Pls check your authorization header" 错误                                   | 检查 `.env.local` 中成对配置的 AK/SK 及其权限。                                                                                                                                                                                                                                                                   |
| 什么是 RTC                                                                                                                    | **R**eal **T**ime **C**ommunication, RTC 的概念可参考[官网文档](https://www.volcengine.com/docs/6348/66812?s=g)。                                                                                                                                                                                                                            |
| 不清楚什么是主账号，什么是子账号                                                                                              | 可以参考[官方概念](https://www.volcengine.com/docs/6257/64963?hyperlink_open_type=lark.open_in_browser&s=g) 。                                                                                                                                                                                                                               |
| 我有自己的服务端，如何接入？ | 在 `web/.env.local` 设置 `REACT_APP_AIGC_PROXY_HOST`，重启前端，生产构建则需重新构建。保持 [服务端接口约定](server/README.md#接口约定) 一致；接口路径或响应格式不同时，再调整 `web/src/app/` 下的请求适配。 |

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

- 2026-10-14
  - 更新 RTC Web SDK 至 `4.69.3`。

- 2026-09-11
  - 更新 VoiceChat OpenAPI 至 `2025-06-01`，RTC Web SDK 至 `4.68.1`。
  - 拆分 `web/` 与 `server/`，支持根目录 `yarn dev` 同时启动。
  - 凭证改为环境变量配置，按页面 session 隔离通话，支持可选 BusinessId。

- 2025-09-30
  - 更新数字人场景相关配置

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
