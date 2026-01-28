/**
 * Builder Endpoint Definition
 * Single source of truth for all builder types and configuration
 *
 * This definition supports:
 * - Vite builds: react-tailwind, react, vanilla
 * - Bun builds: executable
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";
import {
  objectField,
  objectOptionalField,
  requestDataArrayOptionalField,
  requestField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  BuildProfileEnum,
  BunBuildTypeEnum,
  BunTargetEnum,
  OutputFormatEnum,
  SourcemapModeEnum,
  StepStatusEnum,
  ViteBuildTypeEnum,
  ViteLibFormatEnum,
} from "./enum";

// ============================================================================
// Enum Options for UI - Created with createEnumOptions
// ============================================================================

export const { options: BuildProfileOptions } = createEnumOptions({
  DEVELOPMENT: "app.api.system.builder.enums.profile.development",
  PRODUCTION: "app.api.system.builder.enums.profile.production",
} as const);

export const { options: BuildTypeOptions } = createEnumOptions({
  REACT_TAILWIND: "app.api.system.builder.enums.buildType.reactTailwind",
  REACT: "app.api.system.builder.enums.buildType.react",
  VANILLA: "app.api.system.builder.enums.buildType.vanilla",
  EXECUTABLE: "app.api.system.builder.enums.buildType.executable",
} as const);

export const { options: BunTargetOptions } = createEnumOptions({
  BUN: "app.api.system.builder.enums.bunTarget.bun",
  NODE: "app.api.system.builder.enums.bunTarget.node",
  BROWSER: "app.api.system.builder.enums.bunTarget.browser",
} as const);

export const { options: SourcemapModeOptions } = createEnumOptions({
  EXTERNAL: "app.api.system.builder.enums.sourcemap.external",
  INLINE: "app.api.system.builder.enums.sourcemap.inline",
  NONE: "app.api.system.builder.enums.sourcemap.none",
} as const);

export const { options: OutputFormatOptions } = createEnumOptions({
  ESM: "app.api.system.builder.enums.format.esm",
  CJS: "app.api.system.builder.enums.format.cjs",
  IIFE: "app.api.system.builder.enums.format.iife",
} as const);

export const { options: ViteMinifyOptions } = createEnumOptions({
  ESBUILD: "app.api.system.builder.enums.viteMinify.esbuild",
  TERSER: "app.api.system.builder.enums.viteMinify.terser",
  FALSE: "app.api.system.builder.enums.viteMinify.false",
} as const);

export const { options: ViteLibFormatOptions } = createEnumOptions({
  ES: "app.api.system.builder.enums.viteLibFormat.es",
  CJS: "app.api.system.builder.enums.viteLibFormat.cjs",
  UMD: "app.api.system.builder.enums.viteLibFormat.umd",
  IIFE: "app.api.system.builder.enums.viteLibFormat.iife",
} as const);

// ============================================================================
// Complex Type Schemas
// ============================================================================

/**
 * Package.json exports field schema
 * Supports: string path, conditional exports, or nested export maps
 * @example { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } }
 */
export type PackageExportCondition =
  | string
  | { [key: string]: string | PackageExportCondition };
const PackageExportConditionSchema: z.ZodType<PackageExportCondition> = z.lazy(
  () =>
    z.union([
      z.string(),
      z.record(z.string(), z.union([z.string(), PackageExportConditionSchema])),
    ]),
);

