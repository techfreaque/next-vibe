import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  lineRounding: "Zaokrúhľovanie položiek",
  category: "Cenové ponuky",
  tags: { payment: "platba", estimate: "cenová ponuka" },
  post: {
    title: "Načítať cenovú ponuku",
    titleShort: "Načítať cenovú ponuku",
    description: "Načítať cenovú ponuku so všetkými položkami",
    form: {
      title: "Načítať cenovú ponuku",
      description: "Načítať cenovú ponuku so všetkými položkami",
    },
    response: { success: "Úspech", message: "Stavová správa" },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa.",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Skontrolujte zadané údaje.",
      },
      server: {
        title: "Chyba servera",
        description: "Nastala interná chyba servera.",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba.",
      },
      network: {
        title: "Chyba siete",
        description: "Skontrolujte pripojenie.",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte potrebné oprávnenie.",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Cenová ponuka sa nenašla",
      },
      conflict: {
        title: "Konflikt",
        description: "Operácia nie je v tomto stave možná.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Úspech",
      description: "Načítať cenovú ponuku so všetkými položkami",
    },
  },
  estimateId: {
    label: "ID cenovej ponuky",
    description: "Cenová ponuka, ktorej sa úkon týka",
  },
  widget: {
    itemColumn: "Položka",
    lineActions: "Akcie",
    removeLine: "Odstrániť",
    removeLineNamed: "Odstrániť položku {{description}}",
    send: "Označiť ako odoslanú",
    terms: "Podmienky",
    noItems: "Táto cenová ponuka neobsahuje žiadne položky.",
    addLine: "Pridať položku",
    accept: "Zaevidovať prijatie",
    decline: "Zaevidovať odmietnutie",
    openInvoice: "Otvoriť faktúru",
    back: "Späť",
    submit: "Vyhľadať cenovú ponuku",
    estimateNumber: "Cenová ponuka",
    valid: "Platnosť do",
    customer: "Zákazník",
    lineItems: "Položky",
    description: "Opis",
    qty: "Množstvo",
    unitPrice: "Jednotková cena",
    tax: "DPH",
    total: "Spolu",
    subtotal: "Medzisúčet",
    sendEstimate: "Odoslať",
    acceptEstimate: "Prijať",
    declineEstimate: "Odmietnuť",
    convertToInvoice: "Vytvoriť faktúru",
    duplicate: "Vytvoriť kópiu",
    status: {
      draft: "Koncept",
      sent: "Odoslaná",
      accepted: "Prijatá",
      declined: "Odmietnutá",
      expired: "Platnosť skončila",
      converted: "Prevedená na faktúru",
    },
  },
};
