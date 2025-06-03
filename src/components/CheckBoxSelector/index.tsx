/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useEffect, useMemo, useState, memo } from 'react';
import { Button, Drawer } from '@arco-design/web-react';
import CheckBox from '@/components/CheckBox';
import utils from '@/utils/utils';

export interface ICheckBoxItemProps {
  icon?: string;
  label: string;
  description?: string;
  key: string;
}

interface IProps {
  data?: ICheckBoxItemProps[];
  onChange?: (key: string) => void;
  value?: string;
  label?: string;
  moreIcon?: string;
  moreText?: string;
  placeHolder?: string;
}

function CheckBoxSelector(props: IProps) {
  const { placeHolder, label = '', data = [], value, onChange, moreIcon, moreText } = props;
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string>(value!);
  const selectedOne = useMemo(() => data.find((item) => item.key === value), [data, value]);
  const handleSeeMore = () => {
    setVisible(true);
  };
  useEffect(() => {
    setSelected(value!);
  }, [visible]);

  return (
    <>
      <div className="flex items-center justify-between w-full gap-4 bg-gray-50 rounded-lg">
        <div className="flex-1 min-w-0">
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
          className="ml-4 text-blue-600 hover:text-blue-800 flex items-center flex-shrink-0"
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
          <div className="space-y-2">
            {data.map((item) => (
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

export default memo(CheckBoxSelector);
