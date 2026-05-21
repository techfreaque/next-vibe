import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CorvinaAppsInstalledRequestOutput,
  CorvinaAppsInstalledResponseOutput,
} from "./definition";

interface CorvinaInstalledApp {
  id: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  manifestFrom?: string;
  planId?: string;
  autoRenewActive?: boolean;
  freeTrial?: boolean;
  serviceAccountUsername?: string;
  app?: {
    key?: string;
    name?: { value?: string };
  };
}

interface CorvinaInstalledAppsPageResponse {
  content: CorvinaInstalledApp[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class CorvinaAppsInstalledRepository {
  static async list(
    data: CorvinaAppsInstalledRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaAppsInstalledResponseOutput>> {
    const path = `/api/v1/organizations/${data.organizationId}/apps`;
    const result =
      await CorvinaClient.request<CorvinaInstalledAppsPageResponse>(
        {
          method: "GET",
          path,
          query: { page: 0, pageSize: 50 },
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    return success({
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
      installs: result.data.content.map((item) => ({
        id: item.id,
        status:
          item.status as CorvinaAppsInstalledResponseOutput["installs"][number]["status"],
        appKey: item.app?.key ?? null,
        appName: item.app?.name?.value ?? null,
        manifestFrom: item.manifestFrom ?? null,
        planId: item.planId ?? null,
        autoRenewActive: item.autoRenewActive ?? false,
        freeTrial: item.freeTrial ?? false,
        serviceAccountUsername: item.serviceAccountUsername ?? null,
        createdAt: item.createdAt ?? null,
        updatedAt: item.updatedAt ?? null,
      })),
    });
  }
}
