import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    video: "Video",
    generation: "Tvorba",
    ai: "AI",
  },
  post: {
    title: "Vytvoriť video",
    titleShort: "Vytvoriť video",
    dynamicTitle: "Video: {{prompt}}",
    description:
      "Vytvorí video z textového zadania. V nástroji models (modelType=video) nájdeš modely aj ich možnosti: supportedDurations (dĺžky klipu v sekundách), supportedAspectRatios (pomery strán) a supportedFrameImages (first_frame a last_frame pri tvorbe z obrázka). Cez frameReferences môžeš určiť úvodný záber rolou 'first' a záverečný rolou 'last'. Oba musia mať adresu obrázka. Na záverečný záber model potrebuje podporu last_frame. Položka s rolou 'reference' alebo bez roly môže obsahovať obrazovú, zvukovú alebo video predlohu. Pri modeloch, ktoré to podporujú, môžeš zadať aj negativePrompt. Výsledok obsahuje videoUrl.",
    form: {
      title: "Tvorba videa",
      description: "Zadaj, aké video chceš vytvoriť.",
    },
    prompt: {
      label: "Zadanie",
      description: "Opíš, ako má video vyzerať.",
      placeholder: "Filmový záber horského jazera pri západe slnka…",
    },
    model: {
      label: "Vzor",
      description:
        "ID modelu na tvorbu videa. Ak pole necháš prázdne, použije sa predvolený model používateľa. Dostupné modely a ich možnosti nájdeš v nástroji models (modelType=video).",
    },
    duration: {
      label: "Trvanie",
      description: "Dĺžka vygenerovaného videoklipu",
      short: "Krátke (asi 5 s)",
      medium: "Stredné (asi 10 s)",
      long: "Dlhé (asi 15 s)",
    },
    aspectRatio: {
      label: "Pomer strán",
      description: "Pomer strán výsledného videa",
    },
    resolution: {
      label: "Rozlíšenie",
      description: "Rozlíšenie výsledného videa",
    },
    frameReferences: {
      label: "Referenčné zábery",
      description:
        "Predlohy, ktoré usmernia tvorbu videa. Každá položka má tvar { url, role }. Rola 'first' určuje presný úvodný záber, rola 'last' presný záverečný záber. Na záverečný záber musí model podporovať last_frame. Obe adresy musia odkazovať na obrázky. Rolu 'reference' alebo položku bez roly môžeš použiť pre obrázok, zvuk alebo video. Typ sa rozpozná z adresy: .mp4, .webm a .mov sú videá, zvukové súbory sa spracujú ako zvuk, ostatné ako obrázky. Pri úvodnom alebo referenčnom obrázku server podľa potreby vyberie najlacnejší model s podporou obrázkov.",
      placeholder: "https://example.com/first-frame.jpg",
    },
    negativePrompt: {
      label: "Čo má vo videu chýbať",
      description:
        "Opíš, čo má vo videu chýbať. Túto možnosť používajú iba modely s podporou parametra negative_prompt alebo negativePrompt.",
      placeholder: "rozmazanie, nízka kvalita, skreslenie…",
    },

    download: "Stiahnuť",
    generatingNote: "Tvorba videa môže trvať 1 až 3 minúty",
    backButton: {
      label: "Späť",
    },
    submitButton: {
      text: "Vytvoriť video",
      label: "Vytvoriť video",
      loadingText: "Vytvára sa…",
    },
    response: {
      videoUrl: "URL vytvoreného videa",
      creditCost: "Spotrebované kredity",
      durationSeconds: "Trvanie v sekundách",
      jobId: "ID asynchrónnej úlohy",
    },
    errors: {
      referenceUnavailable:
        "Vstupný obrázok už nie je dostupný. Mohol byť odstránený alebo môže patriť do chatu, ku ktorému nemáš prístup. Použi obrázok z tohto chatu alebo ho nahraj znova.",
      validation_failed: {
        title: "Chyba overenia",
        description: "Skontroluj zadanie a nastavenia.",
      },
      network_error: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k službe na tvorbu videa.",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Ak chceš vytvárať videá, prihlás sa.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Na použitie tejto funkcie nemáš oprávnenie.",
      },
      not_found: {
        title: "Nenašlo sa",
        description: "Požadovaný model sa nenašiel",
      },
      server_error: {
        title: "Chyba servera",
        description: "Pri tvorbe videa nastala neočakávaná chyba.",
      },
      unknown_error: {
        title: "Neznáma chyba",
        description: "Nastala neznáma chyba",
      },
      unsaved_changes: {
        title: "Neuložené zmeny",
        description: "Pred spustením tvorby si ulož zmeny.",
      },
      conflict: {
        title: "Konflikt",
        description: "Pri tvorbe videa nastal konflikt.",
      },
      notAVideoModel:
        "Vybraný model nevie vytvárať videá. Zvoľ model na tvorbu videa.",
      notConfigured:
        "Chýba konfigurácia služby {{label}}. Pridaj {{envKey}} do súboru .env. Kľúč získaš na {{url}}.",
      providerUnsupported: "{{label}} zatiaľ nemá podporu",
      modelUnavailable: "Tento model je dočasne nedostupný. Vyber si iný.",
      insufficientCredits:
        "Nedostatok kreditov. Zostatok: {{balance}}. Potrebné množstvo: {{minimum}}.",
      balanceCheckFailed: "Nepodarilo sa overiť zostatok kreditov",
      unsupportedDuration:
        "Model {{model}} nepodporuje dĺžku {{duration}}. Dostupné dĺžky: {{supported}}",
      unsupportedAspectRatio:
        "Model {{model}} nepodporuje pomer strán {{aspectRatio}}. Podporované pomery: {{supported}}",
      unsupportedResolution:
        "Model {{model}} nepodporuje rozlíšenie {{resolution}}. Dostupné rozlíšenia: {{supported}}",
      generationFailed: "Generovanie videa zlyhalo: {{error}}",
      providerError: "Chyba poskytovateľa videa: {{error}}",
      noVideoUrl: "Poskytovateľ nevrátil adresu videa.",
      generationFailedUnknown:
        "Video sa nepodarilo vytvoriť. Poskytovateľ neuviedol dôvod.",
      providerErrorUnknown:
        "Služba na tvorbu videa zlyhala bez chybového hlásenia.",
      nonJsonResponse:
        "Poskytovateľ videa vrátil odpoveď v inom formáte ako JSON (HTTP {{status}}): {{body}}",
      providerHttpError: "Poskytovateľ videa vrátil HTTP {{status}}: {{body}}",
      jobFailedStatus: "Tvorba videa sa skončila so stavom {{status}}.",
      requestAborted: "Tvorba videa sa prerušila.",
      requestTimedOut: "Čas na vytvorenie videa vypršal.",
      contentRejected:
        "Filter poskytovateľa odmietol zadanie: {{error}}. Skús ho preformulovať alebo vyber model s miernejším filtrovaním. Kredity sa ti neodpočítali.",
      providerOutage:
        "Poskytovateľ videa má výpadok alebo je preťažený: {{error}}. Skús to znova o minútu alebo vyber iný model. Kredity sa ti neodpočítali.",
      consentRequired:
        "Poskytovateľ videa vyžaduje potvrdenie súhlasu pri použití skutočnej tváre: {{error}}. Použi obrázok bez tváre skutočnej osoby alebo vyber iný model. Kredity sa ti neodpočítali.",
      storageFailed:
        "Video sa vytvorilo, ale nepodarilo sa ho uložiť. Kredity sa ti neodpočítali. Skús to znova.",
      creditsFailed: "Kredity za vytvorenie videa sa nepodarilo odpočítať.",
      inputMediaRequired:
        "Tento model potrebuje adresu vstupného obrázka. Vlož odkaz na obrázok, ktorý chceš rozhýbať.",
      imageInputUnsupported:
        "Model {{model}} odmietol vstupný obrázok. Pravdepodobne nepodporuje tvorbu videa z obrázka. Skús spustiť generate_video bez parametra model (predvolený model dokáže rozhýbať obrázky) alebo obrázok odober.",
      noImageCapableModel:
        "Žiadny dostupný model na tvorbu videa neprijíma obrázkovú predlohu. Odober obrázok a vytvor video iba podľa textového zadania.",
    },
    success: {
      title: "Video je hotové",
      description: "Video sa podarilo vytvoriť",
    },
  },
};
