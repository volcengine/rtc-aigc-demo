# 交互式AIGC场景 AIGC Demo

## 简介
- 在 AIGC 对话场景下，火山引擎 AIGC-RTC Server 云端服务，通过整合 RTC 音视频流处理，ASR 语音识别，大模型接口调用集成，以及 TTS 语音生成等能力，提供基于流式语音的端到端AIGC能力链路。
- 用户只需调用基于标准的 OpenAPI 接口即可配置所需的 ASR、LLM、TTS 类型和参数。火山引擎云端计算服务负责边缘用户接入、云端资源调度、音视频流压缩、文本与语音转换处理以及数据订阅传输等环节。简化开发流程，让开发者更专注在对大模型核心能力的训练及调试，从而快速推进AIGC产品应用创新。     
- 同时火山引擎 RTC拥有成熟的音频 3A 处理、视频处理等技术以及大规模音视频聊天能力，可支持 AIGC 产品更便捷的支持多模态交互、多人互动等场景能力，保持交互的自然性和高效性。 

## 【必看】环境准备
- **Node 版本: 16.0+**
1. 需要准备两个 Terminal，分别启动服务端、前端页面。
2. 开通 ASR、TTS、LLM、RTC 等服务，可参考 [开通服务](https://www.volcengine.com/docs/6348/1315561?s=g) 进行相关服务的授权与开通。
3. **根据你自定义的 
RoomId、UserId 以及申请的 AppID、BusinessID(如有)、Token、ASR AppID、TTS AppID，修改 `src/config/config.ts` 文件中 `ConfigFactory` 中 `BaseConfig` 的配置信息**。
4. 使用火山引擎控制台账号的 [AK、SK](https://console.volcengine.com/iam/keymanage?s=g), 修改 `Server/app.js` 文件中的 `ACCOUNT_INFO`。
5. 若您使用的是官方模型, 需要在 [火山方舟-在线推理](https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint?config=%7B%7D&s=g) 中创建接入点, 并将模型对应的接入点 ID 填入 `src/config/common.ts` 文件中的 `ARK_V3_MODEL_ID`, 否则无法正常启动智能体。
6. 如果您已经自行完成了服务端的逻辑，可以不依赖 Demo 中的 Server，直接修改前端代码文件 `src/config/index.ts` 中的 `AIGC_PROXY_HOST` 请求域名和接口，并在 `src/app/api.ts` 中修改接口的参数配置 `APIS_CONFIG`。

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
node app.js
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
| 如何使用第三方模型、Coze Bot | 点击页面上的 "修改 AI 设定" 进入配置页，可切换 官方模型/Coze/第三方模型，填写对应参数即可，相关代码对应 `src/components/AISettings/index.tsx` 文件。 |
| **启动智能体之后, 对话无反馈，或者一直停留在 "AI 准备中, 请稍侯"** | <li>可能因为控制台中相关权限没有正常授予，请参考[流程](https://www.volcengine.com/docs/6348/1315561?s=g)再次确认下是否完成相关操作。此问题的可能性较大，建议仔细对照是否已经将相应的权限开通。</li><li>参数传递可能有问题, 例如参数大小写、类型等问题，请再次确认下这类型问题是否存在。</li><li>相关资源可能未开通或者用量不足/欠费，请再次确认。</li><li>**请检查当前使用的模型 ID 等内容都是正确且可用的。**</li> |
| **浏览器报了 `Uncaught (in promise) r: token_error` 错误** | 请检查您填在项目中的 RTC Token 是否合法，检测用于生成 Token 的 UserId、RoomId 以及 Token 本身是否与项目中填写的一致；或者 Token 可能过期, 可尝试重新生成下。 |
| **[StartVoiceChat]Failed(Reason: The task has been started. Please do not call the startup task interface repeatedly.)** 报错 | 由于目前设置的 RoomId、UserId 为固定值，重复调用 startAudioBot 会导致出错，只需先调用 stopAudioBot 后再重新 startAudioBot 即可。 |
| 为什么我的麦克风正常、摄像头也正常，但是设备没有正常工作? | 可能是设备权限未授予，详情可参考 [Web 排查设备权限获取失败问题](https://www.volcengine.com/docs/6348/1356355?s=g)。 |
| 接口调用时, 返回 "Invalid 'Authorization' header, Pls check your authorization header" 错误 | `Server/app.js` 中的 AK/SK 不正确 |
| 什么是 RTC | **R**eal **T**ime **C**ommunication, RTC 的概念可参考[官网文档](https://www.volcengine.com/docs/6348/66812?s=g)。 |
| 不清楚什么是主账号，什么是子账号 | 可以参考[官方概念](https://www.volcengine.com/docs/6257/64963?hyperlink_open_type=lark.open_in_browser&s=g) 。|

如果有上述以外的问题，欢迎联系我们反馈。

### 相关文档
- [场景介绍](https://www.volcengine.com/docs/6348/1310537?s=g)
- [Demo 体验](https://www.volcengine.com/docs/6348/1310559?s=g)
- [场景搭建方案](https://www.volcengine.com/docs/6348/1310560?s=g)

## 更新日志

### OpenAPI 更新
参考 [OpenAPI 更新](https://www.volcengine.com/docs/6348/1544162) 中与 实时对话式 AI 相关的更新内容。

### Demo 更新

#### [1.5.1]
- 2025-05-28
    - 更新 RTC Web SDK 版本至 4.66.14
- 2025-05-22
    - 更新 RTC Web SDK 版本至 4.66.13
    - 删除无用依赖
    - 更新 Readme 文档
- 2025-04-16
    - 支持 Coze Bot
    - 更新部分注释和文档内容
    - 删除子账号的 SessionToken 配置, 子账号调用无须 SessionToken
    - 修复通话前修改内容，在通话后配置消失的问题
- 2025-04-11
    - 移除无用代码和依赖
    - 修复字幕逻辑

#### [1.5.0]
- 2025-03-31
    - 修复部分 UI 问题
    - 追加屏幕共享能力 (视觉模型可用，**读屏助手** 人设下可使用)
    - 修改字幕逻辑，避免字幕回调中标点符号、大小写不一致引起的字幕重复问题
    - 更新 RTC Web SDK 版本至 4.66.1
    - 追加设备权限未授予时的提示