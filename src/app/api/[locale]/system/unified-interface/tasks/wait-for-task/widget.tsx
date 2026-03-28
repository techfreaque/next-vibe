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
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import {
  useWidgetDisabled,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import type definition from "./definition";
import type { WaitForTaskResponseOutput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: WaitForTaskResponseOutput | null | undefined;
  } & (typeof definition.POST)["fields"];
}

export function WaitForTaskWidget({ field }: CustomWidgetProps): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof definition.POST>();
  const disabled = useWidgetDisabled();

  const fieldValue =
    field.value &&
    typeof field.value === "object" &&
    !Array.isArray(field.value)
      ? (field.value as Record<string, WidgetData>)
      : null;

  const originalToolName =
    typeof fieldValue?.originalToolName === "string"
      ? fieldValue.originalToolName
      : null;

  const originalArgs =
    fieldValue?.originalArgs &&
    typeof fieldValue.originalArgs === "object" &&
    !Array.isArray(fieldValue.originalArgs)
      ? (fieldValue.originalArgs as Record<string, WidgetData>)
      : null;

  const resultData =
    fieldValue?.result &&
    typeof fieldValue.result === "object" &&
    !Array.isArray(fieldValue.result)
      ? (fieldValue.result as Record<string, WidgetData>)
      : null;

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
  const mergedData = useMemo((): WidgetData => {
    if (originalArgs && resultData) {
      return { ...originalArgs, ...resultData } as WidgetData;
    }
    if (resultData) {
      return resultData as WidgetData;
    }
    if (originalArgs) {
      return originalArgs as WidgetData;
    }
    return {} as WidgetData;
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

  return (
    <Div className={disabled ? "flex flex-col gap-0" : "flex flex-col gap-2"}>
      <NavigationStackProvider>
        <EndpointRenderer
          endpoint={resolvedEndpoint}
          locale={locale}
          user={user}
          logger={logger}
          data={mergedData}
          disabled={true}
        />
      </NavigationStackProvider>
    </Div>
  );
}

WaitForTaskWidget.displayName = "WaitForTaskWidget";

export default WaitForTaskWidget;
