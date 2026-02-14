/**
 * Contact API Endpoint Definitions
 * Defines the API endpoints for contact form submissions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  scopedObjectField,
  scopedRequestField,
  scopedResponseField,
  widgetField,
} from "../system/unified-interface/shared/field/utils-new";
import {
  ContactPriority,
  ContactPriorityOptions,
  ContactSubject,
  ContactSubjectOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

export const CONTACT_FORM_ALIAS = "contact-form" as const;

/**
 * Contact form endpoint with scoped translations
 * Translation keys are type-safe and validated against the ContactTranslationKey type
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST as const,
  path: ["contact"] as const,
  title: "title",
  description: "description",
  category: "category",
  icon: "mail",
  aliases: [CONTACT_FORM_ALIAS] as const,
  tags: [
    "tags.contactForm",
    "tags.contactUs",
    "tags.contactSubmission",
    "tags.helpSupport",
  ],

  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  fields: scopedObjectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "form.label",
    description: "form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      name: scopedRequestField(scopedTranslation, {
        schema: z.string().min(2),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "form.fields.name.label",
        description: "form.fields.name.description",
        placeholder: "form.fields.name.placeholder",
        columns: 12,
      }),
      email: scopedRequestField(scopedTranslation, {
        schema: z.string().email(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "form.fields.email.label",
        description: "form.fields.email.description",
        placeholder: "form.fields.email.placeholder",
        columns: 12,
      }),
      subject: scopedRequestField(scopedTranslation, {
        schema: z.enum(ContactSubject).default(ContactSubject.HELP_SUPPORT),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.subject.label",
        description: "form.fields.subject.description",
        placeholder: "form.fields.subject.placeholder",
        options: ContactSubjectOptions,
        columns: 12,
      }),
      message: scopedRequestField(scopedTranslation, {
        schema: z.string().min(10),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "form.fields.message.label",
        description: "form.fields.message.description",
        placeholder: "form.fields.message.placeholder",
        columns: 12,
      }),
      priority: scopedRequestField(scopedTranslation, {
        schema: z.enum(ContactPriority).optional(),
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "form.fields.priority.label",
        description: "form.fields.priority.description",
        placeholder: "form.fields.priority.placeholder",
        options: ContactPriorityOptions,
        columns: 12,
      }),

      // === RESPONSE FIELDS ===
      success: scopedResponseField(scopedTranslation, {
        schema: z.string(),
        type: WidgetType.ALERT,
        columns: 12,
      }),

      submitButton: widgetField({
        type: WidgetType.SUBMIT_BUTTON,
        text: "form.submitButton.label",
        loadingText: "form.submitButton.loadingText",
        icon: "send",
        variant: "default",
        size: "default",
        columns: 12,
        usage: { request: "data" },
      }),
    },
  }),
  examples: {
    requests: {
      default: {
        name: "John Doe",
        email: "john.doe@example.com",
        subject: ContactSubject.GENERAL_INQUIRY,
        message:
          "I would like to learn more about your social media management services.",
        priority: ContactPriority.MEDIUM,
      },
      success: {
        name: "Jane Smith",
        email: "jane.smith@company.com",
        subject: ContactSubject.PARTNERSHIP,
        message: "We are interested in discussing a potential partnership.",
        priority: ContactPriority.HIGH,
      },
      general: {
        name: "Bob Wilson",
        email: "bob@startup.io",
        subject: ContactSubject.FEATURE_REQUEST,
        message: "Can we schedule a demo of your platform?",
        priority: ContactPriority.MEDIUM,
      },
    },
    responses: {
      default: {
        success: "response.success",
      },
      success: {
        success: "response.success",
      },
      general: {
        success: "response.success",
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.serverError.title" as const,
      description: "errors.serverError.description" as const,
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
});

export type ContactRequestInput = typeof POST.types.RequestInput;
export type ContactRequestOutput = typeof POST.types.RequestOutput;
export type ContactResponseInput = typeof POST.types.ResponseInput;
export type ContactResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
