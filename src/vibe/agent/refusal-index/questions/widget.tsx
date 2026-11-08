"use client";

/**
 * Refusal Index - Questions widget (admin).
 * The question set is data: this is where admins add, edit, (de)activate and delete it.
 */

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
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

import type definition from "./definition";

export function QuestionsWidget(): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const mutations = useWidgetEndpointMutations();

  const refresh = (): void => {
    mutations?.read?.refetch?.();
  };

  const handleAdd = (): void => {
    void (async (): Promise<void> => {
      const def = await import("./definition");
      navigate(def.default.POST, {
        renderInModal: true,
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      });
    })();
  };

  const handleEdit = (
    question: NonNullable<typeof data>["questions"][number],
  ): void => {
    void (async (): Promise<void> => {
      const def = await import("./[id]/definition");
      navigate(def.default.PATCH, {
        urlPathParams: { id: question.id },
        data: {
          category: question.category,
          active: question.active,
          textEn: question.textEn,
          textDe: question.textDe ?? "",
          textPl: question.textPl ?? "",
        },
        renderInModal: true,
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      });
    })();
  };

  const handleDelete = (id: string): void => {
    void (async (): Promise<void> => {
      const def = await import("./[id]/definition");
      navigate(def.default.DELETE, {
        urlPathParams: { id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
        onSuccessCallback: refresh,
      });
    })();
  };

  const questions = data?.questions ?? [];

  return (
    <WidgetShell>
      <WidgetHeader
        title={`${t("questions.get.title")}${data ? ` (${String(data.total)})` : ""}`}
        actions={
          <Button type="button" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            <Span>{t("questions.widget.add")}</Span>
          </Button>
        }
      />

      {data && data.categories.length > 0 && (
        <Div className="flex flex-wrap gap-2">
          {data.categories.map((entry) => (
            <Badge key={entry.category} variant="outline">
              {`${entry.category} (${String(entry.count)})`}
            </Badge>
          ))}
        </Div>
      )}

      {!data && (
        <P className="text-sm text-muted-foreground">
          {t("questions.widget.loading")}
        </P>
      )}

      {data && questions.length === 0 && (
        <Div className="flex flex-col items-center gap-3 rounded-md border border-dashed py-12 text-center">
          <P className="text-sm font-medium">
            {t("questions.widget.empty.title")}
          </P>
          <P className="max-w-md text-xs text-muted-foreground">
            {t("questions.widget.empty.hint")}
          </P>
          <Button type="button" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            <Span>{t("questions.widget.empty.cta")}</Span>
          </Button>
        </Div>
      )}

      {questions.length > 0 && (
        <Div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border">
          {questions.map((question) => (
            <Div
              key={question.id}
              className="flex items-start gap-3 px-4 py-3"
              data-question-slug={question.slug}
            >
              <Div className="flex min-w-0 flex-1 flex-col gap-1">
                <Div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{question.category}</Badge>
                  <Span className="font-mono text-xs text-muted-foreground">
                    {question.slug}
                  </Span>
                  <Badge variant={question.active ? "default" : "secondary"}>
                    {question.active
                      ? t("questions.widget.active")
                      : t("questions.widget.inactive")}
                  </Badge>
                </Div>
                <P className="text-sm [overflow-wrap:anywhere]">
                  {question.textEn}
                </P>
              </Div>
              <Div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(): void => handleEdit(question)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={(): void => handleDelete(question.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </Div>
            </Div>
          ))}
        </Div>
      )}
    </WidgetShell>
  );
}
