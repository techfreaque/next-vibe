/**
 * System Settings API Definition
 * GET: Read env configuration grouped by module
 * PATCH: Update .env file values - flat individual fields per env key
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  ENV_KEYS,
  type EnvFieldType,
  type EnvKeyMeta,
  type EnvKeyName,
} from "@/app/api/[locale]/system/generated/env-keys";

import { lazyCliWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-cli-widget";
import { scopedTranslation } from "./i18n";

const SystemSettingsWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.SystemSettingsWidget })),
);
const SystemSettingsPatchWidget = lazyCliWidget(() =>
  import("./widget").then((m) => ({ default: m.SystemSettingsPatchWidget })),
);

// Build one requestField per env key at runtime.
// EnvKeyName is a union of all literal key strings from the generated ENV_KEYS const.
// The return type is a mapped type over that union, giving createEndpoint concrete
// keys to enumerate for request schema inference.

interface EnvKeyField {
  type: typeof WidgetType.FORM_FIELD;
  fieldType: FieldDataType;
  label: string;
  description: string;
  placeholder: string;
  columns: 12;
  schema: z.ZodOptional<z.ZodTypeAny>;
  usage: { request: "data" };
  schemaType: "primitive";
}

const FIELD_TYPE_MAP: Record<EnvFieldType, FieldDataType> = {
  text: FieldDataType.TEXT,
  boolean: FieldDataType.BOOLEAN,
  number: FieldDataType.NUMBER,
  select: FieldDataType.SELECT,
  url: FieldDataType.URL,
  email: FieldDataType.EMAIL,
};

function buildEnvKeySchema(meta: EnvKeyMeta): z.ZodOptional<z.ZodTypeAny> {
  if (meta.fieldType === "boolean") {
    return z.boolean().optional();
  }
  if (meta.fieldType === "number") {
    return z.number().optional();
  }
  if (meta.fieldType === "select" && meta.options && meta.options.length > 0) {
    return z.enum(meta.options as [string, ...string[]]).optional();
  }
  return z.string().optional();
}

function buildEnvKeyField(meta: EnvKeyMeta): EnvKeyField {
  return {
    type: WidgetType.FORM_FIELD,
    fieldType: FIELD_TYPE_MAP[meta.fieldType] ?? FieldDataType.TEXT,
    label: meta.comment || meta.key,
    description: meta.comment,
    placeholder: meta.example,
    columns: 12,
    schema: buildEnvKeySchema(meta),
    usage: { request: "data" },
    schemaType: "primitive",
  };
}

function buildEnvKeyChildren(): { [K in EnvKeyName]: EnvKeyField } {
  return Object.fromEntries(
    ENV_KEYS.map((meta) => [meta.key, buildEnvKeyField(meta)]),
  ) as { [K in EnvKeyName]: EnvKeyField };
}

const ENV_KEY_CHILDREN = buildEnvKeyChildren();

// Shared sub-schemas
const settingEntrySchema = z.object({
  key: z.string(),
  value: z.string(),
  isSensitive: z.boolean(),
  isEncrypted: z.boolean().optional(),
  isConfigured: z.boolean(),
  comment: z.string(),
  example: z.string(),
  onboardingRequired: z.boolean(),
  onboardingStep: z.number().optional(),
  onboardingGroup: z.string().optional(),
  fieldType: z.string().optional(),
  options: z.array(z.string()).optional(),
  autoGenerate: z.enum(["hex32", "hex64"]).optional(),
  health: z.enum(["connected", "disconnected", "error"]).optional(),
});

const wizardStepSchema = z.object({
  step: z.number(),
  group: z.string(),
  fields: z.array(z.string()),
});

const settingModuleSchema = z.object({
  name: z.string(),
  configuredCount: z.number(),
  totalCount: z.number(),
  settings: z.array(settingEntrySchema),
});

/**
 * GET - Read system settings
 */
export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "settings"] as const,
  allowedRoles: [UserRole.ADMIN] as const,
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "settings" as const,
  category: "endpointCategories.systemTasks",
  tags: ["get.tags.settings" as const],
  aliases: ["system-settings", "settings"] as const,

  fields: customWidgetObject({
    render: SystemSettingsWidget,
    usage: { response: true } as const,
    children: {
      modules: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.modules.title" as const,
        schema: z.array(settingModuleSchema),
      }),
      wizardSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.wizardSteps.title" as const,
        schema: z.array(wizardStepSchema),
      }),
      isWritable: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.isWritable.title" as const,
        schema: z.boolean(),
      }),
      isDevMode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.isDevMode.title" as const,
        schema: z.boolean(),
      }),
      needsOnboarding: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.needsOnboarding.title" as const,
        schema: z.boolean(),
      }),
      onboardingIssues: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.onboardingIssues.title" as const,
        schema: z.array(z.string()),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  examples: {
    responses: {
      default: {
        modules: [
          {
            name: "env",
            configuredCount: 8,
            totalCount: 10,
            settings: [
              {
                key: "NODE_ENV",
                value: "development",
                isSensitive: false,
                isConfigured: true,
                comment: "",
                example: "development",
                onboardingRequired: false,
              },
              {
                key: "JWT_SECRET_KEY",
                value: "****",
                isSensitive: true,
                isConfigured: true,
                comment: "JWT signing secret",
                example: "REPLACE_WITH_openssl_rand_hex_32_output",
                onboardingRequired: true,
              },
            ],
          },
        ],
        wizardSteps: [
          {
            step: 1,
            group: "admin",
            fields: ["VIBE_ADMIN_USER_EMAIL", "VIBE_ADMIN_USER_PASSWORD"],
          },
          { step: 2, group: "database", fields: ["DATABASE_URL"] },
          {
            step: 3,
            group: "security",
            fields: ["JWT_SECRET_KEY", "CRON_SECRET"],
          },
          { step: 4, group: "ai", fields: ["OPENROUTER_API_KEY"] },
        ],
        isWritable: true,
        isDevMode: true,
        needsOnboarding: false,
        onboardingIssues: [],
      },
    },
  },
});

/**
 * PATCH - Update .env settings
 */
export const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["system", "settings"] as const,
  allowedRoles: [UserRole.ADMIN] as const,
  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "settings" as const,
  category: "endpointCategories.systemTasks",
  tags: ["patch.tags.settings" as const],
  aliases: ["init", "set-setting"] as const,

  fields: customWidgetObject({
    render: SystemSettingsPatchWidget,
    usage: { request: "data", response: true } as const,
    children: {
      ...ENV_KEY_CHILDREN,
      updated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.updated.title" as const,
        schema: z.array(z.string()),
      }),
      needsRestart: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.needsRestart.title" as const,
        schema: z.boolean(),
      }),
      resultMessage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "patch.response.resultMessage.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      default: {
        VIBE_ADMIN_USER_PASSWORD: "my-new-secure-password-123",
      },
      multiKey: {
        VIBE_ADMIN_USER_PASSWORD: "my-new-secure-password-123",
        DATABASE_URL: "postgres://localhost:5432/mydb",
      },
    },
    responses: {
      default: {
        updated: ["VIBE_ADMIN_USER_PASSWORD"],
        needsRestart: true,
        resultMessage: "Settings updated",
      },
    },
  },
});

export type SystemSettingsGetResponseOutput = typeof GET.types.ResponseOutput;
/**
 * Flat record of env key → string value (each key is optional).
 * Route handler assembles non-undefined values into the settings record
 * before passing to the repository.
 */
export type SystemSettingsPatchRequestInput = Record<
  string,
  string | undefined
>;
export type SystemSettingsPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

const endpoints = { GET, PATCH };
export default endpoints;
