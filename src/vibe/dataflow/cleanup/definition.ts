/**
 * Vibe Sense - Cleanup Definition
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/dataflow/cleanup/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import { objectField, responseField } from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "dataflow", "cleanup"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "trash",
  category: "analytics",
  subCategory: "Vibe Sense",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      nodesProcessed: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.nodesProcessed",
        schema: z.number(),
      }),
      totalDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.totalDeleted",
        schema: z.number(),
      }),
      snapshotsDeleted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.snapshotsDeleted",
        schema: z.number(),
      }),
      graphsChecked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.graphsChecked",
        schema: z.number(),
      }),
      graphsExecuted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.graphsExecuted",
        schema: z.number(),
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
    responses: {
      default: {
        nodesProcessed: 3,
        totalDeleted: 150,
        snapshotsDeleted: 12,
        graphsChecked: 5,
        graphsExecuted: 2,
      },
    },
  },
});

const definitions = { POST };
export default definitions;
