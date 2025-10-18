import type { translations as EnglishListTranslations } from "../../en/subscriptions/list";

export const translations: typeof EnglishListTranslations = {
  title: "Alle Abonnements",
  description: "Alle Benutzerabonnements im System durchsuchen und verwalten",
  empty: {
    title: "Keine Abonnements gefunden",
    description:
      "Keine Abonnements entsprechen Ihren aktuellen Filtern. Versuchen Sie, Ihre Suchkriterien anzupassen.",
  },
  table: {
    headers: {
      user: "Benutzer",
      plan: "Plan",
      status: "Status",
      billingInterval: "Abrechnung",
      currentPeriod: "Aktuelle Periode",
      nextBilling: "Nächste Abrechnung",
      createdAt: "Erstellt",
      actions: "Aktionen",
    },
  },
  filters: {
    search: {
      placeholder: "Abonnements nach Benutzer oder Plan suchen...",
    },
    status: {
      label: "Status",
      all: "Alle Status",
      incomplete: "Unvollständig",
      incompleteExpired: "Unvollständig abgelaufen",
      trialing: "Testphase",
      active: "Aktiv",
      pastDue: "Überfällig",
      canceled: "Gekündigt",
      unpaid: "Unbezahlt",
      paused: "Pausiert",
    },
    plan: {
      label: "Plan",
      all: "Alle Pläne",
      starter: "Starter",
      professional: "Professional",
      premium: "Premium",
      enterprise: "Enterprise",
    },
    billingInterval: {
      label: "Abrechnungsintervall",
      all: "Alle Intervalle",
      monthly: "Monatlich",
      yearly: "Jährlich",
    },
    sortBy: {
      label: "Sortieren nach",
      createdAt: "Erstellungsdatum",
      updatedAt: "Aktualisierungsdatum",
      currentPeriodStart: "Periodenbeginn",
      currentPeriodEnd: "Periodenende",
    },
    sortOrder: {
      label: "Reihenfolge",
      asc: "Aufsteigend",
      desc: "Absteigend",
    },
  },
  pagination: {
    showing: "Zeige {{start}} bis {{end}} von {{total}} Abonnements",
    page: "Seite {{current}} von {{total}}",
  },
};
