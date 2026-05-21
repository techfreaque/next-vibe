import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  ApiKeysCreateRequestOutput,
  ApiKeysCreateResponseOutput,
  ApiKeysCreateUrlVariablesOutput,
  ApiKeysListResponseOutput,
  ApiKeysListUrlVariablesOutput,
} from "./definition";

interface ApiKeyApiItem {
  id: number;
  userId: number;
  organizationId: number;
  key: string;
}

export class ApiKeysRepository {
  private static buildPath(orgId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/apiKeys`;
  }

  static async list(
    urlPathParams: ApiKeysListUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ApiKeysListResponseOutput>> {
    const result = await CorvinaClient.request<ApiKeyApiItem[]>(
      { method: "GET", path: this.buildPath(urlPathParams.orgId) },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({ keys: result.data });
  }

  static async create(
    urlPathParams: ApiKeysCreateUrlVariablesOutput,
    data: ApiKeysCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ApiKeysCreateResponseOutput>> {
    const result = await CorvinaClient.request<ApiKeyApiItem>(
      {
        method: "POST",
        path: this.buildPath(urlPathParams.orgId),
        body: { username: data.username },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] API key created", { orgId: urlPathParams.orgId });
    return success(result.data);
  }
}
