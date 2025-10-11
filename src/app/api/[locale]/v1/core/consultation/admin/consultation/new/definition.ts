/**
 * Admin Create Consultation API Definition
 * Defines the API endpoint for creating consultations from admin panel with expanded fields
 */

import { z } from "zod";

import { leadId } from "@/app/api/[locale]/v1/core/leads/definition";
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
import { Countries, Languages } from "@/i18n/core/config";

import { ConsultationStatus, ConsultationStatusOptions } from "../../../enum";
import {
  ConsultationPriority,
  ConsultationPriorityOptions,
  SelectionType,
  SelectionTypeOptions,
} from "./enum";

/**
 * Create New Consultation Endpoint (POST)
 * Creates a new consultation with default values
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "consultation", "admin", "consultation", "new"],
  title: "app.api.v1.core.consultation.admin.consultation.new.post.title",
  description:
    "app.api.v1.core.consultation.admin.consultation.new.post.description",
  category: "app.api.v1.core.consultation.admin.consultation.new.post.category",
  tags: ["app.api.v1.core.consultation.admin.consultation.new.post.tag"],
  allowedRoles: [UserRole.ADMIN],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.container.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.container.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      selectionType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.selectionType.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.selectionType.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.selectionType.placeholder",
          options: SelectionTypeOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(SelectionType).default(SelectionType.CREATE_NEW_LEAD),
      ),

      userId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.userId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.userId.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.userId.placeholder",
          layout: { columns: 6 },
        },
        z.uuid().optional(),
      ),

      leadId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.leadId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.leadId.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.leadId.placeholder",
          visible: false,
          layout: { columns: 6 },
        },
        leadId.nullable().optional(),
      ),

      // Contact Information
      name: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.name.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.name.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.name.placeholder",
          visible: false,
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      email: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.email.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.email.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.email.placeholder",
          layout: { columns: 6 },
        },
        z.email().optional(),
      ),

      phone: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.phone.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.phone.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.phone.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      businessType: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.businessType.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.businessType.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.businessType.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      businessName: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.businessName.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.businessName.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.businessName.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      website: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.website.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.website.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.website.placeholder",
          layout: { columns: 6 },
        },
        z.string().url().optional().or(z.literal("")),
      ),

      country: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.country.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.country.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.country.placeholder",
          options: [
            {
              value: Countries.GLOBAL,
              label:
                "app.api.v1.core.consultation.admin.consultation.new.post.country.options.global",
            },
            {
              value: Countries.DE,
              label:
                "app.api.v1.core.consultation.admin.consultation.new.post.country.options.de",
            },
            {
              value: Countries.PL,
              label:
                "app.api.v1.core.consultation.admin.consultation.new.post.country.options.pl",
            },
          ],
          layout: { columns: 6 },
        },
        z.string(),
      ),

      language: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.language.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.language.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.language.placeholder",
          options: [
            {
              value: Languages.EN,
              label:
                "app.api.v1.core.consultation.admin.consultation.new.post.language.options.en",
            },
            {
              value: Languages.DE,
              label:
                "app.api.v1.core.consultation.admin.consultation.new.post.language.options.de",
            },
            {
              value: Languages.PL,
              label:
                "app.api.v1.core.consultation.admin.consultation.new.post.language.options.pl",
            },
          ],
          layout: { columns: 6 },
        },
        z.string(),
      ),

      city: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.city.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.city.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.city.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      currentChallenges: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.currentChallenges.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.currentChallenges.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.currentChallenges.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      goals: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.goals.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.goals.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.goals.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      targetAudience: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.targetAudience.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.targetAudience.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.targetAudience.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      existingAccounts: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.existingAccounts.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.existingAccounts.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.existingAccounts.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      competitors: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.competitors.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.competitors.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.competitors.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      preferredDate: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.preferredDate.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.preferredDate.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.preferredDate.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      preferredTime: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.preferredTime.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.preferredTime.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.preferredTime.placeholder",
          layout: { columns: 6 },
        },
        z.string().optional(),
      ),

      message: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.message.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.message.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.message.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      status: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.status.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.status.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.status.placeholder",
          options: ConsultationStatusOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(ConsultationStatus).optional(),
      ),

      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.priority.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.priority.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.priority.placeholder",
          options: ConsultationPriorityOptions,
          layout: { columns: 6 },
        },
        z.nativeEnum(ConsultationPriority).optional(),
      ),

      internalNotes: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.internalNotes.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.internalNotes.description",
          placeholder:
            "app.api.v1.core.consultation.admin.consultation.new.post.internalNotes.placeholder",
          layout: { columns: 12 },
        },
        z.string().optional(),
      ),

      // === RESPONSE FIELDS ===
      id: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.id.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.id.description",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      createdAt: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATETIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.createdAt.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.createdAt.description",
          layout: { columns: 6 },
        },
        z.string(),
      ),

      updatedAt: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATETIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.updatedAt.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.updatedAt.description",
          layout: { columns: 6 },
        },
        z.string(),
      ),

      userEmail: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.userEmail.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.userEmail.description",
          layout: { columns: 6 },
        },
        z.email().nullable(),
      ),

      userName: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.userName.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.userName.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      userBusinessType: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.userBusinessType.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.userBusinessType.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      userContactPhone: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.userContactPhone.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.userContactPhone.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      isNotified: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.isNotified.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.isNotified.description",
          layout: { columns: 6 },
        },
        z.boolean(),
      ),

      scheduledDate: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.DATE,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.scheduledDate.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.scheduledDate.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      scheduledTime: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TIME,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.scheduledTime.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.scheduledTime.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      calendarEventId: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.calendarEventId.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.calendarEventId.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      meetingLink: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.meetingLink.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.meetingLink.description",
          layout: { columns: 6 },
        },
        z.string().nullable(),
      ),

      icsAttachment: responseField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.consultation.admin.consultation.new.post.icsAttachment.label",
          description:
            "app.api.v1.core.consultation.admin.consultation.new.post.icsAttachment.description",
          layout: { columns: 12 },
        },
        z.string().nullable(),
      ),
    },
  ),
  examples: {
    requests: {
      default: {
        selectionType: SelectionType.CREATE_NEW_LEAD,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        businessType: "E-commerce",
        businessName: "Doe's Online Store",
        website: "https://doesstore.com",
        country: Countries.GLOBAL,
        city: "New York",
        language: Languages.DE,
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        isNotified: false,
        scheduledDate: null,
        scheduledTime: null,
        calendarEventId: null,
        meetingLink: null,
        icsAttachment: null,
        createdAt: "2024-01-10T10:00:00.000Z",
        updatedAt: "2024-01-10T10:00:00.000Z",
        userEmail: null,
        userName: null,
        userBusinessType: null,
        userContactPhone: null,
      },
    },
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.validation.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.network.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.forbidden.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.notFound.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.server.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.unknown.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.conflict.title",
      description:
        "app.api.v1.core.consultation.admin.consultation.new.post.errors.conflict.description",
    },
  },
  successTypes: {
    title:
      "app.api.v1.core.consultation.admin.consultation.new.post.success.title",
    description:
      "app.api.v1.core.consultation.admin.consultation.new.post.success.description",
  },
});

export const consultationCreateRequestSchema = POST.requestSchema;
export const consultationCreateResponseSchema = POST.responseSchema;

export type ConsultationCreatePostRequestTypeInput =
  typeof POST.types.RequestInput;
export type ConsultationCreatePostRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type ConsultationCreatePostResponseTypeInput =
  typeof POST.types.ResponseInput;
export type ConsultationCreatePostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

const definitions = {
  POST: POST,
};

export default definitions;
