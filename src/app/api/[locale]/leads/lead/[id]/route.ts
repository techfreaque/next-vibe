/**
 * Individual Lead API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { leadsRepository } from "../../repository";
import type { LeadUpdateType } from "../../types";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ urlPathParams, logger }) => {
      return await leadsRepository.getLeadById(urlPathParams.id, logger);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlPathParams, data, logger }) => {
      const leadId = urlPathParams.id;
      // Flatten nested update structure to match repository's flat LeadUpdateType
      const {
        basicInfo,
        contactDetails,
        campaignManagement,
        additionalDetails,
      } = data.updates;
      const updateData: Partial<LeadUpdateType> = {
        email: basicInfo.email,
        businessName: basicInfo.businessName,
        contactName: basicInfo.contactName,
        status: basicInfo.status,
        phone: contactDetails.phone,
        website: contactDetails.website,
        country: contactDetails.country,
        language: contactDetails.language,
        currentCampaignStage: campaignManagement.currentCampaignStage,
        source: campaignManagement.source,
        notes: additionalDetails.notes,
        consultationBookedAt: additionalDetails.consultationBookedAt,
        subscriptionConfirmedAt: additionalDetails.subscriptionConfirmedAt,
        metadata: additionalDetails.metadata,
      };
      return await leadsRepository.updateLead(leadId, updateData, logger);
    },
  },
});
