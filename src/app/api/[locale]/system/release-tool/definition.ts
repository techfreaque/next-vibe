/**
 * Release Tool Endpoint Definition
 * Single source of truth for all release tool types and configuration
 *
 * Supports:
 * - Local development releases with interactive prompts
 * - CI/CD pipeline releases (GitHub Actions, GitLab CI, etc.)
 * - Monorepo and multi-package releases
 * - NPM, JSR, and GitHub/GitLab releases
 * - Version bumping (semver + prereleases)
 * - Changelog generation
 * - Asset zipping and uploading
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
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

// ============================================================================
// Shared Enums/Schemas (minimal - used only for select options)
// ============================================================================

/** Package manager options */
const PackageManagerSchema = z.enum(["npm", "yarn", "pnpm", "deno", "bun"]);

/** Version increment types */
const VersionIncrementSchema = z.enum([
  "patch",
  "minor",
  "major",
  "prepatch",
  "preminor",
  "premajor",
  "prerelease",
]);

/** NPM access levels */
const NpmAccessSchema = z.enum(["public", "restricted"]);

/** Webhook notification types */
const WebhookTypeSchema = z.enum(["slack", "discord", "teams", "custom"]);

/** Changelog presets */
const ChangelogPresetSchema = z.enum([
  "conventional-commits",
  "angular",
  "atom",
  "eslint",
  "ember",
]);

/** CI providers */
const CIProviderSchema = z.enum([
  "github",
  "gitlab",
  "jenkins",
  "circleci",
  "travis",
  "azure",
  "bitbucket",
  "drone",
  "buildkite",
  "woodpecker",
  "teamcity",
  "codeship",
  "appveyor",
  "codebuild",
  "cloudbuild",
  "semaphore",
  "buddy",
  "render",
  "vercel",
  "netlify",
  "unknown",
]);

/** Package status */
const PackageStatusSchema = z.enum(["success", "skipped", "failed"]);

