import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  LimitsCreateRequestOutput,
  LimitsCreateResponseOutput,
  LimitsListRequestOutput,
  LimitsListResponseOutput,
  LimitsUpdateRequestOutput,
  LimitsUpdateResponseOutput,
} from "./definition";

const CORVINA_LIMITS_PATH = "/api/v1/limits";

interface CorvinaLimitItem {
  resourceType: string;
  quantity: number;
  used: number;
  targetOrganization: string | null;
  grantingOrganization: string | null;
  orgResourceId: string | null;
}

interface CorvinaLimitsPageResponse {
  content: CorvinaLimitItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

function mapLimit(item: CorvinaLimitItem): CorvinaLimitItem {
  return {
    resourceType: item.resourceType,
    quantity: item.quantity,
    used: item.used,
    targetOrganization: item.targetOrganization,
    grantingOrganization: item.grantingOrganization,
    orgResourceId: item.orgResourceId,
  };
}

export class LimitsRepository {
  static async list(
    data: LimitsListRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LimitsListResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.status !== undefined && data.status !== "") {
      query.status = data.status;
    }
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaLimitsPageResponse>(
      {
        method: "GET",
        path: CORVINA_LIMITS_PATH,
        query,
        service: "license",
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
      limits: result.data.content.map(mapLimit),
    });
  }

  static async create(
    data: LimitsCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LimitsCreateResponseOutput>> {
    const body: Record<string, string | number | undefined> = {};
    if (data.resourceType !== undefined && data.resourceType !== "") {
      body.resourceType = data.resourceType;
    }
    if (data.quantity !== undefined) {
      body.quantity = data.quantity;
    }

    const query: Record<string, string | undefined> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaLimitItem>(
      {
        method: "POST",
        path: CORVINA_LIMITS_PATH,
        body,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Resource limit created", {
      resourceType: result.data.resourceType,
      orgResourceId: result.data.orgResourceId,
    });
    return success(mapLimit(result.data));
  }

  static async update(
    data: LimitsUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<LimitsUpdateResponseOutput>> {
    const body: Record<string, string | number | undefined> = {};
    if (data.resourceType !== undefined && data.resourceType !== "") {
      body.resourceType = data.resourceType;
    }
    if (data.quantity !== undefined) {
      body.quantity = data.quantity;
    }

    const query: Record<string, string | undefined> = {};
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }

    const result = await CorvinaClient.request<CorvinaLimitItem>(
      {
        method: "PUT",
        path: CORVINA_LIMITS_PATH,
        body,
        query,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Resource limit updated", {
      resourceType: result.data.resourceType,
      orgResourceId: result.data.orgResourceId,
    });
    return success(mapLimit(result.data));
  }
}
