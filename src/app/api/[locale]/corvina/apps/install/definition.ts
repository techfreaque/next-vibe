import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CorvinaAppInstallStatus } from "../enums";
import { scopedTranslation } from "./i18n";

const AppInstallContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AppInstallContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "apps", "install"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "download",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.apps" as const],
  aliases: ["corvina_install_app", "install_corvina_app"],

  fields: customWidgetObject({
    render: AppInstallContainer,
    usage: { request: "data", response: true } as const,
    children: {
      organizationId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.organizationId.label" as const,
        description: "post.organizationId.description" as const,
        placeholder: "post.organizationId.placeholder" as const,
        columns: 12,
        schema: z.coerce.number().int().positive(),
      }),
      manifest: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.manifest.label" as const,
        description: "post.manifest.description" as const,
        placeholder: "post.manifest.placeholder" as const,
        columns: 12,
        schema: z
          .string()
          .min(2)
          .refine(
            (val) => {
              try {
                JSON.parse(val);
                return true;
              } catch {
                return false;
              }
            },
            { message: "Manifest must be valid JSON" },
          ),
      }),
      appId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.appId.label" as const,
        description: "post.appId.description" as const,
        placeholder: "post.appId.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().int().positive().optional(),
      }),
      planId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.planId.label" as const,
        description: "post.planId.description" as const,
        placeholder: "post.planId.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number().nullable(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.status" as const,
        schema: z.enum(CorvinaAppInstallStatus).nullable(),
      }),
      appKey: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.appKey" as const,
        schema: z.string().nullable(),
      }),
      appName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.appName" as const,
        schema: z.string().nullable(),
      }),
      serviceAccountUsername: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.serviceAccountUsername" as const,
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.createdAt" as const,
        schema: z.string().nullable(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "download",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        organizationId: 45511,
        manifest:
          '{"key":"unbottled-ai","name":{"value":"Unbottled AI"},"description":{"value":"AI chat for Corvina"},"type":"APP","status":"ACTIVE","baseUrl":"https://bath-evidence-upward.ngrok-free.dev","apiVersion":"1.0.0","authentication":{"type":"JWT"},"vendor":{"name":"Unbottled AI","website":"https://unbottled.ai","email":"contact@unbottled.ai"},"hooks":{"globalPage":{"id":"unbottled-ai-globalPage","title":{"value":"AI Chat"},"url":"/","iconUrl":"/images/corvina-icon.svg"},"navigationDrawerPages":[{"title":{"value":"AI Chat"},"url":"/","iconUrl":"/images/corvina-icon.svg"}]},"scopes":{"userImpersonation":true},"lifecycle":{"installed":"/api/corvina/lifecycle/installed","uninstalled":"/api/corvina/lifecycle/uninstalled"}}',
        appId: undefined,
        planId: undefined,
      },
    },
    responses: {
      default: {
        id: 1,
        status: CorvinaAppInstallStatus.INSTALLATION,
        appKey: "unbottled-ai",
        appName: "Unbottled AI",
        serviceAccountUsername: "svc-unbottled-ai",
        createdAt: "2026-05-12T08:00:00Z",
      },
    },
  },
});

export type CorvinaAppInstallRequestOutput = typeof POST.types.RequestOutput;
export type CorvinaAppInstallResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