// ============================================================================
// Endpoint Definition
// ============================================================================

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "release-tool"],
  title: "app.api.system.releaseTool.title",
  description: "app.api.system.releaseTool.description",
  category: "app.api.system.releaseTool.category",
  tags: ["app.api.system.releaseTool.tags.release"],
  icon: "rocket",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],
  aliases: ["release", "pub", "publish"],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.releaseTool.form.title",
      description: "app.api.system.releaseTool.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // ========================================================================
      // REQUEST FIELDS - Runtime options at root level for CLI access
      // ========================================================================

      configPath: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.releaseTool.fields.configPath.title",
        description: "app.api.system.releaseTool.fields.configPath.description",
        schema: z.string().optional().default("release.config.ts"),
      }),

      // ========================================================================
      // Runtime options (CLI flags) - at root level for direct CLI access
      // ========================================================================
      ci: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.ci.title",
        description: "app.api.system.releaseTool.fields.ci.description",
        schema: z.boolean().optional().default(false),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.dryRun.title",
        description: "app.api.system.releaseTool.fields.dryRun.description",
        schema: z.boolean().optional().default(false),
      }),

      verbose: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.verbose.title",
        description: "app.api.system.releaseTool.fields.verbose.description",
        schema: z.boolean().optional().default(false),
      }),

      forceUpdate: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.forceUpdate.title",
        description:
          "app.api.system.releaseTool.fields.forceUpdate.description",
        schema: z.boolean().optional(), // No default - undefined means "ask user",
      }),

      // Skip options
      skipLint: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipLint.title",
        description: "app.api.system.releaseTool.fields.skipLint.description",
        schema: z.boolean().optional().default(false),
      }),

      skipTypecheck: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipTypecheck.title",
        description:
          "app.api.system.releaseTool.fields.skipTypecheck.description",
        schema: z.boolean().optional().default(false),
      }),

      skipBuild: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipBuild.title",
        description: "app.api.system.releaseTool.fields.skipBuild.description",
        schema: z.boolean().optional().default(false),
      }),

      skipTests: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipTests.title",
        description: "app.api.system.releaseTool.fields.skipTests.description",
        schema: z.boolean().optional().default(false),
      }),

      skipSnyk: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipSnyk.title",
        description: "app.api.system.releaseTool.fields.skipSnyk.description",
        schema: z.boolean().optional().default(false),
      }),

      skipChangelog: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipChangelog.title",
        description:
          "app.api.system.releaseTool.fields.skipChangelog.description",
        schema: z.boolean().optional().default(false),
      }),

      skipGitTag: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipGitTag.title",
        description: "app.api.system.releaseTool.fields.skipGitTag.description",
        schema: z.boolean().optional().default(false),
      }),

      skipGitPush: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipGitPush.title",
        description:
          "app.api.system.releaseTool.fields.skipGitPush.description",
        schema: z.boolean().optional().default(false),
      }),

      skipInstall: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipInstall.title",
        description:
          "app.api.system.releaseTool.fields.skipInstall.description",
        schema: z.boolean().optional().default(false),
      }),

      skipClean: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "app.api.system.releaseTool.fields.skipClean.title",
        description: "app.api.system.releaseTool.fields.skipClean.description",
        schema: z.boolean().optional().default(false),
      }),

      // Version options
      versionIncrement: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "app.api.system.releaseTool.fields.versionIncrement.title",
        description:
          "app.api.system.releaseTool.fields.versionIncrement.description",
        options: [
          {
            value: "patch",
            label: "app.api.system.releaseTool.enums.versionIncrement.patch",
          },
          {
            value: "minor",
            label: "app.api.system.releaseTool.enums.versionIncrement.minor",
          },
          {
            value: "major",
            label: "app.api.system.releaseTool.enums.versionIncrement.major",
          },
          {
            value: "prepatch",
            label: "app.api.system.releaseTool.enums.versionIncrement.prepatch",
          },
          {
            value: "preminor",
            label: "app.api.system.releaseTool.enums.versionIncrement.preminor",
          },
          {
            value: "premajor",
            label: "app.api.system.releaseTool.enums.versionIncrement.premajor",
          },
          {
            value: "prerelease",
            label:
              "app.api.system.releaseTool.enums.versionIncrement.prerelease",
          },
        ],
        optional: true,
        schema: VersionIncrementSchema.optional(),
      }),

      prereleaseId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.releaseTool.fields.prereleaseId.title",
        description:
          "app.api.system.releaseTool.fields.prereleaseId.description",
        optional: true,
        schema: z.string().optional(),
      }),

      targetPackage: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.releaseTool.fields.targetPackage.title",
        description:
          "app.api.system.releaseTool.fields.targetPackage.description",
        optional: true,
        schema: z.string().optional(),
      }),

      commitMessage: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.system.releaseTool.fields.commitMessage.title",
        description:
          "app.api.system.releaseTool.fields.commitMessage.description",
        optional: true,
        schema: z.string().optional(),
      }),

      // ========================================================================
      // CONFIG OBJECT - Contains release configuration (not runtime flags)
      // ========================================================================
      configObject: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.fields.configObject.title",
          description:
            "app.api.system.releaseTool.fields.configObject.description",
          layoutType: LayoutType.GRID,
          columns: 12,
          optional: true,
        },
        { request: "data" },
        {
          packageManager: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "app.api.system.releaseTool.fields.packageManager.title",
            description:
              "app.api.system.releaseTool.fields.packageManager.description",
            options: [
              {
                value: "bun",
                label: "app.api.system.releaseTool.enums.packageManager.bun",
              },
              {
                value: "npm",
                label: "app.api.system.releaseTool.enums.packageManager.npm",
              },
              {
                value: "yarn",
                label: "app.api.system.releaseTool.enums.packageManager.yarn",
              },
              {
                value: "pnpm",
                label: "app.api.system.releaseTool.enums.packageManager.pnpm",
              },
              {
                value: "deno",
                label: "app.api.system.releaseTool.enums.packageManager.deno",
              },
            ],
            schema: PackageManagerSchema.optional().default("bun"),
          }),

          globalVersion: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.system.releaseTool.fields.globalVersion.title",
            description:
              "app.api.system.releaseTool.fields.globalVersion.description",
            optional: true,
            schema: z.string().optional(),
          }),

          parallel: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.releaseTool.fields.parallel.title",
            description:
              "app.api.system.releaseTool.fields.parallel.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          maxParallelJobs: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "app.api.system.releaseTool.fields.maxParallelJobs.title",
            description:
              "app.api.system.releaseTool.fields.maxParallelJobs.description",
            optional: true,
            schema: z.coerce.number().optional(),
          }),

          continueOnError: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.releaseTool.fields.continueOnError.title",
            description:
              "app.api.system.releaseTool.fields.continueOnError.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          verifyGitStatus: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.releaseTool.fields.verifyGitStatus.title",
            description:
              "app.api.system.releaseTool.fields.verifyGitStatus.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          requireCleanWorkingDir: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label:
              "app.api.system.releaseTool.fields.requireCleanWorkingDir.title",
            description:
              "app.api.system.releaseTool.fields.requireCleanWorkingDir.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          verifyLockfile: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "app.api.system.releaseTool.fields.verifyLockfile.title",
            description:
              "app.api.system.releaseTool.fields.verifyLockfile.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          // Branch configuration
          branch: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.releaseTool.fields.branch.title",
              description:
                "app.api.system.releaseTool.fields.branch.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
            },
            { request: "data" },
            {
              main: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.releaseTool.fields.branchMain.title",
                schema: z.string().optional().default("main"),
              }),
              develop: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.releaseTool.fields.branchDevelop.title",
                optional: true,
                schema: z.string().optional(),
              }),
              allowNonMain: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "app.api.system.releaseTool.fields.allowNonMain.title",
                schema: z.boolean().optional().default(false),
              }),
              protected: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.system.releaseTool.fields.protectedBranches.title",
                optional: true,
                schema: z.array(z.string()).optional(),
              }),
            },
          ),

          // Notifications configuration
          notifications: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.releaseTool.fields.notifications.title",
              description:
                "app.api.system.releaseTool.fields.notifications.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
            },
            { request: "data" },
            {
              enabled: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label:
                  "app.api.system.releaseTool.fields.notificationsEnabled.title",
                schema: z.boolean().optional().default(false),
              }),
              webhookUrl: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.releaseTool.fields.webhookUrl.title",
                optional: true,
                schema: z.string().optional(),
              }),
              type: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "app.api.system.releaseTool.fields.webhookType.title",
                options: [
                  {
                    value: "slack",
                    label: "app.api.system.releaseTool.enums.webhookType.slack",
                  },
                  {
                    value: "discord",
                    label:
                      "app.api.system.releaseTool.enums.webhookType.discord",
                  },
                  {
                    value: "teams",
                    label: "app.api.system.releaseTool.enums.webhookType.teams",
                  },
                  {
                    value: "custom",
                    label:
                      "app.api.system.releaseTool.enums.webhookType.custom",
                  },
                ],
                optional: true,
                schema: WebhookTypeSchema.optional(),
              }),
              onSuccess: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "app.api.system.releaseTool.fields.onSuccess.title",
                schema: z.boolean().optional().default(true),
              }),
              onFailure: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "app.api.system.releaseTool.fields.onFailure.title",
                schema: z.boolean().optional().default(true),
              }),
              messageTemplate: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label:
                  "app.api.system.releaseTool.fields.messageTemplate.title",
                optional: true,
                schema: z.string().optional(),
              }),
              includeTimings: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "app.api.system.releaseTool.fields.includeTimings.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
            },
          ),

          // Retry configuration
          retry: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.releaseTool.fields.retry.title",
              description:
                "app.api.system.releaseTool.fields.retry.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
            },
            { request: "data" },
            {
              maxAttempts: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "app.api.system.releaseTool.fields.maxAttempts.title",
                schema: z.coerce.number().optional().default(3),
              }),
              delayMs: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "app.api.system.releaseTool.fields.delayMs.title",
                schema: z.coerce.number().optional().default(1000),
              }),
              backoffMultiplier: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label:
                  "app.api.system.releaseTool.fields.backoffMultiplier.title",
                schema: z.coerce.number().optional().default(2),
              }),
              maxDelayMs: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "app.api.system.releaseTool.fields.maxDelayMs.title",
                schema: z.coerce.number().optional().default(30000),
              }),
            },
          ),

          // Rollback configuration
          rollback: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.releaseTool.fields.rollback.title",
              description:
                "app.api.system.releaseTool.fields.rollback.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
            },
            { request: "data" },
            {
              enabled: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label:
                  "app.api.system.releaseTool.fields.rollbackEnabled.title",
                schema: z.boolean().optional().default(false),
              }),
              git: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "app.api.system.releaseTool.fields.rollbackGit.title",
                schema: z.boolean().optional().default(true),
              }),
              version: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label:
                  "app.api.system.releaseTool.fields.rollbackVersion.title",
                schema: z.boolean().optional().default(true),
              }),
            },
          ),

          // Packages array
          packages: requestDataArrayOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.releaseTool.fields.packages.title",
              description:
                "app.api.system.releaseTool.fields.packages.description",
              layoutType: LayoutType.GRID,
              optional: true,
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.system.releaseTool.fields.package.title",
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { request: "data" },
              {
                directory: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.directory.title",
                  schema: z.string(),
                }),
                name: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.name.title",
                  optional: true,
                  schema: z.string().optional(),
                }),
                updateDeps: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.updateDeps.title",
                  description:
                    "app.api.system.releaseTool.fields.updateDeps.description",
                  schema: z
                    .union([z.boolean(), z.literal("force")])
                    .optional()
                    .default(false),
                }),
                clean: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.clean.title",
                  description:
                    "app.api.system.releaseTool.fields.clean.description",
                  optional: true,
                  schema: z.union([z.boolean(), z.string()]).optional(),
                }),
                lint: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.lint.title",
                  description:
                    "app.api.system.releaseTool.fields.lint.description",
                  schema: z
                    .union([z.boolean(), z.string()])
                    .optional()
                    .default(true),
                }),
                typecheck: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.typecheck.title",
                  description:
                    "app.api.system.releaseTool.fields.typecheck.description",
                  optional: true,
                  schema: z.union([z.boolean(), z.string()]).optional(),
                }),
                build: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.build.title",
                  description:
                    "app.api.system.releaseTool.fields.build.description",
                  schema: z
                    .union([z.boolean(), z.string()])
                    .optional()
                    .default(true),
                }),
                test: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.test.title",
                  description:
                    "app.api.system.releaseTool.fields.test.description",
                  schema: z
                    .union([z.boolean(), z.string()])
                    .optional()
                    .default(true),
                }),
                snyk: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.releaseTool.fields.snyk.title",
                  optional: true,
                  schema: z.boolean().optional(),
                }),
                install: requestField({
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.install.title",
                  description:
                    "app.api.system.releaseTool.fields.install.description",
                  optional: true,
                  schema: z.union([z.boolean(), z.string()]).optional(),
                }),

                // Release options (nested)
                release: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.system.releaseTool.fields.release.title",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                  },
                  { request: "data" },
                  {
                    version: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.releaseVersion.title",
                      optional: true,
                      schema: z.string().optional(),
                    }),
                    tagPrefix: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.tagPrefix.title",
                      schema: z.string().optional().default("v"),
                    }),
                    tagSuffix: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.tagSuffix.title",
                      optional: true,
                      schema: z.string().optional(),
                    }),
                    prereleaseId: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.prereleaseId.title",
                      optional: true,
                      schema: z.string().optional(),
                    }),
                    ciReleaseCommand: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title:
                          "app.api.system.releaseTool.fields.ciReleaseCommand.title",
                        description:
                          "app.api.system.releaseTool.fields.ciReleaseCommand.description",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                      },
                      { request: "data" },
                      {
                        command: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.ciCommand.title",
                          description:
                            "app.api.system.releaseTool.fields.ciCommand.description",
                          schema: z.array(z.string()),
                        }),
                        env: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.ciEnvMapping.title",
                          description:
                            "app.api.system.releaseTool.fields.ciEnvMapping.description",
                          optional: true,
                          schema: z.record(z.string(), z.string()).optional(),
                        }),
                      },
                    ),

                    // Git operations
                    git: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title: "app.api.system.releaseTool.fields.gitOps.title",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                      },
                      { request: "data" },
                      {
                        skipTag: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.skipTag.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        skipPush: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.skipPush.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        skipCommit: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.skipCommit.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        commitMessage: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.commitMessage.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        signCommit: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.signCommit.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        signTag: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.signTag.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        remote: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.remote.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                      },
                    ),

                    // NPM publishing
                    npm: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title: "app.api.system.releaseTool.fields.npm.title",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                      },
                      { request: "data" },
                      {
                        enabled: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.npmEnabled.title",
                          schema: z.boolean().optional().default(true),
                        }),
                        registry: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.npmRegistry.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        tag: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.npmTag.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        access: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.SELECT,
                          label:
                            "app.api.system.releaseTool.fields.npmAccess.title",
                          options: [
                            {
                              value: "public",
                              label:
                                "app.api.system.releaseTool.enums.npmAccess.public",
                            },
                            {
                              value: "restricted",
                              label:
                                "app.api.system.releaseTool.enums.npmAccess.restricted",
                            },
                          ],
                          optional: true,
                          schema: NpmAccessSchema.optional(),
                        }),
                        otpEnvVar: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.otpEnvVar.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        provenance: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.provenance.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        ignoreScripts: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.ignoreScripts.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        dryRun: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.npmDryRun.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                      },
                    ),

                    // JSR publishing
                    jsr: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title: "app.api.system.releaseTool.fields.jsr.title",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                      },
                      { request: "data" },
                      {
                        enabled: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.jsrEnabled.title",
                          schema: z.boolean().optional().default(false),
                        }),
                        allowSlowTypes: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.allowSlowTypes.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        allowDirty: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.allowDirty.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        dryRun: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.jsrDryRun.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                      },
                    ),

                    // Changelog
                    changelog: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title:
                          "app.api.system.releaseTool.fields.changelog.title",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                      },
                      { request: "data" },
                      {
                        enabled: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.changelogEnabled.title",
                          schema: z.boolean().optional().default(false),
                        }),
                        file: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.changelogFile.title",
                          schema: z.string().optional().default("CHANGELOG.md"),
                        }),
                        header: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.changelogHeader.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        compareUrlFormat: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.compareUrlFormat.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        commitUrlFormat: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.commitUrlFormat.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        includeBody: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.includeBody.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        preset: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.SELECT,
                          label:
                            "app.api.system.releaseTool.fields.changelogPreset.title",
                          options: [
                            {
                              value: "conventional-commits",
                              label:
                                "app.api.system.releaseTool.enums.changelogPreset.conventional-commits",
                            },
                            {
                              value: "angular",
                              label:
                                "app.api.system.releaseTool.enums.changelogPreset.angular",
                            },
                            {
                              value: "atom",
                              label:
                                "app.api.system.releaseTool.enums.changelogPreset.atom",
                            },
                            {
                              value: "eslint",
                              label:
                                "app.api.system.releaseTool.enums.changelogPreset.eslint",
                            },
                            {
                              value: "ember",
                              label:
                                "app.api.system.releaseTool.enums.changelogPreset.ember",
                            },
                          ],
                          optional: true,
                          schema: ChangelogPresetSchema.optional(),
                        }),
                      },
                    ),

                    // Git release (GitHub/GitLab)
                    gitRelease: objectOptionalField(
                      {
                        type: WidgetType.CONTAINER,
                        title:
                          "app.api.system.releaseTool.fields.gitRelease.title",
                        layoutType: LayoutType.GRID,
                        columns: 12,
                        optional: true,
                      },
                      { request: "data" },
                      {
                        enabled: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.gitReleaseEnabled.title",
                          schema: z.boolean().optional().default(false),
                        }),
                        title: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.releaseTitle.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        generateNotes: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.generateNotes.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        body: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.releaseBody.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        draft: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.draft.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        prerelease: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label:
                            "app.api.system.releaseTool.fields.prerelease.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        discussionCategory: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.discussionCategory.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        target: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.target.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        assets: requestField({
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label:
                            "app.api.system.releaseTool.fields.assets.title",
                          description:
                            "app.api.system.releaseTool.fields.assets.description",
                          optional: true,
                          schema: z
                            .array(
                              z.object({
                                path: z.string(),
                                name: z.string().optional(),
                                label: z.string().optional(),
                                contentType: z.string().optional(),
                              }),
                            )
                            .optional(),
                        }),
                      },
                    ),

                    // Folders to zip for release
                    foldersToZip: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.foldersToZip.title",
                      description:
                        "app.api.system.releaseTool.fields.foldersToZip.description",
                      optional: true,
                      schema: z
                        .array(
                          z.object({
                            input: z.string(),
                            output: z.string(),
                          }),
                        )
                        .optional(),
                    }),

                    // Version bumper for non-package.json files
                    versionBumper: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.versionBumper.title",
                      description:
                        "app.api.system.releaseTool.fields.versionBumper.description",
                      optional: true,
                      schema: z
                        .array(
                          z.object({
                            filePath: z.string(),
                            varName: z.string().optional(),
                            pattern: z.string().optional(),
                            replacement: z.string().optional(),
                          }),
                        )
                        .optional(),
                    }),
                  },
                ),

                // Package-level hooks
                hooks: objectOptionalField(
                  {
                    type: WidgetType.CONTAINER,
                    title: "app.api.system.releaseTool.fields.hooks.title",
                    description:
                      "app.api.system.releaseTool.fields.hooks.description",
                    layoutType: LayoutType.GRID,
                    columns: 12,
                    optional: true,
                  },
                  { request: "data" },
                  {
                    preInstall: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.preInstall.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postInstall: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.postInstall.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    preClean: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.releaseTool.fields.preClean.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postClean: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.postClean.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    preLint: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.releaseTool.fields.preLint.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postLint: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.releaseTool.fields.postLint.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    preBuild: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.releaseTool.fields.preBuild.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postBuild: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.postBuild.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    preTest: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.releaseTool.fields.preTest.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postTest: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "app.api.system.releaseTool.fields.postTest.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    prePublish: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.prePublish.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postPublish: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.postPublish.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    preRelease: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.preRelease.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                    postRelease: requestField({
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label:
                        "app.api.system.releaseTool.fields.postRelease.title",
                      optional: true,
                      schema: z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    }),
                  },
                ),
              },
            ),
          ),

          // Global hooks
          hooks: objectOptionalField(
            {
              type: WidgetType.CONTAINER,
              title: "app.api.system.releaseTool.fields.globalHooks.title",
              description:
                "app.api.system.releaseTool.fields.globalHooks.description",
              layoutType: LayoutType.GRID,
              columns: 12,
              optional: true,
            },
            { request: "data" },
            {
              preRelease: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.releaseTool.fields.preRelease.title",
                optional: true,
                schema: z
                  .object({
                    command: z.string(),
                    cwd: z.string().optional(),
                    continueOnError: z.boolean().optional(),
                    env: z.record(z.string(), z.string()).optional(),
                    timeout: z.coerce.number().optional(),
                    shell: z.boolean().optional(),
                  })
                  .optional(),
              }),
              postRelease: requestField({
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "app.api.system.releaseTool.fields.postRelease.title",
                optional: true,
                schema: z
                  .object({
                    command: z.string(),
                    cwd: z.string().optional(),
                    continueOnError: z.boolean().optional(),
                    env: z.record(z.string(), z.string()).optional(),
                    timeout: z.coerce.number().optional(),
                    shell: z.boolean().optional(),
                  })
                  .optional(),
              }),
            },
          ),
        },
      ),

      // ========================================================================
      // RESPONSE FIELDS - Ordered for optimal display
      // ========================================================================

      // Summary stats at the top
      success: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.releaseTool.response.status",
        schema: z.boolean(),
      }),

      duration: responseField({
        type: WidgetType.TEXT,
        content: "app.api.system.releaseTool.response.duration",
        schema: z.coerce.number(),
      }),

      // Output log
      output: responseField({
        type: WidgetType.CODE_OUTPUT,
        schema: z.string(),
      }),

      // Errors displayed prominently if present
      errors: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.errors",
          optional: true,
        },
        responseField({
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      ),

      // Warnings displayed if present
      warnings: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.warnings",
          optional: true,
        },
        responseField({
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      ),

      // Packages table with status highlighting
      packagesProcessed: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.packages",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            name: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.name",
              schema: z.string(),
            }),
            directory: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.directory",
              schema: z.string(),
            }),
            version: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.version",
              schema: z.string().optional(),
            }),
            tag: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.tag",
              schema: z.string().optional(),
            }),
            status: responseField({
              type: WidgetType.BADGE,
              schema: PackageStatusSchema,
            }),
            message: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.message",
              schema: z.string().optional(),
            }),
          },
        ),
      ),

      // Git info displayed as metadata card
      gitInfo: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.gitInfo",
        },
        { response: true },
        {
          currentBranch: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          lastTag: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          newTag: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          commitsSinceLastTag: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().nullable(),
          }),
          hasUncommittedChanges: responseField({
            type: WidgetType.BADGE,
            schema: z.boolean(),
          }),
        },
      ),

      // CI environment as metadata card
      ciEnvironment: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.ciEnvironment",
        },
        { response: true },
        {
          isCI: responseField({
            type: WidgetType.BADGE,
            schema: z.boolean(),
          }),
          provider: responseField({
            type: WidgetType.BADGE,
            schema: CIProviderSchema.nullable(),
          }),
          branch: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          commit: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          pr: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          tag: responseField({
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
        },
      ),

      // Published packages
      publishedPackages: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.published",
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            name: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.name",
              schema: z.string(),
            }),
            version: responseField({
              type: WidgetType.BADGE,
              variant: "success",
              schema: z.string(),
            }),
            registry: responseField({
              type: WidgetType.BADGE,
              variant: "info",
              schema: z.string(),
            }),
            url: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.url",
              schema: z.string().optional(),
            }),
          },
        ),
      ),

      // Timings
      timings: objectOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.timings",
        },
        { response: true },
        {
          total: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number(),
          }),
          validation: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          install: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          clean: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          lint: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          typecheck: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          build: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          test: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          publish: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          changelog: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          gitOperations: responseField({
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
        },
      ),

      rollbackPerformed: responseField({
        type: WidgetType.BADGE,
        variant: "warning",
        schema: z.boolean().optional(),
      }),

      notificationsSent: responseArrayOptionalField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.system.releaseTool.response.notificationsSent",
          optional: true,
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            type: responseField({
              type: WidgetType.BADGE,
              variant: "info",
              schema: z.string(),
            }),
            success: responseField({
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            message: responseField({
              type: WidgetType.TEXT,
              content: "app.api.system.releaseTool.table.message",
              schema: z.string().optional(),
            }),
          },
        ),
      ),

      // ========================================================================
      // INTERNAL TYPES (for repository services - not shown in UI)
      // ========================================================================

      _internal: objectOptionalField(
        { type: WidgetType.CONTAINER, optional: true },
        { response: true },
        {
          // Package.json structure
          packageJson: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              name: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.string(),
              }),
              version: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.version",
                schema: z.string(),
              }),
              scripts: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              dependencies: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              devDependencies: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              peerDependencies: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              optionalDependencies: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              updateIgnoreDependencies: responseArrayOptionalField(
                {
                  type: WidgetType.CONTAINER,
                  title: "app.api.system.releaseTool.fields.name.title",
                  optional: true,
                },
                responseField({
                  type: WidgetType.TEXT,
                  schema: z.string(),
                }),
              ),
              private: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
              publishConfig: objectOptionalField(
                { type: WidgetType.CONTAINER, optional: true },
                { response: true },
                {
                  access: responseField({
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.releaseTool.fields.npmAccess.title",
                    optional: true,
                    schema: z.enum(["public", "restricted"]).optional(),
                  }),
                  registry: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.table.registry",
                    optional: true,
                    schema: z.string().optional(),
                  }),
                  tag: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.table.tag",
                    optional: true,
                    schema: z.string().optional(),
                  }),
                },
              ),
              repository: objectOptionalField(
                { type: WidgetType.CONTAINER, optional: true },
                { response: true },
                {
                  type: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    schema: z.string(),
                  }),
                  url: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.table.url",
                    schema: z.string(),
                  }),
                },
              ),
            },
          ),

          // Version info
          versionInfo: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              newVersion: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.version",
                schema: z.string(),
              }),
              lastTag: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.tag",
                schema: z.string(),
              }),
              newTag: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.tag",
                schema: z.string(),
              }),
            },
          ),

          // Parsed version
          parsedVersion: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              major: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.releaseTool.enums.versionIncrement.major",
                schema: z.number(),
              }),
              minor: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.releaseTool.enums.versionIncrement.minor",
                schema: z.number(),
              }),
              patch: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.releaseTool.enums.versionIncrement.patch",
                schema: z.number(),
              }),
              prerelease: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.releaseTool.enums.versionIncrement.prerelease",
                optional: true,
                schema: z.string().nullable(),
              }),
              prereleaseNumber: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.prereleaseId.title",
                optional: true,
                schema: z.number().nullable(),
              }),
              buildMetadata: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().nullable(),
              }),
            },
          ),

          // Repo info
          repoInfo: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              type: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.enum([
                  "github",
                  "gitlab",
                  "bitbucket",
                  "azure",
                  "other",
                ]),
              }),
              url: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.url",
                schema: z.string(),
              }),
              owner: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              repo: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              defaultBranch: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.branchMain.title",
                optional: true,
                schema: z.string().optional(),
              }),
            },
          ),

          // Commit info
          commitInfo: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              sha: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.string(),
              }),
              shortSha: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.string(),
              }),
              subject: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.string(),
              }),
              body: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.releaseBody.title",
                optional: true,
                schema: z.string().optional(),
              }),
              authorName: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.string(),
              }),
              authorEmail: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.string(),
              }),
              timestamp: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.coerce.date(),
              }),
              conventionalType: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              conventionalScope: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              isBreaking: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
            },
          ),

          // Hook context
          hookContext: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              packageManager: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.releaseTool.fields.packageManager.title",
                schema: z.string(),
              }),
              packageName: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              version: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.version",
                optional: true,
                schema: z.string().optional(),
              }),
              directory: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.directory.title",
                optional: true,
                schema: z.string().optional(),
              }),
              previousVersion: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.version",
                optional: true,
                schema: z.string().optional(),
              }),
              tag: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.tag",
                optional: true,
                schema: z.string().optional(),
              }),
              isCI: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.ci.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
              ciProvider: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              dryRun: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.dryRun.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
            },
          ),

          // Hook result
          hookResult: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              success: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.response.status",
                schema: z.boolean(),
              }),
              command: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.ciCommand.title",
                schema: z.string(),
              }),
              exitCode: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.number().optional(),
              }),
              stdout: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              stderr: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              duration: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.response.duration",
                optional: true,
                schema: z.number().optional(),
              }),
              message: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.message",
                optional: true,
                schema: z.string().optional(),
              }),
            },
          ),

          // Security scan result
          securityScanResult: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              passed: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                schema: z.boolean(),
              }),
              vulnerabilities: objectField(
                { type: WidgetType.CONTAINER },
                { response: true },
                {
                  critical: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    schema: z.number(),
                  }),
                  high: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    schema: z.number(),
                  }),
                  medium: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    schema: z.number(),
                  }),
                  low: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    schema: z.number(),
                  }),
                },
              ),
            },
          ),

          // Notification data
          notificationData: objectOptionalField(
            { type: WidgetType.CONTAINER, optional: true },
            { response: true },
            {
              success: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.response.status",
                schema: z.boolean(),
              }),
              packageName: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              version: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.version",
                optional: true,
                schema: z.string().optional(),
              }),
              duration: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.response.duration",
                optional: true,
                schema: z.number().optional(),
              }),
              error: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.response.errors",
                optional: true,
                schema: z.string().optional(),
              }),
              releaseUrl: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.url",
                optional: true,
                schema: z.string().optional(),
              }),
              commitSha: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              branch: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.fields.branch.title",
                optional: true,
                schema: z.string().optional(),
              }),
              registryUrls: responseField({
                type: WidgetType.TEXT,
                content: "app.api.system.releaseTool.table.url",
                optional: true,
                schema: z.array(z.string()).optional(),
              }),
              timings: objectOptionalField(
                { type: WidgetType.CONTAINER, optional: true },
                { response: true },
                {
                  total: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.response.duration",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  version: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.table.version",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  quality: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  publish: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  git: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  changelog: responseField({
                    type: WidgetType.TEXT,
                    content:
                      "app.api.system.releaseTool.fields.changelog.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  notification: responseField({
                    type: WidgetType.TEXT,
                    content: "app.api.system.releaseTool.fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                },
              ),
            },
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.system.releaseTool.errors.validation.title",
      description: "app.api.system.releaseTool.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.system.releaseTool.errors.notFound.title",
      description: "app.api.system.releaseTool.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.system.releaseTool.errors.server.title",
      description: "app.api.system.releaseTool.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.system.releaseTool.errors.unknown.title",
      description: "app.api.system.releaseTool.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.system.releaseTool.errors.network.title",
      description: "app.api.system.releaseTool.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.system.releaseTool.errors.unauthorized.title",
      description: "app.api.system.releaseTool.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.system.releaseTool.errors.forbidden.title",
      description: "app.api.system.releaseTool.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.system.releaseTool.errors.conflict.title",
      description: "app.api.system.releaseTool.errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.system.releaseTool.errors.unsavedChanges.title",
      description:
        "app.api.system.releaseTool.errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.releaseTool.success.title",
    description: "app.api.system.releaseTool.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {},
      ciRelease: {
        ci: true,
        configObject: {
          packages: [{ directory: "./" }],
        },
      },
      dryRun: {
        dryRun: true,
        verbose: true,
        configObject: {
          packages: [{ directory: "./" }],
        },
      },
    },
    responses: {
      default: {
        success: true,
        output: "Release completed successfully",
        duration: 30000,
        packagesProcessed: [
          {
            name: "my-package",
            directory: "./",
            version: "1.0.1",
            tag: "v1.0.1",
            status: "success" as const,
          },
        ],
        errors: null,
        warnings: null,
        publishedPackages: null,
        notificationsSent: null,
      },
      ciRelease: {
        success: true,
        output: "CI release completed successfully",
        duration: 45000,
        packagesProcessed: [
          {
            name: "my-package",
            directory: "./",
            version: "1.0.1",
            status: "success" as const,
            message: "Published to npm",
          },
        ],
        ciEnvironment: {
          isCI: true,
          provider: "github" as const,
          branch: "main",
          commit: "abc123",
          pr: null,
          tag: "v1.0.1",
        },
        errors: null,
        warnings: null,
        publishedPackages: null,
        notificationsSent: null,
      },
      dryRun: {
        success: true,
        output: "[DRY RUN] Release simulation completed",
        duration: 5000,
        packagesProcessed: [
          {
            name: "my-package",
            directory: "./",
            version: "1.0.1",
            tag: "v1.0.1",
            status: "success" as const,
            message: "Would have been released",
          },
        ],
        errors: null,
        warnings: null,
        publishedPackages: null,
        notificationsSent: null,
      },
    },
  },
});

