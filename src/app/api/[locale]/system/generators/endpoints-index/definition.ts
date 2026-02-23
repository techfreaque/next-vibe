/**
 * Endpoints Index Generator Endpoint Definition
 * Simple endpoint for generating endpoints index files
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "endpoints-index"],
  title: "post.title",
  description: "post.description",
  category: "category",
  tags: ["post.title"],
  icon: "file-code",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.WEB_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      outputFile: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputFile.label",
        description: "post.fields.outputFile.description",
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/system/generated/endpoints.ts"),
      }),

      dryRun: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),
      message: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.title",
        schema: z.string(),
      }),
      endpointsFound: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.endpointsFound.title",
        schema: z.coerce.number(),
      }),
      duration: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/endpoints.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated endpoints index with 152 endpoints in 150ms",
        endpointsFound: 152,
        duration: 150,
      },
    },
  },

  errorTypes: {
    validation_failed: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    unauthorized: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    server_error: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    unknown_error: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    network_error: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    forbidden: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    not_found: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    conflict: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    unsaved_changes: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

const endpointsIndexGeneratorEndpoints = { POST };
export default endpointsIndexGeneratorEndpoints;
