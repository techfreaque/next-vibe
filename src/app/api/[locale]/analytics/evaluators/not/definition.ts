/**
 * Vibe Sense - NOT Evaluator Endpoint Definition
 *
 * Client+server safe. No server imports.
 * Inverts a signal stream.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import {
  signalsRequestField,
  signalsResponseField,
} from "next-vibe/core/utils/dataflow/shared/fields";
import { UserRole } from "next-vibe/identity/roles/enum";
import { objectField } from "next-vibe/unified-ui/_shared/utils";

import { EVALUATOR_NOT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EVALUATOR_NOT_ALIAS],
  method: Methods.POST,
  path: ["analytics", "evaluators", "not"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "Evaluators",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      signal: signalsRequestField(scopedTranslation, {
        label: "post.fields.signal.label",
      }),
      result: signalsResponseField(scopedTranslation, {
        label: "post.fields.result.label",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
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
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        signal: [
          { timestamp: new Date("2024-01-01"), fired: true },
          { timestamp: new Date("2024-01-02"), fired: false },
          { timestamp: new Date("2024-01-03"), fired: true },
        ],
      },
    },
    responses: {
      default: {
        result: [
          { timestamp: new Date("2024-01-01"), fired: false },
          { timestamp: new Date("2024-01-02"), fired: true },
          { timestamp: new Date("2024-01-03"), fired: false },
        ],
      },
    },
  },
});

const definitions = { POST };
export default definitions;
