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
  WalletCreateRequestOutput,
  WalletCreateResponseOutput,
} from "./definition";

const CORVINA_WALLET_PATH = "/api/v1/wallet";

interface CorvinaWalletDTO {
  id?: string;
  type?: string;
  description?: string;
  webhookUrl?: string;
}

export class WalletCreateRepository {
  static async create(
    data: WalletCreateRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletCreateResponseOutput>> {
    const body: CorvinaBodyObject = {};
    if (data.id !== undefined && data.id !== "") {
      body.id = data.id;
    }
    if (data.type !== undefined) {
      body.type = data.type;
    }
    if (data.description !== undefined && data.description !== "") {
      body.description = data.description;
    }
    if (data.webhookUrl !== undefined && data.webhookUrl !== "") {
      body.webhookUrl = data.webhookUrl;
    }

    const result = await CorvinaClient.request<CorvinaWalletDTO>(
      { method: "POST", path: CORVINA_WALLET_PATH, body, service: "license" },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }

    return success({
      id: result.data.id,
      type: result.data.type as WalletCreateResponseOutput["type"],
      description: result.data.description,
      webhookUrl: result.data.webhookUrl,
    });
  }
}
