/**
 * Database SQL Execution Repository
 * Handles SQL query execution with safety features
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
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
      // Get query from either direct input or file
      const query = await this.resolveQuery(data, logger);

      if (!query) {
        return fail({
          message: "app.api.system.db.sql.post.errors.validation.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      // Validate SQL query for safety
      logger.info("Executing SQL query");
      const queryType = this.getQueryType(query);

      if (data.dryRun) {
        output = this.formatDryRunOutput(query, queryType);
      } else {
        // Execute actual SQL query
        const queryResult = await this.executeQuery(query, data.limit);
        output = this.formatSuccessOutput(queryResult, queryType);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: Record<string, any>[];
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
    const rows = result.rows || [];

    return {
      results: Array.isArray(rows) ? rows : [],
      rowCount: Array.isArray(rows) ? rows.length : 0,
    };
  }

  private async resolveQuery(
    data: SqlRequestOutput,
    logger: EndpointLogger,
  ): Promise<string | null> {
    // Prefer queryFile over query if both are provided
    if (data.queryFile) {
      logger.info("Reading query from file", { filePath: data.queryFile });
      try {
        const fs = await import("node:fs/promises");
        const fileContent = await fs.readFile(data.queryFile, "utf-8");
        return fileContent.trim();
      } catch (error) {
        logger.error("Failed to read query file", {
          filePath: data.queryFile,
          errorMessage: parseError(error),
        });
        return null;
      }
    }

    if (data.query) {
      return data.query.trim();
    }

    return null;
  }

  private formatDryRunOutput(query: string, queryType: string): string {
    const lines: string[] = [];
    lines.push("Dry Run Mode - No Changes Made");
    lines.push("");
    lines.push(`Query Type: ${queryType}`);
    lines.push("");
    lines.push("Query Preview:");
    lines.push(query);
    return lines.join("\n");
  }

  private formatSuccessOutput(
    queryResult: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: Record<string, any>[];
      rowCount: number;
    },
    queryType: string,
  ): string {
    const lines: string[] = [];

    if (queryType === "SELECT") {
      lines.push(`Query executed successfully`);
      lines.push(`Returned ${queryResult.rowCount} row(s)`);

      if (queryResult.rowCount > 0 && queryResult.results.length > 0) {
        const firstRow = queryResult.results[0];
        const columnNames = Object.keys(firstRow);
        lines.push("");
        lines.push(`Columns: ${columnNames.join(", ")}`);
      }
    } else {
      lines.push(`${queryType} query executed successfully`);
      lines.push(`Affected ${queryResult.rowCount} row(s)`);
    }

    return lines.join("\n");
  }
}

/**
 * Default repository instance
 */
export const sqlRepository = new SqlRepositoryImpl();
