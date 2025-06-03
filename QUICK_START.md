# 🚀 豆包RTC Demo 快速开始指南

## 第一次使用？只需3步！

### 步骤1: 复制配置模板
```bash
# 复制前端配置
cp .env.example .env

# 复制后端配置  
cp Server/.env.example Server/.env
```

### 步骤2: 填写配置信息

#### 🔑 获取火山引擎密钥
1. 访问 [火山引擎控制台](https://console.volcengine.com/iam/keymanage/)
2. 复制 `Access Key ID` 和 `Secret Access Key`
3. 填写到 `Server/.env` 文件中

#### 🎥 获取RTC配置
1. 访问 [RTC-AIGC控制台](https://console.volcengine.com/rtc/aigc/listRTC)
2. 创建应用，获取 `App ID`、`App Key`、`Token`
3. 填写到 `.env` 文件中的 `REACT_APP_DOUBAO_RTC_*` 项

#### 🔊 获取语音服务配置  
1. 访问 [语音技术控制台](https://console.volcengine.com/speech/app)
2. 创建应用，获取 `App ID` 和 `Access Token`
3. 填写到 `.env` 文件中的 `REACT_APP_DOUBAO_TTS_*` 和 `REACT_APP_DOUBAO_ASR_*` 项

### 步骤3: 启动项目
```bash
# 检查配置是否正确
npm run check:config

# 一键启动前后端
npm run start:all
```

## 🎯 测试功能

启动成功后：
1. 打开浏览器访问 `http://localhost:3000`
2. 允许麦克风权限
3. 点击"开始对话"按钮
4. 等待AI状态变为"准备就绪"
5. 开始语音对话！

## 🐛 遇到问题？

### 常见问题快速解决：

**问题1: AI一直显示"准备中"**
- 检查后端 `Server/.env` 中的 `DOUBAO_AK` 和 `DOUBAO_SK` 是否正确
- 确认账号已开通豆包相关服务

**问题2: RTC连接失败**  
- 检查 `REACT_APP_DOUBAO_RTC_TOKEN` 是否有效
- 确认 `UserId`、`RoomId` 与Token生成时一致

**问题3: 语音功能异常**
- 验证 TTS/ASR 的 `App ID` 和 `Access Token` 是否匹配
- 检查浏览器是否允许麦克风权限

**问题4: 环境变量无法访问**
- 确认前端变量是否以 `REACT_APP_` 开头
- 重启开发服务器使配置生效

### 获取帮助：
- 📖 [详细配置指南](README.md)
- 🔧 运行 `npm run check:config` 检查配置
- 🌐 [火山引擎官方文档](https://www.volcengine.com/docs/)

---

**💡 提示**: 首次配置建议按照顺序逐步完成，确保每个步骤都正确无误。配置完成后项目将自动运行！
