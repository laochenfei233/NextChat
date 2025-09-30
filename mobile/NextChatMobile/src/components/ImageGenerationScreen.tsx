import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { imageUtils } from '../utils/image';

const ImageGenerationScreen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a prompt for image generation');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await imageUtils.generateImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (err) {
      console.error('Image generation error:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      // In a real app, you would use a library like react-native-camera-roll to save to gallery
      Alert.alert('Info', 'In a real application, this would save the image to your device gallery.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Image Generation</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Enter your prompt:</Text>
          <TextInput
            style={styles.textInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe the image you want to generate..."
            multiline
            numberOfLines={4}
          />
          
          <TouchableOpacity 
            style={styles.generateButton} 
            onPress={handleGenerateImage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.generateButtonText}>Generate Image</Text>
            )}
          </TouchableOpacity>
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {generatedImage && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: generatedImage }} 
              style={styles.generatedImage}
              resizeMode="contain"
            />
            
            <TouchableOpacity 
              style={styles.downloadButton} 
              onPress={handleDownloadImage}
            >
              <Text style={styles.downloadButtonText}>Save to Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  inputSection: {
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generatedImage: {
    width: 300,
    height: 300,
    marginBottom: 16,
  },
  downloadButton: {
    backgroundColor: '#27ae60',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ImageGenerationScreen;