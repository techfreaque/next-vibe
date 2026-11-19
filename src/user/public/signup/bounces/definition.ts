import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import { Methods, WidgetType } from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  responseField,
  widgetField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { signupErrorTypes } from "../definition";
import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "public", "signup", "bounces"],
  aliases: ["signup-bounce-sync"],
  title: "bounceSync.title",
  titleShort: "bounceSync.title",
  description: "bounceSync.description",
  category: "account",
  icon: "mail",
  tags: ["tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],
  fields: customWidgetObject({
    render: lazyWidget(() => import("./widget")),
    usage: { request: "data", response: true },
    children: {
      alert: widgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        usage: { request: "data" },
      }),
      submit: widgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "bounceSync.title",
        usage: { request: "data" },
      }),
      marked: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "bounceSync.marked",
        schema: z.number(),
      }),
    },
  }),
  errorTypes: signupErrorTypes,
  successTypes: {
    title: "bounceSync.title",
    description: "bounceSync.description",
  },
  examples: {
    responses: { default: { marked: 0 } },
  },
});

export type SignupBounceSyncResponse = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