// ============================================================================
// Endpoint Definition
// ============================================================================

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "builder"],
  title: "app.api.system.builder.post.title",
  description: "app.api.system.builder.post.description",
  category: "app.api.system.builder.category",
  tags: [
    "app.api.system.builder.tags.build",
    "app.api.system.builder.tags.npm",
    "app.api.system.builder.tags.vite",
  ],
  icon: "package",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["builder", "package", "bundle", "build"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.builder.post.form.title",
      description: "app.api.system.builder.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // ========================================================================
      // CONFIG FILE PATH
      // ========================================================================
      configPath: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.builder.post.fields.configPath.title",
        description:
          "app.api.system.builder.post.fields.configPath.description",
        placeholder:
          "app.api.system.builder.post.fields.configPath.placeholder",
        icon: "file-code",
        colSpan: 12,
        schema: z.string().optional().default("build.config.ts"),
      }),

      // ========================================================================
      // CONFIG OBJECT - Full inline build configuration
      // ========================================================================
      configObject: objectOptionalField(
        {
          type: WidgetType.ACCORDION,
          title: "app.api.system.builder.post.fields.configObject.title",
          description:
            "app.api.system.builder.post.fields.configObject.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          optional: true,
          icon: "settings",
          defaultExpanded: true,
        },
        { request: "data" },
        {
          // ==================================================================
          // RUNTIME OPTIONS SECTION
          // ==================================================================
          profile: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.system.builder.post.fields.profile.title",
            description:
              "app.api.system.builder.post.fields.profile.description",
            options: BuildProfileOptions,
            optional: true,
            icon: "layers",
            colSpan: 4,
            schema: z.enum(BuildProfileEnum).optional(),
          }),

          dryRun: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.dryRun.title",
            description:
              "app.api.system.builder.post.fields.dryRun.description",
            optional: true,
            icon: "eye",
            colSpan: 4,
            schema: z.boolean().optional(),
          }),

          verbose: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.verbose.title",
            description:
              "app.api.system.builder.post.fields.verbose.description",
            optional: true,
            icon: "terminal",
            colSpan: 4,
            schema: z.boolean().optional(),
          }),

          analyze: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.analyze.title",
            description:
              "app.api.system.builder.post.fields.analyze.description",
            optional: true,
            icon: "bar-chart-2",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          watch: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.watch.title",
            description: "app.api.system.builder.post.fields.watch.description",
            optional: true,
            icon: "refresh-cw",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          parallel: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.parallel.title",
            description:
              "app.api.system.builder.post.fields.parallel.description",
            optional: true,
            icon: "git-branch",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          report: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.report.title",
            description:
              "app.api.system.builder.post.fields.report.description",
            optional: true,
            icon: "file-text",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          minify: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.builder.post.fields.minify.title",
            description:
              "app.api.system.builder.post.fields.minify.description",
            optional: true,
            icon: "minimize-2",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          // ==================================================================
          // FOLDERS TO CLEAN
          // ==================================================================
          foldersToClean: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TAGS,
            label: "app.api.system.builder.post.fields.foldersToClean.title",
            description:
              "app.api.system.builder.post.fields.foldersToClean.description",
            placeholder:
              "app.api.system.builder.post.fields.foldersToClean.placeholder",
            optional: true,
            icon: "trash-2",
            colSpan: 12,
            schema: z.array(z.string()).optional(),
          }),

          // ==================================================================
          // FILES TO COMPILE
          // ==================================================================
          filesToCompile: requestDataArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.builder.post.fields.filesToCompile.title",
              description:
                "app.api.system.builder.post.fields.filesToCompile.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "code" as const,
            },
            objectField(
              {
                type: WidgetType.DATA_CARDS,
                title: "app.api.system.builder.post.fields.fileToCompile.title",
                layoutType: LayoutType.GRID,
                columns: 12,
                icon: "file",
              },
              { request: "data" },
              {
                input: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.input.title",
                  description:
                    "app.api.system.builder.post.fields.input.description",
                  placeholder:
                    "app.api.system.builder.post.fields.input.placeholder",
                  icon: "file-input",
                  colSpan: 6,
                  schema: z.string(),
                }),

                output: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.output.title",
                  description:
                    "app.api.system.builder.post.fields.output.description",
                  placeholder:
                    "app.api.system.builder.post.fields.output.placeholder",
                  icon: "file-output",
                  colSpan: 6,
                  schema: z.string(),
                }),

                type: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label: "app.api.system.builder.post.fields.type.title",
                  description:
                    "app.api.system.builder.post.fields.type.description",
                  options: BuildTypeOptions,
                  icon: "box",
                  colSpan: 6,
                  schema: z.union([
                    z.enum(ViteBuildTypeEnum),
                    z.enum(BunBuildTypeEnum),
                  ]),
                }),

                modulesToExternalize: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TAGS,
                  label:
                    "app.api.system.builder.post.fields.modulesToExternalize.title",
                  description:
                    "app.api.system.builder.post.fields.modulesToExternalize.description",
                  placeholder:
                    "app.api.system.builder.post.fields.modulesToExternalize.placeholder",
                  optional: true,
                  icon: "package",
                  colSpan: 6,
                  schema: z.array(z.string()).optional(),
                }),

                // Vite-specific options
                inlineCss: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.builder.post.fields.inlineCss.title",
                  description:
                    "app.api.system.builder.post.fields.inlineCss.description",
                  optional: true,
                  icon: "paintbrush",
                  colSpan: 4,
                  schema: z.boolean().optional(),
                }),

                bundleReact: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.builder.post.fields.bundleReact.title",
                  description:
                    "app.api.system.builder.post.fields.bundleReact.description",
                  optional: true,
                  icon: "atom",
                  colSpan: 4,
                  schema: z.boolean().optional(),
                }),

                // Package config for library builds
                packageConfig: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.system.builder.post.fields.packageConfig.title",
                    description:
                      "app.api.system.builder.post.fields.packageConfig.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                    icon: "package",
                  },
                  { request: "data" },
                  {
                    isPackage: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.isPackage.title",
                      description:
                        "app.api.system.builder.post.fields.isPackage.description",
                      colSpan: 4,
                      schema: z.literal(true),
                    }),

                    dtsInclude: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TAGS,
                      label:
                        "app.api.system.builder.post.fields.dtsInclude.title",
                      description:
                        "app.api.system.builder.post.fields.dtsInclude.description",
                      placeholder:
                        "app.api.system.builder.post.fields.dtsInclude.placeholder",
                      icon: "file-type",
                      colSpan: 8,
                      schema: z.array(z.string()),
                    }),

                    dtsEntryRoot: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.builder.post.fields.dtsEntryRoot.title",
                      description:
                        "app.api.system.builder.post.fields.dtsEntryRoot.description",
                      placeholder:
                        "app.api.system.builder.post.fields.dtsEntryRoot.placeholder",
                      icon: "folder",
                      colSpan: 12,
                      schema: z.string(),
                    }),
                  },
                ),

                // Bun-specific options
                bunOptions: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.system.builder.post.fields.bunOptions.title",
                    description:
                      "app.api.system.builder.post.fields.bunOptions.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                    icon: "zap",
                  },
                  { request: "data" },
                  {
                    target: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label:
                        "app.api.system.builder.post.fields.bunTarget.title",
                      description:
                        "app.api.system.builder.post.fields.bunTarget.description",
                      options: BunTargetOptions,
                      optional: true,
                      icon: "target",
                      colSpan: 4,
                      schema: z.enum(BunTargetEnum).optional(),
                    }),

                    minify: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.bunMinify.title",
                      description:
                        "app.api.system.builder.post.fields.bunMinify.description",
                      optional: true,
                      icon: "minimize-2",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    sourcemap: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label:
                        "app.api.system.builder.post.fields.sourcemap.title",
                      description:
                        "app.api.system.builder.post.fields.sourcemap.description",
                      options: SourcemapModeOptions,
                      optional: true,
                      icon: "map",
                      colSpan: 4,
                      schema: z.enum(SourcemapModeEnum).optional(),
                    }),

                    external: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TAGS,
                      label:
                        "app.api.system.builder.post.fields.external.title",
                      description:
                        "app.api.system.builder.post.fields.external.description",
                      placeholder:
                        "app.api.system.builder.post.fields.external.placeholder",
                      optional: true,
                      icon: "external-link",
                      colSpan: 12,
                      schema: z.array(z.string()).optional(),
                    }),

                    define: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "app.api.system.builder.post.fields.define.title",
                      description:
                        "app.api.system.builder.post.fields.define.description",
                      placeholder:
                        "app.api.system.builder.post.fields.define.placeholder",
                      optional: true,
                      icon: "code",
                      colSpan: 12,
                      schema: z.record(z.string(), z.string()).optional(),
                    }),

                    splitting: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.splitting.title",
                      description:
                        "app.api.system.builder.post.fields.splitting.description",
                      optional: true,
                      icon: "git-branch",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    format: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label: "app.api.system.builder.post.fields.format.title",
                      description:
                        "app.api.system.builder.post.fields.format.description",
                      options: OutputFormatOptions,
                      optional: true,
                      icon: "file-code",
                      colSpan: 4,
                      schema: z.enum(OutputFormatEnum).optional(),
                    }),

                    bytecode: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.bytecode.title",
                      description:
                        "app.api.system.builder.post.fields.bytecode.description",
                      optional: true,
                      icon: "binary",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    banner: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXTAREA,
                      label: "app.api.system.builder.post.fields.banner.title",
                      description:
                        "app.api.system.builder.post.fields.banner.description",
                      placeholder:
                        "app.api.system.builder.post.fields.banner.placeholder",
                      optional: true,
                      icon: "chevron-up",
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    footer: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXTAREA,
                      label: "app.api.system.builder.post.fields.footer.title",
                      description:
                        "app.api.system.builder.post.fields.footer.description",
                      placeholder:
                        "app.api.system.builder.post.fields.footer.placeholder",
                      optional: true,
                      icon: "chevron-down",
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    // Advanced Bun options (passthrough to Bun.build)
                    publicPath: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.builder.post.fields.publicPath.label",
                      description:
                        "app.api.system.builder.post.fields.publicPath.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    naming: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "app.api.system.builder.post.fields.naming.label",
                      description:
                        "app.api.system.builder.post.fields.naming.description",
                      optional: true,
                      colSpan: 6,
                      schema: z
                        .union([
                          z.string(),
                          z.object({
                            entry: z.string().optional(),
                            chunk: z.string().optional(),
                            asset: z.string().optional(),
                          }),
                        ])
                        .optional(),
                    }),

                    root: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.builder.post.fields.root.label",
                      description:
                        "app.api.system.builder.post.fields.root.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    conditions: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label:
                        "app.api.system.builder.post.fields.conditions.label",
                      description:
                        "app.api.system.builder.post.fields.conditions.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.array(z.string()).optional(),
                    }),

                    loader: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "app.api.system.builder.post.fields.loader.label",
                      description:
                        "app.api.system.builder.post.fields.loader.description",
                      optional: true,
                      colSpan: 6,
                      schema: z
                        .record(
                          z.string(),
                          z.enum([
                            "js",
                            "jsx",
                            "ts",
                            "tsx",
                            "json",
                            "toml",
                            "text",
                            "file",
                            "napi",
                            "wasm",
                          ]),
                        )
                        .optional(),
                    }),

                    drop: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "app.api.system.builder.post.fields.drop.label",
                      description:
                        "app.api.system.builder.post.fields.drop.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.array(z.string()).optional(),
                    }),
                  },
                ),

                // Vite advanced options
                viteOptions: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title:
                      "app.api.system.builder.post.fields.viteOptions.title",
                    description:
                      "app.api.system.builder.post.fields.viteOptions.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                    icon: "bot",
                  },
                  { request: "data" },
                  {
                    target: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TAGS,
                      label:
                        "app.api.system.builder.post.fields.viteTarget.title",
                      description:
                        "app.api.system.builder.post.fields.viteTarget.description",
                      placeholder:
                        "app.api.system.builder.post.fields.viteTarget.placeholder",
                      optional: true,
                      icon: "target",
                      colSpan: 6,
                      schema: z
                        .union([z.string(), z.array(z.string())])
                        .optional(),
                    }),

                    outDir: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.builder.post.fields.viteOutDir.title",
                      description:
                        "app.api.system.builder.post.fields.viteOutDir.description",
                      placeholder:
                        "app.api.system.builder.post.fields.viteOutDir.placeholder",
                      optional: true,
                      icon: "folder-output",
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    assetsDir: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.builder.post.fields.viteAssetsDir.title",
                      description:
                        "app.api.system.builder.post.fields.viteAssetsDir.description",
                      placeholder:
                        "app.api.system.builder.post.fields.viteAssetsDir.placeholder",
                      optional: true,
                      icon: "folder",
                      colSpan: 4,
                      schema: z.string().optional(),
                    }),

                    assetsInlineLimit: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.NUMBER,
                      label:
                        "app.api.system.builder.post.fields.viteAssetsInlineLimit.title",
                      description:
                        "app.api.system.builder.post.fields.viteAssetsInlineLimit.description",
                      placeholder:
                        "app.api.system.builder.post.fields.viteAssetsInlineLimit.placeholder",
                      optional: true,
                      icon: "file-image",
                      colSpan: 4,
                      schema: z.number().optional(),
                    }),

                    chunkSizeWarningLimit: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.NUMBER,
                      label:
                        "app.api.system.builder.post.fields.viteChunkSizeWarningLimit.title",
                      description:
                        "app.api.system.builder.post.fields.viteChunkSizeWarningLimit.description",
                      placeholder:
                        "app.api.system.builder.post.fields.viteChunkSizeWarningLimit.placeholder",
                      optional: true,
                      icon: "alert-triangle",
                      colSpan: 4,
                      schema: z.number().optional(),
                    }),

                    cssCodeSplit: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.viteCssCodeSplit.title",
                      description:
                        "app.api.system.builder.post.fields.viteCssCodeSplit.description",
                      optional: true,
                      icon: "scissors",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    sourcemap: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label:
                        "app.api.system.builder.post.fields.viteSourcemap.title",
                      description:
                        "app.api.system.builder.post.fields.viteSourcemap.description",
                      options: [
                        {
                          value: "true",
                          label:
                            "app.api.system.builder.enums.viteSourcemap.true",
                        },
                        {
                          value: "false",
                          label:
                            "app.api.system.builder.enums.viteSourcemap.false",
                        },
                        {
                          value: "inline",
                          label:
                            "app.api.system.builder.enums.viteSourcemap.inline",
                        },
                        {
                          value: "hidden",
                          label:
                            "app.api.system.builder.enums.viteSourcemap.hidden",
                        },
                      ],
                      optional: true,
                      icon: "map",
                      colSpan: 4,
                      schema: z
                        .union([
                          z.boolean(),
                          z.literal("inline"),
                          z.literal("hidden"),
                        ])
                        .optional(),
                    }),

                    minify: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label:
                        "app.api.system.builder.post.fields.viteMinify.title",
                      description:
                        "app.api.system.builder.post.fields.viteMinify.description",
                      options: ViteMinifyOptions,
                      optional: true,
                      icon: "minimize-2",
                      colSpan: 4,
                      schema: z
                        .union([
                          z.boolean(),
                          z.literal("terser"),
                          z.literal("esbuild"),
                        ])
                        .optional(),
                    }),

                    emptyOutDir: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.viteEmptyOutDir.title",
                      description:
                        "app.api.system.builder.post.fields.viteEmptyOutDir.description",
                      optional: true,
                      icon: "trash",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    reportCompressedSize: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.viteReportCompressedSize.title",
                      description:
                        "app.api.system.builder.post.fields.viteReportCompressedSize.description",
                      optional: true,
                      icon: "archive",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    manifest: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label:
                        "app.api.system.builder.post.fields.viteManifest.title",
                      description:
                        "app.api.system.builder.post.fields.viteManifest.description",
                      optional: true,
                      icon: "list",
                      colSpan: 4,
                      schema: z.union([z.boolean(), z.string()]).optional(),
                    }),

                    // Library mode options
                    lib: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title:
                          "app.api.system.builder.post.fields.viteLib.title",
                        description:
                          "app.api.system.builder.post.fields.viteLib.description",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                        icon: "library",
                      },
                      { request: "data" },
                      {
                        entry: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.builder.post.fields.viteLibEntry.title",
                          description:
                            "app.api.system.builder.post.fields.viteLibEntry.description",
                          placeholder:
                            "app.api.system.builder.post.fields.viteLibEntry.placeholder",
                          icon: "file-input",
                          colSpan: 6,
                          schema: z.union([
                            z.string(),
                            z.array(z.string()),
                            z.record(z.string(), z.string()),
                          ]),
                        }),

                        name: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.builder.post.fields.viteLibName.title",
                          description:
                            "app.api.system.builder.post.fields.viteLibName.description",
                          placeholder:
                            "app.api.system.builder.post.fields.viteLibName.placeholder",
                          optional: true,
                          icon: "tag",
                          colSpan: 6,
                          schema: z.string().optional(),
                        }),

                        formats: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.MULTISELECT,
                          label:
                            "app.api.system.builder.post.fields.viteLibFormats.title",
                          description:
                            "app.api.system.builder.post.fields.viteLibFormats.description",
                          options: ViteLibFormatOptions,
                          optional: true,
                          icon: "file-code",
                          colSpan: 6,
                          schema: z.array(z.enum(ViteLibFormatEnum)).optional(),
                        }),

                        fileName: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.builder.post.fields.viteLibFileName.title",
                          description:
                            "app.api.system.builder.post.fields.viteLibFileName.description",
                          placeholder:
                            "app.api.system.builder.post.fields.viteLibFileName.placeholder",
                          optional: true,
                          icon: "file",
                          colSpan: 6,
                          schema: z.string().optional(),
                        }),
                      },
                    ),

                    // Rollup options subset
                    rollupOptions: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title:
                          "app.api.system.builder.post.fields.viteRollupOptions.title",
                        description:
                          "app.api.system.builder.post.fields.viteRollupOptions.description",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                        icon: "package",
                      },
                      { request: "data" },
                      {
                        external: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TAGS,
                          label:
                            "app.api.system.builder.post.fields.rollupExternal.title",
                          description:
                            "app.api.system.builder.post.fields.rollupExternal.description",
                          placeholder:
                            "app.api.system.builder.post.fields.rollupExternal.placeholder",
                          optional: true,
                          icon: "external-link",
                          colSpan: 12,
                          schema: z
                            .union([z.string(), z.array(z.string())])
                            .optional(),
                        }),

                        treeshake: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.builder.post.fields.rollupTreeshake.title",
                          description:
                            "app.api.system.builder.post.fields.rollupTreeshake.description",
                          optional: true,
                          icon: "tree",
                          colSpan: 6,
                          schema: z
                            .union([
                              z.boolean(),
                              z.object({
                                moduleSideEffects: z.boolean().optional(),
                              }),
                            ])
                            .optional(),
                        }),

                        output: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.JSON,
                          label:
                            "app.api.system.builder.post.fields.rollupOutput.label",
                          description:
                            "app.api.system.builder.post.fields.rollupOutput.description",
                          optional: true,
                          icon: "file-output",
                          colSpan: 12,
                          schema: z.record(z.string(), z.unknown()).optional(),
                        }),
                      },
                    ),

                    // Raw plugins passthrough (for programmatic config files)
                    plugins: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label:
                        "app.api.system.builder.post.fields.vitePlugins.label",
                      description:
                        "app.api.system.builder.post.fields.vitePlugins.description",
                      optional: true,
                      icon: "plug",
                      colSpan: 12,
                      schema: z.array(z.unknown()).optional(),
                    }),

                    // Raw build options passthrough
                    build: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label:
                        "app.api.system.builder.post.fields.viteBuild.label",
                      description:
                        "app.api.system.builder.post.fields.viteBuild.description",
                      optional: true,
                      icon: "settings",
                      colSpan: 12,
                      schema: z.record(z.string(), z.unknown()).optional(),
                    }),
                  },
                ),
              },
            ),
          ),

          // ==================================================================
          // FILES/FOLDERS TO COPY
          // ==================================================================
          filesOrFoldersToCopy: requestDataArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.system.builder.post.fields.filesOrFoldersToCopy.title",
              description:
                "app.api.system.builder.post.fields.filesOrFoldersToCopy.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "copy" as const,
            },
            objectField(
              {
                type: WidgetType.DATA_CARDS,
                title: "app.api.system.builder.post.fields.copyConfig.title",
                layoutType: LayoutType.GRID,
                columns: 12,
                icon: "file-copy",
              },
              { request: "data" },
              {
                input: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.copyInput.title",
                  description:
                    "app.api.system.builder.post.fields.copyInput.description",
                  placeholder:
                    "app.api.system.builder.post.fields.copyInput.placeholder",
                  icon: "file-input",
                  colSpan: 5,
                  schema: z.string(),
                }),

                output: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.copyOutput.title",
                  description:
                    "app.api.system.builder.post.fields.copyOutput.description",
                  placeholder:
                    "app.api.system.builder.post.fields.copyOutput.placeholder",
                  icon: "file-output",
                  colSpan: 5,
                  schema: z.string(),
                }),

                pattern: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.copyPattern.title",
                  description:
                    "app.api.system.builder.post.fields.copyPattern.description",
                  placeholder:
                    "app.api.system.builder.post.fields.copyPattern.placeholder",
                  optional: true,
                  icon: "filter",
                  colSpan: 2,
                  schema: z.string().optional(),
                }),
              },
            ),
          ),

          // ==================================================================
          // NPM PACKAGE CONFIGURATION
          // ==================================================================
          npmPackage: objectOptionalField(
            {
              type: WidgetType.ACCORDION,
              title: "app.api.system.builder.post.fields.npmPackage.title",
              description:
                "app.api.system.builder.post.fields.npmPackage.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "npm",
              defaultExpanded: false,
            },
            { request: "data" },
            {
              name: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.builder.post.fields.packageName.title",
                description:
                  "app.api.system.builder.post.fields.packageName.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageName.placeholder",
                icon: "package",
                colSpan: 6,
                schema: z.string(),
              }),

              version: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.system.builder.post.fields.packageVersion.title",
                description:
                  "app.api.system.builder.post.fields.packageVersion.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageVersion.placeholder",
                optional: true,
                icon: "tag",
                colSpan: 6,
                schema: z.string().optional(),
              }),

              description: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXTAREA,
                label:
                  "app.api.system.builder.post.fields.packageDescription.title",
                description:
                  "app.api.system.builder.post.fields.packageDescription.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageDescription.placeholder",
                optional: true,
                icon: "text",
                colSpan: 12,
                schema: z.string().optional(),
              }),

              main: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.builder.post.fields.packageMain.title",
                description:
                  "app.api.system.builder.post.fields.packageMain.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageMain.placeholder",
                optional: true,
                icon: "file-code",
                colSpan: 4,
                schema: z.string().optional(),
              }),

              module: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.builder.post.fields.packageModule.title",
                description:
                  "app.api.system.builder.post.fields.packageModule.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageModule.placeholder",
                optional: true,
                icon: "file-code-2",
                colSpan: 4,
                schema: z.string().optional(),
              }),

              types: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.builder.post.fields.packageTypes.title",
                description:
                  "app.api.system.builder.post.fields.packageTypes.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageTypes.placeholder",
                optional: true,
                icon: "file-type",
                colSpan: 4,
                schema: z.string().optional(),
              }),

              bin: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label: "app.api.system.builder.post.fields.packageBin.title",
                description:
                  "app.api.system.builder.post.fields.packageBin.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageBin.placeholder",
                optional: true,
                icon: "terminal",
                colSpan: 12,
                schema: z.record(z.string(), z.string()).optional(),
              }),

              exports: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label:
                  "app.api.system.builder.post.fields.packageExports.title",
                description:
                  "app.api.system.builder.post.fields.packageExports.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageExports.placeholder",
                optional: true,
                icon: "share-2",
                colSpan: 12,
                schema: z
                  .record(z.string(), PackageExportConditionSchema)
                  .optional(),
              }),

              dependencies: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label:
                  "app.api.system.builder.post.fields.packageDependencies.title",
                description:
                  "app.api.system.builder.post.fields.packageDependencies.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageDependencies.placeholder",
                optional: true,
                icon: "package",
                colSpan: 6,
                schema: z.record(z.string(), z.string()).optional(),
              }),

              peerDependencies: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label:
                  "app.api.system.builder.post.fields.packagePeerDependencies.title",
                description:
                  "app.api.system.builder.post.fields.packagePeerDependencies.description",
                placeholder:
                  "app.api.system.builder.post.fields.packagePeerDependencies.placeholder",
                optional: true,
                icon: "users",
                colSpan: 6,
                schema: z.record(z.string(), z.string()).optional(),
              }),

              files: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TAGS,
                label: "app.api.system.builder.post.fields.packageFiles.title",
                description:
                  "app.api.system.builder.post.fields.packageFiles.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageFiles.placeholder",
                optional: true,
                icon: "folder",
                colSpan: 6,
                schema: z.array(z.string()).optional(),
              }),

              keywords: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TAGS,
                label:
                  "app.api.system.builder.post.fields.packageKeywords.title",
                description:
                  "app.api.system.builder.post.fields.packageKeywords.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageKeywords.placeholder",
                optional: true,
                icon: "hash",
                colSpan: 6,
                schema: z.array(z.string()).optional(),
              }),

              license: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.system.builder.post.fields.packageLicense.title",
                description:
                  "app.api.system.builder.post.fields.packageLicense.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageLicense.placeholder",
                optional: true,
                icon: "scale",
                colSpan: 6,
                schema: z.string().optional(),
              }),

              repository: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.system.builder.post.fields.packageRepository.title",
                description:
                  "app.api.system.builder.post.fields.packageRepository.description",
                placeholder:
                  "app.api.system.builder.post.fields.packageRepository.placeholder",
                optional: true,
                icon: "github",
                colSpan: 6,
                schema: z
                  .union([
                    z.string(),
                    z.object({ type: z.string(), url: z.string() }),
                  ])
                  .optional(),
              }),
            },
          ),
        },
      ),

      // ========================================================================
      // RESPONSE FIELDS
      // ========================================================================
      success: responseField({
        type: WidgetType.STATUS_INDICATOR,
        status: "success",
        label: "app.api.system.builder.post.fields.success.title",
        icon: "check-circle",
        schema: z.boolean(),
      }),

      output: responseField({
        type: WidgetType.CODE_OUTPUT,
        content: "app.api.system.builder.post.fields.buildOutput.title",
        language: "plaintext",
        icon: "terminal",
        schema: z.string(),
      }),

      duration: responseField({
        type: WidgetType.STAT,
        content: "app.api.system.builder.post.fields.duration.title",
        icon: "clock",
        suffix: "ms",
        schema: z.coerce.number(),
      }),

      filesBuilt: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          items: [],
          optional: true,
          icon: "file-check",
        },
        responseField({
          type: WidgetType.TEXT,
          content: "app.api.system.builder.post.fields.filesBuilt.item",
          schema: z.string(),
        }),
      ),

      filesCopied: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          items: [],
          optional: true,
          icon: "file-copy",
        },
        responseField({
          type: WidgetType.TEXT,
          content: "app.api.system.builder.post.fields.filesCopied.item",
          schema: z.string(),
        }),
      ),

      packageJson: responseField({
        type: WidgetType.CODE_OUTPUT,
        content: "app.api.system.builder.post.fields.packageJson.title",
        language: "json",
        optional: true,
        icon: "file-json",
        schema: z.string().optional(),
      }),

      profileUsed: responseField({
        type: WidgetType.BADGE,
        content: "app.api.system.builder.post.fields.profileUsed.title",
        optional: true,
        icon: "layers",
        schema: z.enum(BuildProfileEnum).optional(),
      }),

      reportPath: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.builder.post.fields.reportPath.title",
        schema: z.string().optional(),
      }),

      stepTimings: responseArrayOptionalField(
        {
          type: WidgetType.DATA_TABLE,
          optional: true,
          icon: "list-checks",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            step: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.builder.post.fields.stepTimings.step",
              icon: "chevron-right",
              schema: z.string(),
            }),
            duration: responseField({
              type: WidgetType.STAT,
              label: "app.api.system.builder.post.fields.stepTimings.duration",
              icon: "clock",
              suffix: "ms",
              schema: z.coerce.number(),
            }),
            status: responseField({
              type: WidgetType.BADGE,
              label: "app.api.system.builder.post.fields.stepTimings.status",
              icon: "activity",
              schema: z.enum(StepStatusEnum),
            }),
            filesAffected: responseField({
              type: WidgetType.STAT,
              label:
                "app.api.system.builder.post.fields.stepTimings.filesAffected",
              optional: true,
              icon: "folder",
              schema: z.coerce.number().optional(),
            }),
          },
        ),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.builder.post.errors.validation.title",
      description: "app.api.system.builder.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.builder.post.errors.network.title",
      description: "app.api.system.builder.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.builder.post.errors.unauthorized.title",
      description:
        "app.api.system.builder.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.builder.post.errors.forbidden.title",
      description: "app.api.system.builder.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.builder.post.errors.notFound.title",
      description: "app.api.system.builder.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.builder.post.errors.server.title",
      description: "app.api.system.builder.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.builder.post.errors.unknown.title",
      description: "app.api.system.builder.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.builder.post.errors.conflict.title",
      description: "app.api.system.builder.post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.builder.post.errors.unsavedChanges.title",
      description:
        "app.api.system.builder.post.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.builder.post.success.title",
    description: "app.api.system.builder.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      defaultConfig: {},
      productionBuild: {
        configObject: {
          profile: BuildProfileEnum.PRODUCTION,
          analyze: true,
          filesToCompile: [],
          filesOrFoldersToCopy: [],
        },
      },
      dryRun: {
        configObject: {
          dryRun: true,
          verbose: true,
          filesToCompile: [],
          filesOrFoldersToCopy: [],
        },
      },
    },
    responses: {
      defaultConfig: {
        success: true,
        output: "Build completed successfully",
        duration: 1500,
        filesBuilt: ["dist/bin/vibe-runtime.js"],
        filesCopied: ["dist/README.md", "dist/LICENSE"],
        profileUsed: BuildProfileEnum.DEVELOPMENT,
        stepTimings: [],
      },
      productionBuild: {
        success: true,
        output: "Build completed successfully",
        duration: 2500,
        filesBuilt: ["dist/bin/vibe-runtime.js"],
        filesCopied: [],
        profileUsed: BuildProfileEnum.PRODUCTION,
        stepTimings: [],
      },
      dryRun: {
        success: true,
        output: "[DRY RUN] Build preview completed",
        duration: 50,
        filesBuilt: ["dist/bin/vibe-runtime.js"],
        filesCopied: [],
        profileUsed: BuildProfileEnum.DEVELOPMENT,
        stepTimings: [],
      },
    },
  },
});

