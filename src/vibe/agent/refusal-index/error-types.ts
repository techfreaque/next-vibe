/**
 * Shared endpoint error/success blocks for every Refusal Index endpoint
 * (all 9 error types, keys live once in the module i18n).
 */

import { EndpointErrorTypes } from "next-vibe/core/definition/enums";

export const REFUSAL_ERROR_TYPES = {
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
} as const;

export const REFUSAL_SUCCESS_TYPES = {
  title: "success.title" as const,
  description: "success.description" as const,
} as const;
