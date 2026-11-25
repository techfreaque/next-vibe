import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  emailJourneys: {
    components: {
      defaults: {
        signatureName: "Používateľ unbottled.ai",
        previewLeadId: "preview-lead-id",
        previewEmail: "preview@example.com",
        previewBusinessName: "Acme Corp",
        previewContactName: "Ukážkový používateľ",
        previewPhone: "+1234567890",
        previewCampaignId: "preview-campaign-id",
      },
      footer: {
        unsubscribeText:
          "Tento e-mail dostávaš, pretože si sa prihlásil na odber.",
        unsubscribeLink: "Odhlásiť sa z odberu",
      },
      journeyInfo: {
        uncensoredConvert: {
          name: "Odporúčanie bez cenzúry",
          description: "Nadšenec sa delí o svoj objav unbottled.ai",
          longDescription:
            "Nadšenec opisuje svoj objav a otvorene hovorí o provízii",
          characteristics: {
            tone: "Neformálny, dôverný tón",
            story: "Osobný príbeh",
            transparency: "Otvorené priznanie provízie",
            angle: "Dôraz na AI bez cenzúry",
            energy: "Nadšený tón",
          },
        },
        sideHustle: {
          name: "Vedľajší príjem",
          description: "Partner otvorene opisuje, na čo produkt používa",
          longDescription:
            "Partner pravidelne opisuje skutočné prípady z praxe a otvorene hovorí o provízii",
          characteristics: {
            disclosure: "Priznanie provízie hneď na začiatku",
            updates: "Týždenné príklady z praxe",
            income: "Príbeh o pasívnom príjme",
            proof: "Konkrétne výsledky z praxe",
            energy: "Otvorený, podnikavý tón",
          },
        },
        quietRecommendation: {
          name: "Nenápadné odporúčanie",
          description:
            "Profesionál bez veľkých slov odporúča vyskúšaný nástroj",
          longDescription:
            "Vecné odporúčanie nástroja po niekoľkých týždňoch skúšania",
          characteristics: {
            signal: "Stručné, iba podstatné informácie",
            specifics: "Konkrétne príklady",
            testing: "Skúsenosť z troch týždňov testovania",
            comparison: "Úprimné porovnanie s ChatGPT",
            affiliate: "Stručná zmienka o provízii",
          },
        },
        signupNurture: {
          name: "Začíname po registrácii",
          description: "Séria pre nových používateľov",
          longDescription: "Uvítacie e-maily a tipy, ako začať s platformou",
        },
        retention: {
          name: "Udržanie predplatiteľov",
          description: "Podpora aktivity súčasných predplatiteľov",
          longDescription:
            "Tipy a novinky, ktoré aktívnym predplatiteľom pomáhajú využívať ďalšie funkcie",
        },
        winback: {
          name: "Návrat používateľov",
          description:
            "Oslovenie neaktívnych používateľov alebo bývalých predplatiteľov",
          longDescription:
            "Kampaň pre používateľov, ktorí prestali službu využívať alebo zrušili predplatné",
        },
        newsletterMay2026: {
          name: "Newsletter máj 2026",
          description:
            "Jednorazový newsletter o Cortex, Dreameri, Autopilote a generovaní médií",
          longDescription:
            "Produktové novinky z mája 2026 pre všetkých registrovaných. Otvorene o chybách aj nových funkciách.",
        },
        newsletterNov2026: {
          name: "Newsletter november 2026",
          description:
            "Jednorazový newsletter na obnovenie aktivity: spoločník na tvojej strane, vlastné filtre a lacnejší predvolený model",
          longDescription:
            "Newsletter z novembra 2026 pre odberateľov s potvrdeným súhlasom. Predstavuje spoločníka AI a lacnejší predvolený model.",
        },
      },
    },
  },
};
