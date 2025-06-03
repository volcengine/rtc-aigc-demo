/**
 * Enterprise Header Component
 * 企业级头部组件 - 支持品牌定制化
 */

import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Divider } from '@arco-design/web-react';
import { IconMenu, IconMore, IconGithub, IconLink } from '@arco-design/web-react/icon';
import NetworkIndicator from '@/components/NetworkIndicator';
import utils from '@/utils/utils';
import { getBrandConfig, type BrandConfig } from '@/config/brand';
import Logo from '@/assets/img/Logo.svg';

interface HeaderProps {
  children?: React.ReactNode;
  hide?: boolean;
  customConfig?: Partial<BrandConfig>;
}

function Header(props: HeaderProps) {
  const { children, hide, customConfig } = props;
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(getBrandConfig());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 支持动态配置更新
  useEffect(() => {
    if (customConfig) {
      setBrandConfig(prev => ({ ...prev, ...customConfig }));
    }
  }, [customConfig]);

  // 处理链接点击
  const handleLinkClick = (url: string, external = false) => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  };

  // 移动端菜单项
  const mobileMenuItems = [
    ...brandConfig.menuItems,
    ...brandConfig.navigationLinks
  ].map(item => ({
    key: item.name,
    title: item.name,
    onClick: () => handleLinkClick(item.url, item.external)
  }));

  // 桌面端下拉菜单
  const desktopMenuDropdown = (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-2 min-w-[160px]">
      {brandConfig.menuItems.map((menuItem) => (
        <Button
          key={menuItem.name}
          type="text"
          className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          onClick={() => handleLinkClick(menuItem.url, menuItem.external)}
        >
          {menuItem.name}
        </Button>
      ))}
      
      {brandConfig.socialLinks && brandConfig.socialLinks.length > 0 && (
        <>
          <Divider className="my-2" />
          <div className="px-2 py-1">
            <div className="text-xs text-gray-500 mb-2">关注我们</div>
            <div className="flex gap-2">
              {brandConfig.socialLinks.map((social) => (
                <Button
                  key={social.name}
                  type="text"
                  size="small"
                  icon={social.icon === 'github' ? <IconGithub /> : <IconLink />}
                  className="text-gray-600 hover:text-blue-600"
                  onClick={() => handleLinkClick(social.url, true)}
                />
              ))}
            </div>
          </div>
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
          <img 
            src={brandConfig.logoUrl || Logo} 
            alt={brandConfig.logoAlt || 'Logo'} 
            className="h-6 w-auto"
          />
          
          <Divider 
            type="vertical" 
            className="mx-4 bg-gray-300"
          />
          
          {/* 产品标题 */}
          <h1 
            className="text-lg font-semibold bg-clip-text text-transparent"
            style={{
              background: brandConfig.textGradient || `linear-gradient(90deg, ${brandConfig.primaryColor} 0%, ${brandConfig.secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text'
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

      {/* 右侧导航区域 */}
      <div className="flex items-center px-6">
        {!utils.isMobile() && brandConfig.navigationLinks ? (
          /* 桌面端导航链接 */
          <div className="flex items-center gap-6">
            {brandConfig.navigationLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.url, link.external)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>
        ) : (
          /* 移动端菜单按钮 */
          utils.isMobile() && brandConfig.mobileMenuEnabled && (
            <Dropdown
              droplist={
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-2 min-w-[160px]">
                  {mobileMenuItems.map((item) => (
                    <Button
                      key={item.key}
                      type="text"
                      className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      onClick={item.onClick}
                    >
                      {item.title}
                    </Button>
                  ))}
                </div>
              }
              trigger="click"
              position="bottom"
            >
              <Button
                type="text"
                icon={<IconMore />}
                className="text-gray-600 hover:text-blue-600"
              />
            </Dropdown>
          )
        )}
      </div>

              {/* 桌面端菜单按钮 */}
              {!utils.isMobile() && brandConfig.menuItems.length > 0 && (
          <Dropdown 
            droplist={desktopMenuDropdown}
            trigger="click"
            position="bottom"
          >
            <Button
              type="text"
              icon={<IconMenu />}
              className="mr-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            />
          </Dropdown>
        )}

      {/* 自定义标语（可选） */}
      {brandConfig.customTagline && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-b-md border-x border-b border-gray-100">
            {brandConfig.customTagline}
          </div>
        </div>
      )}

      
    </header>
  );
}

export default Header;
