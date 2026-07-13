/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useEffect, useState } from 'react';

/**
 * @brief 将字符串包装成 TLV
 */
export const string2tlv = (str: string, type: string) => {
  const typeBuffer = new Uint8Array(4);

  for (let i = 0; i < type.length; i++) {
    typeBuffer[i] = type.charCodeAt(i);
  }

  const lengthBuffer = new Uint32Array(1);
  const valueBuffer = new TextEncoder().encode(str);

  lengthBuffer[0] = valueBuffer.length;

  const tlvBuffer = new Uint8Array(typeBuffer.length + 4 + valueBuffer.length);

  tlvBuffer.set(typeBuffer, 0);

  tlvBuffer[4] = (lengthBuffer[0] >> 24) & 0xff;
  tlvBuffer[5] = (lengthBuffer[0] >> 16) & 0xff;
  tlvBuffer[6] = (lengthBuffer[0] >> 8) & 0xff;
  tlvBuffer[7] = lengthBuffer[0] & 0xff;

  tlvBuffer.set(valueBuffer, 8);
  return tlvBuffer.buffer;
};

/**
 * @brief TLV 数据格式转换成字符串
 * @note TLV 数据格式
 * | magic number | length(big-endian) | value |
 * @param {ArrayBufferLike} tlvBuffer
 * @returns
 */
export const tlv2String = (tlvBuffer: ArrayBufferLike) => {
  const typeBuffer = new Uint8Array(tlvBuffer, 0, 4);
  const lengthBuffer = new Uint8Array(tlvBuffer, 4, 4);
  const valueBuffer = new Uint8Array(tlvBuffer, 8);

  let type = '';
  for (let i = 0; i < typeBuffer.length; i++) {
    type += String.fromCharCode(typeBuffer[i]);
  }

  const length =
    (lengthBuffer[0] << 24) | (lengthBuffer[1] << 16) | (lengthBuffer[2] << 8) | lengthBuffer[3];

  const value = new TextDecoder().decode(valueBuffer.subarray(0, length));

  return { type, value };
};

export const isMobile = () =>
  /Mobi|Android|iPhone|iPad|Windows Phone/i.test(window.navigator.userAgent) ||
  window?.innerWidth < 767;

export function useIsMobile() {
  const getIsMobile = () =>
    /Mobi|Android|iPhone|iPad|Windows Phone/i.test(window.navigator.userAgent) ||
    window.innerWidth < 767;

  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    const handleResize = () => {
      const value = getIsMobile();
      setIsMobile(value);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
