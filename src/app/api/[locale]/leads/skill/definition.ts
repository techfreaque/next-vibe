/**
 * Lead Skill Attribution Definition
 * PATCH endpoint for recording which custom skill brought a lead (first-touch)
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["leads", "skill"],
  allowedRoles: [UserRole.PUBLIC] as const,

  title: "patch.title" as const,
  description: "patch.description" as const,
  icon: "zap",
  category: "endpointCategories.leads",
  subCategory: "endpointCategories.leadsManagement",
  tags: ["tags.leads" as const, "tags.skill" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "patch.title" as const,
    description: "patch.description" as const,
    usage: { request: "data", response: true } as const,
    children: {
      skillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.skillId.label" as const,
        description: "patch.skillId.description" as const,
        hidden: true,
        schema: z.string().uuid(),
      }),

      // === RESPONSE ===
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
        hidden: true,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    requests: {
      setAttribute: {
        skillId: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    responses: {
      attributed: {
        success: true,
      },
    },
  },
});

export type LeadSkillPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type LeadSkillPatchResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH };
export default definitions;
