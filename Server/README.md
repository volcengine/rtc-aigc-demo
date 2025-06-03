# 豆包RTC Demo 服务端配置指南

## 🚀 快速开始

### 1. 环境变量配置

复制 `.env.example` 为 `.env` 文件（如果不存在），然后按照以下步骤配置：

```bash
cp .env.example .env  # 如果存在示例文件
# 或直接编辑现有的 .env 文件
```

### 2. 获取豆包API密钥

#### 步骤详解：

1. **访问火山引擎控制台**
   - 🔗 [https://console.volcengine.com/iam/keymanage/](https://console.volcengine.com/iam/keymanage/)
   
2. **账号准备**
   - 注册/登录火山引擎账号
   - 确保账号已完成实名认证
   - 开通豆包相关服务

3. **创建AccessKey**
   - 进入"访问控制" → "密钥管理"
   - 点击"新建密钥"
   - 保存生成的 `Access Key ID` 和 `Secret Access Key`

4. **配置环境变量**
   ```bash
   # 在 .env 文件中填写
   DOUBAO_AK=你的Access_Key_ID
   DOUBAO_SK=你的Secret_Access_Key
   ```

### 3. 启动服务

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或生产模式启动
npm start
```

## 🔧 配置项详解

| 配置项 | 必填 | 说明 | 默认值 |
|--------|------|------|--------|
| `DOUBAO_AK` | ✅ | 火山引擎Access Key ID | - |
| `DOUBAO_SK` | ✅ | 火山引擎Secret Access Key | - |
| `PORT` | ❌ | 服务端口 | 3001 |
| `DOUBAO_VOICE_MODEL` | ❌ | 语音合成模型 | zh_female_tianmei_moon_bigtts |
| `DOUBAO_CHAT_MODEL` | ❌ | 对话模型ID | - |
| `LOG_LEVEL` | ❌ | 日志级别 | info |

## 🐛 常见问题排查

### 问题1: API密钥无效
```
错误信息: "Invalid API key" 或 "Authentication failed"
```
**解决方案:**
- 检查 `DOUBAO_AK` 和 `DOUBAO_SK` 是否正确复制
- 确认密钥没有多余的空格或换行符
- 验证火山引擎账号状态

### 问题2: 权限不足
```
错误信息: "Access denied" 或 "Insufficient permissions"
```
**解决方案:**
- 确认已开通豆包相关服务
- 检查账号余额是否充足
- 联系火山引擎客服确认服务状态

### 问题3: 连接超时
```
错误信息: "Connection timeout" 或 "Network error"
```
**解决方案:**
- 检查网络连接
- 确认防火墙设置
- 尝试更换网络环境

### 问题4: 前端显示"AI 准备中，请稍后"
**根据已知问题解决方案:**
- 确保后端 `.env` 文件配置正确
- 检查前端环境变量是否以 `REACT_APP_` 开头
- 验证AI启动后是否正确添加了欢迎消息

## 📚 相关文档

- [火山引擎官方文档](https://www.volcengine.com/docs/)
- [豆包API文档](https://www.volcengine.com/docs/82379)
- [项目完整文档](../README.md)

## 🆘 技术支持

如果遇到无法解决的问题，请：

1. 检查控制台日志输出
2. 确认网络连接正常
3. 查看火山引擎服务状态
4. 联系项目维护者或提交Issue

---

**安全提醒**: 请勿将包含真实密钥的 `.env` 文件提交到代码仓库，建议添加到 `.gitignore` 中。
