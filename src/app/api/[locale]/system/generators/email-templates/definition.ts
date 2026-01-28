/**
 * Email Template Generator Definition
 * Generates registry/generated.ts with lazy-loaded email template imports
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["system", "generators", "email-templates"],
  title: "app.api.system.generators.emailTemplates.post.title" as const,
  description:
    "app.api.system.generators.emailTemplates.post.description" as const,
  category: "app.api.system.generators.category" as const,
  tags: ["app.api.system.generators.emailTemplates.post.title" as const],
  icon: "mail",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.generators.emailTemplates.post.container.title" as const,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      outputFile: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.system.generators.emailTemplates.post.fields.outputFile.label" as const,
        description:
          "app.api.system.generators.emailTemplates.post.fields.outputFile.description" as const,
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/emails/registry/generated.ts"),
      }),

      dryRun: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.system.generators.emailTemplates.post.fields.dryRun.label" as const,
        description:
          "app.api.system.generators.emailTemplates.post.fields.dryRun.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.emailTemplates.post.fields.success.title" as const,
        schema: z.boolean(),
      }),
      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.emailTemplates.post.fields.message.title" as const,
        schema: z.string(),
      }),
      templatesFound: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.emailTemplates.post.fields.templatesFound.title" as const,
        schema: z.coerce.number(),
      }),
      duration: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.generators.emailTemplates.post.fields.duration.title" as const,
        schema: z.coerce.number(),
      }),
    },
  ),

  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/emails/registry/generated.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated email template registry with 15 templates in 250ms",
        templatesFound: 15,
        duration: 250,
      },
    },
  },

  successTypes: {
    title:
      "app.api.system.generators.emailTemplates.post.success.title" as const,
    description:
      "app.api.system.generators.emailTemplates.post.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.validation.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.network.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.unauthorized.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.forbidden.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.notFound.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.server.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.unknown.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.generators.emailTemplates.post.errors.conflict.title" as const,
      description:
        "app.api.system.generators.emailTemplates.post.errors.conflict.description" as const,
    },
  },
});

export default { POST };
