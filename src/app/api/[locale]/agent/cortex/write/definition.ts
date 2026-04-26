/**
 * Cortex Write Definition
 * POST endpoint for creating or overwriting files in /documents/
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
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CORTEX_WRITE_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexWriteWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexWriteWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "cortex", "write"],
  aliases: [CORTEX_WRITE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  dynamicTitle: ({ request }) => {
    if (request?.path) {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { path: request.path },
      };
    }
    return undefined;
  },
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
  icon: "edit",
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.path),
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["post.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexWriteWidget,
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
      content: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.fields.content.label" as const,
        description: "post.fields.content.description" as const,
        columns: 12,
        schema: z.string(),
      }),
      createParents: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.createParents.label" as const,
        description: "post.fields.createParents.description" as const,
        columns: 6,
        schema: z.boolean().optional().default(true),
      }),

      // === RESPONSE ===
      responsePath: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.path.content" as const,
        schema: z.string(),
        fieldName: "path",
      }),
      size: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.size.text" as const,
        schema: z.number(),
      }),
      created: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.created.text" as const,
        schema: z.boolean(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.updatedAt.content" as const,
        schema: z.string(),
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
      createNote: {
        path: "/documents/notes/meeting.md",
        content:
          "---\ndate: 2026-04-17\n---\n\n# Team Meeting\n\nDiscussed Cortex architecture.",
        createParents: true,
      },
      createTask: {
        path: "/documents/tasks/fix-auth.md",
        content:
          "---\nstatus: open\npriority: 3\n---\n\n# Fix Auth Bug\n\nSession tokens expire too early.",
      },
    },
    responses: {
      created: {
        responsePath: "/documents/notes/meeting.md",
        size: 78,
        created: true,
        updatedAt: "2026-04-17T14:30:00Z",
      },
      overwritten: {
        responsePath: "/documents/notes/meeting.md",
        size: 120,
        created: false,
        updatedAt: "2026-04-17T15:00:00Z",
      },
    },
  },
});

export type CortexWriteResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
