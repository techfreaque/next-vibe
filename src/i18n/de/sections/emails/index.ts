import type { emailsTranslations as EnglishEmailsTranslations } from "../../../en/sections/emails";
import { adminTranslations } from "./admin";
import { exportTranslations } from "./export";
import { navTranslations } from "./nav";
import { paginationTranslations } from "./pagination";
import { statusTranslations } from "./status";
import { typesTranslations } from "./types";

export const emailsTranslations: typeof EnglishEmailsTranslations = {
  admin: adminTranslations,
  export: exportTranslations,
  nav: navTranslations,
  pagination: paginationTranslations,
  status: statusTranslations,
  types: typesTranslations,
  title: "E-Mails",
  description: "E-Mail-Kampagnen verwalten und überwachen",
};
