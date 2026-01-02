/**
 * Email Preview Render Endpoint Definition
 * Server-side rendering of email templates for preview
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { CountriesArr, CountriesOptions, LanguagesArr, LanguagesOptions } from "@/i18n/core/config";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["emails", "preview", "render"],
  title: "app.api.emails.preview.render.post.title" as const,
  description: "app.api.emails.preview.render.post.description" as const,
  category: "app.api.emails.category" as const,
  tags: ["app.api.emails.preview.render.post.title" as const],
  icon: "mail",
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.FORM_FIELD,
      fieldType: FieldDataType.TEXT,
      label: "app.api.emails.preview.render.post.container.title" as const,
      columns: 12,
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      templateId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.emails.preview.render.post.fields.templateId.label" as const,
          description: "app.api.emails.preview.render.post.fields.templateId.description" as const,
          columns: 12,
        },
        z.string(),
      ),

      language: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.emails.preview.render.post.fields.language.label" as const,
          description: "app.api.emails.preview.render.post.fields.language.description" as const,
          columns: 6,
          options: LanguagesOptions,
        },
        z.enum(LanguagesArr),
      ),

      country: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.emails.preview.render.post.fields.country.label" as const,
          description: "app.api.emails.preview.render.post.fields.country.description" as const,
          columns: 6,
          options: CountriesOptions,
        },
        z.enum(CountriesArr),
      ),

      props: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.JSON,
          label: "app.api.emails.preview.render.post.fields.props.label" as const,
          description: "app.api.emails.preview.render.post.fields.props.description" as const,
          columns: 12,
        },
        z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
      ),

      // === RESPONSE FIELDS ===
      html: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.preview.render.post.fields.html.title" as const,
        },
        z.string(),
      ),

      subject: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.preview.render.post.fields.subject.title" as const,
        },
        z.string(),
      ),

      templateVersion: responseField(
        {
          type: WidgetType.TEXT,
          content: "app.api.emails.preview.render.post.fields.templateVersion.title" as const,
        },
        z.string(),
      ),
    },
  ),

  examples: {
    requests: {
      default: {
        templateId: "leads-welcome",
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
        html: "<html>...</html>",
        subject: "Welcome to Our Platform",
        templateVersion: "1.0.0",
      },
    },
  },

  successTypes: {
    title: "app.api.emails.preview.render.post.success.title" as const,
    description: "app.api.emails.preview.render.post.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.emails.preview.render.post.errors.validation.title" as const,
      description: "app.api.emails.preview.render.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.emails.preview.render.post.errors.network.title" as const,
      description: "app.api.emails.preview.render.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.emails.preview.render.post.errors.unauthorized.title" as const,
      description: "app.api.emails.preview.render.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.emails.preview.render.post.errors.forbidden.title" as const,
      description: "app.api.emails.preview.render.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.emails.preview.render.post.errors.notFound.title" as const,
      description: "app.api.emails.preview.render.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.emails.preview.render.post.errors.server.title" as const,
      description: "app.api.emails.preview.render.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.emails.preview.render.post.errors.unknown.title" as const,
      description: "app.api.emails.preview.render.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.emails.preview.render.post.errors.unsavedChanges.title" as const,
      description: "app.api.emails.preview.render.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.emails.preview.render.post.errors.conflict.title" as const,
      description: "app.api.emails.preview.render.post.errors.conflict.description" as const,
    },
  },
});

export default { POST };
