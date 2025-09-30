const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    resolverMainFields: ['react-native', 'browser', 'main'],
    // 添加对Node.js核心模块的处理
    extraNodeModules: {
      // 将crypto映射到一个空模块或者polyfill
      crypto: require.resolve('./__mocks__/crypto.js'),
    }
  }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);