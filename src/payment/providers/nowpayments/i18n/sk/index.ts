import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  name: "NOWPayments",
  description: "Poskytovateľ platieb v kryptomenách s podporou predplatného",

  cli: {
    post: {
      title: "NOWPayments CLI",
      description: "Správa tunela ngrok pre webhooky NOWPayments",
      category: "Platba",
      tags: {
        nowpayments: "NOWPayments",
        cli: "CLI",
        webhook: "Webhook",
      },
      operations: {
        check: "Kontrola",
        install: "Inštalovať",
        tunnel: "Tunel",
        status: "Stav",
      },
      form: {
        title: "Operácie NOWPayments CLI",
        description:
          "Nastavenie a správa tunela ngrok pre webhooky NOWPayments",
        fields: {
          operation: {
            label: "Operácia",
            description: "Vyberte operáciu, ktorá sa má vykonať",
            placeholder: "Vyberte si operáciu",
          },
          port: {
            label: "Port",
            description: "Lokálny port pre tunel (predvolene 3000)",
            placeholder: "3000",
          },
        },
      },
      errors: {
        validationFailed: {
          title: "Neplatné údaje",
          description: "Neplatná operácia alebo parametre",
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
          title: "Chyba servera",
          description: "Nepodarilo sa spustiť operáciu",
        },
        unknownError: {
          title: "Neznáma chyba",
          description: "Nastala neznáma chyba",
        },
        unsavedChanges: {
          title: "Neuložené zmeny",
          description: "Existujú neuložené zmeny",
        },
        conflict: {
          title: "Konflikt",
          description: "Konflikt zdrojov",
        },
      },
      response: {
        title: "Odpoveď",
        description: "Výsledok operácie",
        fields: {
          success: "Úspech",
          installed: "Inštalované",
          version: "Verzia",
          status: "Stav",
          output: "Výstup",
          instructions: "Pokyny",
          tunnelUrl: "URL tunela",
          webhookUrl: "Webhook URL",
        },
      },
      success: {
        title: "Úspech",
        description: "Operácia úspešne dokončená",
      },
    },
  },

  errors: {
    userNotFound: {
      detail: "Účet používateľa {{userId}} sa nenašiel.",
      title: "Používateľ sa nenašiel",
      description: "Zadaný používateľ sa nenašiel",
    },
    customerCreationFailed: {
      detail:
        "Nepodarilo sa nastaviť zákaznícky záznam NowPayments: {{error}} (user {{userId}})",
      title: "Vytvorenie zákazníka zlyhalo",
      description: "Nepodarilo sa pripraviť zákazníka v NOWPayments: {{error}}",
    },
    productNotFound: {
      detail: "Žiadny taký produkt: {{productId}}",
      title: "Produkt nenájdený",
      description: "Špecifikovaný produkt sa nepodarilo nájsť: {{productId}}",
    },
    userEmailRequired: {
      title: "Vyžaduje sa e-mail používateľa",
      description: "Na predplatné je potrebný e-mail používateľa: {{userId}}",
    },
    checkoutCreationFailed: {
      detail: "Platbu kryptomenou sa nepodarilo spustiť: {{error}}",
      title: "Nepodarilo sa vytvoriť platobnú reláciu",
      description:
        "Platobnú reláciu NOWPayments sa nepodarilo vytvoriť: {{error}}",
    },
    invoiceCreationFailed: {
      detail: "Nepodarilo sa vytvoriť NowPayments faktúru: {{error}}",
      title: "Vytvorenie faktúry zlyhalo",
      description: "Nepodarilo sa vytvoriť faktúru v NOWPayments: {{error}}",
    },
    invalidApiKey: {
      detail:
        "Neplatný kľúč API NOWPayments. Skontrolujte premennú NOWPAYMENTS_API_KEY a overte kľúč na https://nowpayments.io/app/dashboard",
      title: "Neplatný kľúč API",
      description:
        "Neplatný kľúč API NOWPayments. Skontrolujte konfiguráciu a overte kľúč na https://nowpayments.io/app/dashboard",
    },
    planCreationFailed: {
      title: "Vytvorenie plánu zlyhalo",
      description:
        "Nepodarilo sa vytvoriť plán predplatného v NOWPayments: {{error}}",
    },
    subscriptionCreationFailed: {
      title: "Vytvorenie predplatného zlyhalo",
      description: "Nepodarilo sa vytvoriť predplatné v NOWPayments: {{error}}",
    },
    subscriptionRetrievalFailed: {
      detail: "Nepodarilo sa načítať predplatné z NOWPayments: {{error}}",
      title: "Nepodarilo sa načítať predplatné",
      description: "Nepodarilo sa načítať predplatné z NOWPayments: {{error}}",
    },
    subscriptionCancellationFailed: {
      detail: "Nepodarilo sa zrušiť predplatné NowPayments: {{error}}",
      title: "Nepodarilo sa zrušiť predplatné",
      description: "Nepodarilo sa zrušiť predplatné v NOWPayments: {{error}}",
    },
    subscriptionListFailed: {
      detail: "Nepodarilo sa uviesť TERAZ predplatné na platby: {{error}}",
      title: "Nepodarilo sa načítať zoznam predplatných",
      description:
        "Nepodarilo sa načítať zoznam predplatných z NOWPayments: {{error}}",
    },
    notConfigured: {
      title: "NOWPayments nie je nastavená",
      description:
        "NOWPayments nie je nastavená. V súbore .env nastavte NOWPAYMENTS_API_KEY a NOWPAYMENTS_IPN_SECRET.",
    },
    webhookVerificationFailed: {
      detail: "Nepodarilo sa overiť webhook NowPayments: {{error}}",
      invalidSignature: "Webhook podpis nezodpovedá",
      title: "Nepodarilo sa overiť webhook",
      description:
        "Nepodarilo sa overiť podpis webhooku NOWPayments: {{error}}",
    },
    paymentStatusFailed: {
      detail: "Nepodarilo sa prečítať stav platby z NowPayments: {{error}}",
      title: "Nepodarilo sa načítať stav platby",
      description: "Nepodarilo sa načítať stav platby z NOWPayments: {{error}}",
    },
  },

  success: {
    invoiceCreated: {
      title: "Faktúra vytvorená",
      description: "Faktúra v NOWPayments bola vytvorená.",
    },
    webhookVerified: {
      title: "Webhook overený",
      description: "Webhook NOWPayments bol úspešne overený.",
    },
    paymentStatusRetrieved: {
      title: "Stav platby načítaný",
      description: "Stav platby z NOWPayments bol načítaný.",
    },
  },
};
