/**
 * Ink Endpoint Page
 *
 * Thin wrapper around EndpointsPage for interactive terminal UI.
 * Uses the exact same widget rendering system as non-interactive CLI,
 * but with real Ink render() instead of fastRenderToString().
 */

import { Box, render, Text, useApp, useInput } from "ink";
import type { JSX } from "react";
import { useMemo, useRef } from "react";

import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { scopedTranslation as cliScopedTranslation } from "../../../cli/i18n";
import { Platform } from "../../../shared/types/platform";
import { QueryProvider } from "../../../react/hooks/query-provider";
import { LoggerProvider } from "@/hooks/use-logger";
import { EndpointsPage } from "../react/EndpointsPage";

/**
 * Ink Endpoint Page Props
 */
interface InkEndpointPageProps<
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
  /** Initial data from CLI args to prefill request fields */
  initialData?: WidgetData;
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
 * Wraps EndpointsPage with Ink chrome: header box, footer hints, quit handling.
 */
function InkEndpointPage<
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
  initialData,
}: InkEndpointPageProps<T>): JSX.Element {
  const { exit } = useApp();

  const activeEndpoint =
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Stable logger - useRef so it doesn't cause re-renders
  const loggerRef = useRef(createEndpointLogger(debug, Date.now(), locale));
  const logger = loggerRef.current;

  // Quit handler - Escape only (not "q" which would fire while typing in text fields)
  useInput(
    // eslint-disable-next-line no-unused-vars -- useInput requires (input, key) signature
    (_, key) => {
      if (key.escape) {
        exit();
      }
    },
  );

  // Example CLI command based on endpoint path
  const exampleCommand = useMemo(
    () => (activeEndpoint ? buildExampleCommand(activeEndpoint, {}) : ""),
    [activeEndpoint],
  );

  const { t: cliT } = cliScopedTranslation.scopedT(locale);

  if (!activeEndpoint) {
    return (
      <Box>
        <Text color="red">
          {cliScopedTranslation
            .scopedT(locale)
            .t("vibe.endpoints.renderers.cliUi.noEndpoint")}
        </Text>
      </Box>
    );
  }

  const { t } = activeEndpoint.scopedTranslation.scopedT(locale);
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

      {/* Endpoint fields - rendered by EndpointsPage */}
      <Box
        borderStyle="round"
        borderColor="green"
        paddingX={1}
        paddingY={1}
        marginTop={1}
        flexDirection="column"
      >
        <EndpointsPage
          endpoint={endpoint as never}
          locale={locale}
          user={user}
          logger={logger}
          platform={Platform.CLI}
          endpointOptions={
            initialData && activeEndpoint
              ? activeEndpoint.method === "GET"
                ? { read: { initialData: initialData as never } }
                : activeEndpoint.method === "DELETE"
                  ? {
                      delete: {
                        urlPathParams: initialData as never,
                        autoPrefillData: initialData as never,
                      },
                    }
                  : activeEndpoint.method === "PATCH"
                    ? { update: { autoPrefillData: initialData as never } }
                    : { create: { autoPrefillData: initialData as never } }
              : undefined
          }
        />
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>
          {cliT(
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
  const instance = render(
    <LoggerProvider locale={props.locale}>
      <QueryProvider>
        <InkEndpointPage {...props} />
      </QueryProvider>
    </LoggerProvider>,
  );
  await instance.waitUntilExit();
}
