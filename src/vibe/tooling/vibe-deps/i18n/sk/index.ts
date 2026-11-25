import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Vibe Deps",
  titleShort: "Závislosti",
  description:
    "Analyzuje graf importov v celom kóde a kontroluje hranice balíkov. --mode=files, --mode=categories a --mode=unused zobrazia graf importov a nepoužitý kód. --mode=boundaries ukáže importy z aplikačného kódu do balíkov, ktoré treba vyriešiť pred oddelením balíka. --mode=layers označí nepovolený smer závislosti medzi balíkmi. --mode=shared-candidates zoradí spoločné časti aplikačného kódu, od ktorých už závisia balíky. --mode=importers --focus=X rozdelí importy vybraného súboru podľa balíkov.",
  category: "Vývojárske nástroje",
  tag: "analýza",

  mode: {
    report: "Správa",
    files: "Súbory",
    categories: "Kategórie",
    unused: "Nepoužité",
    boundaries: "Hranice",
    layers: "Vrstvy",
    sharedCandidates: "Kandidáti na zdieľanie",
    importers: "Importujúce súbory",
    needsMove: "Na presun",
    unusedSymbols: "Nepoužité symboly",
    unusedI18n: "Nepoužité kľúče i18n",
    crossDomain: "Medzi doménami",
    pageViolations: "Porušenia pravidiel stránok",
  },

  container: {
    title: "Analýza závislostí",
    description: "Nastaviť rozsah a režim analýzy závislostí",
  },

  fields: {
    focus: {
      label: "Cieľová cesta",
      description:
        "Obmedziť analýzu na súbor alebo priečinok, napríklad agent/ai-stream alebo user. Prázdne pole zahrnie celý kód.",
      placeholder: "napr. agent/ai-stream alebo user",
    },
    mode: {
      label: "Režim",
      description:
        "files: graf importov podľa súborov. categories: súhrn podľa nadradeného priečinka. unused: súbory bez importov z iných súborov. boundaries: importy aplikačného kódu do balíkov. layers: nepovolený smer závislostí medzi balíkmi. shared-candidates: základné časti aplikácie, od ktorých závisia balíky. importers: súbory, ktoré importujú vybraný súbor, zoskupené podľa balíka (vyžaduje --focus).",
    },
    package: {
      label: "Balík",
      description:
        "Obmedziť režimy boundaries a layers na jeden deklarovaný balík, napríklad vibe-ui alebo vibe-unified-ui. Prázdne pole zahrnie všetky balíky.",
      placeholder: "napr. vibe-unified-ui",
    },
    depth: {
      label: "Hĺbka",
      description:
        "Počet úrovní tranzitívnych závislostí (predvolene 1, iba priame závislosti). Hodnota 0 znamená bez obmedzenia.",
    },
    limit: {
      label: "Limit",
      description: "Najvyšší počet výsledkov (predvolene 100).",
    },
  },

  response: {
    success: "Analýza závislostí dokončená",
    entries: {
      title: "Závislosti",
      emptyState: {
        description: "Žiaden súbor sa nezhodoval s daným filtrom.",
      },
      importedBy: "importujú",
    },
    summary: {
      title: "Zhrnutie",
      totalFiles: "Celkový počet skontrolovaných súborov",
      totalEdges: "Celkový počet väzieb importu",
      unusedCount: "Nepoužité exporty",
    },
    boundaries: {
      title: "Hranice balíkov",
      cleanState: "Hranice balíkov sú dodržané. Balíky sú samostatné.",
      legendTitle: "Vysvetlivky",
      legendOut: "mimo balíka (balík importuje aplikačný kód)",
      legendCross: "medzi balíkmi (nepovolená závislosť)",
      legendReverse: "opačný smer (nižšia vrstva importuje vyššiu)",
      legendHot:
        "výrazný cieľ (aspoň 10 importujúcich modulov, najsilnejšia väzba na jadro)",
      colTarget: "Cieľ",
      colCount: "použitie",
      colKind: "druh",
      packageHeader: "balík",
      violationsAcross: "porušenia v",
      packagesWord: "balíkoch",
    },
    layers: {
      title: "Smer závislostí medzi vrstvami",
      cleanState: "Importy medzi balíkmi majú povolený smer.",
      edge: "importuje",
    },
    sharedCandidates: {
      title: "Kandidáti na zdieľanie",
      description:
        "Súbory aplikačného kódu zoradené podľa počtu balíkov, ktoré ich importujú. Najpoužívanejšie sú kandidátmi na presun do vibe-core.",
      colCount: "počet importujúcich balíkov",
      colPath: "cesta",
      emptyState: "Balíky neimportujú žiadne súbory aplikácie.",
    },
    importers: {
      title: "Importujúce súbory podľa balíkov",
      colCount: "použitie",
      colGroup: "balík alebo kategória",
    },
    needsMove: {
      title: "Zoznam presunov",
      description:
        "Súbory, ktoré ešte nie sú na cieľovom mieste, zoskupené podľa cieľovej oblasti. Výnimky v zozname povolených súborov sa nezobrazujú. Presúvajte ich v zobrazenom poradí zhora nadol.",
      colTarget: "→ oblasť",
      colPath: "súbor",
      emptyState: "Všetky súbory v tomto rozsahu sú na svojom mieste.",
      relocate: "premiestnenie",
      reorganize: "reorg",
    },
    unusedSymbols: {
      title: "Nepoužité verejné rozhranie",
      description:
        "Nepoužité exporty, nepoužité statické metódy a súbory, ktoré nič neimportuje. Zistenia vychádzajú z regulárnych výrazov. Dynamické použitie môže uniknúť kontrole.",
      colKind: "druh",
      colSymbol: "symbol",
      colPath: "súbor",
      emptyState:
        "V danom rozsahu sa nenašli nepoužité časti verejného rozhrania.",
      wholeFile: "(celý súbor bez importov z iných súborov)",
    },
    unusedI18n: {
      title: "Nepoužité kľúče i18n",
      description:
        "Kľúče v anglických prekladoch danej oblasti bez odkazu zo zdrojového súboru. Predpony šablón ako t(`a.b.<x>`) chránia celý podstrom. Odstráňte kľúče z en, de aj pl naraz.",
      colKey: "kľúč",
      colPath: "súbor",
      emptyState: "V rozsahu sa používa každý prekladový kľúč.",
    },
    pageViolations: {
      title: "Porušenia architektúry stránok",
      description:
        "Súbory page.tsx importujú aj iné moduly než repository, definition, i18n a page-client. Stránky majú slúžiť iba ako obal pre SSR. Aplikačná logika, UI, enumy a prístup k databáze patria do repository.ts alebo page-client.tsx.",
      colCount: "porušenia",
      colPath: "stránka",
      emptyState: "Všetky súbory page.tsx spĺňajú pravidlá architektúry.",
    },
    crossDomain: {
      title: "Kandidáti na presun medzi doménami",
      description:
        "Importy prekračujúce hranice domén mimo povolených základných častí frameworku. Pri každom zvážte presun do vibe (engine/core) alebo oddelenie závislosti. Najpoužívanejšie sú na začiatku. Povolené väzby sa počítajú samostatne.",
      colCount: "použitie",
      colTarget: "často importovaný súbor",
      emptyState:
        "Žiadne nepreskúmané väzby medzi doménami. Všetky nájdené väzby sú povolené.",
      allowedTally: "povolené väzby na základné časti (nezobrazujú sa)",
    },
    violations: {
      title: "Porušenia",
      outOfPackage: "Mimo balíka",
      crossPackage: "Medzi balíkmi",
      reverseDirection: "Opačný smer",
      total: "Spolu",
    },
  },

  errors: {
    validation: {
      title: "Neplatné parametre",
      description: "Parametre analýzy závislostí sú neplatné",
    },
    internal: {
      title: "Interná chyba",
      description: "Pri analýze závislostí nastala interná chyba.",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Na analýzu závislostí nemáte oprávnenie.",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Prístup k analýze závislostí je zakázaný",
    },
    notFound: {
      title: "Nenájdené",
      description: "Zadaná cesta sa nenašla",
    },
    focusNotFound: "Zvolenej ceste {{focus}} nezodpovedajú žiadne súbory",
    server: {
      title: "Chyba servera",
      description: "Pri analýze závislostí nastala chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Pri analýze závislostí nastala neznáma chyba",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Máte neuložené zmeny",
    },
    conflict: {
      title: "Konflikt",
      description: "Pri analýze závislostí nastal konflikt",
    },
  },

  success: {
    title: "Analýza dokončená",
    description: "Analýza závislostí sa úspešne dokončila",
  },
};
