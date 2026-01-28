/**
 * Ink Endpoint Page
 *
 * Terminal UI wrapper for endpoint rendering
 * Mirrors React End points Page but for Ink (terminal UI)
 */

import { Box, render, Text } from "ink";
import type { JSX } from "react";
import { useCallback, useState } from "react";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

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
  /** Submit handler */
  onSubmit?: (data: WidgetData) => Promise<ResponseType<WidgetData>>;
  /** Initial data to prefill */
  initialData?: WidgetData;
}

/**
 * Ink Endpoint Page Component
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
  // State management - must be before early return
  const [response, setResponse] = useState<
    ResponseType<WidgetData> | undefined
  >(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine active endpoint
  const activeEndpoint =
    endpoint.GET ??
    endpoint.POST ??
    endpoint.PUT ??
    endpoint.PATCH ??
    endpoint.DELETE;

  // Logger
  const logger = createEndpointLogger(debug, Date.now(), locale);

  // Handle form submission - must be before early return
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

  if (!activeEndpoint) {
    return (
      <Box>
        <Text color="red">
          {simpleT(locale).t("app.common.errors.noEndpoint")}
        </Text>
      </Box>
    );
  }

  const { t } = activeEndpoint.scopedTranslation.scopedT(locale);

  const responseData = response?.success === true ? response.data : initialData;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* Request - always visible */}
      <Box
        borderStyle="round"
        borderColor="blue"
        paddingX={1}
        paddingY={1}
        flexDirection="column"
      >
        <Text bold color="blue">
          {t("app.api.system.unifiedInterface.cli.request")}
        </Text>
        <InkEndpointRenderer
          endpoint={activeEndpoint}
          locale={locale}
          data={responseData}
          isSubmitting={isSubmitting}
          logger={logger}
          user={user}
          onSubmit={(): void => {
            void handleSubmit(responseData ?? {});
          }}
          response={undefined}
        />
      </Box>

      {/* Response - shown after submit */}
      {response && (
        <Box
          marginTop={1}
          borderStyle="round"
          borderColor={response.success ? "green" : "red"}
          paddingX={1}
          paddingY={1}
          flexDirection="column"
        >
          <Text bold color={response.success ? "green" : "red"}>
            {response.success
              ? t("app.api.system.unifiedInterface.cli.response.success")
              : t("app.api.system.unifiedInterface.cli.response.error")}
          </Text>
          {response.success && (
            <InkEndpointRenderer
              endpoint={activeEndpoint}
              locale={locale}
              data={response.data}
              isSubmitting={false}
              logger={logger}
              user={user}
              response={response}
            />
          )}
          {!response.success && (
            <Text color="red">
              {t(response.message, response.messageParams)}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

/**
 * Render Ink Endpoint Page to terminal
 */
export function renderInkEndpointPage<
  T extends {
    GET?: CreateApiEndpointAny;
    POST?: CreateApiEndpointAny;
    PUT?: CreateApiEndpointAny;
    PATCH?: CreateApiEndpointAny;
    DELETE?: CreateApiEndpointAny;
  },
>(props: InkEndpointPageProps<T>): void {
  render(<InkEndpointPage {...props} />);
}
