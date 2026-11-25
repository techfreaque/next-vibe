import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "E-maily",
  tags: {
    emails: "E-maily",
  },
  title: "Zoznam e-mailov",
  titleShort: "Zoznam e-mailov",
  description: "Načíta zoznam e-mailov s filtrami po jednotlivých stránkach",
  container: {
    title: "Zoznam e-mailov",
    description: "Nastaviť parametre zoznamu e-mailov a zobraziť výsledky",
  },
  filters: {
    title: "Filtre",
    description: "Filtrovať a vyhľadávať e-maily",
  },
  displayOptions: {
    title: "Možnosti zobrazenia",
  },
  fields: {
    dateRange: {
      title: "Rozsah dátumov",
    },
    page: {
      label: "Stránka",
      description: "Číslo stránky výsledkov",
      placeholder: "Zadajte číslo stránky",
    },
    limit: {
      label: "Limit",
      description: "Počet položiek na stránku",
      placeholder: "Zadajte limit",
    },
    search: {
      label: "Hľadať",
      description:
        "Vyhľadávanie e-mailov podľa predmetu, príjemcu alebo odosielateľa",
      placeholder: "Hľadať e-maily…",
    },
    status: {
      label: "Stav",
      description: "Filtrovať podľa stavu e-mailu",
      placeholder: "Vybrať stav",
    },
    channel: {
      label: "Kanál",
      description: "Filtrovať podľa kanála",
    },
    type: {
      label: "Typ",
      description: "Filtrovať podľa typu e-mailu",
      placeholder: "Vybrať typ",
    },
    sortBy: {
      label: "Zoradiť podľa",
      description: "Pole použité na zoradenie",
      placeholder: "Vybrať pole na zoradenie",
    },
    sortOrder: {
      label: "Poradie",
      description: "Poradie zoradenia",
      placeholder: "Vybrať poradie",
    },
    dateFrom: {
      label: "Dátum od",
      description: "Zobraziť e-maily od tohto dátumu",
      placeholder: "Vyberte dátum začiatku",
    },
    dateTo: {
      label: "Dátum do",
      description: "Zobraziť e-maily do tohto dátumu",
      placeholder: "Vybrať dátum konca",
    },
  },
  response: {
    emails: {
      title: "E-maily",
      emptyState: {
        title: "Nenašli sa žiadne e-maily",
        description: "Žiadne e-maily nezodpovedajú aktuálnym filtrom",
      },
      item: {
        title: "E-mail",
        description: "Podrobnosti o e-maile",
        id: "ID",
        subject: "Predmet",
        recipientEmail: "E-mail príjemcu",
        recipientName: "Meno príjemcu",
        senderEmail: "E-mail odosielateľa",
        senderName: "Meno odosielateľa",
        type: "Typ",
        status: "Stav",
        channel: "Kanál",
        templateName: "Názov šablóny",
        emailProvider: "Poskytovateľ e-mailov",
        externalId: "Externé ID",
        sentAt: "Odoslané",
        deliveredAt: "Doručené",
        openedAt: "Otvorené",
        clickedAt: "Kliknutie na odkaz",
        retryCount: "Počet opakovaných pokusov",
        error: "Chyba",
        userId: "ID používateľa",
        leadId: "ID kontaktu",
        createdAt: "Vytvorené",
        updatedAt: "Aktualizované",
        emailCore: {
          title: "Základné informácie",
        },
        emailParties: {
          title: "Odosielateľ a príjemca",
        },
        emailMetadata: {
          title: "Metadáta",
        },
        emailEngagement: {
          title: "Sledovanie interakcií",
        },
        technicalDetails: {
          title: "Technické údaje",
        },
        associatedIds: {
          title: "Súvisiace ID",
        },
        timestamps: {
          title: "Dátumy a časy",
        },
      },
    },
    pagination: {
      title: "Stránkovanie",
      description: "Údaje o stránkovaní",
      page: "Aktuálna stránka",
      limit: "Položky na stránku",
      total: "Celkový počet položiek",
      totalPages: "Celkový počet stránok",
    },
    filters: {
      title: "Použité filtre",
      description: "Práve použité filtre",
      status: "Filter podľa stavu",
      type: "Filter podľa typu",
      search: "Vyhľadávací dopyt",
      dateFrom: "Dátum začiatku",
      dateTo: "Dátum ukončenia",
    },
  },
  errors: {
    validation: {
      title: "Neplatné údaje",
      description: "Zadané parametre sú neplatné",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Na prístup k tomuto zdroju sa prihláste",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Nemáte oprávnenie pristupovať k tomuto zdroju",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Požadovaný zdroj sa nenašiel",
    },
    server: {
      title: "Chyba servera",
      description: "Vyskytla sa interná chyba servera",
      detail_list: "Nepodarilo sa načítať správy: {{error}}",
      detail_get: "Nepodarilo sa načítať správu: {{error}}",
      detail_create: "Nepodarilo sa uložiť správu: {{error}}",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt údajov",
      description: "Požiadavka je v rozpore s aktuálnym stavom",
    },
    network: {
      title: "Chyba siete",
      description: "Nastala chyba siete",
    },
  },
  success: {
    title: "Úspech",
    description: "E-maily boli načítané",
  },
  widget: {
    to: "Komu",
    retries: "Opakované pokusy",
    opened: "Otvorené",
    clicked: "S kliknutím na odkaz",
    stats: "Štatistiky",
    graphs: "Grafy",
    refresh: "Obnoviť",
    searchPlaceholder: "Hľadať e-maily…",
    clearSearch: "Vymazať",
    emptyState: "Nenašli sa žiadne e-maily",
    emptyFiltered: "Žiadne e-maily nezodpovedajú filtrom",
    page: "Stránka",
    tabs: {
      all: "Všetky",
      sent: "Odoslané",
      delivered: "Doručené",
      opened: "Otvorené",
      failed: "Zlyhalo",
      bounced: "Vrátené",
    },
  },
  enums: {
    status: {
      pending: "Čaká sa",
      sent: "Odoslané",
      delivered: "Doručené",
      opened: "Otvorené",
      clicked: "S kliknutím na odkaz",
      bounced: "Vrátené",
      failed: "Zlyhalo",
      unsubscribed: "Odber zrušený",
    },
    statusFilter: {
      any: "Všetky stavy",
    },
    type: {
      transactional: "Transakčné",
      marketing: "Marketing",
      notification: "Oznámenie",
      system: "Systém",
      leadCampaign: "Kampaň pre kontakty",
      userCommunication: "Komunikácia s používateľmi",
    },
    typeFilter: {
      any: "Všetky typy",
    },
    channel: {
      email: "E-mail",
      sms: "SMS",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    },
    channelFilter: {
      any: "Všetky kanály",
    },
    sortField: {
      subject: "Predmet",
      recipientEmail: "E-mail príjemcu",
      recipientName: "Meno príjemcu",
      type: "Typ",
      status: "Stav",
      sentAt: "Odoslané",
      createdAt: "Vytvorené",
    },
    sortOrder: {
      asc: "Vzostupne",
      desc: "Zostupne",
    },
  },
};
