import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Oslovovanie kontaktov",
  tags: {
    outreach: "oslovovanie",
    crm: "CRM",
    deals: "dohody",
    import: "import",
  },
  enums: {
    currency: { eur: "EUR", usd: "USD", pln: "PLN" },
    contactStatus: {
      sent: "Oslovený",
      replied: "Odpovedal",
      interested: "Má záujem",
      deal: "Dohoda",
      declined: "Odmietol",
      optOut: "Odhlásil sa",
      bounced: "Vrátené",
    },
    contactKind: {
      creator: "Tvorca",
      newsletter: "Newsletter",
      directory: "Adresár",
      other: "Iné",
    },
    direction: {
      out: "Odoslané od nás",
      in: "Odpoveď kontaktu",
    },
    dealStatus: {
      proposed: "Návrh",
      committed: "Dohodnuté",
      paid: "Zaplatené",
      canceled: "Zrušené",
    },
    angleGroup: {
      affiliate: "A · Partnerský program",
      audienceFit: "B · Vhodné publikum",
      mission: "C · Sloboda prejavu a súkromie",
      tryIt: "D · Vyskúšanie a zaradenie do zoznamu",
      video: "Dopyt na video",
      infoFirst: "Najprv cenník",
      negotiation: "Rokovanie",
      other: "Iné",
    },
    attributionBasis: {
      tracked: "Sledovaný odkaz alebo kód odporúčania",
      channel: "Za celý kanál",
      none: "Nesledované",
    },
  },
  crm: {
    get: {
      title: "CRM oslovovania",
      titleShort: "Oslovovanie kontaktov",
      description:
        "Všetky oslovené kontakty, stav spolupráce aj registrácie a tržby z platených dohôd.",
      fields: {
        status: {
          label: "Stav",
          description: "Iba kontakty v tomto stave",
        },
        kind: {
          label: "Typ",
          description: "Tvorca, newsletter, adresár alebo iný typ",
        },
        angle: {
          label: "Prístup",
          description:
            "Začiatok označenia prístupu k osloveniu, napríklad A, B-audience-fit alebo VIDEO",
          placeholder: "B-audience-fit",
        },
        search: {
          label: "Vyhľadať",
          description: "Meno, e-mail, predmet alebo poznámky",
          placeholder: "Hľadať podľa mena, e-mailu či predmetu…",
        },
        page: { label: "Stránka", description: "Číslo strany" },
        limit: { label: "Na stránku", description: "Kontakty na stránku" },
      },
      response: {
        summary: "Súhrn",
        angles: "Prístupy",
        contacts: "Kontakty",
        deals: "Dohody",
        dealTotals: "Súhrn dohôd",
      },
      widget: {
        title: "Oslovovanie kontaktov",
        subtitle:
          "Koho sme oslovili, kto odpovedal a aké výsledky priniesli výdavky.",
        refresh: "Obnoviť",
        addContact: "Zaznamenať kontakt",
        addDeal: "Pridať dohodu",
        import: "Importovať záznam",
        loading: "Načítavajú sa oslovenia…",
        allStatuses: "Všetky",
        clearFilters: "Zrušiť filtre",
        kpi: {
          contacts: "Kontakty",
          replyRate: "Miera odpovedí",
          replyRateHint: "Odpovedali: {{replied}} z {{total}}",
          deals: "Zaplatené dohody",
          spent: "Výdavky",
          spentHint: "Dohodnutá, zatiaľ nezaplatená suma: {{committed}}",
        },
        angles: {
          title: "Prístupy",
          hint: "Miera odpovedí podľa prístupu k osloveniu. Častejšie používajte prístupy, na ktoré kontakty reagujú.",
          row: "Oslovení: {{contacts}} · Odpovede: {{replied}}",
        },
        contacts: {
          title: "Kontakty",
          columns: {
            contact: "Kontakt",
            status: "Stav",
            angle: "Prístup",
            last: "Posledný kontakt",
            touches: "E-maily",
          },
          showing: "{{start}} až {{end}} z {{total}}",
          never: "nikdy",
          replied: "odpoveď {{date}}",
        },
        deals: {
          title: "Zaplatené dohody",
          hint: "Výdavky v porovnaní s návštevami, registráciami a tržbami zo sledovaného odkazu alebo kódu odporúčania každej dohody.",
          columns: {
            deal: "Dohoda",
            status: "Stav",
            spend: "Výdavky",
            visits: "Návštevy",
            signups: "Registrácie",
            paying: "Platiaci",
            revenue: "Tržby",
            costPerSignup: "Náklady na registráciu",
          },
          live: "zverejnené {{date}}",
          basisChannel: "za celý kanál, bez priradenia ku konkrétnej dohode",
          basisNone: "chýba odkaz, kampaň aj kód odporúčania",
          empty: {
            title: "Zatiaľ žiadne zaplatené dohody",
            hint: "Zaznamenajte dohodu hneď, keď tvorca odsúhlasí cenu. Pripojte sledovaný odkaz alebo kód odporúčania, aby sa tu zobrazili výsledky.",
          },
        },
        empty: {
          title: "Žiadne záznamy oslovení",
          hint: "Importujte denník odoslaných e-mailov alebo každý e-mail zaznamenajte pri odoslaní.",
          cta: "Importovať denník odoslaných e-mailov",
          filtered: "Žiadne kontakty nezodpovedajú filtrom",
        },
        text: {
          header:
            "Kontakty: {{total}} · Odpovede: {{replied}} ({{rate}}) · Zaplatené dohody: {{deals}}",
          statusLine: "Stav: {{counts}}",
          anglesTitle: "Prístupy (oslovené kontakty / odpovede):",
          contactsTitle: "Kontakty {{start}} až {{end}} z {{total}}:",
          dealsTitle: "Zaplatené dohody:",
          dealLine:
            "{{name}} · {{deliverable}} · {{amount}} {{status}} · návštevy {{visits}} · registrácie {{signups}} · platiaci {{paying}} · tržby {{revenue}} · náklady na registráciu {{cps}}",
          pageHint:
            "Strana {{page}}/{{pages}}. Na ďalšiu stranu prejdete pomocou --page={{next}}.",
          noContacts: "Žiadne kontakty nezodpovedajú filtrom.",
          noDeals: "Žiadne zaplatené dohody nie sú zaznamenané.",
        },
      },
    },
  },
  contact: {
    post: {
      title: "Zaznamenať oslovený kontakt",
      titleShort: "Zaznamenať kontakt",
      description:
        "Vytvorte alebo aktualizujte kontakt podľa e-mailovej adresy. Zadaním predmetu zaznamenáte práve odoslaný alebo prijatý e-mail.",
      fields: {
        email: {
          label: "E-mail",
          description:
            "E-mail kontaktu. Pri porovnávaní sa nerozlišujú veľké a malé písmená",
          placeholder: "hello@creator.com",
        },
        name: {
          label: "Meno",
          description: "Tvorca, médium alebo osoba",
          placeholder: "AI Anytime (Sonu)",
        },
        kind: {
          label: "Typ",
          description: "Tvorca, newsletter, adresár alebo iný typ",
        },
        url: {
          label: "Adresa URL",
          description: "Stránka kanála, webu alebo newslettera",
          placeholder: "https://youtube.com/@creator",
        },
        angle: {
          label: "Prístup",
          description:
            "Prístup k osloveniu, napríklad A-affiliate alebo B-audience-fit",
          placeholder: "B-audience-fit",
        },
        status: {
          label: "Stav",
          description:
            "Stav sa posúva iba dopredu (oslovený → odpovedal → má záujem → dohoda). Stavy ukončenia sa použijú vždy.",
        },
        forceStatus: {
          label: "Vynútiť stav",
          description: "Nastaví presný stav, aj keď ide o návrat na predošlý",
        },
        notes: {
          label: "Poznámky",
          description: "Nahradí poznámky kontaktu",
          placeholder:
            "Cenník: integrácia za 550 USD, 20 000 až 150 000 zobrazení",
        },
        refCode: {
          label: "Kód odporúčania",
          description: "Kód odporúčania pridelený kontaktu",
          placeholder: "moemoe",
        },
        channel: {
          label: "Kanál",
          description: "Kľúč kanála rastu, napríklad youtube alebo newsletter",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "ID odkazu kampane",
          description:
            "Hodnota utm_id sledovaného odkazu. Neznáme ID sa nezapíšu",
        },
        subject: {
          label: "Predmet e-mailu",
          description:
            "Zadajte predmet, ak chcete tento e-mail zaznamenať ako kontakt s príjemcom alebo odosielateľom",
          placeholder: "Tvoji diváci to už chcú",
        },
        direction: {
          label: "Smer",
          description: "Odoslané od nás (predvolené) alebo odpoveď kontaktu",
        },
        at: {
          label: "Odoslané",
          description: "Čas odoslania e-mailu. Predvolený je aktuálny čas",
        },
        touchNote: {
          label: "Poznámka k e-mailu",
          description: "Čo e-mail uvádzal alebo o čo žiadal",
          placeholder: "Vyžiadal som si cenník",
        },
      },
      response: {
        id: "ID kontaktu",
        created: "Vytvorené",
        status: "Stav",
        previousStatus: "Predchádzajúci stav",
        touchLogged: "E-mail zaznamenaný",
        contactCount: "Odoslané e-maily",
        warning: "Upozornenie",
      },
      widget: {
        back: "Späť",
        hint: "Jedno volanie na odoslaný e-mail. Rovnaká adresa aktualizuje ten istý kontakt.",
        touchSection: "Tento e-mail",
        contactSection: "Kontakt",
        submit: "Uložiť kontakt",
        warnOptOut:
          "Tento kontakt sa odhlásil z odberu. Ďalšie e-maily mu neposielajte.",
        warnBounced:
          "E-mail na túto adresu sa už vrátil ako nedoručený. Pred odoslaním adresu skontrolujte.",
        saved: "{{status}} · počet odoslaných e-mailov: {{count}}",
      },
    },
  },
  deal: {
    post: {
      title: "Uložiť dohodu o spolupráci",
      titleShort: "Uložiť dohodu",
      description:
        "Vytvorte platenú dohodu pre kontakt alebo upravte dohodu podľa ID. Na meranie výsledkov pripojte odkaz kampane, utm_campaign alebo kód odporúčania.",
      fields: {
        id: {
          label: "ID dohody",
          description: "Zadajte ID, ak chcete aktualizovať existujúcu dohodu",
        },
        contactEmail: {
          label: "E-mail kontaktu",
          description:
            "Pri novej dohode je povinný. Ak kontakt ešte neexistuje, vytvorí sa",
          placeholder: "youtube@creator.com",
        },
        contactName: {
          label: "Meno kontaktu",
          description: "Použije sa iba vtedy, keď kontakt ešte neexistuje",
          placeholder: "MoeMoe",
        },
        deliverable: {
          label: "Plnenie dohody",
          description: "Čo dostanete za dohodnutú sumu",
          placeholder: "Integrácia na YouTube",
        },
        amount: {
          label: "Suma",
          description: "Celková cena v jednotkách meny",
        },
        currency: {
          label: "Mena",
          description: "Mena zadanej sumy",
        },
        status: {
          label: "Stav",
          description: "Návrh, dohodnuté, zaplatené alebo zrušené",
        },
        channel: {
          label: "Kanál",
          description: "Kľúč kanála rastu, rovnaký ako pri výdavkoch na kanál",
          placeholder: "youtube",
        },
        campaignLinkId: {
          label: "ID odkazu kampane",
          description:
            "Hodnota utm_id sledovaného odkazu. Ak odkaz na tejto inštancii nie je, pole zostane prázdne",
        },
        utmCampaign: {
          label: "utm_campaign",
          description: "Hodnota parametra utm_campaign v sledovanom odkaze",
          placeholder: "moemoe-2026-11-14",
        },
        refCode: {
          label: "Kód odporúčania",
          description: "Kód odporúčania, ktorý zdieľa tvorca",
          placeholder: "moemoe",
        },
        liveAt: {
          label: "Zverejnenie",
          description: "Dátum zverejnenia. Tržby sa počítajú od tohto dátumu",
        },
        paidAt: {
          label: "Dátum platby",
          description:
            "Pri zmene stavu na „Zaplatené“ sa predvolene používa aktuálny čas",
        },
        notes: {
          label: "Poznámky",
          description: "Spôsob platby, faktúra, podmienky",
          placeholder: "Payoneer, ref 1059964703",
        },
      },
      response: {
        id: "ID dohody",
        created: "Vytvorené",
        status: "Stav",
        linkFound: "Odkaz kampane sa našiel",
      },
      widget: {
        back: "Späť",
        hint: "Dohodnuté alebo zaplatené spolupráce presunú kontakt do stavu „Dohoda“.",
        submit: "Uložiť dohodu",
      },
    },
  },
  import: {
    post: {
      title: "Importovať denník oslovení",
      titleShort: "Importovať denník",
      description:
        "Vytvorí kontakty a záznamy oslovení z denníka odoslaných e-mailov. Podporuje riadky s hodnotami oddelenými tabulátormi aj tabuľky Markdown. Pri opakovanom importe sa uložené e-maily preskočia.",
      fields: {
        content: {
          label: "Obsah denníka",
          description:
            "Vložte riadky z denníka sent-log alebo tabuľky zo súboru sent-log.md. Funguje aj so vzdialenými inštanciami.",
          placeholder:
            "2026-11-10\tModelFit\tpartnerships@modelfit.io\tA-affiliate\tA recurring cut\tSENT",
        },
        filePaths: {
          label: "Súbory na serveri",
          description:
            "Cesty v priečinku .tmp/ na serveri oddelené čiarkami, napríklad .tmp/outreach/sent-log",
          placeholder: ".tmp/outreach/sent-log.md,.tmp/outreach/sent-log",
        },
        ignoreEmails: {
          label: "Ignorovať e-maily",
          description:
            "Adresy, ktoré nepatria medzi oslovenia. Oddeľte ich čiarkami.",
          placeholder: "max@example.com",
        },
        dryRun: {
          label: "Skúšobný režim",
          description: "Spracuje a spočíta záznamy bez zápisu",
        },
      },
      response: {
        rowsParsed: "Načítané riadky",
        contactsCreated: "Vytvorené kontakty",
        contactsUpdated: "Aktualizované kontakty",
        touchesAdded: "Pridané e-maily",
        touchesDuplicate: "Už evidované",
        statusChanges: "Zmeny stavov",
        skipped: "Preskočené riadky",
        skippedLines: "Podrobnosti o preskočených riadkoch",
      },
      widget: {
        back: "Späť",
        hint: "Vložte denník alebo zadajte cesty k súborom na serveri. Každý e-mail sa uloží iba raz bez ohľadu na počet importov.",
        submit: "Importovať",
        line: "{{source}}:{{line}} {{reason}}",
      },
    },
  },
  skip: {
    noEmail: "chýba platný e-mail",
    noDate: "chýba platný dátum",
    skippedStatus: "označené SKIPPED",
    ignored: "ignorovaná adresa",
    columns: "príliš málo stĺpcov",
    unreadable: "súbor sa nedá čítať",
    outsideTmp: "cesta mimo .tmp/",
  },
  errors: {
    validation: {
      title: "Neplatný vstup",
      description: "Skontrolujte zvýraznené polia",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Prihláste sa ako správca",
    },
    forbidden: {
      title: "Iba pre správcov",
      description: "Nástroje na oslovovanie vyžadujú oprávnenia správcu",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Tento záznam neexistuje",
    },
    conflict: {
      title: "Konflikt",
      description:
        "Záznam sa medzitým zmenil. Načítajte ho znova a zopakujte akciu.",
    },
    server: {
      title: "Chyba servera",
      description: "Požiadavku sa nepodarilo dokončiť",
    },
    network: {
      title: "Chyba siete",
      description: "Požiadavka sa nedostala na server",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Najprv zmeny uložte alebo zrušte",
    },
    dealNotFound: "Dohoda s ID {{id}} sa nenašla",
    dealNeedsContact: "Pri novej dohode zadajte e-mailovú adresu kontaktu",
    dealNeedsFields: "Pri novej dohode zadajte plnenie a sumu",
    importEmpty: "Zadajte obsah denníka alebo aspoň jeden súbor na serveri",
  },
  success: {
    title: "Hotovo",
    description: "Uložené",
  },
};
