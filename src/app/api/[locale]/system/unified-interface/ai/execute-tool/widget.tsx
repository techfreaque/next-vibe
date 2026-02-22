/**
 * ExecuteTool Widget
 *
 * Renders any registered endpoint by toolName via EndpointsPage.
 * Uses getEndpoint() from generated/endpoint.ts to resolve the endpoint
 * definition by ID, then renders it with the full form/response UI.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useState } from "react";

import {
  getEndpoint,
  getFullPath,
} from "@/app/api/[locale]/system/generated/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";

import type definition from "./definition";
import type { RouteExecuteResponseInput } from "./definition";

interface CustomWidgetProps {
  field: {
    value: RouteExecuteResponseInput | null | undefined;
  } & (typeof definition.POST)["fields"];
  fieldName: string;
}

export function ExecuteToolWidget({ field }: CustomWidgetProps): JSX.Element {
  const form = useWidgetForm<typeof definition.POST>();
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const t = useWidgetTranslation();

  const children = field.children;
  const toolName = form?.watch("toolName") ?? "";

  const [resolvedEndpoint, setResolvedEndpoint] =
    useState<CreateApiEndpointAny | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    if (!toolName) {
      setResolvedEndpoint(null);
      setResolveError(null);
      return () => undefined;
    }

    let cancelled = false;

    const resolve = async (): Promise<void> => {
      const canonicalId = getFullPath(toolName) ?? toolName;
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
          t(
            "app.api.system.unifiedInterface.ai.executeTool.post.widget.unknownTool",
            { toolName },
          ),
        );
      }
    };

    void resolve();

    return () => {
      cancelled = true;
    };
  }, [toolName, t]);

  const method = resolvedEndpoint?.method as
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | undefined;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <TextFieldWidget fieldName="toolName" field={children.toolName} />

      {!toolName && (
        <P className="text-sm text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.ai.executeTool.post.widget.enterToolName",
          )}
        </P>
      )}

      {resolveError && (
        <P className="text-sm text-destructive">{resolveError}</P>
      )}

      {toolName && !resolvedEndpoint && !resolveError && (
        <P className="text-sm text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.ai.executeTool.post.widget.resolving",
          )}
        </P>
      )}

      {resolvedEndpoint && method && (
        <EndpointsPage
          endpoint={{ [method]: resolvedEndpoint }}
          locale={locale}
          user={user}
        />
      )}
    </Div>
  );
}
