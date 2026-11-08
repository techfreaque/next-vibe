"use client";

/**
 * Refusal Index - Run detail widget (admin).
 * Results grid for one run (filters live in the request form) + sample approval.
 */

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { EyeOff } from "next-vibe/ui/components/icons/EyeOff";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetEndpointMutations,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { RefusalVerdict } from "../../enum";
import type definition from "./definition";

export function RunDetailWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();

  const refresh = (): void => {
    mutations?.read?.refetch?.();
  };

  const handleSample = (resultId: string, visible: boolean): void => {
    void (async (): Promise<void> => {
      const def = await import("../../samples/definition");
      navigate(def.default.POST, {
        data: { resultId, visible },
        renderInModal: true,
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      });
    })();
  };

  if (!data) {
    return (
      <WidgetShell>
        <P className="text-sm text-muted-foreground">
          {t("runDetail.widget.loading")}
        </P>
      </WidgetShell>
    );
  }

  const { run } = data;
  return (
    <WidgetShell>
      <WidgetHeader
        title={`${t("runDetail.title")} (${t(run.status)})`}
        backButton={
          canGoBack ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(): void => pop()}
            >
              {t("fields.back.label")}
            </Button>
          ) : undefined
        }
      />

      <Div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="outline">
          {t("enums.verdict.answered")}: {data.answered}
        </Badge>
        <Badge variant="outline">
          {t("enums.verdict.hedged")}: {data.hedged}
        </Badge>
        <Badge variant="outline">
          {t("enums.verdict.refused")}: {data.refused}
        </Badge>
        <Badge variant="outline">
          {t("enums.verdict.error")}: {data.errors}
        </Badge>
        <Badge variant="secondary">
          {run.totalCost} {t("runDetail.widget.credits")}
        </Badge>
        <Badge variant="secondary">
          {run.judgeModelId} ({run.judgePromptVersion})
        </Badge>
      </Div>
      {run.cancelReason && (
        <P className="text-xs text-destructive">{run.cancelReason}</P>
      )}

      {data.results.length === 0 && (
        <P className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          {t("runDetail.widget.empty")}
        </P>
      )}

      <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border">
        {data.results.map((row) => (
          <Div key={row.id} className="flex flex-col gap-1 px-4 py-3">
            <Div className="flex flex-wrap items-center gap-2">
              <Span className="text-sm font-semibold">{row.modelName}</Span>
              {row.tier && (
                <Badge variant="outline">{row.tier.split(".").pop()}</Badge>
              )}
              <Badge variant="outline">{row.category}</Badge>
              <Span className="font-mono text-xs text-muted-foreground">
                {row.questionSlug}
              </Span>
              <Badge
                variant={
                  row.verdict === RefusalVerdict.REFUSED
                    ? "destructive"
                    : row.verdict === RefusalVerdict.ANSWERED
                      ? "default"
                      : "secondary"
                }
              >
                {t(row.verdict)}
              </Badge>
              <Div className="ml-auto flex items-center gap-1">
                {row.sampleVisible === true ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(): void => handleSample(row.id, false)}
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    <Span>{t("runDetail.widget.hide")}</Span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={row.verdict === RefusalVerdict.ERROR}
                    onClick={(): void => handleSample(row.id, true)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <Span>{t("runDetail.widget.approve")}</Span>
                  </Button>
                )}
              </Div>
            </Div>
            <P className="text-xs text-muted-foreground [overflow-wrap:anywhere]">
              {row.judgeReason}
            </P>
            {row.answerExcerpt && (
              <P className="line-clamp-4 text-xs [overflow-wrap:anywhere]">
                {row.answerExcerpt}
              </P>
            )}
          </Div>
        ))}
      </Div>
      <P className="text-xs text-muted-foreground">
        {data.results.length} / {data.total}
      </P>
    </WidgetShell>
  );
}
