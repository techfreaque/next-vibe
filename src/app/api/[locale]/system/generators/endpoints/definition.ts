/**
 * Generators Functional API Definition
 * Defines endpoints for functional generator operations
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { scopedTranslation } from "./i18n";

/**
 * Functional Generators Endpoint Definition
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "generators", "endpoints"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.systemDevTools",
  tags: ["post.title"],
  icon: "sparkles",

  // === ROLES ===
  allowedRoles: [
    // use vibe generate instead
  ],

  // === FIELDS ===
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      skipEndpoints: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipSeeds: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipCronTasks: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      skipTRPCRouter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      rootDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.string().optional(),
      }),

      verbose: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.title",
        description: "post.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // === RESPONSE FIELDS ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.title",
        schema: z.boolean(),
      }),
      generatorsRun: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.title",
        schema: z.coerce.number(),
      }),
      generatorsSkipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.title",
        schema: z.coerce.number(),
      }),
      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.title",
        schema: z.array(z.string()),
      }),
      results: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.title",
        schema: z.object({
          endpoints: z.boolean(),
          seeds: z.boolean(),
          cronTasks: z.boolean(),
          trpcRouter: z.boolean(),
        }),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.title",
      description: "post.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.title",
      description: "post.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "post.response.title",
    description: "post.response.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        skipEndpoints: false,
        skipSeeds: false,
        skipCronTasks: false,
        skipTRPCRouter: false,
        verbose: false,
      },
    },
    responses: {
      default: {
        success: true,
        generatorsRun: 4,
        generatorsSkipped: 0,
        output: [
          "Generated endpoints",
          "Generated seeds",
          "Generated cron tasks",
          "Generated tRPC router",
        ],
        results: {
          endpoints: true,
          seeds: true,
          cronTasks: true,
          trpcRouter: true,
        },
      },
    },
  },
});

const endpointsGeneratorEndpoints = { POST };
export default endpointsGeneratorEndpoints;
