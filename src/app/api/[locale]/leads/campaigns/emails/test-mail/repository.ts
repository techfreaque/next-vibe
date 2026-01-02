/**
 * Test Email Repository
 * Business logic for sending test emails with custom lead data
 */

import "server-only";

import { render } from "@react-email/render";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { contactClientRepository } from "@/app/api/[locale]/contact/repository-client";
import { CampaignType } from "@/app/api/[locale]/emails/smtp-client/enum";
import { SmtpSendingRepository } from "@/app/api/[locale]/emails/smtp-client/sending/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { LeadWithEmailType } from "../../../types";
import { emailService } from "../index";
import type { TestEmailRequestOutput, TestEmailResponseOutput } from "./definition";

/**
 * Test Email Repository Class
 * Handles all business logic for test email functionality
 */
export class TestEmailRepository {
  /**
   * Create a mock lead object for test email rendering
   * Centralized to ensure consistency across test email functionality
   */
  private static createMockLead(
    data: TestEmailRequestOutput,
    testEmail: string,
  ): LeadWithEmailType {
    return {
      id: "test-lead-id",
      email: testEmail,
      businessName: data.leadData.businessName,
      contactName: data.leadData.contactName || null,
      phone: null,
      website: data.leadData.website || null,
      country: data.leadData.country,
      language: data.leadData.language,
      status: data.leadData.status,
      source: data.leadData.source || null,
      notes: data.leadData.notes || null,
      convertedUserId: null,
      convertedAt: null,
      signedUpAt: null,
      consultationBookedAt: null,
      subscriptionConfirmedAt: null,
      currentCampaignStage: data.emailCampaignStage || null,
      emailsSent: 0,
      lastEmailSentAt: null,
      unsubscribedAt: null,
      emailsOpened: 0,
      emailsClicked: 0,
      lastEngagementAt: null,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  /**
   * Send a test email with custom lead data
   * Now uses the same email infrastructure as regular campaigns
   */
  static async sendTestEmail(
    data: TestEmailRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TestEmailResponseOutput>> {
    try {
      logger.info("test.email.send.start", {
        emailJourneyVariant: data.emailJourneyVariant,
        emailCampaignStage: data.emailCampaignStage,
        testEmail: data.testEmail,
        userId: user.id,
      });

      if (!emailService.hasTemplate(data.emailJourneyVariant, data.emailCampaignStage)) {
        return fail({
          message: "app.api.leads.campaigns.emails.testMail.post.errors.templateNotFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            emailJourneyVariant: data.emailJourneyVariant,
            emailCampaignStage: data.emailCampaignStage,
          },
        });
      }

      const mockLead = this.createMockLead(data, data.testEmail);
      const emailLocale: CountryLanguage = `${data.leadData.language}-${data.leadData.country}`;
      const { t } = simpleT(emailLocale);

      const emailContent = await emailService.renderEmail(
        mockLead,
        data.emailJourneyVariant,
        data.emailCampaignStage,
        {
          t,
          locale: emailLocale,
          companyName: t("config.appName"),
          companyEmail: contactClientRepository.getSupportEmail(emailLocale),
          campaignId: "test-campaign-id",
          baseUrl: env.NEXT_PUBLIC_APP_URL,
        },
        logger,
      );

      if (!emailContent) {
        return fail({
          message: "app.api.leads.campaigns.emails.testMail.post.errors.templateNotFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            emailJourneyVariant: data.emailJourneyVariant,
            emailCampaignStage: data.emailCampaignStage,
          },
        });
      }

      const unsubscribeUrl = `${env.NEXT_PUBLIC_APP_URL}/${emailLocale}/newsletter/unsubscribe/${encodeURIComponent(
        data.testEmail,
      )}`;

      const selectionCriteria = {
        campaignType: data.campaignType || CampaignType.LEAD_CAMPAIGN,
        emailJourneyVariant: data.emailJourneyVariant,
        emailCampaignStage: data.emailCampaignStage,
        country: data.leadData.country,
        language: data.leadData.language,
      };

      // Use SMTP sending repository for test emails
      try {
        // Render JSX to HTML for SMTP service
        const html = await render(emailContent.jsx);

        const emailResponse = await SmtpSendingRepository.sendEmail(
          {
            to: data.testEmail,
            toName: data.testEmail,
            subject: emailContent.subject,
            html,
            replyTo: contactClientRepository.getSupportEmail(emailLocale),
            unsubscribeUrl,
            senderName: t("config.appName"),
            selectionCriteria,
          },
          logger,
        );

        if (!emailResponse.success) {
          logger.error("test.email.send.smtp.error", {
            to: data.testEmail,
            subject: emailContent.subject,
            error: emailResponse.message,
            errorParams: emailResponse.messageParams,
          });
          return fail({
            message: "app.api.leads.campaigns.emails.testMail.post.errors.sendingFailed.title",
            errorType: ErrorResponseTypes.EMAIL_ERROR,
            messageParams: {
              recipient: data.testEmail,
              subject: emailContent.subject,
              error:
                emailResponse.message ||
                "app.api.leads.leadsErrors.testEmail.error.sendingFailed.description",
            },
            cause: emailResponse,
          });
        }

        // Email sent successfully - emailResponse.success is true
        const sentAt = new Date();

        // Extract messageId from SMTP response
        // The response structure is: { success: true, data: { messageId, accountId, ... } }
        const messageId: string = emailResponse.data?.messageId || "unknown-message-id";

        logger.info("test.email.send.success", {
          messageId,
          testEmail: data.testEmail,
          subject: emailContent.subject,
          sentAt: sentAt.toISOString(),
        });

        return success({
          result: {
            success: true,
            messageId,
            testEmail: data.testEmail,
            subject: emailContent.subject,
            sentAt,
          },
        });
      } catch (error) {
        logger.error("test.email.send.error", parseError(error));
        return fail({
          message: "app.api.leads.campaigns.emails.testMail.post.errors.sendingFailed.title",
          errorType: ErrorResponseTypes.EMAIL_ERROR,
          messageParams: {
            recipient: data.testEmail,
            subject: emailContent.subject,
            error: parseError(error).message,
          },
        });
      }
    } catch (error) {
      logger.error("test.email.send.server.error", parseError(error));
      return fail({
        message: "app.api.leads.campaigns.emails.testMail.post.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }
}
