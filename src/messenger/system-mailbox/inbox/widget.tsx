/**
 * Platform Mailbox - Inbox widget (web, CLI, MCP, AI, native)
 */

"use client";

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { Mail } from "next-vibe/ui/components/icons/Mail";
import { ListItem } from "next-vibe/ui/components/list-item";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/number-field/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function SystemMailInboxContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();

  const messages = data?.messages ?? [];

  function openMessage(uid: number): void {
    void (async (): Promise<void> => {
      const def = await import("../message/definition");
      navigation.push(def.default.GET, { data: { messageUid: uid } });
    })();
  }

  return (
    <WidgetShell className="gap-4">
      <WidgetHeader
        title={
          data?.address
            ? `${t("inbox.title")} - ${data.address}`
            : t("inbox.title")
        }
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <SubmitButtonWidget<typeof definition.GET>
            field={{
              text: "inbox.widget.submit",
              loadingText: "inbox.widget.submitting",
              icon: "refresh-cw",
              variant: "ghost",
              size: "sm",
            }}
          />
        }
      />
      <Div className="grid grid-cols-2 gap-3">
        <NumberFieldWidget fieldName="limit" field={children.limit} />
        <BooleanFieldWidget
          fieldName="unreadOnly"
          field={children.unreadOnly}
        />
      </Div>

      {messages.length === 0 ? (
        <EmptyBlock
          icon={<Mail className="h-6 w-6" />}
          title={t("inbox.widget.empty")}
          message={t("inbox.widget.emptyDescription")}
        />
      ) : (
        <Div className="flex flex-col divide-y rounded-lg border">
          {messages.map((message) => (
            <ListItem
              key={message.uid}
              title={message.subject || t("inbox.widget.noSubject")}
              subtitle={`${message.from} · ${message.date.slice(0, 16).replace("T", " ")}`}
              badges={
                message.unread ? (
                  <StatusPill
                    status="unread"
                    variant="info"
                    label={t("inbox.widget.unread")}
                  />
                ) : null
              }
              meta={message.snippet}
              onClick={(): void => openMessage(message.uid)}
            />
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}
