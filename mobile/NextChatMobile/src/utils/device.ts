import { Platform, Dimensions } from 'react-native';

export const isTablet = () => {
  if (Platform.OS === 'ios') {
    // For iOS, we can use the user interface idiom
    // This requires importing { Platform } from 'react-native'
    return Platform.isPad || Platform.isTV;
  } else if (Platform.OS === 'android') {
    // For Android, we'll use screen dimensions as a heuristic
    const { width, height } = Dimensions.get('window');
    const aspectRatio = Math.min(width, height) / Math.max(width, height);
    const isWideScreen = aspectRatio > 0.6; // Closer to square screens are more likely tablets
    
    // Tablets typically have larger screens
    // This is a rough heuristic; you might need to adjust based on your needs
    const diagonalInches = Math.sqrt(width * width + height * height) / 160; // 160 is approximate dpi
    
    // Tablets are generally 7+ inches and have a more square aspect ratio
    return diagonalInches >= 7 && isWideScreen;
  }
  
  return false;
};

export const isIpad = () => {
  return Platform.OS === 'ios' && Platform.isPad;
};

export const isMobile = () => {
  return !isTablet();
};