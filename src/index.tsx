/**
 * Copyright 2022 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.less';
import App from './App';
import store from './store';
import './react-i18next-config';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);