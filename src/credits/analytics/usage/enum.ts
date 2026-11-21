/**
 * Credit usage report filters.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Who spent the credits: signed-in accounts or anonymous guests (leads). */
export const {
  enum: UsageActor,
  options: UsageActorOptions,
  Value: UsageActorValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.actor.all",
  USERS: "enums.actor.users",
  GUESTS: "enums.actor.guests",
});

/** Which credits were spent: the monthly free allowance or pack credits. */
export const {
  enum: UsageCreditKind,
  options: UsageCreditKindOptions,
  Value: UsageCreditKindValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.creditKind.all",
  FREE: "enums.creditKind.free",
  PACK: "enums.creditKind.pack",
  PURCHASED: "enums.creditKind.purchased",
  SUBSCRIPTION: "enums.creditKind.subscription",
  GRANTS: "enums.creditKind.grants",
});
