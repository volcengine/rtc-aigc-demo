/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { memo } from 'react';
import style from './index.module.less';

interface IAudioLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
}

function AudioLoading(props: IAudioLoadingProps) {
  const { loading = false, className = '', color, ...rest } = props;
  return (
    <div className={`${style.loader} ${className}`} {...rest}>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`${style.dot} ${loading ? style.dotter : ''}`}
            style={{
              animationDelay: `${index * 0.3}s`,
              backgroundColor: color || 'rgba(148, 116, 255, 1)',
            }}
          />
        ))}
    </div>
  );
}

export default memo(AudioLoading);
