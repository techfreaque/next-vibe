import type { userMeTranslations as EnglishUserMeTranslations } from "../../../../en/sections/authErrors/userMe";
import { deleteTranslations } from "./delete";
import { formTranslations } from "./form";
import { getTranslations } from "./get";

export const userMeTranslations: typeof EnglishUserMeTranslations = {
  delete: deleteTranslations,
  form: formTranslations,
  get: getTranslations,
};
