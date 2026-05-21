import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ResourcesListResponseOutput } from "./definition";

const CORVINA_RESOURCES_PATH = "/api/v1/resources";

interface CorvinaResource {
  id: number;
  type: string;
  maxActive: number;
  consumable: boolean;
  notConsumable: boolean;
}

export class ResourcesListRepository {
  static async list(
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<ResourcesListResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaResource[]>(
      {
        method: "GET",
        path: CORVINA_RESOURCES_PATH,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      items: result.data.map((r) => ({
        id: r.id,
        type: r.type,
        maxActive: r.maxActive,
        consumable: r.consumable,
      })),
    });
  }
}
