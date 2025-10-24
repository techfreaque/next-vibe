import { translations as destroyTranslations } from "../../destroy/i18n/en";
import { translations as startTranslations } from "../../start/i18n/en";
import { translations as statusTranslations } from "../../status/i18n/en";
import { translations as stopTranslations } from "../../stop/i18n/en";

export const translations = {
  category: "System Guard",
  destroy: destroyTranslations,
  start: startTranslations,
  status: statusTranslations,
  stop: stopTranslations,
  operations: {
    create: "Create",
    setup: "Setup",
    start: "Start",
    stop: "Stop",
    destroy: "Destroy",
    status: "Status",
    list: "List",
  },
  security: {
    minimal: "Minimal Security",
    standard: "Standard Security",
    strict: "Strict Security",
    maximum: "Maximum Security",
  },
  userTypes: {
    projectUser: "Project User",
    restrictedUser: "Restricted User",
    chrootUser: "Chroot User",
  },
  statusValues: {
    created: "Created",
    running: "Running",
    stopped: "Stopped",
    error: "Error",
    destroyed: "Destroyed",
  },
  isolation: {
    rbash: "Restricted Bash (rbash)",
    chroot: "Chroot",
    bubblewrap: "Bubblewrap",
    firejail: "Firejail",
  },
};
