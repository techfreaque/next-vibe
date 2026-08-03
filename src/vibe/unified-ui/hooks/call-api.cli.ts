import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
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
