/**
 * IMAP Connection Repository
 * Core service for managing IMAP connections with connection pooling and error handling
 */

import "server-only";

import Imap from "imap";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  fail,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { JwtPayloadType } from "../../../user/auth/types";
import type { ImapAccount } from "../db";
import {
  ImapAuthMethod,
  ImapConnectionStatus,
  ImapSpecialUseType,
} from "../enum";
import type {
  ImapConnectionCloseRequestOutput,
  ImapConnectionCloseResponseOutput,
  ImapConnectionConfig,
  ImapConnectionTestRequestOutput,
  ImapConnectionTestResponseOutput,
  ImapFolderInfo,
  ImapFolderListRequestOutput,
  ImapFolderListResponseOutput,
  ImapMessageInfo,
  ImapMessageListRequestOutput,
  ImapMessageListResponseOutput,
} from "./types";

/**
 * IMAP Box Information from node-imap library
 */
interface ImapBoxInfo {
  displayName?: string;
  delimiter?: string;
  noselect?: boolean;
  children?: Record<string, ImapBoxInfo>;
  special_use_attrib?: string;
  uidvalidity?: number;
  uidnext?: number;
  messages?: {
    total?: number;
    recent?: number;
    unseen?: number;
  };
}

/**
 * IMAP Message Structure Information
 */
interface ImapMessageStruct {
  disposition?: {
    type?: string;
    params?: Record<string, string>;
  };
  type?: string;
  subtype?: string;
  params?: Record<string, string>;
  id?: string;
  description?: string;
  encoding?: string;
  size?: number;
  lines?: number;
  md5?: string;
  partID?: string;
}

/**
 * IMAP Connection Object Interface
 */
interface ImapConnectionImpl {
  state: string;
  host: string;
  port: number;
  username: string;
  capabilities: string[];
  close: () => void;
}

/**
 * IMAP Connection Repository Interface
 */
