const path = require("path");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src", "index.ts"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.min.js",
    path: path.resolve(__dirname, "build"),
  },
};
