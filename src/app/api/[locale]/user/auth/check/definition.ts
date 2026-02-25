/**
 * Auth Check Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedResponseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "../../user-roles/enum";
import { scopedTranslation } from "../i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "auth", "check"],
  title: "check.get.title",
  description: "check.get.description",
  icon: "shield",
  category: "app.endpointCategories.userAuth",
  tags: ["search.tag"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "check.get.response.title",
    description: "check.get.response.description",
    layoutType: LayoutType.VERTICAL,
    usage: { response: true },
    children: {
      authenticated: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "check.get.response.authenticated",
        schema: z.boolean(),
      }),
      tokenValid: scopedResponseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "check.get.response.tokenValid",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
  },
  successTypes: {
    title: "check.get.title",
    description: "check.get.description",
  },
  examples: {
    responses: {
      authenticated: {
        authenticated: true,
        tokenValid: true,
      },
      unauthenticated: {
        authenticated: false,
        tokenValid: false,
      },
    },
  },
});

const endpoints = { GET };

export default endpoints;
