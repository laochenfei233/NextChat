# NextChat Mobile

NextChat Mobile is the mobile version of the NextChat application, built with React Native. It provides a native mobile experience for chatting with various AI models.

## Features

- Cross-platform support (iOS & Android)
- Support for multiple AI models:
  - OpenAI GPT Models
  - Google Gemini
  - Anthropic Claude
  - Baidu ERNIE
  - Alibaba Qwen
  - Tencent Hunyuan
  - Moonshot Kimi
  - Iflytek Spark
  - Zhipu ChatGLM
  - DeepSeek
  - And more...
- Chat interface with message history
- Model selection
- Settings for API key configuration
- Light/dark mode

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ChatGPTNextWeb/NextChat.git
   ```

2. Navigate to the mobile directory:
   ```bash
   cd NextChat/mobile/NextChatMobile
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

#### For Android

1. Start an Android emulator or connect an Android device
2. Run the app:
   ```bash
   npx react-native run-android
   ```

#### For iOS

1. Start an iOS simulator or connect an iOS device
2. Run the app:
   ```bash
   npx react-native run-ios
   ```

## Project Structure

```
NextChatMobile/
├── src/
│   ├── components/
│   │   ├── ChatScreen.tsx          # Main chat interface
│   │   ├── SettingsScreen.tsx      # API key and settings management
│   │   ├── ModelSelectionScreen.tsx # AI model selection
│   │   └── HomeScreen.tsx          # Main screen with tab navigation
│   └── ...
├── App.tsx                         # Main app component
├── index.js                        # Entry point
└── ...
```

## Integration with NextChat

The mobile app is designed to work with the same backend and API structure as the web version of NextChat. It uses the same configuration and data models to provide a consistent experience across platforms.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.