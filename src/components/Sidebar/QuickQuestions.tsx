/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import RtcClient from '@/lib/RtcClient';
import { getQuestionsByScene } from '@/config/personas';
import { COMMAND, INTERRUPT_PRIORITY } from '@/utils/handler';
import { setHistoryMsg, setInterruptMsg } from '@/store/slices/room';
import styles from './QuickQuestions.module.less';

function QuickQuestions() {
  const dispatch = useDispatch();
  const [question, setQuestion] = useState('');
  const room = useSelector((state: RootState) => state.room);
  const scene = room.scene;
  const isJoined = room?.isJoined;

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

  if (!isJoined) {
    return (
      <div className={styles.placeholder}>
        <div className={styles.placeholderText}>请先加入房间</div>
      </div>
    );
  }

  return (
    <div className={styles.questions}>
      <div className={styles.title}>点击下述问题进行提问:</div>
      <div className={styles.questionList}>
        {getQuestionsByScene(scene).map((questionText: string) => (
          <div
            onClick={() => handleQuestion(questionText)}
            className={styles.questionItem}
            key={questionText}
          >
            {questionText}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickQuestions;