// Export the definition
const releaseToolDefinition = { POST };
export default releaseToolDefinition;

// ============================================================================
// Type Exports - Derived from Definition
// ============================================================================

/** Request type */
export type RequestType = typeof POST.types.RequestOutput;

/** Response type */
export type ReleaseResponseType = typeof POST.types.ResponseOutput;

/** Package manager types - derived from schema */
export type PackageManager = z.infer<typeof PackageManagerSchema>;

/** Version increment types - derived from schema */
export type VersionIncrement = z.infer<typeof VersionIncrementSchema>;

/** CI provider types - derived from schema */
export type CIProvider = z.infer<typeof CIProviderSchema>;

/** Package status types - derived from schema */
export type PackageStatus = z.infer<typeof PackageStatusSchema>;

/** Webhook type - derived from schema */
export type WebhookType = z.infer<typeof WebhookTypeSchema>;

/** Changelog preset - derived from schema */
export type ChangelogPreset = z.infer<typeof ChangelogPresetSchema>;

/** NPM access level - derived from schema */
export type NpmAccess = z.infer<typeof NpmAccessSchema>;

/** CI environment - derived from response schema */
export type CIEnvironment = NonNullable<ReleaseResponseType["ciEnvironment"]>;

// Infer config types from request type
export type ReleaseConfig = NonNullable<RequestType["configObject"]>;

