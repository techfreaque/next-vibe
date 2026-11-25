/**
 * Browser API translations (Slovak)
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  click: {
    title: "Kliknúť na prvok",
    titleShort: "Kliknúť",
    description:
      "Klikne na prvok podľa UID zo snímky stránky. Najprv vytvorte snímku cez take-snapshot.",
    dynamicTitle: "Kliknutie: {{uid}}",

    form: {
      label: "Kliknúť na prvok",
      description: "Klikne na konkrétny prvok na stránke",
      fields: {
        uid: {
          label: "UID prvku",
          description: "UID prvku zo snímky obsahu stránky",
          placeholder: "Zadajte UID prvku",
        },
        dblClick: {
          label: "Dvojité kliknutie",
          description:
            "Hodnota true vykoná dvojité kliknutie. Predvolená hodnota je false",
        },
      },
    },

    response: {
      success: "Kliknutie bolo úspešné",
      result: "Výsledok kliknutia",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri kliknutí nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie klikať",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Kliknutie nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný prvok sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri kliknutí nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri kliknutí nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri kliknutí nastal konflikt",
      },
    },

    success: {
      title: "Kliknutie úspešné",
      description: "Na prvok sa úspešne kliklo",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "close-page": {
    title: "Zavrieť kartu",
    titleShort: "Zavrieť kartu",
    description:
      "Zavrie aktuálnu kartu relácie. Poslednú otvorenú kartu nemožno zavrieť.",

    form: {
      label: "Zavrieť kartu",
      description: "Zavrie kartu prehliadača podľa indexu",
      fields: {
        pageIdx: {
          label: "Index karty",
          description:
            "Index karty na zatvorenie. Zoznam kariet získate cez list_pages",
          placeholder: "Zadajte index karty (napríklad 0)",
        },
      },
    },

    response: {
      success: "Karta sa úspešne zavrela",
      result: "Výsledok zatvorenia karty",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri zatváraní karty nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie zatvárať karty",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zatvorenie karty nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaná karta sa nenašla",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri zatváraní karty nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri zatváraní karty nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri zatváraní karty nastal konflikt",
      },
    },

    success: {
      title: "Karta úspešne zatvorená",
      description: "Karta sa úspešne zavrela",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      navigationAutomation: "Automatizácia navigácie",
    },
  },
  drag: {
    title: "Pretiahnuť prvok",
    titleShort: "Pretiahnuť",
    description:
      "Pretiahne prvok na iný prvok podľa ich UID. Identifikátory získate cez take-snapshot.",
    dynamicTitle: "Pretiahnuť: {{from}} → {{to}}",

    form: {
      label: "Pretiahnuť prvok",
      description: "Pretiahne prvok na iný prvok",
      fields: {
        from_uid: {
          label: "UID zdrojového prvku",
          description: "UID prvku, ktorý sa má pretiahnuť",
          placeholder: "Zadajte UID zdrojového prvku",
        },
        to_uid: {
          label: "UID cieľového prvku",
          description: "UID prvku, na ktorý sa má zdrojový prvok presunúť",
          placeholder: "Zadajte UID cieľového prvku",
        },
      },
    },

    response: {
      success: "Pretiahnutie bolo úspešné",
      result: "Výsledok pretiahnutia",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri preťahovaní nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie preťahovať prvky",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Pretiahnutie nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný prvok sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri preťahovaní nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri preťahovaní nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri preťahovaní nastal konflikt",
      },
    },

    success: {
      title: "Pretiahnutie úspešné",
      description: "Prvok sa úspešne pretiahol",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  fill: {
    title: "Vyplniť",
    titleShort: "Vyplniť",
    description:
      "Podľa UID zadá text do poľa input alebo textarea, prípadne vyberie možnosť z ponuky. UID získate cez take-snapshot.",
    dynamicTitle: "Vyplniť: {{uid}}",

    form: {
      label: "Vyplniť prvok",
      description: "Zadá text do prvku formulára",
      fields: {
        uid: {
          label: "UID prvku",
          description: "UID prvku zo snímky obsahu stránky",
          placeholder: "Zadajte UID prvku",
        },
        value: {
          label: "Hodnota",
          description: "Hodnota na vyplnenie",
          placeholder: "Zadajte hodnotu na vyplnenie",
        },
      },
    },

    response: {
      success: "Vyplnenie bolo úspešné",
      result: "Výsledok vyplnenia",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vyplňovaní nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vypĺňať prvky",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyplnenie nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri vyplňovaní nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vyplňovaní nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vyplňovaní nastal konflikt",
      },
    },

    success: {
      title: "Vyplnenie úspešné",
      description: "Prvok sa úspešne vyplnil",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "fill-form": {
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
    title: "Vyplniť formulár",
    titleShort: "Vyplniť formulár",
    description:
      "Vyplní naraz viac polí formulára podľa poľa UID. Je to efektívnejšie ako jednotlivé volania nástroja fill.",

    form: {
      label: "Vyplniť prvky formulára",
      description: "Vyplní naraz viac prvkov formulára",
      fields: {
        elements: {
          label: "Prvky formulára",
          description: "Pole prvkov zo snímky, ktoré sa majú vyplniť",
          placeholder: "Zadajte prvky formulára (pole JSON)",
          uid: {
            label: "UID prvku",
            description: "Jedinečný identifikátor prvku na vyplnenie",
          },
          value: {
            label: "Hodnota",
            description: "Hodnota, ktorá sa má zadať do prvku",
          },
        },
      },
    },

    response: {
      success: "Formulár sa úspešne vyplnil",
      result: {
        title: "Výsledok",
        description: "Výsledok vyplnenia formulára",
        filled: "Všetko vyplnené",
        filledCount: "Počet vyplnených",
        elements: {
          uid: "UID prvku",
          filled: "Úspešne vyplnené",
        },
      },
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vyplňovaní formulára nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vypĺňať formuláre",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vyplnenie formulára nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri vyplňovaní formulára nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vyplňovaní formulára nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vyplňovaní formulára nastal konflikt",
      },
    },

    success: {
      title: "Vyplnenie formulára úspešné",
      description: "Všetky prvky formulára sa úspešne vyplnili",
    },
  },
  "handle-dialog": {
    title: "Spracovať dialóg",
    titleShort: "Dialóg",
    description:
      "Potvrdí alebo zavrie dialóg prehliadača (alert/confirm/prompt). Zavolajte pred akciou, ktorá ho otvorí.",
    dynamicTitle: "Dialóg: {{action}}",

    form: {
      label: "Spracovať dialóg prehliadača",
      description: "Potvrdí alebo zavrie dialóg prehliadača",
      fields: {
        action: {
          label: "Akcia",
          description: "Či sa má dialóg zavrieť alebo potvrdiť",
          placeholder: "Vyberte akciu",
          options: {
            accept: "Potvrdiť",
            dismiss: "Zavrieť",
          },
        },
        promptText: {
          label: "Text výzvy",
          description: "Voliteľný text na zadanie do dialógu",
          placeholder: "Zadajte text výzvy (voliteľné)",
        },
      },
    },

    response: {
      success: "Dialóg sa úspešne spracoval",
      result: "Výsledok spracovania dialógu",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri spracovaní dialógu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie spracúvať dialógy",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Spracovanie dialógu nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri spracovaní dialógu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri spracovaní dialógu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri spracovaní dialógu nastal konflikt",
      },
    },

    success: {
      title: "Spracovanie dialógu úspešné",
      description: "Dialóg prehliadača sa úspešne spracoval",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      dialogAutomation: "Automatizácia dialógov",
    },
  },
  hover: {
    title: "Umiestniť kurzor",
    titleShort: "Umiestniť kurzor",
    description:
      "Podľa UID umiestni kurzor nad prvok a vyvolá popis alebo zobrazí skryté ovládacie prvky.",
    dynamicTitle: "Umiestniť kurzor: {{uid}}",

    form: {
      label: "Umiestniť kurzor nad prvok",
      description: "Presunie kurzor myši nad prvok",
      fields: {
        uid: {
          label: "UID prvku",
          description: "UID prvku zo snímky obsahu stránky",
          placeholder: "Zadajte UID prvku",
        },
      },
    },

    response: {
      success: "Umiestnenie kurzora bolo úspešné",
      result: "Výsledok umiestnenia kurzora",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri umiestňovaní kurzora nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie umiestňovať kurzor nad prvky",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Umiestnenie kurzora nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri umiestňovaní kurzora nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri umiestňovaní kurzora nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri umiestňovaní kurzora nastal konflikt",
      },
    },

    success: {
      title: "Umiestnenie kurzora úspešné",
      description: "Kurzor sa úspešne presunul nad prvok",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "press-key": {
    title: "Stlačiť kláves",
    titleShort: "Stlačiť kláves",
    dynamicTitle: "Kláves: {{key}}",
    description: "Stlačí kláves alebo kombináciu klávesov",
    form: {
      label: "Stlačiť kláves",
      description: "Stlačí kláves alebo kombináciu klávesov",
      fields: {
        key: {
          label: "Kláves",
          description:
            "Kláves alebo kombinácia, napríklad Enter, Control+A alebo Control+Shift+R",
          placeholder: "Zadajte kláves alebo kombináciu",
        },
      },
    },
    response: {
      success: "Stlačenie klávesu bolo úspešné",
      result: "Výsledok stlačenia klávesu",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri stlačení klávesu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie stláčať klávesy",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Stlačenie klávesu nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri stlačení klávesu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri stlačení klávesu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri stlačení klávesu nastal konflikt",
      },
    },
    success: {
      title: "Stlačenie klávesu úspešné",
      description: "Kláves sa úspešne stlačil",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "upload-file": {
    title: "Nahrať súbor",
    titleShort: "Nahrať",
    dynamicTitle: "Nahrať: {{file}}",
    description: "Nahrá súbor cez zadaný prvok",
    form: {
      label: "Nahrať súbor",
      description: "Nahrá súbor do poľa na výber súboru",
      fields: {
        uid: {
          label: "UID prvku",
          description:
            "UID poľa na výber súboru alebo prvku, ktorý otvorí výber súboru",
          placeholder: "Zadajte UID prvku",
        },
        filePaths: {
          label: "Cesty k súborom",
          description:
            "Absolútna cesta súboru na nahratie. Pri poli pre viac súborov možno zadať viac ciest. Súbory musia byť v priečinku projektu alebo v dočasnom priečinku OS.",
          placeholder: "/tmp/photo.png",
        },
        includeSnapshot: {
          label: "Zahrnúť snímku",
          description: "Po nahratí vráti snímku stránky",
        },
      },
    },
    response: {
      success: "Nahratie súboru bolo úspešné",
      result: "Výsledok nahratia súboru",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri nahrávaní súboru nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie nahrávať súbory",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Nahrávanie súboru nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri nahrávaní súboru nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri nahrávaní súboru nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri nahrávaní súboru nastal konflikt",
      },
    },
    success: {
      title: "Nahratie súboru úspešné",
      description: "Súbor sa úspešne nahral",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      inputAutomation: "Automatizácia vstupu",
    },
  },
  "list-pages": {
    title: "Zobraziť zoznam kariet",
    titleShort: "Karty",
    description:
      "Vypíše otvorené karty prehliadača a ich adresy URL. Každá relácia má jednu vlastnú kartu. Nástroj new-page ju nahradí.",
    form: {
      label: "Zobraziť zoznam kariet",
      description: "Načíta všetky otvorené karty prehliadača",
      fields: {},
    },
    response: {
      success: "Zoznam kariet sa úspešne načítal",
      result: {
        title: "Výsledok",
        description: "Výsledok načítania zoznamu kariet",
        pages: {
          idx: "Index",
          title: "Titulok",
          url: "URL",
          active: "Aktívna",
        },
        totalCount: "Celkový počet",
      },
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní zoznamu kariet nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vypísať karty",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vypísanie kariet nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní zoznamu kariet nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní zoznamu kariet nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní zoznamu kariet nastal konflikt",
      },
    },
    success: {
      title: "Karty úspešne načítané",
      description: "Zoznam otvorených kariet sa úspešne načítal",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      navigationAutomation: "Automatizácia navigácie",
    },
  },
  "navigate-page": {
    title: "Prejsť na stránku",
    titleShort: "Prejsť",
    dynamicTitle: "Prejsť: {{target}}",
    description:
      "Na karte relácie otvorí URL, posunie históriu dozadu alebo dopredu či obnoví stránku. Pri práci na rovnakej karte uprednostnite tento nástroj pred new-page.",
    form: {
      label: "Prejsť na stránku",
      description: "Otvorí URL na vybratej karte alebo prejde v jej histórii",
      fields: {
        type: {
          label: "Typ navigácie",
          description:
            "Otvorí URL, prejde v histórii dozadu či dopredu alebo obnoví stránku",
          placeholder: "Vyberte typ navigácie",
          options: {
            url: "URL",
            back: "Späť",
            forward: "Dopredu",
            reload: "Obnoviť",
          },
        },
        url: {
          label: "URL",
          description: "Cieľová adresa URL (iba pre type=url)",
          placeholder: "Zadajte adresu URL",
        },
        ignoreCache: {
          label: "Ignorovať vyrovnávaciu pamäť",
          description: "Či sa má pri obnovení ignorovať vyrovnávacia pamäť",
          placeholder: "Ignorovať vyrovnávaciu pamäť",
        },
        timeout: {
          label: "Časový limit",
          description:
            "Maximálny čas čakania v milisekundách. Hodnota 0 použije predvolený čas.",
          placeholder: "Zadajte časový limit",
        },
      },
    },
    response: {
      success: "Navigácia bola úspešná",
      result: "Výsledok navigácie",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri navigácii nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie prechádzať medzi stránkami",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Navigácia nie je povolená",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri navigácii nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri navigácii nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri navigácii nastal konflikt",
      },
    },
    success: {
      title: "Navigácia úspešná",
      description: "Prechod na stránku bol úspešný",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      navigationAutomation: "Automatizácia navigácie",
    },
  },
  "new-page": {
    title: "Nová karta",
    titleShort: "Nová karta",
    dynamicTitle: "Nová karta: {{url}}",
    description:
      "Otvorí novú kartu prehliadača na zadanej adrese URL. Relácia prevezme novú kartu a ďalšie volania budú pracovať s ňou.",
    form: {
      label: "Nová karta",
      description: "Vytvorí novú kartu prehliadača a načíta na nej URL",
      fields: {
        url: {
          label: "URL",
          description: "Adresa URL na načítanie na novej karte",
          placeholder: "Zadajte adresu URL",
        },
        replacePage: {
          label: "Nahradiť kartu",
          description: "Pred otvorením novej karty zavrie existujúce karty",
        },
        background: {
          label: "Na pozadí",
          description: "Otvorí kartu bez presunutia do popredia",
        },
        timeout: {
          label: "Časový limit",
          description:
            "Maximálny čas čakania v milisekundách. Hodnota 0 použije predvolený čas.",
          placeholder: "Zadajte časový limit",
        },
      },
    },
    response: {
      success: "Nová karta sa úspešne vytvorila",
      result: "Výsledok vytvorenia karty",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vytváraní karty nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vytvárať nové karty",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vytvorenie karty nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri vytváraní karty nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vytváraní karty nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vytváraní karty nastal konflikt",
      },
    },
    success: {
      title: "Nová karta úspešne vytvorená",
      description: "Nová karta sa úspešne vytvorila",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      navigationAutomation: "Automatizácia navigácie",
    },
  },
  "select-page": {
    title: "Vybrať kartu",
    titleShort: "Vybrať kartu",
    dynamicTitle: "Vybrať: {{page}}",
    description:
      "Prepne reláciu na kartu podľa indexu. Index získate cez list-pages. Sledovaná karta relácie zostane bez zmeny.",
    form: {
      label: "Vybrať kartu",
      description: "Vyberie kartu podľa indexu",
      fields: {
        pageIdx: {
          label: "Index karty",
          description:
            "Index karty na výber (zoznam kariet získate cez list_pages)",
          placeholder: "Zadajte index karty",
        },
      },
    },
    response: {
      success: "Výber karty bol úspešný",
      result: "Výsledok výberu karty",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri výbere karty nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vyberať karty",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Výber karty nie je povolený",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri výbere karty nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri výbere karty nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri výbere karty nastal konflikt",
      },
    },
    success: {
      title: "Karta úspešne vybraná",
      description: "Karta sa úspešne vybrala",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      navigationAutomation: "Automatizácia navigácie",
    },
  },
  emulate: {
    title: "Emulovať",
    titleShort: "Emulovať",
    description:
      "Simuluje sieťové podmienky (offline/3G/4G) alebo spomalenie CPU na aktuálnej stránke. Každé volanie nastaví hodnoty nanovo. Vynechané polia sa obnovia na predvolené hodnoty. Zmena identifikátora klienta (user agent) platí od ďalšej navigácie. Po zmene obnovte stránku.",
    dynamicTitle: "Emulovať: {{config}}",
    form: {
      label: "Emulovať zariadenie",
      description: "Simuluje sieťové podmienky a spomalenie CPU",
      fields: {
        networkConditions: {
          label: "Sieťové podmienky",
          description: "Obmedzí sieť. Na vypnutie zvoľte „Bez emulácie“.",
          placeholder: "Vyberte sieťové podmienky",
          options: {
            noEmulation: "Bez emulácie",
            offline: "Offline",
            slow3g: "Pomalé 3G",
            fast3g: "Rýchle 3G",
            slow4g: "Pomalé 4G",
            fast4g: "Rýchle 4G",
          },
        },
        cpuThrottlingRate: {
          label: "Miera spomalenia CPU",
          description:
            "Faktor spomalenia CPU od 1 do 20. Hodnota 1 spomalenie vypne.",
          placeholder: "Zadajte mieru spomalenia",
        },
      },
    },
    response: {
      success: "Emulácia bola úspešná",
      result: "Výsledok emulácie",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri emulácii nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie emulovať vlastnosti zariadenia",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Emulácia zariadenia nie je povolená",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri emulácii nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri emulácii nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri emulácii nastal konflikt",
      },
    },
    success: {
      title: "Emulácia úspešná",
      description: "Vlastnosti zariadenia sa úspešne emulovali",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      performanceAutomation: "Automatizácia výkonu",
    },
  },
  "resize-page": {
    title: "Zmeniť veľkosť stránky",
    titleShort: "Zmeniť veľkosť",
    dynamicTitle: "Zmeniť veľkosť: {{width}} × {{height}}",
    description: "Nastaví rozmery zobrazovacej oblasti prehliadača v pixeloch.",
    form: {
      label: "Zmeniť veľkosť stránky",
      description: "Zmení veľkosť stránky na zadané rozmery",
      fields: {
        width: {
          label: "Šírka",
          description: "Šírka stránky v pixeloch",
          placeholder: "Zadajte šírku",
        },
        height: {
          label: "Výška",
          description: "Výška stránky v pixeloch",
          placeholder: "Zadajte výšku",
        },
      },
    },
    response: {
      success: "Zmena veľkosti stránky bola úspešná",
      result: "Výsledok zmeny veľkosti stránky",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri zmene veľkosti stránky nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie meniť veľkosť stránok",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zmena veľkosti stránky nie je povolená",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri zmene veľkosti stránky nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri zmene veľkosti stránky nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri zmene veľkosti stránky nastal konflikt",
      },
    },
    success: {
      title: "Veľkosť stránky úspešne zmenená",
      description: "Veľkosť stránky sa úspešne zmenila",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      viewportAutomation: "Automatizácia zobrazovacej oblasti",
    },
  },
  "evaluate-script": {
    title: "Spustiť skript",
    titleShort: "Spustiť skript",
    description:
      "Spustí JavaScript na stránke a vráti výsledok. Používa sa na čítanie stavu, ktorý take-snapshot nezobrazuje.",
    dynamicTitle: "Skript: {{snippet}}",
    form: {
      label: "Spustiť skript",
      description: "Spustí JavaScript na stránke prehliadača",
      fields: {
        function: {
          label: "Funkcia",
          description: "Deklarácia funkcie JavaScript na spustenie",
          placeholder: "() => { return document.title; }",
        },
        args: {
          label: "Argumenty",
          description:
            "Voliteľný zoznam argumentov pre funkciu. Zadajte UID prvkov.",
          placeholder: '[{"uid": "element-uid"}]',
          uid: {
            label: "UID prvku",
            description: "Jedinečný identifikátor prvku na stránke",
          },
        },
      },
    },
    response: {
      success: "Skript sa úspešne vykonal",
      result: {
        title: "Výsledok",
        description: "Výsledok vykonania skriptu",
        executed: "Vykonané",
        result: "Návratová hodnota",
      },
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vykonávaní skriptu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie spúšťať skripty",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vykonávanie skriptov nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Pri vykonávaní skriptu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vykonávaní skriptu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vykonávaní skriptu nastal konflikt",
      },
    },
    success: {
      title: "Skript úspešne vykonaný",
      description: "JavaScript sa úspešne vykonal",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      scriptExecution: "Vykonávanie skriptov",
    },
  },
  "get-console-message": {
    title: "Získať správu z konzoly",
    titleShort: "Správa z konzoly",
    description:
      "Načíta úplný obsah správy z konzoly podľa msgid z list-console-messages.",
    dynamicTitle: "Konzola č. {{id}}",
    form: {
      label: "Získať správu z konzoly",
      description: "Načíta konkrétnu správu z konzoly",
      fields: {
        msgid: {
          label: "ID správy",
          description: "Identifikátor msgid správy zo zoznamu správ v konzole",
          placeholder: "Zadajte ID správy",
        },
      },
    },
    response: {
      success: "Správa z konzoly sa úspešne načítala",
      result: "Výsledok načítania správy z konzoly",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní správy z konzoly nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie načítavať správy z konzoly",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Načítanie správ z konzoly nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní správy z konzoly nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní správy z konzoly nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní správy z konzoly nastal konflikt",
      },
    },
    success: {
      title: "Správa z konzoly úspešne načítaná",
      description: "Správa z konzoly sa úspešne načítala",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      debugging: "Ladenie",
    },
  },
  "list-console-messages": {
    title: "Zobraziť správy z konzoly",
    titleShort: "Záznam konzoly",
    description:
      "Vypíše správy z konzoly od poslednej navigácie. Podporuje filter typu (error/warn/log). Po vykonaní akcie tak odhalíte chyby JavaScriptu.",
    form: {
      label: "Zobraziť správy z konzoly",
      description: "Načíta všetky správy z konzoly stránky",
      fields: {
        includePreservedMessages: {
          label: "Zahrnúť uchované správy",
          description:
            "Hodnota true vráti uchované správy z posledných 3 navigácií",
          placeholder: "false",
        },
        pageIdx: {
          label: "Index karty",
          description: "Číslo strany od 0. Pri vynechaní sa vráti prvá strana.",
          placeholder: "Zadajte index karty",
        },
        pageSize: {
          label: "Veľkosť stránky",
          description: "Najvyšší počet správ. Pri vynechaní sa vrátia všetky.",
          placeholder: "Zadajte veľkosť stránky",
        },
        types: {
          label: "Typy správ",
          description:
            "Vráti iba správy zadaných typov. Pri vynechaní vráti všetky.",
          placeholder: "Vyberte typy správ",
          options: {
            log: "Záznam",
            debug: "Ladenie",
            info: "Informácia",
            error: "Chyba",
            warn: "Upozornenie",
            dir: "Dir",
            dirxml: "Dirxml",
            table: "Tabuľka",
            trace: "Trasovanie",
            clear: "Vymazať",
            startGroup: "Začiatok skupiny",
            startGroupCollapsed: "Začiatok zbalenej skupiny",
            endGroup: "Koniec skupiny",
            assert: "Assert",
            profile: "Profil",
            profileEnd: "Koniec profilu",
            count: "Počet",
            timeEnd: "Koniec merania času",
            verbose: "Podrobné",
            issue: "Problém",
          },
        },
      },
    },
    response: {
      success: "Správy z konzoly sa úspešne načítali",
      result: {
        title: "Výsledok",
        description: "Výsledok načítania správ z konzoly",
        messages: {
          msgid: "ID správy",
          type: "Typ",
          text: "Správa",
          timestamp: "Časová pečiatka",
        },
        totalCount: "Celkový počet",
      },
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní správ z konzoly nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vypísať správy z konzoly",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vypísanie správ z konzoly nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní správ z konzoly nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní správ z konzoly nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní správ z konzoly nastal konflikt",
      },
    },
    success: {
      title: "Správy z konzoly úspešne načítané",
      description: "Správy z konzoly sa úspešne načítali",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      debugging: "Ladenie",
    },
  },
  "get-network-request": {
    title: "Získať sieťovú požiadavku",
    titleShort: "Sieťová požiadavka",
    description:
      "Načíta úplné údaje požiadavky vrátane hlavičiek a tela podľa reqid z list-network-requests.",
    dynamicTitle: "Sieť č. {{id}}",
    form: {
      label: "Získať sieťovú požiadavku",
      description: "Načíta konkrétnu sieťovú požiadavku alebo aktuálne vybranú",
      fields: {
        reqid: {
          label: "ID požiadavky",
          description:
            "Identifikátor reqid sieťovej požiadavky. Pri vynechaní sa načíta aktuálne vybraná požiadavka v DevTools.",
          placeholder: "Zadajte ID požiadavky",
        },
        maxBodyLength: {
          label: "Maximálna dĺžka tela",
          description:
            "Najvyšší počet znakov, ktoré sa majú vrátiť z tiel požiadavky a odpovede. Dlhšie telá sa skrátia a označia. Pri prázdnom poli sa limit nepoužije.",
          placeholder: "napríklad 10000",
        },
      },
    },
    response: {
      success: "Sieťová požiadavka sa úspešne načítala",
      result: "Výsledok načítania sieťovej požiadavky",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri načítavaní sieťovej požiadavky nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie načítavať sieťové požiadavky",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Načítanie sieťových požiadaviek nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní sieťovej požiadavky nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri načítavaní sieťovej požiadavky nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri načítavaní sieťovej požiadavky nastal konflikt",
      },
    },
    success: {
      title: "Sieťová požiadavka úspešne načítaná",
      description: "Sieťová požiadavka sa úspešne načítala",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      networkAnalysis: "Analýza siete",
    },
  },
  "list-network-requests": {
    title: "Zobraziť sieťové požiadavky",
    titleShort: "Sieťový záznam",
    description:
      "Vypíše sieťové požiadavky od poslednej navigácie. Podporuje filter podľa typu zdroja (fetch/xhr/doc). Umožňuje skontrolovať volania API.",
    form: {
      label: "Zobraziť sieťové požiadavky",
      description: "Načíta všetky sieťové požiadavky stránky",
      fields: {
        includePreservedRequests: {
          label: "Zahrnúť uchované požiadavky",
          description:
            "Hodnota true vráti uchované požiadavky z posledných 3 navigácií",
          placeholder: "false",
        },
        pageIdx: {
          label: "Index karty",
          description: "Číslo strany od 0. Pri vynechaní sa vráti prvá strana.",
          placeholder: "Zadajte index karty",
        },
        pageSize: {
          label: "Veľkosť stránky",
          description:
            "Najvyšší počet požiadaviek. Pri vynechaní sa vrátia všetky.",
          placeholder: "Zadajte veľkosť stránky",
        },
        resourceTypes: {
          label: "Typy zdrojov",
          description:
            "Vráti iba požiadavky zadaných typov. Pri vynechaní vráti všetky.",
          placeholder: "Vyberte typy zdrojov",
          options: {
            document: "Dokument",
            stylesheet: "Šablóna štýlov",
            image: "Obrázok",
            media: "Médiá",
            font: "Písmo",
            script: "Skript",
            texttrack: "Textová stopa",
            xhr: "XHR",
            fetch: "Fetch",
            prefetch: "Predbežné načítanie",
            eventsource: "EventSource",
            websocket: "WebSocket",
            manifest: "Manifest",
            signedexchange: "Signed Exchange",
            ping: "Ping",
            cspviolationreport: "Hlásenie porušenia CSP",
            preflight: "Preflight",
            fedcm: "FedCM",
            other: "Iné",
          },
        },
      },
    },
    response: {
      success: "Sieťové požiadavky sa úspešne načítali",
      result: {
        title: "Výsledok",
        description: "Výsledok načítania zoznamu sieťových požiadaviek",
        requests: {
          reqid: "ID požiadavky",
          url: "URL",
          method: "Metóda",
          status: "Stav",
          type: "Typ",
        },
        totalCount: "Celkový počet",
      },
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description:
          "Pri načítavaní zoznamu sieťových požiadaviek nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vypísať sieťové požiadavky",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vypísanie sieťových požiadaviek nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri načítavaní zoznamu sieťových požiadaviek nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description:
          "Pri načítavaní zoznamu sieťových požiadaviek nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description:
          "Pri načítavaní zoznamu sieťových požiadaviek nastal konflikt",
      },
    },
    success: {
      title: "Sieťové požiadavky úspešne načítané",
      description: "Sieťové požiadavky sa úspešne načítali",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      networkAnalysis: "Analýza siete",
    },
  },
  "performance-analyze-insight": {
    title: "Analyzovať zistenie o výkone",
    titleShort: "Zistenie o výkone",
    description:
      "Rozoberie konkrétne zistenie z merania výkonu, napríklad DocumentLatency alebo LCPBreakdown. Volajte po performance-stop-trace.",
    form: {
      label: "Analyzovať zistenie o výkone",
      description: "Získa podrobné údaje o konkrétnom zistení o výkone",
      fields: {
        insightSetId: {
          label: "ID skupiny zistení",
          description:
            "ID príslušnej skupiny zistení. Použite iba ID zo zoznamu dostupných skupín.",
          placeholder: "Zadajte ID skupiny zistení",
        },
        insightName: {
          label: "Názov zistenia",
          description:
            "Názov zistenia, ktoré chcete preskúmať, napríklad DocumentLatency alebo LCPBreakdown",
          placeholder: "Zadajte názov zistenia",
        },
      },
    },
    response: {
      success: "Zistenie o výkone sa úspešne analyzovalo",
      result: "Výsledok analýzy zistenia o výkone",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri analýze zistenia o výkone nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie analyzovať zistenia o výkone",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Analýza zistení o výkone nie je povolená",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri analýze zistenia o výkone nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri analýze zistenia o výkone nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri analýze zistenia o výkone nastal konflikt",
      },
    },
    success: {
      title: "Analýza zistenia o výkone úspešná",
      description: "Zistenie o výkone sa úspešne analyzovalo",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      performanceAutomation: "Automatizácia výkonu",
    },
  },
  "performance-start-trace": {
    title: "Spustiť meranie výkonu",
    titleShort: "Spustiť meranie",
    description:
      "Spustí meranie výkonu a zaznamená Core Web Vitals a ukazovatele načítania. Následne zavolajte performance-stop-trace.",
    form: {
      label: "Spustiť meranie výkonu",
      description: "Začne zaznamenávať ukazovatele výkonu stránky",
      fields: {
        reload: {
          label: "Obnoviť stránku",
          description:
            "Či sa má po spustení merania stránka automaticky obnoviť",
          placeholder: "true",
        },
        autoStop: {
          label: "Automaticky zastaviť",
          description: "Či sa má meranie zastaviť automaticky",
          placeholder: "true",
        },
      },
    },
    response: {
      success: "Meranie výkonu sa úspešne spustilo",
      result: "Výsledok spustenia merania výkonu",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri spúšťaní merania výkonu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie spúšťať merania výkonu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Spúšťanie meraní výkonu nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri spúšťaní merania výkonu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri spúšťaní merania výkonu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri spúšťaní merania výkonu nastal konflikt",
      },
    },
    success: {
      title: "Meranie výkonu úspešne spustené",
      description: "Meranie výkonu sa úspešne spustilo",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      performanceAutomation: "Automatizácia výkonu",
    },
  },
  "performance-stop-trace": {
    title: "Zastaviť meranie výkonu",
    titleShort: "Zastaviť meranie",
    description:
      "Zastaví prebiehajúce meranie a vráti ukazovatele výkonu s ID skupín zistení pre performance-analyze-insight.",
    form: {
      label: "Zastaviť meranie výkonu",
      description: "Zastaví zaznamenávanie prebiehajúceho merania výkonu",
      fields: {},
    },
    response: {
      success: "Meranie výkonu sa úspešne zastavilo",
      result: "Výsledok zastaveného merania vrátane ukazovateľov",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri zastavovaní merania výkonu nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie zastaviť meranie výkonu",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zastavenie merania výkonu nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri zastavovaní merania výkonu nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri zastavovaní merania výkonu nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri zastavovaní merania výkonu nastal konflikt",
      },
    },
    success: {
      title: "Meranie výkonu úspešne zastavené",
      description: "Meranie výkonu sa úspešne zastavilo",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      performanceAutomation: "Automatizácia výkonu",
    },
  },
  "take-screenshot": {
    title: "Zachytiť snímku obrazovky",
    titleShort: "Snímka obrazovky",
    dynamicTitle: "Snímka: {{target}}",
    description:
      "Zachytí stránku alebo konkrétny prvok ako obrázok. Umožní overiť stav rozhrania.",
    form: {
      label: "Zachytiť snímku obrazovky",
      description: "Zachytí snímku stránky prehliadača alebo prvku",
      fields: {
        uid: {
          label: "UID prvku",
          description:
            "UID prvku na zachytenie. Pri vynechaní sa zachytí stránka.",
          placeholder: "Zadajte UID prvku",
        },
        fullPage: {
          label: "Celá stránka",
          description:
            "Hodnota true zachytí celú stránku, nielen viditeľnú oblasť. Nedá sa použiť spolu s uid.",
          placeholder: "false",
        },
        format: {
          label: "Formát",
          description: "Formát, do ktorého sa snímka uloží (predvolene png)",
          placeholder: "png",
          options: {
            png: "PNG",
            jpeg: "JPEG",
            webp: "WebP",
          },
        },
        quality: {
          label: "Kvalita",
          description:
            "Kvalita kompresie JPEG a WebP od 0 do 100. Vyššia hodnota zvyšuje kvalitu aj veľkosť súboru. Pri PNG sa ignoruje.",
          placeholder: "80",
        },
        filePath: {
          label: "Cesta k súboru",
          description:
            "Absolútna cesta alebo cesta vzhľadom na pracovný priečinok, kam sa snímka uloží namiesto priloženia k odpovedi",
          placeholder: "/path/to/screenshot.png",
        },
      },
    },
    response: {
      success: "Snímka obrazovky sa úspešne zachytila",
      result: "Výsledok zachytenia snímky obrazovky",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri zachytávaní snímky obrazovky nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie zachytávať snímky obrazovky",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Zachytávanie snímok obrazovky nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri zachytávaní snímky obrazovky nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri zachytávaní snímky obrazovky nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri zachytávaní snímky obrazovky nastal konflikt",
      },
    },
    success: {
      title: "Snímka obrazovky úspešne zachytená",
      description: "Snímka obrazovky sa úspešne zachytila",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      captureAutomation: "Automatizácia snímania",
    },
  },
  "take-snapshot": {
    title: "Vytvoriť snímku stránky",
    titleShort: "Snímka stránky",
    description:
      "Vráti strom prístupnosti stránky ako text. Potrebný pred volaním click, fill alebo drag, pretože poskytuje UID prvkov.",
    form: {
      label: "Vytvoriť snímku stránky",
      description: "Vytvorí textovú snímku stránky podľa stromu prístupnosti",
      fields: {
        verbose: {
          label: "Podrobné",
          description:
            "Či sa majú zahrnúť všetky dostupné údaje z úplného stromu prístupnosti. Predvolená hodnota je false",
          placeholder: "false",
        },
        filePath: {
          label: "Cesta k súboru",
          description:
            "Absolútna cesta alebo cesta vzhľadom na pracovný priečinok, kam sa snímka stránky uloží namiesto priloženia k odpovedi",
          placeholder: "/path/to/snapshot.txt",
        },
      },
    },
    response: {
      success: "Snímka stránky sa úspešne vytvorila",
      result: "Výsledok vytvorenia snímky stránky",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },
    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Pri vytváraní snímky stránky nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vytvárať snímky stránok",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Vytváranie snímok stránok nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description:
          "Pri vytváraní snímky stránky nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Pri vytváraní snímky stránky nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri vytváraní snímky stránky nastal konflikt",
      },
    },
    success: {
      title: "Snímka stránky úspešne vytvorená",
      description: "Snímka stránky sa úspešne vytvorila",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      captureAutomation: "Automatizácia snímania",
    },
  },
  "wait-for": {
    title: "Počkať na text",
    titleShort: "Počkať",
    dynamicTitle: "Počkať: {{text}}",
    description:
      "Počká, kým sa na stránke zobrazí zadaný text. Použite po navigácii alebo akcii, ktorá vyvolá asynchrónnu aktualizáciu.",

    form: {
      label: "Počkať na text",
      description: "Počká, kým sa na stránke zobrazí zadaný text",
      fields: {
        text: {
          label: "Text",
          description: "Text, ktorý sa má zobraziť na stránke",
          placeholder: "Zadajte očakávaný text",
        },
        timeout: {
          label: "Časový limit",
          description:
            "Maximálny čas čakania v milisekundách. Hodnota 0 použije predvolený časový limit.",
          placeholder: "Zadajte časový limit (ms)",
        },
        captureSnapshot: {
          label: "Zahrnúť snímku stránky",
          description:
            "Po zapnutí zahrnie do odpovede úplnú snímku prístupnosti. Predvolene je vypnuté, aby odpoveď zostala krátka.",
        },
      },
    },

    response: {
      success: "Čakanie bolo úspešné",
      result: "Výsledok čakania",
      error: "Chybové hlásenie",
      executionId: "ID vykonania na sledovanie",
    },

    errors: {
      validation: {
        title: "Chyba overenia údajov",
        description: "Skontrolujte zadanie a skúste znova",
      },
      network: {
        title: "Chyba siete",
        description: "Počas čakania nastala chyba siete",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Nemáte oprávnenie vykonávať operácie čakania",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Čakanie nie je povolené",
      },
      notFound: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel",
      },
      serverError: {
        title: "Chyba servera",
        description: "Počas čakania nastala interná chyba servera",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Počas čakania nastala neznáma chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
      },
      conflict: {
        title: "Konflikt",
        description: "Počas čakania nastal konflikt",
      },
    },

    success: {
      title: "Čakanie úspešné",
      description: "Zadaný text sa zobrazil na stránke",
    },
    category: "Prehliadač",
    tags: {
      browserAutomation: "Automatizácia prehliadača",
      waitAutomation: "Automatizácia čakania",
    },
  },
  title: "Nástroje Chrome DevTools MCP",
  description:
    "Automatizácia prehliadača cez Chrome DevTools. Postup: new-page → take-snapshot → interakcia (click/fill) → overenie.",
  category: "Prehliadač",
  summary:
    "Prístup k nástrojom Chrome DevTools Protocol cez MCP na automatizáciu webu",
  tags: {
    browserAutomation: "Automatizácia prehliadača",
    chromeDevTools: "Chrome DevTools",
    mcpTools: "Nástroje MCP",
    webDebugging: "Ladenie webu",
    performanceAnalysis: "Analýza výkonu",
    inputAutomation: "Automatizácia vstupu",
    captureAutomation: "Automatizácia snímania",
    debugging: "Ladenie",
    dialogAutomation: "Automatizácia dialógov",
    navigationAutomation: "Automatizácia navigácie",
    networkAnalysis: "Analýza siete",
    performanceAutomation: "Automatizácia výkonu",
    scriptExecution: "Vykonávanie skriptov",
    viewportAutomation: "Automatizácia zobrazovacej oblasti",
    waitAutomation: "Automatizácia čakania",
  },

  form: {
    label: "Vykonať nástroj prehliadača",
    description:
      "Spustí nástroje Chrome DevTools MCP na ovládanie a analýzu prehliadača",
    fields: {
      tool: {
        label: "Nástroj",
        description: "Vyberte nástroj Chrome DevTools MCP na spustenie",
        placeholder: "Vyberte nástroj…",
      },
      arguments: {
        label: "Argumenty",
        description: "Argumenty JSON pre vybraný nástroj (voliteľné)",
        placeholder: '{"url": "https://example.com"}',
      },
    },
  },

  tool: {
    // Input automation tools (8)
    click: "Kliknúť na prvok",
    drag: "Pretiahnuť prvok",
    fill: "Vyplniť vstupné pole",
    fillForm: "Vyplniť formulár",
    handleDialog: "Spracovať dialóg",
    hover: "Umiestniť kurzor nad prvok",
    pressKey: "Stlačiť kláves",
    uploadFile: "Nahrať súbor",

    // Navigation automation tools (6)
    closePage: "Zavrieť kartu",
    listPages: "Zobraziť zoznam kariet",
    navigatePage: "Prejsť na stránku",
    newPage: "Nová karta",
    selectPage: "Vybrať kartu",
    waitFor: "Počkať na text",

    // Emulation tools (2)
    emulate: "Emulovať zariadenie",
    resizePage: "Zmeniť veľkosť stránky",

    // Performance tools (3)
    performanceAnalyzeInsight: "Analyzovať zistenie o výkone",
    performanceStartTrace: "Spustiť meranie výkonu",
    performanceStopTrace: "Zastaviť meranie výkonu",

    // Network tools (2)
    getNetworkRequest: "Získať sieťovú požiadavku",
    listNetworkRequests: "Zobraziť sieťové požiadavky",

    // Debugging tools (5)
    evaluateScript: "Spustiť skript",
    getConsoleMessage: "Získať správu z konzoly",
    listConsoleMessages: "Zobraziť správy z konzoly",
    takeScreenshot: "Zachytiť snímku obrazovky",
    takeSnapshot: "Vytvoriť snímku stránky",
  },

  status: {
    pending: "Čaká",
    running: "Prebieha",
    completed: "Dokončené",
    failed: "Zlyhalo",
  },

  response: {
    success: "Nástroj sa úspešne vykonal",
    result: "Výsledok vykonania",
    status: "Aktuálny stav vykonania",
    statusItem: "Položka stavu",
    executionId: "ID vykonania na sledovanie",
  },

  examples: {
    requests: {
      navigate: {
        title: "Prejsť na adresu URL",
        description: "Otvorí v prehliadači zadanú adresu URL",
      },
      screenshot: {
        title: "Zachytiť snímku obrazovky",
        description: "Zachytí snímku aktuálnej stránky",
      },
      click: {
        title: "Kliknúť na prvok",
        description: "Klikne na konkrétny prvok",
      },
      performance: {
        title: "Spustiť meranie výkonu",
        description: "Začne zaznamenávať ukazovatele výkonu",
      },
      script: {
        title: "Spustiť skript",
        description: "Spustí JavaScript v prehliadači",
      },
    },
    responses: {
      navigate: {
        title: "Výsledok navigácie",
        description: "Výsledok prechodu na stránku",
      },
      screenshot: {
        title: "Výsledok snímky obrazovky",
        description: "Výsledok zachytenia snímky obrazovky",
      },
      click: {
        title: "Výsledok kliknutia",
        description: "Výsledok kliknutia na prvok",
      },
      performance: {
        title: "Meranie výkonu spustené",
        description: "Meranie výkonu sa spustilo",
      },
      script: {
        title: "Výsledok vykonania skriptu",
        description: "Výsledok vykonania JavaScriptu",
      },
    },
  },

  errors: {
    toolExecutionFailed: {
      title: "Vykonanie nástroja zlyhalo",
      description: "Vybraný nástroj sa nepodarilo vykonať",
    },
    invalidArguments: {
      title: "Neplatné argumenty",
      description: "Zadané argumenty nie sú platné pre tento nástroj",
    },
    browserNotAvailable: {
      title: "Prehliadač nie je dostupný",
      description: "Inštancia prehliadača Chrome nie je dostupná",
    },
    toolNotFound: {
      title: "Nástroj sa nenašiel",
      description: "Požadovaný nástroj nie je dostupný",
    },
    validation: {
      title: "Chyba overenia údajov",
      description: "Skontrolujte zadanie a skúste znova",
      toolRequired: "Vyberte nástroj",
      argumentsInvalid: "Argumenty musia byť platný JSON",
    },
    network: {
      title: "Chyba siete",
      description: "Pri vykonávaní nástroja nastala chyba siete",
    },
    unauthorized: {
      title: "Vyžaduje sa prihlásenie",
      description: "Nemáte oprávnenie spúšťať nástroje prehliadača",
    },
    forbidden: {
      title: "Prístup zamietnutý",
      description: "Vykonávanie nástrojov prehliadača nie je povolené",
    },
    notFound: {
      title: "Nenašlo sa",
      description: "Požadovaný nástroj prehliadača sa nenašiel",
    },
    serverError: {
      title: "Chyba servera",
      description: "Pri vykonávaní nástroja nastala interná chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Pri vykonávaní nástroja nastala neznáma chyba",
    },
    unsavedChanges: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny, ktoré sa môžu stratiť",
    },
    conflict: {
      title: "Konflikt",
      description: "Pri vykonávaní nástroja nastal konflikt",
    },
  },

  success: {
    title: "Nástroj úspešne vykonaný",
    description: "Nástroj prehliadača sa úspešne vykonal",
  },

  shared: {
    addItem: "Pridať položku",
    removeItem: "Odstrániť poslednú položku",
    back: "Späť",
    instanceId: {
      label: "ID relácie",
      description:
        "ID relácie prehliadača. Každé jedinečné ID má vlastnú izolovanú kartu. Pri prázdnom poli sa použije predvolená relácia.",
      placeholder: "napríklad my-session-1",
    },
  },

  repository: {
    execute: {
      start: "Začína sa vykonávanie nástroja prehliadača",
      success: "Nástroj prehliadača sa úspešne vykonal",
      error: "Chyba pri vykonávaní nástroja prehliadača",
    },
    mcp: {
      connect: {
        start: "Pripája sa k serveru Chrome DevTools MCP",
        success: "Pripojenie k serveru MCP sa podarilo",
        error: "K serveru MCP sa nepodarilo pripojiť",
        failedToInitialize:
          "Server Chrome DevTools MCP sa nepodarilo inicializovať",
      },
      closePage: {
        noSession: "Žiadna aktívna relácia. Nie je čo zatvoriť.",
        switchedToPage: "Karta bola zatvorená. Aktívna karta: {{pageId}}",
        closedPage: "Karta {{pageId}} bola zatvorená",
        pageNotInSession: "Karta {{pageId}} nepatrí do tejto relácie",
      },
      tool: {
        call: {
          start: "Volá sa nástroj MCP",
          success: "Volanie nástroja MCP bolo úspešné",
          error: "Chyba pri volaní nástroja MCP",
          invalidJsonArguments: "Neplatné argumenty JSON",
          executionFailed: "Vykonanie nástroja zlyhalo: {{error}}",
          newPageFailed: "Novú kartu sa nepodarilo otvoriť",
          toolExecutionFailed: "Nástroj {{toolName}} sa nepodarilo vykonať",
        },
      },
    },
  },
};
