/**
 * Chart of Accounts — Period Create Endpoint Definition
 * POST — open a new accounting period
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

const CoaPeriodCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaPeriodCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "period", "create"],
  aliases: ["coa-period-create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "plus",
  category: "accounting",
  subCategory: "Periods",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: CoaPeriodCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.companyId.label" as const,
        description: "post.companyId.description" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(100),
      }),
      startDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "post.startDate.label" as const,
        description: "post.startDate.description" as const,
        placeholder: "post.startDate.placeholder" as const,
        columns: 6,
        schema: dateSchema,
      }),
      endDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "post.endDate.label" as const,
        description: "post.endDate.description" as const,
        placeholder: "post.endDate.placeholder" as const,
        columns: 6,
        schema: dateSchema,
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.id" as const,
        schema: z.string(),
      }),
      name_out: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.name" as const,
        schema: z.string(),
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
        name: "January 2026",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-01-31"),
      },
    },
    responses: {
      default: {
        id: "00000000-0000-0000-0000-000000000010",
        name_out: "January 2026",
      },
    },
  },
});

export type CoaPeriodCreateRequestInput = typeof POST.types.RequestInput;
export type CoaPeriodCreateRequestOutput = typeof POST.types.RequestOutput;
export type CoaPeriodCreateResponseInput = typeof POST.types.ResponseInput;
export type CoaPeriodCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
