/**
 * Vite Compiler Service
 * Compiles files using Vite
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { OutputOptions, RollupOptions } from "rollup";
import type { BuildOptions, InlineConfig, Plugin, PluginOption } from "vite";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { BuildProfile, FileToCompile } from "../definition";
import type { scopedTranslation } from "../i18n";
import { PROFILE_DEFAULTS, ROOT_DIR } from "./constants";
import { outputFormatter } from "./output-formatter";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class ViteCompiler {
  async compileFile(
    fileConfig: FileToCompile,
    output: string[],
    filesBuilt: string[],
    logger: EndpointLogger,
    t: ModuleT,
    dryRun?: boolean,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<ResponseType<string[]>> {
    const inputFilePath = resolve(ROOT_DIR, fileConfig.input);
    const outputDir = resolve(ROOT_DIR, dirname(fileConfig.output));
    const compiledFiles: string[] = [];

    if (!existsSync(inputFilePath)) {
      return fail({
        message: t("errors.inputFileNotFound"),
        messageParams: {
          filePath: fileConfig.input,
        },
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
    }

    output.push(
      outputFormatter.formatItem(
        fileConfig.input,
        `→ ${dirname(fileConfig.output)}/ (${fileConfig.type})`,
      ),
    );
    logger.vibe(
      `  ⚙  ${fileConfig.input}  →  ${dirname(fileConfig.output)}/  [${fileConfig.type}]`,
    );

    if (dryRun) {
      // Simulate output files for dry run
      if (fileConfig.packageConfig?.isPackage) {
        const outputFileName =
          basename(fileConfig.output).split(".")[0] || "index";
        compiledFiles.push(
          `${dirname(fileConfig.output)}/${outputFileName}.mjs`,
          `${dirname(fileConfig.output)}/${outputFileName}.cjs`,
        );
      } else {
        compiledFiles.push(fileConfig.output);
      }
      filesBuilt.push(...compiledFiles);
      return success(compiledFiles);
    }

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Build Vite configuration
    const viteConfig = await this.buildViteConfig(
      fileConfig,
      inputFilePath,
      outputDir,
      verbose,
      profile,
    );

    // Run Vite build — dynamic import prevents Turbopack from tracing vite's
    // entire dependency graph (caniuse-lite, postcss, browserslist, etc.) into
    // every route that touches the builder.
    const { build: viteBuild } = await import("vite");
    await viteBuild(viteConfig);

    // Track built files
    if (fileConfig.packageConfig?.isPackage) {
      const outputFileName =
        basename(fileConfig.output).split(".")[0] || "index";
      compiledFiles.push(
        `${dirname(fileConfig.output)}/${outputFileName}.mjs`,
        `${dirname(fileConfig.output)}/${outputFileName}.cjs`,
      );
    } else {
      compiledFiles.push(fileConfig.output);
    }

    filesBuilt.push(...compiledFiles);

    if (verbose) {
      output.push(
        outputFormatter.formatVerbose(`Compiled: ${compiledFiles.join(", ")}`),
      );
    }

    logger.vibe(`  ✓  ${fileConfig.output}`);
    return success(compiledFiles);
  }

  async buildViteConfig(
    fileConfig: FileToCompile,
    inputFilePath: string,
    outputDir: string,
    verbose?: boolean,
    profile: BuildProfile = "development",
  ): Promise<InlineConfig> {
    const profileSettings = PROFILE_DEFAULTS[profile];
    const viteOpts = fileConfig.viteOptions || {};

    // Extract plugins (typed as unknown[] in schema for API compatibility)
    const pluginsOverride = viteOpts.plugins as PluginOption[] | undefined;

    // Extract build options with proper typing
    const buildOpts = (viteOpts.build || {}) as BuildOptions & {
      rollupOptions?: RollupOptions & { output?: OutputOptions };
    };
    const { rollupOptions: rollupOpts = {}, ...buildOptionsOverride } =
      buildOpts;
    const { output: outputOverride, ...rollupOptionsOverride } = rollupOpts;

    // Collect other vite options (excluding plugins and build which we handled separately)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Destructuring to exclude handled fields
    const { plugins: _, build: __, ...otherOptions } = viteOpts;

    const plugins: PluginOption[] = pluginsOverride || [];
    const buildOptions: BuildOptions = {
      target: "es2020",
      outDir: outputDir,
      minify: profileSettings.minify,
      emptyOutDir: false,
      cssCodeSplit: !fileConfig.inlineCss,
      cssMinify: profileSettings.minify,
      sourcemap: profileSettings.sourcemap !== false,
      ...buildOptionsOverride,
    };

    const rollupOptions: RollupOptions = {};
    const outputOptions: OutputOptions = {};

    // Configure plugins based on build type
    // Use string variables to prevent Turbopack static analysis of CLI-only packages
    if (fileConfig.type === "react-tailwind") {
      const tailwindPkg = "@tailwindcss/vite";
      const tailwindcss = (await import(/* webpackIgnore: true */ tailwindPkg))
        .default;
      plugins.push(tailwindcss() as PluginOption);

      if (fileConfig.inlineCss !== false) {
        const cssPkg = "vite-plugin-css-injected-by-js";
        const cssInjectedByJsPlugin = (
          await import(/* webpackIgnore: true */ cssPkg)
        ).default;
        plugins.push(cssInjectedByJsPlugin() as PluginOption);
      }
    }

    if (fileConfig.type.includes("react") || fileConfig.type === "spa") {
      outputOptions.globals = { react: "React", "react-dom": "ReactDOM" };
      const react = (await import("@vitejs/plugin-react")).default;
      plugins.push(react());
    }

    // SPA mode: full Vite app build (index.html entry, no lib/IIFE)
    // input is the directory containing index.html; output is the dist dir
    if (fileConfig.type === "spa") {
      const spaRoot = resolve(ROOT_DIR, fileConfig.input);
      // For SPA, output is the dist directory itself (not a file path)
      const spaOutDir = resolve(ROOT_DIR, fileConfig.output);
      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(/* webpackIgnore: true */ tsconfigPathsPkg)
      ).default;
      const tsconfigProject = fileConfig.viteOptions?.tsconfigPath
        ? resolve(ROOT_DIR, fileConfig.viteOptions.tsconfigPath as string)
        : undefined;
      plugins.push(
        tsconfigPaths({
          ...(tsconfigProject ? { projects: [tsconfigProject] } : {}),
          loose: true,
        }) as PluginOption,
      );

      // Explicit alias fallbacks for multi-path tsconfig aliases that
      // vite-tsconfig-paths resolves only to the first match.
      // next-vibe-ui/* → tanstack/ first (TanStack-specific overrides),
      // then falls back to web/ (shared UI components).
      const tanstackUiDir = resolve(
        ROOT_DIR,
        "src/packages/next-vibe-ui/tanstack",
      );
      const webUiDir = resolve(ROOT_DIR, "src/packages/next-vibe-ui/web");
      plugins.push({
        name: "next-vibe-ui-resolver",
        resolveId(id: string): string | null {
          const prefix = "next-vibe-ui/";
          if (!id.startsWith(prefix)) {
            return null;
          }
          const sub = id.slice(prefix.length);
          // Try tanstack override first, then fall back to web
          for (const base of [tanstackUiDir, webUiDir]) {
            for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx"]) {
              const candidate = resolve(base, sub + ext);
              if (existsSync(candidate)) {
                return candidate;
              }
            }
          }
          return null;
        },
      } as PluginOption);

      return {
        root: spaRoot,
        base: "/",
        resolve: {
          alias: [
            // Explicit @/ alias so Rollup can resolve it without relying solely on vite-tsconfig-paths
            {
              find: /^@\//,
              replacement: `${resolve(ROOT_DIR, "src")}/`,
            },
            // next-vibe/* → src/app/api/[locale]/*
            {
              find: /^next-vibe\//,
              replacement: `${resolve(ROOT_DIR, "src/app/api/[locale]")}/`,
            },
          ],
        },
        plugins: [...new Set(plugins)],
        logLevel: verbose ? "info" : "warn",
        ...otherOptions,
        build: {
          ...buildOptions,
          outDir: spaOutDir,
          emptyOutDir: true,
          rollupOptions: {
            ...rollupOptionsOverride,
            // Externalize Node.js built-ins and server-only packages that
            // cannot run in the browser. Pages importing these will fail at
            // runtime if actually used, but the build will succeed.
            external: (id: string): boolean =>
              id.startsWith("node:") ||
              id === "server-only" ||
              id === "client-only",
            output: { ...outputOverride },
          },
        },
      };
    }

    // TanStack Start SSR build: uses @tanstack/react-start plugin + nitro
    if (fileConfig.type === "tanstack-start") {
      return this.buildTanstackStartConfig(fileConfig, verbose);
    }

    // Package mode with TypeScript declarations
    const packageConfig = fileConfig.packageConfig;
    if (packageConfig?.isPackage) {
      const dtsPkg = "vite-plugin-dts";
      const dts = (await import(/* webpackIgnore: true */ dtsPkg)).default;
      plugins.push(
        dts({
          include: packageConfig.dtsInclude,
          entryRoot: packageConfig.dtsEntryRoot,
        }) as PluginOption,
      );

      const outputFileName =
        basename(fileConfig.output).split(".")[0] || "index";

      buildOptions.lib = {
        entry: inputFilePath,
        formats: ["es", "cjs"],
        fileName: (format): string =>
          `${outputFileName}.${format === "es" ? "mjs" : "cjs"}`,
      };
      outputOptions.exports = "auto";

      // Build externals list
      const modulesToExternalize = [
        ...new Set([
          ...(fileConfig.modulesToExternalize || []),
          ...(fileConfig.type.includes("react") && !fileConfig.bundleReact
            ? ["react", "react-dom", "react/jsx-runtime"]
            : []),
        ]),
      ];

      rollupOptions.external = (id): boolean =>
        modulesToExternalize.includes(id) || id.startsWith("node:");
    } else {
      // IIFE build for browser
      outputOptions.entryFileNames = basename(fileConfig.output);
      outputOptions.assetFileNames = "[name][extname]";
      outputOptions.exports = "none";
      outputOptions.format = "iife";
      rollupOptions.input = inputFilePath;
    }

    return {
      root: "./",
      base: "./",
      plugins: [...new Set(plugins)],
      logLevel: verbose ? "info" : "warn",
      ...otherOptions,
      build: {
        ...buildOptions,
        rollupOptions: {
          ...rollupOptions,
          ...rollupOptionsOverride,
          output: { ...outputOptions, ...outputOverride },
        },
      },
    };
  }

  /**
   * Start a Vite dev server for an SPA entry (type === "spa").
   * Returns a ViteDevServer instance; the caller is responsible for keeping
   * the process alive and calling server.close() on shutdown.
   */
  async startDevServer(
    fileConfig: FileToCompile,
    port: number | undefined,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const { createServer } = await import("vite");
      const react = (await import("@vitejs/plugin-react")).default;

      const spaRoot = resolve(ROOT_DIR, fileConfig.input);
      const plugins = [react()];

      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(/* webpackIgnore: true */ tsconfigPathsPkg)
      ).default;
      const tsconfigProject = fileConfig.viteOptions?.tsconfigPath
        ? resolve(ROOT_DIR, fileConfig.viteOptions.tsconfigPath as string)
        : undefined;
      plugins.push(
        tsconfigPaths(tsconfigProject ? { projects: [tsconfigProject] } : {}),
      );

      const server = await createServer({
        root: spaRoot,
        base: "/",
        plugins,
        server: { port },
        logLevel: "info",
      });

      await server.listen();
      const resolvedPort = server.config.server.port ?? port ?? 5173;
      const url = `http://localhost:${resolvedPort}`;
      logger.info(`TanStack/Vite dev server ready at ${url}`);

      // Keep server open — wire shutdown to process signals
      const stop = (): void => {
        void server.close();
      };
      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);

      return { success: true, url };
    } catch (error) {
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Start a Vite preview server for a built SPA (type === "spa").
   * Serves the production build from outDir.
   */
  async startPreviewServer(
    fileConfig: FileToCompile,
    port: number | undefined,
    logger: EndpointLogger,
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const { preview } = await import("vite");
      const react = (await import("@vitejs/plugin-react")).default;

      const spaRoot = resolve(ROOT_DIR, fileConfig.input);
      const outputDir = resolve(ROOT_DIR, fileConfig.output);
      const plugins = [react()];

      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(/* webpackIgnore: true */ tsconfigPathsPkg)
      ).default;
      const tsconfigProject = fileConfig.viteOptions?.tsconfigPath
        ? resolve(ROOT_DIR, fileConfig.viteOptions.tsconfigPath as string)
        : undefined;
      plugins.push(
        tsconfigPaths(tsconfigProject ? { projects: [tsconfigProject] } : {}),
      );

      const server = await preview({
        root: spaRoot,
        base: "/",
        plugins,
        preview: { port },
        build: { outDir: outputDir },
        logLevel: "info",
      });

      server.printUrls();
      const resolvedPort = server.config.preview.port ?? port ?? 4173;
      const url = `http://localhost:${resolvedPort}`;
      logger.info(`TanStack/Vite preview server ready at ${url}`);

      const stop = (): void => {
        void server.close();
      };
      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);

      return { success: true, url };
    } catch (error) {
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Build Vite InlineConfig for a TanStack Start SSR project.
   * Uses @tanstack/react-start/plugin/vite + nitro.
   */
  private async buildTanstackStartConfig(
    fileConfig: FileToCompile,
    verbose?: boolean,
  ): Promise<InlineConfig> {
    const tanstackStartPkg = "@tanstack/react-start/plugin/vite";
    const { tanstackStart } = (await import(
      /* webpackIgnore: true */ tanstackStartPkg
    )) as { tanstackStart: (opts: { srcDirectory: string }) => PluginOption };

    const nitroPkg = "nitro/vite";
    const { nitro } = (await import(/* webpackIgnore: true */ nitroPkg)) as {
      nitro: () => PluginOption;
    };

    const react = (await import("@vitejs/plugin-react")).default;

    const tsconfigPathsPkg = "vite-tsconfig-paths";
    const tsconfigPaths = (
      await import(/* webpackIgnore: true */ tsconfigPathsPkg)
    ).default;

    const srcDirectory = fileConfig.input;
    const tsconfigProject = resolve(ROOT_DIR, "tsconfig.tanstack.json");

    return {
      root: ROOT_DIR,
      plugins: [
        tsconfigPaths({ projects: [tsconfigProject] }) as PluginOption,
        tanstackStart({ srcDirectory }),
        react(),
        nitro(),
      ],
      logLevel: verbose ? "info" : "warn",
    };
  }

  /**
   * Start a Vite dev server for TanStack Start (SSR mode).
   * Uses @tanstack/react-start/plugin/vite + nitro plugins.
   */
  async startTanstackDevServer(
    fileConfig: FileToCompile,
    port: number | undefined,
    logger: EndpointLogger,
    /** Public-facing proxy port (e.g. 5000). When set, configures Vite HMR to use this port
     *  so the browser connects to the proxy instead of the internal Vite port directly. */
    publicPort?: number,
  ): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const { createServer } = await import("vite");
      const tanstackStartPkg = "@tanstack/react-start/plugin/vite";
      const { tanstackStart } = (await import(
        /* webpackIgnore: true */ tanstackStartPkg
      )) as {
        tanstackStart: (opts: {
          srcDirectory: string;
          importProtection?: {
            client?: { specifiers?: string[] };
          };
        }) => PluginOption;
      };

      const nitroPkg = "nitro/vite";
      const { nitro } = (await import(/* webpackIgnore: true */ nitroPkg)) as {
        nitro: () => PluginOption;
      };

      const react = (await import("@vitejs/plugin-react")).default;

      const tsconfigPathsPkg = "vite-tsconfig-paths";
      const tsconfigPaths = (
        await import(/* webpackIgnore: true */ tsconfigPathsPkg)
      ).default;

      const srcDirectory = fileConfig.input;
      const tsconfigProject = resolve(ROOT_DIR, "tsconfig.tanstack.json");

      const srcDir = resolve(ROOT_DIR, "src");
      const nextVibeDir = resolve(ROOT_DIR, "src/app/api/[locale]");
      const tanstackUiDir = resolve(
        ROOT_DIR,
        "src/packages/next-vibe-ui/tanstack",
      );
      const webUiDir = resolve(ROOT_DIR, "src/packages/next-vibe-ui/web");
      // Module aliases from build.config.ts viteOptions.moduleAliases
      // Keys are import specifiers, values are paths relative to ROOT_DIR.
      const moduleAliases = fileConfig.viteOptions?.moduleAliases ?? {};

      const server = await createServer({
        root: ROOT_DIR,
        plugins: [
          tsconfigPaths({ projects: [tsconfigProject] }) as PluginOption,
          tanstackStart({
            srcDirectory,
            // Mark `server-only` as denied on the client env.
            // The import-protection plugin replaces it with a Proxy mock that
            // console.errors on access — matching TanStack's own pattern for
            // mixed server/client files (e.g. start-basic-auth).
            importProtection: {
              client: { specifiers: ["server-only"] },
            },
          }),
          react(),
          nitro(),
          // TanStack Start's dev-server plugin provides "tanstack-start-injected-head-scripts:v"
          // only to the server environment (consumer === "server"). It calls transformIndexHtml
          // to extract the React Fast Refresh preamble and injects it before the client entry.
          // The client environment also imports this virtual module, so we shim it there with
          // undefined — the preamble is already embedded in the SSR HTML by the server plugin.
          {
            name: "tanstack-start-client-virtual-shims",
            enforce: "pre",
            applyToEnvironment(env: { name: string }) {
              // Only shim on the client — let the server environment use the real plugin
              return env.name === "client";
            },
            resolveId(id: string) {
              if (
                id === "tanstack-start-injected-head-scripts:v" ||
                id === "tanstack-start-manifest:v"
              ) {
                return `\0${id}`;
              }
              return null;
            },
            load(id: string) {
              if (id === "\0tanstack-start-injected-head-scripts:v") {
                return `export const injectedHeadScripts = undefined;`;
              }
              if (id === "\0tanstack-start-manifest:v") {
                return `export const tsrStartManifest = () => ({ routes: {}, clientEntry: "" });`;
              }
              return null;
            },
          } as Plugin,
          // Vite's HTTP server can't serve files with `[...]` in the URL path
          // because the client-side dynamic import URL contains literal brackets
          // (e.g. /src/app/[locale]/page.tsx) and connect returns 404.
          // Fix: intercept HTTP requests with brackets in the URL and serve them
          // directly via vite.transformRequest so Vite's pipeline handles them.
          {
            name: "bracket-path-rewrite",
            enforce: "pre",
            configureServer(srv) {
              type ConnectHandle = (
                req: { url?: string },
                res: {
                  headersSent: boolean;
                  end: (s: string) => void;
                  setHeader: (k: string, v: string) => void;
                  statusCode: number;
                },
                next: () => void,
              ) => void;

              const handle: ConnectHandle = (req, res, next) => {
                const url = req.url ?? "";
                if (!url.includes("[")) {
                  next();
                  return;
                }
                // Serve the file via Vite's transform pipeline
                void (async (): Promise<void> => {
                  try {
                    const result = await srv.transformRequest(url);
                    if (!result) {
                      next();
                      return;
                    }
                    res.setHeader(
                      "Content-Type",
                      "application/javascript; charset=utf-8",
                    );
                    res.setHeader("Cache-Control", "no-store");
                    res.statusCode = 200;
                    res.end(result.code);
                  } catch {
                    next();
                  }
                })();
              };

              // Use unshift to ensure this runs BEFORE sirv / other middlewares
              srv.middlewares.stack.unshift({
                route: "",
                handle,
              } as never);
            },
          } as Plugin,
          // Polyfill CommonJS `require()` for SSR — the i18n lazy-loader pattern
          // uses `() => require("./de").translations` which breaks in Vite ESM SSR.
          // apply:"serve" prevents this from running during esbuild dep pre-bundling.
          {
            name: "cjs-require-polyfill",
            apply: "serve",
            transform(code, id, opts) {
              if (!opts?.ssr) {
                return undefined;
              }
              if (!id.includes("/src/")) {
                return undefined;
              }
              if (!code.includes("require(")) {
                return undefined;
              }
              const shim = `import { createRequire as __createRequire } from "node:module";\nconst require = __createRequire(${JSON.stringify(id)});\n`;
              return { code: shim + code, map: null };
            },
          } as Plugin,
          // Resolve next-vibe-ui/* multi-path alias: tanstack/ first, then web/ fallback.
          // Also resolves next/* imports to tanstack equivalents for SSR.
          // vite-tsconfig-paths only resolves the first match for multi-path aliases,
          // so this plugin handles fallback for the SSR module runner.
          {
            name: "next-vibe-ui-ssr-resolver",
            enforce: "pre",
            resolveId(id: string): string | null {
              const exts = [
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                "/index.ts",
                "/index.tsx",
                "/index.js",
              ];
              const tryResolve = (
                bases: string[],
                sub: string,
              ): string | null => {
                for (const base of bases) {
                  for (const ext of exts) {
                    const candidate = resolve(base, sub + ext);
                    if (existsSync(candidate) && statSync(candidate).isFile()) {
                      return candidate;
                    }
                  }
                }
                return null;
              };

              if (id.startsWith("next-vibe-ui/")) {
                const sub = id.slice("next-vibe-ui/".length);
                return tryResolve([tanstackUiDir, webUiDir], sub);
              }

              // Force-resolve moduleAliases via plugin so SSR module runner
              // always gets our shims — resolve.alias alone can be bypassed by
              // pre-bundled deps or the CJS require polyfill.
              if (id in moduleAliases) {
                const rel = moduleAliases[id];
                if (rel) {
                  return resolve(ROOT_DIR, rel);
                }
              }

              return null;
            },
          } satisfies PluginOption,
          // Treat native .node addons as external — esbuild can't process them
          {
            name: "native-node-externals",
            enforce: "pre",
            resolveId(id: string) {
              if (id.endsWith(".node")) {
                return { id, external: true };
              }
              return null;
            },
          } as Plugin,
        ],
        resolve: {
          alias: [
            { find: /^@\//, replacement: `${srcDir}/` },
            { find: /^next-vibe\//, replacement: `${nextVibeDir}/` },
            // moduleAliases from build.config.ts viteOptions.moduleAliases.
            // Resolved via resolve.alias so they apply to both client and SSR module runner.
            ...Object.entries(moduleAliases).map(
              ([specifier, relativePath]) => ({
                find: specifier,
                replacement: resolve(ROOT_DIR, relativePath),
              }),
            ),
          ],
        },
        // Inject runtime env constants so client bundles get the correct values.
        // process.env has already been patched by patchPublicUrlPort() before createServer().
        define: {
          "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(
            process.env["NEXT_PUBLIC_APP_URL"] ??
              `http://localhost:${String(port ?? 3001)}`,
          ),
        },
        server: {
          port: port ?? 3001,
          host: "127.0.0.1",
          watch: {
            // Ignore .tmp dir — contains bracket paths ([locale]) that crash inotify on Linux
            ignored: ["**/.tmp/**"],
          },
          // When running behind a proxy (e.g. Bun WS proxy on publicPort), tell Vite's
          // injected HMR client to connect to the proxy port instead of the internal port.
          // The Bun proxy already forwards non-/ws WebSocket upgrades to nextPort, so HMR
          // traffic flows: browser → proxy:5000 → Vite HMR:5100.
          // We use server.hmr as an object so we can set clientPort (what the browser uses)
          // while leaving Vite's own HMR listener on the internal port.
          hmr:
            publicPort !== null && publicPort !== undefined
              ? { clientPort: publicPort }
              : true,
        },
        // Use a TanStack-specific cache dir so it doesn't conflict with
        // the Next.js Vite cache in node_modules/.vite/deps/
        cacheDir: resolve(ROOT_DIR, "node_modules/.vite-tanstack"),
        logLevel: "info",
        // Disable dep pre-bundling for all environments (client + ssr).
        // Our app has thousands of deps; esbuild pre-bundling causes multi-minute
        // startup freezes. noDiscovery=true + include=[] is the Vite 5+ API.
        // Exception: CJS-only packages that need pre-bundling for named ESM exports.
        optimizeDeps: {
          noDiscovery: true,
          // use-sync-external-store/shim: CJS package needs pre-bundling for named ESM exports.
          include: ["use-sync-external-store/shim"],
        },
        environments: {
          client: {
            optimizeDeps: {
              noDiscovery: true,
              include: ["use-sync-external-store/shim"],
            },
          },
          ssr: {
            optimizeDeps: { noDiscovery: true, include: [] },
          },
        },
      });

      await server.listen();
      const resolvedPort = server.config.server.port ?? port ?? 3001;
      const url = `http://localhost:${resolvedPort}`;
      const publicUrl = publicPort ? `http://localhost:${publicPort}` : url;
      logger.info(`TanStack Start dev server ready at ${publicUrl}`);

      const stop = (): void => {
        void server.close();
      };
      process.once("SIGINT", stop);
      process.once("SIGTERM", stop);

      return { success: true, url };
    } catch (error) {
      return { success: false, message: parseError(error).message };
    }
  }

  /**
   * Get compiled file size
   */
  getFileSize(filePath: string): number {
    const fullPath = resolve(ROOT_DIR, filePath);
    if (existsSync(fullPath)) {
      return statSync(fullPath).size;
    }
    return 0;
  }
}

// Singleton instance
export const viteCompiler = new ViteCompiler();
