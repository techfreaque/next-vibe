import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CODING_AGENT_SAY_ALIAS } from "../constants";
import {
  codingAgentErrorTypes,
  codingAgentRoles,
  requiredNameField,
} from "../fields";
import { scopedTranslation } from "../i18n";

const SayWidget = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.SayWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "coding-agent", "say"],
  aliases: [CODING_AGENT_SAY_ALIAS, "agent-say"],
  title: "codingAgent.say.post.title",
  titleShort: "codingAgent.say.post.titleShort",
  description: "codingAgent.say.post.description",
  category: "ai",
  subCategory: "Tools",
  tags: ["codingAgent.tags.tasks" as const],
  icon: "send",
  allowedRoles: codingAgentRoles,
  cli: { firstCliArgKey: "name" },
  fields: customWidgetObject({
    render: SayWidget,
    usage: { request: "data", response: true },
    children: {
      name: requiredNameField,
      message: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "codingAgent.say.post.fields.message.label",
        description: "codingAgent.say.post.fields.message.description",
        schema: z.string().optional(),
      }),
      messageFile: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "codingAgent.say.post.fields.messageFile.label",
        description: "codingAgent.say.post.fields.messageFile.description",
        schema: z.string().optional(),
      }),
      delivered: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.say.post.fields.delivered.label",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: codingAgentErrorTypes,
  successTypes: {
    title: "codingAgent.say.post.success.title",
    description: "codingAgent.say.post.success.description",
  },
  examples: {
    requests: {
      default: { name: "fix-login", message: "Also cover the logout path." },
    },
    responses: {
      default: { delivered: true },
    },
  },
});

export type CodingAgentSayRequest = typeof POST.types.RequestOutput;
export type CodingAgentSayResponse = typeof POST.types.ResponseOutput;
export default { POST } as const;
