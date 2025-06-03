/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useAtomValue } from 'jotai';
import { useSelector } from 'react-redux';
import DouBaoAvatar from '@/assets/img/DoubaoAvatarGIF.webp';
import { MODEL_MODE, Name, VOICE_TYPE } from '@/config';
import { RootState } from '@/store';
import { avatarConfigAtom, sceneAtom } from '@/store/atoms';
import style from './index.module.less';

interface IAvatarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string;
}

const ReversedVoiceType = Object.entries(VOICE_TYPE).reduce<Record<string, string>>((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

const SourceName = {
  [MODEL_MODE.VENDOR]: '第三方模型',
  [MODEL_MODE.COZE]: 'Coze',
};

function AvatarCard(props: IAvatarCardProps) {
  const room = useSelector((state: RootState) => state.room);
  const avatarConfig = useAtomValue(avatarConfigAtom);

  const modelMode = avatarConfig.modelMode || room.modelMode;
  const voice = avatarConfig.voice || room.aiConfig.Config?.TTSConfig?.ProviderParams?.audio?.voice_type;
  const model = avatarConfig.model;
  const customModelName = avatarConfig.customModelName;

  const { avatar: avatarProp, className, ...rest } = props;

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

  const scene = useAtomValue(sceneAtom);

  // 获取场景的中文显示名称
  const getSceneName = () => {
    return Name[scene] || '未知场景';
  };

  return (
    <div className={`${style.card} ${className}`} {...rest}>
      <div className={style.corner} />
      <div className={style.avatar}>
        <img id="avatar-card" src={avatarProp || DouBaoAvatar} className={style['doubao-gif']} alt="Avatar" />
      </div>
      <div className={style.body} />
      <div className={style['text-wrapper']}>
        <div className={style['user-info']}>
          <div className={style.title}>{getSceneName()}</div>
          <div className={style.description}>声源来自 {ReversedVoiceType[voice || '']}</div>
          <div className={style.description}>{displayModelName()}</div>
        </div>
      </div>
    </div>
  );
}

export default AvatarCard;
