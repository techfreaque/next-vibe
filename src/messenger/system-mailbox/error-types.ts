/**
 * Shared endpoint error-type block for the system mailbox endpoints.
 * All 9 EndpointErrorTypes are required on every definition.
 */

import { EndpointErrorTypes } from "next-vibe/core/definition/enums";

export const systemMailboxErrorTypes = {
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
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
} as const;
