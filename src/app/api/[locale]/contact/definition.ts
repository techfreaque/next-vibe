/**
 * Contact API Endpoint Definitions
 * Defines the API endpoints for contact form submissions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectField,
  scopedRequestDataField,
  scopedResponseArrayOptionalField,
  scopedResponseField,
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
  ContactPriority,
  ContactPriorityOptions,
  ContactStatus,
  ContactSubject,
  ContactSubjectOptions,
} from "./enum";
import { scopedTranslation } from "./i18n";

/**
 * Contact form endpoint with scoped translations
 * Translation keys are type-safe and validated against the ContactTranslationKey type
 *
 * Type safety is enforced through:
 * 1. Using 'satisfies' to validate translation keys against ContactTranslationKey
 * 2. Widget configs are generic with TKey parameter
 * 3. Field helpers (requestDataField, objectField) preserve the TUIConfig generic
 * 4. TypeScript validates all translation keys at compile time
 *
 * Example: If you try to use an invalid key like "invalid.key", TypeScript will error
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["contact"],
  title: "title" as const,
  description: "description" as const,
  category: "category" as const,
  icon: "mail",
  tags: [
    "tags.contactForm" as const,
    "tags.contactUs" as const,
    "tags.contactSubmission" as const,
    "tags.helpSupport" as const,
  ],

  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  // Scoped field utilities validate translation keys against scopedTranslation.ScopedTranslationKey
  fields: scopedObjectField(
    scopedTranslation,
    {
      type: WidgetType.CONTAINER,
      title: "form.label",
      description: "form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      name: scopedRequestDataField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "form.fields.name.label",
          description: "form.fields.name.description",
          placeholder: "form.fields.name.placeholder",
          columns: 6,
        },
        z.string().min(2),
      ),
      email: scopedRequestDataField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "form.fields.email.label",
          description: "form.fields.email.description",
          placeholder: "form.fields.email.placeholder",
          columns: 6,
        },
        z.string().email(),
      ),
      company: scopedRequestDataField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "form.fields.company.label",
          description: "form.fields.company.description",
          placeholder: "form.fields.company.placeholder",
          columns: 12,
        },
        z.string().optional(),
      ),
      subject: scopedRequestDataField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "form.fields.subject.label",
          description: "form.fields.subject.description",
          placeholder: "form.fields.subject.placeholder",
          options: ContactSubjectOptions,
          columns: 12,
        },
        z.enum(ContactSubject),
      ),
      message: scopedRequestDataField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "form.fields.message.label",
          description: "form.fields.message.description",
          placeholder: "form.fields.message.placeholder",
          columns: 12,
        },
        z.string().min(10),
      ),
      priority: scopedRequestDataField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "form.fields.priority.label",
          description: "form.fields.priority.description",
          placeholder: "form.fields.priority.placeholder",
          options: ContactPriorityOptions,
          columns: 12,
        },
        z.enum(ContactPriority).optional(),
      ),

      // === RESPONSE FIELDS ===
      // Note: leadId comes from JWT payload (user.leadId) on server-side
      success: scopedResponseField(
        scopedTranslation,
        {
          type: WidgetType.TEXT,
          content: "response.success",
        },
        z.boolean(),
      ),
      messageId: scopedResponseField(
        scopedTranslation,
        {
          type: WidgetType.TEXT,
          content: "response.messageId",
        },
        z.string().optional(),
      ),
      status: scopedResponseArrayOptionalField(
        scopedTranslation,
        {
          type: WidgetType.DATA_LIST,
          title: "response.status",
          description: "response.description",
        },
        scopedResponseField(
          scopedTranslation,
          {
            type: WidgetType.TEXT,
            content: "response.status",
          },
          z.string(),
        ),
      ),
    },
  ),
  examples: {
    requests: {
      default: {
        name: "John Doe",
        email: "john.doe@example.com",
        company: "Acme Corp",
        subject: ContactSubject.GENERAL_INQUIRY,
        message:
          "I would like to learn more about your social media management services.",
        priority: ContactPriority.MEDIUM,
      },
      success: {
        name: "Jane Smith",
        email: "jane.smith@company.com",
        company: "Tech Corp",
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
        success: true,
        messageId: "msg_123",
        status: [ContactStatus.NEW],
      },
      success: {
        success: true,
        messageId: "msg_456",
        status: [ContactStatus.NEW],
      },
      general: {
        success: true,
        messageId: "msg_789",
        status: [ContactStatus.NEW],
      },
    },
    urlPathParams: undefined,
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
