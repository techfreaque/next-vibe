import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import { Methods, WidgetType } from "next-vibe/core/definition/enums";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CODING_AGENT_INTERRUPT_ALIAS } from "../constants";
import {
  codingAgentErrorTypes,
  codingAgentRoles,
  requiredNameField,
} from "../fields";
import { scopedTranslation } from "../i18n";

const InterruptWidget = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.InterruptWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "coding-agent", "interrupt"],
  aliases: [CODING_AGENT_INTERRUPT_ALIAS, "agent-interrupt"],
  title: "codingAgent.interrupt.post.title",
  titleShort: "codingAgent.interrupt.post.titleShort",
  description: "codingAgent.interrupt.post.description",
  category: "ai",
  subCategory: "Tools",
  tags: ["codingAgent.tags.tasks" as const],
  icon: "square",
  allowedRoles: codingAgentRoles,
  cli: { firstCliArgKey: "name" },
  fields: customWidgetObject({
    render: InterruptWidget,
    usage: { request: "data", response: true },
    children: {
      name: requiredNameField,
      interrupted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.interrupt.post.fields.interrupted.label",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: codingAgentErrorTypes,
  successTypes: {
    title: "codingAgent.interrupt.post.success.title",
    description: "codingAgent.interrupt.post.success.description",
  },
  examples: {
    requests: { default: { name: "fix-login" } },
    responses: { default: { interrupted: true } },
  },
});

export type CodingAgentInterruptRequest = typeof POST.types.RequestOutput;
export type CodingAgentInterruptResponse = typeof POST.types.ResponseOutput;
export default { POST } as const;
