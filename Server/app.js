/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const { Signer } = require('@volcengine/openapi');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = new Koa();

app.use(cors({
  origin: '*'
}));

/**
 * @notes 在 https://console.volcengine.com/iam/keymanage/ 获取 AK/SK
 */
const ACCOUNT_INFO = {
  /**
   * @notes 必填, 在 https://console.volcengine.com/iam/keymanage/ 获取
   */
  accessKeyId: process.env.DOUBAO_AK,
  /**
   * @notes 必填, 在 https://console.volcengine.com/iam/keymanage/ 获取
   */
  secretKey: process.env.DOUBAO_SK,
}
console.log("ACCOUNT_INFO: ", ACCOUNT_INFO)
app.use(bodyParser());


app.use(async ctx => {
  /**
   * @brief 代理 AIGC 的 OpenAPI 请求
   */
  if (ctx.url.startsWith('/proxyAIGCFetch') && ctx.method.toLowerCase() === 'post') {
    const { Action, Version } = ctx.query || {};
    const body = ctx.request.body;

    /** 
     * 参考 https://github.com/volcengine/volc-sdk-nodejs 可获取更多 火山 TOP 网关 SDK 的使用方式
     */
    const openApiRequestData = {
      region: 'cn-north-1',
      method: 'POST',
      params: {
        Action,
        Version,
      },
      headers: {
        Host: 'rtc.volcengineapi.com',
        'Content-type': 'application/json',
      },
      body,
    };
    const signer = new Signer(openApiRequestData, "rtc");
    signer.addAuthorization(ACCOUNT_INFO);
    
    /** 参考 https://www.volcengine.com/docs/6348/69828 可获取更多 OpenAPI 的信息 */
    const result = await fetch(`https://rtc.volcengineapi.com?Action=${Action}&Version=${Version}`, {
      method: 'POST',
      headers: openApiRequestData.headers,
      body: JSON.stringify(body),
    });
    const volcResponse = await result.json();
    ctx.body = volcResponse;
  } else {
    ctx.body = '<h1>404 Not Found</h1>';
  }
});

app.listen(3001, () => {
  console.log('AIGC Server is running at http://localhost:3001');
});

