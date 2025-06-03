/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SCENE, MODEL_MODE, VoiceName, AI_MODEL, DEFAULT_VOICE_CATEGORY } from '@/config/common';
import { PRESET_PERSONAS, getDefaultPersona, generatePersonaId, getVoiceByScene, getModelByScene, getDefaultPersonaManager } from '@/config/personas';
import { IPersona, IPersonaManager } from '@/types/persona';

// AI设置的状态管理
export interface AISettingsState {
  scene: SCENE;
  modelMode: MODEL_MODE;
  prompt: string;
  welcome: string;
  voice: VoiceName;
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
  voice: getVoiceByScene(SCENE.INTELLIGENT_ASSISTANT),
  model: getModelByScene(SCENE.INTELLIGENT_ASSISTANT),
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
      voice: getVoiceByScene(newScene),
      model: getModelByScene(newScene),
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
  (get, set, newVoice: VoiceName) => {
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

// 人设管理状态
export const personaManagerAtom = atomWithStorage<IPersonaManager>(
  'persona-manager-v4', // 更新版本强制刷新缓存
  getDefaultPersonaManager()
);

// 当前激活的人设（衍生 atom）
export const activePersonaAtom = atom((get) => {
  const manager = get(personaManagerAtom);
  const allPersonas = [...manager.presetPersonas, ...manager.customPersonas];
  return (
    allPersonas.find((p) => p.id === manager.activePersonaId) || getDefaultPersona()
  );
});

// 自定义人设列表（衍生 atom）
export const customPersonasAtom = atom((get) => {
  const manager = get(personaManagerAtom);
  return manager.customPersonas;
});

// 预设人设列表（衍生 atom）
export const presetPersonasAtom = atom((get) => {
  const manager = get(personaManagerAtom);
  return manager.presetPersonas;
});

// 人设操作函数
export const usePersonaActions = () => {
  const [, setPersonaManager] = useAtom(personaManagerAtom);

  return {
    setActivePersona: (personaId: string) => {
      setPersonaManager((prev) => ({
        ...prev,
        activePersonaId: personaId,
      }));
    },

    createPersona: (personaData: Partial<IPersona>) => {
      const defaultVoice = getVoiceByScene(SCENE.INTELLIGENT_ASSISTANT) as VoiceName;
      const defaultModel = getModelByScene(SCENE.INTELLIGENT_ASSISTANT) as AI_MODEL;
      
      const newPersona: IPersona = {
        id: generatePersonaId(),
        name: personaData.name || '新人设',
        avatar: personaData.avatar || '🤖',
        prompt: personaData.prompt || '',
        welcome: personaData.welcome || '',
        voice: (personaData.voice as VoiceName) || defaultVoice,
        model: (personaData.model as AI_MODEL) || defaultModel,
        originalScene: personaData.originalScene,
        isPreset: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setPersonaManager((prev) => {
        const newCustomPersonas = [...prev.customPersonas, newPersona];
        return {
          ...prev,
          customPersonas: newCustomPersonas,
          activePersonaId: newPersona.id,
        };
      });
    },

    updatePersona: (personaId: string, personaData: Partial<IPersona>) => {
      setPersonaManager((prev) => {
        const newCustomPersonas = prev.customPersonas.map((p) =>
          p.id === personaId ? { ...p, ...personaData, updatedAt: Date.now() } : p
        );
        
        return {
          ...prev,
          customPersonas: newCustomPersonas,
        };
      });
    },

    deletePersona: (personaId: string) => {
      setPersonaManager((prev) => {
        const newCustomPersonas = prev.customPersonas.filter((p) => p.id !== personaId);
        const newActivePersonaId = 
          prev.activePersonaId === personaId
            ? PRESET_PERSONAS[0].id
            : prev.activePersonaId;

        return {
          ...prev,
          customPersonas: newCustomPersonas,
          activePersonaId: newActivePersonaId,
        };
      });
    },
  };
};

// AI 设置 UI 状态 atom（用于管理 UI 特定的状态）
export const aiSettingsUIAtom = atom({
  selectedVoiceCategory: DEFAULT_VOICE_CATEGORY,
  loading: false,
});

export const selectedVoiceCategoryAtom = atom(
  (get) => get(aiSettingsUIAtom).selectedVoiceCategory,
  (get, set, newCategory: string) => {
    set(aiSettingsUIAtom, { ...get(aiSettingsUIAtom), selectedVoiceCategory: newCategory });
  }
);

export const loadingAtom = atom(
  (get) => get(aiSettingsUIAtom).loading,
  (get, set, newLoading: boolean) => {
    set(aiSettingsUIAtom, { ...get(aiSettingsUIAtom), loading: newLoading });
  }
);
