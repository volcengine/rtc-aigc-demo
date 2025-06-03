/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import CheckedSVG from '@/assets/img/Checked.svg';

interface IProps {
  className?: string;
  blur?: boolean;
  checked: boolean;
  title?: string;
  onClick?: () => void;
  icon?: string;
}

function CheckIcon(props: IProps) {
  const { blur, className = '', icon, title, checked, onClick } = props;

  const baseClasses =
    'relative w-20 h-20 rounded-lg flex justify-center items-center cursor-pointer transition-all duration-200 hover:shadow-lg box-border';
  const bgClasses = checked
    ? 'bg-gradient-to-br from-blue-500 to-purple-600'
    : blur
    ? 'border border-dashed border-purple-200 opacity-80'
    : 'bg-white border border-gray-200';

  // 判断icon是否为图片URL还是emoji字符
  const isImageUrl = icon && (icon.startsWith('http') || icon.startsWith('/') || icon.startsWith('./'));

  return (
    <div className={`${baseClasses} ${bgClasses} ${className}`} onClick={onClick}>
      <div className="w-full h-full flex flex-col justify-center items-center z-[1] gap-0.5 overflow-hidden">
        {icon ? (
          isImageUrl ? (
            <img className="rounded-full w-[55%] h-auto" src={icon} alt="icon" />
          ) : (
            <div className="text-2xl">{icon}</div>
          )
        ) : null}

        <div
          className={`text-center leading-tight ${
            checked
              ? 'text-xs font-medium bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-white'
              : 'text-xs text-gray-700'
          }`}
        >
          {title}
        </div>
      </div>

      {checked ? (
        <img
          className="absolute bottom-[-2px] right-[-2px] z-[2] w-4 h-4"
          src={CheckedSVG}
          alt="checked"
        />
      ) : null}
    </div>
  );
}

export default CheckIcon;
