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
  NotificationDeleteResponseOutput,
  NotificationDeleteUrlVariablesOutput,
  NotificationUpdateRequestOutput,
  NotificationUpdateResponseOutput,
  NotificationUpdateUrlVariablesOutput,
} from "./definition";

interface NotificationConfigApiData {
  id: number;
  organizationId: number;
  event: string;
  beforeDays: number | null;
  afterDays: number | null;
  emailBcc: string | null;
  lastCheck: number | null;
}

function mapConfig(
  raw: NotificationConfigApiData,
): NotificationDeleteResponseOutput {
  return {
    id: raw.id,
    organizationId: raw.organizationId,
    event: raw.event,
    beforeDays: raw.beforeDays,
    afterDays: raw.afterDays,
    emailBcc: raw.emailBcc,
    lastCheck: raw.lastCheck !== null ? new Date(raw.lastCheck) : null,
  };
}

export class NotificationConfigByIdRepository {
  private static buildPath(orgId: number, configId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/notifications/configurations/${encodeURIComponent(configId)}`;
  }

  static async update(
    urlPathParams: NotificationUpdateUrlVariablesOutput,
    data: NotificationUpdateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<NotificationUpdateResponseOutput>> {
    const result = await CorvinaClient.request<NotificationConfigApiData>(
      {
        method: "POST",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.configId),
        body: {
          ...(data.event !== undefined ? { event: data.event } : {}),
          ...(data.beforeDays !== undefined
            ? { beforeDays: data.beforeDays }
            : {}),
          ...(data.afterDays !== undefined
            ? { afterDays: data.afterDays }
            : {}),
          ...(data.emailBcc !== undefined ? { emailBcc: data.emailBcc } : {}),
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Notification config updated", {
      orgId: urlPathParams.orgId,
      configId: urlPathParams.configId,
    });
    return success(mapConfig(result.data));
  }

  static async deleteConfig(
    urlPathParams: NotificationDeleteUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<NotificationDeleteResponseOutput>> {
    const result = await CorvinaClient.request<NotificationConfigApiData>(
      {
        method: "DELETE",
        path: this.buildPath(urlPathParams.orgId, urlPathParams.configId),
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Notification config deleted", {
      orgId: urlPathParams.orgId,
      configId: urlPathParams.configId,
    });
    return success(mapConfig(result.data));
  }
}
