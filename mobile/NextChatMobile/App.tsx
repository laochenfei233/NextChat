import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import HomeScreen from './src/components/HomeScreen';
import ModelSelectionScreen from './src/components/ModelSelectionScreen';
import ImageGenerationScreen from './src/components/ImageGenerationScreen';
import { useChatStore } from './src/store/chatStore';
import { isTablet } from './src/utils/device';

const App = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'models' | 'image'>('home');
  const [isInitializing, setIsInitializing] = useState(true);
  const initializeStore = useChatStore(state => state.initializeStore);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeStore();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, [initializeStore]);

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {currentTab === 'home' ? (
        <HomeScreen />
      ) : currentTab === 'models' ? (
        <ModelSelectionScreen />
      ) : (
        <ImageGenerationScreen />
      )}
      
      {/* Tab bar - hidden on tablets (iPad/Android tablets) since we'll use a sidebar-like interface */}
      {!isTablet() && (
        <View style={styles.tabBar}>
          <View style={styles.tabContainer}>
            <View style={styles.tabItem}>
              <View 
                style={[styles.tabButton, currentTab === 'home' && styles.activeTabButton]}
                onTouchEnd={() => setCurrentTab('home')}
              />
              <View style={styles.tabLabelContainer}>
                <View style={[styles.tabLabel, currentTab === 'home' && styles.activeTabLabel]} />
              </View>
            </View>
            
            <View style={styles.tabItem}>
              <View 
                style={[styles.tabButton, currentTab === 'models' && styles.activeTabButton]}
                onTouchEnd={() => setCurrentTab('models')}
              />
              <View style={styles.tabLabelContainer}>
                <View style={[styles.tabLabel, currentTab === 'models' && styles.activeTabLabel]} />
              </View>
            </View>
            
            <View style={styles.tabItem}>
              <View 
                style={[styles.tabButton, currentTab === 'image' && styles.activeTabButton]}
                onTouchEnd={() => setCurrentTab('image')}
              />
              <View style={styles.tabLabelContainer}>
                <View style={[styles.tabLabel, currentTab === 'image' && styles.activeTabLabel]} />
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 60,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
  },
  activeTabButton: {
    backgroundColor: '#3498db',
  },
  tabLabelContainer: {
    marginTop: 4,
  },
  tabLabel: {
    width: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  activeTabLabel: {
    backgroundColor: '#3498db',
  },
});

export default App;