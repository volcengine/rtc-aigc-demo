/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import {
  Button,
  Drawer,
  Input,
  Message,
  Radio,
  Tooltip,
  Select,
  Slider,
  Switch,
} from '@arco-design/web-react';

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { useAtom, useAtomValue } from 'jotai';

import { IconExclamationCircle } from '@arco-design/web-react/icon';

import { StreamIndex } from '@volcengine/rtc';

import PersonaSelector from '../PersonaSelector';

import Config, {
  Icon,
  Name,
  SCENE,
  Prompt,
  Welcome,
  Voice,
  Model,
  AI_MODEL,
  MODEL_MODE,
  VOICE_INFO_MAP,
  VOICE_TYPE,
  VoiceTypeValues,
  VOICE_CATEGORIES,
  VOICE_BY_SCENARIO,
  DEFAULT_VOICE_CATEGORY,
  getVoicesByCategory,
  isVisionMode,
} from '@/config';

import TitleCard from '../TitleCard';

import CheckBoxSelector from '@/components/CheckBoxSelector';

import RtcClient from '@/lib/RtcClient';

import { clearHistoryMsg, updateAIConfig, updateModelMode, updateScene } from '@/store/slices/room';

import { RootState } from '@/store';

import utils from '@/utils/utils';

import { useDeviceState } from '@/lib/useCommon';

import {
  aiSettingsAtom,
  activePersonaAtom,
  sceneAtom,
  modelModeAtom,
  voiceAtom,
  modelAtom,
  selectedVoiceCategoryAtom,
  loadingAtom,
} from '@/store/atoms';

import VoiceTypeChangeSVG from '@/assets/img/VoiceTypeChange.svg';

import DoubaoModelSVG from '@/assets/img/DoubaoModel.svg';

import ModelChangeSVG from '@/assets/img/ModelChange.svg';

