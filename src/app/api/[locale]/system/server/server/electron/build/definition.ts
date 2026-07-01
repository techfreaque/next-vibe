/**
 * Electron Build Endpoint Definition
 * Compiles main/preload via bun, optionally runs vibe build, then packages
 * with electron-builder.
 */

import { z } from "zod";

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";

import { scopedTranslation } from "next-vibe/server/server/electron/build/i18n";

import { ELECTRON_BUILD_ALIAS } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "server", "electron", "build"],
  aliases: [ELECTRON_BUILD_ALIAS],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "serverElectron",
  tags: ["tags.electronBuild"],
  icon: "package",
  timeoutMs: 0,
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
    UserRole.MCP_OFF,
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      viBuild: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.viBuild.title",
        description: "post.fields.viBuild.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      generate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.generate.title",
        description: "post.fields.generate.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      platform: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.platform.title",
        description: "post.fields.platform.description",
        columns: 12,
        options: [
          { value: "current", label: "post.fields.platform.options.current" },
          { value: "linux", label: "post.fields.platform.options.linux" },
          { value: "mac", label: "post.fields.platform.options.mac" },
          { value: "win", label: "post.fields.platform.options.win" },
          { value: "all", label: "post.fields.platform.options.all" },
        ],
        schema: z
          .enum(["current", "linux", "mac", "win", "all"])
          .default("current"),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.success.title",
        schema: z.boolean(),
      }),

      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.output.title",
        schema: z.string(),
      }),

      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),

      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.errors.title",
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
        viBuild: true,
        generate: true,
        platform: "current",
      },
      packageOnly: {
        viBuild: false,
        generate: false,
        platform: "current",
      },
      allPlatforms: {
        viBuild: true,
        generate: true,
        platform: "all",
      },
    },
    responses: {
      default: {
        success: true,
        output: "✅ Electron app packaged successfully",
        duration: 45000,
      },
      packageOnly: {
        success: true,
        output: "✅ Electron app packaged (skipped vibe build)",
        duration: 15000,
      },
      allPlatforms: {
        success: true,
        output: "✅ Electron app packaged for all platforms",
        duration: 120000,
      },
    },
  },
});

export type ElectronBuildRequestInput = typeof POST.types.RequestInput;
export type ElectronBuildRequestOutput = typeof POST.types.RequestOutput;
export type ElectronBuildResponseInput = typeof POST.types.ResponseInput;
export type ElectronBuildResponseOutput = typeof POST.types.ResponseOutput;

const electronBuildDefinition = { POST };
export default electronBuildDefinition;
