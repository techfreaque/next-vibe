/**
 * Test Email Repository
 * Business logic for sending test emails with custom lead data
 */

import "server-only";

import { render } from "@react-email/render";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { CampaignType } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import { smtpSendingRepository } from "@/app/api/[locale]/v1/core/emails/smtp-client/sending/repository";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import type { LeadWithEmailType } from "../../../definition";
import { emailService } from "../index";
import type {
  TestEmailRequestOutput,
  TestEmailResponseOutput,
} from "./definition";

/**
 * Test Email Repository Class
 * Handles all business logic for test email functionality
 */
class TestEmailRepository {
  /**
   * Create a mock lead object for test email rendering
   * Centralized to ensure consistency across test email functionality
   */
  private createMockLead(
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
  async sendTestEmail(
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

      if (
        !emailService.hasTemplate(
          data.emailJourneyVariant,
          data.emailCampaignStage,
        )
      ) {
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.templateNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
          {
            emailJourneyVariant: data.emailJourneyVariant,
            emailCampaignStage: data.emailCampaignStage,
          },
        );
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
          companyName: t("app.appName"),
          companyEmail: contactClientRepository.getSupportEmail(emailLocale),
          campaignId: "test-campaign-id",
          baseUrl: env.NEXT_PUBLIC_APP_URL,
        },
        logger,
      );

      if (!emailContent) {
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.templateNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
          {
            emailJourneyVariant: data.emailJourneyVariant,
            emailCampaignStage: data.emailCampaignStage,
          },
        );
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

        const emailResponse = await smtpSendingRepository.sendEmail(
          {
            to: data.testEmail,
            toName: data.testEmail,
            subject: emailContent.subject,
            html,
            replyTo: contactClientRepository.getSupportEmail(emailLocale),
            unsubscribeUrl,
            senderName: t("app.common.appName"),
            selectionCriteria,
          },
          user,
          emailLocale,
          logger,
        );

        if (!emailResponse.success) {
          logger.error("test.email.send.smtp.error", {
            to: data.testEmail,
            subject: emailContent.subject,
            error: emailResponse.message,
            errorParams: emailResponse.messageParams,
          });
          return createErrorResponse(
            "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.sendingFailed.title",
            ErrorResponseTypes.EMAIL_ERROR,
            {
              recipient: data.testEmail,
              subject: emailContent.subject,
              error:
                emailResponse.message ||
                "app.api.v1.core.leads.leadsErrors.testEmail.error.sendingFailed.description",
            },
          );
        }

        // Email sent successfully - emailResponse.success is true
        const sentAt = new Date();

        // Extract messageId from SMTP response
        // The response structure is: { success: true, data: { messageId, accountId, ... } }
        const messageId: string =
          emailResponse.data?.messageId || "unknown-message-id";

        logger.info("test.email.send.success", {
          messageId,
          testEmail: data.testEmail,
          subject: emailContent.subject,
          sentAt: sentAt.toISOString(),
        });

        return createSuccessResponse({
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
        return createErrorResponse(
          "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.sendingFailed.title",
          ErrorResponseTypes.EMAIL_ERROR,
          {
            recipient: data.testEmail,
            subject: emailContent.subject,
            error: parseError(error).message,
          },
        );
      }
    } catch (error) {
      logger.error("test.email.send.server.error", parseError(error));
      return createErrorResponse(
        "app.api.v1.core.leads.campaigns.emails.testMail.post.errors.server.title",
        ErrorResponseTypes.INTERNAL_ERROR,
        { error: parseError(error).message },
      );
    }
  }
}

/**
 * Export singleton instance
 */
export const testEmailRepository = new TestEmailRepository();
