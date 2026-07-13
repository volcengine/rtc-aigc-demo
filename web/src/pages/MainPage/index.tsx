/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '@/components/Header';
import ResizeWrapper from '@/components/ResizeWrapper';
import Menu from './Menu';
import { useIsMobile } from '@/utils/utils';
import Apis from '@/app/index';
import MainArea from './MainArea';
import { ABORT_VISIBILITY_CHANGE, useLeave } from '@/lib/useCommon';
import {
  RTCConfig,
  SceneConfig,
  updateRTCConfig,
  updateScene,
  updateSceneConfig,
} from '@/store/slices/room';
import styles from './index.module.less';
import RtcClient from '@/lib/RtcClient';

export default function () {
  const leaveRoom = useLeave();
  const dispatch = useDispatch();

  const getScenes = useCallback(async () => {
    const {
      SessionID,
      scenes,
    }: {
      SessionID: string;
      scenes: {
        rtc: RTCConfig;
        scene: SceneConfig;
      }[];
    } = await Apis.Basic.getScenes({});
    RtcClient.setSessionId(SessionID);
    dispatch(updateScene(scenes[0].scene.id));
    dispatch(
      updateSceneConfig(
        scenes.reduce<Record<string, SceneConfig>>((prev, cur) => {
          prev[cur.scene.id] = cur.scene;
          return prev;
        }, {})
      )
    );
    dispatch(
      updateRTCConfig(
        scenes.reduce<Record<string, RTCConfig>>((prev, cur) => {
          prev[cur.scene.id] = cur.rtc;
          return prev;
        }, {})
      )
    );
  }, [dispatch]);

  useEffect(() => {
    getScenes();
    const isOriginalDemo = window.location.host.startsWith('localhost');
    const handler = () => {
      if (
        document.visibilityState === 'hidden' &&
        !sessionStorage.getItem(ABORT_VISIBILITY_CHANGE)
      ) {
        leaveRoom();
      }
    };
    !isOriginalDemo && document.addEventListener('visibilitychange', handler);
    return () => {
      !isOriginalDemo && document.removeEventListener('visibilitychange', handler);
    };
  }, [getScenes, leaveRoom]);

  useEffect(() => {
    const stopOnPageHide = () => RtcClient.stopAgentOnUnload();
    window.addEventListener('pagehide', stopOnPageHide);
    return () => window.removeEventListener('pagehide', stopOnPageHide);
  }, []);

  return (
    <ResizeWrapper className={styles.container}>
      <Header />
      <div
        className={styles.main}
        style={{
          padding: useIsMobile() ? '' : '24px',
        }}
      >
        <div className={`${styles.mainArea} ${useIsMobile() ? styles.isMobile : ''}`}>
          <MainArea />
        </div>
        {useIsMobile() ? null : (
          <div className={styles.operationArea}>
            <Menu />
          </div>
        )}
      </div>
    </ResizeWrapper>
  );
}
