/**
 * Electron Start Endpoint Definition
 * Compiles main/preload and launches the Electron desktop window in dev mode.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

export const ELECTRON_START_ALIAS = "electron:start" as const;
export const ELECTRON_START_DEV_ALIAS = "electron:dev" as const;
export const ELECTRON_ALIAS = "electron" as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "electron", "start"],
  aliases: [ELECTRON_ALIAS, ELECTRON_START_ALIAS, ELECTRON_START_DEV_ALIAS],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.system",
  tags: ["tags.electronStart"],
  icon: "monitor",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.MCP_OFF,
    UserRole.CLI_AUTH_BYPASS,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      vibeStart: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.vibeStart.title",
        description: "post.fields.vibeStart.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.output.title",
        schema: z.string(),
      }),

      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),

      errors: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.errors.title",
        schema: z.array(z.string()).optional(),
      }),
    },
  }),

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
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        vibeStart: true,
      },
      noVibeStart: {
        vibeStart: false,
      },
    },
    responses: {
      default: {
        success: true,
        output: "✅ Electron window opened at NEXT_PUBLIC_APP_URL",
        duration: 5000,
      },
      noVibeStart: {
        success: true,
        output: "✅ Electron window opened (vibe start skipped)",
        duration: 2000,
      },
    },
  },
});

export type ElectronStartRequestInput = typeof POST.types.RequestInput;
export type ElectronStartRequestOutput = typeof POST.types.RequestOutput;
export type ElectronStartResponseInput = typeof POST.types.ResponseInput;
export type ElectronStartResponseOutput = typeof POST.types.ResponseOutput;

const electronStartDefinition = { POST };
export default electronStartDefinition;
