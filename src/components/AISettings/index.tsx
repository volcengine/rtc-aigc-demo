/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { Button, Drawer, Input, Radio, Tooltip, Select, Slider, Switch } from '@arco-design/web-react';

import { useAtom, useAtomValue } from 'jotai';

import { IconExclamationCircle } from '@arco-design/web-react/icon';

import PersonaSelector from '../PersonaSelector';

import { AI_MODEL, MODEL_MODE, VOICE_CATEGORIES, VOICE_BY_SCENARIO, DEFAULT_VOICE_CATEGORY } from '@/config';

import TitleCard from '../TitleCard';

import CheckBoxSelector from '@/components/CheckBoxSelector';

import utils from '@/utils/utils';

import { activePersonaAtom, modelModeAtom, loadingAtom } from '@/store/atoms';

import VoiceTypeChangeSVG from '@/assets/img/VoiceTypeChange.svg';

import ModelChangeSVG from '@/assets/img/ModelChange.svg';

export interface IAISettingsProps {
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const RadioGroup = Radio.Group;

/**
 * AI 设置面板
 */
function AISettings({ open, onCancel, onOk, embedded }: IAISettingsProps) {
  // const [aiSettings, setAiSettings] = useAtom(aiSettingsAtom);
  const [modelMode, setModelMode] = useAtom(modelModeAtom);
  // const [voice, setVoice] = useAtom(voiceAtom);
  // const [model, setModel] = useAtom(modelAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const activePersona = useAtomValue(activePersonaAtom);

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
                        <a href="https://www.coze.cn/open/docs/developer_guides/pat" target="_blank" rel="noreferrer" style={{ color: 'gray' }}>
                          添加个人访问令牌
                        </a>{' '}
                        获取。
                        <br />
                        智能体 ID 可参考{' '}
                        <a href="https://www.coze.cn/open/docs/developer_guides/coze_api_overview#c5ac4993" target="_blank" rel="noreferrer" style={{ color: 'gray' }}>
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
                        <a href="https://www.volcengine.com/docs/6348/1399966" target="_blank" rel="noreferrer" style={{ color: 'gray' }}>
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
          onChange={() => {
            // todo
          }}
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
              onChange={() => {
                // todo
              }}
              value={activePersona.voice}
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
                    // todo: change model
                  }}
                  value={activePersona.model}
                />
              </TitleCard>
            )}

            {modelMode === MODEL_MODE.VENDOR && (
              <>
                <TitleCard required title="第三方模型地址">
                  <Input.TextArea
                    autoSize
                    value={activePersona.extra?.url}
                    onChange={(val) => {
                      // todo
                    }}
                    placeholder="请输入第三方模型地址"
                  />
                </TitleCard>
                <TitleCard title="请求密钥">
                  <Input.TextArea
                    autoSize
                    value={activePersona.extra?.apiKey}
                    onChange={(val) => {
                      //   todo
                    }}
                    placeholder="请输入请求密钥"
                  />
                </TitleCard>
                <TitleCard title="模型名称">
                  <Input.TextArea
                    autoSize
                    value={activePersona.extra?.modelName}
                    onChange={(val) => {
                      //   todo
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
                    value={activePersona.extra?.apiKey}
                    onChange={(val) => {
                      //   todo
                    }}
                    placeholder="请输入访问令牌"
                  />
                </TitleCard>
                <TitleCard required title="智能体 ID">
                  <Input.TextArea
                    autoSize
                    value={activePersona.extra?.botId}
                    onChange={(val) => {
                      //   todo
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
            value={activePersona.prompt}
            onChange={(val) => {
              // todo
            }}
            placeholder="请输入你需要的 Prompt 设定"
          />
        </TitleCard>
        <TitleCard title="欢迎语">
          <Input.TextArea
            autoSize
            value={activePersona.welcome}
            onChange={(val) => {
              //   todo
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
                value={activePersona.extra?.encoding}
                onChange={(val) => {
                  //   todo
                }}
                options={[
                  { label: 'MP3', value: 'mp3' },
                  { label: 'WAV', value: 'wav' },
                  {
                    label: 'PCM',
                    value: 'pcm',
                  },
                  { label: 'OGG Opus', value: 'ogg_opus' },
                ]}
                placeholder="选择音频编码格式"
                style={{ width: '100%' }}
              />
            </TitleCard>

            <TitleCard title="音频采样率">
              <Select
                value={activePersona.extra?.rate?.toString()}
                onChange={(val) => {
                  //   todo
                }}
                options={[
                  { label: '8000 Hz', value: 8000 },
                  { label: '16000 Hz', value: 16000 },
                  {
                    label: '24000 Hz',
                    value: 24000,
                  },
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
                value={activePersona.extra?.bitRate?.toString()}
                min={64}
                max={320}
                onChange={(val) => {
                  //   todo
                }}
                placeholder="比特率"
              />
            </TitleCard>

            <TitleCard title="语速调节">
              <div>
                <Slider
                  value={activePersona.extra?.speedRatio}
                  min={0.8}
                  max={2.0}
                  step={0.1}
                  onChange={(val) => {
                    //   todo
                  }}
                  marks={{
                    0.8: '0.8x',
                    1.0: '1.0x',
                    1.2: '1.2x',
                    1.5: '1.5x',
                    2.0: '2.0x',
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>当前: {activePersona.extra?.speedRatio}x</div>
              </div>
            </TitleCard>
          </div>

          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="音量调节">
              <div>
                <Slider
                  value={activePersona.extra?.loudnessRatio}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  onChange={(val) => {
                    //   todo
                  }}
                  marks={{
                    0.5: '0.5x',
                    1.0: '1.0x',
                    1.5: '1.5x',
                    2.0: '2.0x',
                  }}
                />
                <div style={{ textAlign: 'center', marginTop: '8px' }}>当前: {activePersona.extra?.loudnessRatio}x</div>
              </div>
            </TitleCard>

            <TitleCard title="句尾静音 (ms)">
              <Input
                type="number"
                value={activePersona.extra?.silenceDuration?.toString()}
                min={0}
                max={30000}
                onChange={(val) => {
                  //   todo
                }}
                placeholder="句尾静音时长"
              />
            </TitleCard>
          </div>

          <div className="flex flex-row flex-wrap justify-start items-start gap-2">
            <TitleCard title="语种设置">
              <Select
                value={activePersona.extra?.explicitLanguage}
                onChange={(val) => {
                  //   todo
                }}
                options={[
                  { label: '自动识别', value: '' },
                  {
                    label: '中文为主（支持中英混）',
                    value: 'zh',
                  },
                  { label: '仅英文', value: 'en' },
                  { label: '仅日文', value: 'ja' },
                  {
                    label: '仅墨西哥语',
                    value: 'es-mx',
                  },
                  { label: '仅印尼语', value: 'id' },
                  {
                    label: '仅巴西葡萄牙语',
                    value: 'pt-br',
                  },
                  { label: '多语种前端', value: 'crosslingual' },
                ]}
                placeholder="选择语种"
                style={{ width: '100%' }}
              />
            </TitleCard>

            <TitleCard title="参考语种">
              <Select
                value={activePersona.extra?.contextLanguage}
                onChange={(val) => {
                  //   todo
                }}
                options={[
                  { label: '默认', value: '' },
                  { label: '印尼语', value: 'id' },
                  {
                    label: '墨西哥语',
                    value: 'es',
                  },
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
                  checked={activePersona.extra?.enableEmotion}
                  onChange={(checked) => {
                    //   todo
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用音色情感</span>
              </div>

              {activePersona.extra?.enableEmotion && (
                <>
                  <div style={{ marginTop: '12px' }}>
                    <Input
                      value={activePersona.extra.emotion}
                      onChange={(val) => {
                        //   todo
                      }}
                      placeholder="输入情感类型，如: happy, sad, angry, excited"
                    />
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>情绪强度 (1-5): {activePersona.extra.emotionScale}</div>
                    <Slider
                      value={activePersona.extra?.emotionScale}
                      min={1}
                      max={5}
                      step={1}
                      onChange={(val) => {
                        //   todo
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
                  checked={activePersona?.extra?.advanced?.withTimestamp}
                  onChange={(checked) => {
                    // todo
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用时间戳</span>
              </div>

              <div className="flex items-center">
                <Switch
                  checked={activePersona?.extra?.advanced?.disableMarkdownFilter}
                  onChange={(checked) => {
                    // todo
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用 Markdown 解析过滤</span>
              </div>

              <div className="flex items-center">
                <Switch
                  checked={activePersona?.extra?.advanced?.enableLatexTn}
                  onChange={(checked) => {
                    // todo
                  }}
                />
                <span style={{ marginLeft: '8px' }}>启用 LaTeX 公式播报</span>
              </div>

              <div className="flex items-center">
                <Switch
                  checked={activePersona?.extra?.advanced?.enableCache}
                  onChange={(checked) => {
                    // todo
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
          <Button
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // todo: implement handler
            }}
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
