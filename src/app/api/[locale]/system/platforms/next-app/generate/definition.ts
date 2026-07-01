/**
 * Generate Next App Definition
 * Emits Next.js page.tsx / route.ts re-export shells into src/generated/app.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/platforms/next-app/i18n";
import { objectField, responseField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  title: "generate.post.title",
  titleShort: "generate.post.titleShort",
  description: "generate.post.description",
  icon: "zap",
  category: "devTools",
  subCategory: "Build",
  tags: ["generate.post.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.WEB_OFF],
  aliases: ["generate:next", "next:generate"],
  method: Methods.POST,
  path: ["system", "platforms", "next-app", "generate"],
  examples: {
    responses: {
      default: {
        success: true,
        created: ["src/generated/app/[locale]/skills/page.tsx"],
        skipped: [],
        errors: [],
        message: "Next app shells generated successfully",
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "generate.post.title",
    description: "generate.post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "generate.post.response.fields.success",
        schema: z.boolean(),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "generate.post.response.fields.created",
        schema: z.array(z.string()),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "generate.post.response.fields.skipped",
        schema: z.array(z.string()),
      }),
      errors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "generate.post.response.fields.errors",
        schema: z.array(z.object({ file: z.string(), error: z.string() })),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "generate.post.response.fields.message",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "generate.post.errors.validation.title",
      description: "generate.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "generate.post.errors.unauthorized.title",
      description: "generate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "generate.post.errors.server.title",
      description: "generate.post.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "generate.post.errors.network.title",
      description: "generate.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "generate.post.errors.forbidden.title",
      description: "generate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "generate.post.errors.notFound.title",
      description: "generate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "generate.post.errors.unknown.title",
      description: "generate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "generate.post.errors.unsaved.title",
      description: "generate.post.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "generate.post.errors.conflict.title",
      description: "generate.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "generate.post.success.title",
    description: "generate.post.success.description",
  },
});

const endpoints = { POST };
export default endpoints;

export type GenerateNextRequestInput = typeof POST.types.RequestInput;
export type GenerateNextRequestOutput = typeof POST.types.RequestOutput;
export type GenerateNextResponseInput = typeof POST.types.ResponseInput;
export type GenerateNextResponseOutput = typeof POST.types.ResponseOutput;
