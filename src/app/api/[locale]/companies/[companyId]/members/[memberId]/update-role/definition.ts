/**
 * Company Member Update Role API Route Definition
 * PATCH member role — OWNER only
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import companyListDefinitions from "@/app/api/[locale]/companies/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import companyListDefinitions from "@/app/api/[locale]/companies/list/definition";

import { CompanyMemberRole, CompanyMemberRoleOptions } from "../../../../enum";
import { scopedTranslation } from "../../../../i18n";

const UpdateMemberRoleWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UpdateMemberRoleWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["companies", "[companyId]", "members", "[memberId]", "update-role"],
  title: "updateRole.patch.title",
  titleShort: "updateRole.patch.titleShort",
  description: "updateRole.patch.description",
  category: "companies",
  subCategory: "Company Members",
  tags: ["tags.companies", "tags.members"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "shield",

  fields: customWidgetObject({
    usage: { request: "data&urlPathParams", response: true },
    render: UpdateMemberRoleWidgetLazy,
    children: {
      // URL path parameters
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "updateRole.patch.companyId.label",
        description: "updateRole.patch.companyId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: companyListDefinitions.GET,
        labelField: "name",
      }),
      memberId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "updateRole.patch.memberId.label",
        description: "updateRole.patch.memberId.description",
        hidden: true,
        schema: z.uuid(),
      }),

      // Request data
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "updateRole.patch.role.label",
        description: "updateRole.patch.role.description",
        placeholder: "updateRole.patch.role.placeholder",
        options: CompanyMemberRoleOptions,
        schema: z.enum(CompanyMemberRole),
      }),

      // Response fields (separate container to avoid name clash with role above)
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          memberId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "updateRole.patch.response.memberId",
            hidden: true,
            schema: z.uuid(),
          }),
          role: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "updateRole.patch.response.role",
            enumOptions: CompanyMemberRoleOptions,
            schema: z.enum(CompanyMemberRole),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "updateRole.patch.errors.validation.title",
      description: "updateRole.patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "updateRole.patch.errors.unauthorized.title",
      description: "updateRole.patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "updateRole.patch.errors.forbidden.title",
      description: "updateRole.patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "updateRole.patch.errors.conflict.title",
      description: "updateRole.patch.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "updateRole.patch.errors.server.title",
      description: "updateRole.patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "updateRole.patch.errors.unknown.title",
      description: "updateRole.patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "updateRole.patch.errors.network.title",
      description: "updateRole.patch.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "updateRole.patch.errors.notFound.title",
      description: "updateRole.patch.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "updateRole.patch.errors.unsavedChanges.title",
      description: "updateRole.patch.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "updateRole.patch.success.title",
    description: "updateRole.patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
        memberId: "456e7890-e89b-12d3-a456-426614174001",
      },
    },
    requests: {
      default: {
        role: CompanyMemberRole.ADMIN,
      },
    },
    responses: {
      default: {
        result: {
          memberId: "456e7890-e89b-12d3-a456-426614174001",
          role: CompanyMemberRole.ADMIN,
        },
      },
    },
  },
});

export type UpdateRoleRequestOutput = typeof PATCH.types.RequestOutput;

const definitions = {
  PATCH,
} as const;
export default definitions;
