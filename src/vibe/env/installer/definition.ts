/**
 * Visual Installer API Definition
 * GET: Read merged local installer state and live environment checks
 * POST: Refresh checks or run optional private GitHub repository actions
 */

import { z } from "zod";

import { createEndpoint } from "../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "../../core/definition/enums";
import { UserRole } from "../../identity/roles/enum";
import { lazyWidget } from "../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "../../unified-ui/_shared/utils-i18n";
import {
  InstallerAction,
  InstallerActionDB,
  InstallerActionOptions,
  InstallerCheckoutMode,
  InstallerCheckoutModeDB,
  InstallerStepStatus,
  InstallerStepStatusDB,
} from "./enum";
import { scopedTranslation } from "./i18n";

const InstallerWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.InstallerWidget,
  })),
);

export const INSTALLER_STEP_IDS = [
  "git",
  "bun",
  "clone",
  "dependencies",
  "github",
  "server",
] as const;

export type InstallerStepId = (typeof INSTALLER_STEP_IDS)[number];

const installerStepSchema = z.object({
  id: z.enum(INSTALLER_STEP_IDS),
  status: z.enum(InstallerStepStatusDB),
  detail: z.string(),
  recovery: z.string(),
});

const installerGithubSchema = z.object({
  ghInstalled: z.boolean(),
  ghAuthenticated: z.boolean(),
  ghUsername: z.string(),
  isPrivateForkConfigured: z.boolean(),
  privateRepoUrl: z.string(),
  skipped: z.boolean(),
  deviceCode: z.string(),
  deviceVerificationUrl: z.string(),
  devicePending: z.boolean(),
});

const installerSetupSchema = z.object({
  pending: z.boolean(),
  complete: z.boolean(),
  writable: z.boolean(),
});

const snapshotResponseChildren = {
  installDir: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.installDir.title" as const,
    schema: z.string(),
  }),
  os: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.os.title" as const,
    schema: z.string(),
  }),
  arch: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.arch.title" as const,
    schema: z.string(),
  }),
  checkoutMode: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.checkoutMode.title" as const,
    schema: z.enum(InstallerCheckoutModeDB),
  }),
  branch: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.branch.title" as const,
    schema: z.string(),
  }),
  originUrl: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.originUrl.title" as const,
    schema: z.string(),
  }),
  upstreamUrl: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.upstreamUrl.title" as const,
    schema: z.string(),
  }),
  port: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.port.title" as const,
    schema: z.number(),
  }),
  stateFilePath: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.stateFilePath.title" as const,
    schema: z.string(),
  }),
  updatedAt: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.updatedAt.title" as const,
    schema: z.string(),
  }),
  lastError: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.lastError.title" as const,
    schema: z.string(),
  }),
  steps: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.steps.title" as const,
    schema: z.array(installerStepSchema),
  }),
  github: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.github.title" as const,
    schema: installerGithubSchema,
  }),
  setup: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    label: "get.response.setup.title" as const,
    schema: installerSetupSchema,
  }),
};

const EXAMPLE_SNAPSHOT = {
  installDir: "/home/user/next-vibe",
  os: "linux",
  arch: "x86_64",
  checkoutMode: InstallerCheckoutMode.CLONED,
  branch: "main",
  originUrl: "https://github.com/techfreaque/next-vibe.git",
  upstreamUrl: "",
  port: 3000,
  stateFilePath: "/home/user/next-vibe/.tmp/installer-state.json",
  updatedAt: "2026-11-27T00:00:00Z",
  lastError: "",
  steps: [
    {
      id: "git" as const,
      status: InstallerStepStatus.DONE,
      detail: "git version 2.47.0",
      recovery: "",
    },
    {
      id: "bun" as const,
      status: InstallerStepStatus.DONE,
      detail: "bun 1.3.12",
      recovery: "",
    },
    {
      id: "clone" as const,
      status: InstallerStepStatus.DONE,
      detail: "/home/user/next-vibe",
      recovery: "",
    },
    {
      id: "dependencies" as const,
      status: InstallerStepStatus.DONE,
      detail: "node_modules ready",
      recovery: "",
    },
    {
      id: "github" as const,
      status: InstallerStepStatus.PENDING,
      detail: "",
      recovery: "",
    },
    {
      id: "server" as const,
      status: InstallerStepStatus.DONE,
      detail: "http://localhost:3000",
      recovery: "",
    },
  ],
  github: {
    ghInstalled: true,
    ghAuthenticated: false,
    ghUsername: "",
    isPrivateForkConfigured: false,
    privateRepoUrl: "",
    skipped: false,
    deviceCode: "",
    deviceVerificationUrl: "",
    devicePending: false,
  },
  setup: {
    pending: true,
    complete: false,
    writable: true,
  },
};

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "env", "installer"] as const,
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.MCP_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "download" as const,
  category: "devTools",
  subCategory: "settingsEnv",
  tags: ["get.tags.installer" as const],
  aliases: ["installer-status"] as const,

  fields: customWidgetObject({
    render: InstallerWidget,
    usage: { response: true } as const,
    children: snapshotResponseChildren,
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  examples: {
    responses: {
      default: EXAMPLE_SNAPSHOT,
    },
  },
});

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "env", "installer"] as const,
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.MCP_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  icon: "download" as const,
  category: "devTools",
  subCategory: "settingsEnv",
  tags: ["post.tags.installer" as const],
  aliases: ["installer-action"] as const,

  fields: customWidgetObject({
    render: InstallerWidget,
    usage: { request: "data", response: true } as const,
    children: {
      action: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.request.action.label" as const,
        description: "post.request.action.description" as const,
        options: InstallerActionOptions,
        columns: 12,
        schema: z.enum(InstallerActionDB),
      }),
      repoName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.request.repoName.label" as const,
        description: "post.request.repoName.description" as const,
        placeholder: "post.request.repoName.placeholder" as const,
        columns: 12,
        schema: z.string().trim().max(100).optional(),
      }),
      ...snapshotResponseChildren,
      actionMessage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.actionMessage.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  examples: {
    requests: {
      default: {
        action: InstallerAction.REFRESH,
      },
      skipGithub: {
        action: InstallerAction.GITHUB_SKIP,
      },
    },
    responses: {
      default: {
        ...EXAMPLE_SNAPSHOT,
        actionMessage: "Environment checks refreshed.",
      },
      skipGithub: {
        ...EXAMPLE_SNAPSHOT,
        actionMessage: "GitHub setup skipped.",
      },
    },
  },
});

export type InstallerGetResponseOutput = typeof GET.types.ResponseOutput;
export type InstallerPostRequestInput = typeof POST.types.RequestInput;
export type InstallerPostRequestOutput = typeof POST.types.RequestOutput;
export type InstallerPostResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { GET, POST };
export default endpoints;
