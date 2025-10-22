const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
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

// Remove CSS from asset extensions (it's in sourceExts for NativeWind)
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'css');

// Configure path aliases to match tsconfig.json
config.resolver.extraNodeModules = {
  '@': path.resolve(workspaceRoot, 'src'),
  'next-vibe': path.resolve(workspaceRoot, 'src/packages/next-vibe'),
  'next-vibe-ui': path.resolve(workspaceRoot, 'src/packages/next-vibe-ui/native'),
};

// Watch all files in the workspace
config.watchFolders = [workspaceRoot];

// Configure node_modules resolution
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  // path.resolve(workspaceRoot, 'node_modules'),
];

// CRITICAL FIX: Prevent duplicate React/React Native instances in monorepo
// Force react and react-native imports from next-vibe-ui to use app's node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect react and react-native imports from local packages to app's node_modules
  if (context.originModulePath?.includes('next-vibe-ui')) {
    if (
      moduleName === 'react' ||
      moduleName === 'react-native' ||
      moduleName.startsWith('react/') ||
      moduleName.startsWith('react-native/')
    ) {
      const redirectedPath = path.join(path.resolve(projectRoot, 'node_modules'), moduleName);
      return context.resolveRequest(context, redirectedPath, platform);
    }
  }

  // Default resolution
  return context.resolveRequest(context, moduleName, platform);
};

// Ignore Next.js build directories
config.resolver.blockList = [
  /\.next\/.*/,
  /node_modules\/.*\/node_modules\/react-native\/.*/,
  /.*\/next\.config\..*$/,
  /.*\/middleware\.ts$/,
];

module.exports = config
// module.exports = withNativeWind(config, { input: './global.css' });
