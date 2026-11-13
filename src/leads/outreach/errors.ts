/**
 * Shared error types for every outreach endpoint (all 9 required).
 * Client+server safe.
 */

import { EndpointErrorTypes } from "next-vibe/core/definition/enums";

export const outreachErrorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title",
    description: "errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",
    description: "errors.unauthorized.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title",
    description: "errors.notFound.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title",
    description: "errors.network.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
} as const;
