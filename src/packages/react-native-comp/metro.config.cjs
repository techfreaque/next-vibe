const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../..');

const config = getDefaultConfig(projectRoot);

// CRITICAL: Platform-specific extension resolution order
// React Native will look for .native.tsx BEFORE .tsx
config.resolver.sourceExts = [
  'native.tsx',
  'native.ts',
  'native.jsx',
  'native.js',
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
  'css',
  'cjs',
  'mjs',
];

// Platform-specific extensions for asset and style files
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'css',
];

// Configure path aliases to match tsconfig.json
config.resolver.extraNodeModules = {
  '@': path.resolve(workspaceRoot, 'src'),
  'next-vibe': path.resolve(workspaceRoot, 'src/packages/next-vibe'),
  'next-vibe-ui': path.resolve(workspaceRoot, 'src/packages/next-vibe-ui/native/ui/packages/reusables/src'),
};

// Watch all files in the workspace
config.watchFolders = [workspaceRoot];

// Configure node_modules resolution
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Ignore Next.js build directories
config.resolver.blockList = [
  /\.next\/.*/,
  /node_modules\/.*\/node_modules\/react-native\/.*/,
  /.*\/next\.config\..*$/,
  /.*\/middleware\.ts$/,
];

module.exports = config;
