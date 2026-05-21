import "server-only";

import React from "react";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import { CampaignType } from "@/app/api/[locale]/messenger/accounts/enum";
import { EmailSendingRepository } from "@/app/api/[locale]/messenger/providers/email/smtp-client/email-sending/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";

import { corvinaPurchaseInquiries } from "../db";
import type {
  PurchaseInquiryPostRequestInput,
  PurchaseInquiryPostResponseOutput,
} from "./definition";
import { PurchaseInquiryEmailContent } from "./email";
import type { PurchaseInquiryT } from "./i18n";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? "";

export class PurchaseInquiryRepository {
  static async create(
    data: PurchaseInquiryPostRequestInput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    t: PurchaseInquiryT,
  ): Promise<ResponseType<PurchaseInquiryPostResponseOutput>> {
    try {
      const [row] = await db
        .insert(corvinaPurchaseInquiries)
        .values({
          logicalId: data.logicalId,
          orgResourceId: data.orgResourceId,
          deviceLabel: data.deviceLabel ?? null,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone ?? null,
          message: data.inquiryMessage ?? null,
          requestedMonths: data.requestedMonths ?? null,
          status: "new",
        })
        .returning({ id: corvinaPurchaseInquiries.id });

      if (!row) {
        return fail({
          message: t("post.errors.server.description"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
      }

      const inquiryId = row.id;

      if (ADMIN_EMAIL) {
        const jsx = React.createElement(PurchaseInquiryEmailContent, {
          logicalId: data.logicalId,
          orgResourceId: data.orgResourceId,
          deviceLabel: data.deviceLabel,
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          message: data.inquiryMessage,
          requestedMonths: data.requestedMonths,
          inquiryId,
        });

        const emailResult = await EmailSendingRepository.sendEmail(
          {
            jsx,
            subject: `New license inquiry #${inquiryId}: ${data.logicalId}`,
            toEmail: ADMIN_EMAIL,
            toName: "Admin",
            locale,
            campaignType: CampaignType.TRANSACTIONAL,
            skipRateLimitCheck: true,
          },
          logger,
          locale,
        );

        if (!emailResult.success) {
          logger.warn(
            "Failed to send admin notification email for purchase inquiry",
            {
              inquiryId,
              error: emailResult.message,
            },
          );
        }
      }

      logger.info("Purchase inquiry created", {
        inquiryId,
        logicalId: data.logicalId,
      });

      return success({
        inquiryId,
        confirmationMessage: "We'll be in touch within 1 business day.",
      });
    } catch (error) {
      logger.error(
        "PurchaseInquiryRepository.create failed",
        parseError(error),
      );
      return fail({
        message: t("post.errors.server.description"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
