/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import Header from '@/components/Header';
import ResizeWrapper from '@/components/ResizeWrapper';
import Sidebar from '@/components/Sidebar';
import utils from '@/utils/utils';
import MainArea from './MainArea';
import styles from './index.module.less';

export default function () {
  return (
    <ResizeWrapper className={styles.container}>
      <Header />
      <div
        className={styles.main}
        style={{
          padding: utils.isMobile() ? '' : '24px 124px',
        }}
      >
        <div className={`${styles.mainArea} ${utils.isMobile() ? styles.isMobile : ''}`}>
          <MainArea />
        </div>
        {utils.isMobile() ? null : (
          <div className={styles.operationArea}>
            <Sidebar />
          </div>
        )}
      </div>
    </ResizeWrapper>
  );
}
