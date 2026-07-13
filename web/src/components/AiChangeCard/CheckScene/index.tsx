/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import styles from './index.module.less';

interface IProps {
  checked: boolean;
  title?: string;
  onClick?: () => void;
  icon?: string;
  tag?: string;
}

function CheckScene(props: IProps) {
  const { tag, icon, title, checked, onClick } = props;
  return (
    <div className={`${styles.wrapper} ${checked ? styles.active : ''}`} onClick={onClick}>
      {tag ? <div className={styles.tag}>{tag}</div> : ''}
      <div className={styles.content}>
        {icon ? <img className={styles.icon} src={icon} alt="icon" /> : ''}
        <div className={styles['checked-text']}>{title}</div>
      </div>
    </div>
  );
}

export default CheckScene;
