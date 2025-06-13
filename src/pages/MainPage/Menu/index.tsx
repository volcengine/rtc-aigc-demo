/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import VERTC from '@volcengine/rtc';
import { useEffect, useState } from 'react';
import { Tooltip, Typography } from '@arco-design/web-react';
import { useDispatch, useSelector } from 'react-redux';
import { useVisionMode } from '@/lib/useCommon';
import { RootState } from '@/store';
import RtcClient from '@/lib/RtcClient';
import Operation from './components/Operation';
import { getQuestionsByScene } from '@/config/personas';
import { COMMAND, INTERRUPT_PRIORITY } from '@/utils/handler';
import CameraArea from '../MainArea/Room/CameraArea';
import { setHistoryMsg, setInterruptMsg } from '@/store/slices/room';
import utils from '@/utils/utils';
import packageJson from '../../../../package.json';
import styles from './index.module.less';

function Menu() {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState('');
  const room = useSelector((state: RootState) => state.room);
  const scene = room.scene;
  const isJoined = room?.isJoined;
  const isVisionMode = useVisionMode();

  const handleQuestion = (que: string) => {
    RtcClient.commandAudioBot(COMMAND.EXTERNAL_TEXT_TO_LLM, INTERRUPT_PRIORITY.HIGH, que);
    setQuestion(que);
  };

  useEffect(() => {
    if (question && !room.isAITalking) {
      dispatch(setInterruptMsg());
      dispatch(
        setHistoryMsg({
          text: question,
          user: RtcClient.basicInfo.user_id,
          paragraph: true,
          definite: true,
        })
      );
      setQuestion('');
    }
  }, [question, room.isAITalking, dispatch]);

  return (
    <div className={styles.wrapper}>
      {isJoined && utils.isMobile() && isVisionMode ? (
        <div className={styles['mobile-camera-wrapper']}>
          <CameraArea className={styles['mobile-camera']} />
        </div>
      ) : null}
      <div className={`${styles.box} ${styles.info}`}>
        <div className={styles.bold}>Demo Version {packageJson.version}</div>
        <div className={styles.bold}>SDK Version {VERTC.getSdkVersion()}</div>
        {isJoined ? (
          <div className={styles.gray}>
            房间ID{' '}
            <Tooltip content={room.roomId || '-'}>
              <Typography.Paragraph
                ellipsis={{
                  rows: 1,
                  expandable: false,
                }}
                className={styles.value}
              >
                {room.roomId || '-'}
              </Typography.Paragraph>
            </Tooltip>
          </div>
        ) : (
          ''
        )}
      </div>
      {isJoined ? (
        <div className={`${styles.box} ${styles.questions}`}>
          <div className={styles.title}>点击下述问题进行提问:</div>
          {getQuestionsByScene(scene).map((question: string) => (
            <div onClick={() => handleQuestion(question)} className={styles.line} key={question}>
              {question}
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
      {isJoined ? <Operation /> : ''}
    </div>
  );
}

export default Menu;
