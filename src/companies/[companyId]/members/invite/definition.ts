/**
 * Company Member Invite API Route Definition
 * POST invite a registered user by email
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { CompanyMemberRole, CompanyMemberRoleOptions } from "../../../enum";
import { scopedTranslation } from "./i18n";

const MemberInviteWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.MemberInviteWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["companies", "[companyId]", "members", "invite"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "companies",
  subCategory: "Company Members",
  tags: ["tags.companies", "tags.members", "tags.invite"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "user-plus",

  fields: customWidgetObject({
    usage: { request: "data&urlPathParams", response: true },
    render: MemberInviteWidgetLazy,
    children: {
      // URL path parameters
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.companyId.label",
        description: "post.companyId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),

      // Request data
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.email.label",
        description: "post.email.description",
        placeholder: "post.email.placeholder",
        schema: z.string().email(),
      }),
      role: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.role.label",
        description: "post.role.description",
        placeholder: "post.role.placeholder",
        options: CompanyMemberRoleOptions,
        schema: z.enum(CompanyMemberRole).default(CompanyMemberRole.MEMBER),
      }),

      // Response fields (separate container to avoid name clash with role above)
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          memberId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.memberId",
            schema: z.uuid(),
          }),
          userId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.userId",
            hidden: true,
            schema: z.uuid(),
          }),
          role: responseField(scopedTranslation, {
            type: WidgetType.BADGE,
            text: "post.response.role",
            enumOptions: CompanyMemberRoleOptions,
            schema: z.enum(CompanyMemberRole),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        email: "colleague@example.com",
        role: CompanyMemberRole.MEMBER,
      },
    },
    responses: {
      default: {
        result: {
          memberId: "456e7890-e89b-12d3-a456-426614174001",
          userId: "789e0123-e89b-12d3-a456-426614174002",
          role: CompanyMemberRole.MEMBER,
        },
      },
    },
  },
});

export type MemberInviteRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
