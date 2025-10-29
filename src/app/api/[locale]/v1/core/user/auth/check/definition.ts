/**
 * Auth Check Endpoint Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import type { TranslationKey } from "@/i18n/core/static-types";

import { UserRole } from "../../user-roles/enum";

const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "user", "auth", "check"],
  title: "app.api.v1.core.user.auth.check.get.title" as const,
  description: "app.api.v1.core.user.auth.check.get.description" as const,
  category: "app.api.v1.core.user.category" as const,
  tags: ["app.api.v1.core.user.search.tag" as const],
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
      layout: { type: LayoutType.VERTICAL },
    },
    { response: true },
    {
      authenticated: responseField({}, z.boolean()),
      tokenValid: responseField({}, z.boolean()),
    },
  ),
  errorTypes: {
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.user.auth.post.errors.server.title" as const,
      description:
        "app.api.v1.core.user.auth.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.auth.post.errors.unauthorized.title" as const,
      description:
        "app.api.v1.core.user.auth.post.errors.unauthorized.description" as const,
    },
  } as Record<
    EndpointErrorTypes,
    {
      title: TranslationKey;
      description: TranslationKey;
    }
  >,
  successTypes: {
    title: "app.api.v1.core.user.auth.check.get.title" as const,
    description: "app.api.v1.core.user.auth.check.get.description" as const,
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
