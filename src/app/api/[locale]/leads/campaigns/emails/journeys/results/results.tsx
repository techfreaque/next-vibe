/**
 * Results Journey Email Templates - REDESIGNED
 * Complete redesign with pricing integration and new content structure
 *
 * This file has been refactored into separate template files for better maintainability.
 * Each email template is now in its own file under the templates/ directory.
 */

import { EmailCampaignStage } from "../../../../enum";
import type { JourneyTemplateMap } from "../../types";
// import { resultsFollowup1Email } from "./templates/followup-1";
// import { resultsFollowup2Email } from "./templates/followup-2";
// import { resultsFollowup3Email } from "./templates/followup-3";
// Import individual email templates
import { resultsInitialEmail } from "./templates/initial-contact.email";
// import { resultsNurtureEmail } from "./templates/nurture";
// import { resultsReactivationEmail } from "./templates/reactivation";

/**
 * Results Journey Template Map - REDESIGNED
 * Complete redesign with pricing integration and new content structure
 */
export const resultsJourneyTemplates: JourneyTemplateMap = {
  [EmailCampaignStage.INITIAL]: resultsInitialEmail,
  // [EmailCampaignStage.FOLLOWUP_1]: resultsFollowup1Email,
  // [EmailCampaignStage.FOLLOWUP_2]: resultsFollowup2Email,
  // [EmailCampaignStage.FOLLOWUP_3]: resultsFollowup3Email,
  // [EmailCampaignStage.NURTURE]: resultsNurtureEmail,
  // [EmailCampaignStage.REACTIVATION]: resultsReactivationEmail,
};
