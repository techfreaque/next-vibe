/**
 * Referral API Endpoint Definition
 * Defines the API endpoints for referral code management using createEndpoint
 *
 * NOTE: This is a placeholder implementation. Translation keys need to be registered
 * in the global translation system before this endpoint can be fully functional.
 */

import { z } from "zod";

import { translatedValueSchema } from "@/app/api/[locale]/shared/types/common.schema";
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
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "referral" as const,
  subCategory: "Program" as const,
  tags: ["tags.referral", "tags.create"],
  icon: "share" as const,
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
            label: "form.fields.code.label" as const,
            description: "form.fields.code.description" as const,
            placeholder: "form.fields.code.placeholder" as const,
            schema: z.string().min(3).max(50),
            theme: {
              style: "none",
              showAllRequired: false,
            },
          }),
          label: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "form.fields.label.label" as const,
            description: "form.fields.label.description" as const,
            placeholder: "form.fields.label.placeholder" as const,
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
        schema: translatedValueSchema,
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
            label: "post.submit.label" as const,
            loadingText: "post.submit.loading" as const,
            usage: { request: "data" },
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "success.title" as const,
    description: "success.description" as const,
  },

  examples: {
    requests: {
      default: {
        fieldsGrid: {
          code: "FRIEND2024",
          label: "Friend Referral" as const,
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

export default { POST } as const;
