import AsyncStorage from '@react-native-async-storage/async-storage';

// Message storage optimization
export class MessageStorage {
  private static readonly MESSAGE_STORAGE_KEY = 'nextchat_messages';
  private static readonly MAX_MESSAGES_PER_SESSION = 100;
  private static readonly MAX_SESSIONS = 10;

  // Save messages with optimization
  static async saveMessages(sessions: any[]): Promise<void> {
    try {
      // Limit the number of messages per session
      const optimizedSessions = sessions.map(session => ({
        ...session,
        messages: session.messages.slice(-this.MAX_MESSAGES_PER_SESSION)
      })).slice(-this.MAX_SESSIONS);

      const data = JSON.stringify(optimizedSessions);
      await AsyncStorage.setItem(this.MESSAGE_STORAGE_KEY, data);
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  }

  // Load messages
  static async loadMessages(): Promise<any[] | null> {
    try {
      const data = await AsyncStorage.getItem(this.MESSAGE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load messages:', error);
      return null;
    }
  }

  // Clear messages
  static async clearMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.MESSAGE_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  }
}

// Network optimization
export class NetworkOptimizer {
  private static readonly CACHE_KEY_PREFIX = 'nextchat_cache_';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Cache API responses
  static async cacheResponse(key: string, data: any): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      const cacheKey = `${this.CACHE_KEY_PREFIX}${key}`;
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache response:', error);
    }
  }

  // Get cached response
  static async getCachedResponse(key: string): Promise<any | null> {
    try {
      const cacheKey = `${this.CACHE_KEY_PREFIX}${key}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Check if cache is still valid
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          return data;
        } else {
          // Remove expired cache
          await AsyncStorage.removeItem(cacheKey);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get cached response:', error);
      return null;
    }
  }

  // Clear cache
  static async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.CACHE_KEY_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

// App performance monitoring
export class PerformanceMonitor {
  private static startTime: number | null = null;

  // Start performance measurement
  static startMeasurement(): void {
    this.startTime = performance.now();
  }

  // End performance measurement
  static endMeasurement(label: string): number | null {
    if (this.startTime !== null) {
      const endTime = performance.now();
      const duration = endTime - this.startTime;
      console.log(`${label} took ${duration.toFixed(2)} milliseconds`);
      this.startTime = null;
      return duration;
    }
    return null;
  }

  // Measure function execution time
  static async measureAsync<T>(fn: () => Promise<T>, label: string): Promise<T> {
    this.startMeasurement();
    try {
      const result = await fn();
      this.endMeasurement(label);
      return result;
    } catch (error) {
      this.endMeasurement(label);
      throw error;
    }
  }
}

// Memory optimization
export class MemoryOptimizer {
  // Debounce function to limit function calls
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  // Throttle function to limit function calls
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}