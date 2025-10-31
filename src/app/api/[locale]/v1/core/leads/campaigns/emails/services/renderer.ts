/**
 * Email Renderer Service
 * Handles email template rendering and journey management
 */

import "server-only";

import { parseError } from "next-vibe/shared/utils";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import { env } from "@/config/env";
import type { Countries, CountryLanguage, Languages } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import { createTrackingContext } from "../../../../emails/smtp-client/components/tracking_context";
import {
  EmailCampaignStage,
  EmailJourneyVariant,
  LeadSource,
  LeadStatus,
} from "../../../enum";
import type { LeadWithEmailType } from "../../../types";
import { personalJourneyTemplates } from "../journeys/personal";
import { personalPracticalJourneyTemplates } from "../journeys/personal-results";
import { resultsJourneyTemplates } from "../journeys/results/results";
import type {
  EmailTemplateData,
  EmailTemplateFunction,
  EmailTemplateResult,
  JourneyTemplateMap,
} from "../types";

/**
 * No-op logger for preview contexts where logging is not needed
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
const createNoOpLogger = (): EndpointLogger => ({
  // No-op functions intentionally empty for preview context
  info: (): void => {
    // No-op
  },
  error: (): void => {
    // No-op
  },
  warn: (): void => {
    // No-op
  },
  debug: (): void => {
    // No-op
  },
  vibe: (): void => {
    // No-op
  },
  isDebugEnabled: false,
});

// Email preview cache to prevent excessive re-rendering
interface PreviewCacheEntry {
  result: EmailTemplateResult;
  timestamp: number;
}

interface PreviewCacheKey {
  journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant];
  stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage];
  locale: CountryLanguage;
}

class EmailPreviewCache {
  private cache = new Map<string, PreviewCacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(key: PreviewCacheKey): string {
    return `${key.journeyVariant}:${key.stage}:${key.locale}`;
  }

  get(key: PreviewCacheKey): EmailTemplateResult | null {
    const cacheKey = this.getCacheKey(key);
    const entry = this.cache.get(cacheKey);

    if (!entry) {
      return null;
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.result;
  }

  set(key: PreviewCacheKey, result: EmailTemplateResult): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; ttl: number } {
    return {
      size: this.cache.size,
      ttl: this.TTL,
    };
  }
}

// Global preview cache instance
const previewCache = new EmailPreviewCache();

// Cleanup expired cache entries every 10 minutes
setInterval(
  () => {
    previewCache.cleanup();
  },
  10 * 60 * 1000,
);

/**
 * Journey Template Registry
 * Maps journey variants to their template functions
 */
