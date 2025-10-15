/**
 * Import System Types
 * Generic types for CSV import operations that can be used by any domain
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import type { DbId } from "@/app/api/[locale]/v1/core/system/db/types";

import type {
  CsvImportConfig,
  DomainImportRepository,
  ImportJobsListResponseType,
  LeadsImportResponseType,
} from "../leads/import/definition";

/**
 * Domain-specific Record Interface
 * This interface should be implemented by each domain (leads, contacts, etc.)
 */
export interface DomainRecord {
  id?: string;
  email: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Generic Import Repository Interface
 */
export interface ImportRepository {
  /**
   * Import records from CSV (immediate processing)
   */
  importFromCsv<T extends DomainRecord>(
    config: CsvImportConfig,
    uploadedBy: DbId,
    domainRepository: DomainImportRepository<T>,
  ): Promise<ResponseType<LeadsImportResponseType>>;

  /**
   * Create a chunked import job
   */
  createChunkedImportJob(
    config: CsvImportConfig,
    uploadedBy: DbId,
    domainName: string,
  ): Promise<ResponseType<LeadsImportResponseType>>;

  /**
   * Get CSV import job status
   */
  getCsvImportJobStatus(
    jobId: string,
    userId: DbId,
  ): Promise<ResponseType<ImportJobsListResponseType[0]>>;

  /**
   * Delete an import job
   */
  deleteImportJob(
    userId: DbId,
    jobId: string,
  ): Promise<ResponseType<{ success: boolean; message: string }>>;

  /**
   * Perform actions on import jobs (stop, retry)
   */
  performJobAction(
    userId: DbId,
    jobId: string,
    action: "stop" | "retry",
  ): Promise<ResponseType<{ success: boolean; message: string }>>;

  /**
   * Process a batch of a chunked import job
   */
  processBatch<T extends DomainRecord>(
    jobId: string,
    domainRepository: DomainImportRepository<T>,
  ): Promise<ResponseType<{ processed: number; hasMore: boolean }>>;
}
