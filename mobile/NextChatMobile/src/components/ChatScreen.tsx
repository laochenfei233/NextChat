import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useChatStore } from '../store/chatStore';
import { apiClient } from '../api/client';
import { audioManager } from '../utils/audio';
import { fileUtils } from '../utils/file';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatScreen: React.FC = () => {
  const { sessions, currentSessionIndex, addMessage, selectedModel } = useChatStore();
  const currentSession = sessions[currentSessionIndex];
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; uri: string } | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Convert session messages to UI messages
  const messages = currentSession.messages.map(msg => ({
    id: msg.id,
    text: msg.content,
    isUser: msg.role === 'user',
    timestamp: new Date(msg.date),
  }));

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if ((inputText.trim() === '' && !attachedFile) || isLoading) return;

    // Add user message
    let content = inputText;
    if (attachedFile) {
      content += `\n[Attached file: ${attachedFile.name}]`;
    }

    addMessage({
      role: 'user',
      content,
      model: selectedModel,
    });

    const userMessageText = content;
    setInputText('');
    setAttachedFile(null);
    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = currentSession.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: userMessageText,
      });

      // Get AI response
      const response = await apiClient.chat(apiMessages, selectedModel);

      // Add AI message
      addMessage({
        role: 'assistant',
        content: response,
        model: selectedModel,
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        model: selectedModel,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      const hasPermission = await audioManager.requestAudioPermissions();
      if (!hasPermission) {
        Alert.alert('Permission required', 'Microphone permission is needed for voice input.');
        return;
      }

      setIsListening(true);
      await audioManager.startListening();
      
      // Auto-stop listening after 5 seconds
      setTimeout(async () => {
        if (isListening) {
          try {
            const result = await audioManager.getSpeechResults();
            if (result) {
              setInputText(result);
            }
            setIsListening(false);
          } catch (error) {
            console.error('Speech recognition error:', error);
            setIsListening(false);
          }
        }
      }, 5000);
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
      Alert.alert('Error', 'Failed to start voice input. Please try again.');
    }
  };

  const handleStopListening = async () => {
    try {
      await audioManager.stopListening();
      setIsListening(false);
    } catch (error) {
      console.error('Stop listening error:', error);
      setIsListening(false);
    }
  };

  const handleSpeakMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      await audioManager.speak(text);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
      Alert.alert('Error', 'Failed to speak the message. Please try again.');
    }
  };

  const handleAttachFile = async () => {
    try {
      const file = await fileUtils.pickDocument();
      if (file) {
        setAttachedFile({
          name: file.name,
          uri: file.uri,
        });
        Alert.alert('File Attached', `Attached: ${file.name}`);
      }
    } catch (error) {
      console.error('File attachment error:', error);
      Alert.alert('Error', 'Failed to attach file. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
        {item.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {!item.isUser && (
          <TouchableOpacity 
            style={styles.speakButton}
            onPress={() => handleSpeakMessage(item.text)}
            disabled={isSpeaking}
          >
            <Text style={styles.speakButtonText}>
              {isSpeaking ? 'Speaking...' : 'Speak'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NextChat</Text>
        <Text style={styles.headerSubtitle}>{selectedModel}</Text>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#3498db" />
          <Text style={styles.loadingText}>Thinking...</Text>
        </View>
      )}
      
      {isListening && (
        <View style={styles.listeningContainer}>
          <ActivityIndicator size="small" color="#e74c3c" />
          <Text style={styles.listeningText}>Listening... Tap to stop</Text>
          <TouchableOpacity style={styles.stopListeningButton} onPress={handleStopListening}>
            <Text style={styles.stopListeningText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {attachedFile && (
        <View style={styles.attachedFileContainer}>
          <Text style={styles.attachedFileName} numberOfLines={1}>
            📎 {attachedFile.name}
          </Text>
          <TouchableOpacity onPress={handleRemoveFile} style={styles.removeFileButton}>
            <Text style={styles.removeFileText}>×</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TouchableOpacity 
          style={styles.voiceButton}
          onPress={isListening ? handleStopListening : handleVoiceInput}
        >
          <Text style={styles.voiceButtonText}>
            {isListening ? '⏹️' : '🎤'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={handleAttachFile}
        >
          <Text style={styles.attachButtonText}>📎</Text>
        </TouchableOpacity>
        
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          style={styles.textInput}
          multiline
          editable={!isLoading && !isListening}
        />
        
        <TouchableOpacity 
          style={[styles.sendButton, (isLoading || isListening) && styles.disabledSendButton]} 
          onPress={handleSend}
          disabled={isLoading || isListening}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
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
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: '#3498db',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: 'black',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  speakButton: {
    padding: 4,
  },
  speakButtonText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  listeningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  listeningText: {
    marginLeft: 8,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  stopListeningButton: {
    marginLeft: 12,
    padding: 6,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  stopListeningText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  attachedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e3f2fd',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  attachedFileName: {
    flex: 1,
    fontSize: 14,
    color: '#3498db',
  },
  removeFileButton: {
    padding: 4,
  },
  removeFileText: {
    fontSize: 18,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'flex-end',
  },
  voiceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginRight: 8,
  },
  voiceButtonText: {
    fontSize: 20,
  },
  attachButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginRight: 8,
  },
  attachButtonText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;