/**
 * Email Preview Send Test Endpoint Definition
 * Send test emails with custom template data
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import {
  CountriesArr,
  CountriesOptions,
  LanguagesArr,
  LanguagesOptions,
} from "@/i18n/core/config";

import { EmailPreviewSendTestContainer } from "./widget";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "preview", "send-test"],
  title: "app.api.emails.preview.sendTest.post.title" as const,
  description: "app.api.emails.preview.sendTest.post.description" as const,
  category: "app.api.emails.category" as const,
  tags: ["app.api.emails.preview.sendTest.post.title" as const],
  icon: "send",
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: EmailPreviewSendTestContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton({ usage: { request: "data", response: true } }),

      // === REQUEST FIELDS ===
      templateId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label:
          "app.api.emails.preview.sendTest.post.fields.templateId.label" as const,
        description:
          "app.api.emails.preview.sendTest.post.fields.templateId.description" as const,
        columns: 12,
        schema: z.string(),
      }),

      recipientEmail: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label:
          "app.api.emails.preview.sendTest.post.fields.recipientEmail.label" as const,
        description:
          "app.api.emails.preview.sendTest.post.fields.recipientEmail.description" as const,
        columns: 12,
        schema: z.string().email(),
      }),

      language: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.emails.preview.sendTest.post.fields.language.label" as const,
        description:
          "app.api.emails.preview.sendTest.post.fields.language.description" as const,
        columns: 6,
        options: LanguagesOptions,
        schema: z.enum(LanguagesArr),
      }),

      country: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label:
          "app.api.emails.preview.sendTest.post.fields.country.label" as const,
        description:
          "app.api.emails.preview.sendTest.post.fields.country.description" as const,
        columns: 6,
        options: CountriesOptions,
        schema: z.enum(CountriesArr),
      }),

      props: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label:
          "app.api.emails.preview.sendTest.post.fields.props.label" as const,
        description:
          "app.api.emails.preview.sendTest.post.fields.props.description" as const,
        columns: 12,
        schema: z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean()]),
        ),
      }),

      // === RESPONSE FIELDS ===
      success: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.preview.sendTest.post.fields.success.title" as const,
        schema: z.boolean(),
      }),

      message: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.emails.preview.sendTest.post.fields.message.title" as const,
        schema: z.string(),
      }),
    },
  }),

  examples: {
    requests: {
      default: {
        templateId: "leads-welcome",
        recipientEmail: "test@example.com",
        language: "en",
        country: "US",
        props: {
          businessName: "Acme Digital Solutions",
          email: "test@example.com",
          phone: "+1 555-0123",
          website: "https://acme-digital.com",
          source: "website",
          status: "new",
          notes: "Interested in premium services",
        },
      },
    },
    responses: {
      default: {
        success: true,
        message: "Test email sent successfully to test@example.com",
      },
    },
  },

  successTypes: {
    title: "app.api.emails.preview.sendTest.post.success.title" as const,
    description:
      "app.api.emails.preview.sendTest.post.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.validation.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.network.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.unauthorized.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.forbidden.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.notFound.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.server.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.unknown.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.unsavedChanges.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.emails.preview.sendTest.post.errors.conflict.title" as const,
      description:
        "app.api.emails.preview.sendTest.post.errors.conflict.description" as const,
    },
  },
});

export default { POST };
