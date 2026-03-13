/**
 * Email Preview Render Endpoint Definition
 * Server-side rendering of email templates for preview
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  backButton,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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

import { scopedTranslation } from "../../i18n";
import { EmailPreviewRenderContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "preview", "render"],
  title: "preview.render.post.title" as const,
  description: "preview.render.post.description" as const,
  category: "app.endpointCategories.messenger",
  tags: ["preview.render.post.title" as const],
  icon: "mail",
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: EmailPreviewRenderContainer,
    usage: { request: "data", response: true } as const,
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { request: "data", response: true },
      }),

      // === REQUEST FIELDS ===
      templateId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "preview.render.post.fields.templateId.label" as const,
        description:
          "preview.render.post.fields.templateId.description" as const,
        columns: 12,
        schema: z.string(),
      }),

      language: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "preview.render.post.fields.language.label" as const,
        description: "preview.render.post.fields.language.description" as const,
        columns: 6,
        options: LanguagesOptions,
        schema: z.enum(LanguagesArr),
      }),

      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "preview.render.post.fields.country.label" as const,
        description: "preview.render.post.fields.country.description" as const,
        columns: 6,
        options: CountriesOptions,
        schema: z.enum(CountriesArr),
      }),

      props: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.JSON,
        label: "preview.render.post.fields.props.label" as const,
        description: "preview.render.post.fields.props.description" as const,
        columns: 12,
        schema: z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean()]),
        ),
      }),

      // === RESPONSE FIELDS ===
      html: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "preview.render.post.fields.html.title" as const,
        schema: z.string(),
      }),

      subject: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "preview.render.post.fields.subject.title" as const,
        schema: z.string(),
      }),

      templateVersion: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "preview.render.post.fields.templateVersion.title" as const,
        schema: z.string(),
      }),
    },
  }),

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
    title: "preview.render.post.success.title" as const,
    description: "preview.render.post.success.description" as const,
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "preview.render.post.errors.validation.title" as const,
      description: "preview.render.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "preview.render.post.errors.network.title" as const,
      description: "preview.render.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "preview.render.post.errors.unauthorized.title" as const,
      description:
        "preview.render.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "preview.render.post.errors.forbidden.title" as const,
      description: "preview.render.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "preview.render.post.errors.notFound.title" as const,
      description: "preview.render.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "preview.render.post.errors.server.title" as const,
      description: "preview.render.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "preview.render.post.errors.unknown.title" as const,
      description: "preview.render.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "preview.render.post.errors.unsavedChanges.title" as const,
      description:
        "preview.render.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "preview.render.post.errors.conflict.title" as const,
      description: "preview.render.post.errors.conflict.description" as const,
    },
  },
});

export default { POST };
