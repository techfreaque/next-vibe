/**
 * Database SQL Execution Repository
 * Handles SQL query execution with safety features
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../index";
import type { SqlRequestOutput, SqlResponseOutput } from "./definition";

/**
 * Execute SQL query Repository Interface
 */
export interface SqlRepositoryInterface {
  execute(
    data: SqlRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SqlResponseOutput>>;
}

/**
 * Execute SQL query Repository Implementation
 */
export class SqlRepositoryImpl implements SqlRepositoryInterface {
  async execute(
    data: SqlRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<SqlResponseOutput>> {
    let output = "";

    try {
      // Validate SQL query for safety
      logger.info("Executing SQL query");
      const queryType = this.getQueryType(data.query);

      if (data.dryRun) {
        output = "";
      } else {
        // Execute actual SQL query
        const queryResult = await this.executeQuery(data.query, data.limit);
        output = "";

        const response: SqlResponseOutput = {
          success: true,
          output,
          results: queryResult.results,
          rowCount: queryResult.rowCount,
          queryType,
        };

        logger.info("SQL query completed successfully");
        return success(response);
      }

      const response: SqlResponseOutput = {
        success: true,
        output,
        results: [],
        rowCount: 0,
        queryType,
      };

      return success(response);
    } catch (error) {
      parseError(error);

      return fail({
        message: "app.api.system.db.sql.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  private getQueryType(query: string): string {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.startsWith("select")) {
      return "SELECT";
    }
    if (normalizedQuery.startsWith("insert")) {
      return "INSERT";
    }
    if (normalizedQuery.startsWith("update")) {
      return "UPDATE";
    }
    if (normalizedQuery.startsWith("delete")) {
      return "DELETE";
    }
    if (normalizedQuery.startsWith("create")) {
      return "CREATE";
    }
    if (normalizedQuery.startsWith("drop")) {
      return "DROP";
    }
    if (normalizedQuery.startsWith("alter")) {
      return "ALTER";
    }
    return "UNKNOWN";
  }

  private async executeQuery(
    query: string,
    limit = 100,
  ): Promise<{
    results: Record<string, string | number | boolean>[];
    rowCount: number;
  }> {
    // Add LIMIT for SELECT queries if not already present
    let finalQuery = query;
    if (
      this.getQueryType(query) === "SELECT" &&
      !query.toLowerCase().includes("limit")
    ) {
      finalQuery = `${query} LIMIT ${limit}`;
    }

    // Execute the query using Drizzle
    const result = await db.execute(finalQuery);

    return {
      results: Array.isArray(result) ? result : [],
      rowCount: Array.isArray(result) ? result.length : 0,
    };
  }
}

/**
 * Default repository instance
 */
export const sqlRepository = new SqlRepositoryImpl();
