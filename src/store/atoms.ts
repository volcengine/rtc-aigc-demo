/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SCENE, MODEL_MODE, VoiceName, AI_MODEL, DEFAULT_VOICE_CATEGORY, loadPromptFromFile } from '@/config/common';
import { PRESET_PERSONAS, getDefaultPersona, generatePersonaId, getVoiceByScene, getModelByScene, getDefaultPersonaManager } from '@/config/personas';
import { IPersona, IPersonaManager } from '@/types/persona';

// 人设管理状态
export const personaManagerAtom = atomWithStorage<IPersonaManager>(
  'persona-manager-v14', // 更新版本强制刷新缓存
  getDefaultPersonaManager()
);

// 当前激活的人设（可读写 atom）
export const activePersonaAtom = atom(
  (get) => {
    const manager = get(personaManagerAtom);
    const allPersonas = [...manager.presetPersonas, ...manager.customPersonas];
    return allPersonas.find((p) => p.id === manager.activePersonaId) || getDefaultPersona();
  },
  (get, set, newPersona: IPersona) => {
    // 更新人设管理器中的对应人设
    const manager = get(personaManagerAtom);
    const isPreset = newPersona.isPreset;
    
    if (isPreset) {
      // 更新预设人设
      const updatedPresetPersonas = manager.presetPersonas.map((p) =>
        p.id === newPersona.id ? newPersona : p
      );
      set(personaManagerAtom, {
        ...manager,
        presetPersonas: updatedPresetPersonas,
      });
    } else {
      // 更新自定义人设
      const updatedCustomPersonas = manager.customPersonas.map((p) =>
        p.id === newPersona.id ? newPersona : p
      );
      set(personaManagerAtom, {
        ...manager,
        customPersonas: updatedCustomPersonas,
      });
    }
  }
);

// Prompt atom - 简单返回当前人设的 prompt 字段
export const promptAtom = atom((get) => {
  const persona = get(activePersonaAtom);
  return persona.prompt;
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
          p.id === personaId
            ? {
                ...p,
                ...personaData,
                updatedAt: Date.now(),
              }
            : p
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
        const newActivePersonaId = prev.activePersonaId === personaId ? PRESET_PERSONAS[0].id : prev.activePersonaId;

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

export const voiceAtom = atom(
  (get) => get(activePersonaAtom).voice,
  (get, set, newVoice: VoiceName) => {
    const currentPersona = get(activePersonaAtom);
    set(activePersonaAtom, { ...currentPersona, voice: newVoice });
  }
);

export const modelAtom = atom(
  (get) => get(activePersonaAtom).model,
  (get, set, newModel: AI_MODEL) => {
    const currentPersona = get(activePersonaAtom);
    set(activePersonaAtom, { ...currentPersona, model: newModel });
  }
);

export const modelModeAtom = atom(
  (get) => get(activePersonaAtom).extra?.modelMode || MODEL_MODE.ORIGINAL,
  (get, set, newModelMode: MODEL_MODE) => {
    const currentPersona = get(activePersonaAtom);
    set(activePersonaAtom, { 
      ...currentPersona, 
      extra: { 
        ...currentPersona.extra, 
        modelMode: newModelMode 
      } 
    });
  }
);
