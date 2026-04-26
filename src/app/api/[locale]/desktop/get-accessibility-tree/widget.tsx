/**
 * Get Accessibility Tree Widget
 * Form: appName, maxDepth, includeActions toggle
 * Result: collapsible tree viewer with search
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";
import { useState } from "react";

import { useWidgetValue } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { BooleanFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/boolean-field/widget";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/widget";

import type definition from "./definition";
import type { DesktopGetAccessibilityTreeResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.POST)["fields"];
}

function TreeViewer({
  data,
}: {
  data: DesktopGetAccessibilityTreeResponseOutput;
}): JSX.Element {
  const [filter, setFilter] = useState("");

  if (!data.tree) {
    // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string
    return <Span className="text-sm text-muted-foreground">No tree data</Span>;
  }

  const lines = data.tree.split("\n");
  const filtered = filter
    ? lines.filter((l) => l.toLowerCase().includes(filter.toLowerCase()))
    : lines;

  return (
    <Div className="flex flex-col gap-2">
      {/* Stats + truncation warning */}
      <Div className="flex flex-wrap gap-2 items-center">
        {data.nodeCount !== null && data.nodeCount !== undefined ? (
          <Badge variant="secondary" className="text-xs">
            {data.nodeCount} nodes
          </Badge>
        ) : null}
        {data.truncated ? (
          <Badge
            variant="outline"
            className="text-xs text-amber-600 border-amber-300"
          >
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            ⚠ Truncated
          </Badge>
        ) : null}
        <Span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} line{filtered.length === 1 ? "" : "s"}
        </Span>
      </Div>

      {/* Search/filter */}
      <Input
        type="text"
        value={filter}
        onChange={(e): void => setFilter(e.target.value)}
        placeholder="Filter nodes…"
        className="text-xs rounded border border-border bg-muted/30 px-2.5 py-1.5 font-mono outline-none focus:ring-1 focus:ring-ring w-full"
      />

      {/* Tree output */}
      <Div className="rounded-lg border bg-muted/20 overflow-auto max-h-[500px] p-3">
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

  return (
    <Div className="flex flex-col gap-4">
      <FormAlertWidget field={{}} />

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
        <SubmitButtonWidget<typeof definition.POST> field={{}} />
      </Div>

      {data?.success && data.tree ? (
        <TreeViewer data={data} />
      ) : data?.error ? (
        <Span className="text-sm text-destructive">{data.error}</Span>
      ) : null}
    </Div>
  );
}
