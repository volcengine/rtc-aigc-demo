/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useState, useEffect } from 'react';
import { Button, Modal, Input, Message, Select } from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconCopy } from '@arco-design/web-react/icon';
import { useAtom, useAtomValue } from 'jotai';
import CheckIcon from '../CheckIcon';
import { IPersona } from '@/types/persona';
import { personaManagerAtom, activePersonaAtom, usePersonaActions, presetPersonasAtom, customPersonasAtom } from '@/store/atoms';
import { clonePersona, generatePersonaId } from '@/config/personas';
import { VOICE_BY_SCENARIO, AI_MODEL } from '../../config/common';

interface PersonaSelectorProps {
  className?: string
}

interface IPersonaEditModalProps {
  visible: boolean;
  persona?: IPersona;
  isClone?: boolean;
  onOk: (persona: IPersona) => void;
  onCancel: () => void;
}

const PersonaEditModal: React.FC<IPersonaEditModalProps> = ({ visible, persona, isClone = false, onOk, onCancel }) => {
  // 添加调试信息
  console.log("PersonaEditModal props:", { visible, persona: persona?.name, isClone });

  const getAllVoiceOptions = () => {
    const allVoices: Array<{ label: string; value: string; category: string }> = [];
    Object.entries(VOICE_BY_SCENARIO).forEach(([category, voices]) => {
      voices.forEach(voice => {
        allVoices.push({
          label: `${voice.name} (${voice.language})`,
          value: voice.value,
          category
        });
      });
    });
    return allVoices;
  };

  const getModelOptions = () => {
    return Object.values(AI_MODEL).map(model => ({
      label: model,
      value: model
    }));
  };

  const [formData, setFormData] = useState<Partial<IPersona>>(() => {
    console.log("初始化 formData，参数:", { persona: persona?.name, isClone });
    
    if (persona) {
      if (isClone) {
        console.log("进入克隆分支，源数据:", persona);
        // 克隆模式：创建完整的克隆数据，包含所有字段
        const cloned = clonePersona(persona);
        console.log("克隆后的数据:", cloned);
        return { 
          ...cloned, 
          id: generatePersonaId(),
        };
      }
      console.log("进入编辑分支");
      // 编辑模式：使用现有人设的完整数据
      return { ...persona };
    }
    console.log("进入新建分支");
    // 新建模式：使用默认空值
    return {
      name: '',
      description: '',
      prompt: '',
      welcome: '',
      voice: '' as any,
      model: '' as any,
      avatar: '',
    };
  });

  // 监听 persona 和 isClone 的变化，重新初始化 formData
  useEffect(() => {
    console.log("useEffect 触发，参数:", { persona: persona?.name, isClone });
    
    if (persona) {
      if (isClone) {
        console.log("useEffect 克隆分支，源数据:", persona);
        const cloned = clonePersona(persona);
        console.log("useEffect 克隆后的数据:", cloned);
        setFormData({ 
          ...cloned, 
          id: generatePersonaId(),
        });
      } else {
        console.log("useEffect 编辑分支");
        setFormData({ ...persona });
      }
    } else {
      console.log("useEffect 新建分支");
      setFormData({
        name: '',
        description: '',
        prompt: '',
        welcome: '',
        voice: '' as any,
        model: '' as any,
        avatar: '',
      });
    }
  }, [persona, isClone]);

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      Message.error('请输入人设名称');
      return;
    }

    const timestamp = Date.now();
    const newPersona: IPersona = {
      id: formData.id || generatePersonaId(),
      name: formData.name.trim(),
      avatar: formData.avatar || '',
      voice: formData.voice || ('' as any),
      model: formData.model || ('' as any),
      prompt: formData.prompt || '',
      welcome: formData.welcome || '',
      description: formData.description || '',
      isPreset: false,
      createdAt: formData.createdAt || timestamp,
      updatedAt: timestamp,
    };

    onOk(newPersona);
  };

  const voiceOptions = getAllVoiceOptions();
  const modelOptions = getModelOptions();

  console.log("formData: ", formData);
  

  return (
    <Modal 
      title={isClone ? `克隆人设 - ${persona?.name}` : persona ? '编辑人设' : '创建新人设'} 
      visible={visible} 
      onOk={handleSubmit} 
      onCancel={onCancel} 
      autoFocus={false} 
      focusLock={true}
      style={{ minWidth: '600px' }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">人设名称 *</label>
          <Input 
            value={formData.name} 
            onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))} 
            placeholder="输入人设名称" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">人设描述</label>
          <Input 
            value={formData.description} 
            onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))} 
            placeholder="简短描述这个人设的特点" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">头像</label>
          <Input 
            value={formData.avatar} 
            onChange={(value) => setFormData((prev) => ({ ...prev, avatar: value }))} 
            placeholder="头像URL或emoji字符" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">音色</label>
            <Select 
              value={formData.voice} 
              onChange={(value) => setFormData((prev) => ({ ...prev, voice: value as any }))} 
              placeholder="选择音色" 
              showSearch
              allowClear
            >
              {voiceOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">模型</label>
            <Select 
              value={formData.model} 
              onChange={(value) => setFormData((prev) => ({ ...prev, model: value as any }))} 
              placeholder="选择AI模型" 
              allowClear
            >
              {modelOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">提示词</label>
          <Input.TextArea 
            value={formData.prompt} 
            onChange={(value) => setFormData((prev) => ({ ...prev, prompt: value }))} 
            placeholder="定义人设的性格、行为特征等（可以是文本内容或文件路径）" 
            rows={4} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">欢迎语</label>
          <Input 
            value={formData.welcome} 
            onChange={(value) => setFormData((prev) => ({ ...prev, welcome: value }))} 
            placeholder="人设的开场白" 
          />
        </div>

        {/* 显示继承的元数据（只读） */}
        {isClone && persona && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-700 mb-2">继承信息</div>
            <div className="text-xs text-gray-500 space-y-1">
              {persona.originalScene && <div>原始场景: {persona.originalScene}</div>}
              {persona.questions && persona.questions.length > 0 && (
                <div>问题列表: {persona.questions.length} 个预设问题</div>
              )}
              {persona.extra && <div>扩展配置: 已继承原有的高级设置</div>}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

function PersonaSelector({ className }: PersonaSelectorProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPersona, setEditingPersona] = useState<IPersona | undefined>(undefined);
  const [isCloneMode, setIsCloneMode] = useState(false);

  const activePersona = useAtomValue(activePersonaAtom);
  const { setActivePersona, createPersona, updatePersona, deletePersona } = usePersonaActions();

  const handleSelectPersona = (persona: IPersona) => {
    setActivePersona(persona.id);
  };

  const handleEditPersona = (persona: IPersona) => {
    setEditingPersona(persona);
    setIsCloneMode(false);
    setEditModalVisible(true);
  };

  const handleClonePersona = (persona: IPersona) => {
    setEditingPersona(persona);
    setIsCloneMode(true);
    setEditModalVisible(true);
  };

  const handleDeletePersona = (persona: IPersona) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除人设"${persona.name}"吗？`,
      onOk: () => {
        deletePersona(persona.id);
      }
    });
  };

  const handleCreatePersona = () => {
    setEditingPersona(undefined);
    setIsCloneMode(false);
    setEditModalVisible(true);
  };

  const handleModalOk = (personaData: IPersona) => {
    if (isCloneMode && editingPersona) {
      createPersona(personaData);
    } else if (editingPersona) {
      updatePersona(editingPersona.id, personaData);
    } else {
      createPersona(personaData);
    }
    setEditModalVisible(false);
    setEditingPersona(undefined);
  };

  const handleModalCancel = () => {
    setEditModalVisible(false);
    setEditingPersona(undefined);
  };

  const presetPersonas = useAtomValue(presetPersonasAtom);
  const customPersonas = useAtomValue(customPersonasAtom);

  const renderPersonaCard = (persona: IPersona) => {
    const isActive = persona.id === activePersona?.id;
    const isPreset = persona.isPreset;

    return (
      <div key={persona.id} className="relative group">
        <CheckIcon icon={persona.avatar} title={persona.name} checked={isActive} onClick={() => handleSelectPersona(persona)} />

        {/* 操作按钮 */}
        <div className="hidden group-hover:flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <Button
              type="text"
              size="mini"
              icon={<IconCopy />}
              onClick={(e) => {
                e.stopPropagation();
                handleClonePersona(persona);
              }}
              title="克隆人设"
            />

          {!isPreset && (
            <>
              <Button
                type="text"
                size="mini"
                icon={<IconEdit />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPersona(persona);
                }}
                title="编辑人设"
              />
              <Button
                type="text"
                size="mini"
                status="danger"
                icon={<IconDelete />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePersona(persona);
                }}
                title="删除人设"
              />
            </>
          )}
        </div>

        {/* 人设标识 */}
        {/* <div className="absolute bottom-1 left-1">{isPreset && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">预设</span>}</div> */}
      </div>
    );
  };

  return (
    <div className={className}>
      <div className="text-lg font-semibold leading-7 text-gray-900">
        选择你所需要的
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI 人设</span>
      </div>
      <div className="text-xs font-normal leading-5 text-gray-500 mt-1.5">我们已为您配置好对应人设的基本参数，您也可以根据自己的需求进行自定义设置</div>

      {/* 预设人设 */}
      {presetPersonas.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">预设人设</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">{presetPersonas.map(renderPersonaCard)}</div>
        </div>
      )}

      {/* 自定义人设 */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">自定义人设</h3>
          <Button type="primary" size="mini" icon={<IconPlus />} onClick={handleCreatePersona}>
            创建人设
          </Button>
        </div>

        {customPersonas.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2">{customPersonas.map(renderPersonaCard)}</div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">👤</div>
            <div className="text-sm">还没有自定义人设</div>
            <div className="text-xs mt-1">点击"创建人设"开始自定义你的AI助手</div>
          </div>
        )}
      </div>

      {/* 编辑模态框 */}
      <PersonaEditModal visible={editModalVisible} persona={editingPersona} isClone={isCloneMode} onOk={handleModalOk} onCancel={handleModalCancel} />
    </div>
  );
};

export default PersonaSelector;
