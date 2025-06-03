/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { VoiceName, AI_MODEL, SCENE } from '@/config/common';

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
}

export interface IPersonaManager {
  presetPersonas: IPersona[];
  customPersonas: IPersona[];
  activePersonaId: string;
}

 