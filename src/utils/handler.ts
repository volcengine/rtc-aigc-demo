/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch } from 'react-redux';
import logger from './logger';
import { setCurrentMsg, setHistoryMsg } from '@/store/slices/room';
import RtcClient from '@/lib/RtcClient';
import Utils from '@/utils/utils';

export type AnyRecord = Record<string, any>;

export enum MESSAGE_TYPE {
  BRIEF = 'conv',
  SUBTITLE = 'subv',
  FUNCTION_CALL = 'func',
}

export enum AGENT_BRIEF {
  UNKNOWN,
  LISTENING,
  THINKING,
  SPEAKING,
  INTERRUPTED,
  FINISHED,
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
     * @note https://www.volcengine.com/docs/6348/1415216
     */
    [MESSAGE_TYPE.BRIEF]: (parsed: AnyRecord) => {
      const { Stage } = parsed || {};
      const { Code, Description } = Stage || {};
      logger.debug(Code, Description);
    },
    /**
     * @brief 字幕
     * @note https://www.volcengine.com/docs/6348/1337284
     */
    [MESSAGE_TYPE.SUBTITLE]: (parsed: AnyRecord) => {
      const data = parsed.data?.[0] || {};
      /** debounce 记录用户输入文字 */
      if (data) {
        const { text: msg, definite, userId: user, paragraph } = data;
        logger.debug('handleRoomBinaryMessageReceived', data);
        if ((window as any)._debug_mode) {
          dispatch(setHistoryMsg({ msg, user, paragraph, definite }));
        } else {
          const isAudioEnable = RtcClient.getAudioBotEnabled();
          if (isAudioEnable) {
            dispatch(setHistoryMsg({ text: msg, user, paragraph, definite }));
          }
        }
        dispatch(setCurrentMsg({ msg, definite, user, paragraph }));
      }
    },
    /**
     * @brief Function calling
     * @note https://www.volcengine.com/docs/6348/1359441
     */
    [MESSAGE_TYPE.FUNCTION_CALL]: (parsed: AnyRecord) => {
      const name: string = parsed?.tool_calls?.[0]?.function?.name;
      console.log('[Function Call] - Called by sendUserBinaryMessage');
      const map: Record<string, string> = {
        getcurrentweather: '今天下雪， 最低气温零下10度',
        musicplayer: '查询到李四的歌曲， 名称是千里之内',
        sendmessage: '发送成功',
      };

      RtcClient.engine.sendUserBinaryMessage(
        'RobotMan_',
        Utils.string2tlv(
          JSON.stringify({
            ToolCallID: parsed?.tool_calls?.[0]?.id,
            Content: map[name.toLocaleLowerCase().replaceAll('_', '')],
          })
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