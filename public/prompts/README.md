# Prompts 配置文件
# 生成时间: 2025-06-03T19:33:04+08:00

此目录包含从 `src/config/common.ts` 中提取的所有 Prompt 配置文件，以 Markdown 格式组织：

## 文件列表

- **intelligent_assistant.md**: 智能助手
- **virtual_girl_friend.md**: 虚拟女友  
- **translate.md**: 翻译助手
- **children_encyclopedia.md**: 儿童百科
- **customer_service.md**: 客服助手
- **teaching_assistant.md**: 教学助手
- **screen_reader.md**: 读屏助手
- **custom.md**: 自定义场景

## 使用说明

每个 Markdown 文件包含对应场景的完整 Prompt 内容，包括：
- 人设定义
- 技能描述  
- 行为约束
- 交互规则

这些文件可以直接用于 AI 模型的系统角色设置，也便于后续的维护和管理。

## 文件详情

### intelligent_assistant.md
- **场景**: INTELLIGENT_ASSISTANT
- **描述**: 全能智能体，拥有丰富的百科知识，可以为人们答疑解惑、创作内容、提供建议

### virtual_girl_friend.md  
- **场景**: VIRTUAL_GIRL_FRIEND
- **描述**: AI虚拟女友角色，性格外向开朗、童真俏皮，提供情感陪伴和趣味互动

### translate.md
- **场景**: TRANSLATE
- **描述**: 翻译官角色，可以识别中英文并实时翻译，结合图片内容进行翻译服务

### children_encyclopedia.md
- **场景**: CHILDREN_ENCYCLOPEDIA  
- **描述**: 儿童百科知识导师，以简单易懂、生动有趣的方式为儿童介绍各种知识

### customer_service.md
- **场景**: CUSTOMER_SERVICE
- **描述**: 餐饮行业售后处理人员，擅长处理投诉、安抚情绪、客户留存

### teaching_assistant.md
- **场景**: TEACHING_ASSISTANT
- **描述**: 助教角色，结合图片信息为用户解答各种学习问题

### screen_reader.md  
- **场景**: SCREEN_READER
- **描述**: AI伙伴，通过屏幕共享实时解析和百科知识为用户提供服务

### custom.md
- **场景**: CUSTOM
- **描述**: 自定义场景的空白模板，可根据需要自定义角色和功能
