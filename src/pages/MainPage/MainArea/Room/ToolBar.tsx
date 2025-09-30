/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { memo, useState } from 'react';
import { Drawer } from '@arco-design/web-react';
import { useDeviceState, useLeave, useScene } from '@/lib/useCommon';
import { isMobile } from '@/utils/utils';
import Menu from '../../Menu';

import style from './index.module.less';
import CameraOpenSVG from '@/assets/img/CameraOpen.svg';
import CameraCloseSVG from '@/assets/img/CameraClose.svg';
import MicOpenSVG from '@/assets/img/MicOpen.svg';
import MicCloseSVG from '@/assets/img/MicClose.svg';
import LeaveRoomSVG from '@/assets/img/LeaveRoom.svg';
import ScreenOnSVG from '@/assets/img/ScreenOn.svg';
import ScreenOffSVG from '@/assets/img/ScreenOff.svg';

function ToolBar(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const [open, setOpen] = useState(false);
  const { isVision, isScreenMode } = useScene();
  const leaveRoom = useLeave();
  const {
    isAudioPublished,
    isVideoPublished,
    isScreenPublished,
    switchMic,
    switchCamera,
    switchScreenCapture,
  } = useDeviceState();

  return (
    <div className={`${className} ${style.btns} ${isMobile() ? style.column : ''}`} {...rest}>
      <img
        src={isAudioPublished ? MicOpenSVG : MicCloseSVG}
        onClick={() => switchMic(true)}
        className={style.btn}
        alt="mic"
      />
      {!isVision ? null : isScreenMode && !isMobile() ? (
        <img
          src={isScreenPublished ? 'new-screen-off.svg' : 'new-screen-on.svg'}
          onClick={() => switchScreenCapture()}
          className={style.btn}
          alt="screenShare"
        />
      ) : (
        <img
          src={isVideoPublished ? CameraOpenSVG : CameraCloseSVG}
          onClick={() => switchCamera(true)}
          className={style.btn}
          alt="camera"
        />
      )}
      {isScreenMode && (
        <img
          src={isScreenPublished ? ScreenOnSVG : ScreenOffSVG}
          onClick={() => switchScreenCapture(true)}
          className={style.btn}
          alt="screenShare"
        />
      )}
      <img src={LeaveRoomSVG} onClick={leaveRoom} className={style.btn} alt="leave" />
      {isMobile() ? (
        <Drawer
          title="设置"
          visible={open}
          onCancel={() => setOpen(false)}
          style={{
            width: 'max-content',
          }}
          footer={null}
        >
          <Menu />
        </Drawer>
      ) : null}
    </div>
  );
}
export default memo(ToolBar);
