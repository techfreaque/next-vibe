/**
 * Public Creator Profile API Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  objectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import {
  SkillCategoryDB,
  SkillOwnershipTypeDB,
  SkillTrustLevelDB,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { UserRole } from "../../../user-roles/enum";
import { scopedTranslation } from "./i18n";

const CreatorProfileWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CreatorProfileWidget })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "public", "creator", ":creatorId"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "user",
  category: "endpointCategories.userAuth",
  subCategory: "endpointCategories.userAuthDirectory",
  tags: ["tags.creator" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: CreatorProfileWidget,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      creatorId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.form.creatorId.label" as const,
        description: "get.form.creatorId.description" as const,
        hidden: true,
        schema: z.string(),
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
      facebookUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.facebookUrl" as const,
        schema: z.string().nullable(),
      }),
      discordUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.discordUrl" as const,
        schema: z.string().nullable(),
      }),
      tribeUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.tribeUrl" as const,
        schema: z.string().nullable(),
      }),
      rumbleUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.rumbleUrl" as const,
        schema: z.string().nullable(),
      }),
      odyseeUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.odyseeUrl" as const,
        schema: z.string().nullable(),
      }),
      nostrUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.nostrUrl" as const,
        schema: z.string().nullable(),
      }),
      gabUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.gabUrl" as const,
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
      referralCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.referralCode" as const,
        schema: z.string().nullable(),
      }),
      appName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.appName" as const,
        schema: z.string(),
      }),
      leadMagnetHeadline: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.leadMagnetHeadline" as const,
        schema: z.string().nullable(),
      }),
      leadMagnetButtonText: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.leadMagnetButtonText" as const,
        schema: z.string().nullable(),
      }),
      skills: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.INLINE,
          gap: "4",
          alignItems: "start",
          noCard: true,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string(),
            }),
            internalId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            skillId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string(),
            }),
            category: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(SkillCategoryDB),
            }),
            variantName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.string().nullable(),
            }),
            isVariant: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.boolean(),
            }),
            isDefault: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.boolean(),
            }),
            modelId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(ChatModelId).nullable(),
            }),
            icon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              containerSize: "lg",
              iconSize: "base",
              borderRadius: "lg",
              schema: iconSchema,
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "base",
              emphasis: "bold",
              inline: true,
              schema: z.string(),
            }),
            tagline: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              inline: true,
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              schema: z.string(),
            }),
            modelIcon: responseField(scopedTranslation, {
              type: WidgetType.ICON,
              iconSize: "xs",
              inline: true,
              noHover: true,
              schema: iconSchema,
            }),
            modelInfo: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              inline: true,
              variant: "muted",
              schema: z.string(),
            }),
            modelProvider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              size: "xs",
              variant: "muted",
              inline: true,
              schema: z.string(),
            }),
            ownershipType: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(SkillOwnershipTypeDB),
            }),
            trustLevel: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.enum(SkillTrustLevelDB).nullable(),
            }),
            voteCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              hidden: true,
              schema: z.number().int().nonnegative().nullable(),
            }),
          },
        }),
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
    urlPathParams: {
      default: { creatorId: "thea-ai" },
    },
    responses: {
      default: {
        publicName: "Thea AI",
        avatarUrl: null,
        bio: "I build AI tools for creators.",
        websiteUrl: "https://example.com",
        twitterUrl: null,
        youtubeUrl: null,
        instagramUrl: null,
        tiktokUrl: null,
        githubUrl: null,
        facebookUrl: null,
        discordUrl: null,
        tribeUrl: null,
        rumbleUrl: null,
        odyseeUrl: null,
        nostrUrl: null,
        gabUrl: null,
        creatorAccentColor: null,
        creatorHeaderImageUrl: null,
        referralCode: "thea2024",
        appName: "unbottled.ai",
        leadMagnetHeadline: null,
        leadMagnetButtonText: null,
        skills: [],
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
