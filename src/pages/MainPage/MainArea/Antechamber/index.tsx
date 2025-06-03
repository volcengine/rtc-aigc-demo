/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import AvatarCard from '@/components/AvatarCard';
import Utils from '@/utils/utils';
import InvokeButton from '@/pages/MainPage/MainArea/Antechamber/InvokeButton';
import { useJoin } from '@/lib/useCommon';
import style from './index.module.less';
import aigcConfig from '@/config/the-config';

function Antechamber() {
  const [joining, dispatchJoin] = useJoin();
  const username = aigcConfig.BaseConfig.UserId;
  const roomId = aigcConfig.BaseConfig.RoomId;

  const handleJoinRoom = () => {
    if (!joining) {
      dispatchJoin(
        {
          username,
          roomId,
          publishAudio: true,
        },
        false
      );
    }
  };

  return (
    <div className={style.wrapper}>
      <AvatarCard className={`${style.avatar} ${Utils.isMobile() ? style.mobile : ''}`} />
      <div className={style.title}>AI 语音助手</div>
      <div className={style.description}>Powered by 豆包大模型和火山引擎视频云 RTC</div>
      <InvokeButton onClick={handleJoinRoom} loading={joining} className={style['invoke-btn']} />
    </div>
  );
}

export default Antechamber;
