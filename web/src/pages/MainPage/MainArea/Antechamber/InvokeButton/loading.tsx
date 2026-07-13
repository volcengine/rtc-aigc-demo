/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import style from './index.module.less';

function Loading(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className = '', ...rest } = props;
  return (
    <div className={`${style.loader} ${className}`} {...rest}>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={style.dot}
            style={{
              animationDelay: `${index * 0.3}s`,
            }}
          />
        ))}
    </div>
  );
}

export default Loading;
