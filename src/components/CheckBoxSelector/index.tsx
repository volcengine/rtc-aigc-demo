/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useEffect, useMemo, useState, memo } from 'react';
import { Button, Drawer, Radio } from '@arco-design/web-react';
import CheckBox from '@/components/CheckBox';
import utils from '@/utils/utils';

export interface ICheckBoxItemProps {
  icon?: string;
  label: string;
  description?: string;
  key: string;
  category?: string;
}

export interface ICategoryData {
  [categoryName: string]: ICheckBoxItemProps[];
}

interface IProps {
  data?: ICheckBoxItemProps[];
  categoryData?: ICategoryData;
  categories?: string[];
  defaultCategory?: string;
  onChange?: (key: string) => void;
  value?: string;
  label?: string;
  moreIcon?: string;
  moreText?: string;
  placeHolder?: string;
}

function CheckBoxSelector(props: IProps) {
  const {
    placeHolder,
    label = '',
    data = [],
    categoryData,
    categories = [],
    defaultCategory,
    value,
    onChange,
    moreIcon,
    moreText,
  } = props;

  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string>(value!);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    defaultCategory || categories[0] || ''
  );

  const useCategoryMode = categoryData && categories.length > 0;

  const currentData = useMemo(() => {
    if (useCategoryMode) {
      return categoryData[selectedCategory] || [];
    }
    return data;
  }, [useCategoryMode, categoryData, selectedCategory, data]);

  const allData = useMemo(() => {
    if (useCategoryMode) {
      return Object.values(categoryData).flat();
    }
    return data;
  }, [useCategoryMode, categoryData, data]);

  const selectedOne = useMemo(() => allData.find((item) => item.key === value), [allData, value]);

  const handleSeeMore = () => {
    setVisible(true);
  };

  useEffect(() => {
    setSelected(value!);
  }, [visible, value]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (useCategoryMode && categoryData) {
      const itemsInCategory = categoryData[category] || [];
      const currentSelectedInCategory = itemsInCategory.find((item) => item.key === selected);
      if (!currentSelectedInCategory) {
        // setSelected('');
      }
    }
  };

  console.log({allData, value, selectedOne, moreText});

  return (
    <>
      <div className="flex items-center justify-between p-0 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-0 mr-4">
          {selectedOne ? (
            <CheckBox
              icon={selectedOne?.icon}
              label={selectedOne?.label || ''}
              description={selectedOne?.description}
              noStyle
            />
          ) : (
            <div className="text-gray-400">{placeHolder}</div>
          )}
        </div>

        <Button
          type="text"
          className="text-blue-600 hover:text-blue-800 flex items-center flex-shrink-0 p-2"
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
        maskClosable
        title={label}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={
          <div className="flex justify-end gap-3 p-4">
            <Button onClick={() => setVisible(false)}>取消</Button>
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
          {useCategoryMode && (
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-700 mb-3">分类</div>
              <Radio.Group
                value={selectedCategory}
                onChange={handleCategoryChange}
                type="button"
                size="small"
                className="flex flex-wrap gap-2"
              >
                {categories.map((category) => (
                  <Radio key={category} value={category}>
                    {category}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          )}

          <div className="space-y-2">
            {useCategoryMode && (
              <div className="text-sm font-medium text-gray-700 mb-3">
                {selectedCategory} ({currentData.length} 项)
              </div>
            )}
            {currentData.map((item) => (
              <CheckBox
                className="w-full"
                key={item.key}
                icon={item.icon}
                label={item.label}
                description={item.description}
                checked={item.key === selected}
                onClick={() => setSelected(item.key)}
              />
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default memo(CheckBoxSelector)
