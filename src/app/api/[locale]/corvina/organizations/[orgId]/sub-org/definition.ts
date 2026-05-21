import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const SubOrgCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SubOrgCreateContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "sub-org"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: SubOrgCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .min(1)
          .max(120)
          .regex(/^[a-z0-9][a-z0-9_-]*$/),
      }),
      label: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.label.label" as const,
        description: "post.label.description" as const,
        placeholder: "post.label.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).optional(),
      }),
      privateAccess: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.privateAccess.label" as const,
        description: "post.privateAccess.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      allowDisablePrivateAccess: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.allowDisablePrivateAccess.label" as const,
        description: "post.allowDisablePrivateAccess.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      hostname: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.hostname.label" as const,
        description: "post.hostname.description" as const,
        placeholder: "post.hostname.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      allowHostname: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.allowHostname.label" as const,
        description: "post.allowHostname.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      dataEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.dataEnabled.label" as const,
        description: "post.dataEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      vpnEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.vpnEnabled.label" as const,
        description: "post.vpnEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      storeEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.storeEnabled.label" as const,
        description: "post.storeEnabled.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      mfaRequired: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.mfaRequired.label" as const,
        description: "post.mfaRequired.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      nameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.name" as const,
        schema: z.string(),
      }),
      labelResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.label" as const,
        schema: z.string(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.status" as const,
        schema: z.string(),
      }),
      resourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.resourceId" as const,
        schema: z.string(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { orgId: 45511 } },
    requests: {
      default: {
        name: "acme-sub",
        label: "Acme Sub",
        privateAccess: false,
        allowDisablePrivateAccess: true,
        allowHostname: false,
        dataEnabled: true,
        vpnEnabled: true,
        storeEnabled: false,
        mfaRequired: false,
      },
    },
    responses: {
      default: {
        id: 45512,
        nameResult: "acme-sub",
        labelResult: "Acme Sub",
        status: "NEW",
        resourceId: "exorde.connex.acme-sub",
      },
    },
  },
});

export type CorvinaSubOrgCreateRequestOutput = typeof POST.types.RequestOutput;
export type CorvinaSubOrgCreateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
