/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { IPersona } from '@/types/persona';
import { SCENE, AI_MODEL, VoiceName } from './common';
import allPersonasData from './all-personas-latest.json';

/**
 * 从JSON文件加载预设人设数据
 */
const loadPresetPersonas = (): IPersona[] => {
  return allPersonasData.map((personaData) => ({
    id: personaData.id,
    name: personaData.name,
    avatar: personaData.avatar,
    voice: personaData.voice as VoiceName,
    model: personaData.model as AI_MODEL,
    prompt: personaData.prompt,
    welcome: personaData.welcome,
    description: personaData.description,
    isPreset: personaData.isPreset,
    originalScene: personaData.originalScene ? SCENE[personaData.originalScene as keyof typeof SCENE] : undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
};

/**
 * 预设人设数据
 */
export const PRESET_PERSONAS: IPersona[] = loadPresetPersonas();

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
  return PRESET_PERSONAS.find((persona) => persona.originalScene === SCENE.INTELLIGENT_ASSISTANT) || PRESET_PERSONAS[0];
};

/**
 * 克隆人设（用于创建自定义人设）
 */
export const clonePersona = (sourcePersona: IPersona, newName?: string): Omit<IPersona, 'id'> => {
  return {
    ...sourcePersona,
    name: newName || `${sourcePersona.name} 副本`,
    isPreset: false,
    originalScene: undefined,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

/**
 * 生成人设ID
 */
export const generatePersonaId = (): string => {
  return `persona_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
