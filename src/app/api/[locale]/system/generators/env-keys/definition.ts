import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "env-keys"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.systemDevTools",
  tags: ["post.title"],
  icon: "key",
  allowedRoles: [],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      outputFile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.outputFile.label",
        description: "post.fields.outputFile.description",
        columns: 12,
        schema: z
          .string()
          .default("src/app/api/[locale]/system/generated/env-keys.ts"),
      }),

      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.dryRun.label",
        description: "post.fields.dryRun.description",
        columns: 6,
        schema: z.boolean().optional().default(false),
      }),

      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.message.title",
        schema: z.string(),
      }),
      keysFound: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.keysFound.title",
        schema: z.coerce.number(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.fields.duration.title",
        schema: z.coerce.number(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        outputFile: "src/app/api/[locale]/system/generated/env-keys.ts",
        dryRun: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Generated env keys with 42 keys in 85ms",
        keysFound: 42,
        duration: 85,
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
      title: "post.errors.internal.title",
      description: "post.errors.internal.description",
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
      title: "post.errors.unsaved.title",
      description: "post.errors.unsaved.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
});

const envKeysGeneratorEndpoints = { POST };
export default envKeysGeneratorEndpoints;
