// oxlint-disable boilerplate/i18n-pattern -- imports model translations shared across scoped files
import { translations as modelTranslations } from "../../../models/i18n/sk";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",
  tags: {
    speech: "Reč",
    tts: "Prevod textu na reč",
    ai: "AI",
  },

  post: {
    title: "Prevod textu na reč",
    titleShort: "Text na reč",
    dynamicTitle: "Hlasový výstup: {{text}}",
    description:
      "Prevedie text na reč. Zadajte text a ID hlasu. Nástroj models s parametrom modelType=audio zobrazí dostupné hlasové modely. Jedinečné ID hlasu použite ako hodnotu parametra voice. Cena sa počíta podľa počtu znakov a sadzby vybraného hlasu. Sadzbu nájdete v nástroji models. Výstup obsahuje audioUrl.",
    form: {
      title: "Prevod textu na reč",
      description: "Zadajte text, ktorý má zaznieť.",
    },
    text: {
      label: "Text",
      description: "Text na hlasový výstup (najviac 5 000 znakov)",
      placeholder: "Zadajte text, ktorý chcete nechať prečítať…",
    },
    voice: {
      label: "Hlas",
      description:
        "ID hlasového modelu. Dostupné hlasy a ich ID zobrazíte nástrojom models (modelType=audio).",
    },
    download: "Stiahnuť",
    response: {
      title: "Hlasový výstup",
      description: "Vytvorený zvukový súbor",
      success: "Úspech",
      audioUrl: "Adresa URL zvuku",
      creditCost: "Spotrebované kredity",
    },
    submitButton: {
      label: "Prečítať nahlas",
      loadingText: "Vytvára sa hlasový výstup…",
    },
    errors: {
      validation_failed: {
        title: "Chyba overenia",
        description: "Zadaný text alebo parametre sú neplatné",
      },
      network_error: {
        title: "Chyba siete",
        description: "Nepodarilo sa pripojiť k serveru",
      },
      unauthorized: {
        title: "Vyžaduje sa prihlásenie",
        description: "Prihláste sa, aby ste mohli previesť text na reč.",
      },
      forbidden: {
        title: "Prístup zakázaný",
        description: "Nemáte oprávnenie na prevod textu na reč.",
      },
      not_found: {
        title: "Nenašlo sa",
        description: "Požadovaný zdroj sa nenašiel.",
      },
      server_error: {
        title: "Chyba servera",
        description: "Pri prevode textu na reč sa vyskytla chyba.",
      },
      unknown_error: {
        title: "Neznáma chyba",
        description: "Vyskytla sa neočakávaná chyba",
      },
      unsaved_changes: {
        title: "Neuložené zmeny",
        description: "Máte neuložené zmeny",
      },
      conflict: {
        title: "Konflikt",
        description: "Nastal konflikt",
      },
      noTtsProviderConfigured:
        "Chýba konfigurácia poskytovateľa prevodu textu na reč. Pridajte OPENAI_API_KEY, EDEN_AI_API_KEY alebo ELEVENLABS_API_KEY, prípadne pripojte systémového poskytovateľa modelov.",
      notConfigured:
        "Kľúč API pre {{label}} nie je nastavený. Do súboru .env pridajte {{envKey}}=<your-key>. Kľúč získate na {{url}}.",
      conversionFailed: "Syntéza reči zlyhala: {{error}}",
      providerUnavailable:
        "Poskytovateľ hlasu je dočasne nedostupný. Kredity sa neodpočítali. Skúste to znova o chvíľu alebo zvoľte iný hlas.",
      noText: "Chýba text na prečítanie.",
      noAudioUrl: "Poskytovateľ nevrátil URL výsledného zvuku.",
      audioFetchFailed:
        "Zvukový súbor sa nepodarilo vytvoriť. Skúste to znova.",
      providerError: "Chyba poskytovateľa: {{error}}",
      internalError: "Interná chyba servera",
      unsupportedProvider:
        "Nepodporovaný poskytovateľ TTS pre hlas: {{voiceId}}",
      creditsFailed: "Zlyhalo odpočítanie kreditov: {{error}}",
      balanceCheckFailed:
        "Zostatok kreditov sa nepodarilo overiť. Skúste to znova.",
      insufficientCredits:
        "Na tento prevod nemáte dosť kreditov. Zostatok: {{balance}}. Potrebujete aspoň {{minimum}}. Doplňte kredity a pokračujte.",
    },
    success: {
      title: "Hlasový výstup je hotový",
      description: "Text sa podarilo previesť na reč.",
      conversionComplete: "Prevod textu na reč je hotový.",
    },
  },
  languages: {
    en: "Angličtina",
    de: "Nemčina",
    pl: "Poľština",
    es: "Španielčina",
    sk: "Slovenčina",
    hi: "Hindčina",
    fr: "Francúzština",
    it: "Taliančina",
  },
  models: {
    descriptions: {
      qwen3Ryan:
        "Ryan číta pomocou otvoreného hlasového modelu Qwen3 v desiatich jazykoch vrátane nemčiny.",
      orpheusTara:
        "Tara číta po anglicky, mení tempo a reaguje na hlasové pokyny.",
      openaiAlloy:
        "OpenAI Alloy. Vyvážený neutrálny hlas pre profesionálny obsah.",
      openaiNova: "OpenAI Nova. Prívetivý hlas vhodný na konverzáciu.",
      openaiOnyx: "OpenAI Onyx. Hlboký, autoritatívny hlas na formálny obsah.",
      openaiEcho: "OpenAI Echo. Zrozumiteľný hlas s prirodzeným rytmom.",
      openaiShimmer:
        "OpenAI Shimmer. Výrazný, dynamický hlas pre pútavý obsah.",
      openaiFable: "OpenAI Fable. Výrazný hlas na rozprávanie príbehov.",
      elevenlabsRachel:
        "ElevenLabs Rachel. Prirodzený ženský hlas so širokou škálou emócií.",
      elevenlabsJosh:
        "ElevenLabs Josh. Prirodzený mužský hlas s konverzačným tónom.",
      elevenlabsBella:
        "ElevenLabs Bella. Prívetivý ženský hlas s jemným prejavom.",
      elevenlabsAdam:
        "ElevenLabs Adam. Profesionálny mužský hlas pre tvorbu obsahu.",
      elevenlabsRachelTurbo:
        "ElevenLabs Rachel Turbo. Rovnaký hlas v modeli v4 Turbo. Polovičná cena a takmer okamžitá odozva.",
      elevenlabsJoshTurbo:
        "ElevenLabs Josh Turbo. Rovnaký hlas v modeli v4 Turbo. Polovičná cena a takmer okamžitá odozva.",
      elevenlabsBellaTurbo:
        "ElevenLabs Bella Turbo. Rovnaký hlas v modeli v4 Turbo. Polovičná cena a takmer okamžitá odozva.",
      elevenlabsAdamTurbo:
        "ElevenLabs Adam Turbo. Rovnaký hlas v modeli v4 Turbo. Polovičná cena a takmer okamžitá odozva.",
      kokoroBella:
        "Kokoro Bella. Model s otvorenými váhami, 82 miliónmi parametrov a prívetivým americkým ženským hlasom. Bez filtrovania obsahu.",
      kokoroSarah:
        "Kokoro Sarah. Model s otvorenými váhami, 82 miliónmi parametrov a jasným americkým ženským hlasom. Bez filtrovania obsahu.",
      kokoroNicole:
        "Kokoro Nicole. Model s otvorenými váhami, 82 miliónmi parametrov a jemným, tlmeným ženským hlasom. Bez filtrovania obsahu.",
      kokoroAdam:
        "Kokoro Adam. Model s otvorenými váhami, 82 miliónmi parametrov a vyrovnaným americkým mužským hlasom. Bez filtrovania obsahu.",
      kokoroMichael:
        "Kokoro Michael. Model s otvorenými váhami, 82 miliónmi parametrov a sebavedomým americkým mužským hlasom. Bez filtrovania obsahu.",
      kokoroEmma:
        "Kokoro Emma. Model s otvorenými váhami, 82 miliónmi parametrov a britským ženským hlasom. Bez filtrovania obsahu.",
      kokoroGeorge:
        "Kokoro George. Model s otvorenými váhami, 82 miliónmi parametrov a britským mužským hlasom. Bez filtrovania obsahu.",
      voxtralPaul:
        "Voxtral Mini číta anglický text Paulovým neutrálnym hlasom.",
      inworldAshley:
        "Inworld Ashley. Rýchly a cenovo dostupný ženský hlas so živým prejavom.",
      inworldCraig:
        "Inworld Craig. Rýchly a cenovo dostupný britský mužský hlas.",
      xaiEve: "xAI Eve. Výrazný ženský hlas s riadením emócií priamo v texte.",
      geminiZephyr:
        "Gemini Zephyr. Jasný ženský hlas s podporou viac ako 100 jazykov a pokynov pre spôsob prednesu.",
      geminiPuck:
        "Gemini Puck. Energický mužský hlas s podporou viac ako 100 jazykov a pokynov pre spôsob prednesu.",
    },
    names: modelTranslations.names,
  },
};

export default translations;
