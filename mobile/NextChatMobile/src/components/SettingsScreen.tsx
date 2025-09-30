import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { useChatStore } from '../store/chatStore';

const SettingsScreen: React.FC = () => {
  const { apiKey, secretKey, selectedModel, setApiKey, setSecretKey, setSelectedModel } = useChatStore();
  const [localApiKey, setLocalApiKey] = useState('');
  const [localSecretKey, setLocalSecretKey] = useState(''); // For Baidu ERNIE models
  const [localSelectedModel, setLocalSelectedModel] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setLocalApiKey(apiKey);
    setLocalSecretKey(secretKey); // For Baidu ERNIE models
    setLocalSelectedModel(selectedModel);
  }, [apiKey, secretKey, selectedModel]);

  const handleSave = () => {
    setApiKey(localApiKey);
    setSecretKey(localSecretKey); // For Baidu ERNIE models
    setSelectedModel(localSelectedModel);
    Alert.alert('Settings Saved', 'Your settings have been saved successfully.');
  };

  const handleClear = () => {
    Alert.alert(
      'Confirm Clear',
      'Are you sure you want to clear your API keys?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setLocalApiKey('');
            setLocalSecretKey(''); // For Baidu ERNIE models
            setApiKey('');
            setSecretKey(''); // For Baidu ERNIE models
            Alert.alert('Cleared', 'API keys have been cleared.');
          },
        },
      ]
    );
  };

  const models = [
    { id: 'gpt-4', name: 'GPT-4 (OpenAI)' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (OpenAI)' },
    { id: 'gemini-pro', name: 'Gemini Pro (Google)' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision (Google)' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus (Anthropic)' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet (Anthropic)' },
    { id: 'ernie-bot-4', name: 'ERNIE Bot 4 (Baidu)' },
    { id: 'ernie-bot', name: 'ERNIE Bot (Baidu)' },
    { id: 'qwen-max', name: 'Qwen Max (Alibaba)' },
    { id: 'qwen-plus', name: 'Qwen Plus (Alibaba)' },
    { id: 'chatglm3-6b', name: 'ChatGLM3 6B (Zhipu AI)' },
    { id: 'kimi-chat', name: 'Kimi Chat (Moonshot)' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>NextChat Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>API Configuration</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>API Key</Text>
            <TextInput
              style={styles.input}
              value={localApiKey}
              onChangeText={setLocalApiKey}
              placeholder="Enter your API key"
              secureTextEntry
            />
            <Text style={styles.description}>
              Enter your OpenAI, Google, or other provider API key to enable chat functionality.
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Secret Key (for Baidu only)</Text>
            <TextInput
              style={styles.input}
              value={localSecretKey}
              onChangeText={setLocalSecretKey}
              placeholder="Enter your Baidu Secret Key"
              secureTextEntry
            />
            <Text style={styles.description}>
              Enter your Baidu Secret Key if you want to use Baidu ERNIE models.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model Selection</Text>
          
          {models.map((model) => (
            <TouchableOpacity
              key={model.id}
              style={[
                styles.modelOption,
                localSelectedModel === model.id && styles.selectedModelOption,
              ]}
              onPress={() => setLocalSelectedModel(model.id)}
            >
              <Text style={styles.modelName}>{model.name}</Text>
              {localSelectedModel === model.id && (
                <View style={styles.checkmarkContainer}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear API Keys</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  modelOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedModelOption: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  modelName: {
    fontSize: 16,
    color: '#333',
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginLeft: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;