/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useEffect, useRef } from 'react';
import styles from './index.module.less';

export type IWrapperProps = React.PropsWithChildren & {
  className?: string;
};

export default function (props: IWrapperProps) {
  const { children, className = '' } = props;

  const ref = useRef<HTMLDivElement>(null);

  const resize = () => {
    if (ref.current) {
      ref.current.style.height = `${window.innerHeight}px`;
    }
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`${styles.container} ${className}`} ref={ref}>
      {children}
    </div>
  );
}
