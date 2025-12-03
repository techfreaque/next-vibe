import { translations as destroyTranslations } from "../../destroy/i18n/pl";
import { translations as startTranslations } from "../../start/i18n/pl";
import { translations as statusTranslations } from "../../status/i18n/pl";
import { translations as stopTranslations } from "../../stop/i18n/pl";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Guard Systemu",
  destroy: destroyTranslations,
  start: startTranslations,
  status: statusTranslations,
  stop: stopTranslations,
  operations: {
    create: "Utwórz",
    setup: "Konfiguruj",
    start: "Uruchom",
    stop: "Zatrzymaj",
    destroy: "Zniszcz",
    status: "Status",
    list: "Lista",
  },
  security: {
    minimal: "Minimalne zabezpieczenie",
    standard: "Standardowe zabezpieczenie",
    strict: "Ścisłe zabezpieczenie",
    maximum: "Maksymalne zabezpieczenie",
  },
  userTypes: {
    projectUser: "Użytkownik projektu",
    restrictedUser: "Ograniczony użytkownik",
    chrootUser: "Użytkownik Chroot",
  },
  statusValues: {
    created: "Utworzono",
    running: "Działa",
    stopped: "Zatrzymano",
    error: "Błąd",
    destroyed: "Zniszczono",
  },
  isolation: {
    rbash: "Ograniczona Bash (rbash)",
    chroot: "Chroot",
    bubblewrap: "Bubblewrap",
    firejail: "Firejail",
  },
};
