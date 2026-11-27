import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  rules: {
    checked:
      "Sprawdzone w oficjalnej dokumentacji i regulaminach każdego dostawcy dnia {{date}}. Na telefonie przewiń tabelę w bok.",
    columns: {
      name: "Usługa",
      defaults: "Filtr domyślnie",
      off: "Wyłączenie",
      models: "Modele bez cenzury",
      weights: "Własne wagi",
      rules: "Zasady treści, które zostają",
    },
    rows: {
      azure: {
        defaults: "Włączony dla każdego modelu poza Whisper.",
        off: "Tylko za zgodą. Klient może sam poluzować do High only. Pełna kontrola wymaga wniosku, dostępnego tylko dla klientów obsługiwanych przez zespół konta Microsoft lub w kwalifikowanym programie.",
        models: "W katalogu nie znaleźliśmy żadnego.",
        weights: "Nie sprawdzaliśmy na potrzeby tego przewodnika.",
        rules:
          "Code of Conduct zakazuje treści jednoznacznie seksualnych oraz erotycznych i romantycznych chatbotów, z filtrem i bez.",
      },
      bedrock: {
        defaults:
          "Brak filtra Bedrock, dopóki nie podepniesz Guardrail. Wykrywanie CSAM działa zawsze.",
        off: "Pomiń identyfikator guardrail. Odmowy samego modelu zostają.",
        models: "Brak w katalogu.",
        weights:
          "Custom Model Import: architektury Llama, Mistral, Qwen i gpt-oss, rozliczane za minutę Custom Model Unit.",
        rules:
          "Responsible AI Policy zabrania obchodzenia filtrów bezpieczeństwa oraz obrazów seksualnych bez zgody.",
      },
      vertex: {
        defaults:
          "Domyślnie wyłączony od gemini-3.5-flash. Podstawowe szkody pozostają blokowane.",
        off: "Ustaw progi na OFF. Wyuczone odmowy Gemini zostają.",
        models: "Brak na liście modeli otwartych.",
        weights: "Model Garden self-deploy na kontenerach vLLM lub TGI.",
        rules:
          "Prohibited Use Policy zakazuje treści jednoznacznie seksualnych i obchodzenia filtrów bezpieczeństwa.",
      },
      together: {
        defaults: "Na przeczytanych stronach nie opisano przełącznika filtra.",
        off: "Nie dotyczy.",
        models: "Brak na liście serverless.",
        weights:
          "Dedykowane endpointy od $5.49 za godzinę H100. Wgrywać można tylko fine-tuny obsługiwanej architektury.",
        rules: "Regulamin zakazuje treści obscenicznych i pornografii.",
      },
      us: {
        defaults:
          "Ty wybierasz model: z głównego nurtu, otwarty albo bez cenzury. Żadnej warstwy filtra na wierzchu.",
        off: "Wybierz model bez cenzury i raz potwierdź, że masz 18+ lat.",
        models: "{{uncensored}} działa teraz.",
        weights: "Nieobsługiwane. Prowadzimy wyselekcjonowany katalog.",
        rules:
          "Modele bez cenzury odblokowuje jednorazowa zgoda 18+. Regulamin dostawcy modelu nadal obowiązuje.",
      },
    },
    sourceLabels: {
      filters: "{{name}}: dokumentacja filtrów",
      access: "{{name}}: zasady dostępu",
      policy: "{{name}}: polityka użytkowania",
      privacy: "{{name}}: obsługa danych",
      pricing: "{{name}}: cennik",
      import: "{{name}}: własne wagi",
    },
    sourcesTitle: "Źródła",
  },
  prices: {
    columns: {
      model: "Model",
      provider: "Dostawca",
      input: "Wejście / 1M",
      output: "Wyjście / 1M",
    },
    us: "{{appName}}",
    live: "cena na żywo",
    source: "źródło",
    note: "USD za 1M tokenów. Ceny konkurencji odczytane {{date}} z ich publicznych list modeli. Nasze czytamy na żywo z własnego rejestru, razem z naszą marżą {{markup}}%. Gdy skonfigurowana jest tańsza trasa, używamy jej, a pokazana cena za nią podąża.",
  },
  alts: {
    heading: "{{number}}. {{name}}",
    strength: "Najlepsze:",
    catch: "Haczyk:",
    sources: "Źródła:",
    versusLink: "{{appName}} vs {{name}}: pełne porównanie",
    openRouter: {
      what: "Bramka z 477 modelami pod jednym kluczem. Bez narzutu na inferencję, 5.5% opłaty przy zakupie kredytów (5% przy krypto).",
      strength:
        "Własne klucze dostawców za darmo do $25,000 miesięcznie, routing z zerową retencją danych per zapytanie, płatności w USDC.",
      catch:
        "17 modeli dostrojonych do roleplayu lub bez cenzury, ani jednego identyfikatora z abliterated lub uncensored w nazwie. W przeglądzie API brak endpointu Anthropic Messages.",
    },
    venice: {
      what: "Aplikacja czatu plus API zgodne z OpenAI. Własne fine-tuny Venice Uncensored 1.2 ($0.20 / $0.90) i Venice Role Play Uncensored, obok abliterowanych modeli GLM, DeepSeek, Gemma i Qwen.",
      strength:
        "Obraz, wideo, głos i muzyka w tym samym API. Szyfrowane modele i opcje TEE. Płatność za zapytanie z portfela USDC przez x402, bez konta.",
      catch:
        "Brak natywnego endpointu Anthropic Messages, Claude Code potrzebuje lokalnego proxy. Regulamin zabrania odsprzedaży dostępu. Darmowy plan to 10 promptów tekstowych dziennie.",
    },
    nanoGpt: {
      what: "Bramka płatna za użycie z 610 modelami, z czego około 54 to identyfikatory abliterowane lub bez cenzury.",
      strength:
        "OpenAI chat completions, Responses i Anthropic Messages. Bitcoin i Monero, bez konta, odsprzedaż w modelu pay-as-you-go dozwolona.",
      catch:
        "Zaśmiecony katalog z wieloma niemal identycznymi identyfikatorami bez cenzury. Produkt jest budowany przede wszystkim jako bramka.",
    },
    openUncensored: {
      what: "Router API dla abliterowanych wag: 58 modeli tekstowych, 20 obrazowych i 3 wideo na przedpłaconym kluczu. Twój klucz to twoje konto.",
      strength:
        "Zero prowizji od cen dostawców. GLM 5.3 Flash Uncensored od $0.12 / $0.50. Formaty OpenAI, Responses i Anthropic pod jednym base URL.",
      catch:
        "Brak darmowego planu, krypto niewspomniane, metadane zapytań przechowywane do dwóch lat. Brak czatu w przeglądarce, tylko aplikacja desktopowa.",
    },
    refuseless: {
      what: "Hosting wyłącznie przez API dla otwartych wag z usuniętymi odmowami: cztery modele abliterowane z kontekstem 1M, plus kilka seryjnych.",
      strength:
        "DeepSeek V4.1 Flash abliterated za $0.12 / $0.45 i GLM 5.3 Flash abliterated za $0.12 / $0.50. Chat completions, Responses, Anthropic Messages i embeddingi.",
      catch:
        "Brak interfejsu czatu. Jego strony prywatności i regulaminu zablokowały nasz czytnik, więc przeczytaj je sam, zanim wypuścisz produkt.",
    },
    abliterationHosts: {
      what: "Dwa kolejne API z modelami abliterowanymi. NEAR AI Cloud uruchamia modele w enklawach sprzętowych: Qwen 3.8 27B Abliterated za $0.04 / $1.35. abliteration.ai sprzedaje własne abliterowane marki od $1 / $2.",
      strength:
        "NEAR: bez wniosku, bez weryfikacji tożsamości, weryfikowalna atestacja. abliteration.ai: prompty przetwarzane w pamięci i domyślnie nieprzechowywane, region UE, formaty OpenAI i Anthropic.",
      catch:
        "Małe katalogi. NEAR nie wspomina o formacie Anthropic. abliteration.ai kosztuje więcej niż Refuseless czy NEAR za podobne wagi.",
    },
    togetherFireworks: {
      what: "Szybkie chmury inferencji dla seryjnych modeli otwartych. Together udostępnia 24 modele czatu serverless, żadnego bez cenzury. Fireworks wymienia modele Dolphin, Hermes i Dobby Unhinged, status serverless niepotwierdzony.",
      strength:
        "Together: OpenAI, Responses i Anthropic Messages, zerowa retencja danych na własne życzenie. Fireworks: domyślnie brak logów promptów dla modeli otwartych, do 6,000 zapytań na minutę.",
      catch:
        "Regulamin Together zakazuje treści obscenicznych i pornografii. Fireworks każe zapewnić, że twoje dane wejściowe nie zawierają nagości ani treści seksualnie sugestywnych.",
    },
    selfHost: {
      what: "Uruchom abliterowane wagi sam. Ollama i LM Studio na stacji roboczej, vLLM lub TGI na własnych GPU. Wszystkie mówią formatem OpenAI chat completions.",
      strength:
        "Prompty nigdy nie opuszczają twoich maszyn. Dowolny abliterowany model GGUF lub safetensors, który możesz pobrać. Lokalne użycie nie kosztuje nic poza sprzętem.",
      catch:
        "GPU, aktualizacje i dostępność są na twojej głowie. Modele wielkości frontier wymagają sprzętu z centrum danych.",
    },
  },
};
