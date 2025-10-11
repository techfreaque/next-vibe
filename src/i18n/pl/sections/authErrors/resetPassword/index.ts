import type { resetPasswordTranslations as EnglishResetPasswordTranslations } from "../../../../en/sections/authErrors/resetPassword";
import { confirmTranslations } from "./confirm";
import { requestTranslations } from "./request";
import { validateTranslations } from "./validate";

export const resetPasswordTranslations: typeof EnglishResetPasswordTranslations =
  {
    confirm: confirmTranslations,
    request: requestTranslations,
    validate: validateTranslations,
  };