export interface IAISettingsProps {
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RadioGroup = Radio.Group;


function AISettings({ open, onCancel, onOk, embedded }: IAISettingsProps) {
  const dispatch = useDispatch();
  const { isVideoPublished, isScreenPublished, switchScreenCapture, switchCamera } =
    useDeviceState();
  const room = useSelector((state: RootState) => state.room);

  // 使用 Jotai atoms 替代本地状态
  const [aiSettings, setAiSettings] = useAtom(aiSettingsAtom);
  const [scene, setScene] = useAtom(sceneAtom);
  const [modelMode, setModelMode] = useAtom(modelModeAtom);
  const [voice, setVoice] = useAtom(voiceAtom);
  const [model, setModel] = useAtom(modelAtom);
  const [selectedVoiceCategory, setSelectedVoiceCategory] = useAtom(selectedVoiceCategoryAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const activePersona = useAtomValue(activePersonaAtom);

  const handleVoiceTypeChanged = (key: string) => {
    setVoice(key as VoiceTypeValues);
  };

  const handleChecked = (value: SCENE) => {
    setScene(value);
  };

  const handleUseThirdPart = (key: string) => {
    setModelMode(key as MODEL_MODE);
  };

  const handleUpdateConfig = async () => {
    dispatch(updateScene({ scene }));
    Config.ModeSourceType = modelMode;
    switch (modelMode) {
      case MODEL_MODE.ORIGINAL:
        Config.Url = undefined;
        Config.APIKey = undefined;
        break;
      case MODEL_MODE.COZE:
        if (!aiSettings.APIKey) {
          Message.error('访问令牌必填');
          return;
        }
        if (!aiSettings.BotID) {
          Message.error('智能体 ID 必填');
          return;
        }
        Config.APIKey = aiSettings.APIKey;
        Config.BotID = aiSettings.BotID;
        break;
      case MODEL_MODE.VENDOR:
        if (!aiSettings.Url) {
          Message.error('请输入正确的第三方模型地址');
          return;
        }
        if (!aiSettings.Url.startsWith('http://') && !aiSettings.Url.startsWith('https://')) {
          Message.error('第三方模型请求地址格式不正确, 请以 http:// 或 https:// 为开头');
          return;
        }
        Config.Url = aiSettings.Url;
        Config.APIKey = aiSettings.APIKey;
        break;
      default:
        break;
    }

    // 保存基本配置
    Config.Prompt = aiSettings.prompt;
    Config.WelcomeSpeech = aiSettings.welcome;
    Config.VoiceType = aiSettings.voice;
    Config.Model = aiSettings.model;

    // 保存语音合成配置
    Config.VoiceSynthesisConfig = {
      encoding: aiSettings.encoding,
      speedRatio: aiSettings.speedRatio,
      rate: aiSettings.rate,
      bitrate: aiSettings.bitrate,
      loudnessRatio: aiSettings.loudnessRatio,
      emotion: aiSettings.emotion,
      enableEmotion: aiSettings.enableEmotion,
      emotionScale: aiSettings.emotionScale,
      explicitLanguage: aiSettings.explicitLanguage,
      contextLanguage: aiSettings.contextLanguage,
      withTimestamp: aiSettings.withTimestamp,
      disableMarkdownFilter: aiSettings.disableMarkdownFilter,
      enableLatexTn: aiSettings.enableLatexTn,
      silenceDuration: aiSettings.silenceDuration,
      enableCache: aiSettings.enableCache,
    };

    setLoading(true);
    dispatch(updateModelMode(modelMode));
    dispatch(updateAIConfig(Config.aigcConfig));

    if (isVisionMode(aiSettings.model)) {
      switch (scene) {
        case SCENE.SCREEN_READER:
          /** 关摄像头，打开屏幕采集 */
          room.isJoined && isVideoPublished && switchCamera();
          Config.VisionSourceType = StreamIndex.STREAM_INDEX_SCREEN;
          break;
        default:
          /** 关屏幕采集，打开摄像头 */
          room.isJoined && !isVideoPublished && switchCamera();
          room.isJoined && isScreenPublished && switchScreenCapture();
          Config.VisionSourceType = StreamIndex.STREAM_INDEX_MAIN;
          break;
      }
    } else {
      /** 全关 */
      room.isJoined && isVideoPublished && switchCamera();
      room.isJoined && isScreenPublished && switchScreenCapture();
    }

    if (RtcClient.getAudioBotEnabled()) {
      dispatch(clearHistoryMsg());
      await RtcClient.updateAudioBot();
    }

    setLoading(false);
    onOk?.();
  };

  useEffect(() => {
    if (open) {
      setLoading(false);
    }
  }, [open, setLoading]);

  // 监听人设切换时同步场景
  useEffect(() => {
    if (scene !== room.scene) {
      dispatch(updateScene(scene));
    }
  }, [scene, dispatch, room.scene]);

  // 监听音色分类初始化
  useEffect(() => {
    const currentVoice = aiSettings.voice;
    if (currentVoice) {
      // 查找当前音色属于哪个类别
      for (const [category, voices] of Object.entries(VOICE_BY_SCENARIO)) {
        if (voices.some((v) => v.value === currentVoice)) {
          setSelectedVoiceCategory(category);
          break;
        }
      }
    }
  }, [aiSettings.voice, setSelectedVoiceCategory]);

  // 监听激活的人设变化，同步相关配置
  useEffect(() => {
    if (activePersona) {
      setAiSettings((prev) => ({
        ...prev,
        prompt: activePersona.prompt || prev.prompt,
        welcome: activePersona.welcome || prev.welcome,
      }));
    }
  }, [activePersona, setAiSettings]);

  const getVoiceCategoryData = () => {
    const categoryData: Record<string, any[]> = {};
    Object.keys(VOICE_BY_SCENARIO).forEach((category) => {
      categoryData[category] = VOICE_BY_SCENARIO[category].map((voice) => ({
        key: voice.value,
        label: voice.name,
        description: `${voice.language} - ${voice.name}`,
        icon: voice.icon || '',
        category,
      }));
    });
    return categoryData;
  };

  const renderContent = () => (
    <div className={embedded ? 'p-0 bg-transparent' : ''}>
      {/* 人设选择器 */}
      <PersonaSelector className="mb-6" />

      <div className="mt-4">
        <RadioGroup
          options={[
            {
              value: MODEL_MODE.ORIGINAL,
              label: '官方模型',
            },
            {
              value: MODEL_MODE.COZE,
              label: (
                <div className="flex items-center">
                  <span style={{ marginRight: '4px' }}>Coze</span>
                  <Tooltip
                    content={
                      <div>
                        访问令牌可参考{' '}
                        <a
                          href="https://www.coze.cn/open/docs/developer_guides/pat"
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'gray' }}
                        >
                          添加个人访问令牌
                        </a>{' '}
                        获取。
                        <br />
                        智能体 ID 可参考{' '}
                        <a
                          href="https://www.coze.cn/open/docs/developer_guides/coze_api_overview#c5ac4993"
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'gray' }}
                        >
                          发送请求
                        </a>{' '}
                        获取。
                        <br />
                        请注意智能体发布时须勾选 API 调用能力，否则无法成功对话。
                      </div>
                    }
                  >
                    <IconExclamationCircle />
                  </Tooltip>
                </div>
              ),
            },
            {
              value: MODEL_MODE.VENDOR,
              label: (
                <div className="flex items-center">
                  <span style={{ marginRight: '4px' }}>第三方模型</span>
                  <Tooltip
                    content={
                      <div>
                        如第三方模型使用失败, 可前往{' '}
                        <a
                          href="https://www.volcengine.com/docs/6348/1399966"
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'gray' }}
                        >
                          第三方模型接口验证工具
                        </a>{' '}
                        下载工具定位原因。
                      </div>
                    }
                  >
                    <IconExclamationCircle />
                  </Tooltip>
                </div>
              ),
            },
          ]}
          value={modelMode}
          size="mini"
          type="button"
          defaultValue="Beijing"
          className="mt-4"
          onChange={handleUseThirdPart}
        />

        <div
          className="my-4"
          style={{
            flexWrap: utils.isMobile() ? 'wrap' : 'nowrap',
          }}
        >
          <TitleCard title="音色">
            <CheckBoxSelector
              label="音色选择"
              categoryData={getVoiceCategoryData()}
              categories={VOICE_CATEGORIES}
              defaultCategory={DEFAULT_VOICE_CATEGORY}
              onChange={handleVoiceTypeChanged}
              value={aiSettings.voice}
              moreIcon={VoiceTypeChangeSVG}
              moreText="更换音色"
              placeHolder="请选择你需要的音色"
            />
          </TitleCard>

          <div className="mt-4">
            {modelMode === MODEL_MODE.ORIGINAL && (
              <TitleCard title="官方模型">
                <CheckBoxSelector
                  label="模型选择"
                  data={Object.keys(AI_MODEL).map((type) => ({
                    key: AI_MODEL[type as keyof typeof AI_MODEL],
                    label: type,
                    icon: '',
                  }))}
                  moreIcon={ModelChangeSVG}
                  moreText="更换模型"
                  placeHolder="请选择模型"
                  onChange={(key) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      model: key as AI_MODEL,
                    }));
                  }}
                  value={aiSettings.model}
                />
              </TitleCard>
            )}

            {modelMode === MODEL_MODE.VENDOR && (
              <>
                <TitleCard required title="第三方模型地址">
                  <Input.TextArea
                    autoSize
                    value={aiSettings.Url}
                    onChange={(val) => {
                      setAiSettings((prev) => ({
                        ...prev,
                        Url: val,
                      }));
                    }}
                    placeholder="请输入第三方模型地址"
                  />
                </TitleCard>
                <TitleCard title="请求密钥">
                  <Input.TextArea
                    autoSize
                    value={aiSettings.APIKey}
                    onChange={(val) => {
                      setAiSettings((prev) => ({
                        ...prev,
                        APIKey: val,
                      }));
                    }}
                    placeholder="请输入请求密钥"
                  />
                </TitleCard>
                <TitleCard title="模型名称">
                  <Input.TextArea
                    autoSize
                    value={aiSettings.customModelName}
                    onChange={(val) => {
                      setAiSettings((prev) => ({
                        ...prev,
                        customModelName: val,
                      }));
                    }}
                    placeholder="请输入模型名称"
                  />
                </TitleCard>
              </>
            )}
            {modelMode === MODEL_MODE.COZE && (
              <>
                <TitleCard required title="请求地址">
                  <Input.TextArea autoSize disabled value="https://api.coze.cn" />
                </TitleCard>
                <TitleCard required title="访问令牌">
                  <Input.TextArea
                    autoSize
                    value={aiSettings.APIKey}
                    onChange={(val) => {
                      setAiSettings((prev) => ({
                        ...prev,
                        APIKey: val,
                      }));
                    }}
                    placeholder="请输入访问令牌"
                  />
                </TitleCard>
                <TitleCard required title="智能体 ID">
                  <Input.TextArea
                    autoSize
                    value={aiSettings.BotID}
                    onChange={(val) => {
                      setAiSettings((prev) => ({
                        ...prev,
                        BotID: val,
                      }));
                    }}
                    placeholder="请输入智能体 ID"
                  />
                </TitleCard>
              </>
            )}
          </div>
        </div>

        <TitleCard title="系统 Prompt">
          <Input.TextArea
            autoSize
            value={aiSettings.prompt}
            onChange={(val) => {
              setAiSettings((prev) => ({
                ...prev,
                prompt: val,
              }));
            }}
            placeholder="请输入你需要的 Prompt 设定"
          />
        </TitleCard>
        <TitleCard title="欢迎语">
          <Input.TextArea
            autoSize
            value={aiSettings.welcome}
            onChange={(val) => {
              setAiSettings((prev) => ({
                ...prev,
                welcome: val,
              }));
            }}
            placeholder="请输入欢迎语"
          />
        </TitleCard>

        {/* 新增语音合成配置区域 */}
        <div className="mt-4">
          <div
            className="text-lg font-semibold leading-7 text-gray-900"
            style={{ marginTop: '24px', marginBottom: '16px' }}
          >
            语音合成参数配置
          </div>

          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="音频编码格式">
              <Select
                value={aiSettings.encoding}
                onChange={(val) => {
                  setAiSettings((prev) => ({
                    ...prev,
                    encoding: val,
                  }));
                }}
                options={[
                  { label: 'MP3', value: 'mp3' },
                  { label: 'WAV', value: 'wav' },
                  { label: 'PCM', value: 'pcm' },
                  { label: 'OGG Opus', value: 'ogg_opus' },
                ]}
                placeholder="选择音频编码格式"
                style={{ width: '100%' }}
              />
            </TitleCard>

            <TitleCard title="音频采样率">
              <Select
                value={aiSettings.rate}
                onChange={(val) => {
                  setAiSettings((prev) => ({
                    ...prev,
                    rate: val,
                  }));
                }}
                options={[
                  { label: '8000 Hz', value: 8000 },
                  { label: '16000 Hz', value: 16000 },
                  { label: '24000 Hz', value: 24000 },
                ]}
                placeholder="选择采样率"
                style={{ width: '100%' }}
              />
            </TitleCard>
          </div>

          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="比特率 (kb/s)">
              <Input
                type="number"
                value={aiSettings.bitrate.toString()}
                min={64}
                max={320}
                onChange={(val) => {
                  setAiSettings((prev) => ({
                    ...prev,
                    bitrate: parseInt(val) || 160,
                  }));
                }}
                placeholder="比特率"
              />
            </TitleCard>

            <TitleCard title="语速调节">
              <div>
                <Slider
                  value={aiSettings.speedRatio}
                  min={0.8}
                  max={2.0}
                  step={0.1}
                  onChange={(val) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      speedRatio: Array.isArray(val) ? val[0] : val,
                    }));
                  }}
                  marks={{
                    0.8: '0.8x',
                    1.0: '1.0x',
                    1.2: '1.2x',
                    1.5: '1.5x',
                    2.0: '2.0x',
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  当前: {aiSettings.speedRatio}x
                </div>
              </div>
            </TitleCard>
          </div>

          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="音量调节">
              <div>
                <Slider
                  value={aiSettings.loudnessRatio}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  onChange={(val) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      loudnessRatio: Array.isArray(val) ? val[0] : val,
                    }));
                  }}
                  marks={{
                    0.5: '0.5x',
                    1.0: '1.0x',
                    1.5: '1.5x',
                    2.0: '2.0x',
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  当前: {aiSettings.loudnessRatio}x
                </div>
              </div>
            </TitleCard>

            <TitleCard title="句尾静音 (ms)">
              <Input
                type="number"
                value={aiSettings.silenceDuration.toString()}
                min={0}
                max={30000}
                onChange={(val) => {
                  setAiSettings((prev) => ({
                    ...prev,
                    silenceDuration: parseInt(val) || 0,
                  }));
                }}
                placeholder="句尾静音时长"
              />
            </TitleCard>
          </div>

          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="语种设置">
              <Select
                value={aiSettings.explicitLanguage}
                onChange={(val) => {
                  setAiSettings((prev) => ({
                    ...prev,
                    explicitLanguage: val,
                  }));
                }}
                options={[
                  { label: '自动识别', value: '' },
                  { label: '中文为主（支持中英混）', value: 'zh' },
                  { label: '仅英文', value: 'en' },
                  { label: '仅日文', value: 'ja' },
                  { label: '仅墨西哥语', value: 'es-mx' },
                  { label: '仅印尼语', value: 'id' },
                  { label: '仅巴西葡萄牙语', value: 'pt-br' },
                  { label: '多语种前端', value: 'crosslingual' },
                ]}
                placeholder="选择语种"
                style={{ width: '100%' }}
              />
            </TitleCard>

            <TitleCard title="参考语种">
              <Select
                value={aiSettings.contextLanguage}
                onChange={(val) => {
                  setAiSettings((prev) => ({
                    ...prev,
                    contextLanguage: val,
                  }));
                }}
                options={[
                  { label: '默认', value: '' },
                  { label: '印尼语', value: 'id' },
                  { label: '墨西哥语', value: 'es' },
                  { label: '巴西葡萄牙语', value: 'pt' },
                ]}
                placeholder="选择参考语种"
                style={{ width: '100%' }}
              />
            </TitleCard>
          </div>

          <TitleCard title="情感设置">
            <div className="mt-2">
              <div className="flex items-center">
                <Switch
                  checked={aiSettings.enableEmotion}
                  onChange={(checked) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      enableEmotion: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用音色情感</span>
              </div>

              {aiSettings.enableEmotion && (
                <>
                  <div style={{ marginTop: '12px' }}>
                    <Input
                      value={aiSettings.emotion}
                      onChange={(val) => {
                        setAiSettings((prev) => ({
                          ...prev,
                          emotion: val,
                        }));
                      }}
                      placeholder="输入情感类型，如: happy, sad, angry, excited"
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      情绪强度 (1-5): {aiSettings.emotionScale}
                    </div>
                    <Slider
                      value={aiSettings.emotionScale}
                      min={1}
                      max={5}
                      step={1}
                      onChange={(val) => {
                        setAiSettings((prev) => ({
                          ...prev,
                          emotionScale: Array.isArray(val) ? val[0] : val,
                        }));
                      }}
                      marks={{
                        1: '1',
                        2: '2',
                        3: '3',
                        4: '4',
                        5: '5',
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </TitleCard>

          <TitleCard title="高级选项">
            <div className="mt-2">
              <div className="flex items-center">
                <Switch
                  checked={aiSettings.withTimestamp}
                  onChange={(checked) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      withTimestamp: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用时间戳</span>
              </div>

              <div className="flex items-center">
                <Switch
                  checked={aiSettings.disableMarkdownFilter}
                  onChange={(checked) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      disableMarkdownFilter: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用 Markdown 解析过滤</span>
              </div>

              <div className="flex items-center">
                <Switch
                  checked={aiSettings.enableLatexTn}
                  onChange={(checked) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      enableLatexTn: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用 LaTeX 公式播报</span>
              </div>

              <div className="flex items-center">
                <Switch
                  checked={aiSettings.enableCache}
                  onChange={(checked) => {
                    setAiSettings((prev) => ({
                      ...prev,
                      enableCache: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用缓存加速</span>
              </div>
            </div>
          </TitleCard>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return renderContent();
  }

  return (
    <Drawer
      width={utils.isMobile() ? '100%' : 940}
      closable={false}
      maskClosable={false}
      title={null}
      className="p-4"
      style={{
        padding: utils.isMobile() ? '0px' : '16px 8px',
      }}
      footer={
        <div className="flex flex-row justify-end items-center gap-2">
          <div className="text-xs font-normal leading-5 text-gray-500">
            AI 配置修改后，退出房间将不再保存该配置方案
          </div>
          <Button loading={loading} className="bg-gray-200 hover:bg-gray-300" onClick={onCancel}>
            取消
          </Button>
          <Button
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleUpdateConfig}
          >
            确定
          </Button>
        </div>
      }
      visible={open}
      onCancel={onCancel}
    >
      {renderContent()}
    </Drawer>
  );
}

export default AISettings;
