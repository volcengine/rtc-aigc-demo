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
  tag?: string;
}

function CheckIcon(props: IProps) {
  const { tag, blur, className = '', icon, title, checked, onClick } = props;

  const baseClasses = 'relative w-[128px] h-[128px] rounded-lg flex justify-center items-center cursor-pointer transition-all duration-200 hover:shadow-lg overflow-hidden box-border';
  const bgClasses = checked ? 'bg-gradient-to-br from-blue-500 to-purple-600' : blur ? 'border border-dashed border-purple-200 opacity-80' : 'bg-white';

  return (
    <div className={`${baseClasses} ${bgClasses} ${className}`} onClick={onClick}>
      {/* {tag ? <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg z-10">{tag}</div> : null} */}

      <div className="w-full h-full flex flex-col justify-center items-center z-[1] gap-0.5 overflow-hidden">
        {icon ? <img className="rounded-full w-[55%] h-auto" src={icon} alt="icon" /> : null}

        <div className={`text-center leading-tight ${checked ? 'text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : 'text-xs text-gray-700'}`}>
          {title}
        </div>
      </div>

      {checked ? <img className="absolute bottom-[-2px] right-[-2px] z-[2] w-4 h-4" src={CheckedSVG} alt="checked" /> : null}
    </div>
  );
}

export default CheckIcon;
