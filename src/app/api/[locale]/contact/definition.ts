/**
 * Contact API Endpoint Definitions
 * Defines the API endpoints for contact form submissions
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseArrayOptionalField,
  responseField,
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

/**
 * Contact form endpoint
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["contact"],
  title: "app.api.contact.title",
  description: "app.api.contact.description",
  category: "app.api.contact.category",
  tags: [
    "app.api.contact.tags.contactForm",
    "app.api.contact.tags.contactUs",
    "app.api.contact.tags.contactSubmission",
    "app.api.contact.tags.helpSupport",
  ],

  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.contact.form.label",
      description: "app.api.contact.form.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { request: "data", response: true },
    {
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.contact.form.fields.name.label",
          description: "app.api.contact.form.fields.name.description",
          placeholder: "app.api.contact.form.fields.name.placeholder",
          columns: 6,
        },
        z.string().min(2),
      ),
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.contact.form.fields.email.label",
          description: "app.api.contact.form.fields.email.description",
          placeholder: "app.api.contact.form.fields.email.placeholder",
          columns: 6,
        },
        z.string().email(),
      ),
      company: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.contact.form.fields.company.label",
          description: "app.api.contact.form.fields.company.description",
          placeholder: "app.api.contact.form.fields.company.placeholder",
          columns: 12,
        },
        z.string().optional(),
      ),
      subject: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.contact.form.fields.subject.label",
          description: "app.api.contact.form.fields.subject.description",
          placeholder: "app.api.contact.form.fields.subject.placeholder",
          options: ContactSubjectOptions,
          columns: 12,
        },
        z.enum(ContactSubject),
      ),
      message: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.contact.form.fields.message.label",
          description: "app.api.contact.form.fields.message.description",
          placeholder: "app.api.contact.form.fields.message.placeholder",
          columns: 12,
        },
        z.string().min(10),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.contact.form.fields.priority.label",
          description: "app.api.contact.form.fields.priority.description",
          placeholder: "app.api.contact.form.fields.priority.placeholder",
          options: ContactPriorityOptions,
          columns: 12,
        },
        z.enum(ContactPriority).optional(),
      ),

      // === RESPONSE FIELDS ===
      // Note: leadId comes from JWT payload (user.leadId) on server-side
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.contact.response.success",
        },
        z.boolean(),
      ),
      messageId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.contact.response.messageId",
        },
        z.string().optional(),
      ),
      status: responseArrayOptionalField(
        {
          type: WidgetType.DATA_LIST,
          title: "app.api.contact.response.status",
          description: "app.api.contact.response.description",
        },
        responseField(
          {
            type: WidgetType.TEXT,
            content: "app.api.contact.response.status",
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
      title: "app.api.contact.errors.validation.title",
      description: "app.api.contact.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.contact.errors.network.title",
      description: "app.api.contact.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.contact.errors.unauthorized.title",
      description: "app.api.contact.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.contact.errors.forbidden.title",
      description: "app.api.contact.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.contact.errors.notFound.title",
      description: "app.api.contact.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.contact.errors.serverError.title",
      description: "app.api.contact.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.contact.errors.unknown.title",
      description: "app.api.contact.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.contact.errors.unsavedChanges.title",
      description: "app.api.contact.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.contact.errors.conflict.title",
      description: "app.api.contact.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.contact.success.title",
    description: "app.api.contact.success.description",
  },
});

export type ContactRequestInput = typeof POST.types.RequestInput;
export type ContactRequestOutput = typeof POST.types.RequestOutput;
export type ContactResponseInput = typeof POST.types.ResponseInput;
export type ContactResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
