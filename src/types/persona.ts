/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { VoiceName, AI_MODEL, SCENE, MODEL_MODE } from '@/config/common';

export interface IPersona {
  id: string;
  name: string;
  avatar: string;
  voice: VoiceName;
  model: AI_MODEL;
  prompt: string;
  welcome: string;
  isPreset: boolean;
  createdAt: number;
  updatedAt: number;
  description?: string;
  originalScene?: SCENE;
  questions?: string[];

  extra?: {
    url?: string;
    apiKey?: string;
    modelName?: string;
    modelMode?: MODEL_MODE;
    botId?: string;
    encoding?: string;
    rate?: number
    bitRate?: number;
    speedRatio?: number;
    loudnessRatio?: number
    silenceDuration?:number
    explicitLanguage?:number
    contextLanguage?:number
    enableEmotion?:boolean
    emotion?: string;
    emotionScale?: number
    advanced?: {
      withTimestamp?:boolean
      disableMarkdownFilter?: boolean
      enableLatexTn?:boolean
      enableCache?:boolean
    }
  }
}

export interface IPersonaManager {
  presetPersonas: IPersona[];
  customPersonas: IPersona[];
  activePersonaId: string;
}

 