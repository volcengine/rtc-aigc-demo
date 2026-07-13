/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { IconUser } from '@arco-design/web-react/icon';
import styles from './index.module.less';

interface IUserTagProps {
  name: string;
  className?: string;
}

function UserTag(props: IUserTagProps) {
  const { name, className } = props;
  return (
    <div className={`${styles.userTagWrapper} ${className}`}>
      <div className={styles.iconContainer}>
        <IconUser style={{ fill: '#fff', strokeWidth: 0 }} />
      </div>
      <div className={styles.nameContainer}>{name}</div>
    </div>
  );
}

export default UserTag;
