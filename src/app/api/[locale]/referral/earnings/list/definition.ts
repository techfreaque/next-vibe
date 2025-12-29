/**
 * Referral Earnings List API Definition
 * Defines the API endpoint for listing referral earnings with pagination
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
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

import { UserRole } from "../../../user/user-roles/enum";

/**
 * GET endpoint for earnings list
 */
export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["referral", "earnings", "list"],
  title: "app.api.referral.earnings.list.get.title",
  description: "app.api.referral.earnings.list.get.description",
  category: "app.api.referral.category",
  icon: "dollar-sign" as const,
  tags: [
    "app.api.referral.tags.referral",
    "app.api.referral.tags.earnings",
    "app.api.referral.tags.list",
  ],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.referral.earnings.list.get.form.title",
      description: "app.api.referral.earnings.list.get.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // Request fields
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.tags.browserAutomation",
          description: "app.api.browser.tags.browserAutomation",
        },
        z.coerce.number().positive().optional(),
      ),
      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.browser.tags.browserAutomation",
          description: "app.api.browser.tags.browserAutomation",
        },
        z.coerce.number().min(0).optional(),
      ),

      // Response fields
      earnings: responseArrayField(
        { type: WidgetType.DATA_TABLE },
        objectField(
          {
            type: WidgetType.CONTAINER,
            layoutType: LayoutType.GRID,
            columns: 12,
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.id",
              },
              z.string(),
            ),
            earnerUserId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.earnerUserId",
              },
              z.string(),
            ),
            sourceUserId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.sourceUserId",
              },
              z.string(),
            ),
            transactionId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.transactionId",
              },
              z.string(),
            ),
            level: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.level",
              },
              z.coerce.number(),
            ),
            amountCents: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.amountCents",
              },
              z.coerce.number(),
            ),
            currency: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.currency",
              },
              z.string(),
            ),
            status: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.status",
              },
              z.string(),
            ),
            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.referral.earnings.list.get.response.earnings.createdAt",
              },
              z.string(),
            ),
          },
        ),
      ),
      totalCount: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.browser.tags.browserAutomation",
        },
        z.coerce.number(),
      ),
    },
  ),

  examples: {
    requests: {
      default: {},
    },
    responses: {
      default: {
        earnings: [],
        totalCount: 0,
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.referral.errors.validation.title",
      description: "app.api.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.referral.errors.network.title",
      description: "app.api.referral.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.referral.errors.unauthorized.title",
      description: "app.api.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.referral.errors.forbidden.title",
      description: "app.api.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.referral.errors.notFound.title",
      description: "app.api.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.referral.errors.serverError.title",
      description: "app.api.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.referral.errors.unknown.title",
      description: "app.api.referral.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.referral.errors.unsavedChanges.title",
      description: "app.api.referral.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.referral.errors.conflict.title",
      description: "app.api.referral.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.referral.earnings.list.success.title",
    description: "app.api.referral.earnings.list.success.description",
  },
});

export type EarningsListGetResponseOutput = typeof GET.types.ResponseOutput;

export default { GET };
