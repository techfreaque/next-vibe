import { translations as adminTranslations } from "./admin";
import { translations as contactMethodsTranslations } from "./contactMethods";
import { translations as createTranslations } from "./create";
import { translations as errorsTranslations } from "./errors";
import { translations as fieldsTranslations } from "./fields";
import { translations as formTranslations } from "./form";
import { translations as listTranslations } from "./list";
import { translations as listApiTranslations } from "./listApi";
import { translations as messagesTranslations } from "./messages";
import { translations as roleTranslations } from "./role";
import { translations as rolesTranslations } from "./roles";
import { translations as searchTranslations } from "./search";
import { translations as sortTranslations } from "./sort";
import { translations as sortOrderTranslations } from "./sort_order";
import { translations as statsTranslations } from "./stats";
import { translations as statusTranslations } from "./status";
import { translations as userTranslations } from "./user";

export const translations = {
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
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  profileVisibility: {
    public: "Public",
    private: "Private",
    contactsOnly: "Contacts Only",
  },
};
