module.exports = {
  presets: [
    ['@react-native/babel-preset'],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
