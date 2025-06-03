/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { Popover, Switch } from '@arco-design/web-react';
import { IconQuestionCircle } from '@arco-design/web-react/icon';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './index.module.less';
import RtcClient from '@/lib/RtcClient';
import { clearHistoryMsg } from '@/store/slices/room';
import Config from '@/config/the-config';

function Interrupt() {
  const dispatch = useDispatch();
  const [switchAble, setSwitchAble] = useState(true);
  const [enable, setEnable] = useState(Config.InterruptMode);
  const handleChange = () => {
    setSwitchAble(false);
    setEnable(!enable);
    Config.InterruptMode = !enable;
    if (RtcClient.getAudioBotEnabled()) {
      dispatch(clearHistoryMsg());
    }
    RtcClient.updateAudioBot();
    setTimeout(() => {
      setSwitchAble(true);
    }, 3000);
  };
  return (
    <div className={styles.interrupt}>
      <div className={styles.label}>
        语音打断
        <Popover content="开启后，在说话时可通过语音打断, 切换语音打断模式将重新开始对话">
          <IconQuestionCircle className={styles.icon} />
        </Popover>
      </div>
      <div className={styles.value}>
        <Switch size="small" loading={!switchAble} checked={enable} onChange={handleChange} />
      </div>
    </div>
  );
}

export default Interrupt;
