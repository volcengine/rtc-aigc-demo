/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useState } from 'react';
import { Drawer, DrawerProps } from '@arco-design/web-react';
import { IconRight } from '@arco-design/web-react/icon';
import styles from './index.module.less';

type IDrawerRowItemProps = {
  btnSrc?: string;
  btnText: string;
  suffix?: React.ReactNode;
  drawer?: {
    title: string;
    width?: string | number;
    onOpen?: () => void;
    onClose?: () => void;
    onCancel?: () => void;
    onConfirm?: (handleClose: () => void) => void;
    children?: React.ReactNode;
    footer?: React.ReactNode | boolean;
  } & DrawerProps;
} & React.HTMLAttributes<HTMLDivElement>;

function DrawerRowItem(props: IDrawerRowItemProps) {
  const { btnSrc, btnText, suffix, drawer, style, className = '' } = props;
  const [open, setOpen] = useState(false);
  const { onClose, onOpen } = drawer!;

  const handleClose = () => {
    drawer?.onCancel?.();
    setOpen(false);
    onClose?.();
  };

  const handleOpen = () => {
    setOpen(true);
    if (drawer) {
      onOpen?.();
    }
  };

  return (
    <>
      <div style={style || {}} className={`${styles.row} ${className}`} onClick={handleOpen}>
        <div className={styles.firstPart}>
          {btnSrc ? <img src={btnSrc} className={styles.icon} alt="svg" /> : ''}
          {btnText}
          {suffix}
        </div>
        <div className={styles.finalPart}>
          <IconRight className={styles.rightOutlined} />
        </div>
      </div>
      <Drawer
        closable
        title={drawer?.title || ''}
        width={drawer?.width || 400}
        className={styles.drawer}
        visible={open}
        onCancel={handleClose}
        footer={null}
      >
        <div className={styles.children}>{drawer?.children}</div>
      </Drawer>
    </>
  );
}

export default DrawerRowItem;
