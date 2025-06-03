/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { IPersona } from '@/types/persona';
import { SCENE, AI_MODEL, VoiceName } from './common';
import allPersonasData from './preset-personas.json';

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
    originalScene: personaData.originalScene
      ? SCENE[personaData.originalScene as keyof typeof SCENE]
      : undefined,
    questions: personaData.questions,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }));
};

/**
 * 预设人设数据
 */
export const PRESET_PERSONAS = loadPresetPersonas();

/**
 * 获取默认的人设管理器配置
 */
export const getDefaultPersonaManager = () => ({
  activePersonaId: PRESET_PERSONAS[0]?.id || 'preset_intelligent_assistant',
  customPersonas: [],
  presetPersonas: PRESET_PERSONAS,
});

/**
 * 根据场景获取预设人设
 */
export const getPresetPersonaByScene = (scene: SCENE): IPersona | null => {
  return PRESET_PERSONAS.find((persona) => persona.originalScene === scene) || null;
};

/**
 * 根据场景获取 questions
 */
export const getQuestionsByScene = (scene: SCENE): string[] => {
  const persona = getPresetPersonaByScene(scene);
  return persona?.questions || [];
};

/**
 * 获取默认人设（智能助手）
 */
export const getDefaultPersona = (): IPersona => {
  return (
    PRESET_PERSONAS.find((persona) => persona.originalScene === SCENE.INTELLIGENT_ASSISTANT) ||
    PRESET_PERSONAS[0]
  );
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

/**
 * 获取需要屏幕共享的场景列表
 */
export const getScreenShareScenes = (): SCENE[] => {
  return PRESET_PERSONAS
    .filter(persona => persona.originalScene === 'SCREEN_READER')
    .map(persona => persona.originalScene as SCENE);
};

/**
 * 根据场景获取图标
 */
export const getIconByScene = (scene: SCENE): string => {
  const persona = getPresetPersonaByScene(scene);
  return persona?.avatar || '🤖';
};

/**
 * 根据场景获取欢迎词
 */
export const getWelcomeByScene = (scene: SCENE): string => {
  const persona = getPresetPersonaByScene(scene);
  return persona?.welcome || '';
};

/**
 * 根据场景获取默认模型
 */
export const getModelByScene = (scene: SCENE): AI_MODEL => {
  const persona = getPresetPersonaByScene(scene);
  return persona?.model as AI_MODEL || AI_MODEL.DOUBAO_PRO_32K;
};

/**
 * 根据场景获取默认音色
 */
export const getVoiceByScene = (scene: SCENE): VoiceName => {
  const persona = getPresetPersonaByScene(scene);
  return persona?.voice as VoiceName || 'BV001_streaming';
};

/**
 * 根据场景获取 Prompt（这个暂时保留，因为需要异步加载）
 */
export const getPromptByScene = (scene: SCENE): string => {
  // 这个函数暂时返回空，实际的 prompt 加载逻辑在 common.ts 中
  return '';
};
