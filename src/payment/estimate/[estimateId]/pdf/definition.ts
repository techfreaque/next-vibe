import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../document-delivery/i18n";

const EstimatePdfWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.EstimatePdfWidget })),
);

const errorTypes = {
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
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
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
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "estimate", "[estimateId]", "pdf"],
  aliases: ["estimate-pdf"],
  title: "pdf.estimateTitle" as const,
  titleShort: "pdf.estimateTitle" as const,
  description: "pdf.estimateDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-text" as const,
  tags: ["tags.payment" as const, "tags.pdf" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: EstimatePdfWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      estimateId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "fields.estimateId" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "estimateNumber",
      }),
      documentNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "pdf.documentNumber" as const,
        schema: z.string(),
      }),
      filename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "pdf.filename" as const,
        schema: z.string(),
      }),
      contentType: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.contentType" as const,
        schema: z.string(),
      }),
      pdfBase64: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "fields.pdfBase64" as const,
        hidden: true,
        schema: z.string(),
      }),
    },
  }),
  errorTypes,
  examples: {
    urlPathParams: {
      default: { estimateId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        documentNumber: "EST-2026-0001",
        filename: "EST-2026-0001.pdf",
        contentType: "application/pdf",
        pdfBase64: "JVBERi0xLjc=",
      },
    },
  },
  successTypes: {
    title: "pdf.success" as const,
    description: "pdf.estimateDescription" as const,
  },
});

export type EstimatePdfResponse = typeof GET.types.ResponseOutput;
export type EstimatePdfPath = typeof GET.types.UrlVariablesOutput;

export default { GET };
