/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import {
  TTS_CLUSTER,
  ARK_V3_MODEL_ID,
  ModelSourceType,
  SCENE,
  Prompt,
  Welcome,
  Model,
  Voice,
  // LLM_BOT_ID,
  AI_MODEL,
  AI_MODE_MAP,
  AI_MODEL_MODE,
} from '.';

export const CONVERSATION_SIGNATURE = 'conversation';

/**
 * @brief RTC & AIGC 配置。
 * @notes 更多参数请参考
 *        https://www.volcengine.com/docs/6348/1404673?s=g
 */
export class ConfigFactory {
  BaseConfig = {
    /**
     * @note 必填, RTC AppId 可于 https://console.volcengine.com/rtc/listRTC?s=g 中获取。
     */
    AppId: 'Your RTC AppId',
    /**
     * @brief 非必填, 按需填充。
     */
    BusinessId: undefined,
    /**
     * @brief 必填, 房间 ID, 自定义即可，例如 "Room123"。
     */
    RoomId: 'Room123',
    /**
     * @brief 必填, 当前和 AI 对话的用户的 ID, 自定义即可，例如 "User123"。
     */
    UserId: 'User123',
    /**
     * @brief 必填, RTC Token, 由 AppId、RoomId、UserId、时间戳等等信息计算得出。
     *        测试跑通时，可于 https://console.volcengine.com/rtc/listRTC?s=g 列表中，
     *        找到对应 AppId 行中 "操作" 列的 "临时Token" 按钮点击进行生成, 用于本地 RTC 通信进房鉴权校验。
     *        正式使用时可参考 https://www.volcengine.com/docs/6348/70121?s=g 通过代码生成 Token。
     *        建议先使用临时 Token 尝试跑通。
     * @note 生成临时 Token 时, 页面上的 RoomId / UserId 填的与此处的 RoomId / UserId 保持一致。
     */
    Token: 'Your RTC Token',
    /**
     * @brief 必填, TTS(语音合成) AppId, 可于 https://console.volcengine.com/speech/app?s=g 中获取, 若无可先创建应用。
     * @note 创建应用时, 需要选择 "语音合成" 服务, 并选择对应的 App 进行绑定。
     */
    TTSAppId: 'Your TTS AppId',
    /**
     * @brief 已开通需要的语音合成服务的token。
     *        使用火山引擎双向流式语音合成服务时必填。  
     */
    TTSToken: undefined,
    /**
     * @brief 必填, ASR(语音识别) AppId, 可于 https://console.volcengine.com/speech/app?s=g 中获取, 若无可先创建应用。
     * @note 创建应用时, 需要按需根据语言选择 "流式语音识别" 服务, 并选择对应的 App 进行绑定。
     */
    ASRAppId: 'Your ASR AppId',
    /**
     * @brief 已开通流式语音识别大模型服务 AppId 对应的 Access Token。
     *        使用流式语音识别大模型服务时该参数为必填。  
     */
    ASRToken: undefined,
  };

  Model: AI_MODEL = Model[SCENE.INTELLIGENT_ASSISTANT];

  /**
   * @note 必填, 音色 ID, 可具体看定义。
   *       音色 ID 获取方式可查看 VOICE_TYPE 定义
   *       此处已有默认值, 不影响跑通, 可按需修改。
   */
  VoiceType = Voice[SCENE.INTELLIGENT_ASSISTANT];

  /**
   * @note 大模型 System 角色预设指令, 可用于控制模型输出, 类似 Prompt 的概念。
   */
  Prompt = Prompt[SCENE.INTELLIGENT_ASSISTANT];

  /**
   * @note 智能体启动后的欢迎词。
   */
  WelcomeSpeech = Welcome[SCENE.INTELLIGENT_ASSISTANT];

  ModeSourceType = ModelSourceType.Available;

  /**
   * @note 非必填, 第三方模型才需要使用, 用火山方舟模型时无需关注。
   */
  Url? = '';

  /**
   * @note 非必填, 第三方模型才需要使用, 用火山方舟模型时无需关注。
   */
  APIKey? = '';

  /**
   * @brief AI Robot 名
   * @default RobotMan_
   */
  BotName = 'RobotMan_';

  /**
   * @brief 是否为打断模式
   */
  InterruptMode = true;

  get LLMConfig() {
    const params: Record<string, unknown> = {
      Mode: AI_MODE_MAP[this.Model || ''] || AI_MODEL_MODE.CUSTOM,
      EndPointId: ARK_V3_MODEL_ID[this.Model],
      // BotId: LLM_BOT_ID[this.Model],
      MaxTokens: 1024,
      Temperature: 0.1,
      TopP: 0.3,
      SystemMessages: [this.Prompt as string],
      Prefill: true,
      ModelName: this.Model,
      ModelVersion: '1.0',
      WelcomeSpeech: this.WelcomeSpeech,
      ModeSourceType: this.ModeSourceType,
      APIKey: this.APIKey,
      Url: this.Url,
      Feature: JSON.stringify({ Http: true }),
    };
    if (this.Model === AI_MODEL.VISION) {
      params.VisionConfig = {
        Enable: true,
      };
    }
    return params;
  }

  get ASRConfig() {
    return {
      Provider: 'volcano',
      ProviderParams: {
        /**
         * @note 本示例代码使用的是小模型语音识别, 如感觉 ASR 效果不佳，可尝试使用大模型进行语音识别。
         *       大模型的使用详情可参考 https://www.volcengine.com/docs/6348/1404673#volcanolmasrconfig?s=g
         */
        Mode: 'smallmodel',
        AppId: this.BaseConfig.ASRAppId,
        ...(this.BaseConfig.ASRToken ? { AccessToken: this.BaseConfig.ASRToken } : {}),
        /**
         * @note 具体流式语音识别服务对应的 Cluster ID，可在流式语音服务控制台开通对应服务后查询。
         *       具体链接为: https://console.volcengine.com/speech/service/16?s=g
         */
        Cluster: 'volcengine_streaming_common',
      },
      VADConfig: {
        SilenceTime: 600,
        SilenceThreshold: 200,
      },
      VolumeGain: 0.3,
    };
  }

  get TTSConfig() {
    return {
      Provider: 'volcano',
      ProviderParams: {
        app: {
          AppId: this.BaseConfig.TTSAppId,
          ...(this.BaseConfig.TTSToken ? { Token: this.BaseConfig.TTSToken } : {}),
          Cluster: TTS_CLUSTER.TTS,
        },
        audio: {
          voice_type: this.VoiceType,
          speed_ratio: 1.0,
        },
      },
      IgnoreBracketText: [1, 2, 3, 4, 5],
    };
  }

  get aigcConfig() {
    return {
      Config: {
        LLMConfig: this.LLMConfig,
        TTSConfig: this.TTSConfig,
        ASRConfig: this.ASRConfig,
        InterruptMode: this.InterruptMode ? 0 : 1,
        SubtitleConfig: {
          SubtitleMode: 0,
        },
      },
      AgentConfig: {
        UserId: this.BotName,
        WelcomeMessage: this.WelcomeSpeech,
        EnableConversationStateCallback: true,
        ServerMessageSignatureForRTS: CONVERSATION_SIGNATURE,
      },
    };
  }
}
