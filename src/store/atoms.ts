/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SCENE, MODEL_MODE, VoiceTypeValues, AI_MODEL, Voice, Model } from '@/config';

// AI设置的状态管理
export interface AISettingsState {
  scene: SCENE;
  modelMode: MODEL_MODE;
  prompt: string;
  welcome: string;
  voice: VoiceTypeValues;
  model: AI_MODEL;
  Url: string;
  APIKey: string;
  customModelName: string;
  BotID: string;
  encoding: string;
  speedRatio: number;
  rate: number;
  bitrate: number;
  loudnessRatio: number;
  emotion: string;
  enableEmotion: boolean;
  emotionScale: number;
  explicitLanguage: string;
  contextLanguage: string;
  withTimestamp: boolean;
  disableMarkdownFilter: boolean;
  enableLatexTn: boolean;
  silenceDuration: number;
  enableCache: boolean;
}

// 使用 atomWithStorage 实现持久化
export const aiSettingsAtom = atomWithStorage<AISettingsState>('ai-settings', {
  scene: SCENE.INTELLIGENT_ASSISTANT,
  modelMode: MODEL_MODE.ORIGINAL,
  prompt: '',
  welcome: '',
  voice: Voice[SCENE.INTELLIGENT_ASSISTANT],
  model: Model[SCENE.INTELLIGENT_ASSISTANT],
  Url: '',
  APIKey: '',
  customModelName: '',
  BotID: '',
  encoding: 'mp3',
  speedRatio: 1.0,
  rate: 24000,
  bitrate: 160,
  loudnessRatio: 1.0,
  emotion: '',
  enableEmotion: false,
  emotionScale: 4,
  explicitLanguage: '',
  contextLanguage: '',
  withTimestamp: false,
  disableMarkdownFilter: false,
  enableLatexTn: false,
  silenceDuration: 0,
  enableCache: false,
});

// 衍生的 atoms，用于监听特定字段的变化
export const sceneAtom = atom(
  (get) => get(aiSettingsAtom).scene,
  (get, set, newScene: SCENE) => {
    const currentSettings = get(aiSettingsAtom);
    set(aiSettingsAtom, {
      ...currentSettings,
      scene: newScene,
      voice: Voice[newScene],
      model: Model[newScene],
    });
  }
);

export const modelModeAtom = atom(
  (get) => get(aiSettingsAtom).modelMode,
  (get, set, newModelMode: MODEL_MODE) => {
    set(aiSettingsAtom, { ...get(aiSettingsAtom), modelMode: newModelMode });
  }
);

export const voiceAtom = atom(
  (get) => get(aiSettingsAtom).voice,
  (get, set, newVoice: VoiceTypeValues) => {
    set(aiSettingsAtom, { ...get(aiSettingsAtom), voice: newVoice });
  }
);

export const modelAtom = atom(
  (get) => get(aiSettingsAtom).model,
  (get, set, newModel: AI_MODEL) => {
    set(aiSettingsAtom, { ...get(aiSettingsAtom), model: newModel });
  }
);

// AvatarCard 需要的配置信息 atom
export const avatarConfigAtom = atom((get) => {
  const settings = get(aiSettingsAtom);
  return {
    scene: settings.scene,
    voice: settings.voice,
    model: settings.model,
    modelMode: settings.modelMode,
    customModelName: settings.customModelName,
  };
});
