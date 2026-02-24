/**
 * ExecuteTool Widget
 *
 * Renders any registered endpoint by toolName via EndpointsPage.
 * Uses getEndpoint() from generated/endpoint.ts to resolve the endpoint
 * definition by ID, then renders it with the full form/response UI.
 *
 * Watches the parent form's `input` JSON field and passes it as
 * autoPrefillData (mutations) or urlPathParams (GET/DELETE) so the
 * embedded endpoint form is pre-filled with the caller's data.
 */

"use client";

import { Div } from "next-vibe-ui/ui/div";
import { Pre } from "next-vibe-ui/ui/pre";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  getEndpoint,
  getFullPath,
} from "@/app/api/[locale]/system/generated/endpoint";
import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
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

interface EndpointMethods {
  GET?: CreateApiEndpointAny;
  POST?: CreateApiEndpointAny;
  PUT?: CreateApiEndpointAny;
  PATCH?: CreateApiEndpointAny;
  DELETE?: CreateApiEndpointAny;
}

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
  const t = useWidgetTranslation<typeof definition.POST>();

  const children = field.children;
  const toolName = form?.watch("toolName") ?? "";
  const inputData = form?.watch("input") as
    | Record<string, WidgetData>
    | undefined;

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
        setResolveError(t("executeTool.post.widget.unknownTool", { toolName }));
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

  // Build endpointOptions to pre-fill the target endpoint's form
  // with data from the parent `input` JSON field
  const hasInput =
    inputData !== undefined &&
    inputData !== null &&
    Object.keys(inputData).length > 0;

  const endpointOptions = useMemo(():
    | UseEndpointOptions<EndpointMethods>
    | undefined => {
    if (!hasInput || !method) {
      return undefined;
    }

    // GET/DELETE: pass as urlPathParams (the hook handles splitting)
    if (method === "GET") {
      return {
        read: {
          urlPathParams: inputData as never,
        },
      };
    }

    if (method === "DELETE") {
      return {
        delete: {
          urlPathParams: inputData as never,
          autoPrefillData: inputData as never,
        },
      };
    }

    // POST/PUT/PATCH: pass as autoPrefillData
    if (method === "POST") {
      return {
        create: {
          autoPrefillData: inputData as never,
        },
      };
    }

    if (method === "PATCH") {
      return {
        update: {
          autoPrefillData: inputData as never,
        },
      };
    }

    if (method === "PUT") {
      return {
        create: {
          autoPrefillData: inputData as never,
        },
      };
    }

    return undefined;
  }, [hasInput, method, inputData]);

  // Response data from the parent execute-tool endpoint
  const responseResult = field.value?.result;

  return (
    <Div className="flex flex-col gap-4 p-4">
      <TextFieldWidget fieldName="toolName" field={children.toolName} />

      {!toolName && (
        <P className="text-sm text-muted-foreground">
          {t("executeTool.post.widget.enterToolName")}
        </P>
      )}

      {resolveError && (
        <P className="text-sm text-destructive">{resolveError}</P>
      )}

      {toolName && !resolvedEndpoint && !resolveError && (
        <P className="text-sm text-muted-foreground">
          {t("executeTool.post.widget.resolving")}
        </P>
      )}

      {resolvedEndpoint && method && (
        <EndpointsPage
          endpoint={{ [method]: resolvedEndpoint }}
          locale={locale}
          user={user}
          endpointOptions={endpointOptions}
        />
      )}

      {responseResult !== undefined && responseResult !== null && (
        <Div className="flex flex-col gap-2">
          <P className="text-sm font-medium">
            {t("executeTool.post.response.resultLabel")}
          </P>
          <Pre className="overflow-auto rounded-md bg-muted p-4 text-xs">
            {typeof responseResult === "string"
              ? responseResult
              : JSON.stringify(responseResult, null, 2)}
          </Pre>
        </Div>
      )}
    </Div>
  );
}
