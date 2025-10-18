import type { translations as enTranslations } from "../../en/usersErrors";
import { translations as usersTranslations } from "./users";
import { translations as validationTranslations } from "./validation";

export const translations: typeof enTranslations = {
  users: usersTranslations,
  validation: validationTranslations,
};
