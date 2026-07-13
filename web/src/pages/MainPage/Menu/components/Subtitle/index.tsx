/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useState } from 'react';
import { Switch } from '@arco-design/web-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateShowSubtitle } from '@/store/slices/room';
import styles from './index.module.less';

function Subtitle() {
  const dispatch = useDispatch();
  const room = useSelector((state: RootState) => state.room);
  const { isShowSubtitle } = room;
  const [checked, setChecked] = useState(isShowSubtitle);
  const [loading, setLoading] = useState(false);
  const handleChange = () => {
    setLoading(true);
    setChecked(!checked);
    dispatch(updateShowSubtitle({ isShowSubtitle: !checked }));
    setLoading(false);
  };
  return (
    <div className={styles.subtitle}>
      <div className={styles.label}>字幕</div>
      <div className={styles.value}>
        <Switch size="small" loading={loading} checked={checked} onChange={handleChange} />
      </div>
    </div>
  );
}

export default Subtitle;
