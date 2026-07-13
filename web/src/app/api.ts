/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

/**
 * @brief Basic APIs
 */
export const BasicAPIs = [
  {
    action: 'getScenes',
    apiPath: '/getScenes',
    method: 'post',
  },
] as const;

/**
 * @brief Basic APIs
 */
export const AigcAPIs = [
  {
    action: 'StartVoiceChat',
    apiPath: '/proxy',
    method: 'post',
  },
  {
    action: 'StopVoiceChat',
    apiPath: '/proxy',
    method: 'post',
  },
] as const;
