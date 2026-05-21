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
  NotificationCreateRequestOutput,
  NotificationCreateResponseOutput,
  NotificationCreateUrlVariablesOutput,
  NotificationListResponseOutput,
  NotificationListUrlVariablesOutput,
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

interface NotificationConfigsPageApiData {
  content: NotificationConfigApiData[];
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export class NotificationConfigListRepository {
  private static buildBasePath(orgId: number): string {
    return `${CORVINA_ORGS_PATH}/${encodeURIComponent(orgId)}/notifications/configurations`;
  }

  static async list(
    urlPathParams: NotificationListUrlVariablesOutput,
    data: { page?: number; pageSize?: number },
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<NotificationListResponseOutput>> {
    const result = await CorvinaClient.request<NotificationConfigsPageApiData>(
      {
        method: "GET",
        path: this.buildBasePath(urlPathParams.orgId),
        query: {
          page: data.page ?? 0,
          size: data.pageSize ?? 10,
        },
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      configs: result.data.content.map((c) => ({
        id: c.id,
        organizationId: c.organizationId,
        event: c.event,
        beforeDays: c.beforeDays,
        afterDays: c.afterDays,
        emailBcc: c.emailBcc,
        lastCheck: c.lastCheck !== null ? new Date(c.lastCheck) : null,
      })),
      totalElements: result.data.totalElements,
      totalPages: result.data.totalPages,
      last: result.data.last,
    });
  }

  static async create(
    urlPathParams: NotificationCreateUrlVariablesOutput,
    data: NotificationCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<NotificationCreateResponseOutput>> {
    const result = await CorvinaClient.request<NotificationConfigApiData>(
      {
        method: "POST",
        path: this.buildBasePath(urlPathParams.orgId),
        body: {
          event: data.event,
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
    logger.info("[CORVINA] Notification config created", {
      orgId: urlPathParams.orgId,
      event: data.event,
    });
    return success({
      id: result.data.id,
      organizationId: result.data.organizationId,
      event: result.data.event,
      beforeDays: result.data.beforeDays,
      afterDays: result.data.afterDays,
      emailBcc: result.data.emailBcc,
      lastCheck:
        result.data.lastCheck !== null ? new Date(result.data.lastCheck) : null,
    });
  }
}
