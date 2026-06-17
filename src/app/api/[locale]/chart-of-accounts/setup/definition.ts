/**
 * Chart of Accounts Setup Endpoint Definition
 * POST — initialize CoA for company from country template
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const CoaSetupWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaSetupWidget })),
);

const CountryDB = ["AT", "DE", "XX"] as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "setup"],
  aliases: ["coa-setup"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "settings",
  category: "accounting",
  subCategory: "Accounting",
  tags: ["tag" as const],

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: CoaSetupWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.companyId.label" as const,
        description: "post.companyId.description" as const,
        placeholder: "post.companyId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.country.label" as const,
        description: "post.country.description" as const,
        placeholder: "post.country.placeholder" as const,
        columns: 12,
        options: [
          { value: "AT", label: "AT — ÖKR" },
          { value: "DE", label: "DE — SKR03" },
          { value: "XX", label: "XX — IFRS Generic" },
        ],
        schema: z.enum(CountryDB),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.created" as const,
        schema: z.number(),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.skipped" as const,
        schema: z.number(),
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        country: "AT",
      },
    },
    responses: {
      default: {
        created: 17,
        skipped: 0,
      },
    },
  },
});

export type CoaSetupRequestInput = typeof POST.types.RequestInput;
export type CoaSetupRequestOutput = typeof POST.types.RequestOutput;
export type CoaSetupResponseInput = typeof POST.types.ResponseInput;
export type CoaSetupResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
