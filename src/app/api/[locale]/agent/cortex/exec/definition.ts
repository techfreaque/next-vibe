/**
 * Cortex Exec Definition
 * POST endpoint for executing shell commands on machines via persistent terminals.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ExecBackend, ExecBackendDB } from "../../../ssh/enum";
import { CORTEX_EXEC_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexExecWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexExecWidget })),
);

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "cortex", "exec"],
  aliases: [CORTEX_EXEC_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultAiPinned: [UserRole.CUSTOMER, UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.path && request?.command) {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: {
          path: request.path,
          command: String(request.command).slice(0, 60),
        },
      };
    }
    return undefined;
  },
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  statusBadge: {
    loading: {
      label: "post.status.loading" as const,
      color: "bg-amber-500/10 text-amber-500",
    },
    done: {
      label: "post.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  icon: "terminal",
  category: "cortex",
  tags: ["post.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexExecWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      path: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.path.label" as const,
        description: "post.fields.path.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      command: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.command.label" as const,
        description: "post.fields.command.description" as const,
        placeholder: "post.fields.command.placeholder" as const,
        columns: 12,
        schema: z.string().min(1).max(10000),
      }),
      workingDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.workingDir.label" as const,
        description: "post.fields.workingDir.description" as const,
        placeholder: "post.fields.workingDir.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      terminalId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.terminalId.label" as const,
        description: "post.fields.terminalId.description" as const,
        columns: 6,
        schema: z.string().uuid().optional(),
      }),
      timeoutMs: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.fields.timeoutMs.label" as const,
        description: "post.fields.timeoutMs.description" as const,
        placeholder: "post.fields.timeoutMs.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(300000).optional(),
      }),

      // === RESPONSE ===
      output: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.output.content" as const,
        schema: z.string(),
      }),
      exitCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.exitCode.title" as const,
        schema: z.number(),
      }),
      cwd: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.cwd.content" as const,
        schema: z.string(),
      }),
      backend: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.backend.title" as const,
        schema: z.enum(ExecBackendDB),
      }),
      truncated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.truncated.title" as const,
        schema: z.boolean().optional(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
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

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      simple: {
        path: "/ssh/local-machine",
        command: "echo hello",
      },
      withCwd: {
        path: "/ssh/local-machine",
        command: "ls -la",
        workingDir: "/tmp",
      },
    },
    responses: {
      simple: {
        output: "hello\n",
        exitCode: 0,
        cwd: "/home/user",
        terminalId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        backend: ExecBackend.LOCAL,
        truncated: false,
      },
      error: {
        output: "ls: cannot access '/nonexistent': No such file or directory\n",
        exitCode: 2,
        cwd: "/home/user",
        terminalId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        backend: ExecBackend.SSH,
        truncated: false,
      },
    },
  },
});

export type CortexExecRequestOutput = typeof POST.types.RequestOutput;
export type CortexExecResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
