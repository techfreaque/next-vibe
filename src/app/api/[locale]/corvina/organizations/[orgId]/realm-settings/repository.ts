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
  RealmSettingsGetResponseOutput,
  RealmSettingsGetUrlVariablesOutput,
  RealmSettingsPutRequestOutput,
  RealmSettingsPutResponseOutput,
  RealmSettingsPutUrlVariablesOutput,
} from "./definition";

interface RealmSettingsApiData {
  configDealerMaxDepth: number;
  configHostnameMaxDepth: number;
  configOwnResourcesMaxDepth: number;
  configIotMaxDepth: number;
  configVpnMaxDepth: number;
  configStoreMaxDepth: number;
  configIpFilteringMaxDepth: number;
  configPrivateAccessMaxDepth: number;
}

export class RealmSettingsRepository {
  private static buildPath(orgId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/realm/settings`;
  }

  static async get(
    urlPathParams: RealmSettingsGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RealmSettingsGetResponseOutput>> {
    const result = await CorvinaClient.request<RealmSettingsApiData>(
      { method: "GET", path: this.buildPath(urlPathParams.orgId) },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success(result.data);
  }

  static async update(
    urlPathParams: RealmSettingsPutUrlVariablesOutput,
    data: RealmSettingsPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<RealmSettingsPutResponseOutput>> {
    const result = await CorvinaClient.request<RealmSettingsApiData>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.orgId),
        body: {
          configDealerMaxDepth: data.configDealerMaxDepth,
          configHostnameMaxDepth: data.configHostnameMaxDepth,
          configOwnResourcesMaxDepth: data.configOwnResourcesMaxDepth,
          configIotMaxDepth: data.configIotMaxDepth,
          configVpnMaxDepth: data.configVpnMaxDepth,
          configStoreMaxDepth: data.configStoreMaxDepth,
          configIpFilteringMaxDepth: data.configIpFilteringMaxDepth,
          configPrivateAccessMaxDepth: data.configPrivateAccessMaxDepth,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Realm settings updated", {
      orgId: urlPathParams.orgId,
    });
    return success(result.data);
  }
}
