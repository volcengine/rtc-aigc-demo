/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import VERTC from '@volcengine/rtc';
import { Drawer, Message } from '@arco-design/web-react'; // Import Message if you plan to use it
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLeave } from '@/lib/useCommon';
import { Disclaimer, ReversoContext, UserAgreement } from '@/config';
import { SettingsItem } from '../components/SettingsItem';
import packageJSON from '../../../../package.json';
import styles from './index.module.less';

interface SettingsDrawerProps {
  visible: boolean;
  onCancel: () => void;
}

function SettingsDrawer({ visible, onCancel }: SettingsDrawerProps) {
  const room = useSelector((state: RootState) => state.room);
  const { roomId } = room;
  const leaveRoom = useLeave();

  const handleLogout = () => {
    leaveRoom();
  };

  const handleCopyLink = () => {
    const pcLink = window.location.origin + window.location.pathname;
    navigator.clipboard
      .writeText(pcLink)
      .then(() => {
        Message.success('链接已复制');
      })
      .catch((err) => {
        console.error('复制链接失败:', err);
        Message.error('复制失败，请手动复制');
      });
  };

  return (
    <Drawer
      title="设置"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      className={styles.settingsDrawer}
      width="100%"
      bodyStyle={{ padding: 0 }}
    >
      <div className={styles.settingsPage}>
        <div className={styles.settingsGroup}>
          <SettingsItem label="房间ID" value={roomId} showArrow={false} />
          <SettingsItem label="隐私政策" onClick={() => window.open(ReversoContext, '_blank')} />
          <SettingsItem label="用户协议" onClick={() => window.open(UserAgreement, '_blank')} />
          <SettingsItem label="免责声明" onClick={() => window.open(Disclaimer, '_blank')} />
          <SettingsItem
            label="当前版本"
            value={
              <div className={styles.versionInfo}>
                <span>Demo version {packageJSON.version}</span>
                <span>SDK version {VERTC.getSdkVersion()}</span>
              </div>
            }
            showArrow={false}
          />
        </div>

        <div className={styles.settingsGroup}>
          <SettingsItem
            label="复制链接到 PC 体验"
            value="复制链接"
            onClick={handleCopyLink}
            showArrow={false}
            valueClassName={styles.copyLinkText}
          />
        </div>

        <div className={styles.logoutButtonContainer}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            退出房间
          </button>
        </div>
      </div>
    </Drawer>
  );
}

export default SettingsDrawer;
