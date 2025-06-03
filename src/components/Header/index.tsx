/**
 * Enterprise Header Component
 * 企业级头部组件 - 支持品牌定制化
 */

import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from '@arco-design/web-react';
import { IconMenu } from '@arco-design/web-react/icon';
import NetworkIndicator from '../NetworkIndicator';
import { BrandConfig, defaultBrandConfig } from '../../config/brand';
import utils from '@/utils/utils';

interface HeaderProps {
  children?: React.ReactNode;
  hide?: boolean;
  customConfig?: Partial<BrandConfig>;
}

function Header(props: HeaderProps) {
  const { children, hide, customConfig } = props;
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(defaultBrandConfig);

  // 支持动态配置更新
  useEffect(() => {
    if (customConfig) {
      setBrandConfig(prev => ({ ...prev, ...customConfig }));
    }
  }, [customConfig]);

  // 处理菜单项和导航链接的点击
  const handleLinkClick = (url: string, external?: boolean) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  // 合并所有菜单项（包括原menuItems和navigationLinks）
  const allMenuItems = [
    ...brandConfig.menuItems,
    ...(brandConfig.navigationLinks || [])
  ];

  // 桌面端和移动端的统一下拉菜单
  const unifiedMenuDropdown = (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-2 min-w-[180px]">
      {allMenuItems.map((item, index) => (
        <Button
          key={`${item.name}-${index}`}
          type="text"
          className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 mb-1"
          onClick={() => handleLinkClick(item.url, item.external)}
        >
          {item.name}
        </Button>
      ))}
      
      {/* 社交媒体链接分组 */}
      {brandConfig.socialLinks && brandConfig.socialLinks.length > 0 && (
        <>
          <div className="border-t border-gray-100 my-2"></div>
          {brandConfig.socialLinks.map((social, index) => (
            <Button
              key={`social-${social.name}-${index}`}
              type="text"
              className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => handleLinkClick(social.url, true)}
            >
              {social.name}
            </Button>
          ))}
        </>
      )}
    </div>
  );

  if (hide) {
    return null;
  }

  return (
    <header className="h-12 bg-white w-full flex items-center justify-between border-b border-gray-100 relative z-50">
      {/* Logo 和标题区域 */}
      <div className="flex items-center px-6">

        {/* Logo */}
        <div className="flex items-center">
          {brandConfig.logoUrl && (
            <img 
              src={brandConfig.logoUrl} 
              alt={brandConfig.logoAlt || `${brandConfig.companyName} Logo`}
              className="h-6 w-auto mr-3"
            />
          )}
          
          <div className="h-6 w-px bg-gray-300 mr-3"></div>
          
          <h1 
            className="text-sm font-medium bg-clip-text text-transparent"
            style={{
              backgroundImage: brandConfig.textGradient || `linear-gradient(135deg, ${brandConfig.primaryColor} 0%, ${brandConfig.secondaryColor} 100%)`
            }}
          >
            {brandConfig.productName}
          </h1>
          
          {/* 网络指示器 */}
          {brandConfig.showNetworkIndicator && (
            <div className="ml-4">
              <NetworkIndicator />
            </div>
          )}
        </div>
      </div>

      {/* 中间区域 - 传入的子组件 */}
      <div className="flex-1 flex justify-center">
        {children}
      </div>

      {/* 右侧菜单区域 */}
      <div className="flex items-center px-6">
        {allMenuItems.length > 0 && (
          <Dropdown 
            droplist={unifiedMenuDropdown}
            trigger="click"
            position="bottom"
          >
            <Button
              type="text"
              icon={<IconMenu />}
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            />
          </Dropdown>
        )}
      </div>

      {/* 自定义标语（可选） */}
      {brandConfig.customTagline && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm border">
            {brandConfig.customTagline}
          </div>
        </div>
      )}

      
    </header>
  );
}

export default Header;
