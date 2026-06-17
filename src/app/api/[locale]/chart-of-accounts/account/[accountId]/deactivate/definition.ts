/**
 * Chart of Accounts — Account Deactivate Endpoint Definition
 * POST — soft-deactivate an account
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import accountListDefinitions from "@/app/api/[locale]/chart-of-accounts/account/list/definition";
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

const CoaAccountDeactivateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaAccountDeactivateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["chart-of-accounts", "account", "[accountId]", "deactivate"],
  aliases: ["coa-account-deactivate"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "x",
  category: "accounting",
  subCategory: "Accounts",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: CoaAccountDeactivateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.accountId.label" as const,
        description: "post.accountId.description" as const,
        placeholder: "post.accountId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: accountListDefinitions.GET,
        labelField: "name",
      }),
      deactivated: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.success.title" as const,
        schema: z.boolean(),
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
      default: { accountId: "00000000-0000-0000-0000-000000000001" },
    },
    responses: {
      default: { deactivated: true },
    },
  },
});

export type CoaAccountDeactivateRequestInput = typeof POST.types.RequestInput;
export type CoaAccountDeactivateRequestOutput = typeof POST.types.RequestOutput;
export type CoaAccountDeactivateResponseInput = typeof POST.types.ResponseInput;
export type CoaAccountDeactivateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
