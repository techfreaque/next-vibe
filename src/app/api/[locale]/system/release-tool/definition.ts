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
  customWidgetObject,
  objectField,
  objectOptionalField,
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
  requestDataArrayOptionalField,
  responseArrayOptionalField,
} from "../unified-interface/shared/field/utils";
import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { scopedTranslation } from "./i18n";

const ReleaseResultWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.ReleaseResultWidget })),
);

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
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "release-tool"],
  title: "title",
  description: "description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["tags.release"],
  icon: "rocket",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.PRODUCTION_OFF,
  ] as const,
  aliases: ["release", "pub", "publish"],

  fields: customWidgetObject({
    render: ReleaseResultWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // ========================================================================
      // REQUEST FIELDS - Runtime options at root level for CLI access
      // ========================================================================

      configPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.configPath.title",
        description: "fields.configPath.description",
        schema: z.string().optional().default("release.config.ts"),
      }),

      // ========================================================================
      // Runtime options (CLI flags) - at root level for direct CLI access
      // ========================================================================
      ci: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.ci.title",
        description: "fields.ci.description",
        schema: z.boolean().optional().default(false),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.dryRun.title",
        description: "fields.dryRun.description",
        schema: z.boolean().optional().default(false),
      }),

      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.verbose.title",
        description: "fields.verbose.description",
        schema: z.boolean().optional().default(false),
      }),

      forceUpdate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.forceUpdate.title",
        description: "fields.forceUpdate.description",
        schema: z.boolean().optional(), // No default - undefined means "ask user",
      }),

      // Skip options
      skipLint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipLint.title",
        description: "fields.skipLint.description",
        schema: z.boolean().optional().default(false),
      }),

      skipTypecheck: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipTypecheck.title",
        description: "fields.skipTypecheck.description",
        schema: z.boolean().optional().default(false),
      }),

      skipBuild: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipBuild.title",
        description: "fields.skipBuild.description",
        schema: z.boolean().optional().default(false),
      }),

      skipTests: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipTests.title",
        description: "fields.skipTests.description",
        schema: z.boolean().optional().default(false),
      }),

      skipSnyk: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipSnyk.title",
        description: "fields.skipSnyk.description",
        schema: z.boolean().optional().default(false),
      }),

      skipChangelog: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipChangelog.title",
        description: "fields.skipChangelog.description",
        schema: z.boolean().optional().default(false),
      }),

      skipGitTag: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipGitTag.title",
        description: "fields.skipGitTag.description",
        schema: z.boolean().optional().default(false),
      }),

      skipGitPush: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipGitPush.title",
        description: "fields.skipGitPush.description",
        schema: z.boolean().optional().default(false),
      }),

      skipInstall: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipInstall.title",
        description: "fields.skipInstall.description",
        schema: z.boolean().optional().default(false),
      }),

      skipClean: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.skipClean.title",
        description: "fields.skipClean.description",
        schema: z.boolean().optional().default(false),
      }),

      // Version options
      versionIncrement: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "fields.versionIncrement.title",
        description: "fields.versionIncrement.description",
        options: [
          {
            value: "patch",
            label: "enums.versionIncrement.patch",
          },
          {
            value: "minor",
            label: "enums.versionIncrement.minor",
          },
          {
            value: "major",
            label: "enums.versionIncrement.major",
          },
          {
            value: "prepatch",
            label: "enums.versionIncrement.prepatch",
          },
          {
            value: "preminor",
            label: "enums.versionIncrement.preminor",
          },
          {
            value: "premajor",
            label: "enums.versionIncrement.premajor",
          },
          {
            value: "prerelease",
            label: "enums.versionIncrement.prerelease",
          },
        ],
        optional: true,
        schema: VersionIncrementSchema.optional(),
      }),

      prereleaseId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.prereleaseId.title",
        description: "fields.prereleaseId.description",
        optional: true,
        schema: z.string().optional(),
      }),

      targetPackage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.targetPackage.title",
        description: "fields.targetPackage.description",
        optional: true,
        schema: z.string().optional(),
      }),

      commitMessage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.commitMessage.title",
        description: "fields.commitMessage.description",
        optional: true,
        schema: z.string().optional(),
      }),

      // ========================================================================
      // CONFIG OBJECT - Contains release configuration (not runtime flags)
      // ========================================================================
      configObject: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "fields.configObject.title",
        description: "fields.configObject.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        optional: true,
        usage: { request: "data" },
        children: {
          packageManager: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "fields.packageManager.title",
            description: "fields.packageManager.description",
            options: [
              {
                value: "bun",
                label: "enums.packageManager.bun",
              },
              {
                value: "npm",
                label: "enums.packageManager.npm",
              },
              {
                value: "yarn",
                label: "enums.packageManager.yarn",
              },
              {
                value: "pnpm",
                label: "enums.packageManager.pnpm",
              },
              {
                value: "deno",
                label: "enums.packageManager.deno",
              },
            ],
            schema: PackageManagerSchema.optional().default("bun"),
          }),

          globalVersion: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "fields.globalVersion.title",
            description: "fields.globalVersion.description",
            optional: true,
            schema: z.string().optional(),
          }),

          parallel: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "fields.parallel.title",
            description: "fields.parallel.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          maxParallelJobs: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "fields.maxParallelJobs.title",
            description: "fields.maxParallelJobs.description",
            optional: true,
            schema: z.coerce.number().optional(),
          }),

          continueOnError: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "fields.continueOnError.title",
            description: "fields.continueOnError.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          verifyGitStatus: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "fields.verifyGitStatus.title",
            description: "fields.verifyGitStatus.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          requireCleanWorkingDir: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "fields.requireCleanWorkingDir.title",
            description: "fields.requireCleanWorkingDir.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          verifyLockfile: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "fields.verifyLockfile.title",
            description: "fields.verifyLockfile.description",
            optional: true,
            schema: z.boolean().optional(),
          }),

          // Branch configuration
          branch: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "fields.branch.title",
            description: "fields.branch.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            optional: true,
            usage: { request: "data" },
            children: {
              main: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.branchMain.title",
                schema: z.string().optional().default("main"),
              }),
              develop: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.branchDevelop.title",
                optional: true,
                schema: z.string().optional(),
              }),
              allowNonMain: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.allowNonMain.title",
                schema: z.boolean().optional().default(false),
              }),
              protected: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.protectedBranches.title",
                optional: true,
                schema: z.array(z.string()).optional(),
              }),
            },
          }),

          // Notifications configuration
          notifications: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "fields.notifications.title",
            description: "fields.notifications.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            optional: true,
            usage: { request: "data" },
            children: {
              enabled: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.notificationsEnabled.title",
                schema: z.boolean().optional().default(false),
              }),
              webhookUrl: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.webhookUrl.title",
                optional: true,
                schema: z.string().optional(),
              }),
              type: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.SELECT,
                label: "fields.webhookType.title",
                options: [
                  {
                    value: "slack",
                    label: "enums.webhookType.slack",
                  },
                  {
                    value: "discord",
                    label: "enums.webhookType.discord",
                  },
                  {
                    value: "teams",
                    label: "enums.webhookType.teams",
                  },
                  {
                    value: "custom",
                    label: "enums.webhookType.custom",
                  },
                ],
                optional: true,
                schema: WebhookTypeSchema.optional(),
              }),
              onSuccess: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.onSuccess.title",
                schema: z.boolean().optional().default(true),
              }),
              onFailure: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.onFailure.title",
                schema: z.boolean().optional().default(true),
              }),
              messageTemplate: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.messageTemplate.title",
                optional: true,
                schema: z.string().optional(),
              }),
              includeTimings: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.includeTimings.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
            },
          }),

          // Retry configuration
          retry: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "fields.retry.title",
            description: "fields.retry.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            optional: true,
            usage: { request: "data" },
            children: {
              maxAttempts: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "fields.maxAttempts.title",
                schema: z.coerce.number().optional().default(3),
              }),
              delayMs: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "fields.delayMs.title",
                schema: z.coerce.number().optional().default(1000),
              }),
              backoffMultiplier: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "fields.backoffMultiplier.title",
                schema: z.coerce.number().optional().default(2),
              }),
              maxDelayMs: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.NUMBER,
                label: "fields.maxDelayMs.title",
                schema: z.coerce.number().optional().default(30000),
              }),
            },
          }),

          // Rollback configuration
          rollback: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "fields.rollback.title",
            description: "fields.rollback.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            optional: true,
            usage: { request: "data" },
            children: {
              enabled: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.rollbackEnabled.title",
                schema: z.boolean().optional().default(false),
              }),
              git: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.rollbackGit.title",
                schema: z.boolean().optional().default(true),
              }),
              version: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.BOOLEAN,
                label: "fields.rollbackVersion.title",
                schema: z.boolean().optional().default(true),
              }),
            },
          }),

          // Packages array
          packages: requestDataArrayOptionalField(
            scopedTranslation,
            {
              type: WidgetType.CONTAINER,
              title: "fields.packages.title",
              description: "fields.packages.description",
              layoutType: LayoutType.GRID,
              optional: true,
            },
            objectField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              title: "fields.package.title",
              layoutType: LayoutType.GRID,
              columns: 12,
              usage: { request: "data" },
              children: {
                directory: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.directory.title",
                  schema: z.string(),
                }),
                name: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.name.title",
                  optional: true,
                  schema: z.string().optional(),
                }),
                updateDeps: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.updateDeps.title",
                  description: "fields.updateDeps.description",
                  schema: z
                    .union([z.boolean(), z.literal("force")])
                    .optional()
                    .default(false),
                }),
                clean: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.clean.title",
                  description: "fields.clean.description",
                  optional: true,
                  schema: z.union([z.boolean(), z.string()]).optional(),
                }),
                lint: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.lint.title",
                  description: "fields.lint.description",
                  schema: z
                    .union([z.boolean(), z.string()])
                    .optional()
                    .default(true),
                }),
                typecheck: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.typecheck.title",
                  description: "fields.typecheck.description",
                  optional: true,
                  schema: z.union([z.boolean(), z.string()]).optional(),
                }),
                build: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.build.title",
                  description: "fields.build.description",
                  schema: z
                    .union([z.boolean(), z.string()])
                    .optional()
                    .default(true),
                }),
                test: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.test.title",
                  description: "fields.test.description",
                  schema: z
                    .union([z.boolean(), z.string()])
                    .optional()
                    .default(true),
                }),
                snyk: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "fields.snyk.title",
                  optional: true,
                  schema: z.boolean().optional(),
                }),
                install: requestField(scopedTranslation, {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "fields.install.title",
                  description: "fields.install.description",
                  optional: true,
                  schema: z.union([z.boolean(), z.string()]).optional(),
                }),

                // Release options (nested)
                release: objectOptionalField(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "fields.release.title",
                  layoutType: LayoutType.GRID,
                  columns: 12,
                  optional: true,
                  usage: { request: "data" },
                  children: {
                    version: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.releaseVersion.title",
                      optional: true,
                      schema: z.string().optional(),
                    }),
                    tagPrefix: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.tagPrefix.title",
                      schema: z.string().optional().default("v"),
                    }),
                    tagSuffix: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.tagSuffix.title",
                      optional: true,
                      schema: z.string().optional(),
                    }),
                    prereleaseId: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.prereleaseId.title",
                      optional: true,
                      schema: z.string().optional(),
                    }),
                    ciReleaseCommand: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "fields.ciReleaseCommand.title",
                      description: "fields.ciReleaseCommand.description",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      usage: { request: "data" },
                      children: {
                        command: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.ciCommand.title",
                          description: "fields.ciCommand.description",
                          schema: z.array(z.string()),
                        }),
                        env: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.ciEnvMapping.title",
                          description: "fields.ciEnvMapping.description",
                          optional: true,
                          schema: z.record(z.string(), z.string()).optional(),
                        }),
                      },
                    }),

                    // Git operations
                    git: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "fields.gitOps.title",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      usage: { request: "data" },
                      children: {
                        skipTag: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.skipTag.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        skipPush: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.skipPush.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        skipCommit: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.skipCommit.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        commitMessage: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.commitMessage.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        signCommit: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.signCommit.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        signTag: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.signTag.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        remote: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.remote.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                      },
                    }),

                    // NPM publishing
                    npm: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "fields.npm.title",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      usage: { request: "data" },
                      children: {
                        enabled: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.npmEnabled.title",
                          schema: z.boolean().optional().default(true),
                        }),
                        registry: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.npmRegistry.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        tag: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.npmTag.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        access: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.SELECT,
                          label: "fields.npmAccess.title",
                          options: [
                            {
                              value: "public",
                              label: "enums.npmAccess.public",
                            },
                            {
                              value: "restricted",
                              label: "enums.npmAccess.restricted",
                            },
                          ],
                          optional: true,
                          schema: NpmAccessSchema.optional(),
                        }),
                        otpEnvVar: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.otpEnvVar.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        provenance: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.provenance.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        ignoreScripts: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.ignoreScripts.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        dryRun: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.npmDryRun.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                      },
                    }),

                    // JSR publishing
                    jsr: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "fields.jsr.title",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      usage: { request: "data" },
                      children: {
                        enabled: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.jsrEnabled.title",
                          schema: z.boolean().optional().default(false),
                        }),
                        allowSlowTypes: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.allowSlowTypes.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        allowDirty: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.allowDirty.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        dryRun: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.jsrDryRun.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                      },
                    }),

                    // Changelog
                    changelog: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "fields.changelog.title",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      usage: { request: "data" },
                      children: {
                        enabled: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.changelogEnabled.title",
                          schema: z.boolean().optional().default(false),
                        }),
                        file: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.changelogFile.title",
                          schema: z.string().optional().default("CHANGELOG.md"),
                        }),
                        header: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.changelogHeader.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        compareUrlFormat: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.compareUrlFormat.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        commitUrlFormat: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.commitUrlFormat.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        includeBody: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.includeBody.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        preset: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.SELECT,
                          label: "fields.changelogPreset.title",
                          options: [
                            {
                              value: "conventional-commits",
                              label:
                                "enums.changelogPreset.conventional-commits",
                            },
                            {
                              value: "angular",
                              label: "enums.changelogPreset.angular",
                            },
                            {
                              value: "atom",
                              label: "enums.changelogPreset.atom",
                            },
                            {
                              value: "eslint",
                              label: "enums.changelogPreset.eslint",
                            },
                            {
                              value: "ember",
                              label: "enums.changelogPreset.ember",
                            },
                          ],
                          optional: true,
                          schema: ChangelogPresetSchema.optional(),
                        }),
                      },
                    }),

                    // Git release (GitHub/GitLab)
                    gitRelease: objectOptionalField(scopedTranslation, {
                      type: WidgetType.CONTAINER,
                      title: "fields.gitRelease.title",
                      layoutType: LayoutType.GRID,
                      columns: 12,
                      optional: true,
                      usage: { request: "data" },
                      children: {
                        enabled: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.gitReleaseEnabled.title",
                          schema: z.boolean().optional().default(false),
                        }),
                        title: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.releaseTitle.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        generateNotes: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.generateNotes.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        body: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.releaseBody.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        draft: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.draft.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        prerelease: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.BOOLEAN,
                          label: "fields.prerelease.title",
                          optional: true,
                          schema: z.boolean().optional(),
                        }),
                        discussionCategory: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.discussionCategory.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        target: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.target.title",
                          optional: true,
                          schema: z.string().optional(),
                        }),
                        assets: requestField(scopedTranslation, {
                          type: WidgetType.FORM_FIELD,
                          fieldType: FieldDataType.TEXT,
                          label: "fields.assets.title",
                          description: "fields.assets.description",
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
                    }),

                    // Folders to zip for release
                    foldersToZip: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.foldersToZip.title",
                      description: "fields.foldersToZip.description",
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
                    versionBumper: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.versionBumper.title",
                      description: "fields.versionBumper.description",
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
                }),

                // Package-level hooks
                hooks: objectOptionalField(scopedTranslation, {
                  type: WidgetType.CONTAINER,
                  title: "fields.hooks.title",
                  description: "fields.hooks.description",
                  layoutType: LayoutType.GRID,
                  columns: 12,
                  optional: true,
                  usage: { request: "data" },
                  children: {
                    preInstall: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.preInstall.title",
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
                    postInstall: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postInstall.title",
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
                    preClean: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.preClean.title",
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
                    postClean: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postClean.title",
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
                    preLint: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.preLint.title",
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
                    postLint: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postLint.title",
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
                    preBuild: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.preBuild.title",
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
                    postBuild: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postBuild.title",
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
                    preTest: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.preTest.title",
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
                    postTest: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postTest.title",
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
                    prePublish: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.prePublish.title",
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
                    postPublish: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postPublish.title",
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
                    preRelease: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.preRelease.title",
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
                    postRelease: requestField(scopedTranslation, {
                      type: WidgetType.FORM_FIELD,
                      fieldType: FieldDataType.TEXT,
                      label: "fields.postRelease.title",
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
                }),
              },
            }),
          ),

          // Global hooks
          hooks: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "fields.globalHooks.title",
            description: "fields.globalHooks.description",
            layoutType: LayoutType.GRID,
            columns: 12,
            optional: true,
            usage: { request: "data" },
            children: {
              preRelease: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.preRelease.title",
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
              postRelease: requestField(scopedTranslation, {
                type: WidgetType.FORM_FIELD,
                fieldType: FieldDataType.TEXT,
                label: "fields.postRelease.title",
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
          }),
        },
      }),

      // ========================================================================
      // RESPONSE FIELDS - Ordered for optimal display
      // ========================================================================

      // Summary stats at the top
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.status",
        schema: z.boolean(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.duration",
        schema: z.coerce.number(),
      }),

      // Output log
      output: responseField(scopedTranslation, {
        type: WidgetType.CODE_OUTPUT,
        schema: z.string(),
      }),

      // Errors displayed prominently if present
      errors: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.errors",
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      // Warnings displayed if present
      warnings: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.warnings",
        child: responseField(scopedTranslation, {
          type: WidgetType.TEXT,
          schema: z.string(),
        }),
      }),

      // Packages table with status highlighting
      packagesProcessed: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.packages",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.name",
              schema: z.string(),
            }),
            directory: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.directory",
              schema: z.string(),
            }),
            version: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.version",
              schema: z.string().optional(),
            }),
            tag: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.tag",
              schema: z.string().optional(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: PackageStatusSchema,
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.message",
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      // Git info displayed as metadata card
      gitInfo: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.gitInfo",
        usage: { response: true },
        children: {
          currentBranch: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          lastTag: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          newTag: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          commitsSinceLastTag: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().nullable(),
          }),
          hasUncommittedChanges: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            schema: z.boolean(),
          }),
        },
      }),

      // CI environment as metadata card
      ciEnvironment: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.ciEnvironment",
        usage: { response: true },
        children: {
          isCI: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            schema: z.boolean(),
          }),
          provider: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            schema: CIProviderSchema.nullable(),
          }),
          branch: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          commit: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          pr: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
          tag: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            schema: z.string().nullable(),
          }),
        },
      }),

      // Published packages
      publishedPackages: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.published",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.name",
              schema: z.string(),
            }),
            version: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              variant: "success",
              schema: z.string(),
            }),
            registry: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              variant: "info",
              schema: z.string(),
            }),
            url: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.url",
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      // Timings
      timings: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.timings",
        usage: { response: true },
        children: {
          total: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number(),
          }),
          validation: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          install: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          clean: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          lint: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          typecheck: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          build: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          test: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          publish: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          changelog: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
          gitOperations: responseField(scopedTranslation, {
            type: WidgetType.STAT,
            schema: z.coerce.number().optional(),
          }),
        },
      }),

      rollbackPerformed: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        variant: "warning",
        schema: z.boolean().optional(),
      }),

      notificationsSent: responseArrayOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "response.notificationsSent",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              variant: "info",
              schema: z.string(),
            }),
            success: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              schema: z.boolean(),
            }),
            message: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "table.message",
              schema: z.string().optional(),
            }),
          },
        }),
      }),

      // ========================================================================
      // INTERNAL TYPES (for repository services - not shown in UI)
      // ========================================================================

      _internal: objectOptionalField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        optional: true,
        usage: { response: true },
        children: {
          // Package.json structure
          packageJson: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              name: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.string(),
              }),
              version: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.version",
                schema: z.string(),
              }),
              scripts: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              dependencies: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              devDependencies: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              peerDependencies: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              optionalDependencies: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.record(z.string(), z.string()).optional(),
              }),
              updateIgnoreDependencies: responseArrayOptionalField(
                scopedTranslation,
                {
                  type: WidgetType.CONTAINER,
                  title: "fields.name.title",
                  child: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    schema: z.string(),
                  }),
                },
              ),
              private: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
              publishConfig: objectOptionalField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                optional: true,
                usage: { response: true },
                children: {
                  access: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.npmAccess.title",
                    optional: true,
                    schema: z.enum(["public", "restricted"]).optional(),
                  }),
                  registry: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "table.registry",
                    optional: true,
                    schema: z.string().optional(),
                  }),
                  tag: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "table.tag",
                    optional: true,
                    schema: z.string().optional(),
                  }),
                },
              }),
              repository: objectOptionalField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                optional: true,
                usage: { response: true },
                children: {
                  type: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    schema: z.string(),
                  }),
                  url: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "table.url",
                    schema: z.string(),
                  }),
                },
              }),
            },
          }),

          // Version info
          versionInfo: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              newVersion: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.version",
                schema: z.string(),
              }),
              lastTag: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.tag",
                schema: z.string(),
              }),
              newTag: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.tag",
                schema: z.string(),
              }),
            },
          }),

          // Parsed version
          parsedVersion: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              major: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "enums.versionIncrement.major",
                schema: z.number(),
              }),
              minor: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "enums.versionIncrement.minor",
                schema: z.number(),
              }),
              patch: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "enums.versionIncrement.patch",
                schema: z.number(),
              }),
              prerelease: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "enums.versionIncrement.prerelease",
                optional: true,
                schema: z.string().nullable(),
              }),
              prereleaseNumber: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.prereleaseId.title",
                optional: true,
                schema: z.number().nullable(),
              }),
              buildMetadata: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().nullable(),
              }),
            },
          }),

          // Repo info
          repoInfo: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              type: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.enum([
                  "github",
                  "gitlab",
                  "bitbucket",
                  "azure",
                  "other",
                ]),
              }),
              url: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.url",
                schema: z.string(),
              }),
              owner: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              repo: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              defaultBranch: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.branchMain.title",
                optional: true,
                schema: z.string().optional(),
              }),
            },
          }),

          // Commit info
          commitInfo: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              sha: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.string(),
              }),
              shortSha: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.string(),
              }),
              subject: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.string(),
              }),
              body: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.releaseBody.title",
                optional: true,
                schema: z.string().optional(),
              }),
              authorName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.string(),
              }),
              authorEmail: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.string(),
              }),
              timestamp: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.coerce.date(),
              }),
              conventionalType: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              conventionalScope: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              isBreaking: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
            },
          }),

          // Hook context
          hookContext: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              packageManager: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.packageManager.title",
                schema: z.string(),
              }),
              packageName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              version: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.version",
                optional: true,
                schema: z.string().optional(),
              }),
              directory: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.directory.title",
                optional: true,
                schema: z.string().optional(),
              }),
              previousVersion: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.version",
                optional: true,
                schema: z.string().optional(),
              }),
              tag: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.tag",
                optional: true,
                schema: z.string().optional(),
              }),
              isCI: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.ci.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
              ciProvider: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              dryRun: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.dryRun.title",
                optional: true,
                schema: z.boolean().optional(),
              }),
            },
          }),

          // Hook result
          hookResult: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              success: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.status",
                schema: z.boolean(),
              }),
              command: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.ciCommand.title",
                schema: z.string(),
              }),
              exitCode: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.number().optional(),
              }),
              stdout: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              stderr: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              duration: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.duration",
                optional: true,
                schema: z.number().optional(),
              }),
              message: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.message",
                optional: true,
                schema: z.string().optional(),
              }),
            },
          }),

          // Security scan result
          securityScanResult: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              passed: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                schema: z.boolean(),
              }),
              vulnerabilities: objectField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                usage: { response: true },
                children: {
                  critical: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    schema: z.number(),
                  }),
                  high: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    schema: z.number(),
                  }),
                  medium: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    schema: z.number(),
                  }),
                  low: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    schema: z.number(),
                  }),
                },
              }),
            },
          }),

          // Notification data
          notificationData: objectOptionalField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            optional: true,
            usage: { response: true },
            children: {
              success: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.status",
                schema: z.boolean(),
              }),
              packageName: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              version: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.version",
                optional: true,
                schema: z.string().optional(),
              }),
              duration: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.duration",
                optional: true,
                schema: z.number().optional(),
              }),
              error: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "response.errors",
                optional: true,
                schema: z.string().optional(),
              }),
              releaseUrl: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.url",
                optional: true,
                schema: z.string().optional(),
              }),
              commitSha: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.name.title",
                optional: true,
                schema: z.string().optional(),
              }),
              branch: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "fields.branch.title",
                optional: true,
                schema: z.string().optional(),
              }),
              registryUrls: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "table.url",
                optional: true,
                schema: z.array(z.string()).optional(),
              }),
              timings: objectOptionalField(scopedTranslation, {
                type: WidgetType.CONTAINER,
                optional: true,
                usage: { response: true },
                children: {
                  total: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "response.duration",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  version: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "table.version",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  quality: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  publish: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  git: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  changelog: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.changelog.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                  notification: responseField(scopedTranslation, {
                    type: WidgetType.TEXT,
                    content: "fields.name.title",
                    optional: true,
                    schema: z.number().optional(),
                  }),
                },
              }),
            },
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "success.title",
    description: "success.description",
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
