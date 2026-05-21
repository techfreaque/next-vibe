import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CORVINA_ORGS_PATH,
  CorvinaClient,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CorvinaUserCreateRequestOutput,
  CorvinaUserCreateResponseOutput,
} from "./definition";

interface CorvinaUserApiData {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  serviceAccount: boolean;
  mfaEnabled: boolean;
  owner: string;
}

interface UserCreateUrlParams {
  orgId: number;
}

export class CorvinaUserCreateRepository {
  static async create(
    urlPathParams: UserCreateUrlParams,
    data: CorvinaUserCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaUserCreateResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/users`;
    const result = await CorvinaClient.request<CorvinaUserApiData>(
      {
        method: "POST",
        path,
        body: {
          username: data.username,
          email: data.email,
          ...(data.firstName !== undefined
            ? { firstName: data.firstName }
            : {}),
          ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
          ...(data.password !== undefined ? { password: data.password } : {}),
          temporaryPassword: data.temporaryPassword,
          passwordChangeInvitation: data.passwordChangeInvitation,
          serviceAccount: data.serviceAccount,
          emailVerified: data.emailVerified,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] User created", {
      orgId: urlPathParams.orgId,
      username: data.username,
    });
    return success({
      id: result.data.id,
      usernameResult: result.data.username,
      emailResult: result.data.email,
      firstNameResult: result.data.firstName,
      lastNameResult: result.data.lastName,
      serviceAccountResult: result.data.serviceAccount,
      mfaEnabled: result.data.mfaEnabled,
      owner: result.data.owner as "ORGANIZATION" | "APP",
    });
  }
}
