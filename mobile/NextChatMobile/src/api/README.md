# API 客户端说明

本目录包含用于与各种 AI 服务提供商进行通信的客户端实现。

## 当前实现

目前实现了基本的 API 客户端架构，支持:

1. OpenAI API
2. Google Gemini API

## 扩展支持国内大模型

要添加对国内大模型的支持，请按照以下步骤操作：

### 1. 创建特定模型的客户端类

在 `client.ts` 文件中添加新的客户端类：

```typescript
class BaiduErnieClient {
  private apiKey: string;
  private secretKey: string;

  constructor(apiKey: string, secretKey: string) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }

  async chat(messages: Message[], model: string): Promise<string> {
    // 实现百度 ERNIE 模型的聊天逻辑
  }
}
```

### 2. 更新主客户端类

在 `APIClient` 类中添加对新模型的支持：

```typescript
class APIClient {
  async chat(messages: Message[], model: string): Promise<string> {
    // 根据模型名称选择合适的客户端
    if (model.startsWith('ernie')) {
      const baiduClient = new BaiduErnieClient(apiKey, secretKey);
      return baiduClient.chat(messages, model);
    }
    
    // ... 其他模型的处理
  }
}
```

### 3. 更新设置界面

在 `SettingsScreen.tsx` 中添加新模型所需的配置项：

```typescript
<View style={styles.inputGroup}>
  <Text style={styles.label}>百度 API Key</Text>
  <TextInput
    style={styles.input}
    value={baiduApiKey}
    onChangeText={setBaiduApiKey}
    placeholder="输入百度 API Key"
    secureTextEntry
  />
</View>
```

### 4. 更新模型选择界面

在 `ModelSelectionScreen.tsx` 中添加新模型：

```typescript
const models: Model[] = [
  // ... 现有模型
  {
    id: 'ernie-bot-4',
    name: 'ERNIE Bot 4',
    provider: 'Baidu',
    description: '百度最新大模型，具有强大的对话和生成能力。'
  },
  // ... 其他模型
];
```

## 各模型集成要点

### 百度 ERNIE
- 需要 API Key 和 Secret Key
- 需要先获取 access token
- 支持多种模型版本

### 阿里云 Qwen
- 需要 API Key
- 使用标准的 RESTful API
- 支持同步和流式响应

### 讯飞星火
- 需要 APPID、API Key 和 API Secret
- 使用 WebSocket 连接
- 需要特殊的身份验证机制

### 智谱 ChatGLM
- 需要 API Key
- 使用标准的 RESTful API
- 支持函数调用

### 月之暗面 Kimi
- 需要 API Key
- 支持超长上下文
- 支持文件处理

### DeepSeek
- 需要 API Key
- 专注于代码理解和生成
- 提供多种专业模型

## 注意事项

1. 保护用户凭证，避免泄露
2. 处理各种网络异常情况
3. 实现合理的错误处理和用户提示
4. 遵循各服务提供商的使用条款