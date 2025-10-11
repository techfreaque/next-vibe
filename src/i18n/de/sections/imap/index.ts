import type { imapTranslations as EnglishImapTranslations } from "../../../en/sections/imap";
import { accountTranslations } from "./account";
import { adminTranslations } from "./admin";
import { authTranslations } from "./auth";
import { commonTranslations } from "./common";
import { configTranslations } from "./config";
import { connectionTranslations } from "./connection";
import { dashboardTranslations } from "./dashboard";
import { folderTranslations } from "./folder";
import { formsTranslations } from "./forms";
import { imapErrorsTranslations } from "./imapErrors";
import { messageTranslations } from "./message";
import { messagesTranslations } from "./messages";
import { navTranslations } from "./nav";
import { syncTranslations } from "./sync";

export const imapTranslations: typeof EnglishImapTranslations = {
  account: accountTranslations,
  admin: adminTranslations,
  auth: authTranslations,
  common: commonTranslations,
  config: configTranslations,
  connection: connectionTranslations,
  dashboard: dashboardTranslations,
  folder: folderTranslations,
  forms: formsTranslations,
  imapErrors: imapErrorsTranslations,
  message: messageTranslations,
  messages: messagesTranslations,
  nav: navTranslations,
  sync: syncTranslations,
  title: "IMAP-Server-Verwaltung",
  description:
    "IMAP-Server-Konfiguration, Konten und E-Mail-Synchronisation verwalten",
  imap: "IMAP",
  imapServer: "IMAP-Server",
  imapAccount: "IMAP-Konto",
  imapAccounts: "IMAP-Konten",
  imapFolder: "IMAP-Ordner",
  imapFolders: "IMAP-Ordner",
  emailSync: "E-Mail-Synchronisation",
  emailSyncing: "E-Mail-Synchronisation",
};
