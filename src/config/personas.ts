/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { IPersona } from '@/types/persona';
import {
  SCENE,
  Icon,
  Name,
  Voice,
  Model,
  Prompt,
  Welcome,
  AI_MODEL,
  VoiceTypeValues,
} from './common';

/**
 * 预设人设数据
 */
export const PRESET_PERSONAS: IPersona[] = [
  {
    id: 'preset_intelligent_assistant',
    name: Name[SCENE.INTELLIGENT_ASSISTANT],
    avatar: Icon[SCENE.INTELLIGENT_ASSISTANT],
    voice: Voice[SCENE.INTELLIGENT_ASSISTANT] as VoiceTypeValues,
    model: Model[SCENE.INTELLIGENT_ASSISTANT] as AI_MODEL,
    prompt: Prompt[SCENE.INTELLIGENT_ASSISTANT],
    welcome: Welcome[SCENE.INTELLIGENT_ASSISTANT],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '智能助手，专业的AI问答助手，能够回答各种问题并提供帮助',
    originalScene: SCENE.INTELLIGENT_ASSISTANT,
  },
  {
    id: 'preset_screen_reader',
    name: Name[SCENE.SCREEN_READER],
    avatar: Icon[SCENE.SCREEN_READER],
    voice: Voice[SCENE.SCREEN_READER] as VoiceTypeValues,
    model: Model[SCENE.SCREEN_READER] as AI_MODEL,
    prompt: Prompt[SCENE.SCREEN_READER],
    welcome: Welcome[SCENE.SCREEN_READER],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '读屏助手，帮助视障用户获取屏幕内容信息',
    originalScene: SCENE.SCREEN_READER,
  },
  {
    id: 'preset_virtual_girl_friend',
    name: Name[SCENE.VIRTUAL_GIRL_FRIEND],
    avatar: Icon[SCENE.VIRTUAL_GIRL_FRIEND],
    voice: Voice[SCENE.VIRTUAL_GIRL_FRIEND] as VoiceTypeValues,
    model: Model[SCENE.VIRTUAL_GIRL_FRIEND] as AI_MODEL,
    prompt: Prompt[SCENE.VIRTUAL_GIRL_FRIEND],
    welcome: Welcome[SCENE.VIRTUAL_GIRL_FRIEND],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '虚拟女友，温柔可爱的聊天伙伴',
    originalScene: SCENE.VIRTUAL_GIRL_FRIEND,
  },
  {
    id: 'preset_translate',
    name: Name[SCENE.TRANSLATE],
    avatar: Icon[SCENE.TRANSLATE],
    voice: Voice[SCENE.TRANSLATE] as VoiceTypeValues,
    model: Model[SCENE.TRANSLATE] as AI_MODEL,
    prompt: Prompt[SCENE.TRANSLATE],
    welcome: Welcome[SCENE.TRANSLATE],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '翻译助手，专业的多语言翻译服务',
    originalScene: SCENE.TRANSLATE,
  },
  {
    id: 'preset_children_encyclopedia',
    name: Name[SCENE.CHILDREN_ENCYCLOPEDIA],
    avatar: Icon[SCENE.CHILDREN_ENCYCLOPEDIA],
    voice: Voice[SCENE.CHILDREN_ENCYCLOPEDIA] as VoiceTypeValues,
    model: Model[SCENE.CHILDREN_ENCYCLOPEDIA] as AI_MODEL,
    prompt: Prompt[SCENE.CHILDREN_ENCYCLOPEDIA],
    welcome: Welcome[SCENE.CHILDREN_ENCYCLOPEDIA],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '儿童百科，专为儿童设计的知识问答助手',
    originalScene: SCENE.CHILDREN_ENCYCLOPEDIA,
  },
  {
    id: 'preset_customer_service',
    name: Name[SCENE.CUSTOMER_SERVICE],
    avatar: Icon[SCENE.CUSTOMER_SERVICE],
    voice: Voice[SCENE.CUSTOMER_SERVICE] as VoiceTypeValues,
    model: Model[SCENE.CUSTOMER_SERVICE] as AI_MODEL,
    prompt: Prompt[SCENE.CUSTOMER_SERVICE],
    welcome: Welcome[SCENE.CUSTOMER_SERVICE],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '客服助手，专业的客户服务支持',
    originalScene: SCENE.CUSTOMER_SERVICE,
  },
  {
    id: 'preset_teaching_assistant',
    name: Name[SCENE.TEACHING_ASSISTANT],
    avatar: Icon[SCENE.TEACHING_ASSISTANT],
    voice: Voice[SCENE.TEACHING_ASSISTANT] as VoiceTypeValues,
    model: Model[SCENE.TEACHING_ASSISTANT] as AI_MODEL,
    prompt: Prompt[SCENE.TEACHING_ASSISTANT],
    welcome: Welcome[SCENE.TEACHING_ASSISTANT],
    isPreset: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    description: '教学助手，专业的教育辅导助手',
    originalScene: SCENE.TEACHING_ASSISTANT,
  },
];

/**
 * 根据场景获取预设人设
 */
export const getPresetPersonaByScene = (scene: SCENE): IPersona | undefined => {
  return PRESET_PERSONAS.find((persona) => persona.originalScene === scene);
};

/**
 * 获取默认人设（智能助手）
 */
export const getDefaultPersona = (): IPersona => {
  return PRESET_PERSONAS[0]; // 智能助手作为默认人设
};

/**
 * 克隆人设（用于创建自定义人设）
 */
export const clonePersona = (sourcePersona: IPersona, newName?: string): Omit<IPersona, 'id'> => {
  const timestamp = Date.now();
  return {
    ...sourcePersona,
    name: newName || `${sourcePersona.name} (副本)`,
    isPreset: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    originalScene: undefined, // 自定义人设不关联原始场景
  };
};

/**
 * 生成人设ID
 */
export const generatePersonaId = (): string => {
  return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
