/**
 * Unified Inbox Move API Definition
 * Moves a message to a different folder via the MessengerProvider interface.
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["messenger", "inbox", "move"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  category: "messenger",
  subCategory: "Inbox",
  icon: "move",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "container.title",
    description: "container.description",
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      accountId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "accountId.label",
        description: "accountId.description",
        placeholder: "accountId.placeholder",
        columns: 12,
        schema: z.string().uuid(),
      }),

      uid: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "uid.label",
        description: "uid.description",
        placeholder: "uid.placeholder",
        columns: 4,
        schema: z.coerce.number().int().positive(),
      }),

      fromFolder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fromFolder.label",
        description: "fromFolder.description",
        placeholder: "fromFolder.placeholder",
        columns: 4,
        schema: z.string().min(1),
      }),

      toFolder: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "toFolder.label",
        description: "toFolder.description",
        placeholder: "toFolder.placeholder",
        columns: 4,
        schema: z.string().min(1),
      }),

      moved: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "moved.label",
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "success.title",
    description: "success.description",
  },

  examples: {
    requests: {
      default: {
        accountId: "00000000-0000-0000-0000-000000000001",
        uid: 123,
        fromFolder: "INBOX",
        toFolder: "Archive",
      },
    },
    responses: {
      default: {
        moved: true,
      },
    },
  },
});

export type InboxMoveRequestInput = typeof POST.types.RequestInput;
export type InboxMoveRequestOutput = typeof POST.types.RequestOutput;
export type InboxMoveResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
