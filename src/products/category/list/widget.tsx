"use client";

import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { RecordTable } from "next-vibe/ui/components/record-table";
import { Span } from "next-vibe/ui/components/span";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";
import type { CategoryListGetResponseOutput } from "./definition";

type Category = NonNullable<
  CategoryListGetResponseOutput["categories"]
>[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProductCategoryListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const onPick = usePickerCallback<Category>();
  const isPickerMode = !!onPick;

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.default.POST, {});
    })();
  };
  const open = (category: Category): void => {
    if (isPickerMode && onPick) {
      onPick(category);
      pop();
      return;
    }
    void (async (): Promise<void> => {
      const def = await import("../../catalog/list/definition");
      navigate(def.default.GET, {
        data: { filters: { categoryId: category.id } },
      });
    })();
  };

  // Parents first, each followed by its children; orphans at the end.
  const categories = data?.categories ?? [];
  const byId = new Map(categories.map((c) => [c.id, c]));
  const parents = categories.filter(
    (c) => !c.parentId || !byId.has(c.parentId),
  );
  const ordered = parents.flatMap((parent) => [
    parent,
    ...categories.filter((c) => c.parentId === parent.id),
  ]);
  const parentName = (category: Category): string =>
    (category.parentId && byId.get(category.parentId)?.name) || "";

  const statusPill = (isActive: boolean): JSX.Element => (
    <StatusPill
      status={isActive ? "active" : "inactive"}
      label={isActive ? t("get.widget.active") : t("get.widget.inactive")}
      variant={isActive ? "success" : "muted"}
    />
  );
  const nameCell = (category: Category): JSX.Element => (
    <Div className="flex min-w-0 flex-col">
      <Span className="font-medium">{category.name}</Span>
      {category.parentId && parentName(category) ? (
        <Span className="text-xs text-muted-foreground">
          {t("get.widget.inParent", { parent: parentName(category) })}
        </Span>
      ) : null}
    </Div>
  );

  const orderCell = (category: Category): JSX.Element => (
    <Span className="tabular-nums text-muted-foreground">
      {new Intl.NumberFormat(locale).format(category.sortOrder ?? 0)}
    </Span>
  );

  return (
    <WidgetShell layout={isPickerMode ? "compact" : "page"}>
      <WidgetHeader
        size={isPickerMode ? "section" : "page"}
        title={t("get.title")}
        subtitle={
          data && !isPickerMode
            ? t("get.widget.count", {
                count: new Intl.NumberFormat(locale).format(data.total),
              })
            : undefined
        }
        backButton={
          canGoBack && !isPickerMode ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => pop()}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              {t("get.widget.back")}
            </Button>
          ) : undefined
        }
        actions={
          !isPickerMode ? (
            <Button type="button" onClick={handleCreate}>
              <Plus className="size-4" aria-hidden="true" />
              {t("get.widget.addCategory")}
            </Button>
          ) : undefined
        }
      />

      {!data ? (
        <LoadingBlock />
      ) : ordered.length > 0 ? (
        <RecordTable
          label={t("get.title")}
          columns={[
            { id: "name", label: t("get.widget.columnName") },
            { id: "order", label: t("get.widget.columnOrder"), numeric: true },
            { id: "status", label: t("get.widget.columnStatus") },
          ]}
          rows={ordered.map((category) => ({
            id: category.id,
            onOpen: (): void => open(category),
            cells: {
              name: nameCell(category),
              order: orderCell(category),
              status: statusPill(category.isActive),
            },
          }))}
          compact={
            <Div className="flex flex-col gap-2">
              {ordered.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  subtitle={
                    category.parentId && parentName(category)
                      ? t("get.widget.inParent", {
                          parent: parentName(category),
                        })
                      : undefined
                  }
                  badges={statusPill(category.isActive)}
                  onClick={(): void => open(category)}
                />
              ))}
            </Div>
          }
        />
      ) : (
        <EmptyBlock
          size="page"
          className="rounded-xl border bg-card"
          title={t("get.widget.emptyTitle")}
          message={t("get.widget.empty")}
          action={
            isPickerMode
              ? undefined
              : { label: t("get.widget.addCategory"), onClick: handleCreate }
          }
        />
      )}
    </WidgetShell>
  );
}
