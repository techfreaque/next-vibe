/**
 * Database Ping Repository
 * Handles database connectivity checks
 */

import { sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db, rawPool } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { PingRequestOutput, PingResponseOutput } from "./definition";

/**
 * Database Ping Repository Implementation
 */
export class DatabasePingRepository {
  static async pingDatabase(
    data: PingRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<PingResponseOutput>> {
    try {
      // Execute database ping based on the original logic
      const result = await this.executePing(data, logger);

      const connectionInfo = result.connectionInfo || {
        totalConnections: 0,
        idleConnections: 0,
        waitingClients: 0,
      };

      const response: PingResponseOutput = {
        success: result.isAccessible,
        isAccessible: result.isAccessible,
        output: result.output,
        totalConnections: connectionInfo.totalConnections,
        idleConnections: connectionInfo.idleConnections,
        waitingClients: connectionInfo.waitingClients,
      };

      return success(response);
    } catch (error) {
      return fail({
        message: "app.api.system.db.ping.post.errors.network.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Execute database ping using the original logic from ping.ts
   */
  private static async executePing(
    data: PingRequestOutput,
    logger: EndpointLogger,
  ): Promise<{
    isAccessible: boolean;
    output: string;
    connectionInfo?: {
      totalConnections: number;
      idleConnections: number;
      waitingClients: number;
    };
  }> {
    const SUCCESS_MESSAGE = "✅ Database is accessible";
    const EMPTY_RESPONSE_MESSAGE = "❌ Database is not accessible (empty response)";
    const CONNECTION_FAILED_MESSAGE = "❌ Database connection failed";
    const PING_QUERY = sql`SELECT 1 as ping`;

    try {
      const result = await db.execute(PING_QUERY);
      const rows = result.rows;
      const pingResult = Array.isArray(rows) && rows.length > 0;

      if (pingResult) {
        // Get connection pool information
        const connectionInfo = {
          totalConnections: rawPool.totalCount,
          idleConnections: rawPool.idleCount,
          waitingClients: rawPool.waitingCount,
        };

        return {
          isAccessible: true,
          output: data.silent ? "" : SUCCESS_MESSAGE,
          connectionInfo,
        };
      }

      return {
        isAccessible: false,
        output: data.silent ? "" : EMPTY_RESPONSE_MESSAGE,
      };
    } catch (error) {
      logger.error("Database ping failed", parseError(error));
      return {
        isAccessible: false,
        output: data.silent ? "" : CONNECTION_FAILED_MESSAGE,
      };
    } finally {
      // Only close the connection if explicitly requested (for standalone ping commands)
      if (!data.keepConnectionOpen) {
        try {
          // Check if the pool is already ending or ended
          if (rawPool.totalCount > 0) {
            await rawPool.end();
          }
        } catch {
          // Ignore errors when closing the pool
        }
      }
    }
  }
}
