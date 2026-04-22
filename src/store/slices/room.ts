/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  AudioPropertiesInfo,
  LocalAudioStats,
  NetworkQuality,
  RemoteAudioStats,
} from '@volcengine/rtc';
import RtcClient from '@/lib/RtcClient';

export interface IUser {
  username?: string;
  userId?: string;
  publishAudio?: boolean;
  publishVideo?: boolean;
  publishScreen?: boolean;
  audioStats?: RemoteAudioStats;
  audioPropertiesInfo?: AudioPropertiesInfo;
}

export type LocalUser = Omit<IUser, 'audioStats'> & {
  loginToken?: string;
  audioStats?: LocalAudioStats;
};

export interface Msg {
  value: string;
  time: string;
  user: string;
  paragraph?: boolean;
  definite?: boolean;
  isInterrupted?: boolean;
}

export interface SceneConfig {
  id: string;
  icon?: string;
  name?: string;
  questions?: string[];
  botName: string;
  isVision: boolean;
  isScreenMode: boolean;
  isInterruptMode: boolean;
  isAvatarScene: boolean;
  avatarBgUrl: string;
}

export interface RTCConfig {
  AppId: string;
  RoomId: string;
  UserId: string;
  Token: string;
}

export interface RoomState {
  time: number;
  roomId?: string;
  localUser: LocalUser;
  remoteUsers: IUser[];
  autoPlayFailUser: string[];
  /**
   * @brief 是否已加房
   */
  isJoined: boolean;
  /**
   * @brief 选择的场景
   */
  scene: string;
  /**
   * @brief 场景下的配置
   */
  sceneConfigMap: Record<string, SceneConfig>;
  /**
   * @brief RTC 相关的配置
   */
  rtcConfigMap: Record<string, RTCConfig>;

  /**
   * @brief AI 通话是否启用
   */
  isAIGCEnable: boolean;
  /**
   * @brief AI 是否正在说话
   */
  isAITalking: boolean;
  /**
   * @brief AI 思考中
   */
  isAIThinking: boolean;
  /**
   * @brief 用户是否正在说话
   */
  isUserTalking: boolean;
  /**
   * @brief 网络质量
   */
  networkQuality: NetworkQuality;

  /**
   * @brief 对话记录
   */
  msgHistory: Msg[];

  /**
   * @brief 当前的对话
   */
  currentConversation: {
    [user: string]: {
      /**
       * @brief 实时对话内容
       */
      msg: string;
      /**
       * @brief 当前实时对话内容是否能被定义为 "问题"
       */
      definite: boolean;
    };
  };

  /**
   * @brief 是否显示字幕
   */
  isShowSubtitle: boolean;

  /**
   * @brief 是否全屏
   */
  isFullScreen: boolean;

  /**
   * @brief 自定义人设名称
   */
  customSceneName: string;
}

