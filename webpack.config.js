const path = require('path');


module.exports = {
  entry: './main.js',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Example loader, adjust as per your needs
          options: {
            presets: ['@babel/preset-env'], // Example preset, adjust as per your needs
          },
        },
      },
      {
        test: /\.cs$/,
        use: 'raw-loader',
      },
      {
      test: /\.cs$/,
      use: 'raw-loader' // or appropriate loader for C# files
    },
      {
        test: /\.html$/, // Handle HTML files
        use: ['html-loader'], // Use html-loader to process HTML files
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
  alias: {
      // Example alias for npm if needed
      'npm': path.resolve(__dirname, 'node_modules')
    },
  extensions: ['.js', '.json', '.html'],
    fallback: {
      child_process: false, // Exclude child_process module
      dgram: false,
      "fs": require.resolve("browserify-fs"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "assert": require.resolve("assert/"),
      "os": require.resolve("os-browserify/browser"),
      timers: require.resolve('timers-browserify'),
       "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "assert": require.resolve("assert/"),
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "util": require.resolve("util/"),
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "fs": false,
      "tty": require.resolve("tty-browserify"),
      "zlib": require.resolve("browserify-zlib"),
      "process": require.resolve("process/browser"),
      "dns": require.resolve("dns.js"),
      "querystring": require.resolve("querystring-es3"),
      "punycode": require.resolve("punycode"),
      "url": require.resolve("url/"),
      "stream-http": require.resolve("stream-http"),
      "https-browserify": require.resolve("https-browserify"),
      "os-browserify": require.resolve("os-browserify/browser"),
      "vm": require.resolve("vm-browserify"), // Add this for 'vm' module
      "constants": require.resolve("constants-browserify") // Add this for 'constants' module
    }
  },
};
