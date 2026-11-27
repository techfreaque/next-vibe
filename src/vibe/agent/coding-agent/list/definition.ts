import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { CODING_AGENT_LIST_ALIAS } from "../constants";
import { agentStatusSchema, codingAgentProviderSchema } from "../enum";
import {
  codingAgentErrorTypes,
  codingAgentRoles,
  linesField,
  optionalNameField,
  threadIdResponseField,
} from "../fields";
import { scopedTranslation } from "../i18n";

const ListWidget = lazyWidget(() =>
  import("./widget").then((module) => ({ default: module.ListWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "coding-agent", "list"],
  aliases: [CODING_AGENT_LIST_ALIAS, "agent-list", "agent-status"],
  title: "codingAgent.list.post.title",
  titleShort: "codingAgent.list.post.titleShort",
  description: "codingAgent.list.post.description",
  category: "ai",
  subCategory: "Tools",
  tags: ["codingAgent.tags.tasks" as const],
  icon: "list",
  allowedRoles: codingAgentRoles,
  cli: { firstCliArgKey: "name" },
  fields: customWidgetObject({
    render: ListWidget,
    usage: { request: "data", response: true },
    children: {
      name: optionalNameField,
      lines: linesField,
      agents: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        label: "codingAgent.list.post.fields.agents.label",
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "codingAgent.run.post.fields.name.label",
              schema: z.string(),
            }),
            provider: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "codingAgent.run.post.fields.provider.label",
              schema: codingAgentProviderSchema,
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "codingAgent.run.post.fields.status.label",
              schema: agentStatusSchema,
            }),
            threadId: threadIdResponseField,
            cwd: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "codingAgent.run.post.fields.cwd.label",
              schema: z.string().optional(),
            }),
            startedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "codingAgent.list.post.fields.startedAt.label",
              schema: z.string().optional(),
            }),
            finishedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "codingAgent.list.post.fields.finishedAt.label",
              schema: z.string().optional(),
            }),
          },
        }),
      }),
      tail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.list.post.fields.tail.label",
        schema: z.string().optional(),
      }),
      lastMessage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.list.post.fields.lastMessage.label",
        schema: z.string().optional(),
      }),
      lastError: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "codingAgent.list.post.fields.lastError.label",
        schema: z.string().optional(),
      }),
    },
  }),
  errorTypes: codingAgentErrorTypes,
  successTypes: {
    title: "codingAgent.list.post.success.title",
    description: "codingAgent.list.post.success.description",
  },
  examples: {
    requests: { default: {}, one: { name: "fix-login", lines: 30 } },
    responses: {
      default: { agents: [] },
      one: {
        agents: [
          {
            name: "fix-login",
            provider: "codex",
            status: "running",
            threadId: "019e0000-0000-7000-8000-000000000000",
          },
        ],
        tail: "Checking the login tests.",
      },
    },
  },
});

export type CodingAgentListRequest = typeof POST.types.RequestOutput;
export type CodingAgentListResponse = typeof POST.types.ResponseOutput;
export default { POST } as const;
