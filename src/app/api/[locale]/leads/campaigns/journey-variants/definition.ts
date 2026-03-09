/**
 * Journey Variants API Definition
 * GET/POST/PATCH endpoints for email journey variant registration
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseArrayFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
} from "../../../emails/smtp-client/enum";
import { scopedTranslation } from "./i18n";
import { JourneyVariantsWidget } from "./widget";

// ── Shared item schema ────────────────────────────────────────────────────────

const variantItemSchema = scopedObjectFieldNew(scopedTranslation, {
  type: WidgetType.CONTAINER,
  layoutType: LayoutType.GRID,
  columns: 12,
  usage: { response: true },
  children: {
    id: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.id",
      schema: z.string(),
    }),
    variantKey: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.variantKey",
      schema: z.string(),
    }),
    displayName: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.displayName",
      schema: z.string(),
    }),
    description: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.description",
      schema: z.string().nullable(),
    }),
    weight: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.weight",
      schema: z.number(),
    }),
    active: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.active",
      schema: z.boolean(),
    }),
    campaignType: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.campaignType",
      schema: z.string().nullable(),
    }),
    sourceFilePath: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.sourceFilePath",
      schema: z.string().nullable(),
    }),
    checkErrors: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.checkErrors",
      schema: z.array(z.string()),
    }),
    createdAt: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.createdAt",
      schema: z.string(),
    }),
    updatedAt: scopedResponseField(scopedTranslation, {
      type: WidgetType.TEXT,
      content: "get.response.updatedAt",
      schema: z.string(),
    }),
  },
});

// ── Error types (reused across methods) ──────────────────────────────────────

function makeErrorTypes(
  method: "get" | "post" | "patch",
): Record<EndpointErrorTypes, { title: string; description: string }> {
  return {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: `${method}.errors.unauthorized.title`,
      description: `${method}.errors.unauthorized.description`,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: `${method}.errors.forbidden.title`,
      description: `${method}.errors.forbidden.description`,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: `${method}.errors.server.title`,
      description: `${method}.errors.server.description`,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: `${method}.errors.unknown.title`,
      description: `${method}.errors.unknown.description`,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: `${method}.errors.validation.title`,
      description: `${method}.errors.validation.description`,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: `${method}.errors.notFound.title`,
      description: `${method}.errors.notFound.description`,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: `${method}.errors.conflict.title`,
      description: `${method}.errors.conflict.description`,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: `${method}.errors.network.title`,
      description: `${method}.errors.network.description`,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: `${method}.errors.unsavedChanges.title`,
      description: `${method}.errors.unsavedChanges.description`,
    },
  };
}

// ── GET — list all registered variants ───────────────────────────────────────

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["leads", "campaigns", "journey-variants"],
  title: "get.title",
  description: "get.description",
  category: "app.endpointCategories.leads",
  icon: "git-branch",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: JourneyVariantsWidget,
    usage: { response: true } as const,
    children: {
      total: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total",
        schema: z.number(),
      }),
      items: scopedResponseArrayFieldNew(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "get.response.items",
        description: "get.response.items",
        child: variantItemSchema,
      }),
    },
  }),

  errorTypes: makeErrorTypes("get"),
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  examples: {
    requests: { default: {} },
    responses: {
      default: {
        total: 0,
        items: [],
      },
    },
  },
});

// ── POST — register a new variant ────────────────────────────────────────────

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "journey-variants"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.leads",
  icon: "plus-circle",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.title",
    description: "post.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      variantKey: scopedRequestField(scopedTranslation, {
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
      displayName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.displayName.label",
        description: "post.fields.displayName.description",
        columns: 6,
        schema: z.string().min(2).max(100),
      }),
      description: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.description.label",
        description: "post.fields.description.description",
        columns: 12,
        schema: z.string().max(500).optional(),
      }),
      weight: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.weight.label",
        description: "post.fields.weight.description",
        columns: 4,
        schema: z.number().int().min(1).max(100).default(33),
      }),
      campaignType: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.fields.campaignType.label",
        description: "post.fields.campaignType.description",
        options: CampaignTypeOptions,
        columns: 4,
        schema: z.enum(CampaignTypeDB).optional(),
      }),
      sourceFilePath: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.sourceFilePath.label",
        description: "post.fields.sourceFilePath.description",
        columns: 4,
        schema: z.string().max(500).optional(),
      }),

      // Response — the created record
      id: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id",
        schema: z.string(),
      }),
      active: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.active",
        schema: z.boolean(),
      }),
      checkErrors: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.checkErrors",
        schema: z.array(z.string()),
      }),
      createdAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.createdAt",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: makeErrorTypes("post"),
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
        variantKey: "MY_VARIANT",
        displayName: "My Custom Variant",
        description: null,
        weight: 33,
        campaignType: null,
        sourceFilePath: null,
        id: "00000000-0000-0000-0000-000000000000",
        active: true,
        checkErrors: [],
        createdAt: new Date().toISOString(),
      },
    },
  },
});

// ── PATCH — toggle active / update metadata ───────────────────────────────────

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["leads", "campaigns", "journey-variants"],
  title: "patch.title",
  description: "patch.description",
  category: "app.endpointCategories.leads",
  icon: "edit",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.title",
    description: "patch.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      id: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.id.label",
        description: "patch.fields.id.description",
        columns: 12,
        schema: z.string().uuid(),
      }),
      active: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "patch.fields.active.label",
        description: "patch.fields.active.description",
        columns: 4,
        schema: z.boolean().optional(),
      }),
      weight: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.fields.weight.label",
        description: "patch.fields.weight.description",
        columns: 4,
        schema: z.number().int().min(1).max(100).optional(),
      }),
      displayName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.displayName.label",
        description: "patch.fields.displayName.description",
        columns: 4,
        schema: z.string().min(2).max(100).optional(),
      }),
      description: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.fields.description.label",
        description: "patch.fields.description.description",
        columns: 12,
        schema: z.string().max(500).optional(),
      }),

      // Response
      variantKey: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.variantKey",
        schema: z.string(),
      }),
      updatedAt: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.updatedAt",
        schema: z.string(),
      }),
    },
  }),

  errorTypes: makeErrorTypes("patch"),
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
        id: "00000000-0000-0000-0000-000000000000",
        variantKey: "MY_VARIANT",
        active: true,
        weight: 33,
        displayName: "My Custom Variant",
        description: null,
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
