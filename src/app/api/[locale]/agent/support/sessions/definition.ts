import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const SupportSessionsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SupportSessionsContainer })),
);

const sessionSchema = z.object({
  id: z.string().uuid(),
  threadId: z.string().uuid().nullable(),
  initiatorInstanceUrl: z.string().nullable(),
  supporterInstanceUrl: z.string().nullable(),
  status: z.string(),
  createdAt: z.string(),
});

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET as const,
  path: ["agent", "support", "sessions"] as const,
  title: "sessions.title",
  description: "sessions.description",
  category: "endpointCategories.support",
  subCategory: "endpointCategories.support",
  icon: "list",
  tags: ["sessions.tags.support", "sessions.tags.queue"] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: SupportSessionsContainer,
    usage: { response: true } as const,
    children: {
      sessions: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.array(sessionSchema),
      }),
    },
  }),

  examples: {
    responses: {
      default: {
        sessions: [
          {
            id: "660e8400-e29b-41d4-a716-446655440000",
            threadId: "550e8400-e29b-41d4-a716-446655440000",
            initiatorInstanceUrl: "https://hermes.example.com",
            supporterInstanceUrl: null,
            status: "pending",
            createdAt: "2026-04-23T12:00:00Z",
          },
        ],
      },
    },
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "sessions.errors.validation.title" as const,
      description: "sessions.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "sessions.errors.network.title" as const,
      description: "sessions.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "sessions.errors.unauthorized.title" as const,
      description: "sessions.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "sessions.errors.forbidden.title" as const,
      description: "sessions.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "sessions.errors.notFound.title" as const,
      description: "sessions.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "sessions.errors.server.title" as const,
      description: "sessions.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "sessions.errors.unknown.title" as const,
      description: "sessions.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "sessions.errors.unsaved.title" as const,
      description: "sessions.errors.unsaved.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "sessions.errors.conflict.title" as const,
      description: "sessions.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "sessions.success.title" as const,
    description: "sessions.success.description" as const,
  },
});

export type SessionsResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
