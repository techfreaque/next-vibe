import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Front kampaní",
  description: "Kontakty aktívne v e-mailových kampaniach",
  enums: {
    delivery: {
      stuck: "Správy uviaznuté po prevzatí na odoslanie",
      dueNow: "Na odoslanie teraz",
      overdue: "Po termíne najmenej 24 h",
      scheduled: "Naplánované",
      failed: "Zlyhalo",
      sent: "Odoslané",
      opened: "Odoslané a otvorené",
      clicked: "Odoslané s kliknutím",
      unsubscribed: "Odhlásené z odberu",
      bounced: "Vrátené",
    },
    emailJourneyVariantFilter: {
      all: "Všetky",
      uncensoredConvert: "Odporúčanie bez cenzúry",
      sideHustle: "Vedľajší príjem",
      quietRecommendation: "Nenápadné odporúčanie",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      newsletterMay2026: "Newsletter máj 2026",
      newsletterNov2026: "Newsletter november 2026",
    },
    emailCampaignStageFilter: {
      all: "Všetky",
    },
    emailCampaignStage: {
      notStarted: "Nespustené",
      initial: "Prvé oslovenie",
      followup1: "Nadväzujúci e-mail 1",
      followup2: "Nadväzujúci e-mail 2",
      followup3: "Nadväzujúci e-mail 3",
      nurture: "Budovanie vzťahu",
      reactivation: "Obnovenie aktivity",
    },
    campaignType: {
      leadCampaign: "Kampaň pre kontakty",
      newsletter: "Newsletter",
      signupNurture: "Začíname po registrácii",
      retention: "Udržanie predplatiteľov",
      winback: "Návrat používateľov",
      transactional: "Transakčný e-mail",
      notification: "Oznámenie",
      system: "Systémový e-mail",
    },
    campaignTypeFilter: {
      all: "Všetky",
    },
  },
  get: {
    title: "Front kampaní",
    titleShort: "Front kampaní",
    description:
      "Zobraziť zoznam kontaktov v e-mailových kampaniach po stranách",
    fields: {
      delivery: {
        label: "Stav e-mailu",
        description:
          "Kontakty s e-mailom v tomto stave. Rozsah dátumov platí pre odoslanie, otvorenie, kliknutie na odkaz, zrušenie odberu, vrátenie e-mailu a zlyhanie odoslania.",
        placeholder: "Ľubovoľný stav",
      },
      journeyVariant: {
        label: "Variant e-mailovej série",
        description: "Iba e-maily z tejto série",
        placeholder: "Ľubovoľná e-mailová séria",
      },
      stage: {
        label: "Fáza",
        description: "Iba e-maily z tejto fázy kampane",
        placeholder: "Ľubovoľná fáza",
      },
      locale: {
        label: "Jazykové nastavenie",
        description:
          "Jazykové nastavenie výsledného e-mailu (de-DE) alebo jazyk (de)",
        placeholder: "Ľubovoľné jazykové nastavenie",
      },
      eventFrom: {
        label: "Od",
        description: "Prvý deň rozsahu e-mailových udalostí",
      },
      eventTo: {
        label: "Do",
        description: "Posledný deň rozsahu e-mailových udalostí",
      },
      page: {
        label: "Stránka",
        description: "Číslo strany",
      },
      pageSize: {
        label: "Veľkosť stránky",
        description: "Počet záznamov na stránku",
      },
      campaignType: {
        label: "Typ kampane",
        description: "Filtrovať podľa typu kampane",
      },
    },
    response: {
      matchedAt: "Najnovšia zhoda",
      matchedSubject: "Predmet e-mailu, ktorý zodpovedá filtru",
      daysOverdue: "Dni po termíne",
      nextSubject: "Predmet naplánovaného e-mailu",
      leadId: "ID kontaktu",
      leadEmail: "E-mail",
      businessName: "Firma",
      campaignType: "Typ kampane",
      journeyVariant: "Variant e-mailovej série",
      currentStage: "Aktuálna fáza",
      nextScheduledAt: "Ďalší e-mail",
      emailsSent: "Odoslané",
      emailsOpened: "Otvorené",
      emailsClicked: "S kliknutím na odkaz",
      startedAt: "Čas začiatku",
      total: "Spolu",
      page: "Stránka",
      pageSize: "Veľkosť stránky",
      items: "Položky frontu",
    },
    errors: {
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Na zobrazenie frontu kampaní sa prihláste",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nemáte oprávnenie zobraziť front kampaní",
      },
      server: {
        title: "Chyba servera",
        description: "Pri načítavaní frontu kampaní nastala chyba",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neznáma chyba",
      },
      validation: {
        title: "Neplatné údaje",
        description: "Neplatné vstupné parametre",
      },
    },
    success: {
      title: "Front načítaný",
      description: "Front kampaní sa úspešne načítal",
    },
  },
  widget: {
    matchedEvents:
      "Na každý kontakt pripadá jeden riadok s najnovšou udalosťou, ktorá zodpovedá filtru.",
    overdueDays: "Dni po termíne: {{days}}. E-mail sa ešte neodoslal.",
    titleWithCount: "Front kampaní ({{count}})",
    eventWindow: "E-mailové udalosti od {{from}} do {{to}}",
    title: "Front kampaní",
    refresh: "Obnoviť",
    noData: "Front kampaní je prázdny",
    emptyDescription:
      "Tu sa zobrazia e-maily vo fronte a kontakty v aktívnych kampaniach.",
    back: "Späť",
    loading: "Načítava sa front kampaní",
    selectedLead: "Vybraný kontakt",
    clearFilters: "Zrušiť filtre",
    leadEmpty: "Tento kontakt nemá vo fronte žiadne položky",
    firstPage: "Prejsť na prvú stranu",
    scheduledFor: "Naplánované na {{date}}",
    noScheduledEmail: "Žiadny naplánovaný e-mail",
    deliveryStats:
      "Odoslané: {{sent}} · Otvorené: {{opened}} · S kliknutím na odkaz: {{clicked}}",
    startedOn: "Spustené {{date}}",
    openLead: "Otvoriť kontakt",
    openLeadNamed: "Otvoriť kontakt {{recipient}}",
    previous: "Predchádzajúca",
    next: "Ďalšia",
    pagination:
      "Stránka {{page}} z {{totalPages}} · Počet kontaktov: {{total}}",
  },
};
