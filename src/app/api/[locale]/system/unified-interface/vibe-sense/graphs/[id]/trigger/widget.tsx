/**
 * Vibe Sense — Trigger Widget
 * Form with date range picker + submit, shows results on success.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetForm,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { SubmitButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/submit-button/react";

import type definition from "./definition";

type TriggerResponseOutput = typeof definition.POST.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: TriggerResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
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

export function TriggerWidget({ field }: CustomWidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const form = useWidgetForm<typeof definition.POST>();
  const response = field.value;

  const defaultFrom = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
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
      <Div className="grid grid-cols-2 gap-3">
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
                form?.setValue("rangeFrom", new Date(v).toISOString());
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
                form?.setValue("rangeTo", new Date(v).toISOString());
              }
            }}
          />
        </Div>
      </Div>

      <FormAlertWidget field={{}} />

      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.title", icon: "play" }}
      />

      {/* Results */}
      {response !== null && response !== undefined && (
        <Div className="grid grid-cols-2 gap-3 mt-2">
          <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {t("post.widget.nodesExecuted")}
            </Span>
            <Span className="text-2xl font-bold tabular-nums">
              {response.nodeCount ?? 0}
            </Span>
          </Div>
          <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {t("post.widget.errors")}
            </Span>
            <Span
              className={cn(
                "text-2xl font-bold tabular-nums",
                (response.errorCount ?? 0) > 0 && "text-destructive",
              )}
            >
              {response.errorCount ?? 0}
            </Span>
          </Div>
        </Div>
      )}
    </Div>
  );
}
