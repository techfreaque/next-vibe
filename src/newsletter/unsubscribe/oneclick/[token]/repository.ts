/**
 * Newsletter One-Click Unsubscribe Repository (RFC 8058)
 * Verifies the signed token, then reuses the regular unsubscribe flow
 * (suppression record + lead status + lifecycle journey exit). Idempotent.
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { NewsletterUnsubscribeT } from "../../i18n";
import { NewsletterUnsubscribeRepository } from "../../repository";
import { verifyUnsubscribeToken } from "../token";
import type {
  NewsletterOneClickPostResponseOutput,
  NewsletterOneClickPostUrlPathParams,
} from "./definition";

export class NewsletterOneClickRepository {
  static async unsubscribe(
    urlPathParams: NewsletterOneClickPostUrlPathParams,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: NewsletterUnsubscribeT,
  ): Promise<ResponseType<NewsletterOneClickPostResponseOutput>> {
    const email = verifyUnsubscribeToken(urlPathParams.token);
    if (!email) {
      logger.warn("One-click unsubscribe rejected: invalid token");
      return fail({
        message: t("oneClick.post.errors.invalidToken.description"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
      });
    }

    const result = await NewsletterUnsubscribeRepository.unsubscribe(
      { email },
      user,
      locale,
      logger,
      t,
    );
    if (!result.success) {
      return result;
    }
    return success({ success: true, message: t("response.success") });
  }
}
