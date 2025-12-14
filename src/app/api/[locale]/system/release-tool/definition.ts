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
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  objectField,
  objectOptionalField,
  requestDataField,
  requestDataArrayOptionalField,
  responseField,
  responseArrayOptionalField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
      // REQUEST FIELDS - Only configPath and configObject at root
      // ========================================================================

      configPath: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.system.releaseTool.fields.configPath.title",
          description:
            "app.api.system.releaseTool.fields.configPath.description",
        },
        z.string().optional().default("release.config.ts"),
      ),

      // ========================================================================
      // CONFIG OBJECT - Contains ALL configuration options
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
          // ====================================================================
          // Runtime options (CLI flags)
          // ====================================================================
          ci: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.ci.title",
              description: "app.api.system.releaseTool.fields.ci.description",
            },
            z.boolean().optional().default(false),
          ),

          dryRun: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.dryRun.title",
              description:
                "app.api.system.releaseTool.fields.dryRun.description",
            },
            z.boolean().optional().default(false),
          ),

          verbose: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.verbose.title",
              description:
                "app.api.system.releaseTool.fields.verbose.description",
            },
            z.boolean().optional().default(false),
          ),

          forceUpdate: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.forceUpdate.title",
              description:
                "app.api.system.releaseTool.fields.forceUpdate.description",
            },
            z.boolean().optional().default(false),
          ),

          // Skip options
          skipLint: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipLint.title",
              description:
                "app.api.system.releaseTool.fields.skipLint.description",
            },
            z.boolean().optional().default(false),
          ),

          skipTypecheck: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipTypecheck.title",
              description:
                "app.api.system.releaseTool.fields.skipTypecheck.description",
            },
            z.boolean().optional().default(false),
          ),

          skipBuild: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipBuild.title",
              description:
                "app.api.system.releaseTool.fields.skipBuild.description",
            },
            z.boolean().optional().default(false),
          ),

          skipTests: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipTests.title",
              description:
                "app.api.system.releaseTool.fields.skipTests.description",
            },
            z.boolean().optional().default(false),
          ),

          skipSnyk: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipSnyk.title",
              description:
                "app.api.system.releaseTool.fields.skipSnyk.description",
            },
            z.boolean().optional().default(false),
          ),

          skipPublish: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipPublish.title",
              description:
                "app.api.system.releaseTool.fields.skipPublish.description",
            },
            z.boolean().optional().default(false),
          ),

          skipChangelog: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipChangelog.title",
              description:
                "app.api.system.releaseTool.fields.skipChangelog.description",
            },
            z.boolean().optional().default(false),
          ),

          skipGitTag: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipGitTag.title",
              description:
                "app.api.system.releaseTool.fields.skipGitTag.description",
            },
            z.boolean().optional().default(false),
          ),

          skipGitPush: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipGitPush.title",
              description:
                "app.api.system.releaseTool.fields.skipGitPush.description",
            },
            z.boolean().optional().default(false),
          ),

          skipInstall: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipInstall.title",
              description:
                "app.api.system.releaseTool.fields.skipInstall.description",
            },
            z.boolean().optional().default(false),
          ),

          skipClean: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.skipClean.title",
              description:
                "app.api.system.releaseTool.fields.skipClean.description",
            },
            z.boolean().optional().default(false),
          ),

          // Version options
          versionIncrement: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.system.releaseTool.fields.versionIncrement.title",
              description:
                "app.api.system.releaseTool.fields.versionIncrement.description",
              options: [
                { value: "patch", label: "Patch" },
                { value: "minor", label: "Minor" },
                { value: "major", label: "Major" },
                { value: "prepatch", label: "Pre-patch" },
                { value: "preminor", label: "Pre-minor" },
                { value: "premajor", label: "Pre-major" },
                { value: "prerelease", label: "Prerelease" },
              ],
              optional: true,
            },
            VersionIncrementSchema.optional(),
          ),

          prereleaseId: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.system.releaseTool.fields.prereleaseId.title",
              description:
                "app.api.system.releaseTool.fields.prereleaseId.description",
              optional: true,
            },
            z.string().optional(),
          ),

          targetPackage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.system.releaseTool.fields.targetPackage.title",
              description:
                "app.api.system.releaseTool.fields.targetPackage.description",
              optional: true,
            },
            z.string().optional(),
          ),

          commitMessage: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.system.releaseTool.fields.commitMessage.title",
              description:
                "app.api.system.releaseTool.fields.commitMessage.description",
              optional: true,
            },
            z.string().optional(),
          ),

          notifyWebhook: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.system.releaseTool.fields.notifyWebhook.title",
              description:
                "app.api.system.releaseTool.fields.notifyWebhook.description",
              optional: true,
            },
            z.string().optional(),
          ),

          // ====================================================================
          // Global config options
          // ====================================================================
          packageManager: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.SELECT,
              label: "app.api.system.releaseTool.fields.packageManager.title",
              description:
                "app.api.system.releaseTool.fields.packageManager.description",
              options: [
                { value: "bun", label: "Bun" },
                { value: "npm", label: "NPM" },
                { value: "yarn", label: "Yarn" },
                { value: "pnpm", label: "PNPM" },
                { value: "deno", label: "Deno" },
              ],
            },
            PackageManagerSchema.optional().default("bun"),
          ),

          globalVersion: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.TEXT,
              label: "app.api.system.releaseTool.fields.globalVersion.title",
              description:
                "app.api.system.releaseTool.fields.globalVersion.description",
              optional: true,
            },
            z.string().optional(),
          ),

          parallel: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.parallel.title",
              description:
                "app.api.system.releaseTool.fields.parallel.description",
              optional: true,
            },
            z.boolean().optional(),
          ),

          maxParallelJobs: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.NUMBER,
              label: "app.api.system.releaseTool.fields.maxParallelJobs.title",
              description:
                "app.api.system.releaseTool.fields.maxParallelJobs.description",
              optional: true,
            },
            z.coerce.number().optional(),
          ),

          continueOnError: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.continueOnError.title",
              description:
                "app.api.system.releaseTool.fields.continueOnError.description",
              optional: true,
            },
            z.boolean().optional(),
          ),

          verifyGitStatus: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.verifyGitStatus.title",
              description:
                "app.api.system.releaseTool.fields.verifyGitStatus.description",
              optional: true,
            },
            z.boolean().optional(),
          ),

          requireCleanWorkingDir: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label:
                "app.api.system.releaseTool.fields.requireCleanWorkingDir.title",
              description:
                "app.api.system.releaseTool.fields.requireCleanWorkingDir.description",
              optional: true,
            },
            z.boolean().optional(),
          ),

          verifyLockfile: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.BOOLEAN,
              label: "app.api.system.releaseTool.fields.verifyLockfile.title",
              description:
                "app.api.system.releaseTool.fields.verifyLockfile.description",
              optional: true,
            },
            z.boolean().optional(),
          ),

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
              main: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.branchMain.title",
                },
                z.string().optional().default("main"),
              ),
              develop: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label:
                    "app.api.system.releaseTool.fields.branchDevelop.title",
                  optional: true,
                },
                z.string().optional(),
              ),
              allowNonMain: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.releaseTool.fields.allowNonMain.title",
                },
                z.boolean().optional().default(false),
              ),
              protected: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label:
                    "app.api.system.releaseTool.fields.protectedBranches.title",
                  optional: true,
                },
                z.array(z.string()).optional(),
              ),
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
              enabled: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label:
                    "app.api.system.releaseTool.fields.notificationsEnabled.title",
                },
                z.boolean().optional().default(false),
              ),
              webhookUrl: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.webhookUrl.title",
                  optional: true,
                },
                z.string().optional(),
              ),
              type: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.SELECT,
                  label: "app.api.system.releaseTool.fields.webhookType.title",
                  options: [
                    { value: "slack", label: "Slack" },
                    { value: "discord", label: "Discord" },
                    { value: "teams", label: "Microsoft Teams" },
                    { value: "custom", label: "Custom" },
                  ],
                  optional: true,
                },
                WebhookTypeSchema.optional(),
              ),
              onSuccess: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.releaseTool.fields.onSuccess.title",
                },
                z.boolean().optional().default(true),
              ),
              onFailure: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.releaseTool.fields.onFailure.title",
                },
                z.boolean().optional().default(true),
              ),
              messageTemplate: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label:
                    "app.api.system.releaseTool.fields.messageTemplate.title",
                  optional: true,
                },
                z.string().optional(),
              ),
              includeTimings: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label:
                    "app.api.system.releaseTool.fields.includeTimings.title",
                  optional: true,
                },
                z.boolean().optional(),
              ),
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
              maxAttempts: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.NUMBER,
                  label: "app.api.system.releaseTool.fields.maxAttempts.title",
                },
                z.coerce.number().optional().default(3),
              ),
              delayMs: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.NUMBER,
                  label: "app.api.system.releaseTool.fields.delayMs.title",
                },
                z.coerce.number().optional().default(1000),
              ),
              backoffMultiplier: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.NUMBER,
                  label:
                    "app.api.system.releaseTool.fields.backoffMultiplier.title",
                },
                z.coerce.number().optional().default(2),
              ),
              maxDelayMs: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.NUMBER,
                  label: "app.api.system.releaseTool.fields.maxDelayMs.title",
                },
                z.coerce.number().optional().default(30000),
              ),
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
              enabled: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label:
                    "app.api.system.releaseTool.fields.rollbackEnabled.title",
                },
                z.boolean().optional().default(false),
              ),
              git: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label: "app.api.system.releaseTool.fields.rollbackGit.title",
                },
                z.boolean().optional().default(true),
              ),
              version: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.BOOLEAN,
                  label:
                    "app.api.system.releaseTool.fields.rollbackVersion.title",
                },
                z.boolean().optional().default(true),
              ),
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
              columns: 12,
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
                directory: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.directory.title",
                  },
                  z.string(),
                ),
                name: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.name.title",
                    optional: true,
                  },
                  z.string().optional(),
                ),
                updateDeps: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.updateDeps.title",
                    description:
                      "app.api.system.releaseTool.fields.updateDeps.description",
                  },
                  z
                    .union([z.boolean(), z.literal("force")])
                    .optional()
                    .default(false),
                ),
                clean: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.clean.title",
                    description:
                      "app.api.system.releaseTool.fields.clean.description",
                    optional: true,
                  },
                  z.union([z.boolean(), z.string()]).optional(),
                ),
                lint: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.lint.title",
                    description:
                      "app.api.system.releaseTool.fields.lint.description",
                  },
                  z.union([z.boolean(), z.string()]).optional().default(true),
                ),
                typecheck: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.typecheck.title",
                    description:
                      "app.api.system.releaseTool.fields.typecheck.description",
                    optional: true,
                  },
                  z.union([z.boolean(), z.string()]).optional(),
                ),
                build: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.build.title",
                    description:
                      "app.api.system.releaseTool.fields.build.description",
                  },
                  z.union([z.boolean(), z.string()]).optional().default(true),
                ),
                test: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.test.title",
                    description:
                      "app.api.system.releaseTool.fields.test.description",
                  },
                  z.union([z.boolean(), z.string()]).optional().default(true),
                ),
                snyk: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.BOOLEAN,
                    label: "app.api.system.releaseTool.fields.snyk.title",
                    optional: true,
                  },
                  z.boolean().optional(),
                ),
                install: requestDataField(
                  {
                    type: WidgetType.FORM_FIELD,
                    fieldType: FieldDataType.TEXT,
                    label: "app.api.system.releaseTool.fields.install.title",
                    description:
                      "app.api.system.releaseTool.fields.install.description",
                    optional: true,
                  },
                  z.union([z.boolean(), z.string()]).optional(),
                ),

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
                    version: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.releaseVersion.title",
                        optional: true,
                      },
                      z.string().optional(),
                    ),
                    tagPrefix: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.tagPrefix.title",
                      },
                      z.string().optional().default("v"),
                    ),
                    tagSuffix: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.tagSuffix.title",
                        optional: true,
                      },
                      z.string().optional(),
                    ),
                    prereleaseId: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.prereleaseId.title",
                        optional: true,
                      },
                      z.string().optional(),
                    ),
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
                        command: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.ciCommand.title",
                            description:
                              "app.api.system.releaseTool.fields.ciCommand.description",
                          },
                          z.array(z.string()),
                        ),
                        env: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.ciEnvMapping.title",
                            description:
                              "app.api.system.releaseTool.fields.ciEnvMapping.description",
                            optional: true,
                          },
                          z.record(z.string(), z.string()).optional(),
                        ),
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
                        skipTag: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.skipTag.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        skipPush: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.skipPush.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        skipCommit: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.skipCommit.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        commitMessage: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.commitMessage.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        signCommit: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.signCommit.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        signTag: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.signTag.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        remote: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.remote.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
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
                        enabled: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.npmEnabled.title",
                          },
                          z.boolean().optional().default(true),
                        ),
                        registry: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.npmRegistry.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        tag: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.npmTag.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        access: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.SELECT,
                            label:
                              "app.api.system.releaseTool.fields.npmAccess.title",
                            options: [
                              { value: "public", label: "Public" },
                              { value: "restricted", label: "Restricted" },
                            ],
                            optional: true,
                          },
                          NpmAccessSchema.optional(),
                        ),
                        otpEnvVar: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.otpEnvVar.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        provenance: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.provenance.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        ignoreScripts: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.ignoreScripts.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        dryRun: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.npmDryRun.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
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
                        enabled: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.jsrEnabled.title",
                          },
                          z.boolean().optional().default(false),
                        ),
                        allowSlowTypes: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.allowSlowTypes.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        allowDirty: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.allowDirty.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        dryRun: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.jsrDryRun.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
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
                        enabled: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.changelogEnabled.title",
                          },
                          z.boolean().optional().default(false),
                        ),
                        file: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.changelogFile.title",
                          },
                          z.string().optional().default("CHANGELOG.md"),
                        ),
                        header: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.changelogHeader.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        compareUrlFormat: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.compareUrlFormat.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        commitUrlFormat: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.commitUrlFormat.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        includeBody: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.includeBody.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        preset: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.SELECT,
                            label:
                              "app.api.system.releaseTool.fields.changelogPreset.title",
                            options: [
                              {
                                value: "conventional-commits",
                                label: "Conventional Commits",
                              },
                              { value: "angular", label: "Angular" },
                              { value: "atom", label: "Atom" },
                              { value: "eslint", label: "ESLint" },
                              { value: "ember", label: "Ember" },
                            ],
                            optional: true,
                          },
                          ChangelogPresetSchema.optional(),
                        ),
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
                        enabled: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.gitReleaseEnabled.title",
                          },
                          z.boolean().optional().default(false),
                        ),
                        title: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.releaseTitle.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        generateNotes: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.generateNotes.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        body: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.releaseBody.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        draft: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.draft.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        prerelease: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.BOOLEAN,
                            label:
                              "app.api.system.releaseTool.fields.prerelease.title",
                            optional: true,
                          },
                          z.boolean().optional(),
                        ),
                        discussionCategory: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.discussionCategory.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        target: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.target.title",
                            optional: true,
                          },
                          z.string().optional(),
                        ),
                        assets: requestDataField(
                          {
                            type: WidgetType.FORM_FIELD,
                            fieldType: FieldDataType.TEXT,
                            label:
                              "app.api.system.releaseTool.fields.assets.title",
                            description:
                              "app.api.system.releaseTool.fields.assets.description",
                            optional: true,
                          },
                          z
                            .array(
                              z.object({
                                path: z.string(),
                                name: z.string().optional(),
                                label: z.string().optional(),
                                contentType: z.string().optional(),
                              }),
                            )
                            .optional(),
                        ),
                      },
                    ),

                    // Folders to zip for release
                    foldersToZip: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.foldersToZip.title",
                        description:
                          "app.api.system.releaseTool.fields.foldersToZip.description",
                        optional: true,
                      },
                      z
                        .array(
                          z.object({
                            input: z.string(),
                            output: z.string(),
                          }),
                        )
                        .optional(),
                    ),

                    // Version bumper for non-package.json files
                    versionBumper: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.versionBumper.title",
                        description:
                          "app.api.system.releaseTool.fields.versionBumper.description",
                        optional: true,
                      },
                      z
                        .array(
                          z.object({
                            filePath: z.string(),
                            varName: z.string().optional(),
                            pattern: z.string().optional(),
                            replacement: z.string().optional(),
                          }),
                        )
                        .optional(),
                    ),
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
                    preInstall: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.preInstall.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postInstall: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postInstall.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    preClean: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.preClean.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postClean: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postClean.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    preLint: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.preLint.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postLint: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postLint.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    preBuild: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.preBuild.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postBuild: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postBuild.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    preTest: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.preTest.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postTest: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postTest.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    prePublish: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.prePublish.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postPublish: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postPublish.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    preRelease: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.preRelease.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
                    postRelease: requestDataField(
                      {
                        type: WidgetType.FORM_FIELD,
                        fieldType: FieldDataType.TEXT,
                        label:
                          "app.api.system.releaseTool.fields.postRelease.title",
                        optional: true,
                      },
                      z
                        .object({
                          command: z.string(),
                          cwd: z.string().optional(),
                          continueOnError: z.boolean().optional(),
                          env: z.record(z.string(), z.string()).optional(),
                          timeout: z.coerce.number().optional(),
                          shell: z.boolean().optional(),
                        })
                        .optional(),
                    ),
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
              preRelease: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.preRelease.title",
                  optional: true,
                },
                z
                  .object({
                    command: z.string(),
                    cwd: z.string().optional(),
                    continueOnError: z.boolean().optional(),
                    env: z.record(z.string(), z.string()).optional(),
                    timeout: z.coerce.number().optional(),
                    shell: z.boolean().optional(),
                  })
                  .optional(),
              ),
              postRelease: requestDataField(
                {
                  type: WidgetType.FORM_FIELD,
                  fieldType: FieldDataType.TEXT,
                  label: "app.api.system.releaseTool.fields.postRelease.title",
                  optional: true,
                },
                z
                  .object({
                    command: z.string(),
                    cwd: z.string().optional(),
                    continueOnError: z.boolean().optional(),
                    env: z.record(z.string(), z.string()).optional(),
                    timeout: z.coerce.number().optional(),
                    shell: z.boolean().optional(),
                  })
                  .optional(),
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
          type: WidgetType.TEXT,
          content: "app.api.system.releaseTool.response.success",
        },
        z.boolean(),
      ),

      output: responseField(
        {
          type: WidgetType.CODE_OUTPUT,
          title: "app.api.system.releaseTool.response.output",
        },
        z.string(),
      ),

      duration: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.releaseTool.response.duration",
        },
        z.coerce.number(),
      ),

      packagesProcessed: responseArrayOptionalField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            { key: "name", label: "Name" },
            { key: "directory", label: "Directory" },
            { key: "version", label: "Version" },
            { key: "tag", label: "Tag" },
            { key: "status", label: "Status" },
            { key: "message", label: "Message" },
          ],
        },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            name: responseField(
              { type: WidgetType.TEXT, content: "Name" },
              z.string(),
            ),
            directory: responseField(
              { type: WidgetType.TEXT, content: "Directory" },
              z.string(),
            ),
            version: responseField(
              { type: WidgetType.TEXT, content: "Version", optional: true },
              z.string().optional(),
            ),
            tag: responseField(
              { type: WidgetType.TEXT, content: "Tag", optional: true },
              z.string().optional(),
            ),
            status: responseField(
              { type: WidgetType.TEXT, content: "Status" },
              PackageStatusSchema,
            ),
            message: responseField(
              { type: WidgetType.TEXT, content: "Message", optional: true },
              z.string().optional(),
            ),
          },
        ),
      ),

      ciEnvironment: responseField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.system.releaseTool.response.ciEnvironment",
          optional: true,
        },
        z
          .object({
            isCI: z.boolean(),
            provider: CIProviderSchema.nullable(),
            branch: z.string().nullable(),
            commit: z.string().nullable(),
            pr: z.string().nullable(),
            tag: z.string().nullable(),
          })
          .optional(),
      ),

      errors: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.system.releaseTool.response.errors",
          optional: true,
        },
        z.string(),
      ),

      warnings: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.system.releaseTool.response.warnings",
          optional: true,
        },
        z.string(),
      ),

      gitInfo: responseField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.system.releaseTool.response.gitInfo",
          optional: true,
        },
        z
          .object({
            currentBranch: z.string().nullable(),
            lastTag: z.string().nullable(),
            newTag: z.string().nullable(),
            commitsSinceLastTag: z.coerce.number().nullable(),
            hasUncommittedChanges: z.boolean(),
          })
          .optional(),
      ),

      publishedPackages: responseArrayOptionalField(
        {
          type: WidgetType.DATA_TABLE,
          columns: [
            { key: "name", label: "Package" },
            { key: "version", label: "Version" },
            { key: "registry", label: "Registry" },
            { key: "url", label: "URL" },
          ],
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
            name: responseField(
              { type: WidgetType.TEXT, content: "Name" },
              z.string(),
            ),
            version: responseField(
              { type: WidgetType.TEXT, content: "Version" },
              z.string(),
            ),
            registry: responseField(
              { type: WidgetType.TEXT, content: "Registry" },
              z.string(),
            ),
            url: responseField(
              { type: WidgetType.TEXT, content: "URL", optional: true },
              z.string().optional(),
            ),
          },
        ),
      ),

      timings: responseField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.system.releaseTool.response.timings",
          optional: true,
        },
        z
          .object({
            total: z.coerce.number(),
            validation: z.coerce.number().optional(),
            install: z.coerce.number().optional(),
            clean: z.coerce.number().optional(),
            lint: z.coerce.number().optional(),
            typecheck: z.coerce.number().optional(),
            build: z.coerce.number().optional(),
            test: z.coerce.number().optional(),
            publish: z.coerce.number().optional(),
            changelog: z.coerce.number().optional(),
            gitOperations: z.coerce.number().optional(),
          })
          .optional(),
      ),

      rollbackPerformed: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.system.releaseTool.response.rollbackPerformed",
          optional: true,
        },
        z.boolean().optional(),
      ),

      notificationsSent: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
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
            type: responseField(
              { type: WidgetType.TEXT, content: "Type" },
              z.string(),
            ),
            success: responseField(
              { type: WidgetType.TEXT, content: "Success" },
              z.boolean(),
            ),
            message: responseField(
              { type: WidgetType.TEXT, content: "Message", optional: true },
              z.string().optional(),
            ),
          },
        ),
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
        configObject: {
          ci: true,
          packages: [{ directory: "./" }],
        },
      },
      dryRun: {
        configObject: {
          dryRun: true,
          verbose: true,
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

/** Package manager types */
export type PackageManager = "npm" | "yarn" | "pnpm" | "deno" | "bun";

/** Version increment types */
export type VersionIncrement =
  | "major"
  | "minor"
  | "patch"
  | "premajor"
  | "preminor"
  | "prepatch"
  | "prerelease";

/** CI environment detection */
export interface CIEnvironment {
  isCI: boolean;
  provider:
    | "github"
    | "gitlab"
    | "jenkins"
    | "circleci"
    | "travis"
    | "azure"
    | "bitbucket"
    | "drone"
    | "buildkite"
    | "woodpecker"
    | "teamcity"
    | "codeship"
    | "appveyor"
    | "codebuild"
    | "cloudbuild"
    | "semaphore"
    | "buddy"
    | "render"
    | "vercel"
    | "netlify"
    | "unknown"
    | null;
  branch: string | null;
  commit: string | null;
  pr: string | null;
  tag: string | null;
}

/** Package.json interface */
export interface PackageJson {
  name: string;
  version: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  updateIgnoreDependencies?: string[];
  private?: boolean;
  publishConfig?: {
    access?: "public" | "restricted";
    registry?: string;
    tag?: string;
  };
  repository?: {
    type: string;
    url: string;
  };
  workspaces?: string[] | { packages: string[] };
}

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
    | "verbose"
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

/** Hook configuration */
export interface ReleaseHook {
  command: string;
  cwd?: string;
  continueOnError?: boolean;
  env?: Record<string, string>;
  timeout?: number;
  shell?: boolean;
}

/** Folders to zip configuration */
export type FoldersToZip = {
  input: string;
  output: string;
}[];

/** Allowed version bumper file extensions */
export type AllowedVersionBumperExtension = "php" | "ts" | "js" | "json";
export type VersionBumperFileName =
  `${string}.${AllowedVersionBumperExtension}`;
