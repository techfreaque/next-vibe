/**
 * Contact API Endpoint Definitions
 * Defines the API endpoints for contact form submissions
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { ContactPriority, ContactPriorityOptions, ContactStatus } from "./enum";

/**
 * Contact form endpoint
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "contact"],
  title: "app.api.v1.core.contact.title",
  description: "app.api.v1.core.contact.description",
  category: "app.api.v1.core.contact.category",
  tags: [
    "app.api.v1.core.contact.tags.contactForm",
    "app.api.v1.core.contact.tags.contactUs",
    "app.api.v1.core.contact.tags.contactSubmission",
    "app.api.v1.core.contact.tags.helpSupport",
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
      title: "app.api.v1.core.contact.form.label",
      description: "app.api.v1.core.contact.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.contact.form.fields.name.label",
          description: "app.api.v1.core.contact.form.fields.name.description",
          placeholder: "app.api.v1.core.contact.form.fields.name.placeholder",
          layout: { columns: 6 },
          validation: { required: true, minLength: 2 },
        },
        z.string().min(2),
      ),
      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label: "app.api.v1.core.contact.form.fields.email.label",
          description: "app.api.v1.core.contact.form.fields.email.description",
          placeholder: "app.api.v1.core.contact.form.fields.email.placeholder",
          layout: { columns: 6 },
          validation: { required: true },
        },
        z.email(),
      ),
      company: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.contact.form.fields.company.label",
          description:
            "app.api.v1.core.contact.form.fields.company.description",
          placeholder:
            "app.api.v1.core.contact.form.fields.company.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
        z.string().optional(),
      ),
      subject: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.contact.form.fields.subject.label",
          description:
            "app.api.v1.core.contact.form.fields.subject.description",
          placeholder:
            "app.api.v1.core.contact.form.fields.subject.placeholder",
          layout: { columns: 12 },
          validation: { required: true, minLength: 1 },
        },
        z.string().min(1),
      ),
      message: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.contact.form.fields.message.label",
          description:
            "app.api.v1.core.contact.form.fields.message.description",
          placeholder:
            "app.api.v1.core.contact.form.fields.message.placeholder",
          layout: { columns: 12 },
          validation: { required: true, minLength: 10 },
        },
        z.string().min(10),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.contact.form.fields.priority.label",
          description:
            "app.api.v1.core.contact.form.fields.priority.description",
          placeholder:
            "app.api.v1.core.contact.form.fields.priority.placeholder",
          options: ContactPriorityOptions,
          layout: { columns: 6 },
          validation: { required: false },
          behavior: { searchable: false, clearable: true },
        },
        z.nativeEnum(ContactPriority).optional(),
      ),
      leadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.contact.form.fields.leadId.label",
          description: "app.api.v1.core.contact.form.fields.leadId.description",
          placeholder: "app.api.v1.core.contact.form.fields.leadId.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      success: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.success",
        },
        z.boolean(),
      ),
      messageId: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.messageId",
        },
        z.string().optional(),
      ),
      status: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.contact.response.status",
        },
        z.array(z.string()).optional(),
      ),
    },
  ),
  examples: {
    requests: {
      default: {
        name: "John Doe",
        email: "john.doe@example.com",
        company: "Acme Corp",
        subject: "General inquiry about services",
        message:
          "I would like to learn more about your social media management services.",
        priority: ContactPriority.MEDIUM,
        leadId: "lead_123",
      },
      success: {
        name: "Jane Smith",
        email: "jane.smith@company.com",
        company: "Tech Corp",
        subject: "Partnership inquiry",
        message: "We are interested in discussing a potential partnership.",
        priority: ContactPriority.HIGH,
        leadId: "lead_456",
      },
      general: {
        name: "Bob Wilson",
        email: "bob@startup.io",
        subject: "Product demo request",
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
    urlPathVariables: undefined,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.contact.errors.validation.title",
      description: "app.api.v1.core.contact.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.contact.errors.network.title",
      description: "app.api.v1.core.contact.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.contact.errors.unauthorized.title",
      description: "app.api.v1.core.contact.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.contact.errors.forbidden.title",
      description: "app.api.v1.core.contact.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.contact.errors.notFound.title",
      description: "app.api.v1.core.contact.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.contact.errors.serverError.title",
      description: "app.api.v1.core.contact.errors.serverError.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.contact.errors.unknown.title",
      description: "app.api.v1.core.contact.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.contact.errors.unsavedChanges.title",
      description: "app.api.v1.core.contact.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.contact.errors.conflict.title",
      description: "app.api.v1.core.contact.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.contact.success.title",
    description: "app.api.v1.core.contact.success.description",
  },
});

export type ContactRequestInput = typeof POST.types.RequestInput;
export type ContactRequestOutput = typeof POST.types.RequestOutput;
export type ContactResponseInput = typeof POST.types.ResponseInput;
export type ContactResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
