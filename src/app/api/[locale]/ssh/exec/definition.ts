/**
 * SSH Exec Endpoint Definition
 * POST /ssh/exec - Run a shell command (local child_process or SSH)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  ExecBackend,
  ExecBackendDB,
  SshCommandStatus,
  SshCommandStatusDB,
} from "../enum";
import { SSH_EXEC_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const SshExecContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.SshExecContainer })),
);

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "exec"],
  aliases: [SSH_EXEC_ALIAS],
  title: "post.title",
  description: "post.description",
  icon: "terminal",
  category: "endpointCategories.ssh",
  subCategory: "endpointCategories.sshExecution",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: SshExecContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      connectionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.connectionId.label",
        description: "post.fields.connectionId.description",
        placeholder: "post.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      command: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.command.label",
        description: "post.fields.command.description",
        placeholder: "post.fields.command.placeholder",
        schema: z.string().min(1).max(10000),
      }),
      workingDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.workingDir.label",
        description: "post.fields.workingDir.description",
        placeholder: "post.fields.workingDir.placeholder",
        schema: z.string().optional(),
      }),
      timeoutMs: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.timeoutMs.label",
        description: "post.fields.timeoutMs.description",
        placeholder: "post.fields.timeoutMs.placeholder",
        schema: z.coerce.number().min(1).max(300000).optional(),
      }),

      // === RESPONSE FIELDS ===
      stdout: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.stdout.title",
        schema: z.string(),
      }),
      stderr: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.stderr.title",
        schema: z.string(),
      }),
      exitCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.exitCode.title",
        schema: z.number(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.status.title",
        schema: z.enum(SshCommandStatusDB),
      }),
      durationMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.durationMs.title",
        schema: z.number(),
      }),
      backend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.backend.title",
        schema: z.enum(ExecBackendDB),
      }),
      truncated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.truncated.title",
        schema: z.boolean().optional(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
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
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.title",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
  },

  examples: {
    requests: { default: { command: "echo hello" } },
    responses: {
      default: {
        stdout: "hello\n",
        stderr: "",
        exitCode: 0,
        status: SshCommandStatus.SUCCESS,
        durationMs: 12,
        backend: ExecBackend.LOCAL,
        truncated: false,
      },
    },
  },
});

export type SshExecRequestOutput = typeof POST.types.RequestOutput;
export type SshExecResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
