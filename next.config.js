const path = require("path");

/** @type {import('next').NextConfig} */
const baseWebpack = (config, options) => {
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

    // Optimize bundle splitting
    if (!options.isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          charts: {
            test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
            name: 'charts',
            chunks: 'all',
            priority: 15,
          },
        },
      };
    }

    return config;
};

const nextConfig = {
  webpack(config, options) {
    return baseWebpack(config, options);
  },
  // Disable Next's static image handling so webpack asset modules handle imports
  images: { 
    disableStaticImages: true,
    formats: ['image/webp', 'image/avif'],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@fortawesome/fontawesome-free', 
      'chart.js', 
      'reactstrap',
      'bootstrap',
      'moment',
      'axios'
    ],
  },
  // Enable compression
  compress: true,
  // Enable static optimization
  trailingSlash: false,
  // Enable source maps in development
  productionBrowserSourceMaps: false,
  // Optimize bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      const cfg = baseWebpack(config, { isServer });
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        cfg.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: './bundle-analysis.html',
          })
        );
      }
      return cfg;
    },
  }),
};

module.exports = nextConfig;
