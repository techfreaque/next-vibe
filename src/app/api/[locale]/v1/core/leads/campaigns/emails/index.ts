/**
 * Lead Email System
 * Main entry point for the email system
 */

import { type CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  EmailCampaignStage,
  EmailCampaignStageValues,
  EmailJourneyVariant,
} from "../../enum";
import { leadTrackingRepository } from "../../tracking/repository";
import { abTestingService } from "./services/ab-testing";
import { emailRendererService } from "./services/renderer";
import { campaignSchedulerService } from "./services/scheduler";
import type { EmailTemplateResult } from "./types";
import type { LeadWithEmailType } from "../../definition";

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
    journeyVariant: EmailJourneyVariant,
    stage: EmailCampaignStage,
    context: {
      t: TFunction;
      locale: CountryLanguage;
      companyName: string;
      companyEmail: string;
      campaignId: string;
      baseUrl: string;
    },
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
      );
    } catch (error) {
      console.error("Error rendering email", error, {
        leadId: lead.id,
        journeyVariant,
        stage,
      });
      return null;
    }
  }

  /**
   * Assign journey variant using A/B testing
   */
  assignJourneyVariant(
    leadId: string,
    leadData?: {
      country?: string;
      source?: string;
      businessType?: string;
    },
  ): EmailJourneyVariant {
    return abTestingService.assignJourneyVariant(leadId, leadData);
  }

  /**
   * Get available journey variants
   */
  getAvailableJourneys(): EmailJourneyVariant[] {
    return emailRendererService.getAvailableJourneys();
  }

  /**
   * Get journey information
   */
  getJourneyInfo(
    journeyVariant: EmailJourneyVariant,
    t: TFunction,
  ): {
    name: string;
    description: string;
    availableStages: EmailCampaignStage[];
  } {
    return emailRendererService.getJourneyInfo(journeyVariant, t);
  }

  /**
   * Generate email preview
   */
  async generatePreview(
    journeyVariant: EmailJourneyVariant,
    stage: EmailCampaignStage,
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
    journeyVariant: EmailJourneyVariant,
    stage: EmailCampaignStage,
  ): boolean {
    return emailRendererService.hasTemplate(journeyVariant, stage);
  }

  /**
   * Get available stages for a journey
   */
  getAvailableStages(
    journeyVariant: EmailJourneyVariant,
  ): (typeof EmailCampaignStageValues)[] {
    return emailRendererService.getAvailableStages(journeyVariant);
  }
}

/**
 * Default Email Service Instance
 */
export const emailService = new EmailService();

/**
 * Export all services for direct access if needed
 */
export { abTestingService, campaignSchedulerService, emailRendererService };

/**
 * Export types
 */
export type * from "./types";
