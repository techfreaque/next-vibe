/**
 * Auth Check Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { TranslationKey } from "@/i18n/core/static-types";

import { UserRole } from "../../user-roles/enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["user", "auth", "check"],
  title: "app.api.user.auth.check.get.title" as const,
  description: "app.api.user.auth.check.get.description" as const,
  icon: "shield",
  category: "app.api.user.category" as const,
  tags: ["app.api.user.search.tag" as const],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.user.auth.check.get.response.title" as const,
      description: "app.api.user.auth.check.get.response.description" as const,
      layoutType: LayoutType.VERTICAL,
    },
    { response: true },
    {
      authenticated: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.user.auth.check.get.response.authenticated" as const,
        },
        z.boolean(),
      ),
      tokenValid: responseField(
        {
          type: WidgetType.BADGE,
          text: "app.api.user.auth.check.get.response.tokenValid" as const,
        },
        z.boolean(),
      ),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.user.auth.post.errors.server.title" as const,
      description: "app.api.user.auth.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.user.auth.post.errors.unauthorized.title" as const,
      description: "app.api.user.auth.post.errors.unauthorized.description" as const,
    },
  } as Record<
    EndpointErrorTypes,
    {
      title: TranslationKey;
      description: TranslationKey;
    }
  >,
  successTypes: {
    title: "app.api.user.auth.check.get.title" as const,
    description: "app.api.user.auth.check.get.description" as const,
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
