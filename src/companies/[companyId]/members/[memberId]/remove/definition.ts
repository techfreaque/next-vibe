/**
 * Company Member Remove API Route Definition
 * POST remove a member — OWNER/ADMIN only. Cannot remove last OWNER.
 */

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

import { scopedTranslation } from "../../../../i18n";

const RemoveMemberWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RemoveMemberWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["companies", "[companyId]", "members", "[memberId]", "remove"],
  title: "removeMember.post.title",
  titleShort: "removeMember.post.titleShort",
  description: "removeMember.post.description",
  category: "companies",
  subCategory: "Company Members",
  tags: ["tags.companies", "tags.members"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "user-x",

  fields: customWidgetObject({
    usage: { request: "urlPathParams", response: true },
    render: RemoveMemberWidgetLazy,
    children: {
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "removeMember.post.companyId.label",
        description: "removeMember.post.companyId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
      }),
      memberId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "removeMember.post.memberId.label",
        description: "removeMember.post.memberId.description",
        hidden: true,
        schema: z.uuid(),
      }),

      removedMemberId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "removeMember.post.response.removedMemberId",
        hidden: true,
        schema: z.uuid(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "removeMember.post.errors.validation.title",
      description: "removeMember.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "removeMember.post.errors.unauthorized.title",
      description: "removeMember.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "removeMember.post.errors.forbidden.title",
      description: "removeMember.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "removeMember.post.errors.conflict.title",
      description: "removeMember.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "removeMember.post.errors.server.title",
      description: "removeMember.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "removeMember.post.errors.unknown.title",
      description: "removeMember.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "removeMember.post.errors.network.title",
      description: "removeMember.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "removeMember.post.errors.notFound.title",
      description: "removeMember.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "removeMember.post.errors.unsavedChanges.title",
      description: "removeMember.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "removeMember.post.success.title",
    description: "removeMember.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
        memberId: "456e7890-e89b-12d3-a456-426614174001",
      },
    },
    responses: {
      default: {
        removedMemberId: "456e7890-e89b-12d3-a456-426614174001",
      },
    },
  },
});

export type RemoveMemberRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
