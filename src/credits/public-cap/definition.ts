/**
 * Public Free-Tier Daily Cap Endpoint Definition
 * GET: view today's spend + cap (admin only)
 * POST: update cap amount (admin only)
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { CREDITS_PUBLIC_CAP_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const PublicCapContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PublicCapContainer })),
);
const PublicCapUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PublicCapUpdateContainer })),
);

// ── GET ───────────────────────────────────────────────────────────────────

const { GET } = createEndpoint({
  scopedTranslation,
  path: ["credits", "public-cap"],
  aliases: [CREDITS_PUBLIC_CAP_ALIAS] as const,
  category: "credits" as const,
  subCategory: "Management" as const,
  tags: ["tags.publicCap" as const, "tags.admin" as const],
  icon: "shield" as const,
  allowedRoles: [UserRole.ADMIN] as const,

  method: Methods.GET,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,

  fields: customWidgetObject({
    render: PublicCapContainer,
    usage: { response: true } as const,
    children: {
      spendToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.spendToday.content" as const,
        schema: z.number(),
      }),
      capAmount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.capAmount.content" as const,
        schema: z.number(),
      }),
      remainingToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.remainingToday.content" as const,
        schema: z.number(),
      }),
      percentUsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.percentUsed.content" as const,
        schema: z.number(),
      }),
      lastResetAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.lastResetAt.content" as const,
        schema: dateSchema,
      }),
      capExceeded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.capExceeded.content" as const,
        schema: z.boolean(),
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
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
        spendToday: 123,
        capAmount: 500,
        remainingToday: 377,
        percentUsed: 24.6,
        lastResetAt: "2026-03-07T00:00:00.000Z",
        capExceeded: false,
      },
    },
  },
});

// ── POST ──────────────────────────────────────────────────────────────────

const { POST } = createEndpoint({
  scopedTranslation,
  path: ["credits", "public-cap"],
  category: "credits" as const,
  subCategory: "Management" as const,
  tags: ["tags.publicCap" as const, "tags.admin" as const],
  icon: "shield" as const,
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF] as const,

  method: Methods.POST,
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,

  fields: customWidgetObject({
    render: PublicCapUpdateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      capAmount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.capAmount.label" as const,
        description: "post.capAmount.description" as const,
        placeholder: "post.capAmount.placeholder" as const,
        schema: z.coerce.number().positive(),
        columns: 12,
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.message.content" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      default: { capAmount: 500 },
    },
    responses: {
      default: { message: "Daily cap updated to 500 credits" },
    },
  },
});

const definitions = { GET, POST } as const;
export default definitions;

export type PublicCapGetResponseOutput = typeof GET.types.ResponseOutput;
export type PublicCapPostRequestOutput = typeof POST.types.RequestOutput;
export type PublicCapPostResponseOutput = typeof POST.types.ResponseOutput;