const initialState: RoomState = {
  time: -1,
  scene: '',
  sceneConfigMap: {},
  rtcConfigMap: {},
  remoteUsers: [],
  localUser: {
    publishAudio: false,
    publishVideo: false,
    publishScreen: false,
  },
  autoPlayFailUser: [],
  isJoined: false,
  isAIGCEnable: false,
  isAIThinking: false,
  isAITalking: false,
  isUserTalking: false,
  networkQuality: NetworkQuality.UNKNOWN,

  msgHistory: [],
  currentConversation: {},
  isShowSubtitle: true,
  isFullScreen: false,
  customSceneName: '',
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    localJoinRoom: (
      state,
      {
        payload,
      }: {
        payload: {
          roomId: string;
          user: LocalUser;
        };
      }
    ) => {
      state.roomId = payload.roomId;
      state.localUser = {
        ...state.localUser,
        ...payload.user,
      };
      state.isJoined = true;
    },
    localLeaveRoom: (state) => {
      state.roomId = undefined;
      state.time = -1;
      state.localUser = {
        publishAudio: false,
        publishVideo: false,
        publishScreen: false,
      };
      state.remoteUsers = [];
      state.isJoined = false;
    },
    remoteUserJoin: (state, { payload }) => {
      state.remoteUsers.push(payload);
    },
    remoteUserLeave: (state, { payload }) => {
      const findIndex = state.remoteUsers.findIndex((user) => user.userId === payload.userId);
      state.remoteUsers.splice(findIndex, 1);
    },

    updateScene: (state, { payload }) => {
      state.scene = payload;
    },

    updateSceneConfig: (state, { payload }) => {
      state.sceneConfigMap = payload;
    },

    updateRTCConfig: (state, { payload }) => {
      state.rtcConfigMap = payload;
      RtcClient.basicInfo = {
        app_id: payload[state.scene].AppId,
        room_id: payload[state.scene].RoomId,
        user_id: payload[state.scene].UserId,
        token: payload[state.scene].Token,
      };
    },

    updateLocalUser: (state, { payload }: { payload: Partial<LocalUser> }) => {
      state.localUser = {
        ...state.localUser,
        ...(payload || {}),
      };
    },

    updateNetworkQuality: (state, { payload }) => {
      state.networkQuality = payload.networkQuality;
    },

    updateRemoteUser: (state, { payload }: { payload: IUser | IUser[] }) => {
      if (!Array.isArray(payload)) {
        payload = [payload];
      }

      payload.forEach((user) => {
        const findIndex = state.remoteUsers.findIndex((u) => u.userId === user.userId);
        state.remoteUsers[findIndex] = {
          ...state.remoteUsers[findIndex],
          ...user,
        };
      });
    },

    updateRoomTime: (state, { payload }) => {
      state.time = payload.time;
    },

    addAutoPlayFail: (state, { payload }) => {
      const autoPlayFailUser = state.autoPlayFailUser;
      const index = autoPlayFailUser.findIndex((item) => item === payload.userId);
      if (index === -1) {
        state.autoPlayFailUser.push(payload.userId);
      }
    },
    removeAutoPlayFail: (state, { payload }) => {
      const autoPlayFailUser = state.autoPlayFailUser;
      const _autoPlayFailUser = autoPlayFailUser.filter((item) => item !== payload.userId);
      state.autoPlayFailUser = _autoPlayFailUser;
    },
    clearAutoPlayFail: (state) => {
      state.autoPlayFailUser = [];
    },
    updateAIGCState: (state, { payload }) => {
      state.isAIGCEnable = payload.isAIGCEnable;
    },
    updateAITalkState: (state, { payload }) => {
      state.isAIThinking = false;
      state.isUserTalking = false;
      state.isAITalking = payload.isAITalking;
    },
    updateAIThinkState: (state, { payload }) => {
      state.isAIThinking = payload.isAIThinking;
      state.isUserTalking = false;
    },
    clearHistoryMsg: (state) => {
      state.msgHistory = [];
    },
    setHistoryMsg: (state, { payload }) => {
      const { paragraph, definite } = payload;
      const lastMsg = state.msgHistory.at(-1)! || {};
      /** 是否需要再创建新句子 */
      const fromBot =
        payload.user === state.sceneConfigMap[state.scene].botName ||
        payload.user.includes('voiceChat_');
      /**
       * Bot 的语句：
       * 1. 在 SubtitleMode=0 时（未启用数字人时默认值），以 definite 判断是否需要追加新内容
       * 2. 在 SubtitleMode=1 时（启用数字人时强制设定为 1），以 paragraph 判断是否需要追加新内容
       * User 的语句以 paragraph 判断是否需要追加新内容
       */
      const currentSubtitleMode = state.sceneConfigMap[state.scene].isAvatarScene ? 1 : 0;
      const lastMsgCompleted =
        !fromBot || currentSubtitleMode ? lastMsg.paragraph : lastMsg.definite;

      if (state.msgHistory.length) {
        /** 如果上一句话是完整的则新增语句 */
        if (lastMsgCompleted) {
          state.msgHistory.push({
            value: payload.text,
            time: new Date().toString(),
            user: payload.user,
            definite,
            paragraph,
          });
        } else {
          /** 话未说完, 更新文字内容 */
          if (fromBot && currentSubtitleMode) {
            lastMsg.value += payload.text;
          } else {
            lastMsg.value = payload.text;
          }
          lastMsg.time = new Date().toString();
          lastMsg.paragraph = paragraph;
          lastMsg.definite = definite;
          lastMsg.user = payload.user;
        }
      } else {
        /** 首句话首字不会被打断 */
        state.msgHistory.push({
          value: payload.text,
          time: new Date().toString(),
          user: payload.user,
          paragraph,
        });
      }
    },
    setInterruptMsg: (state) => {
      state.isAITalking = false;
      if (!state.msgHistory.length) {
        return;
      }
      /** 找到最后一个末尾的字幕, 将其状态置换为打断 */
      for (let id = state.msgHistory.length - 1; id >= 0; id--) {
        const msg = state.msgHistory[id];
        if (msg.value) {
          if (!msg.definite) {
            state.msgHistory[id].isInterrupted = true;
          }
          break;
        }
      }
    },
    clearCurrentMsg: (state) => {
      state.currentConversation = {};
      state.msgHistory = [];
      state.isAITalking = false;
      state.isUserTalking = false;
    },
    updateShowSubtitle: (state, { payload }) => {
      state.isShowSubtitle = payload.isShowSubtitle;
    },
    updateFullScreen: (state, { payload }) => {
      state.isFullScreen = payload.isFullScreen;
    },
    updatecustomSceneName: (state, { payload }) => {
      state.customSceneName = payload.customSceneName;
    },
  },
});

export const {
  localJoinRoom,
  localLeaveRoom,
  remoteUserJoin,
  remoteUserLeave,
  updateRemoteUser,
  updateLocalUser,
  updateRoomTime,
  addAutoPlayFail,
  removeAutoPlayFail,
  clearAutoPlayFail,
  updateAIGCState,
  updateAITalkState,
  updateAIThinkState,
  setHistoryMsg,
  clearHistoryMsg,
  clearCurrentMsg,
  setInterruptMsg,
  updateNetworkQuality,
  updateScene,
  updateSceneConfig,
  updateRTCConfig,
  updateShowSubtitle,
  updateFullScreen,
  updatecustomSceneName,
} = roomSlice.actions;

export default roomSlice.reducer;
