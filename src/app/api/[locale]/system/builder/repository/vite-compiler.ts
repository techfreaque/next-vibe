/**
 * Vite Compiler Service
 * Compiles files using Vite
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import type { Server as NodeHttpServer } from "node:http";
import { networkInterfaces } from "node:os";
import { basename, dirname, resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import type { OutputBundle, OutputOptions, RolldownOptions } from "rolldown";
import {
  isRunnableDevEnvironment,
  type BuildOptions,
  type InlineConfig,
  type Plugin,
  type PluginOption,
} from "vite";

import {
  maybeColorize,
  semantic,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/colors";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createNextjsFormatter } from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";

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

    // Run Vite build - dynamic import prevents Turbopack from tracing vite's
    // entire dependency graph (caniuse-lite, postcss, browserslist, etc.) into
    // every route that touches the builder.
    if (fileConfig.type === "tanstack-start") {
      // TanStack Start uses the multi-environment builder API so that Nitro's
      // `buildApp` hook runs - this triggers the server (Nitro) build in
      // addition to the client build.  The simple `build()` only builds the
      // first environment and never fires `buildApp`.
      const { createBuilder } = await import("vite");
      const builder = await createBuilder(viteConfig);
      await builder.buildApp();
    } else {
      const { build: viteBuild } = await import("vite");
      await viteBuild(viteConfig);
    }

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
      rollupOptions?: RolldownOptions;
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

    const rollupOptions: RolldownOptions = {};
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

      rollupOptions.external = (id: string): boolean =>
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
          output: {
            ...outputOptions,
            ...(Array.isArray(outputOverride) ? {} : outputOverride),
          } satisfies OutputOptions,
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

      // Keep server open - wire shutdown to process signals
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
      nitro: (opts?: {
        output?: { dir?: string; publicDir?: string; serverDir?: string };
        rollupConfig?: { external?: (id: string) => boolean };
      }) => PluginOption;
    };

    const tailwindVite = (await import("@tailwindcss/vite")).default;
    const react = (await import("@vitejs/plugin-react")).default;

    const srcDirectory = fileConfig.input;

    const srcDir = resolve(ROOT_DIR, "src");
    const nextVibeDir = resolve(ROOT_DIR, "src/app/api/[locale]");
    const tanstackUiDir = resolve(
      ROOT_DIR,
      "src/packages/next-vibe-ui/tanstack",
    );
    const webUiDir = resolve(ROOT_DIR, "src/packages/next-vibe-ui/web");
    const moduleAliases = fileConfig.viteOptions?.moduleAliases ?? {};

    const exts = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      "/index.ts",
      "/index.tsx",
      "/index.js",
    ];
    const tryResolve = (bases: string[], sub: string): string | null => {
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

    return {
      root: ROOT_DIR,
      plugins: [
        tailwindVite(),
        tanstackStart({
          srcDirectory,
          importProtection: {
            client: { specifiers: ["server-only"] },
          },
        }),
        react(),
        nitro({
          output: {
            dir: resolve(ROOT_DIR, fileConfig.output),
            publicDir: resolve(ROOT_DIR, fileConfig.output, "public"),
            serverDir: resolve(ROOT_DIR, fileConfig.output, "server"),
          },
          // Externalize build-time-only packages so Nitro's server bundle
          // doesn't try to bundle native binaries (lightningcss, oxide, etc.)
          rollupConfig: {
            external: (id: string) =>
              id.startsWith("@tailwindcss/") ||
              id.startsWith("lightningcss") ||
              id === "vite" ||
              id === "@vitejs/plugin-react" ||
              id === "vite-plugin-css-injected-by-js" ||
              id === "vite-plugin-dts",
          },
        }),
        {
          name: "next-vibe-ui-ssr-resolver",
          enforce: "pre",
          resolveId(id: string): string | null {
            if (id.startsWith("next-vibe-ui/")) {
              const sub = id.slice("next-vibe-ui/".length);
              return tryResolve([tanstackUiDir, webUiDir], sub);
            }
            if (id in moduleAliases) {
              const rel = moduleAliases[id];
              if (rel) {
                return resolve(ROOT_DIR, rel);
              }
            }
            return null;
          },
        } satisfies PluginOption,
        // Strip server-only exports from layout/page files for the client bundle.
        // Same as the dev server plugin - required for production builds too.
        {
          name: "tanstack-layout-client-strip",
          enforce: "pre",
          async transform(
            code: string,
            id: string,
            opts,
          ): Promise<{ code: string; map: null } | undefined> {
            if (opts?.ssr || this.environment?.name === "ssr") {
              return undefined;
            }
            if (
              !id.includes("/src/app/") ||
              (!id.endsWith("/layout.tsx") && !id.endsWith("/page.tsx"))
            ) {
              return undefined;
            }
            if (!code.includes("tanstackLoader")) {
              return undefined;
            }
            let result = code;
            result = result.replace(
              /\nexport default async function\s+\w+[\s\S]*?(?=\nexport |\n\/\/|$)/,
              "\n",
            );
            result = result.replace(
              /\nexport async function tanstackLoader[\s\S]*?(?=\nexport |\n\/\/|$)/,
              "\n",
            );
            // Remove imports whose bindings are no longer referenced.
            const lines = result.split("\n");
            const nonImportCode = lines
              .filter((l) => !l.trimStart().startsWith("import "))
              .join("\n");
            // Strip string literals and comments to avoid false positives
            // (e.g. `kind: "redirect"` or `// redirects to overview` keeping the import).
            const nonImportCodeNoStrings = nonImportCode
              .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '""')
              .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, "''")
              .replace(/`[^`\\]*(?:\\.[^`\\]*)*`/g, "``")
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .replace(/\/\/[^\n]*/g, "");
            const filteredLines = lines.filter((line) => {
              const trimmed = line.trimStart();
              if (
                !trimmed.startsWith("import ") ||
                trimmed.startsWith("import type ")
              ) {
                return true;
              }
              const namedMatch = /import\s*\{([^}]+)\}/.exec(trimmed);
              const defaultMatch = /import\s+(\w+)\s+from/.exec(trimmed);
              const bindings: string[] = [];
              if (namedMatch?.[1]) {
                for (const part of namedMatch[1].split(",")) {
                  const alias = part
                    .trim()
                    .split(/\s+as\s+/)
                    .pop()
                    ?.trim();
                  if (alias) {
                    bindings.push(alias);
                  }
                }
              } else if (defaultMatch?.[1]) {
                bindings.push(defaultMatch[1]);
              }
              if (bindings.length === 0) {
                return true;
              }
              return bindings.some((b) => {
                const re = new RegExp(`\\b${b}\\b`);
                return re.test(nonImportCodeNoStrings);
              });
            });
            return { code: filteredLines.join("\n"), map: null };
          },
        } as Plugin,
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
        // In the client environment, mark node:* built-ins as external so
        // server-only modules that import them don't cause Rollup to fail.
        // Also covers bare built-in names (util, net, fs, etc.) used by pg/nodemailer.
        {
          name: "client-node-externals",
          enforce: "pre",
          applyToEnvironment(env: { name: string }) {
            return env.name === "client";
          },
          resolveId(id: string) {
            const NODE_BUILTINS = new Set([
              "assert",
              "buffer",
              "child_process",
              "cluster",
              "crypto",
              "dgram",
              "dns",
              "domain",
              "events",
              "fs",
              "http",
              "https",
              "module",
              "net",
              "os",
              "path",
              "perf_hooks",
              "process",
              "punycode",
              "querystring",
              "readline",
              "repl",
              "stream",
              "string_decoder",
              "timers",
              "tls",
              "tty",
              "url",
              "util",
              "v8",
              "vm",
              "zlib",
            ]);
            // Build-time-only packages pulled in via vite-compiler dynamic
            // imports - they are never used in the browser.
            const BUILD_TOOLS = new Set([
              "vite",
              "@vitejs/plugin-react",
              "@tailwindcss/vite",
              "vite-plugin-css-injected-by-js",
              "vite-plugin-dts",
              "nitro/vite",
              "rolldown",
              "esbuild",
              "lightningcss",
            ]);
            if (
              id.startsWith("node:") ||
              id === "node-gyp-build" ||
              NODE_BUILTINS.has(id) ||
              BUILD_TOOLS.has(id)
            ) {
              return { id, external: true };
            }
            return null;
          },
        } as Plugin,
        // Externalize build-tool packages in every environment (client, SSR,
        // Nitro) so vite-compiler.ts dynamic imports don't cause UNRESOLVED_IMPORT.
        {
          name: "build-tools-externals",
          enforce: "pre",
          resolveId(id: string) {
            const BUILD_TOOLS = new Set([
              "vite-plugin-css-injected-by-js",
              "vite-plugin-dts",
              "@tailwindcss/postcss",
              "nitro/vite",
            ]);
            if (BUILD_TOOLS.has(id)) {
              return { id, external: true };
            }
            return null;
          },
        } as Plugin,
        // Log bundle size summary after client build so large chunks are visible.
        {
          name: "bundle-size-reporter",
          enforce: "post",
          applyToEnvironment(env: { name: string }) {
            return env.name === "client";
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required positional param
          generateBundle(_opts: OutputOptions, bundle: OutputBundle) {
            const chunks: Array<{ name: string; size: number }> = [];
            for (const [name, chunk] of Object.entries(bundle)) {
              const size =
                chunk.type === "chunk"
                  ? (chunk.code?.length ?? 0)
                  : typeof chunk.source === "string"
                    ? chunk.source.length
                    : (chunk.source?.byteLength ?? 0);
              chunks.push({ name, size });
            }
            chunks.sort((a, b) => b.size - a.size);
            const top = chunks.slice(0, 15);
            const totalSize = chunks.reduce((s, c) => s + c.size, 0);
            // eslint-disable-next-line no-console -- intentional build log
            console.log(
              `\n  Bundle top ${String(top.length)} chunks (total ${ViteCompiler.fmtKb(totalSize)}):`,
            );
            for (const { name, size } of top) {
              const indicator =
                size > 500 * 1024 ? "⚠" : size > 200 * 1024 ? "⚡" : " ";
              // eslint-disable-next-line no-console -- intentional build log
              console.log(
                `    ${indicator} ${ViteCompiler.fmtKb(size).padStart(9)}  ${name}`,
              );
            }
          },
        } as Plugin,
      ],
      resolve: {
        tsconfigPaths: true,
        alias: [
          { find: /^@\//, replacement: `${srcDir}/` },
          { find: /^next-vibe\//, replacement: `${nextVibeDir}/` },
          ...Object.entries(moduleAliases).map(([specifier, relativePath]) => ({
            find: specifier,
            replacement: resolve(ROOT_DIR, relativePath),
          })),
        ],
      },
      // Inline env vars at build time so the compiled bundle has the correct
      // values without any runtime patching.  NEXT_PUBLIC_APP_URL defaults to
      // http://localhost:3000 if not set - set it in your build environment to
      // produce a build that targets a different origin.
      define: {
        "process.env.NEXT_PUBLIC_APP_URL": JSON.stringify(
          process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000",
        ),
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
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
    /** Public-facing proxy port (e.g. 5000). When set, configures Vite HMR to use this port
     *  so the browser connects to the proxy instead of the internal Vite port directly. */
    publicPort?: number,
  ): Promise<{
    success: boolean;
    url?: string;
    message?: string;
    close?: () => Promise<void>;
  }> {
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

      const tailwindVite = (await import("@tailwindcss/vite")).default;
      const react = (await import("@vitejs/plugin-react")).default;

      const srcDirectory = fileConfig.input;

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

      // Custom Vite logger: pipe all Vite/Nitro output through the same
      // timestamp+color formatter used for Next.js output.
      const fmtVite = createNextjsFormatter(
        port ?? 3001,
        publicPort ?? port ?? 3001,
      );
      const viteLogger = {
        hasWarned: false,
        info(msg: string): void {
          process.stdout.write(`${fmtVite(msg)}\n`);
        },
        warn(msg: string): void {
          // Suppress sourcemap warnings for packages that ship without source files
          if (msg.includes("points to missing source files")) {
            return;
          }
          this.hasWarned = true;
          process.stdout.write(`${fmtVite(msg)}\n`);
        },
        warnOnce(msg: string): void {
          if (msg.includes("points to missing source files")) {
            return;
          }
          this.hasWarned = true;
          process.stdout.write(`${fmtVite(msg)}\n`);
        },
        error(msg: string): void {
          process.stderr.write(`${fmtVite(msg)}\n`);
        },
        clearScreen(): void {
          /* no-op */
        },
        hasErrorLogged(): boolean {
          return false;
        },
      };

      const server = await createServer({
        root: ROOT_DIR,
        customLogger: viteLogger,
        plugins: [
          tailwindVite(),
          tanstackStart({
            srcDirectory,
            // Mark `server-only` as denied on the client env.
            // The import-protection plugin replaces it with a Proxy mock that
            // console.errors on access - matching TanStack's own pattern for
            // mixed server/client files (e.g. start-basic-auth).
            importProtection: {
              client: { specifiers: ["server-only"] },
            },
          }),
          react(),
          nitro(),
          // Shim for TanStack Start virtual modules that aren't provided in dev mode.
          // "tanstack-start-injected-head-scripts:v" is imported by the server env at runtime
          // (router-manifest.js). TanStack's own dev plugin provides it only when its
          // configureServer hook runs - but that requires the full TanStack dev server setup.
          // We provide a no-op shim so the import resolves without error.
          // The actual preamble is now injected directly in the <Head> component.
          {
            name: "tanstack-start-virtual-shims",
            enforce: "pre",
            resolveId(id: string) {
              if (id === "tanstack-start-injected-head-scripts:v") {
                return `\0${id}`;
              }
              return null;
            },
            load(id: string) {
              if (id === "\0tanstack-start-injected-head-scripts:v") {
                return `export const injectedHeadScripts = undefined;`;
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
          // Strip server-only exports (tanstackLoader, default) and their exclusive
          // imports from layout.tsx / page.tsx files when serving to the client.
          // This allows lazy(() => import("layout.tsx").then(m => m.TanstackPage))
          // to work in the browser without pulling in pg, drizzle, etc.
          // The plugin is the client-side mirror of TanStack's createServerFn stripping.
          {
            name: "tanstack-layout-client-strip",
            enforce: "pre",
            async transform(
              code: string,
              id: string,
              opts,
            ): Promise<{ code: string; map: null } | undefined> {
              // Only run for client (not SSR). Check both opts.ssr (Vite classic)
              // and this.environment.name (Vite 6 environments API).
              if (opts?.ssr || this.environment?.name === "ssr") {
                return undefined;
              }
              // Only target layout.tsx and page.tsx in src/app/[locale]
              if (
                !id.includes("/src/app/") ||
                (!id.endsWith("/layout.tsx") && !id.endsWith("/page.tsx"))
              ) {
                return undefined;
              }
              // Only process files that export tanstackLoader
              if (!code.includes("tanstackLoader")) {
                return undefined;
              }
              // Strip server-only exports and their exclusive imports.
              // Remove: export async function tanstackLoader(...) { ... }
              // Remove: export default async function ...(...) { ... }
              // Remove: imports whose bindings are no longer referenced after stripping
              // Keep: TanstackPage, interfaces, type exports, client imports
              let result = code;
              // Remove export default async function (Next.js server component)
              result = result.replace(
                /\nexport default async function\s+\w+[\s\S]*?(?=\nexport |\n\/\/|$)/,
                "\n",
              );
              // Remove export async function tanstackLoader
              result = result.replace(
                /\nexport async function tanstackLoader[\s\S]*?(?=\nexport |\n\/\/|$)/,
                "\n",
              );
              // Remove import lines whose bindings are no longer referenced.
              // Parse each `import { ... } from "..."` line, check if any of the
              // imported names appear in the remaining non-import code, and drop
              // the whole import line if none do.
              const lines = result.split("\n");
              const nonImportCode = lines
                .filter((l) => !l.trimStart().startsWith("import "))
                .join("\n");
              // Strip string literals and comments to avoid false positives
              // (e.g. `kind: "redirect"` or `// redirects to overview` keeping the import).
              const nonImportCodeNoStrings = nonImportCode
                .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '""')
                .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, "''")
                .replace(/`[^`\\]*(?:\\.[^`\\]*)*`/g, "``")
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .replace(/\/\/[^\n]*/g, "");
              const filteredLines = lines.filter((line) => {
                const trimmed = line.trimStart();
                // Only process value imports (not `import type`)
                if (
                  !trimmed.startsWith("import ") ||
                  trimmed.startsWith("import type ")
                ) {
                  return true;
                }
                // Extract named bindings: import { Foo, Bar as Baz } from "..."
                const namedMatch = /import\s*\{([^}]+)\}/.exec(trimmed);
                // Default import: import Foo from "..."
                const defaultMatch = /import\s+(\w+)\s+from/.exec(trimmed);
                const bindings: string[] = [];
                if (namedMatch?.[1]) {
                  for (const part of namedMatch[1].split(",")) {
                    const alias = part
                      .trim()
                      .split(/\s+as\s+/)
                      .pop()
                      ?.trim();
                    if (alias) {
                      bindings.push(alias);
                    }
                  }
                } else if (defaultMatch?.[1]) {
                  bindings.push(defaultMatch[1]);
                }
                // Keep the import if any binding is still used in non-import code
                if (bindings.length === 0) {
                  return true;
                }
                return bindings.some((b) => {
                  // Use word-boundary check, excluding string literals
                  const re = new RegExp(`\\b${b}\\b`);
                  return re.test(nonImportCodeNoStrings);
                });
              });
              return { code: filteredLines.join("\n"), map: null };
            },
          } as Plugin,
          // React Refresh adds `_c = TanstackPage` assignments without `var _c`
          // declarations for our stripped layout/page files. In lazy-loaded ESM
          // modules (strict mode) this throws ReferenceError. Fix: patch bare
          // `_c = ` assignments into `var _c = ` after React Refresh runs.
          {
            name: "tanstack-layout-refresh-fix",
            enforce: "post",
            transform(
              code: string,
              id: string,
              opts,
            ): { code: string; map: null } | undefined {
              if (opts?.ssr || this.environment?.name === "ssr") {
                return undefined;
              }
              if (
                !id.includes("/src/app/") ||
                (!id.endsWith("/layout.tsx") && !id.endsWith("/page.tsx"))
              ) {
                return undefined;
              }
              // Only patch files that went through our strip plugin (have _c = but no var _c)
              if (!code.includes("_c = ") || code.includes("var _c")) {
                return undefined;
              }
              // Replace bare `_c = Foo` with `var _c = Foo`
              const patched = code.replace(/\n(_c\d*) = /g, "\nvar $1 = ");
              return { code: patched, map: null };
            },
          } as Plugin,
          // Polyfill CommonJS `require()` for the i18n lazy-loader pattern:
          // `() => require("./de").translations` - SSR gets node:module createRequire,
          // client gets require() calls rewritten to static import references.
          // apply:"serve" prevents this from running during esbuild dep pre-bundling.
          {
            name: "cjs-require-polyfill",
            apply: "serve",
            transform(code, id, opts) {
              if (!id.includes("/src/")) {
                return undefined;
              }
              if (!code.includes("require(")) {
                return undefined;
              }
              if (opts?.ssr) {
                const shim = `import { createRequire as __createRequire } from "node:module";\nconst require = __createRequire(${JSON.stringify(id)});\n`;
                return { code: shim + code, map: null };
              }
              // Client: rewrite `require("./X")` → `__cjsImport_X` and add static imports.
              const imports: string[] = [];
              let counter = 0;
              const rewritten = code.replace(
                /\brequire\((['"`])(\.\/[^'"` )]+)\1\)/g,
                (...[, , specifier]) => {
                  const varName = `__cjsImport_${counter++}`;
                  imports.push(
                    `import * as ${varName} from ${JSON.stringify(specifier)};`,
                  );
                  return varName;
                },
              );
              if (imports.length === 0) {
                return undefined;
              }
              return { code: `${imports.join("\n")}\n${rewritten}`, map: null };
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
              // always gets our shims - resolve.alias alone can be bypassed by
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
          // Treat native .node addons as external - esbuild can't process them
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
          // After HMR invalidates any src/ module, clear the SSR module runner
          // evaluated module cache. Without this, the runner keeps stale module
          // instances with partially-initialized circular imports, causing:
          //   "Cannot access '__vite_ssr_import_N__' before initialization"
          // Clearing forces fresh re-evaluation on the next SSR request.
          // We clear both on HMR (for file changes) and on every incoming SSR
          // request (for page reloads after HMR) so stale state never survives.
          {
            name: "ssr-clear-on-hmr",
            configureServer(srv) {
              // Intercept /@tanstack-start/styles.css before TanStack's handler.
              // CSS is declared via head() ?url link - this bundle is redundant.
              // unshift so we run before all other middleware.
              srv.middlewares.stack.unshift({
                route: "",
                handle: (
                  req: { url?: string },
                  res: {
                    setHeader: (k: string, v: string) => void;
                    statusCode: number;
                    end: () => void;
                  },
                  next: () => void,
                ) => {
                  if (
                    (req.url ?? "").startsWith("/@tanstack-start/styles.css")
                  ) {
                    res.setHeader("content-type", "text/css");
                    res.setHeader("cache-control", "no-store");
                    res.statusCode = 200;
                    res.end();
                    return;
                  }
                  next();
                },
              } as never);
            },
            handleHotUpdate({ modules, server: viteServer }) {
              const srcModules = modules.filter((m) => m.id?.includes("/src/"));
              if (srcModules.length === 0) {
                return;
              }
              // Invalidate only the changed src/ modules in the SSR runner cache,
              // rather than clearing the entire cache. Clearing the whole cache can
              // race with in-flight module evaluations (e.g. fetchModule for env.ts),
              // causing the module runner to throw "mistakenly invalidated during
              // fetch phase" and leaving the transport in a hung state.
              const ssrEnv = viteServer.environments?.["ssr"];
              if (ssrEnv && isRunnableDevEnvironment(ssrEnv)) {
                for (const mod of srcModules) {
                  if (!mod.id) {
                    continue;
                  }
                  const ssrMod = ssrEnv.runner.evaluatedModules.getModuleById(
                    mod.id,
                  );
                  if (ssrMod) {
                    ssrEnv.runner.evaluatedModules.invalidateModule(ssrMod);
                  }
                }
              }
              // Also invalidate the client environment module graph for the changed
              // modules so Vite re-transforms them and serves updated JS to the browser.
              const clientEnv = viteServer.environments?.["client"];
              if (clientEnv) {
                for (const mod of srcModules) {
                  if (!mod.id) {
                    continue;
                  }
                  const clientMod = clientEnv.moduleGraph.getModuleById(mod.id);
                  if (clientMod) {
                    clientEnv.moduleGraph.invalidateModule(clientMod);
                  }
                }
              }
            },
          } as Plugin,
        ],
        resolve: {
          tsconfigPaths: true,
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
              `http://localhost:${String(publicPort ?? port ?? 3001)}`,
          ),
        },
        server: {
          port: port ?? 3001,
          strictPort: true,
          host: "127.0.0.1",
          watch: {
            // Ignore .tmp dir - contains bracket paths ([locale]) that crash inotify on Linux.
            // Ignore routeTree.gen.ts - regenerated by TanStack Start plugin, not user source.
            // Ignore app-tanstack/routes - auto-generated, touching them shouldn't trigger CSS HMR.
            // Ignore generated/ dirs - written by task runner generators, contain no Tailwind classes.
            // Without this, every generator run triggers a globals.css HMR cycle via Tailwind's
            // @source scanner re-evaluating all watched files.
            ignored: [
              "**/.tmp/**",
              "**/.next/**",
              "**/.next-prod/**",
              "**/.next-rebuild/**",
              "**/node_modules/**",
              "**/routeTree.gen.ts",
              "**/app-tanstack/routes/**",
              "**/system/generated/**",
              "**/messenger/registry/generated.ts",
              "**/app-native/**",
              "**/test-files/**",
            ],
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
        // Disable auto-discovery: scanning src/app/** pulls in server-only deps
        // (ssh2, react-native, lightningcss, .node binaries) into the client
        // optimizeDeps scan and causes esbuild errors. Instead, list only the
        // CJS packages that are actually needed client-side.
        //
        // CRITICAL: holdUntilCrawlEnd: false prevents SSR from hanging.
        // When holdUntilCrawlEnd is true (Vite default), SSR transformRequest
        // waits on the client depOptimizationProcessing promise which only
        // resolves after the client crawl + esbuild run completes. On cold
        // start this blocks the first SSR request for several seconds.
        // Setting holdUntilCrawlEnd: false allows deps to be served on-demand
        // while pre-bundling runs in the background — no SSR blocking.
        optimizeDeps: {
          noDiscovery: true,
          holdUntilCrawlEnd: false,
          include: [
            // Mirrored from .vite/deps/_metadata.json (Next.js pre-bundle list),
            // minus server-only packages (pg, ssh2, argon2, drizzle, etc.)
            "react",
            "react-dom",
            "react/jsx-dev-runtime",
            "react/jsx-runtime",
            "react-dom/client",
            "@ai-sdk/openai/internal",
            "@anthropic-ai/claude-agent-sdk",
            "@dnd-kit/core",
            "@dnd-kit/sortable",
            "@hookform/resolvers/zod",
            "@icons-pack/react-simple-icons",
            "@openrouter/ai-sdk-provider",
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-context-menu",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-label",
            "@radix-ui/react-menubar",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group",
            "@radix-ui/react-tooltip",
            "@react-email/components",
            "@react-email/render",
            "@tanstack/react-query",
            "@tanstack/react-table",
            "@xyflow/react",
            "ai",
            "class-variance-authority",
            "clsx",
            "cmdk",
            "date-fns",
            "date-fns/locale",
            "embla-carousel-react",
            "framer-motion",
            "input-otp",
            "lightweight-charts",
            "lucide-react",
            "nanoid",
            "next-themes",
            "react-day-picker",
            "react-hook-form",
            "react-intersection-observer",
            "react-joyride",
            "react-markdown",
            "react-syntax-highlighter",
            "react-syntax-highlighter/dist/cjs/styles/prism",
            "remark-breaks",
            "remark-gfm",
            "sonner",
            "tailwind-merge",
            "turndown",
            "uuid",
            "vaul",
            "victory",
            "zod",
            "zod/v4",
            "zustand",
            "zustand/middleware",
            "cron-parser",
            // Additional CJS packages not in Next.js list
            "style-to-js",
            "debug",
            "extend",
            "use-sync-external-store",
            "use-sync-external-store/shim",
            "lowlight",
            "highlight.js",
            "@babel/runtime/regenerator",
          ],
        },
      });

      await server.listen();
      // Disable Node.js HTTP server timeouts - SSR renders can take >5s on
      // first load (cold module evaluation) and the default keepAliveTimeout
      // (5s) / headersTimeout (60s) would close the socket mid-render.
      if (server.httpServer) {
        const httpServer = server.httpServer as NodeHttpServer;
        httpServer.keepAliveTimeout = 0;
        httpServer.headersTimeout = 0;
        httpServer.timeout = 0;
        // Node 14+: disable request timeout so slow SSR renders don't abort
        (
          httpServer as NodeHttpServer & { requestTimeout?: number }
        ).requestTimeout = 0;
      }
      const resolvedPort = server.config.server.port ?? port ?? 3001;
      const url = `http://localhost:${resolvedPort}`;
      const publicUrl = publicPort ? `http://localhost:${publicPort}` : url;

      // Pretty startup banner matching Next.js style
      const networkUrl = ((): string | undefined => {
        try {
          for (const ifaces of Object.values(networkInterfaces())) {
            for (const iface of ifaces ?? []) {
              if (iface.family === "IPv4" && !iface.internal) {
                return `http://${iface.address}:${publicPort ?? resolvedPort}`;
              }
            }
          }
        } catch {
          /* ignore */
        }
        return undefined;
      })();
      const uptime = process.uptime().toFixed(3);
      const lines = [
        `⚡ TanStack Start (Vite + Nitro)`,
        `   - Local:    ${publicUrl}`,
        networkUrl ? `   - Network:  ${networkUrl}` : undefined,
        `   ✓ Ready`,
      ].filter(Boolean) as string[];
      const indent = " ".repeat(`[${uptime}s] `.length);
      const formatted = lines
        .map((line, i) =>
          i === 0
            ? `[${uptime}s] ${maybeColorize(line, semantic.nextjs)}`
            : `${indent}${maybeColorize(line, semantic.nextjs)}`,
        )
        .join("\n");
      process.stdout.write(`${formatted}\n`);

      return {
        success: true,
        url,
        close: (): Promise<void> => server.close(),
      };
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

  /** Format bytes as kilobytes string, e.g. "123.4 kB". */
  private static fmtKb(bytes: number): string {
    return `${(bytes / 1024).toFixed(1)} kB`;
  }
}

// Singleton instance
export const viteCompiler = new ViteCompiler();
