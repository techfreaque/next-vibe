/**
 * Ink Endpoint Page
 *
 * Thin wrapper around InkEndpointRenderer for interactive terminal UI.
 * Uses the exact same widget rendering system as non-interactive CLI,
 * but with real Ink render() instead of fastRenderToString().
 */

import { Box, render, Text, useApp, useInput } from "ink";
import type { JSX } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { scopedTranslation as cliScopedTranslation } from "../../../cli/i18n";
import { Platform } from "../../../shared/types/platform";
import type { WidgetData } from "../../../shared/widgets/widget-data";
import { InkEndpointRenderer } from "./CliEndpointRenderer";

/**
 * Ink Endpoint Page Props
 */
export interface InkEndpointPageProps<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
> {
  /** Endpoint definitions */
  endpoint: T;
  /** Locale for translations */
  locale: CountryLanguage;
  /** User object */
  user: JwtPayloadType;
  /** Enable debug logging */
  debug?: boolean;
  /** Submit handler — executes the endpoint */
  onSubmit?: (data: WidgetData) => Promise<ResponseType<WidgetData>>;
  /** Initial data from CLI args to prefill request fields */
  initialData?: WidgetData;
}

/**
 * Check if a GET endpoint has auto-fetch enabled (default: true).
 * Endpoints like search set options.queryOptions.enabled = false to wait for user input.
 */
function isAutoFetchEnabled(endpoint: CreateApiEndpointAny): boolean {
  if (
    "options" in endpoint &&
    endpoint.options &&
    typeof endpoint.options === "object" &&
    "queryOptions" in endpoint.options &&
    endpoint.options.queryOptions &&
    typeof endpoint.options.queryOptions === "object" &&
    "enabled" in endpoint.options.queryOptions &&
    endpoint.options.queryOptions.enabled === false
  ) {
    return false;
  }
  return true;
}

/**
 * Build an example CLI command string from endpoint and current form values.
 * Shows `vibe <command> --key value` for each non-empty form field.
 */
function buildExampleCommand(
  endpoint: CreateApiEndpointAny,
  formValues: Record<string, WidgetData>,
): string {
  // Use first alias if available, otherwise join path with spaces
  const command =
    endpoint.aliases && endpoint.aliases.length > 0
      ? endpoint.aliases[0]
      : endpoint.path.join(" ");

  const firstArgKey =
    endpoint.cli && "firstCliArgKey" in endpoint.cli
      ? endpoint.cli.firstCliArgKey
      : undefined;

  const parts: string[] = [`vibe ${command}`];

  for (const [key, value] of Object.entries(formValues)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    const strValue = String(value);

    // First positional arg doesn't need a flag
    if (key === firstArgKey) {
      parts.push(strValue.includes(" ") ? `"${strValue}"` : strValue);
      continue;
    }

    // Convert camelCase to kebab-case for CLI flags
    const kebabKey = key.replace(
      /[A-Z]/g,
      (match) => `-${match.toLowerCase()}`,
    );

    if (typeof value === "boolean") {
      if (value) {
        parts.push(`--${kebabKey}`);
      }
    } else {
      parts.push(
        `--${kebabKey} ${strValue.includes(" ") ? `"${strValue}"` : strValue}`,
      );
    }
  }

  return parts.join(" ");
}

/**
 * Ink Endpoint Page Component
 *
 * Uses InkEndpointRenderer (same widget system as non-interactive CLI).
 * Only adds: endpoint header, submit execution, quit handling, auto-fetch.
 */
