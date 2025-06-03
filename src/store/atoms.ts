/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { SCENE, MODEL_MODE, VoiceName, AI_MODEL, DEFAULT_VOICE_CATEGORY, loadPromptFromFile } from '@/config/common';
import { PRESET_PERSONAS, getDefaultPersona, generatePersonaId, getVoiceByScene, getModelByScene, getDefaultPersonaManager } from '@/config/personas';
import { IPersona, IPersonaManager } from '@/types/persona';

// 人设管理 - 原子化状态
export const activePersonaIdAtom = atomWithStorage<string>('active-persona-id', PRESET_PERSONAS[0]!.id, undefined, {getOnInit: true});
export const customPersonasAtom = atomWithStorage<IPersona[]>('custom-personas', [], undefined, {getOnInit: true});
export const presetPersonasAtom = atomWithStorage<IPersona[]>('preset-personas', PRESET_PERSONAS, undefined, {getOnInit: true});

// 当前激活的人设（可读写 atom）
export const activePersonaAtom = atom(
  (get): IPersona => {
    const activePersonaId = get(activePersonaIdAtom);
    const presetPersonas = get(presetPersonasAtom);
    const customPersonas = get(customPersonasAtom);
    const allPersonas = [...presetPersonas, ...customPersonas];
    return allPersonas.find((p) => p.id === activePersonaId) || getDefaultPersona();
  },
  (get, set, newPersona: IPersona): void => {
    // 更新对应的人设
    const isPreset = newPersona.isPreset;
    
    if (isPreset) {
      // 更新预设人设
      const presetPersonas = get(presetPersonasAtom);
      const updatedPresetPersonas = presetPersonas.map((p) =>
        p.id === newPersona.id ? newPersona : p
      );
      set(presetPersonasAtom, updatedPresetPersonas);
    } else {
      // 更新自定义人设
      const customPersonas = get(customPersonasAtom);
      const updatedCustomPersonas = customPersonas.map((p) =>
        p.id === newPersona.id ? newPersona : p
      );
      set(customPersonasAtom, updatedCustomPersonas);
    }
  }
);

// Prompt atom - 简单返回当前人设的 prompt 字段
export const promptAtom = atom(
  (get): string => {
    const persona = get(activePersonaAtom);
    return persona.prompt;
  }
);

// 场景 atom（只读）
export const sceneAtom = atom(
  (get): SCENE => {
    const activePersona = get(activePersonaAtom);
    return activePersona.originalScene || SCENE.INTELLIGENT_ASSISTANT;
  }
);

// 自定义人设列表（衍生 atom）
export const customPersonasListAtom = atom(
  (get): IPersona[] => {
    const customPersonas = get(customPersonasAtom);
    return customPersonas;
  }
);

// 预设人设列表（衍生 atom）
export const presetPersonasListAtom = atom(
  (get): IPersona[] => {
    const presetPersonas = get(presetPersonasAtom);
    return presetPersonas;
  }
);

// 人设操作函数
export const usePersonaActions = () => {
  const [, setActivePersonaId] = useAtom(activePersonaIdAtom);
  const [, setCustomPersonas] = useAtom(customPersonasAtom);

  return {
    setActivePersona: (personaId: string): void => {
      setActivePersonaId(personaId);
    },

    createPersona: (personaData: Partial<IPersona>): void => {
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

      setCustomPersonas((prev) => [...prev, newPersona]);
      setActivePersonaId(newPersona.id);
    },

    updatePersona: (personaId: string, personaData: Partial<IPersona>): void => {
      setCustomPersonas((prev) =>
        prev.map((p) =>
          p.id === personaId
            ? {
                ...p,
                ...personaData,
                updatedAt: Date.now(),
              }
            : p
        )
      );
    },

    deletePersona: (personaId: string): void => {
      setCustomPersonas((prev) => prev.filter((p) => p.id !== personaId));
      setActivePersonaId((prevId) => 
        prevId === personaId ? PRESET_PERSONAS[0]!.id : prevId
      );
    },
  };
};

// AI 设置 UI 状态 atom（用于管理 UI 特定的状态）
export const aiSettingsUIAtom = atom({
  selectedVoiceCategory: DEFAULT_VOICE_CATEGORY,
  loading: false,
});

export const selectedVoiceCategoryAtom = atom(
  (get): string => get(aiSettingsUIAtom).selectedVoiceCategory,
  (get, set, newCategory: string): void => {
    set(aiSettingsUIAtom, { ...get(aiSettingsUIAtom), selectedVoiceCategory: newCategory });
  }
);

export const loadingAtom = atom(
  (get): boolean => get(aiSettingsUIAtom).loading,
  (get, set, newLoading: boolean): void => {
    set(aiSettingsUIAtom, { ...get(aiSettingsUIAtom), loading: newLoading });
  }
);

export const voiceAtom = atom(
  (get): VoiceName => get(activePersonaAtom).voice,
  (get, set, newVoice: VoiceName): void => {
    const currentPersona = get(activePersonaAtom);
    set(activePersonaAtom, { ...currentPersona, voice: newVoice });
  }
);

export const modelAtom = atom(
  (get): AI_MODEL => get(activePersonaAtom).model,
  (get, set, newModel: AI_MODEL): void => {
    const currentPersona = get(activePersonaAtom);
    set(activePersonaAtom, { ...currentPersona, model: newModel });
  }
);

export const modelModeAtom = atom(
  (get): MODEL_MODE => get(activePersonaAtom).extra?.modelMode || MODEL_MODE.ORIGINAL,
  (get, set, newModelMode: MODEL_MODE): void => {
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
