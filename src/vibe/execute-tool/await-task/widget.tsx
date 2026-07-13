"use client";

import { getFullPath } from "next-vibe/core/core-utils/path";
import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { WidgetData } from "next-vibe/core/utils/json";
import { Div } from "next-vibe/ui/ui/div";
import { P } from "next-vibe/ui/ui/typography";
import {
  useWidgetDisabled,
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { EndpointsPage } from "next-vibe/unified-ui/renderers/react/EndpointsPage";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import type definition from "./definition";

function toRecord(
  value: WidgetData | undefined,
): Record<string, WidgetData> | null {
  if (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    return value;
  }
  return null;
}

export function AwaitTaskWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const t = useWidgetTranslation<typeof definition.POST>();
  const disabled = useWidgetDisabled();

  const responseData = useWidgetValue<typeof definition.POST>();

  const originalToolName = responseData?.originalToolName ?? null;
  const originalArgs = toRecord(responseData?.originalArgs);
  const resultData = toRecord(responseData?.result);

  const [resolvedEndpoint, setResolvedEndpoint] =
    useState<CreateApiEndpointAny | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    if (!originalToolName) {
      setResolvedEndpoint(null);
      setResolveError(null);
      return () => undefined;
    }

    let cancelled = false;

    const resolve = async (): Promise<void> => {
      const canonicalId = getFullPath(originalToolName) ?? originalToolName;
      const ep = await getEndpoint(canonicalId);
      if (cancelled) {
        return;
      }
      if (ep) {
        setResolvedEndpoint(ep);
        setResolveError(null);
      } else {
        setResolvedEndpoint(null);
        setResolveError(
          t("post.widget.unknownTool", {
            toolName: originalToolName,
          }),
        );
      }
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [originalToolName, t]);

  const mergedData = useMemo((): Record<string, WidgetData> => {
    if (originalArgs && resultData) {
      return { ...originalArgs, ...resultData };
    }
    if (resultData) {
      return resultData;
    }
    if (originalArgs) {
      return originalArgs;
    }
    return {};
  }, [originalArgs, resultData]);

  const resolvedMethod = resolvedEndpoint?.method ?? "POST";
  const displayOptions = useMemo(() => {
    if (resolvedMethod === "GET") {
      return { read: { initialData: mergedData as never } };
    }
    if (resolvedMethod === "DELETE") {
      return {
        delete: {
          urlPathParams: mergedData as never,
          autoPrefillData: mergedData as never,
        },
      };
    }
    if (resolvedMethod === "PATCH") {
      return { update: { autoPrefillData: mergedData as never } };
    }
    return { create: { autoPrefillData: mergedData as never } };
  }, [resolvedMethod, mergedData]);

  return (
    <Div className={disabled ? "flex flex-col gap-0" : "flex flex-col gap-2"}>
      {!originalToolName && (
        <P className="text-sm text-muted-foreground">
          {t("post.widget.noToolName")}
        </P>
      )}
      {resolveError && (
        <P className="text-sm text-destructive">{resolveError}</P>
      )}
      {originalToolName && !resolvedEndpoint && !resolveError && (
        <P className="text-sm text-muted-foreground">
          {t("post.widget.resolving")}
        </P>
      )}
      {resolvedEndpoint && (
        <EndpointsPage
          key={originalToolName}
          endpoint={{ [resolvedMethod]: resolvedEndpoint }}
          locale={locale}
          user={user}
          disabled={true}
          endpointOptions={displayOptions}
        />
      )}
    </Div>
  );
}

AwaitTaskWidget.displayName = "AwaitTaskWidget";

export default AwaitTaskWidget;
