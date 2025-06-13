/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/store';
import { useDeviceState, useVisionMode } from '@/lib/useCommon';
import RtcClient from '@/lib/RtcClient';
import { getScreenShareScenes } from '@/config/personas';

import styles from './index.module.less';
import CameraCloseNoteSVG from '@/assets/img/CameraCloseNote.svg';
import ScreenCloseNoteSVG from '@/assets/img/ScreenCloseNote.svg';

const LocalVideoID = 'local-video-player';
const LocalScreenID = 'local-screen-player';

function CameraArea(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const room = useSelector((state: RootState) => state.room);
  const { isVisionMode } = useVisionMode();
  const isScreenMode = getScreenShareScenes().includes(room.scene);
  const { isVideoPublished, isScreenPublished, switchCamera, switchScreenCapture } =
    useDeviceState();

  const setVideoPlayer = () => {
    if (isVisionMode && (isVideoPublished || isScreenPublished)) {
      RtcClient.setLocalVideoPlayer(
        room.localUser.username!,
        isScreenMode ? LocalScreenID : LocalVideoID,
        isScreenPublished
      );
    }
  };

  const handleOperateCamera = () => {
    switchCamera();
  };

  const handleOperateScreenShare = () => {
    switchScreenCapture();
  };

  useEffect(() => {
    setVideoPlayer();
  }, [isVideoPublished, isScreenPublished, isScreenMode]);

  return isVisionMode ? (
    <div className={`${styles['camera-wrapper']} ${className}`} {...rest}>
      <div
        id={LocalVideoID}
        className={`${styles['camera-player']} ${
          isVideoPublished && !isScreenMode ? '' : styles['camera-player-hidden']
        }`}
      />
      <div
        id={LocalScreenID}
        className={`${styles['camera-player']} ${
          isScreenPublished && isScreenMode ? '' : styles['camera-player-hidden']
        }`}
      />
      <div
        className={`${styles['camera-placeholder']} ${
          isVideoPublished || isScreenPublished ? styles['camera-player-hidden'] : ''
        }`}
      >
        <img
          src={isScreenMode ? ScreenCloseNoteSVG : CameraCloseNoteSVG}
          alt="close"
          className={styles['camera-placeholder-close-note']}
        />
        <div>
          请
          {isScreenMode ? (
            <span onClick={handleOperateScreenShare} className={styles['camera-open-btn']}>
              打开屏幕采集
            </span>
          ) : (
            <span onClick={handleOperateCamera} className={styles['camera-open-btn']}>
              打开摄像头
            </span>
          )}
        </div>
        <div>体验豆包视觉理解模型</div>
      </div>
    </div>
  ) : null;
}

export default CameraArea;
