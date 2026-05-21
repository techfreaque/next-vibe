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

import {
  CorvinaPermissionLevel,
  CorvinaPermissionLevelOptions,
  CorvinaRoleType,
  CorvinaRoleTypeOptions,
} from "../enums";
import { scopedTranslation } from "./i18n";

const RoleCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RoleCreateContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "roles", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "shield-plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.roles" as const],

  fields: customWidgetObject({
    render: RoleCreateContainer,
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
        schema: z.string().min(2).max(100),
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
      description: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.descriptionField.label" as const,
        description: "post.descriptionField.description" as const,
        placeholder: "post.descriptionField.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.type.label" as const,
        description: "post.type.description" as const,
        columns: 6,
        schema: z.enum(CorvinaRoleType),
        options: CorvinaRoleTypeOptions,
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.enabled.label" as const,
        description: "post.enabled.description" as const,
        columns: 6,
        schema: z.boolean().default(true),
      }),
      defaultStar: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.defaultStar.label" as const,
        description: "post.defaultStar.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      deviceGeneralPermission: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.deviceGeneralPermission.label" as const,
        description: "post.deviceGeneralPermission.description" as const,
        columns: 6,
        schema: z.enum(CorvinaPermissionLevel).default("NONE"),
        options: CorvinaPermissionLevelOptions,
      }),
      vpnGeneralPermission: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.vpnGeneralPermission.label" as const,
        description: "post.vpnGeneralPermission.description" as const,
        columns: 6,
        schema: z.enum(CorvinaPermissionLevel).default("NONE"),
        options: CorvinaPermissionLevelOptions,
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
        schema: z.string().nullable(),
      }),
      typeResult: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.type" as const,
        schema: z.enum(CorvinaRoleType),
      }),
      enabledResult: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.enabled" as const,
        schema: z.boolean(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "shield-plus",
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
        name: "viewer",
        label: "Viewer",
        type: "DEVICE" as const,
        enabled: true,
        defaultStar: false,
        deviceGeneralPermission: "REGULAR_USER" as const,
        vpnGeneralPermission: "NONE" as const,
      },
    },
    responses: {
      default: {
        id: 10,
        nameResult: "viewer",
        labelResult: "Viewer",
        typeResult: "DEVICE" as const,
        enabledResult: true,
      },
    },
  },
});

export type CorvinaRoleCreateRequestOutput = typeof POST.types.RequestOutput;
export type CorvinaRoleCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