// Export the definition
const builderDefinition = { POST };
export default builderDefinition;

// ============================================================================
// Type Exports - Derived from Enums
// ============================================================================

/** Build profile type (derived from enum) */
export type BuildProfile = `${BuildProfileEnum}`;

/** Vite build types (derived from enum) */
export type ViteBuildType = `${ViteBuildTypeEnum}`;

/** Bun build types (derived from enum) */
export type BunBuildType = `${BunBuildTypeEnum}`;

/** All build types */
export type BuildType = ViteBuildType | BunBuildType;

/** Bun target runtime (derived from enum) */
export type BunTarget = `${BunTargetEnum}`;

/** Sourcemap mode (derived from enum) */
export type SourcemapMode = `${SourcemapModeEnum}`;

/** Output format (derived from enum) */
export type OutputFormat = `${OutputFormatEnum}`;

/** Step status (derived from enum) */
export type StepStatus = `${StepStatusEnum}`;

// ============================================================================
// Type Guards
// ============================================================================

/** Type guard for Vite builds */
export function isViteBuildType(type: BuildType): type is ViteBuildType {
  return Object.values(ViteBuildTypeEnum).includes(type as ViteBuildTypeEnum);
}

/** Type guard for Bun builds */
export function isBunBuildType(type: BuildType): type is BunBuildType {
  return Object.values(BunBuildTypeEnum).includes(type as BunBuildTypeEnum);
}

