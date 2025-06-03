/**
 * Brand Configuration Examples
 * 企业品牌配置示例
 * 
 * 这个文件包含了不同企业场景下的品牌配置示例
 */

import { BrandConfig } from './brand';

// 科技公司配置示例
export const techCompanyConfig: BrandConfig = {
  companyName: "TechCorp",
  productName: "AI Assistant Platform",
  logoUrl: "/assets/logos/techcorp-logo.svg",
  logoAlt: "TechCorp Logo",
  
  primaryColor: "#0066FF",
  secondaryColor: "#00D4FF",
  textGradient: "linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)",
  
  menuItems: [
    {
      name: "API Documentation",
      url: "/docs/api"
    },
    {
      name: "Developer Portal",
      url: "/developers"
    },
    {
      name: "Support Center",
      url: "/support"
    }
  ],
  
  navigationLinks: [
    {
      name: "GitHub",
      url: "https://github.com/techcorp/ai-platform",
      external: true
    },
    {
      name: "Pricing",
      url: "/pricing"
    },
    {
      name: "Contact Sales",
      url: "/contact-sales"
    }
  ],
  
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/techcorp",
      icon: "github"
    },
    {
      name: "Twitter",
      url: "https://twitter.com/techcorp",
      icon: "twitter"
    }
  ],
  
  showNetworkIndicator: true,
  mobileMenuEnabled: true,
  customTagline: "Powered by Advanced AI Technology"
};

// 教育机构配置示例
export const educationConfig: BrandConfig = {
  companyName: "EduTech University",
  productName: "智能学习助手",
  logoUrl: "/assets/logos/edutech-logo.svg",
  logoAlt: "EduTech Logo",
  
  primaryColor: "#8B5CF6",
  secondaryColor: "#EC4899",
  textGradient: "linear-gradient(45deg, #8B5CF6 0%, #EC4899 100%)",
  
  menuItems: [
    {
      name: "使用指南",
      url: "/guide"
    },
    {
      name: "学习资源",
      url: "/resources"
    },
    {
      name: "常见问题",
      url: "/faq"
    }
  ],
  
  navigationLinks: [
    {
      name: "课程中心",
      url: "/courses"
    },
    {
      name: "师生论坛",
      url: "/forum"
    },
    {
      name: "技术支持",
      url: "/tech-support"
    }
  ],
  
  showNetworkIndicator: false,
  mobileMenuEnabled: true,
  customTagline: "让学习更智能，让教育更高效"
};

// 医疗健康配置示例
export const healthcareConfig: BrandConfig = {
  companyName: "HealthCare AI",
  productName: "智能医疗咨询平台",
  logoUrl: "/assets/logos/healthcare-logo.svg",
  logoAlt: "HealthCare AI Logo",
  
  primaryColor: "#10B981",
  secondaryColor: "#3B82F6",
  textGradient: "linear-gradient(90deg, #10B981 0%, #3B82F6 100%)",
  
  menuItems: [
    {
      name: "隐私政策",
      url: "/privacy"
    },
    {
      name: "服务条款",
      url: "/terms"
    },
    {
      name: "医疗免责声明",
      url: "/medical-disclaimer"
    }
  ],
  
  navigationLinks: [
    {
      name: "专家团队",
      url: "/experts"
    },
    {
      name: "健康资讯",
      url: "/health-news"
    },
    {
      name: "紧急联系",
      url: "/emergency"
    }
  ],
  
  showNetworkIndicator: true,
  mobileMenuEnabled: true,
  customTagline: "您的健康，我们的使命"
};

// 金融服务配置示例
export const financeConfig: BrandConfig = {
  companyName: "FinTech Solutions",
  productName: "智能金融顾问",
  logoUrl: "/assets/logos/fintech-logo.svg",
  logoAlt: "FinTech Logo",
  
  primaryColor: "#F59E0B",
  secondaryColor: "#EF4444",
  textGradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)",
  
  menuItems: [
    {
      name: "合规信息",
      url: "/compliance"
    },
    {
      name: "风险提示",
      url: "/risk-disclosure"
    },
    {
      name: "监管政策",
      url: "/regulations"
    }
  ],
  
  navigationLinks: [
    {
      name: "投资产品",
      url: "/products"
    },
    {
      name: "市场分析",
      url: "/market-analysis"
    },
    {
      name: "客户服务",
      url: "/customer-service"
    }
  ],
  
  showNetworkIndicator: true,
  mobileMenuEnabled: true,
  customTagline: "智能投资，稳健理财"
};

// 开源项目配置示例
export const openSourceConfig: BrandConfig = {
  companyName: "Open AI Community",
  productName: "开源对话 AI 框架",
  logoUrl: "/assets/logos/opensource-logo.svg",
  logoAlt: "Open Source Logo",
  
  primaryColor: "#6366F1",
  secondaryColor: "#8B5CF6",
  textGradient: "linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)",
  
  menuItems: [
    {
      name: "贡献指南",
      url: "/contributing"
    },
    {
      name: "开源协议",
      url: "/license"
    },
    {
      name: "行为准则",
      url: "/code-of-conduct"
    }
  ],
  
  navigationLinks: [
    {
      name: "GitHub",
      url: "https://github.com/open-ai-community/conversational-ai",
      external: true
    },
    {
      name: "文档",
      url: "/docs"
    },
    {
      name: "社区",
      url: "/community"
    }
  ],
  
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/open-ai-community",
      icon: "github"
    },
    {
      name: "Discord",
      url: "https://discord.gg/open-ai-community",
      icon: "discord"
    }
  ],
  
  showNetworkIndicator: false,
  mobileMenuEnabled: true,
  customTagline: "Built with ❤️ by the community"
};

// 企业内部工具配置示例
export const internalToolConfig: BrandConfig = {
  companyName: "内部AI工具",
  productName: "员工智能助手",
  logoUrl: "/assets/logos/internal-logo.svg",
  logoAlt: "Internal Tool Logo",
  
  primaryColor: "#374151",
  secondaryColor: "#6B7280",
  textGradient: "linear-gradient(90deg, #374151 0%, #6B7280 100%)",
  
  menuItems: [
    {
      name: "使用手册",
      url: "/manual"
    },
    {
      name: "安全政策",
      url: "/security"
    },
    {
      name: "数据政策",
      url: "/data-policy"
    }
  ],
  
  navigationLinks: [
    {
      name: "工单系统",
      url: "/tickets"
    },
    {
      name: "内部论坛",
      url: "/forum"
    },
    {
      name: "IT支持",
      url: "/it-support"
    }
  ],
  
  showNetworkIndicator: true,
  mobileMenuEnabled: true,
  customTagline: "仅供内部员工使用"
};

// 根据环境变量选择配置的辅助函数
export function getConfigByType(type: string): BrandConfig {
  const configs = {
    'tech': techCompanyConfig,
    'education': educationConfig,
    'healthcare': healthcareConfig,
    'finance': financeConfig,
    'opensource': openSourceConfig,
    'internal': internalToolConfig
  };
  
  return configs[type as keyof typeof configs] || techCompanyConfig;
}

// 配置类型列表（用于开发工具）
export const availableConfigs = [
  { key: 'tech', name: '科技公司', config: techCompanyConfig },
  { key: 'education', name: '教育机构', config: educationConfig },
  { key: 'healthcare', name: '医疗健康', config: healthcareConfig },
  { key: 'finance', name: '金融服务', config: financeConfig },
  { key: 'opensource', name: '开源项目', config: openSourceConfig },
  { key: 'internal', name: '企业内部', config: internalToolConfig }
];
