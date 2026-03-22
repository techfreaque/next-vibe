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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
import { scopedTranslation } from "./i18n";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["referral"],
  title: "post.title",
  description: "post.description",
  category: "app.endpointCategories.referral",
  tags: ["tags.referral", "tags.create"],
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
          currentVisitors: 0,
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
        );
      },
    },
  },

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    noCard: true,
    layoutType: LayoutType.STACKED,
    className: "flex flex-col gap-4",
    usage: { request: "data", response: true },
    children: {
      // Fields grid
      fieldsGrid: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        noCard: true,
        layoutType: LayoutType.GRID,
        innerClassName: "grid-cols-1 md:grid-cols-2",
        gap: "4",
        usage: { request: "data" },
        children: {
          code: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "form.fields.code.label",
            description: "form.fields.code.description",
            placeholder: "form.fields.code.placeholder",
            schema: z.string().min(3).max(50),
            theme: {
              style: "none",
              showAllRequired: false,
            },
          }),
          label: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "form.fields.label.label",
            description: "form.fields.label.description",
            placeholder: "form.fields.label.placeholder",
            schema: z.string().optional(),
            theme: {
              style: "none",
              showAllRequired: false,
            },
          }),
        },
      }),

      // Form alert for validation and API errors
      formAlert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),
      // Success message
      successMessage: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        schema: z.string(),
        usage: { response: true },
      }),

      // Submit button row
      submitRow: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        noCard: true,
        layoutType: LayoutType.INLINE,
        className: "flex justify-end",
        usage: { request: "data" },
        children: {
          submit: submitButton(scopedTranslation, {
            label: "post.submit.label",
            loadingText: "post.submit.loading",
            usage: { request: "data" },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title",
      description: "errors.serverError.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
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
        successMessage: "response.success",
      },
    },
  },
});

// Export types for use in repository and route handlers
export type ReferralPostRequestOutput = typeof POST.types.RequestOutput;
export type ReferralPostResponseOutput = typeof POST.types.ResponseOutput;

export default { POST };