/** File-based config (without runtime-only options like ci, dryRun, skipXxx, etc.) */
export type ReleaseFileConfig = Partial<
  Pick<
    ReleaseConfig,
    | "packageManager"
    | "globalVersion"
    | "branch"
    | "continueOnError"
    | "packages"
    | "notifications"
    | "hooks"
  >
> &
  Required<Pick<ReleaseConfig, "packages">>;

/** Package configuration */
export type ReleasePackage = NonNullable<ReleaseConfig["packages"]>[number];

/** Release options for a package */
export type ReleaseOptions = NonNullable<ReleasePackage["release"]>;

/** Git operations configuration */
export type GitOpsConfig = NonNullable<ReleaseOptions["git"]>;

/** NPM publish configuration */
export type NpmPublishConfig = NonNullable<ReleaseOptions["npm"]>;

/** JSR publish configuration */
export type JsrPublishConfig = NonNullable<ReleaseOptions["jsr"]>;

/** Changelog configuration */
export type ChangelogConfig = NonNullable<ReleaseOptions["changelog"]>;

/** Git release configuration */
export type GitReleaseConfig = NonNullable<ReleaseOptions["gitRelease"]>;

/** Branch configuration */
export type BranchConfig = NonNullable<ReleaseConfig["branch"]>;

