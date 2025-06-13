/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useEffect, useMemo, useState, memo } from 'react';
import { Button, Drawer, Radio } from '@arco-design/web-react';
import CheckBox from '@/components/CheckBox';
import { 
  VOICE_CATEGORIES, 
  DEFAULT_VOICE_CATEGORY, 
  getVoicesByCategory, 
  VOICE_BY_SCENARIO 
} from '@/config/common';
import utils from '@/utils/utils';

export interface IVoiceItemProps {
  value: string;
  name: string;
  language: string;
  demoUrl: string;
  icon?: string;
}

interface IProps {
  onChange?: (key: string) => void;
  value?: string;
  label?: string;
  moreIcon?: string;
  moreText?: string;
  placeHolder?: string;
}

function VoiceSelector(props: IProps) {
  const { placeHolder, label = '', value, onChange, moreIcon, moreText } = props;
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string>(value!);
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_VOICE_CATEGORY);

  // 根据当前选中的音色找到对应的类别
  useEffect(() => {
    if (value) {
      for (const [category, voices] of Object.entries(VOICE_BY_SCENARIO)) {
        if (voices.some((voice) => voice.value === value)) {
          setSelectedCategory(category);
          break;
        }
      }
    }
  }, [value]);

  useEffect(() => {
    setSelected(value!);
  }, [visible, value]);

  // 获取当前选中音色的信息
  const selectedVoice = useMemo(() => {
    for (const voices of Object.values(VOICE_BY_SCENARIO)) {
      const found = voices.find((voice) => voice.value === value);
      if (found) return found;
    }
    return null;
  }, [value]);

  // 获取当前类别下的音色列表
  const currentCategoryVoices = useMemo(() => {
    return getVoicesByCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSeeMore = () => {
    setVisible(true);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // 当切换类别时，如果当前选中的音色不在新类别中，则选择新类别的第一个音色
    const voicesInCategory = getVoicesByCategory(category);
    if (voicesInCategory.length > 0) {
      const currentVoiceInCategory = voicesInCategory.find((voice) => voice.value === selected);
      if (!currentVoiceInCategory) {
        setSelected(voicesInCategory[0].value);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-0 mr-4">
          {selectedVoice ? (
            <CheckBox
              icon={selectedVoice.icon}
              label={selectedVoice.name || ''}
              description={`${selectedVoice.language} - ${selectedVoice.name}`}
              noStyle
            />
          ) : (
            <div className="text-gray-400">{placeHolder}</div>
          )}
        </div>

        <Button
          type="text"
          className="text-blue-600 hover:text-blue-800 flex items-center flex-shrink-0"
          onClick={handleSeeMore}
        >
          {moreIcon && <img src={moreIcon} alt="moreIcon" className="w-4 h-4 mr-1" />}
          <span>{moreText || '查看更多'}</span>
        </Button>
      </div>

      <Drawer
        style={{
          width: utils.isMobile() ? '100%' : '650px',
        }}
        closable={false}
        title={label}
        visible={visible}
        footer={
          <div className="flex justify-end gap-3 p-4">
            <Button onClick={() => setVisible(false)}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => {
                onChange?.(selected);
                setVisible(false);
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        <div className="p-4">
          {/* 音色类别选择 */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-3">音色类别</div>
            <Radio.Group
              value={selectedCategory}
              onChange={handleCategoryChange}
              type="button"
              size="small"
              className="flex flex-wrap gap-2"
            >
              {VOICE_CATEGORIES.map((category) => (
                <Radio key={category} value={category}>
                  {category}
                </Radio>
              ))}
            </Radio.Group>
          </div>
          
          {/* 音色列表 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-3">
              {selectedCategory} ({currentCategoryVoices.length}个音色)
            </div>
            {currentCategoryVoices.map((voice) => (
              <CheckBox
                className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                key={voice.value}
                icon={voice.icon}
                label={voice.name}
                description={`${voice.language} - ${voice.name}`}
                checked={voice.value === selected}
                onClick={() => setSelected(voice.value)}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default memo(VoiceSelector);
