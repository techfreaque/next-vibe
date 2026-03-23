/**
 * Vibe Sense - NOT Evaluator Endpoint Definition
 *
 * Client+server safe. No server imports.
 * Inverts a signal stream.
 */

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
    EndpointErrorTypes,
    LayoutType,
    Methods,
    WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
    signalsRequestField,
    signalsResponseField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { EVALUATOR_NOT_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [EVALUATOR_NOT_ALIAS],
  method: Methods.POST,
  path: ["system", "unified-interface", "vibe-sense", "evaluators", "not"],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "app.endpointCategories.analyticsEvaluators",
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
