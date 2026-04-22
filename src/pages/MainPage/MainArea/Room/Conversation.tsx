/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tag, Spin } from '@arco-design/web-react';
import { RootState } from '@/store';
import Loading from '@/components/Loading/HorizonLoading';
import { isMobile } from '@/utils/utils';
import { useScene } from '@/lib/useCommon';
import USER_AVATAR from '@/assets/img/userAvatar.png';
import styles from './index.module.less';
import AIAvatarReadying from '@/components/AIAvatarLoading';

const lines: (string | React.ReactNode)[] = [];

function Conversation(props: React.HTMLAttributes<HTMLDivElement> & { showSubtitle: boolean }) {
  const { className, showSubtitle, ...rest } = props;
  const room = useSelector((state: RootState) => state.room);
  const { msgHistory, isFullScreen } = room;
  const { userId } = useSelector((state: RootState) => state.room.localUser);
  const { isAITalking, isUserTalking, scene } = useSelector((state: RootState) => state.room);
  const isAIReady = msgHistory.length > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const { botName, icon, isAvatarScene } = useScene();

  const isUserTextLoading = (owner: string) => {
    return owner === userId && isUserTalking;
  };

  const isAITextLoading = (owner: string) => {
    return (owner === botName || owner.includes('voiceChat_')) && isAITalking;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [msgHistory.length]);

  return (
    <div
      ref={containerRef}
      className={`${styles.conversation} ${className} ${isFullScreen ? styles.fullScreen : ''} ${
        isMobile() ? styles.mobileConversation : ''
      }`}
      style={isAvatarScene && !isAIReady ? { justifyContent: 'center' } : {}}
      {...rest}
    >
      {lines.map((line) => line)}
      {!isAIReady ? (
        <div className={styles.aiReadying}>
          {isAvatarScene ? (
            <AIAvatarReadying />
          ) : (
            <>
              <Spin size={16} className={styles['aiReading-spin']} />
              AI 准备中, 请稍侯
            </>
          )}
        </div>
      ) : (
        ''
      )}
      {(showSubtitle ? msgHistory : [])?.map(({ value, user, isInterrupted }, index) => {
        const isUserMsg = user === userId;
        const isRobotMsg = user === botName || user.includes('voiceChat_');
        if (!isUserMsg && !isRobotMsg) {
          return '';
        }
        return (
          <div
            key={`msg-container-${index}`}
            className={styles.mobileLine}
            style={{ justifyContent: isUserMsg && isMobile() ? 'flex-end' : '' }}
          >
            {!isMobile() && (
              <div className={styles.msgName}>
                <div className={styles.avatar}>
                  <img src={isUserMsg ? USER_AVATAR : icon} alt="Avatar" />
                </div>
                {isUserMsg ? '我' : scene}
              </div>
            )}
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
          </div>
        );
      })}
    </div>
  );
}

export default Conversation;
