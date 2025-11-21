/**
 * Link Referral to Lead API Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestResponseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "../../user/user-roles/enum";

/**
 * POST endpoint for linking referral code to lead
 */
export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "referral", "link-to-lead"],
  title: "app.api.v1.core.referral.linkToLead.post.title",
  description: "app.api.v1.core.referral.linkToLead.post.description",
  category: "app.api.v1.core.referral.category",
  tags: [
    "app.api.v1.core.referral.tags.referral",
    "app.api.v1.core.referral.tags.create",
  ],
  allowedRoles: [UserRole.PUBLIC] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.referral.linkToLead.post.form.title",
      description: "app.api.v1.core.referral.linkToLead.post.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      referralCode: requestResponseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.referral.form.fields.code.label",
          description: "app.api.v1.core.referral.form.fields.code.description",
          placeholder: "app.api.v1.core.referral.form.fields.code.placeholder",
          columns: 12,
        },
        z.string().min(1),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        referralCode: "FRIEND2024",
      },
      success: {
        referralCode: "FRIEND2024",
      },
    },
    responses: {
      default: {
        referralCode: "FRIEND2024",
      },
      success: {
        referralCode: "FRIEND2024",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.referral.errors.validation.title",
      description: "app.api.v1.core.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.referral.errors.notFound.title",
      description: "app.api.v1.core.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.referral.errors.serverError.title",
      description: "app.api.v1.core.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.referral.errors.network.title",
      description: "app.api.v1.core.referral.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.referral.errors.unauthorized.title",
      description: "app.api.v1.core.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.referral.errors.forbidden.title",
      description: "app.api.v1.core.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.referral.errors.conflict.title",
      description: "app.api.v1.core.referral.errors.conflict.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.referral.errors.unknown.title",
      description: "app.api.v1.core.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.referral.errors.unsavedChanges.title",
      description: "app.api.v1.core.referral.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.referral.linkToLead.success.title",
    description: "app.api.v1.core.referral.linkToLead.success.description",
  },
});

export type LinkToLeadPostRequestOutput = typeof POST.types.RequestOutput;
export type LinkToLeadPostResponseOutput = typeof POST.types.ResponseOutput;

export default { POST };
