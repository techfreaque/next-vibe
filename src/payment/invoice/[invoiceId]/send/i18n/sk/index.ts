import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Fakturácia",
  tags: {
    payment: "platba",
    invoice: "faktúra",
  },
  post: {
    title: "Vystaviť faktúru",
    titleShort: "Vystaviť faktúru",
    description: "Vystaviť faktúru z konceptu a vytvoriť účtovný zápis.",
    form: {
      title: "Vystaviť faktúru",
      description: "Po vystavení vytvorte odkaz na faktúru pre zákazníka.",
    },
    response: {
      success: "Faktúra bola vystavená",
      message: "Stavová správa",
      viewUrl: "Adresa faktúry pre zákazníka",
    },
    errors: {
      invoiceLines:
        "Pred vystavením pridajte položky s kladnou celkovou sumou.",
      posting:
        "Skontrolujte celkovú sumu faktúry, menu firmy, účtovné obdobie a účty na zaúčtovanie.",
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
        description: "Faktúra sa nenašla.",
      },
      conflict: {
        title: "Konflikt",
        description: "Faktúra nie je v stave Koncept.",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny.",
      },
    },
    success: {
      title: "Faktúra bola vystavená",
      description: "Odkaz na faktúru môžete zdieľať.",
    },
  },
  invoiceId: {
    label: "ID faktúry",
    description: "ID faktúry na odoslanie",
    placeholder: "Zadajte ID faktúry",
  },
  delivery: {
    share: "Zdieľať faktúru",
    description:
      "Skopírujte odkaz pre zákazníka alebo ho odošlite na e-mail uložený na faktúre.",
    send: "Odoslať e-mailom",
    confirmDescription: "Odošlite odkaz na faktúru potvrdenému príjemcovi.",
    recipient: "Príjemca faktúry",
    noRecipient:
      "Na faktúre nie je uložený platný príjemca. Odkaz môžete skopírovať.",
    status: "Stav e-mailu",
    notIssued: "Zdieľať môžete iba vystavené faktúry.",
    recipientChanged:
      "Príjemca faktúry sa zmenil alebo nie je dostupný. Znova otvorte zdieľanie faktúry.",
    emailSubject: "Faktúra {{number}}",
    emailText:
      "Spoločnosť {{company}} vystavila faktúru {{number}}. Otvorte ju tu:\n{{url}}",
    states: {
      ready: "Pripravené na odoslanie",
      pending:
        "Odosielanie prebieha alebo čaká na potvrdenie. Ďalšie pokusy sú pozastavené.",
      accepted: "Poštový server prijal správu.",
      retryable: "Poštový server nebol kontaktovaný. Môžete to skúsiť znova.",
      uncertain:
        "Výsledok odoslania sa nepodarilo potvrdiť. Pred samostatným zdieľaním odkazu si ho overte u príjemcu.",
    },
  },
  widget: {
    back: "Späť",
    submit: "Vystaviť faktúru",
    sent: "Zdieľajte odkaz so zákazníkom, aby si mohol faktúru otvoriť.",
    copy: "Skopírovať odkaz pre zákazníka",
    copied: "Odkaz je skopírovaný",
    copyError:
      "Odkaz sa nepodarilo skopírovať. Označte a skopírujte adresu vyššie.",
    viewUrl: "Odkaz na faktúru pre zákazníka",
  },
};
