module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  plugins: [
    'react',
  ],
  globals: {
    Alteryx: false,
    $: false,
  },
  rules: {
    'spaced-comment': [0],
    'new-cap': [
      'error',
      {
        capIsNewExceptions: [
          'GetDataItem',
          'GetDataItemByDataName',
          'BindUserDataChanged',
          'Pos',
        ],
      },
    ],
  },
};
