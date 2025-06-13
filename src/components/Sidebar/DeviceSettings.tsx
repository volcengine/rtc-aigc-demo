/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MediaType } from '@volcengine/rtc';
import { Switch, Select } from '@arco-design/web-react';
import { RootState } from '@/store';
import RtcClient from '@/lib/RtcClient';
import { useDeviceState, useVisionMode } from '@/lib/useCommon';
import { updateSelectedDevice } from '@/store/slices/device';
import styles from './DeviceSettings.module.less';

function DeviceSettings() {
  const device = useDeviceState();
  const { isVisionMode, isScreenMode } = useVisionMode();
  const devicePermissions = useSelector((state: RootState) => state.device.devicePermissions);
  const devices = useSelector((state: RootState) => state.device);
  const dispatch = useDispatch();

  const audioDeviceList = useMemo(() => devices.audioInputs, [devices.audioInputs]);
  const videoDeviceList = useMemo(() => devices.videoInputs, [devices.videoInputs]);

  const handleDeviceChange = (type: MediaType.AUDIO | MediaType.VIDEO, value: string) => {
    RtcClient.switchDevice(type, value);
    if (type === MediaType.AUDIO) {
      dispatch(updateSelectedDevice({ selectedMicrophone: value }));
    }
    if (type === MediaType.VIDEO) {
      dispatch(updateSelectedDevice({ selectedCamera: value }));
    }
  };

  return (
    <div className={styles.deviceSettings}>
      {/* 麦克风设置 */}
      <div className={styles.deviceGroup}>
        <div className={styles.deviceTitle}>麦克风</div>
        <div className={styles.deviceItem}>
          <div className={styles.label}>启用麦克风</div>
          <Switch
            checked={device.isAudioPublished}
            size="small"
            onChange={(enable) => device.switchMic(enable)}
            disabled={!devicePermissions?.audio}
          />
        </div>
        <div className={styles.deviceItem}>
          <div className={styles.label}>选择麦克风</div>
          <Select
            style={{ width: '100%' }}
            value={devices.selectedMicrophone}
            onChange={(value) => handleDeviceChange(MediaType.AUDIO, value)}
            size="small"
            disabled={!devicePermissions?.audio}
          >
            {audioDeviceList.map((deviceItem) => (
              <Select.Option key={deviceItem.deviceId} value={deviceItem.deviceId}>
                {deviceItem.label}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {/* 摄像头设置 */}
      {/* {isVisionMode && !isScreenMode && (
        <div className={styles.deviceGroup}>
          <div className={styles.deviceTitle}>摄像头</div>
          <div className={styles.deviceItem}>
            <div className={styles.label}>启用摄像头</div>
            <Switch
              checked={device.isVideoPublished}
              size="small"
              onChange={(enable) => device.switchCamera(enable)}
              disabled={!devicePermissions?.video}
            />
          </div>
          <div className={styles.deviceItem}>
            <div className={styles.label}>选择摄像头</div>
            <Select
              style={{ width: '100%' }}
              value={devices.selectedCamera}
              onChange={(value) => handleDeviceChange(MediaType.VIDEO, value)}
              size="small"
              disabled={!devicePermissions?.video}
            >
              {videoDeviceList.map((deviceItem) => (
                <Select.Option key={deviceItem.deviceId} value={deviceItem.deviceId}>
                  {deviceItem.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default DeviceSettings;
