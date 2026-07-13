/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch, useSelector } from 'react-redux';
import { memo, useCallback, useEffect, useState } from 'react';
import { VideoRenderMode } from '@volcengine/rtc';
import { useDeviceState, useScene } from '@/lib/useCommon';
import { RootState } from '@/store';
import RtcClient from '@/lib/RtcClient';

import { updateShowSubtitle } from '@/store/slices/room';
import SettingsDrawer from '../SettingsDrawer';
import styles from './index.module.less';

function MobileToolBar(props: React.HTMLAttributes<HTMLDivElement>) {
  const dispatch = useDispatch();

  const room = useSelector((state: RootState) => state.room);
  const { isShowSubtitle } = room;
  const [open, setOpen] = useState(false);
  const [subTitleStatus, setSubTitleStatus] = useState(isShowSubtitle);

  const { isScreenMode } = useScene();
  const { isVideoPublished, isScreenPublished } = useDeviceState();

  const switchSubtitle = () => {
    setSubTitleStatus(!subTitleStatus);
    dispatch(updateShowSubtitle({ isShowSubtitle: !subTitleStatus }));
  };

  const setVideoPlayer = useCallback(() => {
    if (isVideoPublished || isScreenPublished) {
      RtcClient.setLocalVideoPlayer(
        room.localUser.username!,
        'mobile-local-player',
        isScreenPublished,
        isScreenMode ? VideoRenderMode.RENDER_MODE_FILL : VideoRenderMode.RENDER_MODE_HIDDEN
      );
    }
  }, [isScreenMode, isScreenPublished, isVideoPublished, room.localUser.username]);

  useEffect(() => {
    setVideoPlayer();
  }, [setVideoPlayer]);

  return (
    <div className={styles.wrapper}>
      <div>
        <div
          className={`${styles.subtitle} ${subTitleStatus ? styles.showSubTitle : ''}`}
          onClick={switchSubtitle}
        >
          字幕
        </div>
      </div>

      <SettingsDrawer visible={open} onCancel={() => setOpen(false)} />
    </div>
  );
}
export default memo(MobileToolBar);
