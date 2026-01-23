/**
 * Translation Reorganization Endpoint Definition
 *
 * This endpoint provides functionality to:
 * - Reorganize translation files with proper structure
 * - Remove unused translation keys
 * - Generate translation files at deepest folder level
 * - Handle API routes with [locale] and non-API files without [locale]
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user/user-roles/enum";

/**
 * Translation Reorganization POST Endpoint
 * Reorganizes translation files and removes unused keys
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "translations", "reorganize"],
  allowedRoles: [
    // still a bit buggy - disabled to prevent AI from calling it
    UserRole.ADMIN,
  ],

  title: "app.api.system.translations.reorganize.post.title",
  description: "app.api.system.translations.reorganize.post.description",
  category: "app.api.system.translations.category",
  tags: [
    "app.api.system.translations.tags.reorganize",
    "app.api.system.translations.tags.maintenance",
    "app.api.system.translations.tags.i18n",
  ],
  icon: "languages",

  // CLI configuration
  aliases: ["translations:reorganize"],
  cli: {
    firstCliArgKey: "removeUnused",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.system.translations.reorganize.post.container.title",
      description:
        "app.api.system.translations.reorganize.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      removeUnused: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.translations.reorganize.post.fields.removeUnused.title" as const,
        description:
          "app.api.system.translations.reorganize.post.fields.removeUnused.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.translations.reorganize.post.fields.dryRun.title" as const,
        description:
          "app.api.system.translations.reorganize.post.fields.dryRun.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),

      backup: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.translations.reorganize.post.fields.backup.title" as const,
        description:
          "app.api.system.translations.reorganize.post.fields.backup.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),

      regenerateStructure: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.translations.reorganize.post.fields.regenerateStructure.title" as const,
        description:
          "app.api.system.translations.reorganize.post.fields.regenerateStructure.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),

      regenerateKeys: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.translations.reorganize.post.fields.regenerateKeys.title" as const,
        description:
          "app.api.system.translations.reorganize.post.fields.regenerateKeys.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.system.translations.reorganize.post.success.title" as const,
          description:
            "app.api.system.translations.reorganize.post.success.description" as const,
          layoutType: LayoutType.GRID,
          columns: 12,
        },
        { response: true },
        {
          success: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.system.translations.reorganize.post.fields.success.title",
            schema: z.boolean(),
          }),

          summary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.system.translations.reorganize.post.fields.summary.title" as const,
              description:
                "app.api.system.translations.reorganize.post.description" as const,
              layoutType: LayoutType.GRID,
              columns: 12,
            },
            { response: true },
            {
              totalKeys: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.foundKeys",
                schema: z.coerce.number(),
              }),
              usedKeys: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.foundKeys",
                schema: z.coerce.number(),
              }),
              unusedKeys: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.foundKeys",
                schema: z.coerce.number(),
              }),
              keysRemoved: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.removingKeys",
                schema: z.coerce.number(),
              }),
              filesUpdated: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.regeneratedStructure",
                schema: z.coerce.number(),
              }),
              filesCreated: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.regeneratedStructure",
                schema: z.coerce.number(),
              }),
              backupCreated: responseField({
                type: WidgetType.TEXT,
                content:
                  "app.api.system.translations.reorganize.post.messages.backupCreated",
                schema: z.boolean(),
              }),
            },
          ),

          output: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.system.translations.reorganize.post.fields.output.title",
            schema: z.string(),
          }),

          duration: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.system.translations.reorganize.post.fields.duration.title",
            schema: z.coerce.number(),
          }),

          backupPath: responseField({
            type: WidgetType.TEXT,
            content:
              "app.api.system.translations.reorganize.post.fields.backupPath.title",
            schema: z.string().optional(),
          }),

          changes: responseArrayField(
            {
              type: WidgetType.GROUPED_LIST,
              groupBy: "type",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.system.translations.reorganize.post.fields.changes.title" as const,
                description:
                  "app.api.system.translations.reorganize.post.description" as const,
                layoutType: LayoutType.GRID,
                columns: 12,
              },
              { response: true },
              {
                type: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.translations.reorganize.post.fields.changes.title",
                  schema: z.enum([
                    "removed",
                    "updated",
                    "created",
                    "regenerated",
                  ]),
                }),
                path: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.translations.reorganize.post.fields.changes.title",
                  schema: z.string(),
                }),
                description: responseField({
                  type: WidgetType.TEXT,
                  content:
                    "app.api.system.translations.reorganize.post.description",
                  schema: z.string(),
                }),
              },
            ),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.translations.reorganize.post.errors.unauthorized.title",
      description:
        "app.api.system.translations.reorganize.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.translations.reorganize.post.errors.forbidden.title",
      description:
        "app.api.system.translations.reorganize.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.system.translations.reorganize.post.errors.validation.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.system.translations.reorganize.post.success.title",
    description:
      "app.api.system.translations.reorganize.post.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        removeUnused: false,
        dryRun: true,
        backup: true,
        regenerateStructure: false,
        regenerateKeys: false,
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          summary: {
            totalKeys: 1247,
            usedKeys: 1189,
            unusedKeys: 58,
            keysRemoved: 0,
            filesUpdated: 0,
            filesCreated: 0,
            backupCreated: true,
          },
          output:
            "🌍 Translation Reorganization Tool\nℹ️ Dry run completed. No changes were made.\n📊 Found 1189/1247 translation keys in use\n📋 58 unused keys would be removed",
          duration: 1200,
          changes: [],
          backupPath:
            ".tmp/translations-backup/translations-2024-01-15T10-30-00-000Z",
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type TranslationReorganizeRequestInput = typeof POST.types.RequestInput;
export type TranslationReorganizeRequestOutput =
  typeof POST.types.RequestOutput;
export type TranslationReorganizeRequestUrlVariables =
  typeof POST.types.ResponseInput;
export type TranslationReorganizeResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST,
};

export default definitions;
