/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useAtom } from 'jotai';
import DouBaoAvatar from '@/assets/img/DoubaoAvatarGIF.webp';
import { activePersonaAtom } from '@/store/atoms';
import { getVoiceName } from '@/config/common';
import style from './index.module.less';

interface IAvatarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: string;
}

function AvatarCard(props: IAvatarCardProps) {
  const [persona] = useAtom(activePersonaAtom);

  const { avatar: avatarProp, className, ...rest } = props;

  console.log('Avatar Card: ', { persona });

  return (
    <div className={`${style.card} ${className}`} {...rest}>
      <div className={style.corner} />
      <div className={style.avatar}>
        <img id="avatar-card" src={avatarProp || DouBaoAvatar} className={style['doubao-gif']} alt="Avatar" />
      </div>
      <div className={style.body} />
      <div className={style['text-wrapper']}>
        <div className={style['user-info']}>
          <div className={style.title}>{persona.name}</div>
          <div className={style.description}>声源：{getVoiceName(persona.voice)}</div>
          <div className={style.description}>模型：{persona.model}</div>
        </div>
      </div>
    </div>
  );
}

export default AvatarCard;
