/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { IconRight } from '@arco-design/web-react/icon';
import styles from './index.module.less';

interface SettingsItemProps {
  label: string;
  value?: string | React.ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
  valueClassName?: string;
}

export function SettingsItem({
  label,
  value,
  onClick,
  showArrow = true,
  valueClassName,
}: SettingsItemProps) {
  return (
    <div className={styles.settingsItem} onClick={onClick}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueContainer}>
        {value && <span className={`${styles.value} ${valueClassName || ''}`}>{value}</span>}
        {showArrow && <IconRight className={styles.arrowIcon} />}
      </div>
    </div>
  );
}
