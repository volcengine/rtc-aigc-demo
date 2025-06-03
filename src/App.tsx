/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'jotai';
import { useEffect, useState } from 'react';
import MainPage from './pages/MainPage';
import { preloadAllPrompts } from './config/common';
import '@arco-design/web-react/dist/css/arco.css';

function App() {
  const [promptsLoaded, setPromptsLoaded] = useState(false);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        await preloadAllPrompts();
        setPromptsLoaded(true);
      } catch (error) {
        console.error('Failed to preload prompts:', error);
        // 即使加载失败也允许应用继续运行
        setPromptsLoaded(true);
      }
    };

    loadPrompts();
  }, []);

  console.warn('运行问题可参考 README 内容进行排查');

  // 显示加载状态
  if (!promptsLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px'
      }}>
        正在加载 AI 人设配置...
      </div>
    );
  }

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
