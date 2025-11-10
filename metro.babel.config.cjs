// This babel config is ONLY for React Native/Expo
// Next.js uses SWC/Turbopack and should ignore this file
//
// To prevent Next.js from detecting this file, we check if we're running
// in an Expo/Metro context. If not, we return null to indicate no config.

module.exports = function (api) {
  // Check if we're being called by Metro (React Native bundler)
  const isMetro = api.caller((caller) => caller?.name === "metro");

  // If not Metro, return null to indicate this config should not be used
  if (!isMetro) {
    return null;
  }

  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // Must be last
    ],
  };
};
