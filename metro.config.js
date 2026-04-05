const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  projectRoot: __dirname,
  watchFolders: [__dirname],
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'mjs'],
    extraNodeModules: {
      'react-native': require.resolve('react-native'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
