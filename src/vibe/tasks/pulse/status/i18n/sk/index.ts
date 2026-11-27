import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Stav Pulse",
  tags: {
    status: "Stav",
  },
  get: {
    title: "Stav Pulse",
    titleShort: "Stav Pulse",
    description: "Zobraziť stav monitorovania Pulse",
    container: {
      title: "Prevádzkový stav Pulse",
      description: "Sleduje stav a štatistiky spustení Pulse.",
    },
    widget: {
      refresh: "Obnoviť",
      noData: "Zatiaľ bez spustení",
    },
    fields: {
      status: {
        title: "Stav",
        label: "Stav Pulse",
        description: "Aktuálny stav Pulse",
      },
      lastPulseAt: {
        title: "Čas posledného spustenia Pulse",
        label: "Posledné spustenie Pulse",
        description: "Čas posledného spustenia Pulse",
      },
      successRate: {
        title: "Miera úspešnosti",
        label: "Miera úspešnosti",
        description: "Podiel úspešných spustení Pulse v percentách",
      },
      totalExecutions: {
        title: "Celkový počet spustení",
        label: "Celkový počet spustení",
        description: "Celkový počet spustení Pulse",
      },
    },
    examples: {
      basic: {
        title: "Základná požiadavka na stav",
      },
      success: {
        title: "Úspešná odpoveď na požiadavku o stav",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      internal: {
        title: "Interná chyba",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      network: {
        title: "Chyba siete",
        description: "Nastala chyba siete",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Prístup zakázaný",
      },
      notFound: {
        title: "Nenájdené",
        description: "Zdroj sa nenašiel.",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      unsaved: {
        title: "Neuložené zmeny",
        description: "Sú tu neuložené zmeny.",
      },
      validation: {
        title: "Chyba overenia",
        description: "Neplatné parametre požiadavky",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia sa úspešne dokončila",
    },
  },
};
