/**
 * SSH Exec Endpoint Definition
 * POST /ssh/exec — Run a shell command (local child_process or SSH)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
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
import { scopedTranslation } from "../i18n";
import { SshExecContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "exec"],
  title: "exec.post.title",
  description: "exec.post.description",
  icon: "terminal",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: SshExecContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "exec.post.fields.connectionId.label",
        description: "exec.post.fields.connectionId.description",
        placeholder: "exec.post.fields.connectionId.placeholder",
        schema: z.string().uuid().optional(),
      }),
      command: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "exec.post.fields.command.label",
        description: "exec.post.fields.command.description",
        placeholder: "exec.post.fields.command.placeholder",
        schema: z.string().min(1).max(10000),
      }),
      workingDir: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "exec.post.fields.workingDir.label",
        description: "exec.post.fields.workingDir.description",
        placeholder: "exec.post.fields.workingDir.placeholder",
        schema: z.string().optional(),
      }),
      timeoutMs: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "exec.post.fields.timeoutMs.label",
        description: "exec.post.fields.timeoutMs.description",
        placeholder: "exec.post.fields.timeoutMs.placeholder",
        schema: z.coerce.number().min(1).max(300000).optional(),
      }),

      // === RESPONSE FIELDS ===
      stdout: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.stdout.title",
        schema: z.string(),
      }),
      stderr: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.stderr.title",
        schema: z.string(),
      }),
      exitCode: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.exitCode.title",
        schema: z.number(),
      }),
      status: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.status.title",
        schema: z.enum(SshCommandStatusDB),
      }),
      durationMs: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.durationMs.title",
        schema: z.number(),
      }),
      backend: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.backend.title",
        schema: z.enum(ExecBackendDB),
      }),
      truncated: responseField({
        type: WidgetType.TEXT,
        content: "exec.post.response.truncated.title",
        schema: z.boolean().optional(),
      }),
    },
  }),

  successTypes: {
    title: "exec.post.success.title",
    description: "exec.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "exec.post.errors.validation.title",
      description: "exec.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "exec.post.errors.unauthorized.title",
      description: "exec.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "exec.post.errors.forbidden.title",
      description: "exec.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "exec.post.errors.server.title",
      description: "exec.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "exec.post.errors.notFound.title",
      description: "exec.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "exec.post.errors.unknown.title",
      description: "exec.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "exec.post.errors.unsavedChanges.title",
      description: "exec.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "exec.post.errors.conflict.title",
      description: "exec.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "exec.post.errors.network.title",
      description: "exec.post.errors.network.description",
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
