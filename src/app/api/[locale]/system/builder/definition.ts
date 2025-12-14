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
  requestDataField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { BuildProfileEnum,BunBuildTypeEnum,BunTargetEnum,OutputFormatEnum,SourcemapModeEnum,StepStatusEnum,ViteBuildTypeEnum,ViteLibFormatEnum } from "./enum";


// Re-export combined BuildTypeEnum


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
// Zod Schemas from Enums
// ============================================================================

const BuildProfileSchema = z.nativeEnum(BuildProfileEnum);
const ViteBuildTypeSchema = z.nativeEnum(ViteBuildTypeEnum);
const BunBuildTypeSchema = z.nativeEnum(BunBuildTypeEnum);
const BuildTypeSchema = z.union([ViteBuildTypeSchema, BunBuildTypeSchema]);
const BunTargetSchema = z.nativeEnum(BunTargetEnum);
const SourcemapModeSchema = z.nativeEnum(SourcemapModeEnum);
const OutputFormatSchema = z.nativeEnum(OutputFormatEnum);
const StepStatusSchema = z.nativeEnum(StepStatusEnum);

// ============================================================================
// Complex Type Schemas
// ============================================================================

/**
 * Package.json exports field schema
 * Supports: string path, conditional exports, or nested export maps
 * @example { ".": { "import": "./dist/index.mjs", "require": "./dist/index.cjs" } }
 */