/** Notification configuration */
export type NotificationConfig = NonNullable<ReleaseConfig["notifications"]>;

/** Retry configuration */
export type RetryConfig = NonNullable<ReleaseConfig["retry"]>;

/** Rollback configuration */
export type RollbackConfig = NonNullable<ReleaseConfig["rollback"]>;

/** Hook configuration - derived from hooks schema */
export type ReleaseHook = NonNullable<
  NonNullable<ReleaseConfig["hooks"]>["preRelease"]
>;

/** Folders to zip configuration - derived from package release schema */
export type FoldersToZip = NonNullable<ReleaseOptions["foldersToZip"]>;

/** Version bumper configuration - derived from package release schema */
export type VersionBumper = NonNullable<ReleaseOptions["versionBumper"]>;

/** Git release assets configuration */
export type GitReleaseAsset = NonNullable<
  NonNullable<ReleaseOptions["gitRelease"]>["assets"]
>[number];

// ============================================================================
// Response-Derived Types
// ============================================================================

/** Package result - derived from response packagesProcessed */
export type PackageResult = NonNullable<
  ReleaseResponseType["packagesProcessed"]
>[number];

/** Published package - derived from response publishedPackages */
export type PublishedPackage = NonNullable<
  ReleaseResponseType["publishedPackages"]