// ============================================================================
// Inferred Types from Definition Fields
// ============================================================================

/** Request type inferred from POST definition */
export type BuilderRequest = typeof POST.types.RequestOutput;

/** Response type inferred from POST definition */
export type BuilderResponse = typeof POST.types.ResponseOutput;

/** API config object type inferred from POST definition fields */
export type ApiConfigObject = NonNullable<BuilderRequest["configObject"]>;

/** File to compile type inferred from API definition */
export type FileToCompile = NonNullable<
  ApiConfigObject["filesToCompile"]
>[number];

/** Copy config type inferred from API definition */
export type CopyConfig = NonNullable<
  ApiConfigObject["filesOrFoldersToCopy"]
>[number];

/** NPM package config type inferred from API definition */
export type NpmPackageConfig = NonNullable<ApiConfigObject["npmPackage"]>;

/** Bun build options type inferred from API definition */
export type BunBuildOptions = NonNullable<FileToCompile["bunOptions"]>;

/** Vite options type inferred from API definition */
export type ViteOptions = NonNullable<FileToCompile["viteOptions"]>;

/** Package config type inferred from API definition */
export type PackageConfig = NonNullable<FileToCompile["packageConfig"]>;

/** Step timing type inferred from response */
export type StepTiming = NonNullable<BuilderResponse["stepTimings"]>[number];

