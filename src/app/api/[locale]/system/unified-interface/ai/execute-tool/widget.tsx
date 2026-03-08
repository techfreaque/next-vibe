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

import type { AutocompleteOption } from "next-vibe-ui/ui/autocomplete-field";
import { AutocompleteField } from "next-vibe-ui/ui/autocomplete-field";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { FormField, FormItem, FormLabel } from "next-vibe-ui/ui/form/form";
import { P } from "next-vibe-ui/ui/typography";
import type { JSX } from "react";
import { useEffect, useMemo, useState } from "react";

import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import helpEndpoints from "@/app/api/[locale]/system/help/definition";
import type { UseEndpointOptions } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { useEndpoint } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-endpoint";
import { NavigationStackProvider } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-navigation-stack";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/widgets/widget-data";
import { EndpointRenderer } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointRenderer";
import { EndpointsPage } from "@/app/api/[locale]/system/unified-interface/unified-ui/renderers/react/EndpointsPage";
import {
  useWidgetDisabled,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnCancel,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetUser,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
  const logger = useWidgetLogger();
  const t = useWidgetTranslation<typeof definition.POST>();
  const disabled = useWidgetDisabled();
  const onSubmit = useWidgetOnSubmit();
  const onCancel = useWidgetOnCancel();

  // Get values from form (interactive mode) or field.value (read-only tool call display)
  const fieldValue =
    field.value &&
    typeof field.value === "object" &&
    !Array.isArray(field.value)
      ? (field.value as Record<string, WidgetData>)
      : null;
  const toolName =
    form?.watch("toolName") ??
    (typeof fieldValue?.toolName === "string" ? fieldValue.toolName : "");
  const resultData = fieldValue?.result;

  // Fetch available tools from help endpoint (role-based filtering)
  const helpState = useEndpoint(
    helpEndpoints,
    {
      read: {
        initialState: { pageSize: 500 },
        queryOptions: {
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
    },
    logger,
    user,
  );

  const toolOptions = useMemo((): AutocompleteOption<string>[] => {
    const response = helpState?.read?.response;
    if (!response || response.success !== true) {
      return [];
    }
    return response.data.tools.map((tool) => {
      const alias = tool.aliases?.[0];
      const label = alias ?? tool.name;
      return {
        value: tool.name,
        label,
        description: tool.description,
        category: tool.category,
      };
    });
  }, [helpState?.read?.response]);

  const formInputData = form?.watch("input") as
    | Record<string, WidgetData>
    | undefined;
  const inputData =
    formInputData ??
    (fieldValue?.input &&
    typeof fieldValue.input === "object" &&
    !Array.isArray(fieldValue.input)
      ? (fieldValue.input as Record<string, WidgetData>)
      : undefined);

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
    if (!method) {
      return undefined;
    }

    // GET/DELETE: pass as urlPathParams (the hook handles splitting)
    if (method === "GET") {
      return {
        read: {
          ...(hasInput ? { urlPathParams: inputData as never } : {}),
          // Never auto-fetch inside execute-tool — user triggers fetch explicitly
          queryOptions: { enabled: false },
        },
      };
    }

    if (!hasInput) {
      return undefined;
    }

    // disabled mutations are no-ops — only GET needs the enabled flag

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

  return (
    <Div
      className={disabled ? "flex flex-col gap-0" : "flex flex-col gap-4 p-4"}
    >
      {form && !disabled && (
        <FormField
          control={form.control}
          name="toolName"
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {t("executeTool.post.fields.toolName.label")}
              </FormLabel>
              <AutocompleteField
                value={formField.value}
                onChange={(val) => {
                  formField.onChange(val);
                }}
                onBlur={formField.onBlur}
                options={toolOptions}
                placeholder={t("executeTool.post.fields.toolName.placeholder")}
                searchPlaceholder={t(
                  "executeTool.post.fields.toolName.description",
                )}
                allowCustom={true}
              />
            </FormItem>
          )}
        />
      )}

      {!disabled && !toolName && (
        <P className="text-sm text-muted-foreground">
          {t("executeTool.post.widget.enterToolName")}
        </P>
      )}

      {!disabled && resolveError && (
        <P className="text-sm text-destructive">{resolveError}</P>
      )}

      {!disabled && toolName && !resolvedEndpoint && !resolveError && (
        <P className="text-sm text-muted-foreground">
          {t("executeTool.post.widget.resolving")}
        </P>
      )}

      {resolvedEndpoint && method && !resultData && (
        <EndpointsPage
          endpoint={{ [method]: resolvedEndpoint }}
          locale={locale}
          user={user}
          endpointOptions={endpointOptions}
        />
      )}

      {/* Response mode: render the target endpoint with merged input+result data (read-only) */}
      {resolvedEndpoint && resultData && (
        <NavigationStackProvider>
          <EndpointRenderer
            endpoint={resolvedEndpoint}
            locale={locale}
            user={user}
            logger={logger}
            data={
              (inputData &&
              resultData &&
              typeof resultData === "object" &&
              !Array.isArray(resultData)
                ? {
                    ...inputData,
                    ...(resultData as Record<string, WidgetData>),
                  }
                : resultData) as WidgetData
            }
            disabled={disabled}
          />
        </NavigationStackProvider>
      )}

      {/* Confirmation mode: render Confirm / Cancel buttons when onSubmit/onCancel are provided */}
      {(onSubmit ?? onCancel) && (
        <Div className="flex gap-2 pt-2">
          {onSubmit && form && (
            <Button
              type="button"
              variant="ghost"
              onClick={(): void => {
                form.handleSubmit(onSubmit)();
              }}
            >
              {t("executeTool.post.actions.confirm")}
            </Button>
          )}
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t("executeTool.post.actions.cancel")}
            </Button>
          )}
        </Div>
      )}
    </Div>
  );
}
