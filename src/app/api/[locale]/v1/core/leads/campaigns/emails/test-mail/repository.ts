/**
 * Test Email Repository
 * Business logic for sending test emails with custom lead data
 */

import "server-only";

import { render } from "@react-email/render";

import { contactClientRepository } from "@/app/api/[locale]/v1/core/contact/repository-client";
import { CampaignType } from "@/app/api/[locale]/v1/core/emails/smtp-client/enum";
import {
  smtpClientService,
  type SmtpSendResult,
} from "@/app/api/[locale]/v1/core/emails/smtp-client/service";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import { env } from "@/config/env";
import { parseError } from "next-vibe/shared/utils";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import type { CountryLanguage } from "@/i18n/core/config";
import { Countries, Languages } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { emailService } from "../index";
import type { TestEmailRequestType, TestEmailResponseType } from "./definition";

/**
 * Test Email Repository Class
 * Handles all business logic for test email functionality
 */
class TestEmailRepository {
  /**
   * Send a test email with custom lead data
   * Now uses the same email infrastructure as regular campaigns
   */
  async sendTestEmail(
    data: TestEmailRequestType,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<TestEmailResponseType>> {
    try {
      logger.info("test.email.send.start", {
        emailJourneyVariant: data.emailJourneyVariant,
        emailCampaignStage: data.emailCampaignStage,
        testEmail: data.testEmail,
        userId: user.id,
      });

      // Use the locale from the form data (leadData.country and leadData.language)
      // instead of the user's current locale from the URL
      const emailLocale: CountryLanguage = `${data.leadData.language}-${data.leadData.country}`;
      const { t } = simpleT(emailLocale);

      // Validate that the email template exists
      if (!data.emailJourneyVariant || !data.emailCampaignStage) {
        return createErrorResponse(
          "leadsErrors.leads.get.error.validation.title",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      if (
        !emailService.hasTemplate(
          data.emailJourneyVariant,
          data.emailCampaignStage,
        )
      ) {
        return createErrorResponse(
          "leadsErrors.testEmail.error.templateNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
          {
            emailJourneyVariant: data.emailJourneyVariant,
            emailCampaignStage: data.emailCampaignStage,
          },
        );
      }

      // Create a mock lead object from the provided data
      // Ensure email is not null for testing
      if (!data.testEmail) {
        return createErrorResponse(
          "leadsErrors.testEmail.validation.testEmail.invalid",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      const mockLead = {
        id: "test-lead-id",
        email: data.testEmail, // Now guaranteed to be non-null
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
        currentCampaignStage: data.emailCampaignStage,
        emailJourneyVariant: data.emailJourneyVariant,
        emailsSent: 0,
        lastEmailSentAt: null,
        unsubscribedAt: null,
        emailsOpened: 0,
        emailsClicked: 0,
        lastEngagementAt: null,
        campaignStartedAt: null,
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        bouncedAt: null,
        invalidAt: null,
      };

      // Generate the email content using the email service
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
      );

      if (!emailContent) {
        return createErrorResponse(
          "leadsErrors.testEmail.error.templateNotFound.title",
          ErrorResponseTypes.NOT_FOUND,
          {
            emailJourneyVariant: data.emailJourneyVariant,
            emailCampaignStage: data.emailCampaignStage,
          },
        );
      }

      // Generate unsubscribe URL
      const unsubscribeUrl = `${env.NEXT_PUBLIC_APP_URL}/${emailLocale}/newsletter/unsubscribe/${encodeURIComponent(
        data.testEmail,
      )}`;

      // Build selection criteria from the form data (now single values)
      const selectionCriteria = {
        campaignType: data.campaignType || CampaignType.LEAD_CAMPAIGN,
        emailJourneyVariant: data.emailJourneyVariant,
        emailCampaignStage: data.emailCampaignStage,
        country: data.leadData.country || Countries.GLOBAL,
        language: data.leadData.language || Languages.EN,
      };

      // Use the new SMTP client service for test emails with selection criteria
      let emailResponse: ResponseType<SmtpSendResult>;
      try {
        // Render JSX to HTML for SMTP service
        const html = await render(emailContent.jsx);

        emailResponse = await smtpClientService.sendEmail({
          to: data.testEmail,
          toName: data.testEmail,
          subject: emailContent.subject,
          html,
          replyTo: contactClientRepository.getSupportEmail(emailLocale),
          unsubscribeUrl,
          senderName: t("common.appName"),
          selectionCriteria,
        });

        if (!emailResponse?.success) {
          logger.error("test.email.send.smtp.error", {
            to: data.testEmail,
            subject: emailContent.subject,
            error: emailResponse?.message,
            errorParams: emailResponse?.messageParams,
          });
          return createErrorResponse(
            "leadsErrors.testEmail.error.sendingFailed.title",
            ErrorResponseTypes.EMAIL_ERROR,
            {
              recipient: data.testEmail,
              subject: emailContent.subject,
              error:
                emailResponse?.message ||
                "leadsErrors.testEmail.error.sendingFailed.description",
            },
          );
        }
      } catch (error) {
        logger.error("test.email.send.error", error);
        return createErrorResponse(
          "leadsErrors.testEmail.error.sendingFailed.title",
          ErrorResponseTypes.EMAIL_ERROR,
          {
            recipient: data.testEmail,
            subject: emailContent.subject,
            error: parseError(error).message,
          },
        );
      }

      const sentAt = new Date();

      logger.info("test.email.send.success", {
        messageId: emailResponse?.data?.messageId || "unknown",
        testEmail: data.testEmail,
        subject: emailContent.subject,
        sentAt,
      });

      return createSuccessResponse({
        success: true,
        messageId: emailResponse?.data?.messageId || "unknown",
        testEmail: data.testEmail,
        subject: emailContent.subject,
        sentAt,
      });
    } catch (error) {
      logger.error("test.email.send.server.error", error);
      return createErrorResponse(
        "leadsErrors.testEmail.error.server.title",
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
