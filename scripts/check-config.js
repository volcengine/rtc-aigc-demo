#!/usr/bin/env node

/**
 * 豆包RTC Demo 配置检查脚本
 * 用于验证环境变量是否正确配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 正在检查配置...\n');

// 检查文件是否存在
function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${description}: ${filePath}`);
  return exists;
}

// 解析 .env 文件
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return env;
}

// 检查环境变量
function checkEnvVars(env, requiredVars, description) {
  console.log(`\n📋 检查${description}配置:`);
  let allValid = true;
  
  requiredVars.forEach(varName => {
    const value = env[varName];
    const hasValue = value && value !== '请填写您的Access_Key_ID' && value !== '请填写您的Secret_Access_Key' && !value.includes('请填写');
    const status = hasValue ? '✅' : '❌';
    console.log(`  ${status} ${varName}: ${hasValue ? '已配置' : '未配置或使用默认值'}`);
    if (!hasValue) allValid = false;
  });
  
  return allValid;
}

let allChecksPass = true;

// 1. 检查前端配置文件
console.log('📁 检查配置文件存在性:');
const frontendEnvExists = checkFileExists('.env', '前端环境变量文件');
const backendEnvExists = checkFileExists('Server/.env', '后端环境变量文件');

if (!frontendEnvExists) {
  console.log('💡 提示: 请复制 .env.example 为 .env 并填写配置');
  allChecksPass = false;
}

if (!backendEnvExists) {
  console.log('💡 提示: 请复制 Server/.env.example 为 Server/.env 并填写配置');
  allChecksPass = false;
}

// 2. 检查前端环境变量
if (frontendEnvExists) {
  const frontendEnv = parseEnvFile('.env');
  const frontendRequiredVars = [
    'REACT_APP_DOUBAO_RTC_APP_ID',
    'REACT_APP_DOUBAO_RTC_APP_KEY', 
    'REACT_APP_DOUBAO_RTC_TOKEN',
    'REACT_APP_DOUBAO_TTS_APP_ID',
    'REACT_APP_DOUBAO_TTS_APP_ACCESS_TOKEN',
    'REACT_APP_DOUBAO_ASR_APP_ID',
    'REACT_APP_DOUBAO_ASR_APP_ACCESS_TOKEN'
  ];
  
  const frontendValid = checkEnvVars(frontendEnv, frontendRequiredVars, '前端');
  if (!frontendValid) allChecksPass = false;
}

// 3. 检查后端环境变量
if (backendEnvExists) {
  const backendEnv = parseEnvFile('Server/.env');
  const backendRequiredVars = [
    'DOUBAO_AK',
    'DOUBAO_SK'
  ];
  
  const backendValid = checkEnvVars(backendEnv, backendRequiredVars, '后端');
  if (!backendValid) allChecksPass = false;
}

// 4. 检查源码配置
console.log('\n🔧 检查源码配置:');
const configPath = 'src/config/common.ts';
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  const hasArkModelId = configContent.includes('ARK_V3_MODEL_ID') && !configContent.includes('your-model-endpoint-id');
  const status = hasArkModelId ? '✅' : '❌';
  console.log(`  ${status} 大模型接入点配置: ${configPath}`);
  if (!hasArkModelId) {
    console.log('💡 提示: 请在 src/config/common.ts 中配置 ARK_V3_MODEL_ID');
    allChecksPass = false;
  }
} else {
  console.log(`  ❌ 配置文件不存在: ${configPath}`);
  allChecksPass = false;
}

// 5. 最终结果
console.log('\n' + '='.repeat(50));
if (allChecksPass) {
  console.log('🎉 配置检查通过！可以开始启动项目了。');
  console.log('\n启动命令:');
  console.log('  npm run start:all  # 一键启动前后端');
  console.log('  npm run dev        # 仅启动前端');
  console.log('  npm run server:start  # 仅启动后端');
} else {
  console.log('⚠️  配置检查未通过，请按照上述提示完善配置。');
  console.log('\n配置帮助:');
  console.log('  📖 查看详细配置指南: README.md');
  console.log('  🔗 获取RTC配置: https://console.volcengine.com/rtc/aigc/listRTC');
  console.log('  🔗 获取语音配置: https://console.volcengine.com/speech/app');
  console.log('  🔗 获取AK/SK: https://console.volcengine.com/iam/keymanage/');
  process.exit(1);
}

console.log('='.repeat(50));
