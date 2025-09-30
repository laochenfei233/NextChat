# NextChat Mobile 启动指南

本指南将帮助您快速启动和运行 NextChat Mobile 应用。

## 环境准备

在开始之前，请确保您的开发环境已安装以下工具：

1. Node.js (推荐版本 16 或更高)
2. npm 或 yarn 包管理器
3. React Native CLI
4. Android Studio (用于 Android 开发)
5. Xcode (用于 iOS 开发，仅限 macOS)

## 安装步骤

### 1. 克隆项目

```bash
git clone https://github.com/ChatGPTNextWeb/NextChat.git
cd NextChat
```

### 2. 进入移动应用目录

```bash
cd mobile/NextChatMobile
```

### 3. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

## 运行应用

### Android

1. 启动 Android 模拟器或连接 Android 设备
2. 运行以下命令：

```bash
npx react-native run-android
```

### iOS (仅限 macOS)

1. 启动 iOS 模拟器或连接 iOS 设备
2. 运行以下命令：

```bash
npx react-native run-ios
```

## 开发模式

要启动开发服务器，请运行：

```bash
npx react-native start
```

## 项目结构

```
NextChatMobile/
├── src/
│   ├── api/           # API 客户端
│   ├── components/    # React 组件
│   └── store/         # 状态管理
├── App.tsx            # 主应用组件
├── index.js           # 应用入口点
└── ...
```

## 功能特性

1. **多模型支持** - 支持 OpenAI、Google、Anthropic 等多种 AI 模型
2. **聊天界面** - 直观的聊天界面，支持消息历史
3. **模型选择** - 可在多种 AI 模型间切换
4. **设置管理** - 配置 API 密钥和其他设置
5. **响应式设计** - 适配不同屏幕尺寸

## 配置 API Keys

1. 启动应用后，点击底部导航栏的"设置"选项
2. 在设置界面输入您的 API Keys
3. 选择想要使用的 AI 模型
4. 保存设置

## 调试

### 启用调试菜单

1. 在模拟器或设备上摇动设备
2. 选择"Debug"选项
3. 在浏览器中打开 http://localhost:8081/debugger-ui

### 日志查看

```bash
# 查看 Android 日志
npx react-native log-android

# 查看 iOS 日志
npx react-native log-ios
```

## 构建发布版本

### Android

```bash
npx react-native build-android --mode=release
```

### iOS

```bash
npx react-native build-ios --mode=release
```

## 故障排除

### 常见问题

1. **Metro server 未启动**
   - 运行 `npx react-native start` 启动 Metro server

2. **依赖安装失败**
   - 删除 `node_modules` 文件夹和 `package-lock.json` 文件
   - 重新运行 `npm install`

3. **Android 构建失败**
   - 确保 Android Studio 和 Android SDK 已正确安装
   - 检查环境变量是否正确配置

### 获取帮助

如果遇到问题，请查看：
- [React Native 官方文档](https://reactnative.dev/)
- [NextChat GitHub 仓库](https://github.com/ChatGPTNextWeb/NextChat)
- 提交 issue 或寻求社区帮助