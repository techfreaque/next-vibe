import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  SubscriptionsResourceJournalRequestOutput,
  SubscriptionsResourceJournalResponseOutput,
  SubscriptionsResourceJournalUrlParamsOutput,
} from "./definition";

interface CorvinaResourceUsageDevice {
  id: number;
  logicalId: string;
  orgResourceId: string;
  serialNumber: string;
  label: string;
  fromDateVpn: string;
  toDateVpn: string;
}

interface CorvinaResourceUsageItem {
  device: CorvinaResourceUsageDevice | null;
  usage: number;
  timestamp: string | null;
  grantingOrganization: string | null;
  dealerOrganization: string | null;
  organization: string | null;
  licenseCode: string | null;
}

interface CorvinaResourceUsagePageResponse {
  content: CorvinaResourceUsageItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export class SubscriptionsResourceJournalRepository {
  static async list(
    urlPathParams: SubscriptionsResourceJournalUrlParamsOutput,
    data: SubscriptionsResourceJournalRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<SubscriptionsResourceJournalResponseOutput>> {
    const query: Record<string, string | number | undefined> = {
      page: data.page ?? 0,
      pageSize: data.pageSize ?? 10,
    };
    if (data.orgResourceId !== undefined && data.orgResourceId !== "") {
      query.orgResourceId = data.orgResourceId;
    }
    if (data.deviceLabel !== undefined && data.deviceLabel !== "") {
      query.deviceLabel = data.deviceLabel;
    }
    if (
      data.organizationFilter !== undefined &&
      data.organizationFilter !== ""
    ) {
      query.organizationFilter = data.organizationFilter;
    }
    if (data.includeSubOrgs !== undefined) {
      query.includeSubOrgs = String(data.includeSubOrgs);
    }
    if (data.fromDate !== undefined) {
      query.fromDate = data.fromDate;
    }
    if (data.toDate !== undefined) {
      query.toDate = data.toDate;
    }

    const path = `/api/v1/subscriptions/resource/${encodeURIComponent(urlPathParams.resourceType)}/journal`;

    const result =
      await CorvinaClient.request<CorvinaResourceUsagePageResponse>(
        {
          method: "GET",
          path,
          query,
          service: "license",
        },
        logger,
        locale,
      );
    if (!result.success) {
      return result;
    }
    return success({
      resourceType: urlPathParams.resourceType,
      total: result.data.totalElements,
      totalPages: result.data.totalPages,
      currentPage: result.data.number,
      items: result.data.content.map((item) => ({
        usage: item.usage,
        timestamp: item.timestamp,
        grantingOrganization: item.grantingOrganization,
        dealerOrganization: item.dealerOrganization,
        organization: item.organization,
        licenseCode: item.licenseCode,
        deviceId: item.device !== null ? item.device.id : null,
        deviceLogicalId: item.device !== null ? item.device.logicalId : null,
        deviceSerialNumber:
          item.device !== null ? item.device.serialNumber : null,
      })),
    });
  }
}
