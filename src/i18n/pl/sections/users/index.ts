import type { usersTranslations as EnglishUsersTranslations } from "../../../en/sections/users";
import { adminTranslations } from "./admin";
import { contactMethodsTranslations } from "./contactMethods";
import { createTranslations } from "./create";
import { errorsTranslations } from "./errors";
import { fieldsTranslations } from "./fields";
import { formTranslations } from "./form";
import { listTranslations } from "./list";
import { listApiTranslations } from "./listApi";
import { messagesTranslations } from "./messages";
import { roleTranslations } from "./role";
import { rolesTranslations } from "./roles";
import { searchTranslations } from "./search";
import { sortTranslations } from "./sort";
import { sortOrderTranslations } from "./sort_order";
import { statsTranslations } from "./stats";
import { statusTranslations } from "./status";
import { userTranslations } from "./user";

export const usersTranslations: typeof EnglishUsersTranslations = {
  admin: adminTranslations,
  contactMethods: contactMethodsTranslations,
  create: createTranslations,
  errors: errorsTranslations,
  fields: fieldsTranslations,
  form: formTranslations,
  list: listTranslations,
  listApi: listApiTranslations,
  messages: messagesTranslations,
  role: roleTranslations,
  roles: rolesTranslations,
  search: searchTranslations,
  sort: sortTranslations,
  sort_order: sortOrderTranslations,
  stats: statsTranslations,
  status: statusTranslations,
  user: userTranslations,
  theme: {
    light: "Jasny",
    dark: "Ciemny",
    system: "Systemowy",
  },
  profileVisibility: {
    public: "Publiczny",
    private: "Prywatny",
    contactsOnly: "Tylko kontakty",
  },
};
