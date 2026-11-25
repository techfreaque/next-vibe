/**
 * Messages Sent - Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { MessageType } from "../../messages/enum";
import { scopedTranslation } from "./i18n";

/** Which kind of message to count: all of them, or one message type. */
export const {
  enum: SentMessageTypeFilter,
  options: SentMessageTypeFilterOptions,
  Value: SentMessageTypeFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.messageType.all",
  SYSTEM: "enums.messageType.system",
  TRANSACTIONAL: "enums.messageType.transactional",
  NOTIFICATION: "enums.messageType.notification",
  MARKETING: "enums.messageType.marketing",
  LEAD_CAMPAIGN: "enums.messageType.leadCampaign",
  USER_COMMUNICATION: "enums.messageType.userCommunication",
});

export const SentMessageTypeFilterDB = [
  SentMessageTypeFilter.ALL,
  SentMessageTypeFilter.SYSTEM,
  SentMessageTypeFilter.TRANSACTIONAL,
  SentMessageTypeFilter.NOTIFICATION,
  SentMessageTypeFilter.MARKETING,
  SentMessageTypeFilter.LEAD_CAMPAIGN,
  SentMessageTypeFilter.USER_COMMUNICATION,
] as const;

/** Stored `emails.type` per filter (null = no filter). */
export const SENT_MESSAGE_TYPE: Record<
  typeof SentMessageTypeFilterValue,
  (typeof MessageType)[keyof typeof MessageType] | null
> = {
  [SentMessageTypeFilter.ALL]: null,
  [SentMessageTypeFilter.SYSTEM]: MessageType.SYSTEM,
  [SentMessageTypeFilter.TRANSACTIONAL]: MessageType.TRANSACTIONAL,
  [SentMessageTypeFilter.NOTIFICATION]: MessageType.NOTIFICATION,
  [SentMessageTypeFilter.MARKETING]: MessageType.MARKETING,
  [SentMessageTypeFilter.LEAD_CAMPAIGN]: MessageType.LEAD_CAMPAIGN,
  [SentMessageTypeFilter.USER_COMMUNICATION]: MessageType.USER_COMMUNICATION,
};
