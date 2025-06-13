/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useState, useEffect } from 'react';
import { Collapse } from '@arco-design/web-react';
import BasicInfo from './BasicInfo';
import QuickQuestions from './QuickQuestions';
import AISettings from '@/components/AISettings';
import DeviceSettings from './DeviceSettings';
import AdvancedOperations from './AdvancedOperations';
import utils from '@/utils/utils';

const CollapseItem = Collapse.Item;

function Sidebar() {
  const [activeKeys, setActiveKeys] = useState<string[]>(['basic', 'questions', 'ai', 'device']);

  const handleCollapseChange = (keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  };

  // 在组件挂载时添加全局样式
  useEffect(() => {
    const styleId = 'sidebar-global-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .sidebar-container .arco-collapse {
        border: none !important;
        background: transparent !important;
      }
      
      .sidebar-container .arco-collapse-item {
        border: none !important;
        margin-bottom: 8px !important;
      }
      
      .sidebar-container .arco-collapse-item:last-child {
        margin-bottom: 0 !important;
      }
      
      .sidebar-container .arco-collapse-header {
        padding: 12px 16px !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        color: #1d2129 !important;
        background: #f7f8fa !important;
        border-radius: 8px !important;
        margin-bottom: 4px !important;
        border: none !important;
      }
      
      .sidebar-container .arco-collapse-header:hover {
        background: #f2f3f5 !important;
      }
      
      .sidebar-container .arco-collapse-content {
        border: none !important;
        background: transparent !important;
      }
      
      .sidebar-container .arco-collapse-content-box {
        padding: 0 16px 16px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  if (utils.isMobile()) {
    return null;
  }

  return (
    <div className="sidebar-container h-full bg-white rounded-2xl overflow-y-auto shadow-lg">
      <Collapse activeKey={activeKeys} onChange={handleCollapseChange} bordered={false}>
        <CollapseItem header="基本信息" name="basic">
          <BasicInfo />
        </CollapseItem>


        <CollapseItem header="设备设置" name="device">
          <DeviceSettings />
        </CollapseItem>
        
        <CollapseItem header="快速提问" name="questions">
          <QuickQuestions />
        </CollapseItem>

        <CollapseItem header="AI 设置" name="ai">
          <div className="[&_.arco-drawer-header]:hidden [&_.arco-drawer-body]:p-0">
            <AISettings embedded />
          </div>
        </CollapseItem>


        <CollapseItem header="高级操作" name="advanced">
          <AdvancedOperations />
        </CollapseItem>
      </Collapse>
    </div>
  );
}

export default Sidebar;
