import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { CorvinaClient } from "@/app/api/[locale]/corvina/client";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  WalletBalanceRequestOutput,
  WalletBalanceResponseOutput,
} from "./definition";

export class WalletBalanceRepository {
  static async getBalance(
    data: WalletBalanceRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<WalletBalanceResponseOutput>> {
    const result = await CorvinaClient.request<number>(
      {
        method: "GET",
        path: `/api/v1/wallet/${data.walletId}/balance`,
        service: "license",
      },
      logger,
      locale,
    );
    if (!result.success) {
      return result;
    }
    return success({ balance: result.data });
  }
}
