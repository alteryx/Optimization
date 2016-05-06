const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSS = require('purifycss-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const pkg = require('./package.json');
const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  style: path.join(__dirname, 'src', 'styles', 'css/main.css'),
};

const common = {
  entry: {
    src: PATHS.src,
    style: PATHS.style,
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css'],
  },
  module: {
    loaders: [
      {
        test: /\.(jpg|png)$/,
        loader: 'file?name=[path][name].[hash].[ext]',
        // include: PATHS.images,
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?(\?\d+)?/,
        loader: 'url',
      },
    ],
  },
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Optimization',
    }),
  ],
};

if (TARGET === 'build' || TARGET === 'build-umd' || TARGET === 'profile') {
  const prodConfig = {
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          query: {
            cacheDirectory: true,
            presets: ['react', 'es2015', 'stage-1'],
            plugins: [
              'transform-decorators-legacy',
              'transform-object-assign',
              'array-includes',
              'transform-react-constant-elements',
              'transform-react-inline-elements',
            ],
          },
          include: PATHS.src,
        },
        // Extract CSS during the build process
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.style,
        },
      ],
    },
    plugins: [
      // Clear the contents of the build directory before re-building
      new CleanWebpackPlugin(PATHS.dist),
      // Output extracted CSS to its own file
      new ExtractTextPlugin('[name].css'),
      new PurifyCSS({
        basePath: PATHS.src,
        purifyOptions: {
          minify: true,
        },
      }),
      // Use the `production` flag so we get full optimization from React when building
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
      // Minify the resulting bundle
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new Visualizer(),
    ],
  };

  if (TARGET === 'build-umd') {
    module.exports = merge(common, prodConfig, {
      output: {
        path: PATHS.dist,
        libraryTarget: 'umd',
        library: 'Optimization',
        umdNamedDefine: 'optimization',
      },
      externals: {
        react: {
          commonjs: 'react',
          amd: 'React',
          root: 'React',
        },
        'react-dom': {
          commonjs: 'react-dom',
          amd: 'ReactDOM',
          root: 'ReactDOM',
        },
        jquery: {
          commonjs: 'jquery',
          amd: 'jquery',
          root: '$',
        },
      },
    });
  }

  if (TARGET === 'build') {
    module.exports = merge(common, prodConfig, {
      // devtool: 'source-map',
      entry: {
        // flag all `package.json` dependencies as vendor files
        vendor: Object.keys(pkg.dependencies),
      },
      output: {
        path: PATHS.dist,
        filename: '[name].js',
        // Create a hash for each file in the build so we can detect which files have changed
        // filename: '[name].[chunkhash].js',
        // chunkFilename: '[chunkhash].js',
      },
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          names: ['vendor', 'manifest'],
        }),
      ],
    });
  }
}
