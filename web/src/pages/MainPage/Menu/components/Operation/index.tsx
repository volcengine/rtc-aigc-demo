/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { MediaType } from '@volcengine/rtc';
import DeviceDrawerButton from '../DeviceDrawerButton';
import Subtitle from '../Subtitle';
import { useScene } from '@/lib/useCommon';
import styles from './index.module.less';

function Operation() {
  const { isVision } = useScene();
  return (
    <div className={`${styles.box} ${styles.device}`}>
      <Subtitle />
      {isVision && <DeviceDrawerButton type={MediaType.VIDEO} />}
      <DeviceDrawerButton />
    </div>
  );
}

export default Operation;
