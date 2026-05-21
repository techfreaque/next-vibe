import "server-only";

import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";

import {
  CorvinaClient,
  type CorvinaBodyObject,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CorvinaAppInstallRequestOutput,
  CorvinaAppInstallResponseOutput,
} from "./definition";

interface CorvinaInstallResult {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  serviceAccountUsername?: string;
  app?: {
    key?: string;
    name?: { value?: string };
  };
}

export class CorvinaAppInstallRepository {
  static async install(
    data: CorvinaAppInstallRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaAppInstallResponseOutput>> {
    const manifestObj = JSON.parse(data.manifest) as CorvinaBodyObject;
    const body: CorvinaBodyObject = { manifest: manifestObj };
    if (data.appId !== undefined) {
      body.appId = data.appId;
    }
    if (data.planId !== undefined && data.planId !== "") {
      body.planId = data.planId;
    }

    const path = `/api/v1/organizations/${data.organizationId}/apps`;
    const result = await CorvinaClient.request<CorvinaInstallResult>(
      { method: "POST", path, body },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    logger.info("[CORVINA] App install initiated", {
      orgId: data.organizationId,
      installId: result.data.id,
      status: result.data.status,
    });

    return success({
      id: result.data.id,
      status: result.data.status as CorvinaAppInstallResponseOutput["status"],
      appKey: result.data.app?.key ?? null,
      appName: result.data.app?.name?.value ?? null,
      serviceAccountUsername: result.data.serviceAccountUsername ?? null,
      createdAt: result.data.createdAt ?? null,
    });
  }
}
