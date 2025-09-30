# NextChat Mobile 集成国内主流大模型指南

NextChat Mobile 支持多种国内外主流大语言模型。本文档将介绍如何集成国内主流大模型。

## 支持的国内大模型

1. 百度 ERNIE 系列
2. 阿里云 Qwen 系列
3. 讯飞星火
4. 智谱 ChatGLM 系列
5. 月之暗面 Kimi
6. DeepSeek
7. 腾讯混元

## 集成方法

### 1. 百度 ERNIE

百度 ERNIE 模型通过其官方 API 提供服务。

#### API 配置
- Endpoint: `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat`
- 需要获取 API Key 和 Secret Key

#### 实现示例
```typescript
class BaiduErnieClient {
  async chat(messages: Message[], model: string): Promise<string> {
    // 获取 access token
    const accessToken = await this.getAccessToken();
    
    // 发送请求
    const response = await axios.post(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${model}?access_token=${accessToken}`,
      { messages }
    );
    
    return response.data.result;
  }
}
```

### 2. 阿里云 Qwen

阿里云 Qwen 模型通过 DashScope 平台提供服务。

#### API 配置
- Endpoint: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- 需要获取 API Key

#### 实现示例
```typescript
class AlibabaQwenClient {
  async chat(messages: Message[], model: string): Promise<string> {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        model,
        input: { messages },
        parameters: { result_format: 'message' }
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.output.choices[0].message.content;
  }
}
```

### 3. 讯飞星火

讯飞星火模型通过 WebSocket 接口提供服务。

#### API 配置
- Endpoint: `wss://spark-api.xf-yun.com/v3.5/chat`
- 需要获取 APPID、API Key 和 API Secret

#### 实现示例
```typescript
class IflytekSparkClient {
  async chat(messages: Message[], model: string): Promise<string> {
    // 构建 WebSocket URL
    const url = this.buildWebSocketUrl();
    
    // 通过 WebSocket 发送消息并接收响应
    const response = await this.sendWebSocketMessage(url, messages);
    
    return response;
  }
}
```

### 4. 智谱 ChatGLM

智谱 ChatGLM 模型通过其官方 API 提供服务。

#### API 配置
- Endpoint: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 需要获取 API Key

#### 实现示例
```typescript
class ZhipuChatGLMClient {
  async chat(messages: Message[], model: string): Promise<string> {
    const response = await axios.post(
      'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      {
        model,
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
```

### 5. 月之暗面 Kimi

月之暗面 Kimi 模型通过其官方 API 提供服务。

#### API 配置
- Endpoint: `https://api.moonshot.cn/v1/chat/completions`
- 需要获取 API Key

#### 实现示例
```typescript
class MoonshotKimiClient {
  async chat(messages: Message[], model: string): Promise<string> {
    const response = await axios.post(
      'https://api.moonshot.cn/v1/chat/completions',
      {
        model,
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
```

### 6. DeepSeek

DeepSeek 模型通过其官方 API 提供服务。

#### API 配置
- Endpoint: `https://api.deepseek.com/v1/chat/completions`
- 需要获取 API Key

#### 实现示例
```typescript
class DeepSeekClient {
  async chat(messages: Message[], model: string): Promise<string> {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model,
        messages
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  }
}
```

### 7. 腾讯混元

腾讯混元模型通过其官方 API 提供服务。

#### API 配置
- Endpoint: `https://hunyuan.tencentcloudapi.com`
- 需要获取 SecretId 和 SecretKey

#### 实现示例
```typescript
class TencentHunyuanClient {
  async chat(messages: Message[], model: string): Promise<string> {
    // 构建请求参数和签名
    const params = this.buildRequestParams(messages, model);
    
    const response = await axios.post(
      'https://hunyuan.tencentcloudapi.com',
      params,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.Response.Choices[0].Message.Content;
  }
}
```

## 配置 API Keys

在移动应用中，用户可以在设置界面配置各种模型的 API Keys：

1. 打开应用设置界面
2. 输入对应模型的 API Key
3. 保存设置

## 模型选择

用户可以在模型选择界面选择想要使用的模型：

1. 打开模型选择界面
2. 浏览可用模型列表
3. 选择目标模型
4. 确认选择

## 注意事项

1. 各模型的 API 调用可能有不同的限制和配额
2. 部分模型可能需要特殊处理（如讯飞星火的 WebSocket 接口）
3. 注意保护用户的 API Keys，避免泄露
4. 根据网络环境选择合适的超时设置

## 贡献

欢迎为集成更多国内大模型提交 Pull Request。