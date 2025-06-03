/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import '@arco-design/web-react/dist/css/arco.css';
import { Provider } from 'jotai';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';

function App() {
  console.warn('运行问题可参考 README 内容进行排查');

  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<MainPage />} />
            <Route path="/*" element={<MainPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
