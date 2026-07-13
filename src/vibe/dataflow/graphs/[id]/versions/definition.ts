/**
 * Vibe Sense - Graph Version History Definition
 *
 * GET - Walk the parentVersionId chain for a graph and return the ancestor list.
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { scopedTranslation } from "next-vibe/dataflow/graphs/[id]/versions/i18n";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "dataflow", "graphs", "[id]", "versions"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  icon: "history",
  category: "analytics",
  subCategory: "Vibe Sense",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      id: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("next-vibe/dataflow/graphs/definition")).default.GET,
        labelField: "name",
        label: "get.fields.id.label",
        description: "get.fields.id.description",
        hidden: true,
        schema: z.string().uuid(),
      }),
      versions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true } as const,
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.fields.versions.id.label",
              schema: z.string().uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.fields.versions.name.label",
              schema: z.string(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.fields.versions.createdAt.label",
              schema: dateSchema,
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.fields.versions.isActive.label",
              schema: z.boolean(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  examples: {
    urlPathParams: {
      default: { id: "550e8400-e29b-41d4-a716-446655440000" },
    },
    responses: {
      default: {
        versions: [
          {
            id: "440e8400-e29b-41d4-a716-446655440000",
            name: "Lead Funnel v1",
            createdAt: "2026-03-01T06:00:00.000Z",
            isActive: false,
          },
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            name: "Lead Funnel v2",
            createdAt: "2026-03-14T08:00:00.000Z",
            isActive: true,
          },
        ],
      },
    },
  },
});

const definitions = { GET };
export default definitions;
