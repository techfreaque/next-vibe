import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import {
  CorvinaClient,
  type CorvinaBodyObject,
} from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  WalletGetResponseOutput,
  WalletGetUrlVariablesOutput,
  WalletPutRequestOutput,
  WalletPutResponseOutput,
  WalletPutUrlVariablesOutput,
} from "./definition";

const CORVINA_WALLET_PATH = "/api/v1/wallet";

interface CorvinaWalletApiData {
  id?: string;
  type?: string;
  description?: string;
  webhookUrl?: string;
}

export class WalletRepository {
  private static buildPath(walletId: string): string {
    return `${CORVINA_WALLET_PATH}/${encodeURIComponent(walletId)}`;
  }

  static async get(
    urlPathParams: WalletGetUrlVariablesOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletGetResponseOutput>> {
    const result = await CorvinaClient.request<CorvinaWalletApiData>(
      {
        method: "GET",
        path: this.buildPath(urlPathParams.walletId),
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({
      walletId: urlPathParams.walletId,
      id: result.data.id,
      type: result.data.type as WalletGetResponseOutput["type"],
      description: result.data.description,
      webhookUrl: result.data.webhookUrl,
    });
  }

  static async update(
    urlPathParams: WalletPutUrlVariablesOutput,
    data: WalletPutRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletPutResponseOutput>> {
    const body: CorvinaBodyObject = {};
    if (data.id !== undefined) {
      body.id = data.id;
    }
    if (data.type !== undefined) {
      body.type = data.type;
    }
    if (data.description !== undefined) {
      body.description = data.description;
    }
    if (data.webhookUrl !== undefined) {
      body.webhookUrl = data.webhookUrl;
    }

    const result = await CorvinaClient.request<CorvinaWalletApiData>(
      {
        method: "PUT",
        path: this.buildPath(urlPathParams.walletId),
        body,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    logger.info("[CORVINA] Wallet updated", {
      walletId: urlPathParams.walletId,
    });
    return success({
      walletId: urlPathParams.walletId,
      id: result.data.id,
      type: result.data.type as WalletPutResponseOutput["type"],
      description: result.data.description,
      webhookUrl: result.data.webhookUrl,
    });
  }
}