export function InkEndpointPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>({
  endpoint,
  locale,
  user,
  debug = false,
  onSubmit,
  initialData,
}: InkEndpointPageProps<T>): JSX.Element {
  const { exit } = useApp();

  const [response, setResponse] = useState<
    ResponseType<WidgetData> | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, WidgetData>>({});

  const activeEndpoint =
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Stable logger — useRef so it doesn't cause re-renders
  const loggerRef = useRef(createEndpointLogger(debug, Date.now(), locale));
  const logger = loggerRef.current;

  const handleSubmit = useCallback(
    async (data: WidgetData): Promise<void> => {
      if (!onSubmit) {
        return;
      }
      setIsSubmitting(true);
      try {
        const result = await onSubmit(data);
        setResponse(result);
      } catch (error) {
        logger.error("Submit failed", parseError(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, logger],
  );

  // Auto-fetch: GET endpoints auto-submit unless queryOptions.enabled === false
  const shouldAutoFetch = !!endpoint.GET && isAutoFetchEnabled(endpoint.GET);
  const hasAutoFetched = useRef(false);
  useEffect(() => {
    if (shouldAutoFetch && !hasAutoFetched.current && onSubmit && !response) {
      hasAutoFetched.current = true;
      void handleSubmit(initialData ?? {});
    }
  }, [shouldAutoFetch, onSubmit, response, handleSubmit, initialData]);

  // Quit handler — Escape only (not "q" which would fire while typing in text fields)
  useInput(
    // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
    (_, key) => {
      if (key.escape) {
        exit();
      }
    },
    { isActive: !isSubmitting },
  );

  // Example CLI command based on current form input — must be before early return
  const exampleCommand = useMemo(
    () =>
      activeEndpoint ? buildExampleCommand(activeEndpoint, formValues) : "",
    [activeEndpoint, formValues],
  );

  if (!activeEndpoint) {
    return (
      <Box>
        <Text color="red">
          {simpleT(locale).t("app.common.errors.noEndpoint")}
        </Text>
      </Box>
    );
  }

  // Response data for widgets — mirrors React EndpointsPage pattern
  const responseData = response?.success === true ? response.data : initialData;

  // Full-takeover CLI widget: skip header/border, render directly
  const rootRender = (
    activeEndpoint.fields as { render?: { cliWidget?: boolean } }
  ).render;
  if (rootRender?.cliWidget === true) {
    return (
      <InkEndpointRenderer
        endpoint={activeEndpoint}
        locale={locale}
        data={responseData}
        isSubmitting={isSubmitting}
        logger={logger}
        user={user}
        platform={Platform.CLI}
        response={response}
        onFormChange={setFormValues}
        onSubmit={(data): void => {
          void handleSubmit(data as WidgetData);
        }}
      />
    );
  }

  const { t } = activeEndpoint.scopedTranslation.scopedT(locale);
  const { t: cliT } = cliScopedTranslation.scopedT(locale);

  // Endpoint info
  const title = t(activeEndpoint.title);
  const description = t(activeEndpoint.description);
  const method = activeEndpoint.method;

  return (
    <Box flexDirection="column" paddingX={1} paddingY={1}>
      {/* Endpoint header */}
      <Box
        borderStyle="round"
        borderColor="blue"
        paddingX={1}
        flexDirection="column"
      >
        <Box>
          <Text bold color="cyan">
            {method}{" "}
          </Text>
          <Text bold>{title}</Text>
        </Box>
        <Text dimColor>{description}</Text>
        <Box marginTop={1}>
          <Text dimColor>
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.dollarPrompt",
            )}
          </Text>
          <Text color="yellow">{exampleCommand}</Text>
        </Box>
      </Box>

      {/* Endpoint fields — rendered by the widget system */}
      <Box
        borderStyle="round"
        borderColor={response?.success === false ? "red" : "green"}
        paddingX={1}
        paddingY={1}
        marginTop={1}
        flexDirection="column"
      >
        <InkEndpointRenderer
          endpoint={activeEndpoint}
          locale={locale}
          data={responseData}
          isSubmitting={isSubmitting}
          logger={logger}
          user={user}
          platform={Platform.CLI}
          response={response}
          onFormChange={setFormValues}
          onSubmit={(data): void => {
            void handleSubmit(data as WidgetData);
          }}
        />
      </Box>

      {/* Submitting indicator */}
      {isSubmitting && (
        <Box marginTop={1}>
          <Text color="yellow">
            {cliT(
              "vibe.endpoints.renderers.cliUi.widgets.common.hints.executing",
            )}
          </Text>
        </Box>
      )}

      {/* Error display */}
      {response && !response.success && (
        <Box marginTop={1}>
          <Text color="red">{t(response.message, response.messageParams)}</Text>
        </Box>
      )}

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>
          {response
            ? `${cliT("response.success")} | enter: re-submit | esc: exit`
            : cliT(
                "vibe.endpoints.renderers.cliUi.widgets.common.hints.tabNextField",
              )}
        </Text>
      </Box>
    </Box>
  );
}

/**
 * Render interactive endpoint page with real Ink.
 * Same widget rendering system as non-interactive CLI, but with live terminal UI.
 */
export async function renderInkEndpointPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>(props: InkEndpointPageProps<T>): Promise<void> {
  const instance = render(<InkEndpointPage {...props} />);
  await instance.waitUntilExit();
}
