/**
 * Cortex Move Definition
 * POST endpoint for moving/renaming files and directories
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

import { CORTEX_MOVE_ALIAS, resolveCortexIcon } from "../constants";
import { scopedTranslation } from "./i18n";

const CortexMoveWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexMoveWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "cortex", "move"],
  aliases: [CORTEX_MOVE_ALIAS] as const,
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "move",
  dynamicTitle: ({ request }) => {
    if (request?.from) {
      return {
        message: "post.dynamicTitle" as const,
        messageParams: { from: request.from, to: request.to ?? "" },
      };
    }
    return undefined;
  },
  dynamicIcon: ({ request }) => resolveCortexIcon(request?.from),
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
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["post.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexMoveWidget,
    usage: { request: "data", response: true } as const,
    children: {
      from: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.from.label" as const,
        description: "post.fields.from.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.to.label" as const,
        description: "post.fields.to.description" as const,
        columns: 12,
        schema: z.string().min(1),
      }),

      // === RESPONSE ===
      responseFrom: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.from.content" as const,
        schema: z.string(),
        fieldName: "from",
      }),
      responseTo: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.to.content" as const,
        schema: z.string(),
        fieldName: "to",
      }),
      nodesAffected: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.nodesAffected.text" as const,
        schema: z.number(),
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
      renameFile: {
        from: "/documents/notes/old-name.md",
        to: "/documents/notes/new-name.md",
      },
      moveFolder: {
        from: "/documents/drafts",
        to: "/documents/archive/drafts",
      },
    },
    responses: {
      moved: {
        responseFrom: "/documents/notes/old-name.md",
        responseTo: "/documents/notes/new-name.md",
        nodesAffected: 1,
      },
    },
  },
});

export type CortexMoveResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
