/**
 * Lead Email System
 * Main entry point for the email system
 */

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { type CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type { LeadWithEmailType } from "../../definition";
import type { EmailCampaignStage, EmailJourneyVariant } from "../../enum";
import { leadTrackingRepository } from "../../tracking/repository";
import { abTestingService } from "./services/ab-testing";
import { emailRendererService } from "./services/renderer";
import { campaignSchedulerService } from "./services/scheduler";
import type { EmailTemplateResult } from "./types";

type EmailJourneyVariantValues =
  (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant];
type EmailCampaignStageValues =
  (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];

/**
 * Main Email Service Class
 * Orchestrates all email-related operations
 */
export class EmailService {
  /**
   * Render email for a specific lead and campaign stage
   */
  async renderEmail(
    lead: LeadWithEmailType,
    journeyVariant: EmailJourneyVariantValues,
    stage: EmailCampaignStageValues,
    context: {
      t: TFunction;
      locale: CountryLanguage;
      companyName: string;
      companyEmail: string;
      campaignId: string;
      baseUrl: string;
    },
    logger: EndpointLogger,
  ): Promise<EmailTemplateResult | null> {
    try {
      const trackingUrl = leadTrackingRepository.generateCampaignTrackingUrl(
        context.baseUrl,
        lead.id,
        context.campaignId,
        stage,
        undefined, // destinationUrl - use default
        context.locale, // Pass the locale from context
      );

      const unsubscribeUrl = this.generateUnsubscribeUrl(
        context.baseUrl,
        lead.id,
        lead.email,
        context.locale,
      );

      return await emailRendererService.renderEmail(
        lead,
        journeyVariant,
        stage,
        {
          ...context,
          trackingUrl,
          unsubscribeUrl,
        },
        logger,
      );
    } catch {
      return null;
    }
  }

  /**
   * Assign journey variant using A/B testing
   */
  assignJourneyVariant(
    leadId: string,
    logger: EndpointLogger,
    leadData?: {
      country?: string;
      source?: string;
      businessType?: string;
    },
  ): EmailJourneyVariantValues {
    return abTestingService.assignJourneyVariant(leadId, logger, leadData);
  }

  /**
   * Get available journey variants
   */
  getAvailableJourneys(): EmailJourneyVariantValues[] {
    return emailRendererService.getAvailableJourneys();
  }

  /**
   * Get journey information
   */
  getJourneyInfo(
    journeyVariant: EmailJourneyVariantValues,
    t: TFunction,
  ): {
    name: string;
    description: string;
    availableStages: EmailCampaignStageValues[];
  } {
    return emailRendererService.getJourneyInfo(journeyVariant, t);
  }

  /**
   * Generate email preview
   */
  async generatePreview(
    journeyVariant: EmailJourneyVariantValues,
    stage: EmailCampaignStageValues,
    context: {
      t: TFunction;
      locale: CountryLanguage;
      companyName: string;
      companyEmail: string;
    },
  ): Promise<EmailTemplateResult | null> {
    return await emailRendererService.generatePreview(
      journeyVariant,
      stage,
      context,
    );
  }

  /**
   * Generate unsubscribe URL
   * Uses the newsletter unsubscribe route which handles both newsletter and leads unsubscription
   */
  generateUnsubscribeUrl(
    baseUrl: string,
    leadId: string,
    email: string,
    locale: CountryLanguage,
  ): string {
    // Generate unsubscribe URL that points to newsletter unsubscribe page
    // This will handle both newsletter and leads unsubscription server-side
    const encodedEmail = encodeURIComponent(email);
    const params = new URLSearchParams({
      leadId,
    });
    // eslint-disable-next-line i18next/no-literal-string
    return `${baseUrl}/${locale}/newsletter/unsubscribe/${encodedEmail}?${params.toString()}`;
  }

  /**
   * Check if template exists for journey and stage
   */
  hasTemplate(
    journeyVariant: EmailJourneyVariantValues,
    stage: EmailCampaignStageValues,
  ): boolean {
    return emailRendererService.hasTemplate(journeyVariant, stage);
  }

  /**
   * Get available stages for a journey
   */
  getAvailableStages(
    journeyVariant: EmailJourneyVariantValues,
  ): EmailCampaignStageValues[] {
    return emailRendererService.getAvailableStages(journeyVariant);
  }
}

/**
 * Default Email Service Instance
 */
export const emailService = new EmailService();

/**
 * Export types
 */
export type * from "./types";

/**
 * Export all services for direct access if needed
 */
export { abTestingService, campaignSchedulerService, emailRendererService };
