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

// Ignore Next.js build directories
config.resolver.blockList = [
  /\.next\/.*/,
  /node_modules\/.*\/node_modules\/react-native\/.*/,
  /.*\/next\.config\..*$/,
  /.*\/middleware\.ts$/,
];

// Apply NativeWind BEFORE custom resolveRequest so resolution happens after transformation
// NativeWind v5 uses @source directives in global.css (Tailwind v4 format)
const nativeWindConfig = withNativeWind(config, {
  input: './global.css',
  // Explicitly include the entire src directory for transformation
  // This ensures next-vibe-ui gets NativeWind treatment
  projectRoot: workspaceRoot,
  inlineRem: false,
});

// Override resolveRequest to fix duplicate React instances AND prevent recursion
const originalResolveRequest = nativeWindConfig.resolver.resolveRequest;

nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // ALWAYS redirect React imports to app's node_modules to prevent duplicates
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    const redirectedPath = path.join(path.resolve(projectRoot, 'node_modules'), moduleName);
    return context.resolveRequest(context, redirectedPath, platform);
  }

  const originPath = context.originModulePath || '';

  // CRITICAL: Prevent infinite recursion by NOT rewriting react-native imports
  // that originate from within react-native-css PACKAGE ITSELF (not from next-vibe-ui)
  // We need to allow rewriting for next-vibe-ui files even though they might be in node_modules
  const isFromReactNativeCssPackage = originPath.includes('/react-native-css/dist/') ||
                                       originPath.includes('/react-native-css/src/');

  if (isFromReactNativeCssPackage && (moduleName === 'react-native' || moduleName.startsWith('react-native/'))) {
    return context.resolveRequest(context, moduleName, platform);
  }

  // For all other imports (including from next-vibe-ui), use NativeWind's rewriter normally
  return originalResolveRequest(context, moduleName, platform);
};

module.exports = nativeWindConfig;
