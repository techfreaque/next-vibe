import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint-base";
import { Platform } from "../../shared/types/platform";

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
    /* webpackIgnore: true */ "@/app/api/[locale]/system/unified-interface/execute-tool/repository"
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
