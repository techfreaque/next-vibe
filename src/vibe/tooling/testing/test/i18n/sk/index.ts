import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Spustiť testy",
  titleShort: "Spustiť testy",
  description: "Spustiť sadu testov s voliteľnými nastaveniami",
  category: "Testovanie",
  tag: "Testovanie",

  container: {
    title: "Nastavenia testovania",
    description: "Nastaviť parametre spustenia testov",
  },

  fields: {
    path: {
      label: "Cesta k testom",
      description: "Cesta k testovacím súborom alebo priečinku",
      placeholder: "src/",
    },
    verbose: {
      label: "Podrobný výstup",
      description: "Zobraziť podrobný výstup testov",
    },
    watch: {
      label: "Režim sledovania",
      description: "Spustiť testy v režime sledovania zmien súborov",
    },
    coverage: {
      label: "Správa o pokrytí",
      description: "Vygenerovať správu o pokrytí testami",
    },
  },

  response: {
    success: "Stav vykonania testov",
    output: "Výstup a výsledky testov",
    duration: "Trvanie testov (ms)",
  },

  errors: {
    validation: {
      title: "Chyba overenia",
      description: "Neplatné parametre nastavení testovania",
    },
    internal: {
      title: "Interná chyba",
      description: "Testy zlyhali pre internú chybu",
    },
    unauthorized: {
      title: "Bez oprávnenia",
      description: "Na spúšťanie testov nemáte oprávnenie",
    },
    forbidden: {
      title: "Prístup zakázaný",
      description: "Testovanie je zakázané.",
    },
    notFound: {
      title: "Nenájdené",
      description: "Testovacie súbory alebo priečinok sa nenašli",
    },
    server: {
      title: "Chyba servera",
      description: "Pri spúšťaní testov nastala chyba servera",
    },
    unknown: {
      title: "Neznáma chyba",
      description: "Vyskytla sa neočakávaná chyba",
    },
    unsaved: {
      title: "Neuložené zmeny",
      description: "Neuložené zmeny môžu ovplyvniť testy",
    },
    conflict: {
      title: "Konflikt",
      description: "Pri spúšťaní testov sa zistil konflikt",
    },
    executionFailed: "Testy zlyhali po {{duration}} ms: {{detail}}\n{{output}}",
    // The EN wording of `streamingUnsupported` is load-bearing: test-endpoint.ts
    // probes response messages for "Streaming responses are not supported" to tell
    // test-infrastructure failures from real endpoint errors. Keep that substring.
    streamingUnsupported: "Testy nepodporujú priebežne prenášané odpovede",
    responseSchemaFailed:
      "Overenie schémy odpovede pre {{path}} zlyhalo: {{issues}}",
    requestFailed: "Požiadavka na test zlyhala: {{detail}}",
    browser: {
      serverNotRunning:
        "Vývojový server Atlas nebeží. Spustite ho príkazom vibe dev.",
      openFailed: "Stránku sa nepodarilo otvoriť v prehliadači: {{detail}}",
      fillFailed: "Nepodarilo sa vyplniť polia formulára: {{detail}}",
      submitFailed: "Nepodarilo sa kliknúť na tlačidlo odoslania: {{detail}}",
      evaluateFailed: "Vykonanie skriptu na stránke zlyhalo: {{detail}}",
      resultTimeout: "Výsledok mutácie neprišiel do {{timeoutMs}} ms",
      parseFailed:
        "Odpoveď z vyrovnávacej pamäte sa nepodarilo spracovať ako JSON: {{raw}}",
      cacheEmpty:
        "Vyrovnávacia pamäť mutácií je prázdna. Odpoveď sa nenačítala.",
      requestFailed: "Test prehliadača zlyhal: {{detail}}",
    },
  },

  success: {
    title: "Testy dokončené",
    description: "Testy sa úspešne dokončili",
  },
};
