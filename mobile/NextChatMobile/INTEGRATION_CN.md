# NextChat Mobile 国内大模型集成指南

NextChat Mobile 已经设计为支持多种国内外主流大语言模型。本文档将详细介绍如何集成国内主流大模型。

## 已支持的国内大模型

1. 百度 ERNIE 系列
2. 阿里云 Qwen 系列
3. 讯飞星火
4. 智谱 ChatGLM 系列
5. 月之暗面 Kimi
6. DeepSeek
7. 腾讯混元

## 集成架构

NextChat Mobile 使用模块化设计，通过统一的 API 客户端接口支持不同厂商的模型：

```typescript
interface APIClient {
  chat(messages: Message[], model: string): Promise<string>;
}
```

## 各模型集成方法

### 1. 百度 ERNIE

百度 ERNIE 模型通过其官方 API 提供服务。

#### API 配置
- 接入点: `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat`
- 所需凭证: API Key 和 Secret Key

#### 实现要点
1. 首先通过 API Key 和 Secret Key 获取访问令牌
2. 使用访问令牌调用具体模型接口
3. 解析返回结果

### 2. 阿里云 Qwen

阿里云 Qwen 模型通过 DashScope 平台提供服务。

#### API 配置
- 接入点: `https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation`
- 所需凭证: API Key

#### 实现要点
1. 在请求头中设置 Authorization 字段
2. 根据不同模型选择合适的参数
3. 处理流式和非流式响应

### 3. 讯飞星火

讯飞星火模型通过 WebSocket 接口提供服务。

#### API 配置
- 接入点: `wss://spark-api.xf-yun.com/v3.5/chat`
- 所需凭证: APPID、API Key 和 API Secret

#### 实现要点
1. 构造带有认证信息的 WebSocket URL
2. 建立 WebSocket 连接
3. 发送消息并监听返回结果
4. 正确处理连接的打开、消息接收和关闭事件

### 4. 智谱 ChatGLM

智谱 ChatGLM 模型通过其官方 API 提供服务。

#### API 配置
- 接入点: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- 所需凭证: API Key

#### 实现要点
1. 在请求头中使用 Authorization 字段传递 API Key
2. 支持同步和流式调用
3. 正确处理不同版本模型的差异

### 5. 月之暗面 Kimi

月之暗面 Kimi 模型通过其官方 API 提供服务。

#### API 配置
- 接入点: `https://api.moonshot.cn/v1/chat/completions`
- 所需凭证: API Key

#### 实现要点
1. 支持超长上下文（最长100K tokens）
2. 处理文件上传和分析功能
3. 正确设置请求参数

### 6. DeepSeek

DeepSeek 模型通过其官方 API 提供服务。

#### API 配置
- 接入点: `https://api.deepseek.com/v1/chat/completions`
- 所需凭证: API Key

#### 实现要点
1. 支持代码理解和生成
2. 提供不同专业领域的模型
3. 处理高并发请求

### 7. 腾讯混元

腾讯混元模型通过其官方 API 提供服务。

#### API 配置
- 接入点: `https://hunyuan.tencentcloudapi.com`
- 所需凭证: SecretId 和 SecretKey

#### 实现要点
1. 使用腾讯云签名算法对请求进行签名
2. 处理复杂的请求和响应结构
3. 支持多种模态的处理

## 移动端配置

在移动端，用户可以通过以下步骤配置各模型：

1. 打开应用
2. 进入"设置"界面
3. 输入对应模型的 API 凭证
4. 在"模型选择"界面选择要使用的模型
5. 保存配置

## 安全注意事项

1. **API Key 保护**
   - 在本地安全存储 API Keys
   - 避免将密钥提交到代码仓库
   - 提供清除密钥的功能

2. **网络传输安全**
   - 始终使用 HTTPS 连接
   - 验证服务器证书
   - 处理网络异常情况

3. **用户隐私**
   - 明确告知用户数据使用方式
   - 提供数据清除功能
   - 遵守相关隐私法规

## 性能优化

1. **缓存策略**
   - 缓存模型列表
   - 缓存常用响应
   - 实现合理的缓存过期机制

2. **网络优化**
   - 实现请求重试机制
   - 添加网络状态检测
   - 提供离线功能支持

3. **资源管理**
   - 及时释放 WebSocket 连接
   - 管理内存使用
   - 优化图片和其他资源加载

## 贡献指南

欢迎为项目贡献代码，特别是新增模型支持：

1. Fork 项目
2. 创建功能分支
3. 实现新模型支持
4. 添加相关文档
5. 提交 Pull Request

## 技术支持

如遇到技术问题，可通过以下方式获取帮助：

1. 查看官方文档
2. 提交 GitHub Issue
3. 参考相关厂商的官方文档
4. 加入社区讨论