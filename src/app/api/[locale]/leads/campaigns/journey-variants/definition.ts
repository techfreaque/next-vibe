/**
 * Journey Variants API Definition
 * GET/POST/PATCH endpoints for email journey variant registration
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  CampaignTypeDB,
  CampaignTypeOptions,
} from "../../../messenger/accounts/enum";
import { scopedTranslation } from "./i18n";
import { JourneyVariantsWidget } from "./widget";

// ── Shared item schema ────────────────────────────────────────────────────────

const variantItemSchema = objectField(scopedTranslation, {
  type: WidgetType.CONTAINER,
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { response: true },
  children: {
    id: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.id",
      schema: z.string(),
    }),
    variantKey: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.variantKey",
      schema: z.string(),
    }),
    displayName: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.displayName",
      schema: z.string(),
    }),
    description: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.description",
      schema: z.string().nullable(),
    }),
    weight: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.weight",
      schema: z.number(),
    }),
    active: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.active",
      schema: z.boolean(),
    }),
    campaignType: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.campaignType",
      schema: z.string().nullable(),
    }),
    sourceFilePath: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.sourceFilePath",
      schema: z.string().nullable(),
    }),
    senderName: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.senderName",
      schema: z.string().nullable(),
    }),
    companyName: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.companyName",
      schema: z.string().nullable(),
    }),
    companyEmail: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.companyEmail",
      schema: z.string().nullable(),
    }),
    checkErrors: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.checkErrors",
      schema: z.array(z.string()),
    }),
    createdAt: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.createdAt",
      schema: z.string(),
    }),
    updatedAt: responseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.updatedAt",
      schema: z.string(),
    }),
  },
});

// ── GET - list all registered variants ───────────────────────────────────────

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "journey-variants"],
  title: "get.title",
  description: "get.description",
  category: "endpointCategories.emailCampaigns",
  subCategory: "endpointCategories.emailCampaignsJourneys",
  icon: "git-branch",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: JourneyVariantsWidget,
    usage: { response: true } as const,
    children: {
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total",
        schema: z.number(),
      }),
      items: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.items",
        description: "get.response.items",
        child: variantItemSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  examples: {
    requests: undefined,
    responses: {
      default: {
        total: 0,
        items: [],
      },
    },
  },
});

// ── POST - register a new variant ────────────────────────────────────────────

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "journey-variants"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.emailCampaigns",
  subCategory: "endpointCategories.emailCampaignsJourneys",
  icon: "plus",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      variantKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.variantKey.label",
        description: "post.fields.variantKey.description",
        columns: 6,
        schema: z
          .string()
          .min(2)
          .max(100)
          .regex(
            /^[A-Z0-9_]+$/,
            "Must be uppercase letters, digits and underscores",
          ),
      }),
      displayName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.displayName.label",
        description: "post.fields.displayName.description",
        columns: 6,
        schema: z.string().min(2).max(100),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.description.label",
        description: "post.fields.description.description",
        columns: 12,
        schema: z.string().max(500).optional(),
      }),
      weight: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.weight.label",
        description: "post.fields.weight.description",
        columns: 4,
        schema: z.number().int().min(1).max(100).default(33),
      }),
      campaignType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.campaignType.label",
        description: "post.fields.campaignType.description",
        options: CampaignTypeOptions,
        columns: 4,
        schema: z.enum(CampaignTypeDB).optional(),
      }),
      sourceFilePath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.sourceFilePath.label",
        description: "post.fields.sourceFilePath.description",
        columns: 4,
        schema: z.string().max(500).optional(),
      }),
      senderName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.senderName.label",
        description: "post.fields.senderName.description",
        columns: 4,
        schema: z.string().max(200).optional(),
      }),
      companyName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.companyName.label",
        description: "post.fields.companyName.description",
        columns: 4,
        schema: z.string().max(200).optional(),
      }),
      companyEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.companyEmail.label",
        description: "post.fields.companyEmail.description",
        columns: 4,
        schema: z.string().email().optional(),
      }),

      // Response - the created record
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id",
        schema: z.string(),
      }),
      active: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.active",
        schema: z.boolean(),
      }),
      checkErrors: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.checkErrors",
        schema: z.array(z.string()),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.createdAt",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        variantKey: "MY_VARIANT",
        displayName: "My Custom Variant",
        weight: 33,
      },
    },
    responses: {
      default: {
        id: "00000000-0000-0000-0000-000000000000",
        active: true,
        checkErrors: [],
        createdAt: new Date().toISOString(),
      },
    },
  },
});

// ── PATCH - toggle active / update metadata ───────────────────────────────────

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["leads", "campaigns", "journey-variants"],
  title: "patch.title",
  description: "patch.description",
  category: "endpointCategories.emailCampaigns",
  subCategory: "endpointCategories.emailCampaignsJourneys",
  icon: "edit",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.title",
    description: "patch.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      id: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.id.label",
        description: "patch.fields.id.description",
        columns: 12,
        schema: z.string().uuid(),
      }),
      active: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.fields.active.label",
        description: "patch.fields.active.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),
      weight: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.fields.weight.label",
        description: "patch.fields.weight.description",
        columns: 4,
        schema: z.number().int().min(1).max(100).optional(),
      }),
      displayName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.displayName.label",
        description: "patch.fields.displayName.description",
        columns: 4,
        schema: z.string().min(2).max(100).optional(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.description.label",
        description: "patch.fields.description.description",
        columns: 12,
        schema: z.string().max(500).optional(),
      }),
      senderName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.senderName.label",
        description: "patch.fields.senderName.description",
        columns: 4,
        schema: z.string().max(200).optional().nullable(),
      }),
      companyName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.companyName.label",
        description: "patch.fields.companyName.description",
        columns: 4,
        schema: z.string().max(200).optional().nullable(),
      }),
      companyEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.companyEmail.label",
        description: "patch.fields.companyEmail.description",
        columns: 4,
        schema: z.string().email().optional().nullable(),
      }),

      // Response
      variantKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.variantKey",
        schema: z.string(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.updatedAt",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },
  examples: {
    requests: {
      default: {
        id: "00000000-0000-0000-0000-000000000000",
        active: true,
      },
    },
    responses: {
      default: {
        variantKey: "MY_VARIANT",
        updatedAt: new Date().toISOString(),
      },
    },
  },
});

export type JourneyVariantsGetResponseOutput = typeof GET.types.ResponseOutput;
export type JourneyVariantsPostRequestOutput = typeof POST.types.RequestOutput;
export type JourneyVariantsPostResponseOutput =
  typeof POST.types.ResponseOutput;
export type JourneyVariantsPatchRequestOutput =
  typeof PATCH.types.RequestOutput;
export type JourneyVariantsPatchResponseOutput =
  typeof PATCH.types.ResponseOutput;

const definitions = { GET, POST, PATCH };
export default definitions;