type PackageExportCondition = string | { [key: string]: string | PackageExportCondition };
const PackageExportConditionSchema: z.ZodType<PackageExportCondition> = z.lazy(() =>
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
  category: "app.api.system.server.category",
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
      configPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.builder.post.fields.configPath.title",
          description: "app.api.system.builder.post.fields.configPath.description",
          placeholder: "build.config.ts",
          icon: "file-code",
          colSpan: 12,
        },
        z.string().optional().default("build.config.ts"),
      ),

      // ========================================================================
      // CONFIG OBJECT - Full inline build configuration
      // ========================================================================
      configObject: objectOptionalField(
        {
          type: WidgetType.ACCORDION,
          title: "app.api.system.builder.post.fields.configObject.title",
          description: "app.api.system.builder.post.fields.configObject.description",
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
          profile: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.system.builder.post.fields.profile.title",
              description: "app.api.system.builder.post.fields.profile.description",
              options: BuildProfileOptions,
              optional: true,
              icon: "layers",
              colSpan: 4,
            },
            BuildProfileSchema.optional(),
          ),

          dryRun: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.dryRun.title",
              description: "app.api.system.builder.post.fields.dryRun.description",
              optional: true,
              icon: "eye",
              colSpan: 4,
            },
            z.boolean().optional(),
          ),

          verbose: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.verbose.title",
              description: "app.api.system.builder.post.fields.verbose.description",
              optional: true,
              icon: "terminal",
              colSpan: 4,
            },
            z.boolean().optional(),
          ),

          analyze: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.analyze.title",
              description: "app.api.system.builder.post.fields.analyze.description",
              optional: true,
              icon: "bar-chart-2",
              colSpan: 3,
            },
            z.boolean().optional(),
          ),

          watch: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.watch.title",
              description: "app.api.system.builder.post.fields.watch.description",
              optional: true,
              icon: "refresh-cw",
              colSpan: 3,
            },
            z.boolean().optional(),
          ),

          parallel: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.parallel.title",
              description: "app.api.system.builder.post.fields.parallel.description",
              optional: true,
              icon: "git-branch",
              colSpan: 3,
            },
            z.boolean().optional(),
          ),

          cache: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.cache.title",
              description: "app.api.system.builder.post.fields.cache.description",
              optional: true,
              icon: "database",
              colSpan: 3,
            },
            z.boolean().optional(),
          ),

          report: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.report.title",
              description: "app.api.system.builder.post.fields.report.description",
              optional: true,
              icon: "file-text",
              colSpan: 3,
            },
            z.boolean().optional(),
          ),

          minify: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.builder.post.fields.minify.title",
              description: "app.api.system.builder.post.fields.minify.description",
              optional: true,
              icon: "minimize-2",
              colSpan: 3,
            },
            z.boolean().optional(),
          ),

          // ==================================================================
          // FOLDERS TO CLEAN
          // ==================================================================
          foldersToClean: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TAGS,
              label: "app.api.system.builder.post.fields.foldersToClean.title",
              description: "app.api.system.builder.post.fields.foldersToClean.description",
              placeholder: "dist, build, .cache",
              optional: true,
              icon: "trash-2",
              colSpan: 12,
            },
            z.array(z.string()).optional(),
          ),

          // ==================================================================
          // FILES TO COMPILE
          // ==================================================================
          filesToCompile: requestDataArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.builder.post.fields.filesToCompile.title",
              description: "app.api.system.builder.post.fields.filesToCompile.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "code",
            },
            objectField(
              {
                type: WidgetType.DATA_CARD,
                title: "app.api.system.builder.post.fields.fileToCompile.title",
                layoutType: LayoutType.GRID,
                columns: 12,
                icon: "file",
              },
              { request: "data" },
              {
                input: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.builder.post.fields.input.title",
                    description: "app.api.system.builder.post.fields.input.description",
                    placeholder: "src/index.ts",
                    icon: "file-input",
                    colSpan: 6,
                  },
                  z.string(),
                ),

                output: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.builder.post.fields.output.title",
                    description: "app.api.system.builder.post.fields.output.description",
                    placeholder: "dist/index.js",
                    icon: "file-output",
                    colSpan: 6,
                  },
                  z.string(),
                ),

                type: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.SELECT,
                    label: "app.api.system.builder.post.fields.type.title",
                    description: "app.api.system.builder.post.fields.type.description",
                    options: BuildTypeOptions,
                    icon: "box",
                    colSpan: 6,
                  },
                  BuildTypeSchema,
                ),

                modulesToExternalize: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TAGS,
                    label: "app.api.system.builder.post.fields.modulesToExternalize.title",
                    description: "app.api.system.builder.post.fields.modulesToExternalize.description",
                    placeholder: "react, react-dom, lodash",
                    optional: true,
                    icon: "package",
                    colSpan: 6,
                  },
                  z.array(z.string()).optional(),
                ),

                // Vite-specific options
                inlineCss: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.BOOLEAN,
                    label: "app.api.system.builder.post.fields.inlineCss.title",
                    description: "app.api.system.builder.post.fields.inlineCss.description",
                    optional: true,
                    icon: "paintbrush",
                    colSpan: 4,
                  },
                  z.boolean().optional(),
                ),

                bundleReact: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.BOOLEAN,
                    label: "app.api.system.builder.post.fields.bundleReact.title",
                    description: "app.api.system.builder.post.fields.bundleReact.description",
                    optional: true,
                    icon: "atom",
                    colSpan: 4,
                  },
                  z.boolean().optional(),
                ),

                // Package config for library builds
                packageConfig: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.system.builder.post.fields.packageConfig.title",
                    description: "app.api.system.builder.post.fields.packageConfig.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                    icon: "package",
                  },
                  { request: "data" },
                  {
                    isPackage: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.isPackage.title",
                        description: "app.api.system.builder.post.fields.isPackage.description",
                        colSpan: 4,
                      },
                      z.literal(true),
                    ),

                    dtsInclude: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TAGS,
                        label: "app.api.system.builder.post.fields.dtsInclude.title",
                        description: "app.api.system.builder.post.fields.dtsInclude.description",
                        placeholder: "src/**/*.ts",
                        icon: "file-type",
                        colSpan: 8,
                      },
                      z.array(z.string()),
                    ),

                    dtsEntryRoot: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label: "app.api.system.builder.post.fields.dtsEntryRoot.title",
                        description: "app.api.system.builder.post.fields.dtsEntryRoot.description",
                        placeholder: "src",
                        icon: "folder",
                        colSpan: 12,
                      },
                      z.string(),
                    ),
                  },
                ),

                // Bun-specific options
                bunOptions: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.system.builder.post.fields.bunOptions.title",
                    description: "app.api.system.builder.post.fields.bunOptions.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                    icon: "zap",
                  },
                  { request: "data" },
                  {
                    target: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.SELECT,
                        label: "app.api.system.builder.post.fields.bunTarget.title",
                        description: "app.api.system.builder.post.fields.bunTarget.description",
                        options: BunTargetOptions,
                        optional: true,
                        icon: "target",
                        colSpan: 4,
                      },
                      BunTargetSchema.optional(),
                    ),

                    minify: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.bunMinify.title",
                        description: "app.api.system.builder.post.fields.bunMinify.description",
                        optional: true,
                        icon: "minimize-2",
                        colSpan: 4,
                      },
                      z.boolean().optional(),
                    ),

                    sourcemap: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.SELECT,
                        label: "app.api.system.builder.post.fields.sourcemap.title",
                        description: "app.api.system.builder.post.fields.sourcemap.description",
                        options: SourcemapModeOptions,
                        optional: true,
                        icon: "map",
                        colSpan: 4,
                      },
                      SourcemapModeSchema.optional(),
                    ),

                    external: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TAGS,
                        label: "app.api.system.builder.post.fields.external.title",
                        description: "app.api.system.builder.post.fields.external.description",
                        placeholder: "react, react-dom",
                        optional: true,
                        icon: "external-link",
                        colSpan: 12,
                      },
                      z.array(z.string()).optional(),
                    ),

                    define: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.JSON,
                        label: "app.api.system.builder.post.fields.define.title",
                        description: "app.api.system.builder.post.fields.define.description",
                        placeholder: '{"process.env.NODE_ENV": "\\"production\\""}',
                        optional: true,
                        icon: "code",
                        colSpan: 12,
                      },
                      z.record(z.string(), z.string()).optional(),
                    ),

                    splitting: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.splitting.title",
                        description: "app.api.system.builder.post.fields.splitting.description",
                        optional: true,
                        icon: "git-branch",
                        colSpan: 4,
                      },
                      z.boolean().optional(),
                    ),

                    format: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.SELECT,
                        label: "app.api.system.builder.post.fields.format.title",
                        description: "app.api.system.builder.post.fields.format.description",
                        options: OutputFormatOptions,
                        optional: true,
                        icon: "file-code",
                        colSpan: 4,
                      },
                      OutputFormatSchema.optional(),
                    ),

                    bytecode: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.bytecode.title",
                        description: "app.api.system.builder.post.fields.bytecode.description",
                        optional: true,
                        icon: "binary",
                        colSpan: 4,
                      },
                      z.boolean().optional(),
                    ),

                    banner: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXTAREA,
                        label: "app.api.system.builder.post.fields.banner.title",
                        description: "app.api.system.builder.post.fields.banner.description",
                        placeholder: "#!/usr/bin/env node",
                        optional: true,
                        icon: "chevron-up",
                        colSpan: 6,
                      },
                      z.string().optional(),
                    ),

                    footer: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXTAREA,
                        label: "app.api.system.builder.post.fields.footer.title",
                        description: "app.api.system.builder.post.fields.footer.description",
                        placeholder: "// End of file",
                        optional: true,
                        icon: "chevron-down",
                        colSpan: 6,
                      },
                      z.string().optional(),
                    ),
                  },
                ),

                // Vite advanced options
                viteOptions: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.system.builder.post.fields.viteOptions.title",
                    description: "app.api.system.builder.post.fields.viteOptions.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                    icon: "bolt",
                  },
                  { request: "data" },
                  {
                    target: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TAGS,
                        label: "app.api.system.builder.post.fields.viteTarget.title",
                        description: "app.api.system.builder.post.fields.viteTarget.description",
                        placeholder: "es2020, chrome80, node18",
                        optional: true,
                        icon: "target",
                        colSpan: 6,
                      },
                      z.union([z.string(), z.array(z.string())]).optional(),
                    ),

                    outDir: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label: "app.api.system.builder.post.fields.viteOutDir.title",
                        description: "app.api.system.builder.post.fields.viteOutDir.description",
                        placeholder: "dist",
                        optional: true,
                        icon: "folder-output",
                        colSpan: 6,
                      },
                      z.string().optional(),
                    ),

                    assetsDir: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label: "app.api.system.builder.post.fields.viteAssetsDir.title",
                        description: "app.api.system.builder.post.fields.viteAssetsDir.description",
                        placeholder: "assets",
                        optional: true,
                        icon: "folder",
                        colSpan: 4,
                      },
                      z.string().optional(),
                    ),

                    assetsInlineLimit: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.NUMBER,
                        label: "app.api.system.builder.post.fields.viteAssetsInlineLimit.title",
                        description: "app.api.system.builder.post.fields.viteAssetsInlineLimit.description",
                        placeholder: "4096",
                        optional: true,
                        icon: "file-image",
                        colSpan: 4,
                      },
                      z.number().optional(),
                    ),

                    chunkSizeWarningLimit: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.NUMBER,
                        label: "app.api.system.builder.post.fields.viteChunkSizeWarningLimit.title",
                        description: "app.api.system.builder.post.fields.viteChunkSizeWarningLimit.description",
                        placeholder: "500",
                        optional: true,
                        icon: "alert-triangle",
                        colSpan: 4,
                      },
                      z.number().optional(),
                    ),

                    cssCodeSplit: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.viteCssCodeSplit.title",
                        description: "app.api.system.builder.post.fields.viteCssCodeSplit.description",
                        optional: true,
                        icon: "scissors",
                        colSpan: 4,
                      },
                      z.boolean().optional(),
                    ),

                    sourcemap: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.SELECT,
                        label: "app.api.system.builder.post.fields.viteSourcemap.title",
                        description: "app.api.system.builder.post.fields.viteSourcemap.description",
                        options: [
                          { value: "true", label: "app.api.system.builder.enums.viteSourcemap.true" },
                          { value: "false", label: "app.api.system.builder.enums.viteSourcemap.false" },
                          { value: "inline", label: "app.api.system.builder.enums.viteSourcemap.inline" },
                          { value: "hidden", label: "app.api.system.builder.enums.viteSourcemap.hidden" },
                        ],
                        optional: true,
                        icon: "map",
                        colSpan: 4,
                      },
                      z.union([z.boolean(), z.literal("inline"), z.literal("hidden")]).optional(),
                    ),

                    minify: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.SELECT,
                        label: "app.api.system.builder.post.fields.viteMinify.title",
                        description: "app.api.system.builder.post.fields.viteMinify.description",
                        options: ViteMinifyOptions,
                        optional: true,
                        icon: "minimize-2",
                        colSpan: 4,
                      },
                      z.union([z.boolean(), z.literal("terser"), z.literal("esbuild")]).optional(),
                    ),

                    emptyOutDir: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.viteEmptyOutDir.title",
                        description: "app.api.system.builder.post.fields.viteEmptyOutDir.description",
                        optional: true,
                        icon: "trash",
                        colSpan: 4,
                      },
                      z.boolean().optional(),
                    ),

                    reportCompressedSize: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.viteReportCompressedSize.title",
                        description: "app.api.system.builder.post.fields.viteReportCompressedSize.description",
                        optional: true,
                        icon: "archive",
                        colSpan: 4,
                      },
                      z.boolean().optional(),
                    ),

                    manifest: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.BOOLEAN,
                        label: "app.api.system.builder.post.fields.viteManifest.title",
                        description: "app.api.system.builder.post.fields.viteManifest.description",
                        optional: true,
                        icon: "list",
                        colSpan: 4,
                      },
                      z.union([z.boolean(), z.string()]).optional(),
                    ),

                    // Library mode options
                    lib: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title: "app.api.system.builder.post.fields.viteLib.title",
                        description: "app.api.system.builder.post.fields.viteLib.description",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                        icon: "library",
                      },
                      { request: "data" },
                      {
                        entry: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label: "app.api.system.builder.post.fields.viteLibEntry.title",
                            description: "app.api.system.builder.post.fields.viteLibEntry.description",
                            placeholder: "src/index.ts",
                            icon: "file-input",
                            colSpan: 6,
                          },
                          z.union([z.string(), z.array(z.string()), z.record(z.string(), z.string())]),
                        ),

                        name: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label: "app.api.system.builder.post.fields.viteLibName.title",
                            description: "app.api.system.builder.post.fields.viteLibName.description",
                            placeholder: "MyLibrary",
                            optional: true,
                            icon: "tag",
                            colSpan: 6,
                          },
                          z.string().optional(),
                        ),

                        formats: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.MULTISELECT,
                            label: "app.api.system.builder.post.fields.viteLibFormats.title",
                            description: "app.api.system.builder.post.fields.viteLibFormats.description",
                            options: ViteLibFormatOptions,
                            optional: true,
                            icon: "file-code",
                            colSpan: 6,
                          },
                          z.array(z.nativeEnum(ViteLibFormatEnum)).optional(),
                        ),

                        fileName: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label: "app.api.system.builder.post.fields.viteLibFileName.title",
                            description: "app.api.system.builder.post.fields.viteLibFileName.description",
                            placeholder: "my-library",
                            optional: true,
                            icon: "file",
                            colSpan: 6,
                          },
                          z.string().optional(),
                        ),
                      },
                    ),

                    // Rollup options subset
                    rollupOptions: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title: "app.api.system.builder.post.fields.viteRollupOptions.title",
                        description: "app.api.system.builder.post.fields.viteRollupOptions.description",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                        icon: "package",
                      },
                      { request: "data" },
                      {
                        external: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TAGS,
                            label: "app.api.system.builder.post.fields.rollupExternal.title",
                            description: "app.api.system.builder.post.fields.rollupExternal.description",
                            placeholder: "react, react-dom",
                            optional: true,
                            icon: "external-link",
                            colSpan: 12,
                          },
                          z.union([z.string(), z.array(z.string())]).optional(),
                        ),

                        treeshake: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label: "app.api.system.builder.post.fields.rollupTreeshake.title",
                            description: "app.api.system.builder.post.fields.rollupTreeshake.description",
                            optional: true,
                            icon: "tree",
                            colSpan: 6,
                          },
                          z.union([z.boolean(), z.object({ moduleSideEffects: z.boolean().optional() })]).optional(),
                        ),
                      },
                    ),
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
              title: "app.api.system.builder.post.fields.filesOrFoldersToCopy.title",
              description: "app.api.system.builder.post.fields.filesOrFoldersToCopy.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "copy",
            },
            objectField(
              {
                type: WidgetType.DATA_CARD,
                title: "app.api.system.builder.post.fields.copyConfig.title",
                layoutType: LayoutType.GRID,
                columns: 12,
                icon: "file-copy",
              },
              { request: "data" },
              {
                input: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.builder.post.fields.copyInput.title",
                    description: "app.api.system.builder.post.fields.copyInput.description",
                    placeholder: "README.md",
                    icon: "file-input",
                    colSpan: 5,
                  },
                  z.string(),
                ),

                output: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.builder.post.fields.copyOutput.title",
                    description: "app.api.system.builder.post.fields.copyOutput.description",
                    placeholder: "dist/README.md",
                    icon: "file-output",
                    colSpan: 5,
                  },
                  z.string(),
                ),

                pattern: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.builder.post.fields.copyPattern.title",
                    description: "app.api.system.builder.post.fields.copyPattern.description",
                    placeholder: "**/*.json",
                    optional: true,
                    icon: "filter",
                    colSpan: 2,
                  },
                  z.string().optional(),
                ),
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
              description: "app.api.system.builder.post.fields.npmPackage.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "npm",
              defaultExpanded: false,
            },
            { request: "data" },
            {
              name: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageName.title",
                  description: "app.api.system.builder.post.fields.packageName.description",
                  placeholder: "@myorg/package-name",
                  icon: "package",
                  colSpan: 6,
                },
                z.string(),
              ),

              version: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageVersion.title",
                  description: "app.api.system.builder.post.fields.packageVersion.description",
                  placeholder: "1.0.0",
                  optional: true,
                  icon: "tag",
                  colSpan: 6,
                },
                z.string().optional(),
              ),

              description: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXTAREA,
                  label: "app.api.system.builder.post.fields.packageDescription.title",
                  description: "app.api.system.builder.post.fields.packageDescription.description",
                  placeholder: "A brief description of your package",
                  optional: true,
                  icon: "text",
                  colSpan: 12,
                },
                z.string().optional(),
              ),

              main: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageMain.title",
                  description: "app.api.system.builder.post.fields.packageMain.description",
                  placeholder: "./dist/index.cjs",
                  optional: true,
                  icon: "file-code",
                  colSpan: 4,
                },
                z.string().optional(),
              ),

              module: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageModule.title",
                  description: "app.api.system.builder.post.fields.packageModule.description",
                  placeholder: "./dist/index.mjs",
                  optional: true,
                  icon: "file-code-2",
                  colSpan: 4,
                },
                z.string().optional(),
              ),

              types: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageTypes.title",
                  description: "app.api.system.builder.post.fields.packageTypes.description",
                  placeholder: "./dist/index.d.ts",
                  optional: true,
                  icon: "file-type",
                  colSpan: 4,
                },
                z.string().optional(),
              ),

              bin: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.JSON,
                  label: "app.api.system.builder.post.fields.packageBin.title",
                  description: "app.api.system.builder.post.fields.packageBin.description",
                  placeholder: '{"my-cli": "./dist/bin/cli.js"}',
                  optional: true,
                  icon: "terminal",
                  colSpan: 12,
                },
                z.record(z.string(), z.string()).optional(),
              ),

              exports: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.JSON,
                  label: "app.api.system.builder.post.fields.packageExports.title",
                  description: "app.api.system.builder.post.fields.packageExports.description",
                  placeholder: '{".": {"import": "./dist/index.mjs", "require": "./dist/index.cjs"}}',
                  optional: true,
                  icon: "share-2",
                  colSpan: 12,
                },
                z.record(z.string(), PackageExportConditionSchema).optional(),
              ),

              dependencies: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.JSON,
                  label: "app.api.system.builder.post.fields.packageDependencies.title",
                  description: "app.api.system.builder.post.fields.packageDependencies.description",
                  placeholder: '{"lodash": "^4.17.21"}',
                  optional: true,
                  icon: "package",
                  colSpan: 6,
                },
                z.record(z.string(), z.string()).optional(),
              ),

              peerDependencies: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.JSON,
                  label: "app.api.system.builder.post.fields.packagePeerDependencies.title",
                  description: "app.api.system.builder.post.fields.packagePeerDependencies.description",
                  placeholder: '{"react": ">=18.0.0"}',
                  optional: true,
                  icon: "users",
                  colSpan: 6,
                },
                z.record(z.string(), z.string()).optional(),
              ),

              files: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TAGS,
                  label: "app.api.system.builder.post.fields.packageFiles.title",
                  description: "app.api.system.builder.post.fields.packageFiles.description",
                  placeholder: "dist, README.md, LICENSE",
                  optional: true,
                  icon: "files",
                  colSpan: 6,
                },
                z.array(z.string()).optional(),
              ),

              keywords: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TAGS,
                  label: "app.api.system.builder.post.fields.packageKeywords.title",
                  description: "app.api.system.builder.post.fields.packageKeywords.description",
                  placeholder: "typescript, build, vite",
                  optional: true,
                  icon: "hash",
                  colSpan: 6,
                },
                z.array(z.string()).optional(),
              ),

              license: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageLicense.title",
                  description: "app.api.system.builder.post.fields.packageLicense.description",
                  placeholder: "MIT",
                  optional: true,
                  icon: "scale",
                  colSpan: 6,
                },
                z.string().optional(),
              ),

              repository: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.builder.post.fields.packageRepository.title",
                  description: "app.api.system.builder.post.fields.packageRepository.description",
                  placeholder: "https://github.com/user/repo",
                  optional: true,
                  icon: "github",
                  colSpan: 6,
                },
                z.union([
                  z.string(),
                  z.object({ type: z.string(), url: z.string() }),
                ]).optional(),
              ),
            },
          ),
        },
      ),

      // ========================================================================
      // RESPONSE FIELDS
      // ========================================================================
      success: responseField(
        {
          type: WidgetType.STATUS_INDICATOR,
          status: "success",
          label: "app.api.system.builder.post.fields.success.title",
          icon: "check-circle",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.CODE_OUTPUT,
          content: "app.api.system.builder.post.fields.buildOutput.title",
          language: "plaintext",
          icon: "terminal",
        },
        z.string(),
      ),

      duration: responseField(
        {
          type: WidgetType.STAT,
          content: "app.api.system.builder.post.fields.duration.title",
          icon: "clock",
          suffix: "ms",
        },
        z.coerce.number(),
      ),

      filesBuilt: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          items: [],
          optional: true,
          icon: "file-check",
        },
        z.string(),
      ),

      filesCopied: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          items: [],
          optional: true,
          icon: "file-copy",
        },
        z.string(),
      ),

      packageJson: responseField(
        {
          type: WidgetType.CODE_OUTPUT,
          content: "app.api.system.builder.post.fields.packageJson.title",
          language: "json",
          optional: true,
          icon: "file-json",
        },
        z.string().optional(),
      ),

      profileUsed: responseField(
        {
          type: WidgetType.BADGE,
          content: "app.api.system.builder.post.fields.profileUsed.title",
          optional: true,
          icon: "layers",
        },
        BuildProfileSchema.optional(),
      ),

      cacheStats: responseField(
        {
          type: WidgetType.STATS_GRID,
          columns: [
            { key: "hits", label: "Cache Hits" },
            { key: "misses", label: "Cache Misses" },
            { key: "hitRate", label: "Hit Rate" },
            { key: "timeSaved", label: "Time Saved" },
          ],
          optional: true,
          icon: "database",
        },
        z.object({
          hits: z.coerce.number(),
          misses: z.coerce.number(),
          hitRate: z.string(),
          timeSaved: z.coerce.number(),
        }).optional(),
      ),

      reportPath: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.builder.post.fields.reportPath.title",
        },
        z.string().optional(),
      ),

      stepTimings: responseArrayOptionalField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            { key: "step", label: "Step" },
            { key: "duration", label: "Duration (ms)" },
            { key: "status", label: "Status" },
            { key: "filesAffected", label: "Files" },
          ],
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
            step: responseField(
              { type: WidgetType.TEXT, content: "Step", icon: "chevron-right" },
              z.string(),
            ),
            duration: responseField(
              { type: WidgetType.STAT, label: "Duration", icon: "clock", suffix: "ms" },
              z.coerce.number(),
            ),
            status: responseField(
              { type: WidgetType.BADGE, label: "Status", icon: "activity" },
              StepStatusSchema,
            ),
            filesAffected: responseField(
              { type: WidgetType.STAT, label: "Files", optional: true, icon: "files" },
              z.coerce.number().optional(),
            ),
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
      description: "app.api.system.builder.post.errors.unauthorized.description",
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
      description: "app.api.system.builder.post.errors.unsavedChanges.description",
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
  return type === BunBuildTypeEnum.EXECUTABLE;
}
