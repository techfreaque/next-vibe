import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/tooling/infra/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "tooling", "infra", "cluster", "init"],
  title: "cluster.init.post.title",
  titleShort: "cluster.init.post.titleShort",
  description: "cluster.init.post.description",
  icon: "server",
  category: "devTools",
  subCategory: "Generators",
  allowedRoles: [UserRole.ADMIN, UserRole.PRODUCTION_OFF],
  aliases: ["cluster-init", "init-cluster", "infra-init"],
  tags: ["category" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "cluster.init.post.container.title",
    usage: { request: "data", response: true },
    children: {
      clusterName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cluster.init.post.fields.clusterName.label",
        description: "cluster.init.post.fields.clusterName.description",
        placeholder: "cluster.init.post.fields.clusterName.placeholder",
        schema: z.string().min(1).max(63),
      }),
      domain: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cluster.init.post.fields.domain.label",
        description: "cluster.init.post.fields.domain.description",
        placeholder: "cluster.init.post.fields.domain.placeholder",
        schema: z.string().min(3),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cluster.init.post.fields.email.label",
        description: "cluster.init.post.fields.email.description",
        placeholder: "cluster.init.post.fields.email.placeholder",
        schema: z.email(),
      }),
      k3sVersion: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "cluster.init.post.fields.k3sVersion.label",
        description: "cluster.init.post.fields.k3sVersion.description",
        placeholder: "cluster.init.post.fields.k3sVersion.placeholder",
        schema: z.string().optional().default("v1.31.0+k3s1"),
      }),
      dryRun: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "cluster.init.post.fields.dryRun.label",
        description: "cluster.init.post.fields.dryRun.description",
        schema: z.boolean().optional().default(false),
      }),
      skipDatabase: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "cluster.init.post.fields.skipDatabase.label",
        description: "cluster.init.post.fields.skipDatabase.description",
        schema: z.boolean().optional().default(false),
      }),
      skipRedis: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "cluster.init.post.fields.skipRedis.label",
        description: "cluster.init.post.fields.skipRedis.description",
        schema: z.boolean().optional().default(false),
      }),
      skipStorage: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "cluster.init.post.fields.skipStorage.label",
        description: "cluster.init.post.fields.skipStorage.description",
        schema: z.boolean().optional().default(false),
      }),
      skipIngress: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "cluster.init.post.fields.skipIngress.label",
        description: "cluster.init.post.fields.skipIngress.description",
        schema: z.boolean().optional().default(false),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cluster.init.post.response.success.title",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cluster.init.post.response.message.title",
        schema: z.string(),
      }),
      nodesProvisioned: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cluster.init.post.response.nodesProvisioned.title",
        schema: z.number(),
      }),
      componentsInstalled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cluster.init.post.response.componentsInstalled.title",
        schema: z.array(z.string()),
      }),
      kubeconfig: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cluster.init.post.response.kubeconfig.title",
        schema: z.string(),
      }),
      duration: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "cluster.init.post.response.duration.title",
        schema: z.number(),
      }),
    },
  }),

  successTypes: {
    title: "cluster.init.post.success.title",
    description: "cluster.init.post.success.description",
  },

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "cluster.init.post.errors.validation.title",
      description: "cluster.init.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "cluster.init.post.errors.unauthorized.title",
      description: "cluster.init.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "cluster.init.post.errors.forbidden.title",
      description: "cluster.init.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "cluster.init.post.errors.server.title",
      description: "cluster.init.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "cluster.init.post.errors.notFound.title",
      description: "cluster.init.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "cluster.init.post.errors.unknown.title",
      description: "cluster.init.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "cluster.init.post.errors.unsavedChanges.title",
      description: "cluster.init.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "cluster.init.post.errors.conflict.title",
      description: "cluster.init.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "cluster.init.post.errors.network.title",
      description: "cluster.init.post.errors.network.description",
    },
  },

  examples: {
    requests: {
      default: {
        clusterName: "next-vibe-prod",
        domain: "example.com",
        email: "admin@example.com",
        k3sVersion: "v1.31.0+k3s1",
        dryRun: true,
        skipDatabase: false,
        skipRedis: false,
        skipStorage: false,
        skipIngress: false,
      },
      quickStart: {
        clusterName: "my-cluster",
        domain: "myapp.com",
        email: "me@myapp.com",
        k3sVersion: "v1.31.0+k3s1",
        dryRun: false,
        skipDatabase: false,
        skipRedis: false,
        skipStorage: false,
        skipIngress: false,
      },
    },
    responses: {
      default: {
        success: true,
        message: "Cluster 'next-vibe-prod' ready. 2 node(s) provisioned.",
        nodesProvisioned: 2,
        componentsInstalled: [
          "k3s",
          "database (CloudNativePG)",
          "redis (sentinel)",
          "storage (MinIO)",
          "ingress (nginx + cert-manager)",
        ],
        kubeconfig: "apiVersion: v1...",
        duration: 240000,
      },
    },
  },
});

export type ClusterInitRequestOutput = typeof POST.types.RequestOutput;
export type ClusterInitResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
