/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { memo } from 'react';
import styles from './index.module.less';

function Loading() {
  return (
    <span className={styles.loader}>
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </span>
  );
}

export default memo(Loading);
