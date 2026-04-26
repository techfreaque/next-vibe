/**
 * Public Free-Tier Daily Cap Endpoint Definition
 * GET: view today's spend + cap (admin only)
 * POST: update cap amount (admin only)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

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
  category: "endpointCategories.credits",
  subCategory: "endpointCategories.creditsManagement",
  tags: ["tags.publicCap", "tags.admin"],
  icon: "shield",
  allowedRoles: [UserRole.ADMIN] as const,

  method: Methods.GET,
  title: "get.title",
  description: "get.description",

  fields: customWidgetObject({
    render: PublicCapContainer,
    usage: { response: true } as const,
    children: {
      spendToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.spendToday.content",
        schema: z.number(),
      }),
      capAmount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.capAmount.content",
        schema: z.number(),
      }),
      remainingToday: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.remainingToday.content",
        schema: z.number(),
      }),
      percentUsed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.percentUsed.content",
        schema: z.number(),
      }),
      lastResetAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.lastResetAt.content",
        schema: z.string(),
      }),
      capExceeded: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.capExceeded.content",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
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
  category: "endpointCategories.credits",
  subCategory: "endpointCategories.creditsManagement",
  tags: ["tags.publicCap", "tags.admin"],
  icon: "shield",
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF] as const,

  method: Methods.POST,
  title: "post.title",
  description: "post.description",

  fields: customWidgetObject({
    render: PublicCapUpdateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      capAmount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.capAmount.label",
        description: "post.capAmount.description",
        placeholder: "post.capAmount.placeholder",
        schema: z.coerce.number().positive(),
        columns: 12,
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.message.content",
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

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
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
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
