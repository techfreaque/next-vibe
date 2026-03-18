/**
 * Builder Endpoint Definition
 * Single source of truth for all builder types and configuration
 *
 * This definition supports:
 * - Vite builds: react-tailwind, react, vanilla
 * - Bun builds: executable
 */

import type { BunPlugin } from "bun";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  responseArrayOptionalField,
  objectField,
  objectOptionalField,
  requestDataArrayOptionalField,
  requestField,
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

import {
  BuildProfileEnum,
  BuildProfileOptions,
  BuildTypeOptions,
  BunBuildTypeEnum,
  BunTargetEnum,
  BunTargetOptions,
  OutputFormatEnum,
  OutputFormatOptions,
  SourcemapModeEnum,
  SourcemapModeOptions,
  StepStatusEnum,
  ViteBuildTypeEnum,
  ViteLibFormatEnum,
  ViteLibFormatOptions,
  ViteMinifyOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

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
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "builder"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tags.build", "tags.npm", "tags.vite"],
  icon: "package",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["builder", "package", "bundle"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // ========================================================================
      // CONFIG FILE PATH
      // ========================================================================
      configPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.configPath.title",
        description: "post.fields.configPath.description",
        placeholder: "post.fields.configPath.placeholder",
        icon: "file-code",
        colSpan: 12,
        schema: z.string().optional().default("build.config.ts"),
      }),

      // ========================================================================
      // CONFIG OBJECT - Full inline build configuration
      // ========================================================================
      configObject: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "post.fields.configObject.title",
        description: "post.fields.configObject.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        optional: true,
        icon: "settings",
        defaultExpanded: true,
        usage: { request: "data" },
        children: {
          // ==================================================================
          // RUNTIME OPTIONS SECTION
          // ==================================================================
          profile: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.fields.profile.title",
            description: "post.fields.profile.description",
            options: BuildProfileOptions,
            optional: true,
            icon: "layers",
            colSpan: 4,
            schema: z.enum(BuildProfileEnum).optional(),
          }),

          dryRun: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.dryRun.title",
            description: "post.fields.dryRun.description",
            optional: true,
            icon: "eye",
            colSpan: 4,
            schema: z.boolean().optional(),
          }),

          verbose: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.verbose.title",
            description: "post.fields.verbose.description",
            optional: true,
            icon: "terminal",
            colSpan: 4,
            schema: z.boolean().optional(),
          }),

          analyze: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.analyze.title",
            description: "post.fields.analyze.description",
            optional: true,
            icon: "bar-chart-2",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          watch: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.watch.title",
            description: "post.fields.watch.description",
            optional: true,
            icon: "refresh-cw",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          parallel: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.parallel.title",
            description: "post.fields.parallel.description",
            optional: true,
            icon: "git-branch",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          report: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.report.title",
            description: "post.fields.report.description",
            optional: true,
            icon: "file-text",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          minify: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "post.fields.minify.title",
            description: "post.fields.minify.description",
            optional: true,
            icon: "minimize-2",
            colSpan: 3,
            schema: z.boolean().optional(),
          }),

          // ==================================================================
          // FOLDERS TO CLEAN
          // ==================================================================
          foldersToClean: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TAGS,
            label: "post.fields.foldersToClean.title",
            description: "post.fields.foldersToClean.description",
            placeholder: "post.fields.foldersToClean.placeholder",
            optional: true,
            icon: "trash-2",
            colSpan: 12,
            schema: z.array(z.string()).optional(),
          }),

          // ==================================================================
          // FILES TO COMPILE
          // ==================================================================
          filesToCompile: requestDataArrayOptionalField(
            scopedTranslation,
            {
              type: WidgetType.CONTAINER,
              title: "post.fields.filesToCompile.title",
              description: "post.fields.filesToCompile.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "code" as const,
            },
            objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "post.fields.fileToCompile.title",
              layoutType: LayoutType.GRID,
              columns: 12,
              icon: "file",
              usage: { request: "data" },
              children: {
                input: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "post.fields.input.title",
                  description: "post.fields.input.description",
                  placeholder: "post.fields.input.placeholder",
                  icon: "file-input",
                  colSpan: 6,
                  schema: z.string(),
                }),

                output: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "post.fields.output.title",
                  description: "post.fields.output.description",
                  placeholder: "post.fields.output.placeholder",
                  icon: "file-output",
                  colSpan: 6,
                  schema: z.string(),
                }),

                type: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label: "post.fields.type.title",
                  description: "post.fields.type.description",
                  options: BuildTypeOptions,
                  icon: "box",
                  colSpan: 6,
                  schema: z.union([
                    z.enum(ViteBuildTypeEnum),
                    z.enum(BunBuildTypeEnum),
                  ]),
                }),

                modulesToExternalize: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TAGS,
                  label: "post.fields.modulesToExternalize.title",
                  description: "post.fields.modulesToExternalize.description",
                  placeholder: "post.fields.modulesToExternalize.placeholder",
                  optional: true,
                  icon: "package",
                  colSpan: 6,
                  schema: z.array(z.string()).optional(),
                }),

                // Vite-specific options
                inlineCss: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "post.fields.inlineCss.title",
                  description: "post.fields.inlineCss.description",
                  optional: true,
                  icon: "paintbrush",
                  colSpan: 4,
                  schema: z.boolean().optional(),
                }),

                bundleReact: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "post.fields.bundleReact.title",
                  description: "post.fields.bundleReact.description",
                  optional: true,
                  icon: "atom",
                  colSpan: 4,
                  schema: z.boolean().optional(),
                }),

                // Package config for library builds
                packageConfig: objectOptionalField(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "post.fields.packageConfig.title",
                  description: "post.fields.packageConfig.description",
                  layoutType: LayoutType.GRID,
                  columns: 12,
                  optional: true,
                  icon: "package",
                  usage: { request: "data" },
                  children: {
                    isPackage: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.isPackage.title",
                      description: "post.fields.isPackage.description",
                      colSpan: 4,
                      schema: z.literal(true),
                    }),

                    dtsInclude: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TAGS,
                      label: "post.fields.dtsInclude.title",
                      description: "post.fields.dtsInclude.description",
                      placeholder: "post.fields.dtsInclude.placeholder",
                      icon: "file-type",
                      colSpan: 8,
                      schema: z.array(z.string()),
                    }),

                    dtsEntryRoot: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "post.fields.dtsEntryRoot.title",
                      description: "post.fields.dtsEntryRoot.description",
                      placeholder: "post.fields.dtsEntryRoot.placeholder",
                      icon: "folder",
                      colSpan: 12,
                      schema: z.string(),
                    }),
                  },
                }),

                // Bun-specific options
                bunOptions: objectOptionalField(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "post.fields.bunOptions.title",
                  description: "post.fields.bunOptions.description",
                  layoutType: LayoutType.GRID,
                  columns: 12,
                  optional: true,
                  icon: "zap",
                  usage: { request: "data" },
                  children: {
                    target: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label: "post.fields.bunTarget.title",
                      description: "post.fields.bunTarget.description",
                      options: BunTargetOptions,
                      optional: true,
                      icon: "target",
                      colSpan: 4,
                      schema: z.enum(BunTargetEnum).optional(),
                    }),

                    minify: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.bunMinify.title",
                      description: "post.fields.bunMinify.description",
                      optional: true,
                      icon: "minimize-2",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    sourcemap: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label: "post.fields.sourcemap.title",
                      description: "post.fields.sourcemap.description",
                      options: SourcemapModeOptions,
                      optional: true,
                      icon: "map",
                      colSpan: 4,
                      schema: z.enum(SourcemapModeEnum).optional(),
                    }),

                    external: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TAGS,
                      label: "post.fields.external.title",
                      description: "post.fields.external.description",
                      placeholder: "post.fields.external.placeholder",
                      optional: true,
                      icon: "external-link",
                      colSpan: 12,
                      schema: z.array(z.string()).optional(),
                    }),

                    define: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.define.title",
                      description: "post.fields.define.description",
                      placeholder: "post.fields.define.placeholder",
                      optional: true,
                      icon: "code",
                      colSpan: 12,
                      schema: z.record(z.string(), z.string()).optional(),
                    }),

                    splitting: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.splitting.title",
                      description: "post.fields.splitting.description",
                      optional: true,
                      icon: "git-branch",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    format: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label: "post.fields.format.title",
                      description: "post.fields.format.description",
                      options: OutputFormatOptions,
                      optional: true,
                      icon: "file-code",
                      colSpan: 4,
                      schema: z.enum(OutputFormatEnum).optional(),
                    }),

                    bytecode: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.bytecode.title",
                      description: "post.fields.bytecode.description",
                      optional: true,
                      icon: "binary",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    banner: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXTAREA,
                      label: "post.fields.banner.title",
                      description: "post.fields.banner.description",
                      placeholder: "post.fields.banner.placeholder",
                      optional: true,
                      icon: "chevron-up",
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    footer: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXTAREA,
                      label: "post.fields.footer.title",
                      description: "post.fields.footer.description",
                      placeholder: "post.fields.footer.placeholder",
                      optional: true,
                      icon: "chevron-down",
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    // Advanced Bun options (passthrough to Bun.build)
                    publicPath: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "post.fields.publicPath.label",
                      description: "post.fields.publicPath.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    naming: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.naming.label",
                      description: "post.fields.naming.description",
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

                    root: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "post.fields.root.label",
                      description: "post.fields.root.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    conditions: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.conditions.label",
                      description: "post.fields.conditions.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.array(z.string()).optional(),
                    }),

                    loader: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.loader.label",
                      description: "post.fields.loader.description",
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

                    drop: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.drop.label",
                      description: "post.fields.drop.description",
                      optional: true,
                      colSpan: 6,
                      schema: z.array(z.string()).optional(),
                    }),
                  },
                }),

                // Vite advanced options
                viteOptions: objectOptionalField(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "post.fields.viteOptions.title",
                  description: "post.fields.viteOptions.description",
                  layoutType: LayoutType.GRID,
                  columns: 12,
                  optional: true,
                  icon: "bot",
                  usage: { request: "data" },
                  children: {
                    target: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TAGS,
                      label: "post.fields.viteTarget.title",
                      description: "post.fields.viteTarget.description",
                      placeholder: "post.fields.viteTarget.placeholder",
                      optional: true,
                      icon: "target",
                      colSpan: 6,
                      schema: z
                        .union([z.string(), z.array(z.string())])
                        .optional(),
                    }),

                    outDir: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "post.fields.viteOutDir.title",
                      description: "post.fields.viteOutDir.description",
                      placeholder: "post.fields.viteOutDir.placeholder",
                      optional: true,
                      icon: "folder-output",
                      colSpan: 6,
                      schema: z.string().optional(),
                    }),

                    assetsDir: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "post.fields.viteAssetsDir.title",
                      description: "post.fields.viteAssetsDir.description",
                      placeholder: "post.fields.viteAssetsDir.placeholder",
                      optional: true,
                      icon: "folder",
                      colSpan: 4,
                      schema: z.string().optional(),
                    }),

                    assetsInlineLimit: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.NUMBER,
                      label: "post.fields.viteAssetsInlineLimit.title",
                      description:
                        "post.fields.viteAssetsInlineLimit.description",
                      placeholder:
                        "post.fields.viteAssetsInlineLimit.placeholder",
                      optional: true,
                      icon: "file-image",
                      colSpan: 4,
                      schema: z.number().optional(),
                    }),

                    chunkSizeWarningLimit: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.NUMBER,
                      label: "post.fields.viteChunkSizeWarningLimit.title",
                      description:
                        "post.fields.viteChunkSizeWarningLimit.description",
                      placeholder:
                        "post.fields.viteChunkSizeWarningLimit.placeholder",
                      optional: true,
                      icon: "alert-triangle",
                      colSpan: 4,
                      schema: z.number().optional(),
                    }),

                    cssCodeSplit: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.viteCssCodeSplit.title",
                      description: "post.fields.viteCssCodeSplit.description",
                      optional: true,
                      icon: "scissors",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    sourcemap: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label: "post.fields.viteSourcemap.title",
                      description: "post.fields.viteSourcemap.description",
                      options: [
                        {
                          value: "true",
                          label: "enums.viteSourcemap.true",
                        },
                        {
                          value: "false",
                          label: "enums.viteSourcemap.false",
                        },
                        {
                          value: "inline",
                          label: "enums.viteSourcemap.inline",
                        },
                        {
                          value: "hidden",
                          label: "enums.viteSourcemap.hidden",
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

                    minify: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.SELECT,
                      label: "post.fields.viteMinify.title",
                      description: "post.fields.viteMinify.description",
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

                    emptyOutDir: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.viteEmptyOutDir.title",
                      description: "post.fields.viteEmptyOutDir.description",
                      optional: true,
                      icon: "trash",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    reportCompressedSize: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.viteReportCompressedSize.title",
                      description:
                        "post.fields.viteReportCompressedSize.description",
                      optional: true,
                      icon: "archive",
                      colSpan: 4,
                      schema: z.boolean().optional(),
                    }),

                    manifest: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.BOOLEAN,
                      label: "post.fields.viteManifest.title",
                      description: "post.fields.viteManifest.description",
                      optional: true,
                      icon: "list",
                      colSpan: 4,
                      schema: z.union([z.boolean(), z.string()]).optional(),
                    }),

                    // Library mode options
                    lib: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "post.fields.viteLib.title",
                      description: "post.fields.viteLib.description",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      icon: "library",
                      usage: { request: "data" },
                      children: {
                        entry: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "post.fields.viteLibEntry.title",
                          description: "post.fields.viteLibEntry.description",
                          placeholder: "post.fields.viteLibEntry.placeholder",
                          icon: "file-input",
                          colSpan: 6,
                          schema: z.union([
                            z.string(),
                            z.array(z.string()),
                            z.record(z.string(), z.string()),
                          ]),
                        }),

                        name: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "post.fields.viteLibName.title",
                          description: "post.fields.viteLibName.description",
                          placeholder: "post.fields.viteLibName.placeholder",
                          optional: true,
                          icon: "tag",
                          colSpan: 6,
                          schema: z.string().optional(),
                        }),

                        formats: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.MULTISELECT,
                          label: "post.fields.viteLibFormats.title",
                          description: "post.fields.viteLibFormats.description",
                          options: ViteLibFormatOptions,
                          optional: true,
                          icon: "file-code",
                          colSpan: 6,
                          schema: z.array(z.enum(ViteLibFormatEnum)).optional(),
                        }),

                        fileName: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "post.fields.viteLibFileName.title",
                          description:
                            "post.fields.viteLibFileName.description",
                          placeholder:
                            "post.fields.viteLibFileName.placeholder",
                          optional: true,
                          icon: "file",
                          colSpan: 6,
                          schema: z.string().optional(),
                        }),
                      },
                    }),

                    // Rollup options subset
                    rollupOptions: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "post.fields.viteRollupOptions.title",
                      description: "post.fields.viteRollupOptions.description",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      icon: "package",
                      usage: { request: "data" },
                      children: {
                        external: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TAGS,
                          label: "post.fields.rollupExternal.title",
                          description: "post.fields.rollupExternal.description",
                          placeholder: "post.fields.rollupExternal.placeholder",
                          optional: true,
                          icon: "external-link",
                          colSpan: 12,
                          schema: z
                            .union([z.string(), z.array(z.string())])
                            .optional(),
                        }),

                        treeshake: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "post.fields.rollupTreeshake.title",
                          description:
                            "post.fields.rollupTreeshake.description",
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

                        output: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.JSON,
                          label: "post.fields.rollupOutput.label",
                          description: "post.fields.rollupOutput.description",
                          optional: true,
                          icon: "file-output",
                          colSpan: 12,
                          schema: z.record(z.string(), z.unknown()).optional(),
                        }),
                      },
                    }),

                    // Path to tsconfig for vite-tsconfig-paths (SPA mode)
                    tsconfigPath: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "post.fields.viteTsconfigPath.title",
                      description: "post.fields.viteTsconfigPath.description",
                      placeholder: "post.fields.viteTsconfigPath.placeholder",
                      optional: true,
                      icon: "file-json",
                      colSpan: 12,
                      schema: z.string().optional(),
                    }),

                    // Module aliases: maps import specifier → resolved file path.
                    // Applied as resolve.alias in Vite (works for both client and SSR runner).
                    // Example: { "next/navigation": "src/packages/next-vibe-ui/tanstack/hooks/use-navigation.tsx" }
                    moduleAliases: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.viteModuleAliases.label",
                      description: "post.fields.viteModuleAliases.description",
                      optional: true,
                      icon: "arrow-right-left",
                      colSpan: 12,
                      schema: z.record(z.string(), z.string()).optional(),
                    }),

                    // Raw plugins passthrough (for programmatic config files)
                    plugins: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.vitePlugins.label",
                      description: "post.fields.vitePlugins.description",
                      optional: true,
                      icon: "plug",
                      colSpan: 12,
                      schema: z.array(z.unknown()).optional(),
                    }),

                    // Raw build options passthrough
                    build: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.JSON,
                      label: "post.fields.viteBuild.label",
                      description: "post.fields.viteBuild.description",
                      optional: true,
                      icon: "settings",
                      colSpan: 12,
                      schema: z.record(z.string(), z.unknown()).optional(),
                    }),
                  },
                }),
              },
            }),
          ),

          // ==================================================================
          // FILES/FOLDERS TO COPY
          // ==================================================================
          filesOrFoldersToCopy: requestDataArrayOptionalField(
            scopedTranslation,
            {
              type: WidgetType.CONTAINER,
              title: "post.fields.filesOrFoldersToCopy.title",
              description: "post.fields.filesOrFoldersToCopy.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
              icon: "copy" as const,
            },
            objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "post.fields.copyConfig.title",
              layoutType: LayoutType.GRID,
              columns: 12,
              icon: "copy",
              usage: { request: "data" },
              children: {
                input: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "post.fields.copyInput.title",
                  description: "post.fields.copyInput.description",
                  placeholder: "post.fields.copyInput.placeholder",
                  icon: "file-input",
                  colSpan: 5,
                  schema: z.string(),
                }),

                output: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "post.fields.copyOutput.title",
                  description: "post.fields.copyOutput.description",
                  placeholder: "post.fields.copyOutput.placeholder",
                  icon: "file-output",
                  colSpan: 5,
                  schema: z.string(),
                }),

                pattern: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "post.fields.copyPattern.title",
                  description: "post.fields.copyPattern.description",
                  placeholder: "post.fields.copyPattern.placeholder",
                  optional: true,
                  icon: "filter",
                  colSpan: 2,
                  schema: z.string().optional(),
                }),
              },
            }),
          ),

          // ==================================================================
          // NPM PACKAGE CONFIGURATION
          // ==================================================================
          npmPackage: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "post.fields.npmPackage.title",
            description: "post.fields.npmPackage.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            optional: true,
            icon: "package",
            defaultExpanded: false,
            usage: { request: "data" },
            children: {
              name: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageName.title",
                description: "post.fields.packageName.description",
                placeholder: "post.fields.packageName.placeholder",
                icon: "package",
                colSpan: 6,
                schema: z.string(),
              }),

              version: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageVersion.title",
                description: "post.fields.packageVersion.description",
                placeholder: "post.fields.packageVersion.placeholder",
                optional: true,
                icon: "tag",
                colSpan: 6,
                schema: z.string().optional(),
              }),

              description: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXTAREA,
                label: "post.fields.packageDescription.title",
                description: "post.fields.packageDescription.description",
                placeholder: "post.fields.packageDescription.placeholder",
                optional: true,
                icon: "text",
                colSpan: 12,
                schema: z.string().optional(),
              }),

              main: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageMain.title",
                description: "post.fields.packageMain.description",
                placeholder: "post.fields.packageMain.placeholder",
                optional: true,
                icon: "file-code",
                colSpan: 4,
                schema: z.string().optional(),
              }),

              module: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageModule.title",
                description: "post.fields.packageModule.description",
                placeholder: "post.fields.packageModule.placeholder",
                optional: true,
                icon: "file-code-2",
                colSpan: 4,
                schema: z.string().optional(),
              }),

              types: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageTypes.title",
                description: "post.fields.packageTypes.description",
                placeholder: "post.fields.packageTypes.placeholder",
                optional: true,
                icon: "file-type",
                colSpan: 4,
                schema: z.string().optional(),
              }),

              bin: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label: "post.fields.packageBin.title",
                description: "post.fields.packageBin.description",
                placeholder: "post.fields.packageBin.placeholder",
                optional: true,
                icon: "terminal",
                colSpan: 12,
                schema: z.record(z.string(), z.string()).optional(),
              }),

              exports: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label: "post.fields.packageExports.title",
                description: "post.fields.packageExports.description",
                placeholder: "post.fields.packageExports.placeholder",
                optional: true,
                icon: "share-2",
                colSpan: 12,
                schema: z
                  .record(z.string(), PackageExportConditionSchema)
                  .optional(),
              }),

              dependencies: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label: "post.fields.packageDependencies.title",
                description: "post.fields.packageDependencies.description",
                placeholder: "post.fields.packageDependencies.placeholder",
                optional: true,
                icon: "package",
                colSpan: 6,
                schema: z.record(z.string(), z.string()).optional(),
              }),

              peerDependencies: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.JSON,
                label: "post.fields.packagePeerDependencies.title",
                description: "post.fields.packagePeerDependencies.description",
                placeholder: "post.fields.packagePeerDependencies.placeholder",
                optional: true,
                icon: "users",
                colSpan: 6,
                schema: z.record(z.string(), z.string()).optional(),
              }),

              files: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TAGS,
                label: "post.fields.packageFiles.title",
                description: "post.fields.packageFiles.description",
                placeholder: "post.fields.packageFiles.placeholder",
                optional: true,
                icon: "folder",
                colSpan: 6,
                schema: z.array(z.string()).optional(),
              }),

              keywords: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TAGS,
                label: "post.fields.packageKeywords.title",
                description: "post.fields.packageKeywords.description",
                placeholder: "post.fields.packageKeywords.placeholder",
                optional: true,
                icon: "hash",
                colSpan: 6,
                schema: z.array(z.string()).optional(),
              }),

              license: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageLicense.title",
                description: "post.fields.packageLicense.description",
                placeholder: "post.fields.packageLicense.placeholder",
                optional: true,
                icon: "scale",
                colSpan: 6,
                schema: z.string().optional(),
              }),

              repository: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageRepository.title",
                description: "post.fields.packageRepository.description",
                placeholder: "post.fields.packageRepository.placeholder",
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

              outputDir: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "post.fields.packageOutputDir.title",
                description: "post.fields.packageOutputDir.description",
                placeholder: "post.fields.packageOutputDir.placeholder",
                optional: true,
                icon: "folder-output",
                colSpan: 12,
                schema: z.string().optional(),
              }),
            },
          }),
        },
      }),

      // ========================================================================
      // RESPONSE FIELDS
      // ========================================================================
      success: responseField(scopedTranslation, {
        type: WidgetType.STATUS_INDICATOR,
        status: "success",
        label: "post.fields.success.title",
        icon: "check-circle",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.CODE_OUTPUT,
        content: "post.fields.buildOutput.title",
        language: "plaintext",
        icon: "terminal",
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.STAT,
        content: "post.fields.duration.title",
        icon: "clock",
        suffix: "ms",
        schema: z.coerce.number(),
      }),

      filesBuilt: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        items: [],
        optional: true,
        icon: "check-circle",
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          content: "post.fields.filesBuilt.item",
          schema: z.string(),
        }),
      }),

      filesCopied: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        items: [],
        optional: true,
        icon: "copy",
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          content: "post.fields.filesCopied.item",
          schema: z.string(),
        }),
      }),

      packageJson: responseField(scopedTranslation, {
        type: WidgetType.CODE_OUTPUT,
        content: "post.fields.packageJson.title",
        language: "json",
        optional: true,
        icon: "file-json",
        schema: z.string().optional(),
      }),

      profileUsed: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.fields.profileUsed.title",
        optional: true,
        icon: "layers",
        schema: z.enum(BuildProfileEnum).optional(),
      }),

      reportPath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.reportPath.title",
        schema: z.string().optional(),
      }),

      stepTimings: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        optional: true,
        icon: "list",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            step: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.fields.stepTimings.step",
              icon: "chevron-right",
              schema: z.string(),
            }),
            duration: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "post.fields.stepTimings.duration",
              icon: "clock",
              suffix: "ms",
              schema: z.coerce.number(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              label: "post.fields.stepTimings.status",
              icon: "activity",
              schema: z.enum(StepStatusEnum),
            }),
            filesAffected: responseField(scopedTranslation, {
              type: WidgetType.STAT,
              label: "post.fields.stepTimings.filesAffected",
              optional: true,
              icon: "folder",
              schema: z.coerce.number().optional(),
            }),
          },
        }),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
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

/** Bun build options type inferred from API definition, extended with runtime-only fields */
export type BunBuildOptions = NonNullable<FileToCompile["bunOptions"]> & {
  /** Bun build plugins — programmatic only, not serializable via API */
  plugins?: BunPlugin[];
};

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

/** FileToCompile with runtime-only fields (plugins) */
export type FileToCompileWithPlugins = Omit<FileToCompile, "bunOptions"> & {
  bunOptions?: BunBuildOptions;
};

/** Full BuildConfig type - API config + runtime-only fields (hooks, env, profiles) */
export interface BuildConfig extends Omit<
  ApiConfigObject,
  "filesToCompile" | "filesOrFoldersToCopy" | "npmPackage"
> {
  foldersToClean?: string[];
  filesToCompile?: FileToCompileWithPlugins[];
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
