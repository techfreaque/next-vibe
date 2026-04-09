/**
 * Public Creator Profile API Definition
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
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../../user-roles/enum";
import { scopedTranslation } from "./i18n";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "public", "creator", ":userId"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "user",
  category: "endpointCategories.userAuth",
  tags: ["tags.creator" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.form.title" as const,
    description: "get.form.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "urlPath", response: true },
    children: {
      userId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.form.userId.label" as const,
        description: "get.form.userId.description" as const,
        schema: z.uuid(),
        usage: { request: "urlPath" },
      }),
      publicName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.publicName" as const,
        schema: z.string(),
      }),
      avatarUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.avatarUrl" as const,
        schema: z.string().nullable(),
      }),
      bio: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.bio" as const,
        schema: z.string().nullable(),
      }),
      websiteUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.websiteUrl" as const,
        schema: z.string().nullable(),
      }),
      twitterUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.twitterUrl" as const,
        schema: z.string().nullable(),
      }),
      youtubeUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.youtubeUrl" as const,
        schema: z.string().nullable(),
      }),
      instagramUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.instagramUrl" as const,
        schema: z.string().nullable(),
      }),
      tiktokUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.tiktokUrl" as const,
        schema: z.string().nullable(),
      }),
      githubUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.githubUrl" as const,
        schema: z.string().nullable(),
      }),
      discordUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.discordUrl" as const,
        schema: z.string().nullable(),
      }),
      creatorAccentColor: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.creatorAccentColor" as const,
        schema: z.string().nullable(),
      }),
      creatorHeaderImageUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.creatorHeaderImageUrl" as const,
        schema: z.string().nullable(),
      }),
      skillCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.skillCount" as const,
        schema: z.number(),
      }),
      referralCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.referralCode" as const,
        schema: z.string().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
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
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        publicName: "Thea AI",
        avatarUrl: null,
        bio: "I build AI tools for creators.",
        websiteUrl: "https://example.com",
        twitterUrl: null,
        youtubeUrl: null,
        instagramUrl: null,
        tiktokUrl: null,
        githubUrl: null,
        discordUrl: null,
        creatorAccentColor: null,
        creatorHeaderImageUrl: null,
        skillCount: 5,
        referralCode: "thea2024",
      },
    },
  },
});

const creatorEndpoints = { GET } as const;
export default creatorEndpoints;

export type CreatorGetRequestInput = typeof GET.types.RequestInput;
export type CreatorGetRequestOutput = typeof GET.types.RequestOutput;
export type CreatorGetResponseInput = typeof GET.types.ResponseInput;
export type CreatorGetResponseOutput = typeof GET.types.ResponseOutput;
