 /* eslint-disable */
module.exports = {
  babel: {
    stage: 0
  },
  build: {
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'jquery': '$'
    },
    global: 'app',
    umd: true
  }
};
