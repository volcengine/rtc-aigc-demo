/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch } from 'react-redux';
import logger from './logger';
import {
  setHistoryMsg,
  setInterruptMsg,
  updateAITalkState,
  updateAIThinkState,
} from '@/store/slices/room';
import RtcClient from '@/lib/RtcClient';
import Utils from '@/utils/utils';

export type AnyRecord = Record<string, any>;

export enum MESSAGE_TYPE {
  BRIEF = 'conv',
  SUBTITLE = 'subv',
  FUNCTION_CALL = 'tool',
}

export enum AGENT_BRIEF {
  UNKNOWN,
  LISTENING,
  THINKING,
  SPEAKING,
  INTERRUPTED,
  FINISHED,
}

/**
 * @brief 指令类型
 */
export enum COMMAND {
  /**
   * @brief 打断指令
   */
  INTERRUPT = 'interrupt',
  /**
   * @brief 发送外部文本驱动 TTS
   */
  EXTERNAL_TEXT_TO_SPEECH = 'ExternalTextToSpeech',
  /**
   * @brief 发送外部文本驱动 LLM
   */
  EXTERNAL_TEXT_TO_LLM = 'ExternalTextToLLM',
}
/**
 * @brief 打断的类型
 */
export enum INTERRUPT_PRIORITY {
  /**
   * @brief 占位
   */
  NONE,
  /**
   * @brief 高优先级。传入信息直接打断交互，进行处理。
   */
  HIGH,
  /**
   * @brief 中优先级。等待当前交互结束后，进行处理。
   */
  MEDIUM,
  /**
   * @brief 低优先级。如当前正在发生交互，直接丢弃 Message 传入的信息。
   */
  LOW,
}

export const MessageTypeCode = {
  [MESSAGE_TYPE.SUBTITLE]: 1,
  [MESSAGE_TYPE.FUNCTION_CALL]: 2,
  [MESSAGE_TYPE.BRIEF]: 3,
};

export const useMessageHandler = () => {
  const dispatch = useDispatch();

  const maps = {
    /**
     * @brief 接收状态变化信息
     * @note https://www.volcengine.com/docs/6348/1415216?s=g
     */
    [MESSAGE_TYPE.BRIEF]: (parsed: AnyRecord) => {
      const { Stage } = parsed || {};
      const { Code, Description } = Stage || {};
      logger.debug(Code, Description);
      switch (Code) {
        case AGENT_BRIEF.THINKING:
          dispatch(updateAIThinkState({ isAIThinking: true }));
          break;
        case AGENT_BRIEF.SPEAKING:
          dispatch(updateAITalkState({ isAITalking: true }));
          break;
        case AGENT_BRIEF.FINISHED:
          dispatch(updateAITalkState({ isAITalking: false }));
          break;
        case AGENT_BRIEF.INTERRUPTED:
          dispatch(setInterruptMsg());
          break;
        default:
          break;
      }
    },
    /**
     * @brief 字幕
     * @note https://www.volcengine.com/docs/6348/1337284?s=g
     */
    [MESSAGE_TYPE.SUBTITLE]: (parsed: AnyRecord) => {
      console.log('💬 [DEBUG] 处理字幕消息:', parsed);
      const data = parsed.data?.[0] || {};
      /** debounce 记录用户输入文字 */
      if (data) {
        const { text: msg, definite, userId: user, paragraph } = data;
        console.log('💬 [DEBUG] 字幕数据:', { msg, user, paragraph, definite });
        logger.debug('handleRoomBinaryMessageReceived', data);
        if ((window as any)._debug_mode) {
          dispatch(setHistoryMsg({ msg, user, paragraph, definite }));
        } else {
          const isAudioEnable = RtcClient.getAudioBotEnabled();
          console.log('💬 [DEBUG] 音频机器人状态:', isAudioEnable);
          if (isAudioEnable) {
            console.log('💬 [DEBUG] 添加消息到历史:', { text: msg, user, paragraph, definite });
            dispatch(setHistoryMsg({ text: msg, user, paragraph, definite }));
          }
        }
      }
    },
    /**
     * @brief Function calling
     * @note https://www.volcengine.com/docs/6348/1359441?s=g
     */
    [MESSAGE_TYPE.FUNCTION_CALL]: (parsed: AnyRecord) => {
      const name: string = parsed?.tool_calls?.[0]?.function?.name;
      console.log('[Function Call] - Called by sendUserBinaryMessage');
      const map: Record<string, string> = {
        getcurrentweather: '今天下雪， 最低气温零下10度',
      };

      RtcClient.engine.sendUserBinaryMessage(
        'RobotMan_',
        Utils.string2tlv(
          JSON.stringify({
            ToolCallID: parsed?.tool_calls?.[0]?.id,
            Content: map[name.toLocaleLowerCase().replaceAll('_', '')],
          }),
          'func'
        )
      );
    },
  };

  return {
    parser: (buffer: ArrayBuffer) => {
      try {
        const { type, value } = Utils.tlv2String(buffer);
        maps[type as MESSAGE_TYPE]?.(JSON.parse(value));
      } catch (e) {
        logger.debug('parse error', e);
      }
    },
  };
};
