import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import { CorvinaAppStoreStatus } from "@/app/api/[locale]/corvina/apps/enums";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CorvinaAppsListResponseOutput } from "./definition";

interface CorvinaAppItem {
  id: number;
  key: string;
  name?: { value?: string };
  description?: { value?: string };
  status?: string;
  coverImageUrl?: string;
  iconUrl?: string;
  version?: string;
}

interface CorvinaAppsPageResponse {
  content: CorvinaAppItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class CorvinaAppsListRepository {
  static async list(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaAppsListResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaAppsPageResponse>(
      {
        method: "GET",
        path: "/api/v1/apps",
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
      apps: result.data.content.map((app) => ({
        id: app.id,
        key: app.key,
        name: app.name?.value ?? app.key,
        description: app.description?.value ?? null,
        status:
          app.status === "UNDER_EVALUATION"
            ? CorvinaAppStoreStatus.UNDER_EVALUATION
            : CorvinaAppStoreStatus.ACTIVE,
        coverImageUrl: app.coverImageUrl ?? null,
        iconUrl: app.iconUrl ?? null,
        version: app.version ?? null,
      })),
    });
  }
}
