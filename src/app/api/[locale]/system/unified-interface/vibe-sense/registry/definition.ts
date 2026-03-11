/**
 * Vibe Sense — Registry Definition
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayField,
  responseArrayOptionalField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "unified-interface", "vibe-sense", "registry"],
  title: "get.title",
  description: "get.description",
  icon: "layers",
  category: "app.endpointCategories.system",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title",
    description: "get.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      indicators: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.indicator.id",
              schema: z.string(),
            }),
            domain: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.indicator.domain",
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.indicator.description",
              schema: z.string().optional(),
            }),
            resolution: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.indicator.resolution",
              schema: z.string(),
            }),
            persist: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.indicator.persist",
              schema: z.string(),
            }),
            lookback: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.indicator.lookback",
              schema: z.number().optional(),
            }),
            inputs: responseArrayOptionalField(scopedTranslation, {
              type: WidgetType.CONTAINER,
              child: responseField(scopedTranslation, {
                type: WidgetType.TEXT,
                content: "get.response.indicator.inputs.item",
                schema: z.string(),
              }),
            }),
            isDerived: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.indicator.isDerived",
              schema: z.boolean(),
            }),
            isMultiValue: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.indicator.isMultiValue",
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
  examples: { responses: { default: { indicators: [] } } },
});

const definitions = { GET };
export default definitions;
