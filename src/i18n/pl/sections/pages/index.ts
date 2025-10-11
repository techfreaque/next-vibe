import type { pagesTranslations as EnglishPagesTranslations } from "../../../en/sections/pages";
import { aboutTranslations } from "./about";
import { aboutUsTranslations } from "./aboutUs";
import { blogTranslations } from "./blog";
import { careersTranslations } from "./careers";
import { errorTranslations } from "./error";
import { helpTranslations } from "./help";
import { homeTranslations } from "./home";
import { imprintTranslations } from "./imprint";
import { notFoundTranslations } from "./notFound";
import { onsiteServicesTranslations } from "./onsiteServices";
import { privacyPolicyTranslations } from "./privacyPolicy";
import { termsOfServiceTranslations } from "./termsOfService";

export const pagesTranslations: typeof EnglishPagesTranslations = {
  about: aboutTranslations,
  aboutUs: aboutUsTranslations,
  blog: blogTranslations,
  careers: careersTranslations,
  error: errorTranslations,
  help: helpTranslations,
  home: homeTranslations,
  imprint: imprintTranslations,
  notFound: notFoundTranslations,
  onsiteServices: onsiteServicesTranslations,
  privacyPolicy: privacyPolicyTranslations,
  termsOfService: termsOfServiceTranslations,
};
