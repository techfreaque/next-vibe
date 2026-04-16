/**
 * WaitForTask Widget
 *
 * Renders the target endpoint (originalToolName) with its args and result,
 * exactly like ExecuteToolWidget - but reads from wait-for-task's response fields
 * (originalToolName, originalArgs, result) instead of execute-tool's input/result.
 *
 * The ToolCallRenderer shows distinct "Waiting" / "Complete (wait-for)" badges
 * so the user knows this came via wait-for-task, not a direct execute-tool call.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import {
  useWidgetDisabled,
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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

export function WaitForTaskWidget(): JSX.Element {
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
          t("waitForTask.post.widget.unknownTool", {
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

  // Merged data for EndpointRenderer: originalArgs + result (same as execute-tool)
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

  if (!originalToolName) {
    return (
      <Div className="flex flex-col gap-0">
        <P className="text-sm text-muted-foreground">
          {t("waitForTask.post.widget.noToolName")}
        </P>
      </Div>
    );
  }

  if (resolveError) {
    return (
      <Div className="flex flex-col gap-0">
        <P className="text-sm text-destructive">{resolveError}</P>
      </Div>
    );
  }

  if (!resolvedEndpoint) {
    return (
      <Div className="flex flex-col gap-0">
        <P className="text-sm text-muted-foreground">
          {t("waitForTask.post.widget.resolving")}
        </P>
      </Div>
    );
  }

  const resolvedMethod = resolvedEndpoint.method;
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
    // POST or PUT
    return { create: { autoPrefillData: mergedData as never } };
  }, [resolvedMethod, mergedData]);

  return (
    <Div className={disabled ? "flex flex-col gap-0" : "flex flex-col gap-2"}>
      <EndpointsPage
        endpoint={{ [resolvedMethod]: resolvedEndpoint }}
        locale={locale}
        user={user}
        disabled={true}
        endpointOptions={displayOptions}
      />
    </Div>
  );
}

WaitForTaskWidget.displayName = "WaitForTaskWidget";

export default WaitForTaskWidget;
