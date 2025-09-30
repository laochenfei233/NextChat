import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useChatStore } from '../store/chatStore';

interface Model {
  id: string;
  name: string;
  provider: string;
  description: string;
}

const ModelSelectionScreen: React.FC = () => {
  const { selectedModel, setSelectedModel } = useChatStore();
  const [localSelectedModel, setLocalSelectedModel] = useState('');

  useEffect(() => {
    setLocalSelectedModel(selectedModel);
  }, [selectedModel]);

  const models: Model[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Most capable GPT-4 model, optimized for chat at 128K context length.',
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      description: 'GPT-4 Turbo with improved instruction following and JSON mode.',
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: 'Fast and capable model optimized for chat and traditional completions.',
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Google\'s largest and most capable multimodal model.',
    },
    {
      id: 'gemini-pro-vision',
      name: 'Gemini Pro Vision',
      provider: 'Google',
      description: 'Multimodal model that supports image and text understanding.',
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Most powerful model, excels at highly complex tasks.',
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Ideal balance of intelligence and speed.',
    },
    {
      id: 'ernie-bot-4',
      name: 'ERNIE Bot 4',
      provider: 'Baidu',
      description: 'Baidu\'s most advanced model with enhanced reasoning capabilities.',
    },
    {
      id: 'ernie-bot',
      name: 'ERNIE Bot',
      provider: 'Baidu',
      description: 'Baidu\'s general-purpose model with balanced performance.',
    },
    {
      id: 'ernie-bot-turbo',
      name: 'ERNIE Bot Turbo',
      provider: 'Baidu',
      description: 'Baidu\'s faster model with good performance.',
    },
    {
      id: 'qwen-max',
      name: 'Qwen Max',
      provider: 'Alibaba',
      description: 'Alibaba\'s most capable model for complex tasks.',
    },
    {
      id: 'qwen-plus',
      name: 'Qwen Plus',
      provider: 'Alibaba',
      description: 'Balanced model with good performance and cost.',
    },
    {
      id: 'qwen-turbo',
      name: 'Qwen Turbo',
      provider: 'Alibaba',
      description: 'Alibaba\'s faster model with good performance.',
    },
    {
      id: 'glm-4',
      name: 'GLM-4',
      provider: 'Zhipu AI',
      description: 'Zhipu AI\'s most advanced model with strong reasoning capabilities.',
    },
    {
      id: 'glm-3-turbo',
      name: 'GLM-3 Turbo',
      provider: 'Zhipu AI',
      description: 'Zhipu AI\'s efficient model with good performance.',
    },
    {
      id: 'spark3',
      name: 'Spark 3.0',
      provider: 'Iflytek',
      description: 'Iflytek\'s latest large model with enhanced capabilities.',
    },
    {
      id: 'kimi-chat',
      name: 'Kimi Chat',
      provider: 'Moonshot AI',
      description: 'Moonshot AI\'s long-context model supporting 100K tokens.',
    },
    {
      id: 'deepseek-chat',
      name: 'DeepSeek Chat',
      provider: 'DeepSeek',
      description: 'DeepSeek\'s chat model with strong reasoning capabilities.',
    },
  ];

  const handleSelectModel = (modelId: string) => {
    setLocalSelectedModel(modelId);
  };

  const handleConfirmSelection = () => {
    setSelectedModel(localSelectedModel);
    alert(`Model updated to: ${models.find(m => m.id === localSelectedModel)?.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select AI Model</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        {models.map((model) => (
          <TouchableOpacity
            key={model.id}
            style={[
              styles.modelCard,
              localSelectedModel === model.id && styles.selectedModelCard,
            ]}
            onPress={() => handleSelectModel(model.id)}
          >
            <View style={styles.modelHeader}>
              <Text style={styles.modelName}>{model.name}</Text>
              <Text style={styles.modelProvider}>{model.provider}</Text>
            </View>
            <Text style={styles.modelDescription}>{model.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
          <Text style={styles.confirmButtonText}>Confirm Selection</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  modelCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedModelCard: {
    borderColor: '#3498db',
    borderWidth: 2,
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modelProvider: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  modelDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModelSelectionScreen;