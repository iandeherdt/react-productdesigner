var webpack = require('webpack');
var path = require('path');
var EXAMPLES_DIR = path.resolve(__dirname, 'examples');
module.exports = {

  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './examples/app.js'
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel'
    },{
        test: /\.s?css$/,
        exclude: /node_modules/,
        loaders: [
            'style',
            'css',
            'autoprefixer?browsers=last 2 version'
        ]
    },
    { test: /\.(png|jpg)$/, loader: 'url?limit=250000'},
    { test: "\.jpg$", loader: "file-loader" },
    { test: "\.png$", loader: "url-loader?mimetype=image/png" },
    {
      test: /\.json$/,
      loaders: [ 'json' ],
      exclude: /node_modules/,
      include: __dirname
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: 'examples',
    publicPath: '',
    filename:'bundle.js'
  },
  devServer: {
    contentBase: './examples',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jquery"
    }),
  ]
};