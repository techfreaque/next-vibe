"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { Span } from "next-vibe-ui/ui/span";
import type { JSX } from "react";

import {
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe-ui/unified/interactive/form-alert/widget";

import type definition from "./definition";

export function PosSessionGetWidget(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: {
    field: (typeof definition.GET)["fields"];
  },
): JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const session = data?.result;

  const handleCloseSession = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../close/definition");
      navigation.push(def.default.POST, {
        data: {
          details: {
            sessionId,
            closingFloat: 0,
          },
        },
      });
    })();
  };

  const handleNewOrder = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../../order/create/definition");
      navigation.push(def.default.POST, {
        data: {
          details: { sessionId, customerId: undefined, currency: undefined },
        },
      });
    })();
  };

  const handleViewOrders = (sessionId: string): void => {
    void (async (): Promise<void> => {
      const def = await import("../../../order/list/definition");
      navigation.push(def.default.GET, {
        data: {
          input: { sessionId, status: undefined },
          page: 1,
          pageSize: 50,
        },
      });
    })();
  };

  if (!data && !session) {
    return (
      <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
        <FormAlertWidget field={{}} />
        <Div className="flex flex-col items-center gap-3 py-10 text-center">
          <Div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <Span className="text-sm text-muted-foreground">
            {t("sessionGet.get.widget.loading")}
          </Span>
        </Div>
      </Div>
    );
  }

  if (!session) {
    return (
      <Div className="flex flex-col gap-4">
        <FormAlertWidget field={{}} />
      </Div>
    );
  }

  const isOpen = session.status.includes("open");

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-8 pb-6 flex flex-col gap-4">
      {/* Back button */}
      {navigation.canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigation.pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("sessionGet.get.widget.back")}
        </Button>
      )}

      <FormAlertWidget field={{}} />

      {/* Session detail card */}
      <Div className="rounded-lg border overflow-hidden divide-y">
        <Div className="flex items-center justify-between px-4 py-3 bg-muted/30">
          <Span className="text-sm font-semibold">
            {t("sessionGet.get.widget.sessionDetails")}
          </Span>
          <Badge
            variant={isOpen ? "default" : "secondary"}
            className={
              isOpen ? "text-xs bg-blue-600 hover:bg-blue-600" : "text-xs"
            }
          >
            {isOpen
              ? t("enums.sessionStatus.open")
              : t("enums.sessionStatus.closed")}
          </Badge>
        </Div>
        <Div className="flex items-center justify-between px-4 py-3">
          <Span className="text-sm text-muted-foreground">
            {t("sessionGet.get.response.openedAt")}
          </Span>
          <Span className="text-sm tabular-nums">
            {new Date(session.openedAt).toLocaleString(locale)}
          </Span>
        </Div>
        <Div className="flex items-center justify-between px-4 py-3">
          <Span className="text-sm text-muted-foreground">
            {t("sessionGet.get.response.openingFloat")}
          </Span>
          <Span className="text-sm font-mono tabular-nums">
            {new Intl.NumberFormat(locale, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(session.openingFloat)}
          </Span>
        </Div>
        {session.closedAt ? (
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionGet.get.response.closedAt")}
            </Span>
            <Span className="text-sm tabular-nums">
              {new Date(session.closedAt).toLocaleString(locale)}
            </Span>
          </Div>
        ) : null}
        {session.closingFloat !== null && session.closingFloat !== undefined ? (
          <Div className="flex items-center justify-between px-4 py-3">
            <Span className="text-sm text-muted-foreground">
              {t("sessionGet.get.response.closingFloat")}
            </Span>
            <Span className="text-sm font-mono tabular-nums">
              {new Intl.NumberFormat(locale, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(session.closingFloat)}
            </Span>
          </Div>
        ) : null}
      </Div>

      {/* Actions */}
      <Div className="flex flex-col gap-2">
        {isOpen ? (
          <>
            <Button
              type="button"
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => handleNewOrder(session.id)}
            >
              {t("sessionGet.get.widget.newOrder")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleViewOrders(session.id)}
            >
              {t("sessionGet.get.widget.viewOrders")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => handleCloseSession(session.id)}
            >
              {t("sessionGet.get.widget.closeSession")}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => handleViewOrders(session.id)}
          >
            {t("sessionGet.get.widget.viewOrders")}
          </Button>
        )}
      </Div>
    </Div>
  );
}
