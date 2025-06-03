/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tag, Spin } from '@arco-design/web-react';
import { RootState } from '@/store';
import Loading from '@/components/Loading/HorizonLoading';
import styles from './index.module.less';
import Config from '@/config/the-config';

const lines: (string | React.ReactNode)[] = [];

function Conversation(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const msgHistory = useSelector((state: RootState) => state.room.msgHistory);
  const { userId } = useSelector((state: RootState) => state.room.localUser);
  const { isAITalking, isUserTalking } = useSelector((state: RootState) => state.room);
  const isAIReady = msgHistory.length > 0;
  const containerRef = useRef<HTMLDivElement>(null);

  const isUserTextLoading = (owner: string) => {
    return owner === userId && isUserTalking;
  };

  const isAITextLoading = (owner: string) => {
    return owner === Config.BotName && isAITalking;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [msgHistory.length]);

  return (
    <div ref={containerRef} className={`${styles.conversation} ${className}`} {...rest}>
      {lines.map((line) => line)}
      {!isAIReady ? (
        <div className={styles.aiReadying}>
          <Spin size={16} className={styles['aiReading-spin']} />
          AI 准备中, 请稍侯
        </div>
      ) : (
        ''
      )}
      {msgHistory?.map(({ value, user, isInterrupted }, index) => {
        const isUserMsg = user === userId;
        const isRobotMsg = user === Config.BotName;
        if (!isUserMsg && !isRobotMsg) {
          return '';
        }
        return (
          <div
            className={`${styles.sentence} ${isUserMsg ? styles.user : styles.robot}`}
            key={`msg-${index}`}
          >
            <div className={styles.content}>
              {value}
              <div className={styles['loading-wrapper']}>
                {isAIReady &&
                (isUserTextLoading(user) || isAITextLoading(user)) &&
                index === msgHistory.length - 1 ? (
                  <Loading gap={3} className={styles.loading} dotClassName={styles.dot} />
                ) : (
                  ''
                )}
              </div>
            </div>
            {!isUserMsg && isInterrupted ? <Tag className={styles.interruptTag}>已打断</Tag> : ''}
          </div>
        );
      })}
    </div>
  );
}

export default Conversation;
