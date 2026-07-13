/**
 * Sync Providers List
 * GET — return all registered sync providers so the UI can build dynamic toggles.
 *
 * This is the single source of truth for the sync scope UI. Widgets must NOT
 * hardcode provider keys — they fetch this list and render based on it.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  customWidgetObject,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "remote-connection", "sync", "providers"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "settings" as const,
  category: "devTools",
  subCategory: "remoteInstances",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    usage: { response: true } as const,
    children: {
      providers: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.array(
          z.object({
            key: z.string(),
            label: z.string(),
            description: z.string(),
          }),
        ),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: undefined,
    responses: {
      default: {
        providers: [
          {
            key: "memories",
            label: "Memories",
            description: "Sync your AI memories across instances",
          },
          {
            key: "documents",
            label: "Documents",
            description: "Sync your document library",
          },
          {
            key: "skills",
            label: "Skills",
            description: "Sync custom skills and prompts",
          },
          {
            key: "favorites",
            label: "Favorites",
            description: "Sync saved favorite configurations",
          },
          {
            key: "threads",
            label: "Threads",
            description: "Sync conversation threads and messages",
          },
        ],
      },
    },
  },
});

export type SyncProvidersGetResponseOutput = typeof GET.types.ResponseOutput;
export type SyncProviderInfo =
  SyncProvidersGetResponseOutput["providers"][number];

const endpoints = { GET } as const;
export default endpoints;
