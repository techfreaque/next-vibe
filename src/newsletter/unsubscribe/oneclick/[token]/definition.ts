/**
 * Newsletter One-Click Unsubscribe Definition (RFC 8058)
 * Mailbox providers POST `List-Unsubscribe=One-Click` to the URL in the
 * List-Unsubscribe header. The signed token in the path is the only auth.
 */

import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create-i18n";
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["newsletter", "unsubscribe", "oneclick", "[token]"],
  title: "oneClick.post.title",
  titleShort: "oneClick.post.titleShort",
  description: "oneClick.post.description",
  category: "newsletter",
  subCategory: "Subscriptions",
  icon: "bell-off",
  tags: ["oneClick.tag"],
  allowedRoles: [UserRole.PUBLIC, UserRole.AI_TOOL_OFF],
  aliases: ["newsletter-unsubscribe-oneclick"],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "oneClick.post.container.title",
    description: "oneClick.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "urlPathParams", response: true },
    children: {
      token: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "oneClick.post.token.label",
        description: "oneClick.post.token.description",
        columns: 12,
        schema: z.string().min(3).max(1024),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.success",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.message",
        schema: translatedValueSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "oneClick.post.errors.validation.title",
      description: "oneClick.post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "oneClick.post.errors.server.title",
      description: "oneClick.post.errors.server.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "oneClick.post.errors.invalidToken.title",
      description: "oneClick.post.errors.invalidToken.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "oneClick.post.errors.invalidToken.title",
      description: "oneClick.post.errors.invalidToken.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "oneClick.post.errors.invalidToken.title",
      description: "oneClick.post.errors.invalidToken.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "oneClick.post.errors.server.title",
      description: "oneClick.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "oneClick.post.errors.server.title",
      description: "oneClick.post.errors.server.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "oneClick.post.errors.server.title",
      description: "oneClick.post.errors.server.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "oneClick.post.errors.server.title",
      description: "oneClick.post.errors.server.description",
    },
  },

  successTypes: {
    title: "oneClick.post.success.title",
    description: "oneClick.post.success.description",
  },

  examples: {
    urlPathParams: {
      default: { token: "dXNlckBleGFtcGxlLmNvbQ.0123abcd" },
    },
    responses: {
      default: { success: true, message: "oneClick.post.success.title" },
    },
  },
});

export type NewsletterOneClickPostUrlPathParams =
  typeof POST.types.UrlVariablesOutput;
export type NewsletterOneClickPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
