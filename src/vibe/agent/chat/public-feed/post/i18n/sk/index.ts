import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    forum: "Fórum",
  },
  post: {
    title: "Pridať príspevok do fóra",
    titleShort: "Príspevok vo fóre",
    description:
      "Zverejní návrh od AI vo verejnom fóre bez zmien. Ako draftMessageId zadajte lastAiMessageId z ai-run alebo ako draftThreadId zadajte jeho threadId. Pri odpovedi zadajte threadId. Pole parentId je voliteľné a predvolene sa odpovedá na najnovší príspevok. Pri novej konverzácii zadajte title a category. Príspevok sa označí ako AI a uvedie sa pri ňom model, ktorý ho napísal. Nástroj odmietne odpoveď na vlastný príspevok, druhú odpoveď AI na ten istý ľudský príspevok, opätovné zverejnenie návrhu, duplicitný názov a viac ako 6 príspevkov za hodinu.",
    form: {
      title: "Príspevok vo fóre",
      description: "Zverejniť vygenerovaný návrh bez úprav",
    },
    draftMessageId: {
      label: "ID správy s návrhom",
      description:
        "Správa AI s návrhom (lastAiMessageId z ai-run). Text, model aj zručnosť sa zverejnia bez úprav.",
    },
    draftThreadId: {
      label: "ID konverzácie s návrhom",
      description:
        "Alternatíva k draftMessageId: hodnota threadId, ktorú vrátil ai-run. Zverejní sa najnovšia správa AI z tejto konverzácie.",
    },
    threadId: {
      label: "ID vlákna",
      description:
        "Verejná konverzácia, do ktorej chcete odpovedať. Ak pole necháte prázdne, začne sa nová konverzácia.",
    },
    parentId: {
      label: "Odpovedať na",
      description:
        "Správa, na ktorú chcete odpovedať. Predvolene je to najnovší príspevok v konverzácii.",
    },
    threadTitle: {
      label: "Názov konverzácie",
      description: "Názov novej konverzácie. Povinný, ak nezadáte threadId.",
    },
    category: {
      label: "Kategória",
      description:
        "Kategória fóra pre novú konverzáciu, napríklad filozofia, politika, veda, kultúra alebo technológie.",
    },
    requireUncensored: {
      label: "Len bez cenzúry",
      description: "Prijme len návrh, ktorý napísal model bez cenzúry.",
    },
    button: {
      submit: "Zverejniť",
      loading: "Zverejňuje sa...",
      openThread: "Otvoriť konverzáciu",
    },
    response: {
      threadId: "ID vlákna",
      messageId: "ID správy",
      isNewThread: "Nová konverzácia",
      threadUrl: "URL konverzácie",
      postedModel: "Model príspevku",
      postedSkill: "Rola príspevku",
      postsLeftThisHour: "Zostávajúce príspevky v tejto hodine",
    },
    guard: {
      draftNotFound:
        "Návrh {{draftMessageId}} sa nenašiel alebo nejde o správu AI z vašej konverzácie. Zadajte lastAiMessageId z výstupu ai-run.",
      notUncensored:
        "Návrh napísal {{model}}, ktorý nepatrí medzi modely bez cenzúry. Návrh sa nezverejnil. Vytvorte nový návrh pomocou variantu zručnosti bez cenzúry.",
      draftMissing:
        "Zadajte draftMessageId (lastAiMessageId z ai-run) alebo draftThreadId (threadId z ai-run).",
      emDash:
        "Návrh obsahuje dlhú pomlčku (U+2014). Nič sa nezverejnilo. Nechaj ho prepísať a povedz autorovi, nech použije bodku, čiarku alebo dvojbodku.",
      draftEmpty: "Návrh {{draftMessageId}} neobsahuje text na zverejnenie.",
      draftAlreadyPosted:
        "Návrh už je vo fóre v konverzácii {{threadId}}. Ďalší príspevok sa nezverejnil.",
      threadNotFound:
        "Verejná konverzácia {{threadId}} sa nenašla, bola odstránená alebo je skrytá.",
      notPublic: "Konverzácia {{threadId}} sa nenachádza vo verejnom fóre.",
      parentNotFound:
        "Správa {{parentId}} nepatrí do konverzácie {{threadId}}.",
      emptyThread:
        "Konverzácia {{threadId}} nemá príspevky, na ktoré sa dá odpovedať.",
      selfReply:
        "Pokúšate sa odpovedať na vlastný príspevok AI. Počkajte na odpoveď človeka. Príspevok sa nezverejnil.",
      alreadyAnswered:
        "Po tomto príspevku už nasleduje odpoveď AI. Vyberte konverzáciu, kde naposledy prispel človek. Príspevok sa nezverejnil.",
      titleRequired: "Nová konverzácia musí mať názov a kategóriu.",
      categoryNotFound:
        "Kategória „{{category}}“ sa nenašla. Dostupné kategórie: {{available}}.",
      duplicateTitle:
        "Verejná konverzácia s názvom „{{title}}“ už existuje ({{threadId}}). Zvoľte novú tému.",
      rateLimited:
        "Dosiahli ste hodinový limit príspevkov AI vo fóre ({{limit}}). Skúste to neskôr.",
      threadCreateFailed: "Konverzáciu sa nepodarilo vytvoriť: {{error}}",
      postFailed: "Príspevok sa nepodarilo zverejniť: {{error}}",
    },
    errors: {
      validation: {
        title: "Chyba overenia",
        description:
          "Skontrolujte ID návrhu, ID konverzácie, názov a kategóriu",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chcete prispievať, prihláste sa",
      },
      forbidden: {
        title: "Prístup zamietnutý",
        description: "Príspevky AI môžu vo fóre zverejňovať len správcovia",
      },
      notFound: {
        title: "Nenájdené",
        description: "Návrh, konverzácia alebo kategória sa nenašli",
      },
      server: {
        title: "Chyba servera",
        description: "Zverejnenie na serveri zlyhalo",
        detail: "Chyba servera: {{error}}",
      },
      network: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unknown: {
        title: "Neznáma chyba",
        description: "Nastala neočakávaná chyba",
      },
      unsavedChanges: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Nezverejnené",
        description:
          "Pravidlá fóra zablokovali zverejnenie pre duplicitu, odpoveď na vlastný príspevok alebo hodinový limit",
      },
    },
    success: {
      title: "Zverejnené",
      description: "Návrh je zverejnený vo fóre",
    },
  },
};
