/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import presetVoices from './preset-voices.json';

const VOICE_TYPE_GENERAL_FEMALE = 'BV001_streaming' ;
const VOICE_TYPE_GENERAL_MALE = 'BV002_streaming' ;

const allVoicesData = [
  {
    "instance_number": "",
    "is_shareable": false,
    "resource_id": "",
    "code": VOICE_TYPE_GENERAL_FEMALE,
    "configuration_code": "Timbre-Free",
    "resource_display": "通用女声",
    "raw_type": "",
    "type": "",
    "purchased_amount": "",
    "current_usage": "",
    "expires": "-",
    "details": {
      "demo_link": "",
      "language": "中文",
      "recommended_scenario": "通用场景",
      "tone_number": "zh_female_wanqudashu_moon_bigtts",
      "voice_type": VOICE_TYPE_GENERAL_FEMALE
    },
    "group_name": "",
    "alias": "",
    "train_id": "",
    "state": ""
  },
  {
    "instance_number": "",
    "is_shareable": false,
    "resource_id": VOICE_TYPE_GENERAL_MALE,
    "code": "BV001_streaming",
    "configuration_code": "Timbre-Free",
    "resource_display": "通用男声",
    "raw_type": "",
    "type": "",
    "purchased_amount": "",
    "current_usage": "",
    "expires": "-",
    "details": {
      "demo_link": "",
      "language": "中文",
      "recommended_scenario": "通用场景",
      "tone_number": "zh_male_wanqudashu_moon_bigtts",
      "voice_type": VOICE_TYPE_GENERAL_MALE
    },
    "group_name": "",
    "alias": "",
    "train_id": "",
    "state": ""
  },
  ...presetVoices
].filter(voice => voice != null) as typeof presetVoices

export const voiceTypes = allVoicesData.filter(voice => voice.details?.voice_type).map((voice) => voice.details.voice_type);
export type VoiceType = (typeof voiceTypes)[number];

export const voiceNames = allVoicesData.filter(voice => voice?.resource_display).map((voice) => voice.resource_display);
export type VoiceName = (typeof voiceNames)[number];

export const getVoiceName = (voiceType: VoiceType) => {
  const voice = allVoicesData.find((voice) => voice && voice.details?.voice_type === voiceType);
  return voice?.resource_display || '';
}


export enum MODEL_MODE {
  ORIGINAL = 'original',
  VENDOR = 'vendor',
  COZE = 'coze',
}

/**
 * @brief AI 音色可选值
 * @default 通用女声
 * @notes 通用女声、通用男声为默认音色, 其它皆为付费音色。
 *        音色 ID 可于 https://console.volcengine.com/speech/service/8?s=g 中开通获取。
 *        对应 "音色详情" 中, "Voice_type" 列的值。
 */




// 按场景分组的音色映射
export const VOICE_BY_SCENARIO = allVoicesData.reduce((acc, voice) => {
  // 跳过 null/undefined 或没有details的音色
  if (!voice || !voice.details?.recommended_scenario) {
    return acc;
  }
  
  const scenario = voice.details.recommended_scenario;
  if (!acc[scenario]) {
    acc[scenario] = [];
  }
  acc[scenario].push({
    name: voice.resource_display,
    value: voice.details.voice_type,
    language: voice.details.language,
    demoUrl: voice.details.demo_link,
    icon: null, // 可以后续添加图标
  });
  return acc;
}, {} as Record<string, Array<{
  name: string;
  value: string;
  language: string;
  demoUrl: string;
  icon: any;
}>>);

// 获取所有音色类别
export const VOICE_CATEGORIES = Object.keys(VOICE_BY_SCENARIO);

// 默认音色类别
export const DEFAULT_VOICE_CATEGORY = '通用场景';

// 获取指定类别下的音色列表
export const getVoicesByCategory = (category: string) => {
  return VOICE_BY_SCENARIO[category] || [];
};

/**
 * @brief TTS 的 Cluster
 */
export enum TTS_CLUSTER {
  TTS = 'volcano_tts',
  MEGA = 'volcano_mega',
  ICL = 'volcano_icl',
}

/**
 * @brief 模型可选值
 * @default SKYLARK_LITE_PUBLIC
 */
