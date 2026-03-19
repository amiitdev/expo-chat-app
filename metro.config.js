// const { withNativeWind } = require('nativewind/metro');
// const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// const config = getSentryExpoConfig(__dirname);

// module.exports = withNativeWind(config, { input: './global.css' });

const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const config = getSentryExpoConfig(__dirname);

// Add support for TTF files
config.resolver.assetExts.push('ttf');

// If you're having issues with node_modules resolution, add this:
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
};

// Ensure the resolver can find the font files
config.resolver.assetExts = [...new Set([...config.resolver.assetExts, 'ttf'])];

module.exports = withNativeWind(config, { input: './global.css' });
