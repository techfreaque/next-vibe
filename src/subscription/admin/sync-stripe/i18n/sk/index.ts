import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Synchronizovať predplatné zo Stripe",
    titleShort: "Synchronizácia so Stripe",
    description:
      "Prenesie stav, fakturačné obdobie a údaje o zrušení zo Stripe do záznamov predplatného. Ukončí staršie predplatné bez ID v Stripe, ak jeho obdobie už skončilo. Kredity nepripisuje ani neodpočítava. Predvolene sa spustí skúšobný beh.",
    fields: {
      subscriptionId: {
        label: "Predplatné",
        description:
          "Interné ID predplatného (UUID) alebo ID predplatného v Stripe (sub_...). Ak je zapnutá možnosť Všetky, nechajte pole prázdne.",
        placeholder: "sub_... alebo UUID predplatného",
      },
      all: {
        label: "Všetky",
        description:
          "Skontroluje každé predplatné, ktoré ešte nie je zrušené ani po skončení platnosti.",
      },
      dryRun: {
        label: "Skúšobný beh",
        description: "Zobrazí náhľad zmien bez zápisu.",
      },
    },
    response: {
      dryRun: "Skúšobný beh",
      scanned: "Skontrolované",
      changed: "Zmenené",
      failed: "Zlyhalo",
      items: "Predplatné",
      item: {
        subscriptionId: "Predplatné",
        userEmail: "Používateľ",
        providerSubscriptionId: "ID v Stripe",
        action: "Akcia",
        statusBefore: "Stav pred synchronizáciou",
        statusAfter: "Stav po synchronizácii",
        periodEndBefore: "Pôvodný koniec obdobia",
        periodEndAfter: "Nový koniec obdobia",
        note: "Poznámka",
      },
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Vyžaduje sa prihlásenie",
      },
      validation: {
        title: "Chýba cieľ synchronizácie",
        description:
          "Zadajte interné ID predplatného, ID v Stripe alebo all=true.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyžadujú sa oprávnenia správcu",
      },
      server: {
        title: "Synchronizácia zlyhala",
        description: "Predplatné sa nepodarilo synchronizovať zo Stripe",
        detail: "Synchronizácia predplatného zlyhala: {{error}}",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri synchronizácii nastala neočakávaná chyba",
      },
      conflict: {
        title: "Konflikt",
        description: "Predplatné sa počas synchronizácie zmenilo",
      },
      network: {
        title: "Chyba siete",
        description: "Stripe sa nepodarilo kontaktovať",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Zadanému ID nezodpovedá žiadne predplatné",
        detail: "Žiadne predplatné nezodpovedá {{id}}",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Najprv spustite alebo zrušte čakajúcu synchronizáciu",
      },
      notConfigured: "Na tejto inštancii nie je nastavený Stripe.",
    },
    success: {
      title: "Synchronizácia dokončená",
      description: "Predplatné sa porovnalo s údajmi v Stripe",
    },
    notes: {
      keptCanceled:
        "Stripe uvádza stav {{stripeStatus}}. Zrušené predplatné zostáva zrušené.",
      missingInStripe:
        "Predplatné sa v Stripe nenašlo. Označilo sa ako zrušené a jeho ID v Stripe sa vymazalo.",
      expiredLegacy:
        "Predplatné nemá ID v Stripe a jeho obdobie sa skončilo {{date}}. Označilo sa ako zrušené.",
      noStripeIdActivePeriod:
        "Predplatné nemá ID v Stripe a jeho obdobie stále trvá. Záznam zostal bez zmeny.",
      notStripe:
        "Predplatné sa preskočilo, pretože jeho poskytovateľom nie je Stripe.",
      stripeError: "Chyba Stripe: {{error}}",
    },
    widget: {
      submit: "Spustiť synchronizáciu",
      submitting: "Prebieha synchronizácia…",
      preview: "Náhľad bez zápisu",
      applied: "Zmeny použité",
      empty: "Nie je čo synchronizovať.",
      none: "žiadne",
    },
  },
  enums: {
    action: {
      updated: "Aktualizované",
      unchanged: "Zhoduje sa so Stripe",
      expired: "Platnosť uplynula",
      missingInStripe: "Chýba v Stripe",
      skipped: "Preskočené",
      error: "Chyba",
    },
  },
};