export enum AI_MODEL {
  DOUBAO_LITE_4K = 'doubao-lite-4k',
  DOUBAO_PRO_4K = 'doubao-pro-4k',
  DOUBAO_PRO_32K = 'doubao-pro-32k',
  DOUBAO_PRO_128K = 'doubao-pro-128k',
  VISION = 'vision',
  ARK_BOT = 'ark-bot',
}

/**
 * @brief 模型来源
 */
export enum AI_MODEL_MODE {
  CUSTOM = 'CustomLLM',
  ARK_V3 = 'ArkV3',
}

/**
 * @brief 各模型对应的模式
 */
export const AI_MODE_MAP: Partial<Record<AI_MODEL, AI_MODEL_MODE>> = {
  [AI_MODEL.DOUBAO_LITE_4K]: AI_MODEL_MODE.ARK_V3,
  [AI_MODEL.DOUBAO_PRO_4K]: AI_MODEL_MODE.ARK_V3,
  [AI_MODEL.DOUBAO_PRO_32K]: AI_MODEL_MODE.ARK_V3,
  [AI_MODEL.DOUBAO_PRO_128K]: AI_MODEL_MODE.ARK_V3,
  [AI_MODEL.VISION]: AI_MODEL_MODE.ARK_V3,
  [AI_MODEL.ARK_BOT]: AI_MODEL_MODE.ARK_V3,
};

/**
 * @brief 方舟模型的 ID
 * @note 具体的模型 ID 请至 https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint?config=%7B%7D&s=g 参看/创建
 *       模型 ID 即接入点 ID, 在上述链接中表格内 "接入点名称" 列中, 类似于 "ep-2024xxxxxx-xxx" 格式即是模型 ID。
 */
export const ARK_V3_MODEL_ID: Partial<Record<AI_MODEL, string>> = {
  [AI_MODEL.DOUBAO_LITE_4K]: 'ep-20250602150324-wxxsm',
  [AI_MODEL.DOUBAO_PRO_4K]: 'Doubao-1.5-pro-4k',
  [AI_MODEL.DOUBAO_PRO_32K]: 'ep-20250603100251-97d6n',
  [AI_MODEL.DOUBAO_PRO_128K]: 'ep-20250603102226-lbgst',
  [AI_MODEL.VISION]: 'Doubao-1.5-vision-lite',
  // ... 可根据所开通的模型进行扩充
};

/**
 * @brief 方舟智能体 BotID
 * @note 具体的智能体 ID 请至 https://console.volcengine.com/ark/region:ark+cn-beijing/assistant?s=g 参看/创建
 *       Bot ID 即页面上的应用 ID, 类似于 "bot-2025xxxxxx-xxx" 格式即是应用 ID。
 */
export const LLM_BOT_ID: Partial<Record<AI_MODEL, string>> = {
  [AI_MODEL.ARK_BOT]: 'bot-20250602150446-n4459',
  // ... 可根据所开通的模型进行扩充
};

export enum SCENE {
  INTELLIGENT_ASSISTANT = 'INTELLIGENT_ASSISTANT',
  VIRTUAL_GIRL_FRIEND = 'VIRTUAL_GIRL_FRIEND',
  TRANSLATE = 'TRANSLATE',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  CHILDREN_ENCYCLOPEDIA = 'CHILDREN_ENCYCLOPEDIA',
  TEACHING_ASSISTANT = 'TEACHING_ASSISTANT',
  SCREEN_READER = 'SCREEN_READER',
  CUSTOM = 'CUSTOM',
}

export const isVisionMode = (model?: AI_MODEL) => model?.startsWith('Vision');

/**
 * Prompt 缓存
 */
const promptCache: Record<string, string> = {};

/**
 * 异步读取 Prompt 文件内容
 */
export const loadPromptFromFile = async (path: string): Promise<string> => {
  if (promptCache[path]) {
    return promptCache[path];
  }

  if(!path.startsWith("prompt://")) {
    return path;
  }
  
  try {
    const response = await fetch(`/prompts/${path.split('prompt://')[1]}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    promptCache[path] = content;
    return content;
  } catch (error) {
    console.warn(`Failed to load prompt file: ${path}`, error);
    return '';
  }
};
