/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Popover } from '@arco-design/web-react';
import { RootState } from '@/store';
import { updateFullScreen } from '@/store/slices/room';
import SET_LOCAL_PLAYER from '@/assets/img/setLocalPlayer.svg';
import styles from './index.module.less';

function LocalPlayerSet() {
  const dispatch = useDispatch();
  const room = useSelector((state: RootState) => state.room);
  const { isFullScreen } = room;
  const [loading, setLoading] = useState(false);
  const [isFull, setFull] = useState(isFullScreen);

  const setLocalPlayer = () => {
    setLoading(true);
    setFull(!isFull);
    dispatch(updateFullScreen({ isFullScreen: !isFull }));
    setLoading(false);
  };
  return (
    <div
      onClick={setLocalPlayer}
      className={styles.container}
      style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
    >
      <Popover content="切换屏幕">
        <img src={SET_LOCAL_PLAYER} alt="fullSize" />
      </Popover>
    </div>
  );
}

export default LocalPlayerSet;
