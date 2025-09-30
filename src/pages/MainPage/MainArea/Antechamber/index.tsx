/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch } from 'react-redux';
import { isMobile } from '@/utils/utils';
import InvokeButton from '@/pages/MainPage/MainArea/Antechamber/InvokeButton';
import { useJoin, useScene } from '@/lib/useCommon';
import AIChangeCard from '@/components/AiChangeCard';
import { updateFullScreen, updateShowSubtitle } from '@/store/slices/room';
import style from './index.module.less';

function Antechamber() {
  const dispatch = useDispatch();
  const [joining, dispatchJoin] = useJoin();
  const { isScreenMode, isAvatarScene } = useScene();

  const handleJoinRoom = () => {
    dispatch(updateFullScreen({ isFullScreen: !isMobile() && !isScreenMode && !isAvatarScene })); // 初始化
    dispatch(updateShowSubtitle({ isShowSubtitle: !isAvatarScene }));

    if (!joining) {
      dispatchJoin();
    }
  };

  return (
    <div className={`${style.wrapper} ${isMobile() ? style.mobile : ''}`}>
      <AIChangeCard />
      <InvokeButton onClick={handleJoinRoom} loading={joining} className={style['invoke-btn']} />
      {isMobile() ? null : (
        <div className={style.description}>Powered by 豆包大模型和火山引擎视频云 RTC</div>
      )}
    </div>
  );
}

export default Antechamber;
