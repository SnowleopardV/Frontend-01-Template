module.exports = {
  entry: './index.js',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          "plugins": [
            ["@babel/plugin-transform-react-jsx", {
              "pragma": "create"
            }]
          ]
        }
      }
    }]
  },
  mode: "development",
  optimization: {
    minimize: false
  }
}