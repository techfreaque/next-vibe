import type { socialTranslations as EnglishSocialTranslations } from "../../../en/sections/social";
import { availableTranslations } from "./available";
import { connectedTranslations } from "./connected";
import { dialogTranslations } from "./dialog";
import { emptyTranslations } from "./empty";
import { errorTranslations } from "./error";
import { formTranslations } from "./form";
import { statsTranslations } from "./stats";
import { successTranslations } from "./success";
import { validationTranslations } from "./validation";

export const socialTranslations: typeof EnglishSocialTranslations = {
  available: availableTranslations,
  connected: connectedTranslations,
  dialog: dialogTranslations,
  empty: emptyTranslations,
  error: errorTranslations,
  form: formTranslations,
  stats: statsTranslations,
  success: successTranslations,
  validation: validationTranslations,
  title: "Platformy Mediów Społecznościowych",
  description: "Zarządzaj swoimi połączonymi kontami mediów społecznościowych",
  addPlatform: "Dodaj Platformę",
  addFirstPlatform: "Dodaj Swoją Pierwszą Platformę",
  connect: "Połącz",
};
