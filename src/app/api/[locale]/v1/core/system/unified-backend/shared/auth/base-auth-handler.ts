import "server-only";

import type { NextRequest } from "next/server";

import type { CountryLanguage } from "@/i18n/core/config";

import type { ResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { JwtPayloadType, JwtPrivatePayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";

import type { EndpointLogger } from "../logger-types";

export type AuthPlatform =
  | "next"
  | "trpc"
  | "cli"
  | "ai"
  | "mcp"
  | "web"
  | "mobile";

export interface AuthContext {
  platform: AuthPlatform;
  request?: NextRequest;
  token?: string;
  jwtPayload?: JwtPayloadType;
  locale: CountryLanguage;
}

export interface AuthResult<T extends JwtPayloadType = JwtPayloadType> {
  success: boolean;
  user: T;
  error?: string;
}

export interface LeadIdentifier {
  leadId: string;
  userId?: string;
  isPublic: boolean;
}

export abstract class BaseAuthHandler {
  abstract authenticate(
    context: AuthContext,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPayloadType>>;

  abstract verifyToken(
    token: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<JwtPrivatePayloadType>>;

  abstract validateSession(
    token: string,
    userId: string,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<JwtPrivatePayloadType | null>;

  abstract getLeadIdFromDb(
    userId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
    skipCookies?: boolean,
  ): Promise<string>;

  protected hasRequiredRoles(
    userRoles: string[],
    requiredRoles: readonly string[],
  ): boolean {
    if (requiredRoles.includes("PUBLIC")) {
      return true;
    }
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  protected createPublicUser(leadId: string): JwtPayloadType {
    if (!leadId) {
      throw new Error("leadId from DB required for public user");
    }
    return {
      leadId,
      isPublic: true,
    };
  }

  protected createPrivateUser(userId: string, leadId: string): JwtPrivatePayloadType {
    if (!leadId) {
      throw new Error("leadId from DB required for private user");
    }
    if (!userId) {
      throw new Error("userId required for private user");
    }
    return {
      id: userId,
      leadId,
      isPublic: false,
    };
  }


  protected getUserFromEnvironment(platform: AuthPlatform): string | undefined {
    if (platform === "cli" || platform === "ai" || platform === "mcp") {
      return process.env.CLI_USER_ID;
    }
    return undefined;
  }

  protected async validateUserLeadId(
    userId: string,
    leadId: string | undefined,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<string> {
    if (leadId) {
      return leadId;
    }
    logger.error("User missing leadId from DB", { userId });
    return await this.getLeadIdFromDb(userId, locale, logger);
  }

  abstract getPrimaryLeadId(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string | null>;

  abstract getAllLeadIds(
    userId: string,
    logger: EndpointLogger,
  ): Promise<string[]>;

}

