import { Platform } from 'react-native';
// @ts-ignore
import DocumentPicker from 'react-native-document-picker';
// @ts-ignore
import RNFS from 'react-native-fs';

export class FileUtils {
  private static instance: FileUtils;

  private constructor() {}

  static getInstance(): FileUtils {
    if (!FileUtils.instance) {
      FileUtils.instance = new FileUtils();
    }
    return FileUtils.instance;
  }

  // Pick a document
  async pickDocument(): Promise<{ uri: string; name: string; size: number; type: string } | null> {
    try {
      const result = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      
      return {
        uri: result.uri,
        name: result.name,
        size: result.size,
        type: result.type,
      };
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        return null;
      } else {
        throw err;
      }
    }
  }

  // Read file content
  async readFile(uri: string): Promise<string> {
    try {
      // For Android, we might need to copy the file to a readable location first
      if (Platform.OS === 'android' && uri.startsWith('content://')) {
        const destPath = `${RNFS.DocumentDirectoryPath}/temp_file`;
        await RNFS.copyFile(uri, destPath);
        const content = await RNFS.readFile(destPath, 'base64');
        await RNFS.unlink(destPath); // Clean up
        return content;
      } else {
        // For other cases, read directly
        return await RNFS.readFile(uri, 'base64');
      }
    } catch (error) {
      console.error('File read error:', error);
      throw error;
    }
  }

  // Get file extension
  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }

  // Check if file is an image
  isImageFile(filename: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return imageExtensions.includes(extension);
  }

  // Check if file is a document
  isDocumentFile(filename: string): boolean {
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'xls', 'xlsx', 'ppt', 'pptx'];
    const extension = this.getFileExtension(filename).toLowerCase();
    return documentExtensions.includes(extension);
  }
}

export const fileUtils = FileUtils.getInstance();