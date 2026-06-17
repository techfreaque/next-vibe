/**
 * Chart of Accounts — Account Create Endpoint Definition
 * POST — add a custom account to a company's CoA
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import listDef0 from "@/app/api/[locale]/companies/list/definition";
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

import {
  AccountSubtype,
  AccountSubtypeOptions,
  AccountType,
  AccountTypeOptions,
} from "../../enum";
import listDef1 from "../list/definition";
import { scopedTranslation } from "./i18n";

const CoaAccountCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaAccountCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "account", "create"],
  aliases: ["coa-account-create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "plus",
  category: "accounting",
  subCategory: "Accounts",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: CoaAccountCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.companyId.label" as const,
        description: "post.companyId.description" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: listDef0.GET,
        labelField: "name",
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.code.label" as const,
        description: "post.code.description" as const,
        placeholder: "post.code.placeholder" as const,
        schema: z.string().min(1).max(20),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        schema: z.string().min(1).max(200),
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.type.label" as const,
        description: "post.type.description" as const,
        placeholder: "post.type.placeholder" as const,
        options: AccountTypeOptions,
        schema: z.enum(AccountType),
      }),
      subtype: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.subtype.label" as const,
        description: "post.subtype.description" as const,
        placeholder: "post.subtype.placeholder" as const,
        options: AccountSubtypeOptions,
        schema: z.enum(AccountSubtype),
      }),
      parentId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.parentId.label" as const,
        description: "post.parentId.description" as const,
        schema: z.string().uuid().optional(),
        listEndpoint: listDef1.GET,
        labelField: "name",
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.string(),
      }),
      code_out: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.code" as const,
        schema: z.string(),
      }),
      name_out: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.name" as const,
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
        code: "1150",
        name: "Petty Cash",
        type: AccountType.ASSET,
        subtype: AccountSubtype.CASH,
      },
    },
    responses: {
      default: {
        id: "00000000-0000-0000-0000-000000000002",
        code_out: "1150",
        name_out: "Petty Cash",
      },
    },
  },
});

export type CoaAccountCreateRequestInput = typeof POST.types.RequestInput;
export type CoaAccountCreateRequestOutput = typeof POST.types.RequestOutput;
export type CoaAccountCreateResponseInput = typeof POST.types.ResponseInput;
export type CoaAccountCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
