"use client";

/**
 * System Prompt Debug Widget (web)
 * Pick a context, build, read the exact prompt. The CLI/MCP rendering lives in
 * widget.cli.tsx (swapped in by the CLI widget plugin).
 */

import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EntityPickerFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/entity-picker-field/widget";
import { SelectFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

export function SystemPromptDebugWidget({
  field,
}: CustomWidgetProps): JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const diagnostics = data?.cortexDiagnostics;
  const passing =
    diagnostics?.topScores.filter((s) => s.passesThreshold).length ?? 0;

  return (
    <WidgetShell padding="md">
      <WidgetHeader
        title={t("get.title")}
        backButton={<NavigateButtonWidget field={{}} />}
      />

      <Div className="flex flex-col gap-3">
        <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectFieldWidget
            fieldName="rootFolderId"
            field={children.rootFolderId}
          />
          <TextFieldWidget
            fieldName="subFolderId"
            field={children.subFolderId}
          />
          <EntityPickerFieldWidget
            fieldName="threadId"
            field={children.threadId}
          />
          <EntityPickerFieldWidget
            fieldName="skillId"
            field={children.skillId}
          />
        </Div>
        <TextFieldWidget fieldName="userMessage" field={children.userMessage} />
        <FormAlertWidget field={{}} />
        <SubmitButtonWidget<typeof definition.GET> field={{}} />
      </Div>

      {data ? (
        <Div className="flex flex-col gap-4 mt-4">
          <MetricGrid columns={2}>
            <MetricCard
              label={t("get.widget.chars")}
              value={data.charCount.toLocaleString()}
            />
            <MetricCard
              label={t("get.widget.tokens")}
              value={data.tokenEstimate.toLocaleString()}
            />
          </MetricGrid>

          {diagnostics ? (
            <SectionGroup
              title={t("get.response.cortexDiagnostics.text")}
              subtitle={
                !diagnostics.embeddingGenerated
                  ? t("get.widget.cortexFailed")
                  : diagnostics.topScores.length === 0
                    ? t("get.widget.cortexNoNodes")
                    : t("get.widget.cortexPassing", {
                        passing,
                        total: diagnostics.topScores.length,
                      })
              }
            >
              <Div className="flex flex-col gap-1">
                {diagnostics.topScores.map((s) => (
                  <Div
                    key={s.path}
                    className="flex justify-between gap-2 text-xs font-mono"
                  >
                    <Span className="truncate">{s.path}</Span>
                    <Span
                      className={
                        s.passesThreshold
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }
                    >
                      {s.adjustedScore}
                    </Span>
                  </Div>
                ))}
              </Div>
            </SectionGroup>
          ) : null}

          <SectionGroup title={t("get.response.systemPrompt.text")} collapsible>
            <Pre className="text-xs whitespace-pre-wrap break-words max-h-[60vh] overflow-auto">
              {data.systemPrompt}
            </Pre>
          </SectionGroup>

          <SectionGroup
            title={t("get.response.trailingSystemMessage.text")}
            collapsible
          >
            {data.trailingSystemMessage ? (
              <Pre className="text-xs whitespace-pre-wrap break-words max-h-[40vh] overflow-auto">
                {data.trailingSystemMessage}
              </Pre>
            ) : (
              <Span className="text-sm text-muted-foreground">
                {t("get.widget.noTrailing")}
              </Span>
            )}
          </SectionGroup>
        </Div>
      ) : (
        <Div className="mt-4">
          <EmptyBlock
            title={t("get.widget.emptyTitle")}
            message={t("get.widget.emptyMessage")}
          />
        </Div>
      )}
    </WidgetShell>
  );
}
