const path = require("path");

module.exports = {
  mode: "development",
  target: "electron-renderer",
  entry: "./client/app/index.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },

  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "client")],
    alias: { config: path.resolve(__dirname, "config", "default.json") }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.svg$/,
        loader: "url-loader"
      }
    ]
  },

  devtool: "source-map",

  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    stats: "minimal",
    hot: true,
    port: 5000
  }
};
