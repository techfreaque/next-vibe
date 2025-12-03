import { translations as destroyTranslations } from "../../destroy/i18n/de";
import { translations as startTranslations } from "../../start/i18n/de";
import { translations as statusTranslations } from "../../status/i18n/de";
import { translations as stopTranslations } from "../../stop/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "System Guard",
  destroy: destroyTranslations,
  start: startTranslations,
  status: statusTranslations,
  stop: stopTranslations,
  operations: {
    create: "Erstellen",
    setup: "Einrichten",
    start: "Starten",
    stop: "Stoppen",
    destroy: "Zerstören",
    status: "Status",
    list: "Liste",
  },
  security: {
    minimal: "Minimale Sicherheit",
    standard: "Standard-Sicherheit",
    strict: "Strenge Sicherheit",
    maximum: "Maximale Sicherheit",
  },
  userTypes: {
    projectUser: "Projektbenutzer",
    restrictedUser: "Eingeschränkter Benutzer",
    chrootUser: "Chroot-Benutzer",
  },
  statusValues: {
    created: "Erstellt",
    running: "Läuft",
    stopped: "Gestoppt",
    error: "Fehler",
    destroyed: "Zerstört",
  },
  isolation: {
    rbash: "Eingeschränkte Bash (rbash)",
    chroot: "Chroot",
    bubblewrap: "Bubblewrap",
    firejail: "Firejail",
  },
};
