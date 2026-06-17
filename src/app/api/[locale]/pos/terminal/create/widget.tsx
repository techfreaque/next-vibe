"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import { withValue } from "next-vibe-ui/unified/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import type { JSX } from "react";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";

import type definition from "./definition";

interface PosTerminalCreateWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function PosTerminalCreateWidget({
  field,
}: PosTerminalCreateWidgetProps): JSX.Element {
  const data = useWidgetValue<typeof definition.POST>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const result = data?.result;

  const handleBackToList = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list/definition");
      navigation.push(def.default.GET, {});
    })();
  };

  const handleOpenSession = (terminalId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../session/open/definition");
      navigation.push(def.default.POST, {
        data: { details: { terminalId, openingFloat: undefined } },
      });
    })();
  };

  if (result?.id) {
    return (
      <Div className="flex flex-col gap-6 p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800">
        {/* Success banner */}
        <Div className="flex flex-col gap-0.5">
          <Span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
            {t("terminalCreate.post.success.title")}
          </Span>
          <Span className="text-sm text-muted-foreground">
            {t("terminalCreate.post.success.description")}
          </Span>
        </Div>

        {/* Terminal details */}
        <Div className="rounded-lg border overflow-hidden">
          <Div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <Span className="text-sm font-semibold">{result.name}</Span>
            <Badge
              variant={result.isActive ? "default" : "secondary"}
              className="text-xs"
            >
              {result.isActive
                ? t("terminalCreate.post.widget.active")
                : t("terminalCreate.post.widget.inactive")}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3 border-b">
            <Span className="text-sm text-muted-foreground">
              {t("terminalCreate.post.response.currency")}
            </Span>
            <Badge variant="outline" className="text-xs font-mono">
              {result.currency}
            </Badge>
          </Div>
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("terminalCreate.post.response.id")}
            </Span>
            <Span className="text-xs font-mono text-muted-foreground truncate max-w-48">
              {result.id}
            </Span>
          </Div>
        </Div>

        {/* Actions */}
        <Div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => handleOpenSession(result.id)}
          >
            {t("terminalCreate.post.widget.openSession")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBackToList}
          >
            {t("terminalCreate.post.widget.backToList")}
          </Button>
        </Div>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-5">
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("terminalCreate.post.widget.backToList")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      {/* 2-column form grid */}
      <Div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Div className="sm:col-span-2">
          <TextFieldWidget
            fieldName="details.companyId"
            field={withValue(
              field.children.details.children.companyId,
              undefined,
              null,
            )}
          />
        </Div>
        <TextFieldWidget
          fieldName="details.name"
          field={withValue(
            field.children.details.children.name,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="details.location"
          field={withValue(
            field.children.details.children.location,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="details.currency"
          field={withValue(
            field.children.details.children.currency,
            undefined,
            null,
          )}
        />
        <TextFieldWidget
          fieldName="details.cashAccountNodeId"
          field={withValue(
            field.children.details.children.cashAccountNodeId,
            undefined,
            null,
          )}
        />
      </Div>

      <SubmitButtonWidget<typeof definition.POST> field={{}} />
    </Div>
  );
}
