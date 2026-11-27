"use client";

import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import {
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

export function ListWidget({
  field,
}: {
  field: typeof definition.POST.fields;
}): JSX.Element {
  const value = useWidgetValue<typeof definition.POST>();
  const t = useWidgetTranslation<typeof definition.POST>();
  const responseOnly = useWidgetResponseOnly();
  return (
    <Div className="flex flex-col gap-4 p-4">
      {!responseOnly && (
        <>
          <FormAlertWidget field={{}} />
          <TextFieldWidget fieldName="name" field={field.children.name} />
          <NumberFieldWidget fieldName="lines" field={field.children.lines} />
          <SubmitButtonWidget<typeof definition.POST>
            field={{ text: "codingAgent.list.post.titleShort", icon: "list" }}
          />
        </>
      )}
      {value?.agents.length === 0 && (
        <Span>{t("codingAgent.list.post.fields.noAgents.label")}</Span>
      )}
      {value?.agents.map((agent) => (
        <Div key={agent.name} className="flex flex-col gap-1">
          <Span className="font-semibold">
            {t("codingAgent.list.post.fields.summary", {
              name: agent.name,
              provider: t(agent.provider),
              status: t(agent.status),
            })}
          </Span>
          {agent.cwd && (
            <Span className="text-muted-foreground">{agent.cwd}</Span>
          )}
          {agent.threadId && (
            <Span className="text-muted-foreground">{agent.threadId}</Span>
          )}
        </Div>
      ))}
      {value?.lastError && (
        <Div className="flex flex-col gap-1">
          <Span className="font-semibold">
            {t("codingAgent.list.post.fields.lastError.label")}
          </Span>
          <Span className="text-destructive">{value.lastError}</Span>
        </Div>
      )}
      {value?.lastMessage && (
        <Div className="flex flex-col gap-1">
          <Span className="font-semibold">
            {t("codingAgent.list.post.fields.lastMessage.label")}
          </Span>
          <Span className="whitespace-pre-wrap">{value.lastMessage}</Span>
        </Div>
      )}
      {value?.tail !== undefined && (
        <Div className="flex flex-col gap-2">
          <Span className="font-semibold">
            {t("codingAgent.list.post.fields.tail.label")}
          </Span>
          <Span className="whitespace-pre-wrap font-mono">
            {value.tail || t("codingAgent.list.post.fields.emptyTail.label")}
          </Span>
        </Div>
      )}
    </Div>
  );
}

ListWidget.cliWidget = true as const;
