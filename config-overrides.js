const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    url: require.resolve("url"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify")
  });
  config.resolve.fallback = fallback;
  return config;
};