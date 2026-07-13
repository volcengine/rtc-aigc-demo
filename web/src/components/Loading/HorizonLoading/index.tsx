/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { memo } from 'react';
import style from './index.module.less';

interface ILoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  dotClassName?: string;
  speed?: number;
  gap?: number;
}

function Loading(props: ILoadingProps) {
  const { dotClassName, gap = 5, speed = 0.9, className = '', ...rest } = props;
  return (
    <div
      className={`${style.loader} ${className}`}
      style={{
        gap: `${gap}px`,
      }}
      {...rest}
    >
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`${style.dot} ${dotClassName}`}
            style={{
              animation: `glow linear ${speed.toFixed(1)}s infinite`,
              animationDelay: `${(index * (speed / 3)).toFixed(1)}s`,
            }}
          />
        ))}
    </div>
  );
}

export default memo(Loading);
