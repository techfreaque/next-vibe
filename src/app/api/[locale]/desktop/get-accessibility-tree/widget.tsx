"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import {
  useWidgetForm,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { BooleanFieldWidget } from "next-vibe-ui/unified/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe-ui/unified/interactive/submit-button/widget";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import { DesktopNavHeader } from "../shared/nav-header";
import type definition from "./definition";
import type { DesktopGetAccessibilityTreeResponseOutput } from "./definition";

type T = ReturnType<typeof useWidgetTranslation>;

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function TreeViewer({
  data,
  t,
}: {
  data: DesktopGetAccessibilityTreeResponseOutput;
  t: T;
}): JSX.Element {
  const [filter, setFilter] = useState("");

  if (!data.tree) {
    return (
      <Span className="text-sm text-muted-foreground">
        {t("widget.noWindows")}
      </Span>
    );
  }

  const lines = data.tree.split("\n");
  const filtered = filter
    ? lines.filter((l) => l.toLowerCase().includes(filter.toLowerCase()))
    : lines;

  return (
    <Div className="flex flex-col flex-1 min-h-0 gap-2 p-4">
      {/* Stats row */}
      <Div className="flex flex-wrap gap-2 items-center shrink-0">
        {data.nodeCount !== null && data.nodeCount !== undefined ? (
          <Badge variant="secondary" className="text-xs">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            {data.nodeCount} nodes
          </Badge>
        ) : null}
        {data.truncated ? (
          <Badge
            variant="outline"
            className="text-xs text-amber-600 border-amber-300"
          >
            {t("widget.labelTruncated")}
          </Badge>
        ) : null}
        <Span className="text-xs text-muted-foreground ml-auto">
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
          {filtered.length} line{filtered.length === 1 ? "" : "s"}
        </Span>
      </Div>

      {/* Search */}
      <Input
        type="text"
        value={filter}
        onChange={(e): void => setFilter(e.target.value)}
        placeholder={t("widget.filterPlaceholder")}
        className="text-xs font-mono shrink-0"
      />

      {/* Tree */}
      <Div className="flex-1 overflow-auto rounded-lg border bg-muted/20 p-3 min-h-0">
        <Pre className="text-xs font-mono whitespace-pre leading-5">
          {filtered.join("\n")}
        </Pre>
      </Div>
    </Div>
  );
}

export function GetAccessibilityTreeWidget({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.POST>();
  const onSubmit = useWidgetOnSubmit();

  useEffect((): void => {
    if (!data && onSubmit) {
      onSubmit();
    }
  }, [data, onSubmit]);

  const appName = form?.getValues("appName") as string | undefined;
  const isLoading = !data;

  const handleListWindows = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../list-windows/definition");
      navigate(def.default.POST, {});
    })();
  };

  return (
    <Div className="flex flex-col h-full">
      <DesktopNavHeader
        title={appName ?? t("widget.titleA11yTree")}
        right={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={(): void => {
              onSubmit?.();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
          </Button>
        }
      />

      {isLoading ? (
        <Div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Div>
      ) : data?.success && data.tree ? (
        <Div className="flex flex-col flex-1 min-h-0">
          <TreeViewer data={data} t={t} />
          <Div className="px-4 py-3 border-t shrink-0">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={handleListWindows}
            >
              {t("widget.actionAllWindows")}
            </Button>
          </Div>
        </Div>
      ) : (
        /* Form / no-data state */
        <Div className="flex flex-col gap-4 p-4">
          <Div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Div className="col-span-2">
              <TextFieldWidget fieldName="appName" field={children.appName} />
            </Div>
            <NumberFieldWidget fieldName="maxDepth" field={children.maxDepth} />
          </Div>
          <BooleanFieldWidget
            fieldName="includeActions"
            field={children.includeActions}
          />

          <Div className="flex gap-2">
            <NavigateButtonWidget field={{}} />
            <FormAlertWidget field={{}} />
            <SubmitButtonWidget<typeof definition.POST> field={{}} />
          </Div>

          {data?.error ? (
            <Span className="text-sm text-destructive">{data.error}</Span>
          ) : null}
        </Div>
      )}
    </Div>
  );
}
