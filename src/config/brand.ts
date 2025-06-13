/**
 * Brand Configuration for Enterprise Customization
 * 企业品牌配置文件
 */

export interface BrandConfig {
  // 品牌信息
  companyName: string;
  productName: string;
  logoUrl?: string;
  logoAlt?: string;
  
  // 主题色彩
  primaryColor: string;
  secondaryColor: string;
  textGradient?: string;
  
  // 导航链接
  menuItems: {
    name: string;
    url: string;
    external?: boolean;
  }[];
  
  // 右侧链接
  navigationLinks: {
    name: string;
    url: string;
    external?: boolean;
  }[];
  
  // 社交媒体
  socialLinks?: {
    name: string;
    url: string;
    icon?: string;
  }[];
  
  // 其他配置
  showNetworkIndicator?: boolean;
  mobileMenuEnabled?: boolean;
  customTagline?: string;
}

// 默认配置（火山引擎风格）
export const defaultBrandConfig: BrandConfig = {
  companyName: "火山引擎",
  productName: "端到端语音对话体验",
  logoUrl: "/logo.svg",
  logoAlt: "Logo",
  
  primaryColor: "#004FFF",
  secondaryColor: "#9865FF", 
  textGradient: "linear-gradient(90deg, #004FFF 38.86%, #9865FF 100%)",
  
  menuItems: [
    {
      name: "免责声明",
      url: "https://www.volcengine.com/docs/6348/68916",
      external: true
    },
    {
      name: "隐私政策", 
      url: "https://www.volcengine.com/docs/6348/68918",
      external: true
    },
    {
      name: "用户协议",
      url: "https://www.volcengine.com/docs/6348/128955",
      external: true
    }
  ],
  
  navigationLinks: [
    {
      name: "官网链接",
      url: "https://www.volcengine.com/product/veRTC/ConversationalAI",
      external: true
    },
    {
      name: "联系我们",
      url: "https://www.volcengine.com/contact/product?t=%E5%AF%B9%E8%AF%9D%E5%BC%8Fai&source=%E4%BA%A7%E5%93%81%E5%92%A8%E8%AF%A2",
      external: true
    }
  ],
  
  showNetworkIndicator: true,
  mobileMenuEnabled: true
};

// 示例企业配置模板
export const customBrandTemplate: BrandConfig = {
  companyName: "Your Company",
  productName: "AI Conversation Platform",
  logoUrl: "/assets/img/custom-logo.svg",
  logoAlt: "Custom Logo",
  
  primaryColor: "#0066FF",
  secondaryColor: "#8B5CF6",
  textGradient: "linear-gradient(90deg, #0066FF 0%, #8B5CF6 100%)",
  
  menuItems: [
    {
      name: "About",
      url: "/about"
    },
    {
      name: "Documentation", 
      url: "/docs"
    },
    {
      name: "Support",
      url: "/support"
    }
  ],
  
  navigationLinks: [
    {
      name: "GitHub",
      url: "https://github.com/your-org/your-repo",
      external: true
    },
    {
      name: "Contact",
      url: "/contact"
    }
  ],
  
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/your-org",
      icon: "github"
    },
    {
      name: "Twitter", 
      url: "https://twitter.com/your-handle",
      icon: "twitter"
    }
  ],
  
  showNetworkIndicator: true,
  mobileMenuEnabled: true,
  customTagline: "Powered by Advanced AI Technology"
};

// 获取当前品牌配置的函数
export function getBrandConfig(): BrandConfig {
  // 可以从环境变量或其他配置源读取
  // 目前返回默认配置，未来可扩展为动态配置
  const customConfig = process.env.REACT_APP_BRAND_CONFIG;
  
  if (customConfig) {
    try {
      return { ...defaultBrandConfig, ...JSON.parse(customConfig) };
    } catch (error) {
      console.warn('Failed to parse custom brand config, using default', error);
    }
  }
  
  return defaultBrandConfig;
}
