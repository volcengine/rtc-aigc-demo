# 🎤 AIGC 实时语音对话 - 工程优化版

> 基于火山引擎官方 RTC-AIGC Demo 的深度工程优化版本，专注架构重构、稳定性与开发体验全面提升

[![Fork from](https://img.shields.io/badge/Fork%20from-volcengine%2Frtc--aigc--demo-blue.svg)](https://github.com/volcengine/rtc-aigc-demo)
[![Version](https://img.shields.io/badge/Version-1.6.1-green.svg)](package.json)

## 🚀 核心优化成果

### 🏗️ 架构重构与现代化
- **状态管理重构**: 引入 Jotai 原子化状态管理，替代传统 Redux (`4fed42e`)
- **配置系统重构**: 全面重构配置架构，支持更灵活的人格和语音配置 (`63a8a03`, `8b95747`)
- **UI 框架升级**: 集成 TailwindCSS，现代化样式解决方案 (`5dc77ba`)
- **组件化改进**: 重构核心组件，提升代码可维护性和复用性

### 🎨 用户界面与体验
- **全新 AI 设置界面**: 重新设计 AI 配置界面，提升用户交互体验 (`a4f4108`, `faee334`)
- **人格系统优化**: 支持特定数值配置的人格系统，更精准的 AI 角色定制 (`6361814`, `b0260fe`)
- **语音分类支持**: 实现语音类别管理，更好的语音选择体验 (`e7f762d`, `342d83e`)
- **导航体验改进**: 优化页面布局和导航逻辑 (`715d358`, `7264227`)

### 🛠️ 稳定性与错误处理
- **连接稳定性**: 修复语音回连、RTC 客户端稳定性和房间断开逻辑 (`900ea28`, `f8d0bcc`)
- **错误处理增强**: 完善语音错误处理、环境变量验证和配置管理 (`810ab9a`, `57d8871`)
- **日志系统**: 添加服务端和客户端详细日志追踪 (`591f10c`, `c2776df`)

### 🔧 开发体验提升  
- **环境配置优化**: 改进环境变量管理和用户引导 (`88595a3`, `62871c2`)
- **包管理优化**: 更好的依赖管理和构建配置 (`6d0a023`, `9f4bed6`)
- **全语音支持**: 扩展支持所有可用语音类型 (`54523fd`)

### 🌉 扩展功能
- **TouchDesigner 集成**: WebSocket 桥接支持，实现实时可视化数据传输 (`28f1383`)
- **后端路由优化**: 改进服务端路由和 API 设计 (`62efcb7`, `71986fb`)

## 核心参考

- [方案集成（软件应用)--实时音视频-火山引擎](https://www.volcengine.com/docs/6348/1310560)
- [火山引擎 RTC 实时对话式 AI 体验 Demo ——— 支持 DeepSeek 和 豆包视觉理解模型](https://demo.volcvideo.com/aigc/login?from=doc)
-  [字节跳动Seed](https://seed.bytedance.com/zh/blog/%E8%80%B3%E6%9C%B5%E6%B2%A1%E9%94%99-%E6%98%AF%E5%A3%B0%E9%9F%B3%E5%A4%AA%E7%9C%9F%E4%BA%86-%E5%AD%97%E8%8A%82%E8%B1%86%E5%8C%85%E8%AF%AD%E9%9F%B3%E5%90%88%E6%88%90%E6%88%90%E6%9E%9Cseed-tts%E6%8A%80%E6%9C%AF%E6%8F%AD%E7%A7%98)
- [Seed-TTS](https://bytedancespeech.github.io/seedtts_tech_report/)


## 简介
- 在 AIGC 对话场景下，火山引擎 AIGC-RTC Server 云端服务，通过整合 RTC 音视频流处理，ASR 语音识别，大模型接口调用集成，以及 TTS 语音生成等能力，提供基于流式语音的端到端AIGC能力链路。
- 用户只需调用基于标准的 OpenAPI 接口即可配置所需的 ASR、LLM、TTS 类型和参数。火山引擎云端计算服务负责边缘用户接入、云端资源调度、音视频流压缩、文本与语音转换处理以及数据订阅传输等环节。简化开发流程，让开发者更专注在对大模型核心能力的训练及调试，从而快速推进AIGC产品应用创新。     
- 同时火山引擎 RTC拥有成熟的音频 3A 处理、视频处理等技术以及大规模音视频聊天能力，可支持 AIGC 产品更便捷的支持多模态交互、多人互动等场景能力，保持交互的自然性和高效性。 

## 🚀 快速配置指南

### 第一步：环境变量配置

#### 📋 配置清单
在开始之前，请确保您已经准备好以下配置信息：

| 配置项 | 获取地址 | 说明 |
|--------|----------|------|
| **火山引擎 AK/SK** | [访问控制-密钥管理](https://console.volcengine.com/iam/keymanage/) | 用于API身份验证 |
| **RTC应用配置** | [RTC-AIGC控制台](https://console.volcengine.com/rtc/aigc/listRTC) | RTC应用ID、密钥、Token等 |
| **语音服务配置** | [语音技术-应用管理](https://console.volcengine.com/speech/app) | TTS/ASR应用ID和访问令牌 |
| **大模型接入点** | [火山方舟-在线推理](https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint) | 豆包模型接入点ID |

#### 🔧 配置步骤

**1. 复制环境变量模板**
```bash
# 前端配置
cp .env.example .env

# 后端配置  
cp Server/.env.example Server/.env
```

**2. 填写前端环境变量 (`.env`)**
```bash
# 🎥 RTC配置 (必填)
REACT_APP_DOUBAO_RTC_APP_ID=您的RTC应用ID
REACT_APP_DOUBAO_RTC_APP_KEY=您的RTC应用密钥  
REACT_APP_DOUBAO_RTC_TOKEN=您的RTC访问令牌
REACT_APP_DOUBAO_RTC_ROOM_ID=Room123  # 可自定义
REACT_APP_DOUBAO_RTC_USER_ID=User123  # 可自定义
REACT_APP_DOUBAO_RTC_TASK_ID=ChatTask01  # 可自定义

# 🔊 语音服务配置 (必填)
REACT_APP_DOUBAO_TTS_APP_ID=您的TTS应用ID
REACT_APP_DOUBAO_TTS_APP_ACCESS_TOKEN=您的TTS访问令牌
REACT_APP_DOUBAO_ASR_APP_ID=您的ASR应用ID  
REACT_APP_DOUBAO_ASR_APP_ACCESS_TOKEN=您的ASR访问令牌
```

**3. 填写后端环境变量 (`Server/.env`)**
```bash
# 火山引擎密钥 (必填)
DOUBAO_AK=您的Access_Key_ID
DOUBAO_SK=您的Secret_Access_Key
```

**4. 大模型配置**
如果使用官方模型，需要在 `src/config/common.ts` 中配置：
```typescript
// 填写您的大模型接入点ID
export const ARK_V3_MODEL_ID = 'ep-20250602151409-vg5w4';
```

### 第二步：服务开通确认

请确保已开通以下服务：
- ✅ **实时音视频 RTC** - [开通指南](https://www.volcengine.com/docs/6348/1315561)
- ✅ **语音技术 ASR/TTS** - [开通指南](https://www.volcengine.com/docs/6561) 
- ✅ **豆包大模型** - [开通指南](https://www.volcengine.com/docs/82379)

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

### 🔥 一键启动脚本 (推荐)
```bash
# 在项目根目录执行
npm run start:all
```

### 手动启动
#### 服务端
进到项目根目录
**安装依赖**
```shell
cd Server
yarn
```
**运行项目**
```shell
node app.js
```

#### 前端页面
进到项目根目录
**安装依赖**
```shell
yarn
```
**运行项目**
```shell
yarn dev
```

## 🔍 配置验证

启动成功后，请检查：

1. **后端服务状态**
   - 控制台输出 `Server is running on port 50602`
   - 访问 `http://localhost:50602/health` 返回正常

2. **前端页面状态**  
   - 访问 `http://localhost:3000` 页面正常加载
   - 浏览器控制台无报错信息

3. **功能测试**
   - 麦克风权限正常获取
   - 点击开始对话，AI状态变为"准备就绪"
   - 语音对话功能正常

## 常见问题
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
参考 [OpenAPI 更新](https://www.volcengine.com/docs/6348/116363?s=g) 中与 实时对话式 AI 相关的更新内容。

### Demo 更新

#### [1.6.0]
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

#### [1.5.1]
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