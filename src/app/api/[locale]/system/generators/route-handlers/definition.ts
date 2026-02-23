/**
 * Dynamic Route Handlers Generator Definition
 * Generates route-handlers.ts with dynamic imports and flat path structure
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
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "route-handlers"],
  title: "post.title" as const,
  description: "post.description" as const,
  category: "category" as const,
  tags: ["post.title" as const],
  icon: "file-code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      outputFile: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputFile.label" as const,
        description: "post.fields.outputFile.description" as const,
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/system/generated/route-handlers.ts"),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label" as const,
        description: "post.fields.dryRun.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title" as const,
        schema: z.boolean(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.title" as const,
        schema: z.string(),
      }),
      routesFound: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.routesFound.title" as const,
        schema: z.coerce.number(),
      }),
      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/route-handlers.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated dynamic route handlers with 152 routes in 150ms",
        routesFound: 152,
        duration: 150,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

const routeHandlersDynamicGeneratorEndpoints = { POST };
export default routeHandlersDynamicGeneratorEndpoints;
