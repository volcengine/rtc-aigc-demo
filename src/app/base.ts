/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { Modal } from '@arco-design/web-react';

import { AIGC_PROXY_HOST } from '@/config/const';

type Headers = Record<string, string>;

/**
 * @brief Get
 * @param apiName
 * @param headers
 */
export const requestGetMethod = (apiBasicParams: string, headers = {}) => {
  return async (params: Record<string, any> = {}) => {
    const url = `${AIGC_PROXY_HOST}${apiBasicParams}&${Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&')}`;
    const res = await fetch(url, {
      headers: {
        ...headers,
      },
    });
    return res;
  };
};

/**
 * @brief Post
 * @param apiName
 * @param isJson
 * @param headers
 */
export const requestPostMethod = (
  apiBasicParams: string,
  isJson: boolean = true,
  headers: Headers = {}
) => {
  return async <T>(params: T) => {
    const res = await fetch(`${AIGC_PROXY_HOST}${apiBasicParams}`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: (isJson ? JSON.stringify(params) : params) as BodyInit,
    });
    return res;
  };
};

/**
 * @brief Handler
 * @param res
 */
export const resultHandler = (res: any) => {
  const { Result, ResponseMetadata } = res || {};
  if (Result === 'ok') {
    return Result;
  }
  const error = ResponseMetadata?.Error?.Message || Result;
  Modal.error({
    title: '接口调用错误',
    content: `[${ResponseMetadata?.Action}]Failed(Reason: ${error}), 请参考 README 文档排查问题。`,
  });
};
