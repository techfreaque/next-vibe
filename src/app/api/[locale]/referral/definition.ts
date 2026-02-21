/**
 * Referral API Endpoint Definition
 * Defines the API endpoints for referral code management using createEndpoint
 *
 * NOTE: This is a placeholder implementation. Translation keys need to be registered
 * in the global translation system before this endpoint can be fully functional.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
  submitButton,
  widgetField,
  widgetObjectField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { success } from "../shared/types/response.schema";
import { UserRole } from "../user/user-roles/enum";
import type { CodesListGetResponseOutput } from "./codes/list/definition";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["referral"],
  title: "app.api.referral.post.title",
  description: "app.api.referral.post.description",
  category: "app.api.payment.category",
  tags: ["app.api.referral.tags.referral", "app.api.referral.tags.create"],
  icon: "share",
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { apiClient } =
          await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
        const codesListDefinition = await import("./codes/list/definition");

        // Get the new code from request
        const newCode: CodesListGetResponseOutput["codes"][number] = {
          code: data.requestData.fieldsGrid.code,
          label: data.requestData.fieldsGrid.label ?? null,
          currentUses: 0,
          totalSignups: 0,
          totalRevenueCents: 0,
          totalEarningsCents: 0,
          isActive: true,
        };

        // Optimistically add the new code to the beginning of the list
        apiClient.updateEndpointData(
          codesListDefinition.default.GET,
          data.logger,
          (oldData) => {
            if (!oldData?.success) {
              return oldData;
            }

            return success<CodesListGetResponseOutput>({
              codes: [newCode, ...oldData.data.codes],
            });
          },
          undefined,
        );
      },
    },
  },

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      noCard: true,
      layoutType: LayoutType.STACKED,
      className: "flex flex-col gap-4",
    },
    { request: "data", response: true },
    {
      // Fields grid
      fieldsGrid: objectField(
        {
          type: WidgetType.CONTAINER,
          noCard: true,
          layoutType: LayoutType.GRID,
          innerClassName: "grid-cols-1 md:grid-cols-2",
          gap: "4",
        },
        { request: "data" },
        {
          code: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.referral.form.fields.code.label",
            description: "app.api.referral.form.fields.code.description",
            placeholder: "app.api.referral.form.fields.code.placeholder",
            schema: z.string().min(3).max(50),
            theme: {
              style: "none",
              showAllRequired: false,
            },
          }),
          label: requestField({
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "app.api.referral.form.fields.label.label",
            description: "app.api.referral.form.fields.label.description",
            placeholder: "app.api.referral.form.fields.label.placeholder",
            schema: z.string().optional(),
            theme: {
              style: "none",
              showAllRequired: false,
            },
          }),
        },
      ),

      // Form alert for validation and API errors
      formAlert: widgetField({
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),
      // Success message
      successMessage: responseField({
        type: WidgetType.ALERT,
        schema: z.string(),
        usage: { response: true },
      }),

      // Submit button row
      submitRow: widgetObjectField(
        {
          type: WidgetType.CONTAINER,
          noCard: true,
          layoutType: LayoutType.INLINE,
          className: "flex justify-end",
        },
        { request: "data" },
        {
          submit: submitButton({
            label: "app.user.referral.createCode.create",
            loadingText: "app.user.referral.createCode.creating",
            usage: { request: "data" },
          }),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.referral.errors.validation.title",
      description: "app.api.referral.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.referral.errors.notFound.title",
      description: "app.api.referral.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.referral.errors.unauthorized.title",
      description: "app.api.referral.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.referral.errors.forbidden.title",
      description: "app.api.referral.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.referral.errors.serverError.title",
      description: "app.api.referral.errors.serverError.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.referral.errors.network.title",
      description: "app.api.referral.errors.network.description",
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
    title: "app.api.referral.success.title",
    description: "app.api.referral.success.description",
  },

  examples: {
    requests: {
      default: {
        fieldsGrid: {
          code: "FRIEND2024",
          label: "Friend Referral",
        },
      },
      unlimited: {
        fieldsGrid: {
          code: "UNLIMITED",
        },
      },
    },
    responses: {
      default: {
        successMessage: "app.api.referral.response.success",
      },
    },
  },
});

// Export types for use in repository and route handlers
export type ReferralPostRequestOutput = typeof POST.types.RequestOutput;
export type ReferralPostResponseOutput = typeof POST.types.ResponseOutput;

export default { POST };
