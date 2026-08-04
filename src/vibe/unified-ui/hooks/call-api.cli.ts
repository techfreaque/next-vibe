import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { Platform } from "../../platforms/platforms";

export async function callApi<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  requestData: TEndpoint["types"]["RequestOutput"],
  pathParams: TEndpoint["types"]["UrlVariablesOutput"],
): Promise<ResponseType<TEndpoint["types"]["ResponseOutput"]>> {
  logger.debug("callApi [cli]", {
    endpoint: endpoint.path.join("/"),
    method: endpoint.method,
    pathParams,
  });

  const { runEndpointByName } = await import(
    /* webpackIgnore: true */ "next-vibe/execute-tool/repository/run-endpoint-by-name"
  );
  const rawToolName =
    endpoint.aliases?.[0] ?? `${endpoint.path.join("_")}_${endpoint.method}`;
  const toolName = rawToolName.replaceAll(/\[([^\]]+)\]/g, "$1");

  const { makeHeadlessContext } =
    await import("next-vibe/core/execution-context");
  const result = await runEndpointByName({
    toolName,
    input: {
      ...(requestData as Record<string, WidgetData>),
      ...(pathParams as Record<string, WidgetData>),
    },
    user,
    locale,
    logger,
    platform: Platform.CLI,
    toolExecutionContext: makeHeadlessContext(undefined, undefined, "UTC"),
  });
  return result as ResponseType<TEndpoint["types"]["ResponseOutput"]>;
}
