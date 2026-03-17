/**
 * Vibe Sense — Backtest Widget
 * Form with date range + resolution, shows eligibility and ineligible nodes.
 */

"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Div } from "next-vibe-ui/ui/div";
import { Check } from "next-vibe-ui/ui/icons/Check";
import { X } from "next-vibe-ui/ui/icons/X";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import { P } from "next-vibe-ui/ui/typography";
import React, { useState } from "react";

import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";

import type definition from "./definition";

type BacktestResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: BacktestResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toDatetimeLocal(iso: string): string {
  if (!iso) {
    return "";
  }
  try {
    const d = new Date(iso);
    return `${String(d.getFullYear())}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  } catch {
    return "";
  }
}

// ─── Widget ──────────────────────────────────────────────────────────────────

export function BacktestWidget({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const children = field.children;
  const response = field.value;

  const defaultFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const defaultTo = new Date();

  const [localFrom, setLocalFrom] = useState<string>(
    toDatetimeLocal(defaultFrom.toISOString()),
  );
  const [localTo, setLocalTo] = useState<string>(
    toDatetimeLocal(defaultTo.toISOString()),
  );

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Form fields */}
      <Div className="grid grid-cols-3 gap-3">
        {/* datetime-local for rangeFrom */}
        <Div className="flex flex-col gap-1">
          <Label className="text-xs">{t("post.fields.rangeFrom.label")}</Label>
          <Input
            type="datetime-local"
            className="h-8 text-xs w-full"
            value={localFrom}
            onChangeText={(v) => {
              setLocalFrom(v);
              if (v) {
                form.setValue("rangeFrom", new Date(v).toISOString());
              }
            }}
          />
        </Div>
        {/* datetime-local for rangeTo */}
        <Div className="flex flex-col gap-1">
          <Label className="text-xs">{t("post.fields.rangeTo.label")}</Label>
          <Input
            type="datetime-local"
            className="h-8 text-xs w-full"
            value={localTo}
            onChangeText={(v) => {
              setLocalTo(v);
              if (v) {
                form.setValue("rangeTo", new Date(v).toISOString());
              }
            }}
          />
        </Div>
        <SelectFieldWidget fieldName="resolution" field={children.resolution} />
      </Div>

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.title", icon: "wind" }}
      />

      {/* Results */}
      {response !== null && response !== undefined && (
        <Div className="flex flex-col gap-3 mt-2">
          {/* Eligibility badge */}
          <Div className="flex items-center gap-2">
            {response.eligible ? (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                {t("post.widget.eligible")}
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <X className="h-3 w-3" />
                {t("post.widget.notEligible")}
              </Badge>
            )}
            {response.runId && (
              <Span className="text-xs text-muted-foreground font-mono">
                {t("post.widget.runLabel")} {response.runId}
              </Span>
            )}
          </Div>

          {/* Ineligible nodes list */}
          {response.ineligibleNodes && response.ineligibleNodes.length > 0 && (
            <Div className="flex flex-col gap-1">
              <P className="text-xs text-muted-foreground">
                {t("post.widget.ineligibleNodesLabel")}
              </P>
              <Div className="flex flex-wrap gap-1">
                {response.ineligibleNodes.map((nodeId) => (
                  <Badge
                    key={nodeId}
                    variant="outline"
                    className="text-xs font-mono text-red-500 border-red-300"
                  >
                    {nodeId}
                  </Badge>
                ))}
              </Div>
              <P className="text-[10px] text-muted-foreground mt-1">
                {t("post.widget.ineligibleNodesHint")}
              </P>
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