export interface ImapConnectionRepository {
  testConnection(
    data: ImapConnectionTestRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapConnectionTestResponseOutput>>;

  connect(
    account: ImapAccount,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapConnectionImpl>>;

  disconnect(
    data: ImapConnectionCloseRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapConnectionCloseResponseOutput>>;

  listFolders(
    data: ImapFolderListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapFolderListResponseOutput>>;

  listMessages(
    data: ImapMessageListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageListResponseOutput>>;

  closeAllConnections(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<{ success: boolean; message: TranslationKey }>;
}

/**
 * Map IMAP special use attributes to our enum values
 */
function mapImapSpecialUseType(
  specialUseAttrib?: string,
): (typeof ImapSpecialUseType)[keyof typeof ImapSpecialUseType] | undefined {
  if (!specialUseAttrib) {
    return undefined;
  }

  // IMAP special use attributes come with backslashes (e.g., "\Trash", "\Drafts")
  // We need to map them to our enum values
  switch (specialUseAttrib.toLowerCase()) {
    case "\\trash":
      return ImapSpecialUseType.TRASH;
    case "\\drafts":
      return ImapSpecialUseType.DRAFTS;
    case "\\sent":
      return ImapSpecialUseType.SENT;
    case "\\archive":
      return ImapSpecialUseType.ARCHIVE;
    case "\\junk":
    case "\\spam":
      return ImapSpecialUseType.JUNK;
    case "\\inbox":
      return ImapSpecialUseType.INBOX;
    default:
      return undefined;
  }
}

/**
 * IMAP Connection Repository Implementation
 */
export class ImapConnectionRepositoryImpl implements ImapConnectionRepository {
  private connections: Map<string, ImapConnectionImpl> = new Map();

  /**
   * Create connection configuration from account
   */
  private createConnectionConfig(account: ImapAccount): ImapConnectionConfig {
    return {
      host: account.host,
      port: account.port,
      secure: account.secure || false,
      username: account.username,
      password: account.password,
      authMethod: account.authMethod || ImapAuthMethod.PLAIN,
      connectionTimeout: account.connectionTimeout || 30000,
      keepAlive: account.keepAlive || false,
    };
  }

  /**
   * Test IMAP connection
   */
  async testConnection(
    data: ImapConnectionTestRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapConnectionTestResponseOutput>> {
    const startTime = Date.now();
    const config = this.createConnectionConfig(data.account);

    try {
      logger.debug("Testing IMAP connection", messageParams: {
        host: config.host,
        port: config.port,
        username: config.username,
      });

      // Implement actual IMAP connection test
      try {
        // Basic validation
        if (
          !config.host ||
          !config.port ||
          !config.username ||
          !config.password
        ) {
          logger.error("IMAP connection test failed", messageParams: {
            error: "Missing required configuration",
            host: config.host,
            port: config.port,
            username: config.username,
          });
          return fail({
          message: 
            "app.api.v1.core.emails.imapClient.imapErrors.validation.account.username.required",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Validate port range
        if (config.port < 1 || config.port > 65535) {
          logger.error("IMAP connection test failed", messageParams: {
            error: "Invalid port number",
            port: config.port,
          });
          return fail({
          message: 
            "app.api.v1.core.emails.imapClient.imapErrors.validation.account.port.invalid",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Validate host format (basic check)
        if (!/^[a-zA-Z0-9.-]+$/.test(config.host)) {
          logger.error("IMAP connection test failed", messageParams: {
            error: "Invalid host format",
            host: config.host,
          });
          return fail({
          message: 
            "app.api.v1.core.emails.imapClient.imapErrors.validation.account.host.invalid",
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          );
        }

        // Implement actual IMAP connection test using node-imap
        return await new Promise<
          ResponseType<ImapConnectionTestResponseOutput>
        >((resolve) => {
          const imap = new Imap({
            user: config.username,
            password: config.password,
            host: config.host,
            port: config.port,
            tls: config.secure,
            connTimeout: 10000,
            authTimeout: 5000,
          });

          let resolved = false;

          const resolveOnce = (
            result: ResponseType<ImapConnectionTestResponseOutput>,
          ): void => {
            if (!resolved) {
              resolved = true;
              resolve(result);
            }
          };

          imap.once("ready", () => {
            const responseTime = Date.now() - startTime;

            logger.debug("IMAP connection test successful", messageParams: {
              host: config.host,
              responseTime,
            });

            resolveOnce(
              createSuccessResponse({
                success: true,
                message:
                  "app.api.v1.core.emails.imapClient.imap.connection.test.success" as const,
                connectionStatus: ImapConnectionStatus.CONNECTED,
                details: {
                  host: config.host,
                  port: config.port,
                  secure: config.secure,
                  authMethod: config.authMethod,
                  responseTime,
                  serverCapabilities: [],
                },
              }),
            );

            imap.end();
          });

          imap.once("error", (error: Error) => {
            logger.error("IMAP connection test failed", messageParams: {
              error: error.message || "IMAP connection error",
              host: config.host,
              port: config.port,
              secure: config.secure,
              username: config.username,
              errorDetails: error,
            });

            resolveOnce(
              fail({
          message: 
                "app.api.v1.core.emails.imapClient.imapErrors.connection.test.failed",
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              ),
            );
          });

          // Timeout fallback
          setTimeout(() => {
            resolveOnce(
              fail({
          message: 
                "app.api.v1.core.emails.imapClient.imap.connection.test.timeout",
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              ),
            );
          }, 15000);

          imap.connect();
        });
      } catch (error) {
        logger.error("IMAP connection test failed", parseError(error));

        return fail({
          message: 
          "app.api.v1.core.emails.imapClient.imap.connection.test.failed",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        );
      }
    } catch (error) {
      logger.error("IMAP connection test failed", parseError(error));

      return fail({
          message: 
        "app.api.v1.core.emails.imapClient.imap.connection.test.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Connect to IMAP server
   */
  async connect(
    account: ImapAccount,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapConnectionImpl>> {
    const config = this.createConnectionConfig(account);
    const connectionKey = `${config.host}:${config.port}:${config.username}`;

    try {
      logger.debug("Connecting to IMAP server", messageParams: {
        host: config.host,
        port: config.port,
        username: config.username,
      });

      // Check if connection already exists
      if (this.connections.has(connectionKey)) {
        const existingConnection = this.connections.get(connectionKey);
        if (
          existingConnection &&
          existingConnection.state === "authenticated"
        ) {
          logger.debug("Reusing existing IMAP connection", messageParams: { connectionKey });
          return createSuccessResponse(existingConnection);
        }
      }

      // Implement actual IMAP connection using node-imap
      return await new Promise<ResponseType<ImapConnectionImpl>>(
        (resolve, reject) => {
          const imap = new Imap({
            user: config.username,
            password: config.password,
            host: config.host,
            port: config.port,
            tls: config.secure || false,
            connTimeout: 10000,
            authTimeout: 5000,
          });

          imap.once("ready", () => {
            const connection: ImapConnectionImpl = {
              state: "authenticated",
              host: config.host,
              port: config.port,
              username: config.username,
              capabilities: [],
              close: () => {
                logger.debug("Closing IMAP connection", messageParams: { connectionKey });
                this.connections.delete(connectionKey);
                imap.end();
              },
            };

            this.connections.set(connectionKey, connection);

            logger.debug("IMAP connection established", messageParams: {
              host: config.host,
              connectionKey,
            });

            resolve(createSuccessResponse(connection));
          });

          imap.once("error", (err: Error) => {
            logger.error("Error connecting to IMAP server", messageParams: {
              error: err.message,
              host: config.host,
              port: config.port,
              secure: config.secure,
              username: config.username,
              errorDetails: err,
            });
            reject(err);
          });

          imap.connect();
        },
      );
    } catch (error) {
      logger.error("Failed to connect to IMAP server", parseError(error));
      return fail({
          message: 
        "app.api.v1.core.emails.imapClient.imapErrors.connection.failed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      );
    }
  }

  /**
   * Disconnect from IMAP server
   */
  async disconnect(
    data: ImapConnectionCloseRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapConnectionCloseResponseOutput>> {
    const config = this.createConnectionConfig(data.account);
    const connectionKey = `${config.host}:${config.port}:${config.username}`;

    try {
      const connection = this.connections.get(connectionKey);
      if (connection) {
        connection.close();
        this.connections.delete(connectionKey);
        logger.debug("IMAP connection closed", messageParams: { connectionKey });
      }

      // Add a small delay to ensure cleanup
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 100);
      });

      return createSuccessResponse({
        success: true,
        message:
          "app.api.v1.core.emails.imapClient.imap.connection.test.success",
      });
    } catch (error) {
      logger.error("Error closing IMAP connection", parseError(error));
      return fail({
          message: 
        "app.api.v1.core.emails.imapClient.imapErrors.connection.close.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * List folders from IMAP server
   */
  async listFolders(
    data: ImapFolderListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapFolderListResponseOutput>> {
    try {
      logger.debug("Listing IMAP folders", messageParams: { accountId: data.account.id });

      // Implement actual folder listing using IMAP
      const folders = await new Promise<ImapFolderInfo[]>((resolve, reject) => {
        const imap = new Imap({
          user: data.account.username,
          password: data.account.password,
          host: data.account.host,
          port: data.account.port,
          tls: data.account.secure || false,
          connTimeout: 10000,
          authTimeout: 5000,
        });

        imap.once("ready", () => {
          imap.getBoxes((err, boxes) => {
            if (err) {
              reject(err);
              return;
            }

            const folders: ImapFolderInfo[] = [];

            const processBox = (
              box: ImapBoxInfo,
              name: string,
              path: string,
            ): void => {
              folders.push({
                name,
                displayName: box.displayName || name,
                path,
                delimiter: box.delimiter || "/",
                isSelectable: !box.noselect,
                hasChildren: Boolean(
                  box.children && Object.keys(box.children).length > 0,
                ),
                isSpecialUse: Boolean(box.special_use_attrib),
                specialUseType: mapImapSpecialUseType(box.special_use_attrib),
                uidValidity: box.uidvalidity || undefined,
                uidNext: box.uidnext || undefined,
                messageCount: box.messages?.total || 0,
                recentCount: box.messages?.recent || 0,
                unseenCount: box.messages?.unseen || 0,
              });

              if (box.children) {
                Object.keys(box.children).forEach((childName) => {
                  const childPath = path
                    ? `${path}${box.delimiter || "/"}${childName}`
                    : childName;
                  processBox(box.children![childName], childName, childPath);
                });
              }
            };

            Object.keys(boxes).forEach((boxName) => {
              processBox(boxes[boxName], boxName, boxName);
            });

            resolve(folders);
            imap.end();
          });
        });

        imap.once("error", (err: Error) => {
          reject(err);
        });

        imap.connect();
      });

      return createSuccessResponse({ folders });
    } catch (error) {
      logger.error("Error listing IMAP folders", parseError(error));
      return fail({
          message: 
        "app.api.v1.core.emails.imapClient.imapErrors.connection.folders.list.failed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      );
    }
  }

  /**
   * List messages from IMAP folder
   */
  async listMessages(
    data: ImapMessageListRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<ImapMessageListResponseOutput>> {
    try {
      logger.debug("Listing IMAP messages", messageParams: {
        accountId: data.account.id,
        folderPath: data.folderPath,
      });

      // Implement actual message listing using IMAP
      const messages = await new Promise<ImapMessageInfo[]>(
        (resolve, reject) => {
          const imap = new Imap({
            user: data.account.username,
            password: data.account.password,
            host: data.account.host,
            port: data.account.port,
            tls: data.account.secure || false,
            connTimeout: 10000,
            authTimeout: 5000,
          });

          imap.once("ready", () => {
            imap.openBox(data.folderPath, true, (err) => {
              if (err) {
                reject(err);
                return;
              }

              const searchCriteria: (string | (string | Date)[])[] = ["ALL"];
              if (data.options?.since) {
                searchCriteria.push(["SINCE", data.options.since]);
              }
              if (data.options?.before) {
                searchCriteria.push(["BEFORE", data.options.before]);
              }

              imap.search(searchCriteria, (searchErr, results) => {
                if (searchErr) {
                  reject(searchErr);
                  return;
                }

                if (!results || results.length === 0) {
                  resolve([]);
                  imap.end();
                  return;
                }

                // Apply limit if specified
                const limit = data.options?.limit || 50;
                const limitedResults = results.slice(0, limit);

                const fetch = imap.fetch(limitedResults, messageParams: {
                  bodies: "HEADER",
                  struct: true,
                });

                const messages: ImapMessageInfo[] = [];

                fetch.on("message", (msg) => {
                  let headers: Record<string, string[]> = {};
                  let attributes: {
                    uid?: number;
                    size?: number;
                    flags?: string[];
                    struct?: ImapMessageStruct | ImapMessageStruct[];
                  } = {};

                  msg.on("body", (stream) => {
                    let buffer = "";
                    stream.on("data", (chunk: Buffer) => {
                      buffer += chunk.toString("ascii");
                    });
                    stream.once("end", () => {
                      // Simple header parsing - just extract basic fields
                      const lines = buffer.split("\r\n");
                      for (const line of lines) {
                        const colonIndex = line.indexOf(":");
                        if (colonIndex > 0) {
                          const key = line
                            .substring(0, colonIndex)
                            .toLowerCase();
                          const value = line.substring(colonIndex + 1).trim();
                          if (key && value) {
                            headers[key] = [value];
                          }
                        }
                      }
                    });
                  });

                  msg.once("attributes", (attrs) => {
                    attributes = attrs as typeof attributes;
                  });

                  msg.once("end", () => {
                    const headerRecord: Record<string, string> = {};
                    Object.entries(headers).forEach(([key, value]) => {
                      headerRecord[key] = Array.isArray(value)
                        ? value[0] || ""
                        : value;
                    });

                    messages.push({
                      uid: attributes.uid || 0,
                      messageId: headers["message-id"]?.[0] || "",
                      subject: headers.subject?.[0] || "",
                      from: headers.from?.[0] || "",
                      to: headers.to?.[0] || "",
                      date: new Date(headers.date?.[0] || Date.now()),
                      size: attributes.size || 0,
                      flags: attributes.flags || [],
                      headers: headerRecord,
                      hasAttachments: this.checkHasAttachments(
                        attributes.struct,
                      ),
                      attachmentCount: this.countAttachments(attributes.struct),
                    });
                  });
                });

                fetch.once("error", (fetchErr) => {
                  reject(fetchErr);
                });

                fetch.once("end", () => {
                  resolve(messages);
                  imap.end();
                });
              });
            });
          });

          imap.once("error", (err: Error) => {
            reject(err);
          });

          imap.connect();
        },
      );

      return createSuccessResponse({ messages });
    } catch (error) {
      logger.error("Error listing IMAP messages", parseError(error));
      return fail({
          message: 
        "app.api.v1.core.emails.imapClient.imapErrors.connection.messages.list.failed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      );
    }
  }

  /**
   * Check if message has attachments based on structure
   */
  private checkHasAttachments(
    struct: ImapMessageStruct | ImapMessageStruct[] | undefined,
  ): boolean {
    if (!struct) {
      return false;
    }

    // Check if it's a multipart message
    if (Array.isArray(struct)) {
      return struct.some((part: ImapMessageStruct) => {
        const disposition = part.disposition;
        return Boolean(
          disposition?.type &&
            typeof disposition.type === "string" &&
            disposition.type.toLowerCase() === "attachment",
        );
      });
    }

    // Check single part
    const disposition = struct.disposition;
    return Boolean(
      disposition?.type &&
        typeof disposition.type === "string" &&
        disposition.type.toLowerCase() === "attachment",
    );
  }

  /**
   * Count attachments in message structure
   */
  private countAttachments(
    struct: ImapMessageStruct | ImapMessageStruct[] | undefined,
  ): number {
    if (!struct) {
      return 0;
    }

    // Check if it's a multipart message
    if (Array.isArray(struct)) {
      return struct.filter((part: ImapMessageStruct) => {
        const disposition = part.disposition;
        return (
          disposition?.type &&
          typeof disposition.type === "string" &&
          disposition.type.toLowerCase() === "attachment"
        );
      }).length;
    }

    // Check single part
    const disposition = struct.disposition;
    return disposition?.type &&
      typeof disposition.type === "string" &&
      disposition.type.toLowerCase() === "attachment"
      ? 1
      : 0;
  }

  /**
   * Close all connections
   */
  closeAllConnections(
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): ResponseType<{ success: boolean; message: TranslationKey }> {
    try {
      logger.debug("Closing all IMAP connections");

      // Close all connections synchronously (close() returns void, not Promise)
      [...this.connections.values()].forEach((connection) =>
        connection.close(),
      );

      this.connections.clear();

      logger.debug("All IMAP connections closed");

      return createSuccessResponse({
        success: true,
        message:
          "app.api.v1.core.emails.imapClient.imap.connection.test.success",
      });
    } catch (error) {
      logger.error("Error closing IMAP connections", parseError(error));
      return fail({
          message: 
        "app.api.v1.core.emails.imapClient.imapErrors.connection.close.failed",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

// Export singleton instance
export const imapConnectionRepository = new ImapConnectionRepositoryImpl();
