/**
 * User Profile (Me) API Endpoint Definition
 * Production-ready endpoints for user profile management
 */

import { dateSchema } from "next-vibe/shared/types/common.schema";
import { lazy } from "react";
import { z } from "zod";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  SkillCategoryDB,
  SkillOwnershipTypeDB,
  SkillTrustLevelDB,
} from "@/app/api/[locale]/agent/chat/skills/enum";
import { leadId } from "@/app/api/[locale]/leads/types";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  objectUnionField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import { iconSchema } from "@/app/api/[locale]/shared/types/common.schema";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { CountryLanguage } from "@/i18n/core/config";

import { UserRole } from "../../user-roles/enum";
import { userRoleResponseSchema } from "../../user-roles/types";
import { scopedTranslation } from "./i18n";

const MeUpdateWidget = lazy(() =>
  import("./widget").then((m) => ({ default: m.MeUpdateWidget })),
);

/**
 * GET /me - Retrieve current user profile or JWT payload
 * Supports both authenticated users (full profile) and public users (JWT payload only)
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "private", "me"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "user",
  category: "endpointCategories.userAuth",
  subCategory: "endpointCategories.userAuthProfile",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: objectUnionField(
    scopedTranslation,
    {
      type: WidgetType.CONTAINER,
      layoutType: LayoutType.STACKED,
    },
    { response: true },
    "isPublic",
    [
      // Public user variant (JWT payload only)
      objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.user.title" as const,
        description: "get.response.user.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          isPublic: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.isPublic" as const,
            schema: z.literal(true),
          }),
          leadId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.leadId" as const,
            schema: leadId,
          }),
        },
      }),
      // Private user variant (full profile)
      objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.user.title" as const,
        description: "get.response.user.description" as const,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          isPublic: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.isPublic" as const,
            schema: z.literal(false),
          }),
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.id" as const,
            schema: z.uuid(),
          }),
          leadId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.leadId" as const,
            schema: leadId.nullable(),
          }),
          email: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.email" as const,
            schema: z.email({
              message: "validationErrors.user.profile.email_invalid",
            }),
          }),
          privateName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.privateName" as const,
            schema: z.string(),
          }),
          publicName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.publicName" as const,
            schema: z.string(),
          }),
          locale: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.locale" as const,
            schema: z.string() as z.ZodType<CountryLanguage>,
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.isActive" as const,
            schema: z.boolean().nullable(),
          }),
          emailVerified: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.emailVerified" as const,
            schema: z.boolean().nullable(),
          }),
          requireTwoFactor: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.requireTwoFactor" as const,
            schema: z.boolean(),
          }),
          marketingConsent: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "get.response.marketingConsent" as const,
            schema: z.boolean(),
          }),
          userRoles: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.userRoles" as const,
            schema: z.array(userRoleResponseSchema),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.createdAt" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.updatedAt" as const,
            schema: dateSchema,
          }),
          stripeCustomerId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.stripeCustomerId" as const,
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
          creatorSlug: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.creatorSlug" as const,
            schema: z.string().nullable().optional(),
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
          avatarUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "get.response.avatarUrl" as const,
            schema: z.string().nullable().optional(),
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
    ] as const,
  ),

  // === ERROR HANDLING ===
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

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        isPublic: true,
        leadId: "550e8400-e29b-41d4-a716-446655440001",
      },
    },
  },
});

/**
 * POST /me - Update current user profile
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "me"],
  title: "update.title" as const,
  description: "update.description" as const,
  icon: "user-check" as const,
  category: "endpointCategories.userAuth",
  subCategory: "endpointCategories.userAuthProfile",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: customWidgetObject({
    render: MeUpdateWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === BASIC INFORMATION ===
      basicInfo: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.groups.basicInfo.title" as const,
        description: "update.groups.basicInfo.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          privateName: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "update.fields.privateName.label" as const,
            description: "update.fields.privateName.description" as const,
            placeholder: "update.fields.privateName.placeholder" as const,
            columns: 6,
            schema: z
              .string()
              .min(2, {
                message: "update.fields.privateName.validation.minLength",
              })
              .max(50, {
                message: "update.fields.privateName.validation.maxLength",
              })
              .optional(),
          }),

          publicName: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "update.fields.publicName.label" as const,
            description: "update.fields.publicName.description" as const,
            placeholder: "update.fields.publicName.placeholder" as const,
            columns: 6,
            schema: z
              .string()
              .min(2, {
                message: "update.fields.publicName.validation.minLength",
              })
              .max(50, {
                message: "update.fields.publicName.validation.maxLength",
              })
              .optional(),
          }),

          email: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "update.fields.email.label" as const,
            description: "update.fields.email.description" as const,
            placeholder: "update.fields.email.placeholder" as const,
            columns: 12,
            schema: z
              .string()
              .email({
                message: "update.fields.email.validation.invalid",
              })
              .optional(),
          }),
        },
      }),

      // === CREATOR / PROFILE INFO ===
      profileInfo: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.groups.profileInfo.title" as const,
        description: "update.groups.profileInfo.description" as const,
        layoutType: LayoutType.GRID,
        columns: 2,
        usage: { request: "data" },
        children: {
          bio: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.MARKDOWN_TEXTAREA,
            label: "update.fields.bio.label" as const,
            description: "update.fields.bio.description" as const,
            placeholder: "update.fields.bio.placeholder" as const,
            columns: 12,
            schema: z.string().max(500).optional().nullable(),
          }),
          websiteUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.websiteUrl.label" as const,
            description: "update.fields.websiteUrl.description" as const,
            placeholder: "update.fields.websiteUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          twitterUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.twitterUrl.label" as const,
            description: "update.fields.twitterUrl.description" as const,
            placeholder: "update.fields.twitterUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          youtubeUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.youtubeUrl.label" as const,
            description: "update.fields.youtubeUrl.description" as const,
            placeholder: "update.fields.youtubeUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          instagramUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.instagramUrl.label" as const,
            description: "update.fields.instagramUrl.description" as const,
            placeholder: "update.fields.instagramUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          tiktokUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.tiktokUrl.label" as const,
            description: "update.fields.tiktokUrl.description" as const,
            placeholder: "update.fields.tiktokUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          githubUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.githubUrl.label" as const,
            description: "update.fields.githubUrl.description" as const,
            placeholder: "update.fields.githubUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          facebookUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.facebookUrl.label" as const,
            description: "update.fields.facebookUrl.description" as const,
            placeholder: "update.fields.facebookUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          discordUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.discordUrl.label" as const,
            description: "update.fields.discordUrl.description" as const,
            placeholder: "update.fields.discordUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          tribeUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.tribeUrl.label" as const,
            description: "update.fields.tribeUrl.description" as const,
            placeholder: "update.fields.tribeUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          rumbleUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.rumbleUrl.label" as const,
            description: "update.fields.rumbleUrl.description" as const,
            placeholder: "update.fields.rumbleUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          odyseeUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.odyseeUrl.label" as const,
            description: "update.fields.odyseeUrl.description" as const,
            placeholder: "update.fields.odyseeUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          nostrUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.nostrUrl.label" as const,
            description: "update.fields.nostrUrl.description" as const,
            placeholder: "update.fields.nostrUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          gabUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "update.fields.gabUrl.label" as const,
            description: "update.fields.gabUrl.description" as const,
            placeholder: "update.fields.gabUrl.placeholder" as const,
            columns: 6,
            schema: z.url().optional().nullable(),
          }),
          creatorSlug: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "update.fields.creatorSlug.label" as const,
            description: "update.fields.creatorSlug.description" as const,
            placeholder: "update.fields.creatorSlug.placeholder" as const,
            columns: 12,
            schema: z
              .string()
              .max(60)
              .regex(
                /^[a-z0-9-]*$/,
                "update.fields.creatorSlug.validation.invalid" as never,
              )
              .optional()
              .nullable(),
          }),
          creatorAccentColor: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.COLOR,
            label: "update.fields.creatorAccentColor.label" as const,
            description:
              "update.fields.creatorAccentColor.description" as const,
            placeholder:
              "update.fields.creatorAccentColor.placeholder" as const,
            columns: 6,
            schema: z
              .string()
              .regex(/^#[0-9a-fA-F]{6}$/)
              .optional()
              .nullable(),
          }),
          creatorHeaderImageUrl: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "update.fields.creatorHeaderImageUrl.label" as const,
            description:
              "update.fields.creatorHeaderImageUrl.description" as const,
            placeholder:
              "update.fields.creatorHeaderImageUrl.placeholder" as const,
            columns: 6,
            schema: z.string().optional().nullable(),
          }),
        },
      }),

      // === PRIVACY AND PREFERENCES ===
      privacySettings: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.groups.privacySettings.title" as const,
        description: "update.groups.privacySettings.description" as const,
        layoutType: LayoutType.VERTICAL,
        usage: { request: "data" },
        children: {
          marketingConsent: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.BOOLEAN,
            label: "update.fields.marketingConsent.label" as const,
            description: "update.fields.marketingConsent.description" as const,
            columns: 12,
            schema: z.boolean().optional(),
          }),
        },
      }),

      // === RESPONSE FIELD ===
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "update.response.title" as const,
        description: "update.response.description" as const,
        layoutType: LayoutType.VERTICAL,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.success" as const,
            schema: z
              .boolean()
              .describe("Whether the profile update was successful"),
          }),
          message: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.message" as const,
            schema: z.string().describe("Human-readable update status message"),
          }),
          // === USER FIELDS (FLATTENED) ===
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.id" as const,
            schema: z.uuid(),
          }),
          leadId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.leadId" as const,
            schema: leadId.nullable(),
          }),
          isPublic: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.isPublic" as const,
            schema: z.literal(false),
          }),
          email: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.email" as const,
            schema: z.email({
              message: "validationErrors.user.profile.email_invalid",
            }),
          }),
          privateName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.privateName" as const,
            schema: z.string(),
          }),
          publicName: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.publicName" as const,
            schema: z.string(),
          }),
          locale: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.locale" as const,
            schema: z.string() as z.ZodType<CountryLanguage>,
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.isActive" as const,
            schema: z.boolean().nullable(),
          }),
          emailVerified: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.emailVerified" as const,
            schema: z.boolean().nullable(),
          }),
          requireTwoFactor: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.requireTwoFactor" as const,
            schema: z.boolean().optional(),
          }),
          marketingConsent: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "update.response.marketingConsent" as const,
            schema: z.boolean().optional(),
          }),
          userRoles: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.userRoles" as const,
            schema: z.array(userRoleResponseSchema),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.createdAt" as const,
            schema: dateSchema,
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.updatedAt" as const,
            schema: dateSchema,
          }),
          stripeCustomerId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.stripeCustomerId" as const,
            schema: z.string().nullable(),
          }),
          bio: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.bio" as const,
            schema: z.string().nullable().optional(),
          }),
          websiteUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.websiteUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          twitterUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.twitterUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          youtubeUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.youtubeUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          instagramUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.instagramUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          tiktokUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.tiktokUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          githubUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.githubUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          facebookUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.facebookUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          discordUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.discordUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          tribeUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.tribeUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          rumbleUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.rumbleUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          odyseeUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.odyseeUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          nostrUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.nostrUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          gabUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.gabUrl" as const,
            schema: z.string().nullable().optional(),
          }),
          creatorSlug: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.creatorSlug" as const,
            schema: z.string().nullable().optional(),
          }),
          creatorAccentColor: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.creatorAccentColor" as const,
            schema: z.string().nullable().optional(),
          }),
          creatorHeaderImageUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.creatorHeaderImageUrl" as const,
            schema: z.string().nullable().optional(),
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
          changesSummary: objectField(scopedTranslation, {
            type: WidgetType.CONTAINER,
            title: "update.response.changesSummary.title" as const,
            description: "update.response.changesSummary.description" as const,
            layoutType: LayoutType.GRID,
            columns: 12,
            usage: { response: true },
            children: {
              totalChanges: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "update.response.changesSummary.totalChanges" as const,
                schema: z.coerce.number().describe("Number of fields updated"),
              }),
              changedFields: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content:
                  "update.response.changesSummary.changedFields" as const,
                schema: z
                  .array(z.string())
                  .describe("List of updated field names"),
              }),
              verificationRequired: responseField(scopedTranslation, {
                type: WidgetType.BADGE,
                text: "update.response.changesSummary.verificationRequired" as const,
                schema: z
                  .boolean()
                  .describe("Whether email verification is needed"),
              }),
              lastUpdated: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "update.response.changesSummary.lastUpdated" as const,
                schema: z
                  .string()
                  .describe(
                    "When the profile was last updated (human-readable)",
                  ),
              }),
            },
          }),
          nextSteps: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "update.response.nextSteps" as const,
            schema: z
              .array(z.string())
              .describe("Recommended actions after profile update"),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "update.errors.validation.title" as const,
      description: "update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "update.errors.unauthorized.title" as const,
      description: "update.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "update.errors.forbidden.title" as const,
      description: "update.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "update.errors.notFound.title" as const,
      description: "update.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "update.errors.conflict.title" as const,
      description: "update.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "update.errors.network.title" as const,
      description: "update.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "update.errors.unsavedChanges.title" as const,
      description: "update.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "update.errors.internal.title" as const,
      description: "update.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "update.errors.unknown.title" as const,
      description: "update.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "update.success.title" as const,
    description: "update.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        basicInfo: {
          privateName: "John Doe",
          publicName: "JD",
          email: "customer@example.com",
        },
        profileInfo: {
          bio: "I build AI tools for creators.",
        },
        privacySettings: {
          marketingConsent: true,
        },
      },
      failed: {
        basicInfo: {
          privateName: "",
          publicName: "",
          email: "invalid-email",
        },
        profileInfo: {},
        privacySettings: {
          marketingConsent: false,
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Profile updated successfully",
          id: "550e8400-e29b-41d4-a716-446655440000",
          leadId: "550e8400-e29b-41d4-a716-446655440001",
          isPublic: false,
          email: "customer@example.com",
          privateName: "John Doe",
          publicName: "JD",
          locale: "en-GLOBAL",
          userRoles: [],
          createdAt: "",
          updatedAt: "",
          requireTwoFactor: false,
          marketingConsent: true,
          isActive: true,
          emailVerified: true,
          stripeCustomerId: null,
          skills: [],
          changesSummary: {
            totalChanges: 1,
            changedFields: ["publicName"],
            verificationRequired: false,
            lastUpdated: "2 seconds ago",
          },
          nextSteps: ["Profile updated"],
        },
      },
    },
  },
});

/**
 * DELETE /me - Delete current user account
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "private", "me"],
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "user-x" as const,
  category: "endpointCategories.userAuth",
  subCategory: "endpointCategories.userAuthProfile",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.response.title" as const,
    description: "delete.response.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      exists: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.title" as const,
        schema: z.boolean(),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.internal.title" as const,
      description: "delete.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        exists: true,
      },
    },
  },
});

/**
 * User Me API endpoints
 * Combines all me endpoints into a single object
 */
const meEndpoints = { GET, POST, DELETE } as const;
export default meEndpoints;

// Export types as required by migration guide
export type MeGetRequestInput = typeof GET.types.RequestInput;
export type MeGetRequestOutput = typeof GET.types.RequestOutput;
export type MeGetResponseInput = typeof GET.types.ResponseInput;
export type MeGetResponseOutput = typeof GET.types.ResponseOutput;

export type MePostRequestInput = typeof POST.types.RequestInput;
export type MePostRequestOutput = typeof POST.types.RequestOutput;
export type MePostResponseInput = typeof POST.types.ResponseInput;
export type MePostResponseOutput = typeof POST.types.ResponseOutput;

export type MeDeleteRequestInput = typeof DELETE.types.RequestInput;
export type MeDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type MeDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type MeDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
