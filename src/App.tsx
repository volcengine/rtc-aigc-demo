/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
import '@arco-design/web-react/dist/css/arco.css';
import { useAtom, Provider } from 'jotai';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import theConfig from '@/config/the-config';
import { activePersonaAtom } from '@/store/atoms';
import logger from '@/utils/logger';
import MainPage from './pages/MainPage';

// 配置同步组件
function ConfigSync() {
  const [activePersona] = useAtom(activePersonaAtom);

  useEffect(() => {
    console.log('🔄 ConfigSync 触发，当前 activePersona:', {
      voice: activePersona.voice,
      model: activePersona.model,
      updatedAt: activePersona.updatedAt
    });
    
    console.log('📋 当前 theConfig 状态:', {
      VoiceType: theConfig.VoiceType,
      Model: theConfig.Model
    });

    // 同步 voice 到 theConfig
    if (activePersona.voice !== theConfig.VoiceType) {
      logger.log('🎵 同步音色配置:', { from: theConfig.VoiceType, to: activePersona.voice });
      theConfig.VoiceType = activePersona.voice;
      console.log('✅ 音色已同步，新的 theConfig.VoiceType:', theConfig.VoiceType);
    } else {
      console.log('⏭️ 音色无变化，跳过同步');
    }

    // 同步 model 到 theConfig  
    if (activePersona.model !== theConfig.Model) {
      logger.log('🤖 同步模型配置:', { from: theConfig.Model, to: activePersona.model });
      theConfig.Model = activePersona.model;
      console.log('✅ 模型已同步，新的 theConfig.Model:', theConfig.Model);
    } else {
      console.log('⏭️ 模型无变化，跳过同步');
    }

    // 同步 prompt 到 theConfig
    if (activePersona.prompt !== theConfig.Prompt) {
      logger.log('同步提示词配置:', { from: theConfig.Prompt, to: activePersona.prompt });
      theConfig.Prompt = activePersona.prompt;
      console.log('✅ 提示词已同步，新的 theConfig.Prompt:', theConfig.Prompt);
    } else {
      console.log('⏭️ 提示词无变化，跳过同步');
    }

    // 同步 welcome 到 theConfig
    if (activePersona.welcome !== theConfig.WelcomeSpeech) {
      logger.log('同步欢迎语配置:', { from: theConfig.WelcomeSpeech, to: activePersona.welcome });
      theConfig.WelcomeSpeech = activePersona.welcome;
      console.log('✅ 欢迎语已同步，新的 theConfig.WelcomeSpeech:', theConfig.WelcomeSpeech);
    } else {
      console.log('⏭️ 欢迎语无变化，跳过同步');
    }

    // 同步额外配置
    if (activePersona.extra?.modelMode && activePersona.extra.modelMode !== theConfig.ModeSourceType) {
      logger.log('同步模型模式配置:', { from: theConfig.ModeSourceType, to: activePersona.extra.modelMode });
      theConfig.ModeSourceType = activePersona.extra.modelMode;
      console.log('✅ 模型模式已同步，新的 theConfig.ModeSourceType:', theConfig.ModeSourceType);
    } else {
      console.log('⏭️ 模型模式无变化，跳过同步');
    }

    if (activePersona.extra?.url && activePersona.extra.url !== theConfig.Url) {
      logger.log('同步URL配置:', { from: theConfig.Url, to: activePersona.extra.url });
      theConfig.Url = activePersona.extra.url;
      console.log('✅ URL已同步，新的 theConfig.Url:', theConfig.Url);
    } else {
      console.log('⏭️ URL无变化，跳过同步');
    }

    if (activePersona.extra?.apiKey && activePersona.extra.apiKey !== theConfig.APIKey) {
      logger.log('同步API密钥配置:', { from: theConfig.APIKey, to: activePersona.extra.apiKey });
      theConfig.APIKey = activePersona.extra.apiKey;
      console.log('✅ API密钥已同步，新的 theConfig.APIKey:', theConfig.APIKey);
    } else {
      console.log('⏭️ API密钥无变化，跳过同步');
    }

    if (activePersona.extra?.botId && activePersona.extra.botId !== theConfig.BotID) {
      logger.log('同步机器人ID配置:', { from: theConfig.BotID, to: activePersona.extra.botId });
      theConfig.BotID = activePersona.extra.botId;
      console.log('✅ 机器人ID已同步，新的 theConfig.BotID:', theConfig.BotID);
    } else {
      console.log('⏭️ 机器人ID无变化，跳过同步');
    }

    // 同步语音合成配置
    if (activePersona.extra) {
      const voiceConfig = theConfig.VoiceSynthesisConfig;
      const extraConfig = activePersona.extra;

      if (extraConfig.encoding && extraConfig.encoding !== voiceConfig.encoding) {
        logger.log('同步编码配置:', { from: voiceConfig.encoding, to: extraConfig.encoding });
        voiceConfig.encoding = extraConfig.encoding;
        console.log('✅ 编码已同步，新的 voiceConfig.encoding:', voiceConfig.encoding);
      } else {
        console.log('⏭️ 编码无变化，跳过同步');
      }

      if (extraConfig.rate && extraConfig.rate !== voiceConfig.rate) {
        logger.log('同步采样率配置:', { from: voiceConfig.rate, to: extraConfig.rate });
        voiceConfig.rate = extraConfig.rate;
        console.log('✅ 采样率已同步，新的 voiceConfig.rate:', voiceConfig.rate);
      } else {
        console.log('⏭️ 采样率无变化，跳过同步');
      }

      if (extraConfig.bitRate && extraConfig.bitRate !== voiceConfig.bitrate) {
        logger.log('同步比特率配置:', { from: voiceConfig.bitrate, to: extraConfig.bitRate });
        voiceConfig.bitrate = extraConfig.bitRate;
        console.log('✅ 比特率已同步，新的 voiceConfig.bitrate:', voiceConfig.bitrate);
      } else {
        console.log('⏭️ 比特率无变化，跳过同步');
      }

      if (extraConfig.speedRatio && extraConfig.speedRatio !== voiceConfig.speedRatio) {
        logger.log('同步语速配置:', { from: voiceConfig.speedRatio, to: extraConfig.speedRatio });
        voiceConfig.speedRatio = extraConfig.speedRatio;
        console.log('✅ 语速已同步，新的 voiceConfig.speedRatio:', voiceConfig.speedRatio);
      } else {
        console.log('⏭️ 语速无变化，跳过同步');
      }

      if (extraConfig.loudnessRatio && extraConfig.loudnessRatio !== voiceConfig.loudnessRatio) {
        logger.log('同步音量配置:', { from: voiceConfig.loudnessRatio, to: extraConfig.loudnessRatio });
        voiceConfig.loudnessRatio = extraConfig.loudnessRatio;
        console.log('✅ 音量已同步，新的 voiceConfig.loudnessRatio:', voiceConfig.loudnessRatio);
      } else {
        console.log('⏭️ 音量无变化，跳过同步');
      }

      if (extraConfig.emotion && extraConfig.emotion !== voiceConfig.emotion) {
        logger.log('同步情感配置:', { from: voiceConfig.emotion, to: extraConfig.emotion });
        voiceConfig.emotion = extraConfig.emotion;
        console.log('✅ 情感已同步，新的 voiceConfig.emotion:', voiceConfig.emotion);
      } else {
        console.log('⏭️ 情感无变化，跳过同步');
      }

      if (extraConfig.enableEmotion !== undefined && extraConfig.enableEmotion !== voiceConfig.enableEmotion) {
        logger.log('同步情感开关配置:', { from: voiceConfig.enableEmotion, to: extraConfig.enableEmotion });
        voiceConfig.enableEmotion = extraConfig.enableEmotion;
        console.log('✅ 情感开关已同步，新的 voiceConfig.enableEmotion:', voiceConfig.enableEmotion);
      } else {
        console.log('⏭️ 情感开关无变化，跳过同步');
      }

      if (extraConfig.emotionScale && extraConfig.emotionScale !== voiceConfig.emotionScale) {
        logger.log('同步情感强度配置:', { from: voiceConfig.emotionScale, to: extraConfig.emotionScale });
        voiceConfig.emotionScale = extraConfig.emotionScale;
        console.log('✅ 情感强度已同步，新的 voiceConfig.emotionScale:', voiceConfig.emotionScale);
      } else {
        console.log('⏭️ 情感强度无变化，跳过同步');
      }

      if (extraConfig.silenceDuration && extraConfig.silenceDuration !== voiceConfig.silenceDuration) {
        logger.log('同步静默时长配置:', { from: voiceConfig.silenceDuration, to: extraConfig.silenceDuration });
        voiceConfig.silenceDuration = extraConfig.silenceDuration;
        console.log('✅ 静默时长已同步，新的 voiceConfig.silenceDuration:', voiceConfig.silenceDuration);
      } else {
        console.log('⏭️ 静默时长无变化，跳过同步');
      }

      // 高级配置
      if (extraConfig.advanced) {
        const advanced = extraConfig.advanced;
        
        if (advanced.withTimestamp !== undefined && advanced.withTimestamp !== voiceConfig.withTimestamp) {
          logger.log('同步时间戳配置:', { from: voiceConfig.withTimestamp, to: advanced.withTimestamp });
          voiceConfig.withTimestamp = advanced.withTimestamp;
          console.log('✅ 时间戳已同步，新的 voiceConfig.withTimestamp:', voiceConfig.withTimestamp);
        } else {
          console.log('⏭️ 时间戳无变化，跳过同步');
        }

        if (advanced.disableMarkdownFilter !== undefined && advanced.disableMarkdownFilter !== voiceConfig.disableMarkdownFilter) {
          logger.log('同步Markdown过滤配置:', { from: voiceConfig.disableMarkdownFilter, to: advanced.disableMarkdownFilter });
          voiceConfig.disableMarkdownFilter = advanced.disableMarkdownFilter;
          console.log('✅ Markdown过滤已同步，新的 voiceConfig.disableMarkdownFilter:', voiceConfig.disableMarkdownFilter);
        } else {
          console.log('⏭️ Markdown过滤无变化，跳过同步');
        }

        if (advanced.enableLatexTn !== undefined && advanced.enableLatexTn !== voiceConfig.enableLatexTn) {
          logger.log('同步LaTeX配置:', { from: voiceConfig.enableLatexTn, to: advanced.enableLatexTn });
          voiceConfig.enableLatexTn = advanced.enableLatexTn;
          console.log('✅ LaTeX已同步，新的 voiceConfig.enableLatexTn:', voiceConfig.enableLatexTn);
        } else {
          console.log('⏭️ LaTeX无变化，跳过同步');
        }

        if (advanced.enableCache !== undefined && advanced.enableCache !== voiceConfig.enableCache) {
          logger.log('同步缓存配置:', { from: voiceConfig.enableCache, to: advanced.enableCache });
          voiceConfig.enableCache = advanced.enableCache;
          console.log('✅ 缓存已同步，新的 voiceConfig.enableCache:', voiceConfig.enableCache);
        } else {
          console.log('⏭️ 缓存无变化，跳过同步');
        }
      }
    }
  }, [activePersona]);

  return null;
}

function App() {
  console.warn('运行问题可参考 README 内容进行排查');

  return (
    <Provider>
      <ConfigSync />
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
