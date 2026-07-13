/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import VERTC from '@volcengine/rtc';
import { Tooltip, Typography } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Operation from './components/Operation';
import CameraArea from '../MainArea/Room/CameraArea';
import { isMobile } from '@/utils/utils';
import { useScene } from '@/lib/useCommon';
import packageJson from '../../../../package.json';
import styles from './index.module.less';

function Menu() {
  const room = useSelector((state: RootState) => state.room);
  const isJoined = room?.isJoined;
  const { isVision, name } = useScene();
  const requestId = sessionStorage.getItem('RequestID');

  return (
    <div className={styles.wrapper}>
      {isJoined && isMobile() && isVision ? (
        <div className={styles['mobile-camera-wrapper']}>
          <CameraArea className={styles['mobile-camera']} />
        </div>
      ) : null}
      <div className={`${styles.box} ${styles.info}`}>
        <div className={styles.title}>AI 人设：{name}</div>
      </div>
      {isJoined ? <Operation /> : ''}
      <div className={`${styles.box} ${styles.info}`}>
        <div className={styles.title}>{isJoined ? '其他信息' : '版本信息'}</div>
        <div className={styles.desc}>Demo Version {packageJson.version}</div>
        <div className={styles.desc}>SDK Version {VERTC.getSdkVersion()}</div>
        {isJoined ? (
          <div className={styles.desc}>
            房间ID{' '}
            <Tooltip content={room.roomId || '-'}>
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: false,
                }}
                className={styles.value}
              >
                {room.roomId || '-'}
              </Typography.Paragraph>
            </Tooltip>
          </div>
        ) : (
          ''
        )}
        {room.isAIGCEnable ? (
          <div className={styles.desc}>
            RequestID{' '}
            <Tooltip content={requestId || '-'}>
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: false,
                }}
                className={styles.value}
              >
                {requestId || '-'}
              </Typography.Paragraph>
            </Tooltip>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Menu;
