/**
 * Chart of Accounts — Account Update Endpoint Definition
 * PATCH — update account name, description, sortOrder
 */

import { createEndpoint } from "next-vibe/core/definition/create";
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const CoaAccountUpdateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaAccountUpdateWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["chart-of-accounts", "account", "[accountId]", "update"],
  aliases: ["coa-account-update"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "patch.title" as const,
  titleShort: "patch.titleShort" as const,
  description: "patch.description" as const,
  icon: "edit",
  category: "accounting",
  subCategory: "Accounts",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: CoaAccountUpdateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // Primary identifier — entity picker when standalone, pre-filled from navigation
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "patch.accountId.label" as const,
        description: "patch.accountId.description" as const,
        placeholder: "patch.accountId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "name",
      }),

      // Read-only context fields — populated by prefillFromGet, shown in widget header
      // The repository ignores these (only name/description/sortOrder are written)
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.code.label" as const,
        description: "patch.code.description" as const,
        columns: 6,
        schema: z.string().optional(),
        hidden: true,
        readonly: true,
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.type.label" as const,
        description: "patch.type.description" as const,
        columns: 6,
        schema: z.string().optional(),
        hidden: true,
        readonly: true,
      }),
      subtype: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.subtype.label" as const,
        description: "patch.subtype.description" as const,
        columns: 6,
        schema: z.string().optional(),
        hidden: true,
        readonly: true,
      }),
      isSystem: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.isSystem.label" as const,
        description: "patch.isSystem.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
        hidden: true,
        readonly: true,
      }),
      isActive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.isActive.label" as const,
        description: "patch.isActive.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
        hidden: true,
        readonly: true,
      }),

      // Editable fields
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "patch.name.label" as const,
        description: "patch.name.description" as const,
        placeholder: "patch.name.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(200).optional(),
      }),
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "patch.accountDescription.label" as const,
        description: "patch.accountDescription.description" as const,
        placeholder: "patch.accountDescription.placeholder" as const,
        columns: 12,
        schema: z.string().max(1000).optional(),
      }),
      sortOrder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "patch.sortOrder.label" as const,
        description: "patch.sortOrder.description" as const,
        placeholder: "patch.sortOrder.placeholder" as const,
        columns: 6,
        schema: z.number().int().optional(),
      }),

      updated: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "patch.success.title" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title" as const,
      description: "patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title" as const,
      description: "patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title" as const,
      description: "patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title" as const,
      description: "patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title" as const,
      description: "patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title" as const,
      description: "patch.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title" as const,
      description: "patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title" as const,
      description: "patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title" as const,
      description: "patch.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "patch.success.title" as const,
    description: "patch.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        accountId: "00000000-0000-0000-0000-000000000001",
        name: "Updated Account Name",
      },
    },
    responses: {
      default: {
        updated: true,
      },
    },
  },
});

export type CoaAccountUpdateRequestInput = typeof PATCH.types.RequestInput;
export type CoaAccountUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type CoaAccountUpdateResponseInput = typeof PATCH.types.ResponseInput;
export type CoaAccountUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH } as const;
export default definitions;
