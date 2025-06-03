/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { AI_MODEL, VoiceNames, SCENE } from '@/config';

/**
 * 人设类型定义
 */
export interface IPersona {
  /** 人设唯一标识 */
  id: string;
  /** 人设名称 */
  name: string;
  /** 人设头像 */
  avatar: string;
  /** 人设音色 */
  voice: VoiceNames;
  /** 人设模型 */
  model: AI_MODEL;
  /** 人设提示词 */
  prompt: string;
  /** 欢迎语 */
  welcome: string;
  /** 是否为预设人设 */
  isPreset: boolean;
  /** 创建时间 */
  createdAt: number;
  /** 更新时间 */
  updatedAt: number;
  /** 人设描述 */
  description?: string;
  /** 原始场景（用于预设人设） */
  originalScene?: SCENE;
}

/**
 * 人设管理相关类型
 */
export interface IPersonaManager {
  /** 当前选中的人设ID */
  activePersonaId: string;
  /** 所有人设列表 */
  personas: IPersona[];
  /** 自定义人设列表（非预设） */
  customPersonas: IPersona[];
  /** 预设人设列表 */
  presetPersonas: IPersona[];
}

/**
 * 人设操作类型
 */
export enum PersonaActionType {
  /** 选择人设 */
  SELECT = 'select',
  /** 创建自定义人设 */
  CREATE = 'create',
  /** 编辑自定义人设 */
  EDIT = 'edit',
  /** 删除自定义人设 */
  DELETE = 'delete',
  /** 克隆人设 */
  CLONE = 'clone',
  /** 重置为预设 */
  RESET = 'reset',
}
