/**
 * Batch Operations Repository
 * Handles batch operations for lead management
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "../../user/auth/types";
import { leadsRepository } from "../repository";
import type {
  BatchDeleteRequestOutput,
  BatchDeleteResponseData,
  BatchUpdateRequestOutput,
  BatchUpdateResponseData,
} from "./definition";

/**
 * Batch Operations Repository Interface
 */
export interface BatchRepository {
  batchUpdateLeads(
    data: BatchUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchUpdateResponseData>>;

  batchDeleteLeads(
    data: BatchDeleteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchDeleteResponseData>>;
}

/**
 * Batch Operations Repository Implementation
 */
class BatchRepositoryImpl implements BatchRepository {
  /**
   * Batch update leads - delegates to main leads repository
   */
  async batchUpdateLeads(
    data: BatchUpdateRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchUpdateResponseData>> {
    logger.debug("Batch update leads operation", {
      userId: user.id,
      dataKeys: Object.keys(data),
    });

    // Delegate to main leads repository
    return await leadsRepository.batchUpdateLeads(data, user, locale, logger);
  }

  /**
   * Batch delete leads - delegates to main leads repository
   */
  async batchDeleteLeads(
    data: BatchDeleteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<BatchDeleteResponseData>> {
    logger.debug("Batch delete leads operation", {
      userId: user.id,
      dataKeys: Object.keys(data),
    });

    // Delegate to main leads repository
    return await leadsRepository.batchDeleteLeads(data, user, locale, logger);
  }
}

/**
 * Default repository instance
 */
export const batchRepository = new BatchRepositoryImpl();