const JOURNEY_TEMPLATES: Record<
  (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
  JourneyTemplateMap
> = {
  [EmailJourneyVariant.PERSONAL_APPROACH]: personalJourneyTemplates,
  [EmailJourneyVariant.RESULTS_FOCUSED]: resultsJourneyTemplates,
  [EmailJourneyVariant.PERSONAL_RESULTS]: personalPracticalJourneyTemplates,
};

/**
 * Email Renderer Service Class
 */
export class EmailRendererService {
  /**
   * Render an email template for a specific journey and stage
   */
  async renderEmail(
    lead: LeadWithEmailType,
    journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
    stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
    context: {
      t: TFunction;
      locale: CountryLanguage;
      companyName: string;
      companyEmail: string;
      campaignId: string;
      unsubscribeUrl: string;
      trackingUrl: string;
    },
    logger: EndpointLogger,
  ): Promise<EmailTemplateResult | null> {
    try {
      logger.info("email.render.start", {
        leadId: lead.id,
        journeyVariant,
        stage,
        locale: context.locale,
      });

      // Ensure lead has an email address for email operations
      if (!lead.email) {
        logger.error("email.render.no.email", {
          leadId: lead.id,
          journeyVariant,
          stage,
        });
        return null;
      }

      // Create a lead with guaranteed email for template data
      const leadWithEmail: EmailTemplateData["lead"] = {
        ...lead,
        email: lead.email, // TypeScript now knows this is not null
      };

      // Get the template function for this journey and stage
      const templateFunction = this.getTemplateFunction(journeyVariant, stage);
      if (!templateFunction) {
        logger.error("email.render.template.not.found", {
          journeyVariant,
          stage,
        });
        return null;
      }

      // Prepare template data
      const templateData: EmailTemplateData = {
        lead: leadWithEmail,
        unsubscribeUrl: context.unsubscribeUrl,
        trackingUrl: context.trackingUrl,
        companyName: context.companyName,
        companyEmail: context.companyEmail,
        campaign: {
          id: context.campaignId,
          stage,
          journeyVariant,
        },
      };

      // Create tracking context for this email
      const tracking = createTrackingContext(
        context.locale,
        lead.id,
        lead.convertedUserId || undefined,
        context.campaignId,
      );

      // Ensure we have a valid tracking context
      if (!tracking) {
        logger.error("email.render.tracking.context.failed", {
          leadId: lead.id,
          locale: context.locale,
        });
        return null;
      }

      // Render the email
      const result = await templateFunction({
        data: templateData,
        t: context.t,
        locale: context.locale,
        tracking,
      });

      // Email template rendered with built-in tracking components
      // No HTML manipulation needed - tracking is built into React components
      return result;
    } catch (error) {
      logger.error("email.render.error", parseError(error), {
        leadId: lead.id,
        journeyVariant,
        stage,
      });
      return null;
    }
  }

  /**
   * Get template function for a specific journey and stage
   */
  private getTemplateFunction(
    journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
    stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
  ): EmailTemplateFunction | null {
    const journeyTemplates = JOURNEY_TEMPLATES[journeyVariant];
    if (!journeyTemplates) {
      return null;
    }

    const templateFunction = journeyTemplates[stage];
    if (!templateFunction) {
      return null;
    }

    return templateFunction;
  }

  /**
   * Get available stages for a journey variant
   */
  getAvailableStages(
    journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
  ): Array<(typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]> {
    const journeyTemplates = JOURNEY_TEMPLATES[journeyVariant];
    if (!journeyTemplates) {
      return [];
    }

    return Object.keys(journeyTemplates) as Array<
      (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]
    >;
  }

  /**
   * Check if a template exists for a journey and stage
   */
  hasTemplate(
    journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
    stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
  ): boolean {
    return this.getTemplateFunction(journeyVariant, stage) !== null;
  }

  /**
   * Get all available journey variants
   */
  getAvailableJourneys(): Array<
    (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant]
  > {
    return Object.keys(JOURNEY_TEMPLATES) as Array<
      (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant]
    >;
  }

  /**
   * Get journey information
   */
  getJourneyInfo(
    journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
    t: TFunction,
  ): {
    name: string;
    description: string;
    availableStages: Array<
      (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage]
    >;
  } {
    const journeyInfo = {
      [EmailJourneyVariant.PERSONAL_APPROACH]: {
        name: t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.journeyInfo.personalApproach.name",
        ),
        description: t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.journeyInfo.personalApproach.description",
        ),
      },
      [EmailJourneyVariant.RESULTS_FOCUSED]: {
        name: t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.journeyInfo.resultsFocused.name",
        ),
        description: t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.journeyInfo.resultsFocused.description",
        ),
      },
      [EmailJourneyVariant.PERSONAL_RESULTS]: {
        name: t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.journeyInfo.personalResults.name",
        ),
        description: t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.journeyInfo.personalResults.description",
        ),
      },
    };

    return {
      ...journeyInfo[journeyVariant],
      availableStages: this.getAvailableStages(journeyVariant),
    };
  }

  /**
   * Generate preview of email template
   */
  async generatePreview(
    journeyVariant: (typeof EmailJourneyVariant)[keyof typeof EmailJourneyVariant],
    stage: (typeof EmailCampaignStage)[keyof typeof EmailCampaignStage],
    context: {
      t: TFunction;
      locale: CountryLanguage;
      companyName: string;
      companyEmail: string;
    },
  ): Promise<EmailTemplateResult | null> {
    const [country, language] = context.locale.split("-") as [
      Countries,
      Languages,
    ];
    // Create mock lead data for preview
    const mockLead: LeadWithEmailType = {
      id: context.t(
        "app.api.v1.core.leads.campaigns.emails.journeys.components.defaults.previewLeadId",
      ),
      email: context.t(
        "app.api.v1.core.leads.campaigns.emails.journeys.components.defaults.previewEmail",
      ),
      businessName: context.t(
        "app.api.v1.core.leads.campaigns.emails.journeys.components.defaults.previewBusinessName",
      ),
      contactName: context.t(
        "app.api.v1.core.leads.campaigns.emails.journeys.components.defaults.previewContactName",
      ),
      phone: context.t(
        "app.api.v1.core.leads.campaigns.emails.journeys.components.defaults.previewPhone",
      ),
      website: env.NEXT_PUBLIC_APP_URL,
      country: country,
      language: language,
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE, // Default source for preview
      notes: "",
      convertedUserId: null,
      convertedAt: null,
      signedUpAt: null,
      consultationBookedAt: null,
      subscriptionConfirmedAt: null,
      currentCampaignStage: EmailCampaignStage.INITIAL,
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

    // Check cache first
    const cachedResult = previewCache.get({
      journeyVariant,
      stage,
      locale: context.locale,
    });
    if (cachedResult) {
      return cachedResult;
    }

    const result = await this.renderEmail(
      mockLead,
      journeyVariant,
      stage,
      {
        ...context,
        campaignId: context.t(
          "app.api.v1.core.leads.campaigns.emails.journeys.components.defaults.previewCampaignId",
        ),
        unsubscribeUrl: `${env.NEXT_PUBLIC_APP_URL}/unsubscribe?preview=true`,
        trackingUrl: `${env.NEXT_PUBLIC_APP_URL}/track?preview=true`,
      },
      createNoOpLogger(),
    );

    // Cache the result
    if (result) {
      previewCache.set(
        {
          journeyVariant,
          stage,
          locale: context.locale,
        },
        result,
      );
    }

    return result;
  }

  /**
   * Clear the email preview cache
   * Useful for development or when email templates are updated
   */
  clearPreviewCache(): void {
    previewCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    ttl: number;
  } {
    return previewCache.getStats();
  }
}

/**
 * Default Email Renderer Service Instance
 */
export const emailRendererService = new EmailRendererService();
