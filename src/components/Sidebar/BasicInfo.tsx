/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import VERTC from '@volcengine/rtc';
import { Tooltip, Typography } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import styles from './BasicInfo.module.less';

function BasicInfo() {
  const room = useSelector((state: RootState) => state.room);
  const isJoined = room?.isJoined;

  return (
    <div className={styles.basicInfo}>
      <div className={styles.infoItem}>
        <div className={styles.label}>Demo 版本</div>
        <div className={styles.value}>1.0.0</div>
      </div>

      <div className={styles.infoItem}>
        <div className={styles.label}>SDK 版本</div>
        <div className={styles.value}>{VERTC.getSdkVersion()}</div>
      </div>

      {isJoined && (
        <div className={styles.infoItem}>
          <div className={styles.label}>房间 ID</div>
          <div className={styles.value}>
            <Tooltip content={room.roomId || '-'}>
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: false,
                }}
                className={styles.roomId}
              >
                {room.roomId || '-'}
              </Typography.Paragraph>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicInfo;
