import { EndpointErrorTypes } from "next-vibe/core/definition/enums";

export const billMailboxErrors = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.fields",
    description: "errors.fields",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.forbidden",
    description: "errors.forbidden",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden",
    description: "errors.forbidden",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.read",
    description: "errors.read",
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.read",
    description: "errors.read",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.read",
    description: "errors.read",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict",
    description: "errors.conflict",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.read",
    description: "errors.read",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.fields",
    description: "errors.fields",
  },
} as const;

export const billMailboxSuccess = {
  title: "success.title",
  description: "success.description",
} as const;
