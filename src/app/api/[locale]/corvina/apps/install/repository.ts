import "server-only";

import { z } from "zod";
import {
  type ResponseType,
  success,
} from "next-vibe/shared/types/response.schema";
import {
  CorvinaClient,
  type CorvinaBodyObject,
  type CorvinaBodyValue,
} from "@/app/api/[locale]/corvina/client";
import { corvinaEnv } from "@/app/api/[locale]/corvina/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { CorvinaAppInstallStatus } from "../enums";
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

function isCorvinaBodyObject(val: CorvinaBodyValue): val is CorvinaBodyObject {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

function resolveManifest(
  manifest: CorvinaAppInstallRequestOutput["manifest"],
): CorvinaBodyObject {
  if (typeof manifest !== "string") {
    return manifest;
  }
  // The definition's refine already validated this is a valid JSON object string
  const parsed: CorvinaBodyValue = JSON.parse(manifest);
  return isCorvinaBodyObject(parsed) ? parsed : {};
}

export class CorvinaAppInstallRepository {
  static async install(
    data: CorvinaAppInstallRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<CorvinaAppInstallResponseOutput>> {
    const resolvedManifest = resolveManifest(data.manifest);
    const appBaseUrl =
      corvinaEnv.CORVINA_APP_BASE_URL ??
      (typeof resolvedManifest.baseUrl === "string"
        ? resolvedManifest.baseUrl
        : undefined);
    if (appBaseUrl !== undefined) {
      if (typeof resolvedManifest.baseUrl === "string") {
        resolvedManifest.baseUrl = appBaseUrl;
      }
      const lifecycle = resolvedManifest.lifecycle;
      if (
        lifecycle !== null &&
        lifecycle !== undefined &&
        isCorvinaBodyObject(lifecycle)
      ) {
        if (
          typeof lifecycle.installed === "string" &&
          lifecycle.installed.startsWith("/")
        ) {
          lifecycle.installed = `${appBaseUrl}${lifecycle.installed}`;
        }
        if (
          typeof lifecycle.uninstalled === "string" &&
          lifecycle.uninstalled.startsWith("/")
        ) {
          lifecycle.uninstalled = `${appBaseUrl}${lifecycle.uninstalled}`;
        }
      }
    }
    const body: CorvinaBodyObject = {
      manifest: resolvedManifest,
    };
    if (data.appId !== undefined) {
      body.appId = data.appId;
    }
    if (data.planId !== undefined && data.planId !== "") {
      body.planId = data.planId;
    }

    const authHeader = request?.headers.get("authorization") ?? "";
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    const path = `/api/v1/organizations/${data.organizationId}/apps`;
    logger.info("[CORVINA] Sending install request", {
      path,
      authMode: bearerToken !== undefined ? "bearer" : "api-key",
      body: JSON.stringify(body).slice(0, 2000),
    });
    const result = await CorvinaClient.request<CorvinaInstallResult>(
      { method: "POST", path, body, bearerToken },
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

    const statusParsed = z
      .enum(CorvinaAppInstallStatus)
      .nullable()
      .safeParse(result.data.status);

    return success({
      id: result.data.id,
      status: statusParsed.success ? statusParsed.data : null,
      appKey: result.data.app?.key ?? null,
      appName: result.data.app?.name?.value ?? null,
      serviceAccountUsername: result.data.serviceAccountUsername ?? null,
      createdAt: result.data.createdAt ?? null,
    });
  }
}
