"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

function statusVariant(
  status: string,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "PAID") {
    return "default";
  }
  if (status === "OPEN") {
    return "secondary";
  }
  if (status === "VOID") {
    return "destructive";
  }
  return "secondary";
}

export function InvoicePublicViewWidget({
  field,
}: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();

  if (data?.id) {
    return (
      <Div className="flex flex-col gap-4">
        <Div className="flex flex-col gap-3 p-4 rounded-lg border">
          <Div className="flex items-center justify-between">
            <Div className="flex flex-col gap-0.5">
              {data.companyName && (
                <Span className="text-xs text-muted-foreground">
                  {data.companyName}
                </Span>
              )}
              <Span className="text-base font-semibold">
                {data.invoiceNumber ?? data.id}
              </Span>
            </Div>
            <Badge variant={statusVariant(data.status)} className="text-xs">
              {data.status}
            </Badge>
          </Div>

          <Div className="flex items-baseline gap-2 mt-1">
            <Span className="text-3xl font-mono font-bold">{data.amount}</Span>
            <Span className="text-sm text-muted-foreground font-semibold">
              {data.currency}
            </Span>
          </Div>

          {data.dueDate && (
            <Span className="text-sm text-muted-foreground">
              {t("get.response.dueDate")}:{" "}
              {new Date(data.dueDate).toLocaleDateString()}
            </Span>
          )}
        </Div>

        {data.lines && data.lines.length > 0 && (
          <Div className="flex flex-col gap-1 rounded-lg border overflow-hidden">
            <Div className="grid grid-cols-4 gap-2 px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground">
              <Span className="col-span-2">
                {t("get.response.lineDescription")}
              </Span>
              <Span className="text-right">{t("get.response.quantity")}</Span>
              <Span className="text-right">{t("get.response.lineTotal")}</Span>
            </Div>
            {data.lines.map((line) => (
              <Div
                key={line.id}
                className="grid grid-cols-4 gap-2 px-3 py-2 text-sm border-t"
              >
                <Span className="col-span-2 text-sm">{line.description}</Span>
                <Span className="text-right text-muted-foreground">
                  {line.quantity}
                </Span>
                <Span className="text-right font-mono font-semibold">
                  {line.lineTotal}
                </Span>
              </Div>
            ))}
          </Div>
        )}

        {data.notes && (
          <Div className="p-3 rounded-lg border bg-muted/30">
            <Span className="text-xs text-muted-foreground">{data.notes}</Span>
          </Div>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4">
      <Span className="text-base font-semibold">{t("get.title")}</Span>
      <Span className="text-sm text-muted-foreground">
        {t("get.description")}
      </Span>

      <TextFieldWidget
        fieldName="token"
        field={withValue(field.children.token, undefined, null)}
      />

      <FormAlertWidget field={{}} />
      <SubmitButtonWidget<typeof definition.GET>
        field={{ text: "widget.submit" as const }}
      />
    </Div>
  );
}