>[number];

/** Timings breakdown - derived from response timings */
export type Timings = NonNullable<ReleaseResponseType["timings"]>;

/** Notification result - derived from response notificationsSent */
export type NotificationResult = NonNullable<
  ReleaseResponseType["notificationsSent"]
>[number];

/** Git info - derived from response gitInfo */
export type GitInfo = NonNullable<ReleaseResponseType["gitInfo"]>;

// ============================================================================
// Internal Types - Derived from _internal response fields
// ============================================================================

/** Internal types helper */
type InternalTypes = NonNullable<ReleaseResponseType["_internal"]>;

/** Package.json structure - derived from _internal.packageJson */
export type PackageJson = NonNullable<InternalTypes["packageJson"]>;

/** Version info - derived from _internal.versionInfo */
export type VersionInfo = NonNullable<InternalTypes["versionInfo"]>;

/** Parsed semver version components - derived from _internal.parsedVersion */
export type ParsedVersion = NonNullable<InternalTypes["parsedVersion"]>;

/** Repository hosting information - derived from _internal.repoInfo */
export type RepoInfo = NonNullable<InternalTypes["repoInfo"]>;

/** Git commit information - derived from _internal.commitInfo */
export type CommitInfo = NonNullable<InternalTypes["commitInfo"]>;

/** Hook execution context - derived from _internal.hookContext */
export type HookContext = NonNullable<InternalTypes["hookContext"]>;

/** Hook execution result - derived from _internal.hookResult */
export type HookResult = NonNullable<InternalTypes["hookResult"]>;

/** Security scan results - derived from _internal.securityScanResult */
export type SecurityScanResult = NonNullable<
  InternalTypes["securityScanResult"]
>;

/** Notification data for webhooks - derived from _internal.notificationData */
export type NotificationData = NonNullable<InternalTypes["notificationData"]>;

/** Notification timings - derived from _internal.notificationData.timings */
export type NotificationTimings = NonNullable<NotificationData["timings"]>;
