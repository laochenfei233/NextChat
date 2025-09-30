import { Platform } from 'react-native';
import Tts from 'react-native-tts';
// @ts-ignore
import Voice from '@react-native-voice/voice';

// Initialize TTS
Tts.setDefaultLanguage('en-US');
Tts.setDefaultRate(0.5);
Tts.setDefaultPitch(1.0);

// Voice recognition events
Voice.onSpeechStart = (e: any) => {
  console.log('Speech start detected', e);
};

Voice.onSpeechEnd = (e: any) => {
  console.log('Speech end detected', e);
};

Voice.onSpeechResults = (e: any) => {
  console.log('Speech results', e);
};

Voice.onSpeechError = (e: any) => {
  console.log('Speech error', e);
};

export class AudioManager {
  private static instance: AudioManager;
  private isPlaying: boolean = false;
  private isListening: boolean = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Text to Speech
  async speak(text: string, language: string = 'en-US'): Promise<void> {
    if (this.isPlaying) {
      await Tts.stop();
    }

    return new Promise((resolve, reject) => {
      try {
        Tts.setDefaultLanguage(language);
        Tts.getInitStatus().then(() => {
          this.isPlaying = true;
          Tts.speak(text);
          
          Tts.addEventListener('tts-finish', () => {
            this.isPlaying = false;
            resolve();
          });
          
          Tts.addEventListener('tts-error', (error: any) => {
            this.isPlaying = false;
            reject(error);
          });
        });
      } catch (error) {
        this.isPlaying = false;
        reject(error);
      }
    });
  }

  stopSpeaking(): void {
    Tts.stop();
    this.isPlaying = false;
  }

  // Speech to Text
  async startListening(language: string = 'en-US'): Promise<void> {
    if (this.isListening) {
      await Voice.stop();
    }

    try {
      await Voice.start(language);
      this.isListening = true;
    } catch (error) {
      this.isListening = false;
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      this.isListening = false;
      throw error;
    }
  }

  async getSpeechResults(): Promise<string> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Speech recognition timeout'));
      }, 5000);

      Voice.onSpeechResults = (e: any) => {
        clearTimeout(timeout);
        resolve(e.value?.[0] || '');
      };

      Voice.onSpeechError = (e: any) => {
        clearTimeout(timeout);
        reject(new Error(e.error?.message || 'Speech recognition error'));
      };
    });
  }

  // Check permissions
  async requestAudioPermissions(): Promise<boolean> {
    // In a real implementation, you would use PermissionsAndroid for Android
    // and handle permissions for iOS
    if (Platform.OS === 'android') {
      // Request microphone permission for Android
      // This is a simplified version - in practice you would use PermissionsAndroid
      return true;
    } else {
      // iOS permissions are typically handled in Info.plist
      return true;
    }
  }
}

export const audioManager = AudioManager.getInstance();