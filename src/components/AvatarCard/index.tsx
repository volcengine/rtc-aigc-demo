/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useSelector } from 'react-redux';
import { Button } from '@arco-design/web-react';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import AISettings from '../AISettings';
import style from './index.module.less';
import DouBaoAvatar from '@/assets/img/DoubaoAvatarGIF.webp';
import { RootState } from '@/store';
import { MODEL_MODE, Name, VOICE_TYPE } from '@/config';
import { avatarConfigAtom } from '@/store/atoms';

interface IAvatarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string;
}

const ReversedVoiceType = Object.entries(VOICE_TYPE).reduce<Record<string, string>>(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

const SourceName = {
  [MODEL_MODE.VENDOR]: '第三方模型',
  [MODEL_MODE.COZE]: 'Coze',
};

function AvatarCard(props: IAvatarCardProps) {
  const room = useSelector((state: RootState) => state.room);
  const avatarConfig = useAtomValue(avatarConfigAtom);
  const [open, setOpen] = useState(false);

  // 优先使用 jotai 状态，如果没有则使用 Redux 状态作为 fallback
  const scene = avatarConfig.scene || room.scene;
  const modelMode = avatarConfig.modelMode || room.modelMode;
  const voice =
    avatarConfig.voice || room.aiConfig.Config?.TTSConfig?.ProviderParams?.audio?.voice_type;
  const model = avatarConfig.model;
  const customModelName = avatarConfig.customModelName;

  const { avatar: avatarProp, className, ...rest } = props;

  const handleOpenDrawer = () => setOpen(true);
  const handleCloseDrawer = () => setOpen(false);

  // 显示的模型名称
  const displayModelName = () => {
    if (modelMode === MODEL_MODE.ORIGINAL) {
      return `模型 ${model || room.aiConfig.Config?.LLMConfig?.ModelName || ''}`;
    }
    if (modelMode === MODEL_MODE.VENDOR && customModelName) {
      return `模型 ${customModelName}`;
    }
    return `模型来源 ${SourceName[modelMode] || ''}`;
  };

  return (
    <div className={`${style.card} ${className}`} {...rest}>
      <div className={style.corner} />
      <div className={style.avatar}>
        <img
          id="avatar-card"
          src={avatarProp || DouBaoAvatar}
          className={style['doubao-gif']}
          alt="Avatar"
        />
      </div>
      <div className={style.body} />
      <div className={style['text-wrapper']}>
        <div className={style['user-info']}>
          <div className={style.title}>{Name[scene]}</div>
          <div className={style.description}>声源来自 {ReversedVoiceType[voice || '']}</div>
          <div className={style.description}>{displayModelName()}</div>
          <AISettings open={open} onOk={handleCloseDrawer} onCancel={handleCloseDrawer} />
          <Button className={style.button} onClick={handleOpenDrawer}>
            <div className={style['button-text']}>修改 AI 设定</div>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AvatarCard;
