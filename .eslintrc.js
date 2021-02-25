module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'react-native/no-inline-styles': 1,
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
      },
    ],
  },
};
