"use client";

import { Badge } from "next-vibe/ui/components/badge";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Span } from "next-vibe/ui/components/span";
import { usePickerCallback } from "next-vibe/unified-ui/_shared/picker-context";
import {
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

function CategoryRow({
  category,
  isChild,
  onClick,
  labelActive,
  labelInactive,
  labelViewProducts,
}: {
  category: Category;
  isChild: boolean;
  onClick: () => void;
  labelActive: string;
  labelInactive: string;
  labelViewProducts: string;
}): JSX.Element {
  return (
    <Div
      className={[
        "flex items-center gap-3 py-2.5 border-b last:border-b-0 cursor-pointer transition-colors group",
        isChild ? "pl-8 pr-3" : "px-3",
        category.isActive
          ? "hover:bg-muted/20"
          : "opacity-50 hover:bg-muted/10",
      ].join(" ")}
      onClick={onClick}
    >
      {isChild && (
        <Span className="text-muted-foreground text-xs shrink-0">
          {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}└
        </Span>
      )}
      <Span className="text-sm font-medium flex-1 group-hover:text-primary transition-colors">
        {category.name}
      </Span>
      <Div className="flex items-center gap-2 shrink-0">
        <Span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {labelViewProducts}
        </Span>
        {category.sortOrder !== null && category.sortOrder !== undefined ? (
          <Span className="text-xs text-muted-foreground font-mono">
            {/* eslint-disable-next-line oxlint-plugin-i18n/no-literal-string */}
            #{category.sortOrder}
          </Span>
        ) : null}
        <Badge
          variant={category.isActive ? "default" : "secondary"}
          className="text-xs"
        >
          {category.isActive ? labelActive : labelInactive}
        </Badge>
      </Div>
    </Div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProductCategoryListWidget(_props: {
  field: (typeof definition.GET)["fields"];
}): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const { push: navigate, pop, canGoBack } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onPick = usePickerCallback<Category>();
  const isPickerMode = !!onPick;

  const handleCreate = (): void => {
    void (async (): Promise<void> => {
      const def = await import("../create/definition");
      navigate(def.default.POST, {});
    })();
  };

  // Group: parent categories first, children nested by parentId
  const categories = data?.categories ?? [];
  const parents = categories.filter((c) => c.parentId === null);
  const childrenByParent = new Map<string, Category[]>();
  for (const c of categories) {
    if (c.parentId !== null && c.parentId !== undefined) {
      const list = childrenByParent.get(c.parentId) ?? [];
      list.push(c);
      childrenByParent.set(c.parentId, list);
    }
  }

  const labelActive = t("get.widget.active");
  const labelInactive = t("get.widget.inactive");
  const labelAddCategory = t("get.widget.addCategory");
  const labelEmpty = t("get.widget.empty");
  const labelViewProducts = t("get.widget.viewProducts");

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("get.widget.back")}
        </Button>
      )}

      <Div className="flex items-center justify-between">
        <Div className="flex items-center gap-2">
          {data?.total !== undefined ? (
            <Span className="text-xs text-muted-foreground">
              {data.total} {t("get.response.total").toLowerCase()}
            </Span>
          ) : null}
        </Div>
        {!isPickerMode && (
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleCreate}
          >
            {labelAddCategory}
          </Button>
        )}
      </Div>

      {categories.length > 0 ? (
        <Div className="rounded-md border overflow-hidden">
          {parents.map((parent) => (
            <Div key={parent.id}>
              <CategoryRow
                category={parent}
                isChild={false}
                onClick={(): void => {
                  if (isPickerMode && onPick) {
                    onPick(parent);
                    pop();
                    return;
                  }
                  void (async (): Promise<void> => {
                    const def = await import("../../catalog/list/definition");
                    navigate(def.default.GET, {
                      data: { filters: { categoryId: parent.id } },
                    });
                  })();
                }}
                labelActive={labelActive}
                labelInactive={labelInactive}
                labelViewProducts={labelViewProducts}
              />
              {(childrenByParent.get(parent.id) ?? []).map((child) => (
                <CategoryRow
                  key={child.id}
                  category={child}
                  isChild
                  onClick={(): void => {
                    if (isPickerMode && onPick) {
                      onPick(child);
                      pop();
                      return;
                    }
                    void (async (): Promise<void> => {
                      const def = await import("../../catalog/list/definition");
                      navigate(def.default.GET, {
                        data: { filters: { categoryId: child.id } },
                      });
                    })();
                  }}
                  labelActive={labelActive}
                  labelInactive={labelInactive}
                  labelViewProducts={labelViewProducts}
                />
              ))}
            </Div>
          ))}
          {/* Orphaned children (no parent found) */}
          {categories
            .filter(
              (c) =>
                c.parentId !== null &&
                c.parentId !== undefined &&
                !parents.some((p) => p.id === c.parentId),
            )
            .map((c) => (
              <CategoryRow
                key={c.id}
                category={c}
                isChild={false}
                onClick={(): void => {
                  if (isPickerMode && onPick) {
                    onPick(c);
                    pop();
                    return;
                  }
                  void (async (): Promise<void> => {
                    const def = await import("../../catalog/list/definition");
                    navigate(def.default.GET, {
                      data: { filters: { categoryId: c.id } },
                    });
                  })();
                }}
                labelActive={labelActive}
                labelInactive={labelInactive}
                labelViewProducts={labelViewProducts}
              />
            ))}
        </Div>
      ) : data?.categories !== undefined ? (
        <Div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-md">
          {labelEmpty}
        </Div>
      ) : null}
    </Div>
  );
}
