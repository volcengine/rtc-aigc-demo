# 交互式AIGC场景 AIGC Demo

此 Demo 为简化版本, 如您有 1.5.x 版本 UI 的诉求, 可切换至 1.5.1 分支。
跑通阶段时, 无须关心代码实现，仅需按需完成 `Server/scenes/*.json` 的场景信息填充即可。

## 简介
- 在 AIGC 对话场景下，火山引擎 AIGC-RTC Server 云端服务，通过整合 RTC 音视频流处理，ASR 语音识别，大模型接口调用集成，以及 TTS 语音生成等能力，提供基于流式语音的端到端AIGC能力链路。
- 用户只需调用基于标准的 OpenAPI 接口即可配置所需的 ASR、LLM、TTS 类型和参数。火山引擎云端计算服务负责边缘用户接入、云端资源调度、音视频流压缩、文本与语音转换处理以及数据订阅传输等环节。简化开发流程，让开发者更专注在对大模型核心能力的训练及调试，从而快速推进AIGC产品应用创新。     
- 同时火山引擎 RTC拥有成熟的音频 3A 处理、视频处理等技术以及大规模音视频聊天能力，可支持 AIGC 产品更便捷的支持多模态交互、多人互动等场景能力，保持交互的自然性和高效性。 

## 【必看】环境准备
**Node 版本: 16.0+**

### 1. 运行环境
需要准备两个 Terminal，分别启动服务端和前端页面。

### 2. 服务开通
开通 ASR、TTS、LLM、RTC 等服务，可参考 [开通服务](https://www.volcengine.com/docs/6348/1315561?s=g) 进行相关服务的授权与开通。

### 3. 场景配置
`Server/scenes/*.json`

您可以自定义具体场景, 并按需根据模版填充 `SceneConfig`、`AccountConfig`、`RTCConfig`、`VoiceChat` 中需要的参数。

Demo 中以 `Custom` 场景为例，您可以自行新增场景。

注意：
- `SceneConfig`：场景的信息，例如名称、头像等。
- `AccountConfig`：场景下的账号信息，https://console.volcengine.com/iam/keymanage/ 获取 AK/SK。
- `RTCConfig`：场景下的 RTC 配置。
    - AppId、AppKey 可从 https://console.volcengine.com/rtc/aigc/listRTC 中获取。
    - RoomId、UserId 可自定义也可不填，交由服务端生成。
- `VoiceChat`: 场景下的 AIGC 配置。
    - 可参考 https://www.volcengine.com/docs/6348/1558163 中参数描述，完整填写参数内容。
    - 可通过 [快速跑通 Demo](https://console.volcengine.com/rtc/aigc/run?s=g) 快速获取参数, 跑通后点击右上角 `接入 API` 按钮复制相关代码贴到 JSON 配置文件中即可。
## 快速开始
请注意，服务端和 Web 端都需要启动, 启动步骤如下:
### 服务端
进到项目根目录
#### 安装依赖
```shell
cd Server
yarn
```
#### 运行项目
```shell
yarn dev
```

### 前端页面
进到项目根目录
#### 安装依赖
```shell
yarn
```
#### 运行项目
```shell
yarn dev
```

### 常见问题
| 问题 | 解决方案 |
| :-- | :-- |
| 如何使用第三方模型、Coze Bot | 模型相关配置代码对应目录 `src/config/scenes/` 下json 文件，填写对应官方模型/ Coze/ 第三方模型的参数后，可点击页面上的 "修改 AI 人设" 进行切换。 |
| **启动智能体之后, 对话无反馈，或者一直停留在 "AI 准备中, 请稍侯"** | <li>可能因为控制台中相关权限没有正常授予，请参考[流程](https://www.volcengine.com/docs/6348/1315561?s=g)再次确认下是否完成相关操作。此问题的可能性较大，建议仔细对照是否已经将相应的权限开通。</li><li>参数传递可能有问题, 例如参数大小写、类型等问题，请再次确认下这类型问题是否存在。</li><li>相关资源可能未开通或者用量不足/欠费，请再次确认。</li><li>**请检查当前使用的模型 ID 等内容都是正确且可用的。**</li> |
| **浏览器报了 `Uncaught (in promise) r: token_error` 错误** | 请检查您填在项目中的 RTC Token 是否合法，检测用于生成 Token 的 UserId、RoomId 以及 Token 本身是否与项目中填写的一致；或者 Token 可能过期, 可尝试重新生成下。 |
| **[StartVoiceChat]Failed(Reason: The task has been started. Please do not call the startup task interface repeatedly.)** 报错 | 如果设置的 RoomId、UserId 为固定值，重复调用 startAgent 会导致出错，只需先调用 stopAgent 后再重新 startAgent 即可。 |
| 为什么我的麦克风正常、摄像头也正常，但是设备没有正常工作? | 可能是设备权限未授予，详情可参考 [Web 排查设备权限获取失败问题](https://www.volcengine.com/docs/6348/1356355?s=g)。 |
| 接口调用时, 返回 "Invalid 'Authorization' header, Pls check your authorization header" 错误 | `Server/app.js` 中的 AK/SK 不正确 |
| 什么是 RTC | **R**eal **T**ime **C**ommunication, RTC 的概念可参考[官网文档](https://www.volcengine.com/docs/6348/66812?s=g)。 |
| 不清楚什么是主账号，什么是子账号 | 可以参考[官方概念](https://www.volcengine.com/docs/6257/64963?hyperlink_open_type=lark.open_in_browser&s=g) 。|
| 我有自己的服务端了, 我应该怎么让前端调用我的服务端呢 | 修改 `src/config/index.ts` 中的 `AIGC_PROXY_HOST` 请求域名和接口并在 `src/app/api.ts` 中修改接口参数配置 `APIS_CONFIG` |

如果有上述以外的问题，欢迎联系我们反馈。

### 相关文档
- [场景介绍](https://www.volcengine.com/docs/6348/1310537?s=g)
- [Demo 体验](https://www.volcengine.com/docs/6348/1310559?s=g)
- [场景搭建方案](https://www.volcengine.com/docs/6348/1310560?s=g)

## 更新日志

### OpenAPI 更新
参考 [OpenAPI 更新](https://www.volcengine.com/docs/6348/1544162) 中与 实时对话式 AI 相关的更新内容。

### Demo 更新

#### [1.6.0]
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