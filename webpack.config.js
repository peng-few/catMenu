const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');
const  webpack  = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: ['./src/index.jsx'],
  output: {
    filename: 'menu.bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react','@babel/preset-env'],
          },
        },
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devServer: {
    publicPath: '/dist/',
    compress: true,
    port: 9000,
  },
  // mode: 'production',
  // optimization: {
  //   minimize: true,
  //   minimizer: [new UglifyJsPlugin()],
  // },
  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //         'NODE_ENV': JSON.stringify('production')
  //     }
  //   }),
   
  // ],

  
};
