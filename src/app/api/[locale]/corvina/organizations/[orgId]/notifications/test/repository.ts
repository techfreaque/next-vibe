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
  NotificationTestRequestOutput,
  NotificationTestResponseOutput,
  NotificationTestUrlVariablesOutput,
} from "./definition";

interface NotificationTestApiResponse {
  message: string;
}

export class NotificationTestRepository {
  static async sendTest(
    urlPathParams: NotificationTestUrlVariablesOutput,
    data: NotificationTestRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<NotificationTestResponseOutput>> {
    const path = `${CORVINA_ORGS_PATH}/${encodeURIComponent(urlPathParams.orgId)}/notifications/test`;
    const result = await CorvinaClient.request<NotificationTestApiResponse>(
      {
        method: "POST",
        path,
        body: {
          type: data.type,
          ...(data.emailTo !== undefined ? { emailTo: data.emailTo } : {}),
          ...(data.emailBcc !== undefined ? { emailBcc: data.emailBcc } : {}),
          ...(data.subject !== undefined ? { subject: data.subject } : {}),
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Test notification sent", {
      orgId: urlPathParams.orgId,
      type: data.type,
    });
    return success({
      message: result.data.message,
    });
  }
}
