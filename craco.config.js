/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // 添加 Less 支持
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      if (oneOfRule) {
        const lessRule = {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        };

        const lessModuleRule = {
          test: /\.module\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]--[hash:base64:5]',
                },
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        };

        // 在 file-loader 之前插入 Less 规则
        const fileLoaderIndex = oneOfRule.oneOf.findIndex(
          (rule) => rule.loader && rule.loader.includes('file-loader')
        );
        oneOfRule.oneOf.splice(fileLoaderIndex, 0, lessRule, lessModuleRule);
      }

      return webpackConfig;
    },
  },
};
