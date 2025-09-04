const webpack = require("webpack");
const path = require("path");

module.exports = {
  webpack(config, options) {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = typeof originalEntry === 'function' ? await originalEntry() : originalEntry;
      const nmdFile = path.resolve(__dirname, 'utils/webpack-nmd.js');
      try {
        Object.keys(entries).forEach((key) => {
          const entry = entries[key];
          if (Array.isArray(entry) && !entry.includes(nmdFile)) {
            entry.unshift(nmdFile);
          }
        });
      } catch (e) {}
      return entries;
    };
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
