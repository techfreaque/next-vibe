import { translations as listTranslations } from "../../list/i18n/en";
import { translations as syncTranslations } from "../../sync/i18n/en";

export const translations = {
  tag: "Folders",
  list: listTranslations,
  sync: syncTranslations,
  errors: {
    server: { title: "Server Error" },
    notFound: { title: "Folder Not Found" },
    accountNotFound: { title: "Account Not Found" },
    syncFailed: { title: "Sync Failed" },
    missingAccount: { title: "Account ID is required" },
  },
};
