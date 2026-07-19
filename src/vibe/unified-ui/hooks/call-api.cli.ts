import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

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

  const { RouteExecuteRepository } = await import(
    /* webpackIgnore: true */ "next-vibe/execute-tool/repository"
  );

  return RouteExecuteRepository.runInProcessTyped({
    definition: endpoint,
    input: requestData,
    urlPathParams: pathParams,
    user,
    locale,
    logger,
    platform: Platform.CLI,
  });
}
