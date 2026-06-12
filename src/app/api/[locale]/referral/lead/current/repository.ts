import "server-only";

import { ReferralRepository } from "../../repository";

export const LeadCurrentReferralRepository = {
  getLatestLeadReferralWithLabel:
    ReferralRepository.getLatestLeadReferralWithLabel.bind(ReferralRepository),
};
