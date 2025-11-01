const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('node:path');

// Now running from workspace root (so NativeWind can scan all of src/)
const projectRoot = __dirname;
const workspaceRoot = projectRoot;

// Point Metro to use custom babel config (renamed to avoid Next.js detection)
process.env.BABEL_CONFIG_PATH = path.resolve(projectRoot, 'metro.babel.config.cjs');

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

// CRITICAL: Only include src folder and node_modules - exclude everything else
config.resolver.blockList = [
  // Exclude EVERYTHING at root level except src and node_modules
  new RegExp(`^${workspaceRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/(?!src|node_modules).*`),
  // Exclude nested node_modules
  /node_modules\/.*\/node_modules\/.*/,
  // Exclude build outputs inside src
  /src\/.*\/\.next\/.*/,
  /src\/.*\/\.expo\/.*/,
  /src\/.*\/dist\/.*/,
];

// Only watch src and node_modules
config.watchFolders = [
  path.resolve(workspaceRoot, 'src'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Disable Watchman to avoid file system overload - use node crawler instead
config.watcher = {
  ...config.watcher,
  watchman: false,
  additionalExts: ['cjs', 'mjs'],
};

// Limit the number of workers to reduce memory usage
config.maxWorkers = 2;

// Configure path aliases to match tsconfig.json
// CRITICAL: next-vibe-ui/* should resolve to next-vibe-ui/native/*
config.resolver.extraNodeModules = {
  '@': path.resolve(workspaceRoot, 'src'),
  'next-vibe': path.resolve(workspaceRoot, 'src/app/api/[locale]/v1/core'),
  // This makes next-vibe-ui/ui resolve to next-vibe-ui/native/ui
  'next-vibe-ui': path.resolve(workspaceRoot, 'src/packages/next-vibe-ui/native'),
};

// Watch all files in the workspace
config.watchFolders = [workspaceRoot];

// Configure node_modules resolution - now at workspace root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Ignore Next.js build directories
config.resolver.blockList = [
  /\.next\/.*/,
  /node_modules\/.*\/node_modules\/react-native\/.*/,
  /.*\/next\.config\..*$/,
  /.*\/middleware\.ts$/,
];

// Configure transformer to use custom transformer for server-only handling
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('./metro.transformer.cjs'),
};

// Apply NativeWind BEFORE custom resolveRequest so resolution happens after transformation
const nativeWindConfig = withNativeWind(config, {
  input: './src/app/api/[locale]/v1/core/system/unified-interface/react-native/global.css',
  // Running from workspace root now, so projectRoot is already correct
  inlineRem: false,
});

// Override resolveRequest to fix duplicate React instances AND prevent recursion
const originalResolveRequest = nativeWindConfig.resolver.resolveRequest;

nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect next-vibe-ui imports to native version
  if (moduleName.startsWith('next-vibe-ui/')) {
    const subpath = moduleName.replace('next-vibe-ui/', '');
    const nativePath = path.join(workspaceRoot, 'src/packages/next-vibe-ui/native', subpath);
    return context.resolveRequest(context, nativePath, platform);
  }

  // ALWAYS redirect React imports to workspace root node_modules to prevent duplicates
  if (moduleName === 'react' || moduleName.startsWith('react/')) {
    const redirectedPath = path.join(path.resolve(workspaceRoot, 'node_modules'), moduleName);
    return context.resolveRequest(context, redirectedPath, platform);
  }

  const originPath = context.originModulePath || '';

  // Prevent infinite recursion by NOT rewriting react-native imports
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
