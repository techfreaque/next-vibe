import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["infra", "cluster", "status"],
  title: "cluster.status.get.title",
  description: "cluster.status.get.description",
  icon: "activity",
  category: "endpointCategories.devTools",
  subCategory: "endpointCategories.devToolsGenerators",
  allowedRoles: [UserRole.ADMIN],
  aliases: ["cluster-status", "infra-status"],
  tags: ["category" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "cluster.status.get.container.title",
    usage: { request: "data", response: true },
    children: {
      overallStatus: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "cluster.status.get.response.overallStatus.title",
        schema: z.string(),
      }),
      nodes: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "cluster.status.get.response.nodes.title",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.nodes.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.overallStatus.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            role: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.overallStatus.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            ip: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.overallStatus.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
          },
        }),
      }),
      components: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "cluster.status.get.response.components.title",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.components.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.overallStatus.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
            namespace: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "cluster.status.get.response.overallStatus.title",
              fieldType: FieldDataType.TEXT,
              schema: z.string(),
            }),
          },
        }),
      }),
      podCounts: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "cluster.status.get.response.podCounts.title",
        schema: z.record(z.string(), z.number()),
      }),
    },
  }),

  successTypes: {
    title: "cluster.status.get.success.title",
    description: "cluster.status.get.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "cluster.status.get.errors.validation.title",
      description: "cluster.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "cluster.status.get.errors.unauthorized.title",
      description: "cluster.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "cluster.status.get.errors.forbidden.title",
      description: "cluster.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "cluster.status.get.errors.server.title",
      description: "cluster.status.get.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "cluster.status.get.errors.notFound.title",
      description: "cluster.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "cluster.status.get.errors.unknown.title",
      description: "cluster.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "cluster.status.get.errors.unsavedChanges.title",
      description: "cluster.status.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "cluster.status.get.errors.conflict.title",
      description: "cluster.status.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "cluster.status.get.errors.network.title",
      description: "cluster.status.get.errors.network.description",
    },
  },

  examples: {
    requests: undefined,
    responses: {
      default: {
        overallStatus: "Ready",
        nodes: [
          {
            name: "server-a",
            status: "Ready",
            role: "control-plane",
            ip: "1.2.3.4",
          },
          { name: "server-b", status: "Ready", role: "worker", ip: "1.2.3.5" },
        ],
        components: [
          { name: "postgres", status: "Healthy", namespace: "next-vibe" },
          { name: "redis", status: "Healthy", namespace: "next-vibe" },
          { name: "minio", status: "Healthy", namespace: "next-vibe" },
        ],
        podCounts: { "next-vibe": 8, "kube-system": 6 },
      },
    },
  },
});

export type ClusterStatusResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
