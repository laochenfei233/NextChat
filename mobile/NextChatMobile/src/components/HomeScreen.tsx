import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import ChatScreen from './ChatScreen';
import SettingsScreen from './SettingsScreen';
import { isTablet } from '../utils/device';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'chat' | 'settings'>('chat');
  const isTabletDevice = isTablet();

  return (
    <SafeAreaView style={styles.container}>
      {isTabletDevice ? (
        // Tablet layout with sidebar for both iPad and Android tablets
        <View style={styles.tabletContainer}>
          <View style={styles.sidebar}>
            <TouchableOpacity 
              style={[styles.sidebarButton, currentScreen === 'chat' && styles.activeSidebarButton]}
              onPress={() => setCurrentScreen('chat')}
            >
              <Text style={[styles.sidebarButtonText, currentScreen === 'chat' && styles.activeSidebarButtonText]}>
                Chat
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sidebarButton, currentScreen === 'settings' && styles.activeSidebarButton]}
              onPress={() => setCurrentScreen('settings')}
            >
              <Text style={[styles.sidebarButtonText, currentScreen === 'settings' && styles.activeSidebarButtonText]}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.mainContent}>
            {currentScreen === 'chat' ? <ChatScreen /> : <SettingsScreen />}
          </View>
        </View>
      ) : (
        // Mobile layout with top tabs
        <View style={styles.mobileContainer}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.headerButton, currentScreen === 'chat' && styles.activeHeaderButton]}
              onPress={() => setCurrentScreen('chat')}
            >
              <Text style={[styles.headerButtonText, currentScreen === 'chat' && styles.activeHeaderButtonText]}>
                Chat
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.headerButton, currentScreen === 'settings' && styles.activeHeaderButton]}
              onPress={() => setCurrentScreen('settings')}
            >
              <Text style={[styles.headerButtonText, currentScreen === 'settings' && styles.activeHeaderButtonText]}>
                Settings
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {currentScreen === 'chat' ? <ChatScreen /> : <SettingsScreen />}
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
  mobileContainer: {
    flex: 1,
  },
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#3498db',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  sidebarButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  activeSidebarButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sidebarButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeSidebarButtonText: {
    color: 'white',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 12,
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeHeaderButtonText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;