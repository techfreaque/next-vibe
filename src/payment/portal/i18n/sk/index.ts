import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  success: {
    created: "Relácia zákazníckeho portálu bola vytvorená",
  },
  post: {
    title: "Zákaznícky portál",
    titleShort: "Zákaznícky portál",
    description: "Vytvoriť reláciu zákazníckeho portálu na správu fakturácie",
    form: {
      title: "Nastavenia portálu",
      description: "Nastaviť parametre zákazníckeho portálu",
    },
    returnUrl: {
      label: "Adresa URL návratu",
      description: "Adresa URL na presmerovanie po skončení relácie v portáli",
      placeholder: "https://example.com/dashboard",
    },
    response: {
      success: "Relácia portálu bola vytvorená",
      message: "Stavová správa",
      customerPortalUrl: "Adresa URL zákazníckeho portálu",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Požadované overenie",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné parametre požiadavky",
      },
      server: {
        detail: "Fakturačný portál sa nepodarilo otvoriť: {{error}}",
        portalNotConfigured:
          "Zákaznícky portál Stripe ešte nie je nastavený. Nastavenia: https://dashboard.stripe.com/test/settings/billing/portal",
        title: "Chyba servera",
        description: "Nastala chyba interného servera",
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
        title: "Prístup zamietnutý",
        description: "Prístup zakázaný",
      },
      notFound: {
        noStripeCustomer: "K tvojmu účtu sa v Stripe nenašiel záznam zákazníka",
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt údajov",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
    },
    success: {
      title: "Úspech",
      description: "Operácia úspešne dokončená",
    },
  },
};
