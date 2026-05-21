"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Box } from "next-vibe-ui/ui/icons/Box";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { ProductsListResponseOutput } from "./definition";
import type { ProductsListT } from "./i18n";

type Product = ProductsListResponseOutput["products"][number];

function formatDate(epoch: number | null): string {
  if (epoch === null) {
    return "—";
  }
  return new Date(epoch).toLocaleDateString();
}

const TYPE_COLORS: Record<string, string> = {
  STANDARD: "bg-primary/10 text-primary",
  CUSTOM: "bg-warning/10 text-warning",
  PLUS: "bg-success/10 text-success",
};

function ProductRow({
  product,
  t,
  compact,
}: {
  product: Product;
  t: ProductsListT;
  compact: boolean;
}): React.JSX.Element {
  if (compact) {
    return (
      <Div className="py-1 text-sm font-mono">
        <Span className="font-semibold">{product.label}</Span>
        <Span className="text-muted-foreground">{` [${product.code}]`}</Span>
        <Span className="ml-2">
          {` ${t("get.widget.compact.type")}${product.type}`}
        </Span>
        {product.trial && (
          <Span className="ml-2 text-warning font-semibold">trial</Span>
        )}
        {product.dealer && (
          <Span className="ml-2 text-muted-foreground">dealer</Span>
        )}
        {product.orgResourceId !== null && (
          <Span className="text-muted-foreground">
            {` ${t("get.widget.compact.org")}${product.orgResourceId}`}
          </Span>
        )}
      </Div>
    );
  }

  return (
    <Div className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-accent transition-colors">
      <Div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Box className="h-4 w-4 text-primary" />
      </Div>

      <Div className="flex-1 min-w-0">
        <Div className="flex items-center gap-2 flex-wrap">
          <Span className="font-semibold text-sm">{product.label}</Span>
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              TYPE_COLORS[product.type] ?? "bg-muted text-muted-foreground",
            )}
          >
            {product.type}
          </Span>
          {product.trial && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
              {t("get.response.products.trial")}
            </Span>
          )}
          {product.dealer && (
            <Span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {t("get.response.products.dealer")}
            </Span>
          )}
        </Div>
        <Div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <Span className="font-mono">{product.code}</Span>
          {product.orgResourceId !== null && (
            <>
              <Span>{t("get.widget.compact.separator")}</Span>
              <Span>{product.orgResourceId}</Span>
            </>
          )}
        </Div>
      </Div>

      <Div className="flex flex-col items-end gap-0.5 shrink-0">
        <Span className="text-xs text-muted-foreground font-mono">
          {formatDate(product.creationDate)}
        </Span>
        <Span className="text-xs text-muted-foreground/60">
          {product.autorenewDefaultValueForNewLicenses ? "↻" : "—"}
        </Span>
      </Div>
    </Div>
  );
}

export function ProductListContainer(): React.JSX.Element {
  const platform = useWidgetPlatform();
  const { endpointMutations } = useWidgetContext();
  const { pop } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const data = useWidgetValue<typeof definition.GET>();

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const isLoading = data === undefined;
  const isCli = platform === Platform.CLI;
  const isMcp = platform === Platform.MCP;
  const isCompact = isCli || isMcp;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  if (isCompact) {
    if (!data) {
      return <Div />;
    }
    return (
      <Div className="font-mono text-sm p-2">
        <Div className="font-semibold mb-1">
          {t("get.widget.title")} ({products.length}/{total})
          {isMcp && ` — use page/pageSize to paginate`}
        </Div>
        {products.length === 0 ? (
          <Div className="text-muted-foreground">
            {t("get.widget.noProductsFound")}
          </Div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              t={t}
              compact={true}
            />
          ))
        )}
      </Div>
    );
  }

  return (
    <Div className="flex flex-col min-h-0">
      <Div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            pop();
          }}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("get.widget.back")}
        </Button>
        <Box className="h-4 w-4 text-muted-foreground" />
        <Span className="font-semibold text-sm mr-auto">
          {t("get.widget.title")}
          {total > 0 && (
            <Span className="ml-2 text-xs text-muted-foreground font-normal">
              ({total})
            </Span>
          )}
        </Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      <Div className="overflow-y-auto max-h-[min(700px,calc(100dvh-200px))]">
        {isLoading ? (
          <Div className="h-48 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </Div>
        ) : products.length === 0 ? (
          <Div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Box className="h-8 w-8 opacity-30" />
            <Span className="text-sm">{t("get.widget.noProductsFound")}</Span>
          </Div>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              t={t}
              compact={false}
            />
          ))
        )}
      </Div>
    </Div>
  );
}
