import type { calendarTranslations as EnglishCalendarTranslations } from "../../../../en/sections/common/calendar";
import { daysTranslations } from "./days";
import { monthsTranslations } from "./months";
import { slotTranslations } from "./slot";
import { statusTranslations } from "./status";
import { timezoneTranslations } from "./timezone";

export const calendarTranslations: typeof EnglishCalendarTranslations = {
  days: daysTranslations,
  months: monthsTranslations,
  slot: slotTranslations,
  status: statusTranslations,
  timezone: timezoneTranslations,
};
