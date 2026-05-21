import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const PurchaseInquiryContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.PurchaseInquiryContainer,
  })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "device-licenses", "purchase-inquiry"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "shopping-cart",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.deviceLicenses" as const],
  aliases: ["corvina_purchase_inquiry"],

  fields: customWidgetObject({
    render: PurchaseInquiryContainer,
    usage: { request: "data", response: true } as const,
    children: {
      logicalId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.logicalId.label" as const,
        description: "post.logicalId.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgResourceId.label" as const,
        description: "post.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      deviceLabel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.deviceLabel.label" as const,
        description: "post.deviceLabel.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      contactName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.contactName.label" as const,
        description: "post.contactName.description" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      contactEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.contactEmail.label" as const,
        description: "post.contactEmail.description" as const,
        columns: 6,
        schema: z.string().email(),
      }),
      contactPhone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEL,
        label: "post.contactPhone.label" as const,
        description: "post.contactPhone.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      requestedMonths: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.requestedMonths.label" as const,
        description: "post.requestedMonths.description" as const,
        columns: 6,
        schema: z.number().int().positive().optional(),
      }),
      inquiryMessage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.inquiryMessage.label" as const,
        description: "post.inquiryMessage.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      inquiryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.inquiryId" as const,
        schema: z.number(),
      }),
      confirmationMessage: responseField(scopedTranslation, {
        type: WidgetType.ALERT,
        content: "post.response.confirmationMessage" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        logicalId: "device-abc-123",
        orgResourceId: "org-xyz-456",
        deviceLabel: "Building A - Gateway",
        contactName: "John Smith",
        contactEmail: "john@example.com",
        contactPhone: "+1 555-0100",
        requestedMonths: 12,
        inquiryMessage: "Looking for a 1-year subscription.",
      },
    },
    responses: {
      default: {
        inquiryId: 1,
        confirmationMessage: "We'll be in touch within 1 business day.",
      },
    },
  },
});

export type PurchaseInquiryPostResponseOutput =
  typeof POST.types.ResponseOutput;
export type PurchaseInquiryPostRequestInput = typeof POST.types.RequestInput;

const definitions = { POST } as const;
export default definitions;
