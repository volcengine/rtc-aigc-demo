/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useMemo } from 'react';
import { Popover } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { IconArrowDown, IconArrowUp } from '@arco-design/web-react/icon';
import { NetworkQuality } from '@volcengine/rtc';
import { RootState } from '@/store';
import style from './index.module.less';

import Config from '@/config/the-config';

enum INDICATOR_COLORS {
  GREAT = 'rgba(35, 195, 67, 1)',
  FAIR = 'rgba(208, 141, 6, 1)',
  BAD = 'rgba(245, 78, 78, 1)',
  PLACE_HOLDER = 'transparent',
}

const INDICATOR_TEXT = {
  [NetworkQuality.UNKNOWN]: '正常',
  [NetworkQuality.EXCELLENT]: '正常',
  [NetworkQuality.GOOD]: '正常',
  [NetworkQuality.POOR]: '一般',
  [NetworkQuality.BAD]: '一般',
  [NetworkQuality.VBAD]: '较差',
  [NetworkQuality.DOWN]: '较差',
};

function NetworkIndicator() {
  const room = useSelector((state: RootState) => state.room);
  const networkQuality = room.networkQuality;
  const delay = room.localUser.audioStats?.rtt;
  const audioLossRateUpper = room.localUser.audioStats?.audioLossRate || 0;
  const audioLossRateLower =
    room.remoteUsers.find((user) => user.userId === Config.BotName)?.audioStats?.audioLossRate || 0;

  const indicators = useMemo(() => {
    switch (networkQuality) {
      case NetworkQuality.UNKNOWN:
      case NetworkQuality.EXCELLENT:
      case NetworkQuality.GOOD:
        return Array(3).fill(INDICATOR_COLORS.GREAT);
      case NetworkQuality.POOR:
      case NetworkQuality.BAD:
        return Array(2).fill(INDICATOR_COLORS.FAIR).concat(INDICATOR_COLORS.PLACE_HOLDER);
      case NetworkQuality.VBAD:
      case NetworkQuality.DOWN:
      default:
        return [INDICATOR_COLORS.BAD].concat(...Array(2).fill(INDICATOR_COLORS.PLACE_HOLDER));
    }
  }, [networkQuality]);

  return (
    <Popover
      position="bl"
      content={
        <div className={style.panel}>
          <div className={style.label}>
            <div className={style.state}>网络状态</div>
            <div className={style.item}>延迟</div>
            <div className={style.item}>丢包率</div>
          </div>
          <div className={style.value}>
            <div
              className={style.state}
              style={{
                color: indicators?.[0] || INDICATOR_COLORS.BAD,
              }}
            >
              {INDICATOR_TEXT[networkQuality]}
            </div>
            <div className={style.item}>{delay ? delay.toFixed(0) : '- '}ms</div>
            <div className={style.loss}>
              <div>
                <IconArrowUp style={{ color: 'rgba(22, 100, 255, 1)' }} />
                <span>
                  {`${audioLossRateUpper}` ? (audioLossRateUpper * 100)?.toFixed(0) : '- '}%
                </span>
              </div>
              <div>
                <IconArrowDown />
                <span>
                  {`${audioLossRateLower}` ? (audioLossRateLower * 100)?.toFixed(0) : '- '}%
                </span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className={style.wrapper}>
        {indicators.map((color, index) => (
          <div
            key={index}
            className={style.indicator}
            style={{
              height: `${20 + (80 * (index + 1)) / 3}%`,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    </Popover>
  );
}

export default NetworkIndicator;
