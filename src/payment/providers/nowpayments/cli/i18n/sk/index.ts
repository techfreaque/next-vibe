import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "NOWPayments CLI",
    titleShort: "NOWPayments",
    description: "Štart Ngrok tunel pre NOWPayments webhook presmerovanie",
    category: "Platba",
    tags: {
      nowpayments: "NOWPayments",
      cli: "CLI",
      webhook: "Webhook",
    },
    form: {
      title: "Tunel výplat",
      description: "Spustiť Ngrok tunel prijímať NOWPayments webhooks lokálne",
      fields: {
        port: {
          label: "Port",
          description: "Lokálny port pre tunel (predvolene 3000)",
          placeholder: "3000",
        },
      },
    },
    errors: {
      notInstalled: {
        instructions:
          "Inštalácia ngrok:\n\n1. Otvorte https://ngrok.com/download\n2. Stiahnite ngrok pre svoj operačný systém.\n3. Rozbaľte súbor a presuňte ho do priečinka v premennej PATH.\n4. Spustite: ngrok authtoken YOUR_AUTH_TOKEN (token nájdete na https://dashboard.ngrok.com/get-started/your-authtoken)\n\nNgrok môžete nainštalovať aj pomocou správcu balíkov:\n- macOS: brew install ngrok/ngrok/ngrok\n- Linux: snap install ngrok\n- Windows: choco install ngrok",
        title: "ngrok nenainštalovaný",
        description:
          "Ngrok je potrebné začať tunel. Nainštalujte ho a skúste to znova.",
      },
      validationFailed: {
        title: "Neplatné údaje",
        description: "Neplatné parametre",
      },
      networkError: {
        title: "Chyba siete",
        description: "Sieťové pripojenie zlyhalo",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Prístup zamietnutý",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        noTunnelUrl: "Nepodarilo sa prečítať URL tunela ngrok",
        title: "Chyba servera",
        description: "Nepodarilo sa spustiť tunel",
      },
      unknownError: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Konflikt zdrojov",
      },
    },
    success: {
      title: "Zahájená tunel",
      description: "Ngrok tunel beží",
    },
  },
};
