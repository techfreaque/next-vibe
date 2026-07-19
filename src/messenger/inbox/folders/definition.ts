/**
 * Unified Inbox Folders API Definition
 * Lists available folders for any messenger account via the MessengerProvider interface.
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["messenger", "inbox", "folders"],
  title: "title",
  titleShort: "titleShort",
  description: "description",
  category: "messenger",
  subCategory: "Inbox",
  icon: "folder",
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

      folders: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            path: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "folders.path.label",
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "folders.name.label",
              schema: z.string(),
            }),
            displayName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "folders.displayName.label",
              schema: z.string().optional(),
            }),
            specialUseType: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "folders.specialUseType.label",
              schema: z.string().optional(),
            }),
            messageCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "folders.messageCount.label",
              schema: z.number().int(),
            }),
            unseenCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "folders.unseenCount.label",
              schema: z.number().int(),
            }),
          },
        }),
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
      },
    },
    responses: {
      default: {
        folders: [
          {
            path: "INBOX",
            name: "INBOX",
            displayName: "Inbox",
            specialUseType: "\\Inbox",
            messageCount: 42,
            unseenCount: 5,
          },
          {
            path: "Sent",
            name: "Sent",
            displayName: "Sent",
            specialUseType: "\\Sent",
            messageCount: 100,
            unseenCount: 0,
          },
        ],
      },
    },
  },
});

export type InboxFoldersRequestInput = typeof GET.types.RequestInput;
export type InboxFoldersRequestOutput = typeof GET.types.RequestOutput;
export type InboxFoldersResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET };
export default definitions;
