/**
 * POS Order Void Repository
 * Voids an open order
 */

import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";

import { posOrders } from "../../../db";
import { PosOrderStatus } from "../../../enum";
import { scopedTranslation } from "../../../i18n";
import { withOpenOrder } from "../../open-order";
import type { PosOrderVoidPostRequestOutput } from "./definition";

export class PosOrderVoidRepository {
  static async voidOrder(
    data: PosOrderVoidPostRequestOutput,
    userId: string,
    logger: EndpointLogger,
    locale: CountryLanguage = defaultLocale,
  ): Promise<
    ResponseType<{
      result: {
        id: string;
        status: string;
      };
    }>
  > {
    const { t } = scopedTranslation.scopedT(locale);

    try {
      const { orderId } = data;

      return await withOpenOrder(
        orderId,
        userId,
        logger,
        locale,
        {
          notFound: t("orderVoid.post.errors.notFound.title"),
          conflict: t("orderVoid.post.errors.conflict.title"),
        },
        async (tx) => {
          const [updated] = await tx
            .update(posOrders)
            .set({
              status: PosOrderStatus.VOIDED,
              updatedAt: new Date(),
            })
            .where(eq(posOrders.id, orderId))
            .returning({
              id: posOrders.id,
              status: posOrders.status,
            });

          if (!updated) {
            logger.error("Failed to void POS order");
            return fail({
              message: t("orderVoid.post.errors.server.title"),
              errorType: ErrorResponseTypes.INTERNAL_ERROR,
            });
          }

          return success({ result: updated });
        },
        { beforeTender: t("orderVoid.post.widget.tendered") },
      );
    } catch (error) {
      logger.error("Error voiding POS order", parseError(error));
      return fail({
        message: t("orderVoid.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
