const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    extension: './src/extension.ts', // your main entry point
    server: './src/server.ts' // your language server entry point
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    vscode: 'commonjs vscode' // Use vscode as external dependency
  }
};
