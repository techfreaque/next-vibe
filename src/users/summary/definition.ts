import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { categorySummarySchema } from "next-vibe/unified-ui/_shared/category-summary";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { AccountStateFilter, UsersAudience } from "../list/enum";
import { scopedTranslation } from "./i18n";

const render = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UsersSummaryWidget })),
);
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["users", "summary"],
  aliases: ["users-admin-summary"],
  title: "title",
  titleShort: "title",
  description: "description",
  scopedTranslation,
  allowedRoles: [UserRole.ADMIN],
  category: "usersDirectory",
  icon: "users",
  tags: ["title"],
  fields: customWidgetObject({
    render,
    usage: { response: true },
    children: {
      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "title",
        schema: categorySummarySchema(
          z.enum([
            "accounts",
            "signups",
            "verified",
            "unverified",
            "reviewUnverified",
          ]),
        ),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: { title: "title", description: "description" },
  examples: {
    responses: {
      default: {
        summary: {
          from: "2026-11-19",
          to: "2026-11-25",
          kpis: [
            {
              label: "accounts",
              format: "number",
              value: 84,
              drill: { alias: "users-list" },
            },
            {
              label: "signups",
              format: "number",
              value: 12,
              previous: 16,
              drill: {
                alias: "users-list",
                args: { signupFrom: "2026-11-19", signupTo: "2026-11-25" },
              },
            },
            {
              label: "verified",
              format: "number",
              value: 76,
              drill: {
                alias: "users-list",
                args: {
                  audience: UsersAudience.HUMANS,
                  requiredState: AccountStateFilter.VERIFIED,
                },
              },
            },
            {
              label: "unverified",
              format: "number",
              value: 8,
              drill: {
                alias: "users-list",
                args: {
                  audience: UsersAudience.HUMANS,
                  requiredState: AccountStateFilter.UNVERIFIED,
                },
              },
            },
          ],
          attention: [
            {
              label: "reviewUnverified",
              count: 3,
              severity: "info",
              drill: {
                alias: "users-list",
                args: {
                  signupFrom: "2026-11-19",
                  signupTo: "2026-11-25",
                  audience: UsersAudience.HUMANS,
                  requiredState: AccountStateFilter.UNVERIFIED,
                },
              },
            },
          ],
          attentionAvailable: true,
          recent: [],
        },
      },
    },
  },
});
export type UsersSummaryOutput = typeof GET.types.ResponseOutput;
export default { GET };
