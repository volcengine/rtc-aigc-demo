/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useState } from 'react';
import { Collapse } from '@arco-design/web-react';
import BasicInfo from './BasicInfo';
import QuickQuestions from './QuickQuestions';
import AISettings from '@/components/AISettings';
import DeviceSettings from './DeviceSettings';
import AdvancedOperations from './AdvancedOperations';
import utils from '@/utils/utils';
import styles from './index.module.less';

const CollapseItem = Collapse.Item;

function Sidebar() {
  const [activeKeys, setActiveKeys] = useState<string[]>(['basic', 'questions', 'ai', 'device']);

  const handleCollapseChange = (keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  };

  if (utils.isMobile()) {
    return null;
  }

  return (
    <div className={styles.sidebar}>
      <Collapse activeKey={activeKeys} onChange={handleCollapseChange} bordered={false}>
        <CollapseItem header="基本信息" name="basic">
          <BasicInfo />
        </CollapseItem>

        <CollapseItem header="快速提问" name="questions">
          <QuickQuestions />
        </CollapseItem>

        <CollapseItem header="AI 设置" name="ai">
          <div className={styles.embeddedWrapper}>
            <AISettings embedded />
          </div>
        </CollapseItem>

        <CollapseItem header="设备设置" name="device">
          <DeviceSettings />
        </CollapseItem>

        <CollapseItem header="高级操作" name="advanced">
          <AdvancedOperations />
        </CollapseItem>
      </Collapse>
    </div>
  );
}

export default Sidebar;
