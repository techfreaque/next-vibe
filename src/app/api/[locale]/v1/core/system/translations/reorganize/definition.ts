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

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-endpoint";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-backend/shared/field-utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Translation Reorganization POST Endpoint
 * Reorganizes translation files and removes unused keys
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "system", "translations", "reorganize"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.system.translations.reorganize.post.title",
  description:
    "app.api.v1.core.system.translations.reorganize.post.description",
  category: "app.api.v1.core.system.translations.category",
  tags: [
    "app.api.v1.core.system.translations.tags.reorganize",
    "app.api.v1.core.system.translations.tags.maintenance",
    "app.api.v1.core.system.translations.tags.i18n",
  ],

  // CLI configuration
  aliases: ["translations:reorganize", "tr"],
  cli: {
    firstCliArgKey: "removeUnused",
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.system.translations.reorganize.post.container.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      removeUnused: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.reorganize.post.fields.removeUnused.title" as const,
          description:
            "app.api.v1.core.system.translations.reorganize.post.fields.removeUnused.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      dryRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.reorganize.post.fields.dryRun.title" as const,
          description:
            "app.api.v1.core.system.translations.reorganize.post.fields.dryRun.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),

      backup: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.reorganize.post.fields.backup.title" as const,
          description:
            "app.api.v1.core.system.translations.reorganize.post.fields.backup.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(true),
      ),

      regenerateStructure: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.reorganize.post.fields.regenerateStructure.title" as const,
          description:
            "app.api.v1.core.system.translations.reorganize.post.fields.regenerateStructure.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      regenerateKeys: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.system.translations.reorganize.post.fields.regenerateKeys.title" as const,
          description:
            "app.api.v1.core.system.translations.reorganize.post.fields.regenerateKeys.description" as const,
          layout: { columns: 6 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.system.translations.reorganize.post.success.title" as const,
          description:
            "app.api.v1.core.system.translations.reorganize.post.success.description" as const,
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.reorganize.post.fields.success.title",
            },
            z.boolean(),
          ),

          summary: objectField(
            {
              type: WidgetType.STATS_GRID,
              title:
                "app.api.v1.core.system.translations.reorganize.post.fields.summary.title" as const,
              description:
                "app.api.v1.core.system.translations.reorganize.post.description" as const,
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              totalKeys: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.foundKeys",
                },
                z.number(),
              ),
              usedKeys: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.foundKeys",
                },
                z.number(),
              ),
              unusedKeys: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.foundKeys",
                },
                z.number(),
              ),
              keysRemoved: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.removingKeys",
                },
                z.number(),
              ),
              filesUpdated: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.regeneratedStructure",
                },
                z.number(),
              ),
              filesCreated: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.regeneratedStructure",
                },
                z.number(),
              ),
              backupCreated: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.system.translations.reorganize.post.messages.backupCreated",
                },
                z.boolean(),
              ),
            },
          ),

          output: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.reorganize.post.fields.output.title",
            },
            z.string(),
          ),

          duration: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.reorganize.post.fields.duration.title",
            },
            z.number(),
          ),

          backupPath: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.system.translations.reorganize.post.fields.backupPath.title",
            },
            z.string().optional(),
          ),

          changes: responseArrayField(
            {
              type: WidgetType.GROUPED_LIST,
              groupBy: "type",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.system.translations.reorganize.post.fields.changes.title" as const,
                description:
                  "app.api.v1.core.system.translations.reorganize.post.description" as const,
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                type: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.system.translations.reorganize.post.fields.changes.title",
                  },
                  z.enum(["removed", "updated", "created", "regenerated"]),
                ),
                path: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.system.translations.reorganize.post.fields.changes.title",
                  },
                  z.string(),
                ),
                description: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.system.translations.reorganize.post.description",
                  },
                  z.string(),
                ),
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
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.forbidden.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.title",
      description:
        "app.api.v1.core.system.translations.reorganize.post.errors.validation.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.system.translations.reorganize.post.success.title",
    description:
      "app.api.v1.core.system.translations.reorganize.post.success.description",
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
