/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import Header from '@/components/Header';
import ResizeWrapper from '@/components/ResizeWrapper';
import Sidebar from '@/components/Sidebar';
import utils from '@/utils/utils';
import MainArea from './MainArea';

export default function () {
  const isMobile = utils.isMobile();

  return (
    <ResizeWrapper>
      <Header />
      <div
        className="relative w-full h-[calc(100%-48px)] flex flex-row items-center box-border gap-x-[2%]"
        style={{
          padding: isMobile ? '' : '24px 124px',
        }}
      >
        <div
          className={`relative h-full bg-white overflow-hidden ${
            isMobile ? 'w-full rounded-none' : 'flex-1 rounded-2xl'
          }`}
        >
          <MainArea />
        </div>
        {isMobile ? null : (
          <div className="relative w-[360px] h-full">
            <Sidebar />
          </div>
        )}
      </div>
    </ResizeWrapper>
  );
}
