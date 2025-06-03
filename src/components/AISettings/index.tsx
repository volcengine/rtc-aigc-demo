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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAtom } from 'jotai';
import { IconExclamationCircle } from '@arco-design/web-react/icon';
import { StreamIndex } from '@volcengine/rtc';
import CheckIcon from '../CheckIcon';
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
import { aiSettingsAtom } from '@/store/atoms';

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

const SCENES = [
  SCENE.INTELLIGENT_ASSISTANT,
  SCENE.SCREEN_READER,
  SCENE.VIRTUAL_GIRL_FRIEND,
  SCENE.TRANSLATE,
  SCENE.CHILDREN_ENCYCLOPEDIA,
  SCENE.CUSTOMER_SERVICE,
  SCENE.TEACHING_ASSISTANT,
  SCENE.CUSTOM,
];

function AISettings({ open, onCancel, onOk, embedded }: IAISettingsProps) {
  const dispatch = useDispatch();
  const { isVideoPublished, isScreenPublished, switchScreenCapture, switchCamera } =
    useDeviceState();
  const room = useSelector((state: RootState) => state.room);
  const [loading, setLoading] = useState(false);
  const [modelMode, setModelMode] = useState<MODEL_MODE>(room.modelMode);
  const [scene, setScene] = useState(room.scene);
  const [selectedVoiceCategory, setSelectedVoiceCategory] = useState<string>(DEFAULT_VOICE_CATEGORY);
  const [data, setData] = useState<{
    prompt: string;
    welcome: string;
    voice: VoiceTypeValues;
    model: AI_MODEL;
    Url: string;
    APIKey: string;
    customModelName: string;
    BotID: string;
    encoding: string;
    speedRatio: number;
    rate: number;
    bitrate: number;
    loudnessRatio: number;
    emotion: string;
    enableEmotion: boolean;
    emotionScale: number;
    explicitLanguage: string;
    contextLanguage: string;
    withTimestamp: boolean;
    disableMarkdownFilter: boolean;
    enableLatexTn: boolean;
    silenceDuration: number;
    enableCache: boolean;
  }>({
    prompt: Config.Prompt || Prompt[scene],
    welcome: Config.WelcomeSpeech || Welcome[scene],
    voice: Config.VoiceType || Voice[scene],
    model: Config.Model || Model[scene],

    Url: Config.Url || '',
    APIKey: Config.APIKey || '',
    customModelName: (Config.Model || '') as string,

    BotID: Config.BotID || '',

    encoding: 'mp3',
    speedRatio: 1.0,
    rate: 24000,
    bitrate: 160,
    loudnessRatio: 1.0,
    emotion: '',
    enableEmotion: false,
    emotionScale: 4,
    explicitLanguage: '',
    contextLanguage: '',
    withTimestamp: false,
    disableMarkdownFilter: false,
    enableLatexTn: false,
    silenceDuration: 0,
    enableCache: false,
  });

  const [aiSettings, setAiSettings] = useAtom(aiSettingsAtom);

  const handleVoiceTypeChanged = (key: string) => {
    setData((prev) => ({
      ...prev,
      voice: key as VoiceTypeValues,
    }));

    // 同步更新 jotai 状态
    setAiSettings((prevSettings) => ({
      ...prevSettings,
      voice: key as VoiceTypeValues,
    }));
  };

  const handleVoiceCategoryChanged = (category: string) => {
    setSelectedVoiceCategory(category);
    // 切换类别时，自动选择该类别下的第一个音色
    const voicesInCategory = getVoicesByCategory(category);
    if (voicesInCategory.length > 0) {
      const firstVoice = voicesInCategory[0].value;
      handleVoiceTypeChanged(firstVoice);
    }
  };

  const handleChecked = (checkedScene: SCENE) => {
    setScene(checkedScene);
    setData((prev) => ({
      ...prev,
      prompt: Prompt[checkedScene],
      welcome: Welcome[checkedScene],
      voice: Voice[checkedScene],
      model: Model[checkedScene],
    }));

    // 同步更新 jotai 状态
    setAiSettings((prevSettings) => ({
      ...prevSettings,
      scene: checkedScene,
      prompt: Prompt[checkedScene],
      welcome: Welcome[checkedScene],
      voice: Voice[checkedScene],
      model: Model[checkedScene],
    }));
  };

  const handleUseThirdPart = (val: MODEL_MODE) => {
    setModelMode(val);
    Config.ModeSourceType = val;

    // 同步更新 jotai 状态
    setAiSettings((prevSettings) => ({
      ...prevSettings,
      modelMode: val,
    }));
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
        if (!data.APIKey) {
          Message.error('访问令牌必填');
          return;
        }
        if (!data.BotID) {
          Message.error('智能体 ID 必填');
          return;
        }
        Config.APIKey = data.APIKey;
        Config.BotID = data.BotID;
        break;
      case MODEL_MODE.VENDOR:
        if (!data.Url) {
          Message.error('请输入正确的第三方模型地址');
          return;
        }
        if (!data.Url.startsWith('http://') && !data.Url.startsWith('https://')) {
          Message.error('第三方模型请求地址格式不正确, 请以 http:// 或 https:// 为开头');
          return;
        }
        Config.Url = data.Url;
        Config.APIKey = data.APIKey;
        break;
      default:
        break;
    }

    // 保存基本配置
    Config.Prompt = data.prompt;
    Config.WelcomeSpeech = data.welcome;
    Config.VoiceType = data.voice;
    Config.Model = data.model;

    // 保存语音合成配置
    Config.VoiceSynthesisConfig = {
      encoding: data.encoding,
      speedRatio: data.speedRatio,
      rate: data.rate,
      bitrate: data.bitrate,
      loudnessRatio: data.loudnessRatio,
      emotion: data.emotion,
      enableEmotion: data.enableEmotion,
      emotionScale: data.emotionScale,
      explicitLanguage: data.explicitLanguage,
      contextLanguage: data.contextLanguage,
      withTimestamp: data.withTimestamp,
      disableMarkdownFilter: data.disableMarkdownFilter,
      enableLatexTn: data.enableLatexTn,
      silenceDuration: data.silenceDuration,
      enableCache: data.enableCache,
    };

    setLoading(true);
    dispatch(updateModelMode(modelMode));
    dispatch(updateAIConfig(Config.aigcConfig));

    if (isVisionMode(data.model)) {
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

    // 同步完整的配置到 jotai 状态
    setAiSettings({
      scene,
      modelMode,
      prompt: data.prompt,
      welcome: data.welcome,
      voice: data.voice,
      model: data.model,
      Url: data.Url,
      APIKey: data.APIKey,
      customModelName: data.customModelName,
      BotID: data.BotID,
      encoding: data.encoding,
      speedRatio: data.speedRatio,
      rate: data.rate,
      bitrate: data.bitrate,
      loudnessRatio: data.loudnessRatio,
      emotion: data.emotion,
      enableEmotion: data.enableEmotion,
      emotionScale: data.emotionScale,
      explicitLanguage: data.explicitLanguage,
      contextLanguage: data.contextLanguage,
      withTimestamp: data.withTimestamp,
      disableMarkdownFilter: data.disableMarkdownFilter,
      enableLatexTn: data.enableLatexTn,
      silenceDuration: data.silenceDuration,
      enableCache: data.enableCache,
    });

    setLoading(false);
    onOk?.();
  };

  useEffect(() => {
    if (open) {
      setScene(room.scene);
    }
  }, [open, room.scene]);

  // 初始化时从 jotai 状态同步数据
  useEffect(() => {
    if (open) {
      // 从 jotai 状态或配置中读取数据
      const initialData = {
        prompt: aiSettings.prompt || Config.Prompt || Prompt[scene],
        welcome: aiSettings.welcome || Config.WelcomeSpeech || Welcome[scene],
        voice: aiSettings.voice || Config.VoiceType || Voice[scene],
        model: aiSettings.model || Config.Model || Model[scene],
        Url: aiSettings.Url || Config.Url || '',
        APIKey: aiSettings.APIKey || Config.APIKey || '',
        customModelName: aiSettings.customModelName || ((Config.Model || '') as string),
        BotID: aiSettings.BotID || Config.BotID || '',
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

      setData(initialData);
      setModelMode(aiSettings.modelMode || room.modelMode);
      setScene(aiSettings.scene || room.scene);
    }
  }, [aiSettings, open, scene, room.modelMode, room.scene]);

  // 初始化音色类别 - 根据当前选中的音色找到对应的类别
  useEffect(() => {
    const currentVoice = data.voice;
    if (currentVoice) {
      // 查找当前音色属于哪个类别
      for (const [category, voices] of Object.entries(VOICE_BY_SCENARIO)) {
        if (voices.some((voice) => voice.value === currentVoice)) {
          setSelectedVoiceCategory(category);
          break;
        }
      }
    }
  }, [data.voice]);

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
      <div className="text-lg font-semibold leading-7 text-gray-900">
        选择你所需要的
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {' '}
          AI 人设
        </span>
      </div>
      <div className="text-xs font-normal leading-5 text-gray-500 mt-1.5">
        我们已为您配置好对应人设的基本参数，您也可以根据自己的需求进行自定义设置
      </div>

      <div className={'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2'}>
        {[...SCENES, null].map((key) =>
          key ? (
            <CheckIcon
              key={key}
              icon={Icon[key as keyof typeof Icon]}
              title={Name[key as keyof typeof Name]}
              checked={key === scene}
              blur={key !== scene && key === SCENE.CUSTOM}
              onClick={() => handleChecked(key as SCENE)}
            />
          ) : utils.isMobile() ? (
            <div className="w-20 h-20" />
          ) : null
        )}
      </div>

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
              value={data.voice}
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
                    setData((prev) => ({
                      ...prev,
                      model: key as AI_MODEL,
                    }));
                  }}
                  value={data.model}
                />
              </TitleCard>
            )}

            {modelMode === MODEL_MODE.VENDOR && (
              <>
                <TitleCard required title="第三方模型地址">
                  <Input.TextArea
                    autoSize
                    value={data.Url}
                    onChange={(val) => {
                      setData((prev) => ({
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
                    value={data.APIKey}
                    onChange={(val) => {
                      setData((prev) => ({
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
                    value={data.customModelName}
                    onChange={(val) => {
                      setData((prev) => ({
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
                    value={data.APIKey}
                    onChange={(val) => {
                      setData((prev) => ({
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
                    value={data.BotID}
                    onChange={(val) => {
                      setData((prev) => ({
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
            value={data.prompt}
            onChange={(val) => {
              setData((prev) => ({
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
            value={data.welcome}
            onChange={(val) => {
              setData((prev) => ({
                ...prev,
                welcome: val,
              }));
            }}
            placeholder="请输入欢迎语"
          />
        </TitleCard>
        
        {/* 新增语音合成配置区域 */}
        <div className="mt-4">
          <div className="text-lg font-semibold leading-7 text-gray-900" style={{ marginTop: '24px', marginBottom: '16px' }}>
            语音合成参数配置
          </div>
          
          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="音频编码格式">
              <Select
                value={data.encoding}
                onChange={(val) => {
                  setData((prev) => ({
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
                value={data.rate}
                onChange={(val) => {
                  setData((prev) => ({
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
                value={data.bitrate.toString()}
                min={64}
                max={320}
                onChange={(val) => {
                  setData((prev) => ({
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
                  value={data.speedRatio}
                  min={0.8}
                  max={2.0}
                  step={0.1}
                  onChange={(val) => {
                    setData((prev) => ({
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
                  当前: {data.speedRatio}x
                </div>
              </div>
            </TitleCard>
          </div>
          
          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="音量调节">
              <div>
                <Slider
                  value={data.loudnessRatio}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  onChange={(val) => {
                    setData((prev) => ({
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
                  当前: {data.loudnessRatio}x
                </div>
              </div>
            </TitleCard>
            
            <TitleCard title="句尾静音 (ms)">
              <Input
                type="number"
                value={data.silenceDuration.toString()}
                min={0}
                max={30000}
                onChange={(val) => {
                  setData((prev) => ({
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
                value={data.explicitLanguage}
                onChange={(val) => {
                  setData((prev) => ({
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
                value={data.contextLanguage}
                onChange={(val) => {
                  setData((prev) => ({
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
                  checked={data.enableEmotion}
                  onChange={(checked) => {
                    setData((prev) => ({
                      ...prev,
                      enableEmotion: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用音色情感</span>
              </div>
              
              {data.enableEmotion && (
                <>
                  <div style={{ marginTop: '12px' }}>
                    <Input
                      value={data.emotion}
                      onChange={(val) => {
                        setData((prev) => ({
                          ...prev,
                          emotion: val,
                        }));
                      }}
                      placeholder="输入情感类型，如: happy, sad, angry, excited"
                    />
                  </div>
                  
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>情绪强度 (1-5): {data.emotionScale}</div>
                    <Slider
                      value={data.emotionScale}
                      min={1}
                      max={5}
                      step={1}
                      onChange={(val) => {
                        setData((prev) => ({
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
                  checked={data.withTimestamp}
                  onChange={(checked) => {
                    setData((prev) => ({
                      ...prev,
                      withTimestamp: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用时间戳</span>
              </div>
              
              <div className="flex items-center">
                <Switch
                  checked={data.disableMarkdownFilter}
                  onChange={(checked) => {
                    setData((prev) => ({
                      ...prev,
                      disableMarkdownFilter: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用 Markdown 解析过滤</span>
              </div>
              
              <div className="flex items-center">
                <Switch
                  checked={data.enableLatexTn}
                  onChange={(checked) => {
                    setData((prev) => ({
                      ...prev,
                      enableLatexTn: checked,
                    }));
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用 LaTeX 公式播报</span>
              </div>
              
              <div className="flex items-center">
                <Switch
                  checked={data.enableCache}
                  onChange={(checked) => {
                    setData((prev) => ({
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
          <div className="text-xs font-normal leading-5 text-gray-500">AI 配置修改后，退出房间将不再保存该配置方案</div>
          <Button loading={loading} className="bg-gray-200 hover:bg-gray-300" onClick={onCancel}>
            取消
          </Button>
          <Button loading={loading} className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateConfig}>
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
