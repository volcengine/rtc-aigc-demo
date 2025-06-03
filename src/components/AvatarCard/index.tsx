/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useAtomValue } from 'jotai';
import { useSelector } from 'react-redux';
import DouBaoAvatar from '@/assets/img/DoubaoAvatarGIF.webp';
import { MODEL_MODE, Persona2Name } from '@/config';
import { RootState } from '@/store';
import { avatarConfigAtom, sceneAtom } from '@/store/atoms';
import style from './index.module.less';
import { log } from 'console';

interface IAvatarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string;
}

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
    return Persona2Name[scene] || '未知场景';
  };

  const modelName = displayModelName();

  const sceneName = getSceneName()
  console.log({voice, sceneName, modelName});
  

  return (
    <div className={`${style.card} ${className}`} {...rest}>
      <div className={style.corner} />
      <div className={style.avatar}>
        <img id="avatar-card" src={avatarProp || DouBaoAvatar} className={style['doubao-gif']} alt="Avatar" />
      </div>
      <div className={style.body} />
      <div className={style['text-wrapper']}>
        <div className={style['user-info']}>
          <div className={style.title}>{sceneName}</div>
          <div className={style.description}>声源来自 {voice}</div>
          <div className={style.description}>{modelName}</div>
        </div>
      </div>
    </div>
  );
}

export default AvatarCard;
