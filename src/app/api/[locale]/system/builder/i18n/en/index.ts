export const translations = {
  category: "Builder",
  description: "Build and bundle tool for the project",
  cli: {
    build: {
      description: "Build type: build",
      configOption: "specify the config file path",
      defaultConfig: "build.config.ts",
    },
  },
  enums: {
    profile: {
      development: "Development",
      production: "Production",
    },
    buildType: {
      reactTailwind: "React + Tailwind",
      react: "React",
      vanilla: "Vanilla JS",
      executable: "Executable (Bun)",
    },
    bunTarget: {
      bun: "Bun Runtime",
      node: "Node.js",
      browser: "Browser",
    },
    sourcemap: {
      external: "External (.map file)",
      inline: "Inline (embedded)",
      none: "None (disabled)",
    },
    format: {
      esm: "ES Module",
      cjs: "CommonJS",
      iife: "IIFE (Browser)",
    },
    viteMinify: {
      esbuild: "esbuild (fast)",
      terser: "Terser (small)",
      false: "Disabled",
    },
    viteLibFormat: {
      es: "ES Module",
      cjs: "CommonJS",
      umd: "UMD",
      iife: "IIFE",
    },
    viteSourcemap: {
      true: "Enabled",
      false: "Disabled",
      inline: "Inline",
      hidden: "Hidden",
    },
  },
  errors: {
    inputFileNotFound: "Input file {{filePath}} does not exist",
    invalidOutputFileName: "Output file name is invalid",
    invalidBuildConfig:
      "Invalid build config format. Ensure the config exports a default BuildConfig object.",
    configNotFound: "Config file not found: {{path}}",
    inputRequired: "Input file is required for this build target",
    emptyConfig: "Empty configuration - no build steps defined",
  },
  warnings: {
    outputIsDirectory:
      "Output path should be a file, not a directory: {{path}}",
    sourceNotFound: "Source file not found: {{path}}",
  },
  suggestions: {
    checkFilePaths: "Check that all file paths are correct and files exist",
    runFromProjectRoot:
      "Make sure you're running from the project root directory",
    checkPermissions: "Check file permissions for input and output directories",
    checkDependencies: "Some dependencies may be missing - check imports",
    runInstall:
      "Try running 'bun install' to ensure all dependencies are available",
    increaseMemory:
      "For large builds, try increasing memory: NODE_OPTIONS=--max-old-space-size=4096",
    useExternals: "Consider marking large dependencies as external",
    checkSyntax: "Check for syntax errors in your source files",
    runTypecheck: "Run 'bun typecheck' to check for type errors",
    increaseTimeout: "Increase the timeout value for the build operation",
    checkNetworkConnection: "Check your network connection",
    checkDiskSpace: "Check available disk space",
    cleanBuildCache: "Try cleaning the build cache and temporary files",
  },
  messages: {
    buildStart: "Starting build...",
    cleaningDist: "Cleaning output directory...",
    cleaningFolders: "Cleaning folders...",
    buildingVersion: "Building version {{version}}...",
    bundlingCli: "Bundling CLI with Bun...",
    bundleFailed: "Bundle failed",
    bundleSuccess: "CLI bundled successfully",
    creatingPackageJson: "Creating package.json...",
    copyingFiles: "Copying README and LICENSE...",
    copyingAdditionalFiles: "Copying additional files...",
    publishInstructions: "To publish:",
    buildComplete: "Build complete!",
    buildFailed: "Build failed",
    loadingConfig: "Loading config from {{path}}...",
    cleaningFolder: "Cleaning folder: {{folder}}",
    compilingFiles: "Compiling files with Vite...",
    compilingFile: "Compiling: {{file}}",
    fileCompiled: "Compiled: {{file}}",
    buildingWithVite: "Building with Vite ({{type}})...",
    usingInlineConfig: "Using inline configuration...",
    filesCopied: "Files copied successfully",
    dryRunMode: "[DRY RUN] No changes will be made",
    buildSummary: "Build Summary:",
    totalDuration: "Total Duration",
    filesBuilt: "Files Built",
    filesCopiedCount: "Files Copied",
    stepsCompleted: "Steps Completed",
    usingProfile: "Using profile: {{profile}}",
    runningPreBuild: "Running pre-build hook...",
    runningPostBuild: "Running post-build hook...",
    preBuildComplete: "Pre-build hook completed",
    postBuildComplete: "Post-build hook completed",
    analyzingBundles: "Analyzing bundle sizes...",
    bundleAnalysis: "Bundle Analysis",
    optimizationTips: "Optimization Tips",
    suggestions: "Suggestions",
    validatingConfig: "Validating build configuration...",
    configValid: "Configuration is valid",
    configWarnings: "Configuration warnings",
    tsEntrypointWithNode:
      "TypeScript entrypoint with Node target - consider using Bun target for better compatibility",
    watchModeStarted: "Watch mode started - waiting for file changes...",
    watchModeRebuild: "File changed: {{file}} - rebuilding...",
    watchModeReady: "Build complete - watching for changes...",
    watchModeError: "Watch mode error: {{error}}",
    watchModeStopped: "Watch mode stopped",
    parallelCompiling: "Compiling {{count}} files in parallel...",
    parallelComplete:
      "Parallel compilation complete: {{count}} files in {{duration}}ms",
    cacheHit: "Cache hit: {{file}} (skipped)",
    cacheMiss: "Cache miss: {{file}} (rebuilding)",
    cacheCleared: "Build cache cleared",
    cacheStats:
      "Cache: {{hits}} hits, {{misses}} misses ({{hitRate}}% hit rate)",
    generatingReport: "Generating build report...",
    reportGenerated: "Build report generated: {{path}}",
    progress: "[{{current}}/{{total}}] {{step}}",
    spinnerBuilding: "Building...",
    spinnerCompiling: "Compiling...",
    spinnerBundling: "Bundling...",
  },
  post: {
    title: "Build Package",
    description:
      "Comprehensive build tool supporting CLI bundling, Vite builds, React/Tailwind, and npm distribution",
    form: {
      title: "Build Configuration",
      description: "Configure build settings or use a build.config.ts file",
    },
    fields: {
      // Config file path
      configPath: {
        title: "Config File Path",
        description: "Path to build configuration file (build.config.ts)",
        placeholder: "build.config.ts",
      },
      // Config object
      configObject: {
        title: "Build Options",
        description: "Inline build configuration (overrides config file)",
      },
      // Runtime options
      profile: {
        title: "Build Profile",
        description:
          "Development (fast, debug) or Production (optimized, minified)",
      },
      dryRun: {
        title: "Dry Run",
        description: "Preview what would be built without actually executing",
      },
      verbose: {
        title: "Verbose Output",
        description: "Show detailed build information and progress",
      },
      analyze: {
        title: "Bundle Analysis",
        description:
          "Analyze bundle sizes and identify optimization opportunities",
      },
      watch: {
        title: "Watch Mode",
        description: "Watch for file changes and rebuild automatically",
      },
      parallel: {
        title: "Parallel Build",
        description: "Compile multiple files in parallel for faster builds",
      },
      cache: {
        title: "Build Cache",
        description: "Cache build artifacts to skip unchanged files",
      },
      report: {
        title: "Generate Report",
        description: "Generate a JSON build report with detailed metrics",
      },
      minify: {
        title: "Minify",
        description: "Minify the output bundle (overrides profile setting)",
      },
      // Folders to clean
      foldersToClean: {
        title: "Folders to Clean",
        description: "Folders to delete before building (e.g., dist, build)",
        placeholder: "dist, build, .cache",
      },
      // Files to compile
      filesToCompile: {
        title: "Files to Compile",
        description: "List of files to compile with Vite or Bun",
      },
      fileToCompile: {
        title: "File Configuration",
      },
      input: {
        title: "Input File",
        description: "Entry point file path (e.g., src/index.ts)",
        placeholder: "src/index.ts",
      },
      output: {
        title: "Output File",
        description: "Output file path (e.g., dist/index.js)",
        placeholder: "dist/index.js",
      },
      type: {
        title: "Build Type",
        description: "Type of build: React, Vanilla JS, or Executable",
      },
      modulesToExternalize: {
        title: "External Modules",
        description: "Modules to exclude from bundle (e.g., react, lodash)",
        placeholder: "react, react-dom, lodash",
      },
      inlineCss: {
        title: "Inline CSS",
        description: "Inject CSS directly into JavaScript bundle",
      },
      bundleReact: {
        title: "Bundle React",
        description: "Include React in the bundle instead of as external",
      },
      // Package config
      packageConfig: {
        title: "Package Config",
        description: "Settings for library builds with TypeScript declarations",
      },
      isPackage: {
        title: "Is Package",
        description: "Enable library mode with package exports",
      },
      dtsInclude: {
        title: "DTS Include",
        description:
          "Glob patterns for TypeScript files to include in declarations",
        placeholder: "src/**/*.ts",
      },
      dtsEntryRoot: {
        title: "DTS Entry Root",
        description: "Root directory for declaration file generation",
        placeholder: "src",
      },
      // Bun options
      bunOptions: {
        title: "Bun Options",
        description: "Bun-specific build options for executable builds",
      },
      bunTarget: {
        title: "Target Runtime",
        description: "Target runtime: Bun, Node.js, or Browser",
      },
      bunMinify: {
        title: "Minify",
        description: "Enable minification for smaller output",
      },
      sourcemap: {
        title: "Source Maps",
        description: "Generate source maps for debugging",
      },
      external: {
        title: "External Modules",
        description: "Modules to exclude from the bundle",
        placeholder: "react, react-dom",
      },
      define: {
        title: "Define Constants",
        description:
          "Compile-time constants as JSON (e.g., process.env.NODE_ENV)",
        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
      },
      splitting: {
        title: "Code Splitting",
        description: "Enable code splitting for shared chunks",
      },
      format: {
        title: "Output Format",
        description: "Module format: ESM, CommonJS, or IIFE",
      },
      bytecode: {
        title: "Bytecode",
        description: "Compile to Bun bytecode for faster startup",
      },
      banner: {
        title: "Banner",
        description: "Text to prepend to output (e.g., shebang line)",
        placeholder: "#!/usr/bin/env node",
      },
      footer: {
        title: "Footer",
        description: "Text to append to output",
        placeholder: "// End of file",
      },
      publicPath: {
        title: "Public Path",
        label: "Public Path",
        description: "Public path prefix for assets",
      },
      naming: {
        title: "Naming",
        label: "Naming",
        description: "Output naming pattern",
      },
      root: {
        title: "Root",
        label: "Root",
        description: "Root directory",
      },
      conditions: {
        title: "Conditions",
        label: "Conditions",
        description: "Export conditions",
      },
      loader: {
        title: "Loader",
        label: "Loader",
        description: "File loaders mapping",
      },
      drop: {
        title: "Drop",
        label: "Drop",
        description: "Identifiers to drop",
      },
      // Vite options
      viteOptions: {
        title: "Vite Options",
        description: "Advanced Vite build configuration",
      },
      viteTarget: {
        title: "Build Target",
        description: "Browser/environment targets (e.g., es2020, chrome80)",
        placeholder: "es2020, chrome80, node18",
      },
      viteOutDir: {
        title: "Output Directory",
        description: "Directory for build output",
        placeholder: "dist",
      },
      viteAssetsDir: {
        title: "Assets Directory",
        description: "Subdirectory for static assets",
        placeholder: "assets",
      },
      viteAssetsInlineLimit: {
        title: "Inline Limit",
        description: "Max size (bytes) to inline assets as base64",
        placeholder: "4096",
      },
      viteChunkSizeWarningLimit: {
        title: "Chunk Size Warning",
        description: "Chunk size (KB) that triggers a warning",
        placeholder: "500",
      },
      viteCssCodeSplit: {
        title: "CSS Code Split",
        description: "Split CSS into separate files per chunk",
      },
      viteSourcemap: {
        title: "Source Maps",
        description: "Source map generation mode",
      },
      viteMinify: {
        title: "Minifier",
        description: "Minification tool: esbuild or terser",
      },
      viteEmptyOutDir: {
        title: "Empty Output Dir",
        description: "Clean output directory before build",
      },
      viteReportCompressedSize: {
        title: "Report Compressed",
        description: "Report gzipped bundle sizes",
      },
      viteManifest: {
        title: "Build Manifest",
        description: "Generate a manifest.json for asset fingerprinting",
      },
      // Vite lib options
      viteLib: {
        title: "Library Mode",
        description: "Configure Vite library build mode",
      },
      viteLibEntry: {
        title: "Entry Point",
        description: "Library entry point file(s)",
        placeholder: "src/index.ts",
      },
      viteLibName: {
        title: "Library Name",
        description: "Global variable name for UMD/IIFE builds",
        placeholder: "MyLibrary",
      },
      viteLibFormats: {
        title: "Output Formats",
        description: "Library output formats (ES, CJS, UMD, IIFE)",
      },
      viteLibFileName: {
        title: "File Name",
        description: "Output file name (without extension)",
        placeholder: "my-library",
      },
      // Rollup options
      viteRollupOptions: {
        title: "Rollup Options",
        description: "Advanced Rollup bundler configuration",
      },
      rollupExternal: {
        title: "External Modules",
        description: "Modules to exclude from bundle",
        placeholder: "react, react-dom",
      },
      rollupTreeshake: {
        title: "Tree Shaking",
        description: "Remove unused code from bundle",
      },
      rollupOutput: {
        title: "Rollup Output Options",
        label: "Rollup Output Options",
        description: "Passthrough rollup output options",
      },
      vitePlugins: {
        title: "Vite Plugins",
        label: "Vite Plugins",
        description: "Raw Vite plugins array (for programmatic use)",
      },
      viteBuild: {
        title: "Raw Build Options",
        label: "Raw Build Options",
        description: "Passthrough Vite build options",
      },
      // Files to copy
      filesOrFoldersToCopy: {
        title: "Files to Copy",
        description: "Files or folders to copy after compilation",
      },
      copyConfig: {
        title: "Copy Configuration",
      },
      copyInput: {
        title: "Source",
        description: "Source file or folder path",
        placeholder: "README.md",
      },
      copyOutput: {
        title: "Destination",
        description: "Destination file or folder path",
        placeholder: "dist/README.md",
      },
      copyPattern: {
        title: "Pattern",
        description: "Glob pattern for filtering files",
        placeholder: "**/*.json",
      },
      // NPM package
      npmPackage: {
        title: "NPM Package",
        description: "Generate package.json for npm distribution",
      },
      packageName: {
        title: "Package Name",
        description: "npm package name (e.g., @scope/package)",
        placeholder: "@myorg/package-name",
      },
      packageVersion: {
        title: "Version",
        description: "Package version (defaults to root package.json)",
        placeholder: "1.0.0",
      },
      packageDescription: {
        title: "Description",
        description: "Brief package description for npm",
        placeholder: "A brief description of your package",
      },
      packageMain: {
        title: "Main Entry",
        description: "CommonJS entry point (main field)",
        placeholder: "./dist/index.cjs",
      },
      packageModule: {
        title: "Module Entry",
        description: "ES module entry point (module field)",
        placeholder: "./dist/index.mjs",
      },
      packageTypes: {
        title: "Types Entry",
        description: "TypeScript declaration entry (types field)",
        placeholder: "./dist/index.d.ts",
      },
      packageBin: {
        title: "Binaries",
        description: "CLI executable mappings as JSON",
        placeholder: '{"my-cli": "./dist/bin/cli.js"}',
      },
      packageExports: {
        title: "Exports Map",
        description: "Package exports field as JSON",
        placeholder:
          '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
      },
      packageDependencies: {
        title: "Dependencies",
        description: "Runtime dependencies as JSON",
        placeholder: '{"lodash": "^4.17.21"}',
      },
      packagePeerDependencies: {
        title: "Peer Dependencies",
        description: "Peer dependencies as JSON",
        placeholder: '{"react": ">=18.0.0"}',
      },
      packageFiles: {
        title: "Included Files",
        description: "Files to include in published package",
        placeholder: "dist, README.md, LICENSE",
      },
      packageKeywords: {
        title: "Keywords",
        description: "npm search keywords",
        placeholder: "typescript, build, vite",
      },
      packageLicense: {
        title: "License",
        description: "Package license (e.g., MIT, Apache-2.0)",
        placeholder: "MIT",
      },
      packageRepository: {
        title: "Repository",
        description: "Git repository URL",
        placeholder: "https://github.com/user/repo",
      },
      // Response fields
      success: {
        title: "Success",
      },
      buildOutput: {
        title: "Build Output",
      },
      duration: {
        title: "Duration (ms)",
      },
      outputPath: {
        title: "Output Path",
      },
      filesBuilt: {
        title: "Files Built",
      },
      filesCopied: {
        title: "Files Copied",
      },
      packageJson: {
        title: "Generated package.json",
      },
      profileUsed: {
        title: "Profile Used",
      },
      cacheStats: {
        title: "Cache Statistics",
        description: "Build cache performance metrics",
      },
      reportPath: {
        title: "Report Path",
        description: "Path to the generated build report",
      },
      stepTimings: {
        title: "Step Timings",
        description: "Detailed timing breakdown for each build step",
        step: "Step",
        duration: "Duration (ms)",
        status: "Status",
        filesAffected: "Files",
      },
    },
    errors: {
      buildFailed: {
        title: "Build Failed",
        description: "The build process failed with an error",
      },
      validation: {
        title: "Validation Error",
        description: "The provided build configuration is invalid",
      },
      network: {
        title: "Network Error",
        description: "A network error occurred during the build process",
      },
      unauthorized: {
        title: "Unauthorized",
        description: "You are not authorized to run builds",
      },
      forbidden: {
        title: "Forbidden",
        description: "Access to the build system is forbidden",
      },
      server: {
        title: "Server Error",
        description: "An error occurred during the build process",
      },
      notFound: {
        title: "Not Found",
        description: "The specified file or config was not found",
      },
      unknown: {
        title: "Unknown Error",
        description: "An unexpected error occurred",
      },
      unsavedChanges: {
        title: "Unsaved Changes",
        description: "There are unsaved changes that may affect the build",
      },
      conflict: {
        title: "Build Conflict",
        description: "A conflicting build operation is already in progress",
      },
    },
    success: {
      title: "Build Successful",
      description: "Package built successfully",
    },
  },
  tags: {
    build: "build",
    npm: "npm",
    vite: "vite",
  },
  profiles: {
    development: "Development",
    production: "Production",
  },
  analysis: {
    criticalSize: "CRITICAL: Bundle size ({{size}}) exceeds threshold",
    largeBundle: "WARNING: Large bundle detected ({{size}})",
    considerTreeShaking: "Consider enabling tree-shaking to reduce bundle size",
    checkLargeDeps: "Check for large dependencies that could be replaced",
    largeSourcemaps:
      "Large sourcemaps detected - consider disabling in production",
    possibleDuplicates:
      "Possible duplicate dependencies detected - consider deduplication",
    totalSize: "Total Size",
    largestFiles: "Largest Files",
  },
};
