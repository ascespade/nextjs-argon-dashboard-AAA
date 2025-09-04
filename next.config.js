const webpack = require("webpack");
const path = require("path");

module.exports = {
  webpack(config, options) {
    // Handle images imported via require/import
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|ico|webp|bmp)$/i,
      type: "asset/resource",
      generator: { filename: "static/media/[name].[hash][ext]" },
    });

    // Handle fonts
    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2)$/i,
      type: "asset/resource",
      generator: { filename: "static/fonts/[name].[hash][ext]" },
    });

    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push(path.resolve("./"));

    return config;
  },
  // Disable Next's static image handling so webpack asset modules handle imports
  images: { disableStaticImages: true },
};