/** Build step result - internal type for tracking build steps */
export interface BuildStepResult {
  step: string;
  success: boolean;
  duration: number;
  filesAffected?: string[];
  size?: number;
  warnings?: string[];
}

/** Bundle analysis result */
export interface BundleAnalysis {
  totalSize: number;
  files: Array<{ name: string; size: number; percentage: number }>;
  suggestions: string[];
  warnings: string[];
}

/** Full build report */
export interface BuildReport {
  timestamp: string;
  duration: number;
  profile: BuildProfile;
  success: boolean;
  steps: BuildStepResult[];
  files: { built: string[]; copied: string[] };
  bundleAnalysis?: BundleAnalysis;
  environment: { nodeVersion: string; platform: string; cwd: string };
}

/** Build hook context */
export interface BuildHookContext {
  config: BuildConfig;
  profile: BuildProfile;
  outputDir: string;
  /** Logger instance (EndpointLogger) */
  logger: {
    info: (message: string) => void;
    warn: (message: string) => void;
    error: (message: string) => void;
    debug: (message: string) => void;
  };
  addOutput: (message: string) => void;
}

/** Build hook function */
export type BuildHook = (context: BuildHookContext) => Promise<void> | void;

/** Full BuildConfig type - API config + runtime-only fields (hooks, env, profiles) */
export interface BuildConfig extends Omit<
  ApiConfigObject,
  "filesToCompile" | "filesOrFoldersToCopy" | "npmPackage"
> {
  foldersToClean?: string[];
  filesToCompile?: FileToCompile[];
  filesOrFoldersToCopy?: CopyConfig[];
  npmPackage?: NpmPackageConfig | null;
  hooks?: {
    preBuild?: BuildHook;
    postBuild?: BuildHook;
    onFileCompiled?: (filePath: string, size: number) => void;
  };
  env?: Record<string, string>;
  profiles?: Partial<Record<BuildProfile, Partial<BuildConfig>>>;
}
