import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "AI",

  tags: {
    api: "API zgodne z OpenAI",
  },

  promptCache: {
    label: "Pamięć podręczna promptu",
    description:
      "Zapisz wspólny początek promptu w pamięci podręcznej i wybierz czas przechowywania.",
  },
  openai: {
    missingKey:
      "Brak klucza API. Wyślij go jako 'Authorization: Bearer <klucz>' albo 'x-api-key: <klucz>'. Utwórz klucz w Ustawienia > Klucze API.",
    invalidKey:
      "Nieprawidłowy lub unieważniony klucz API. Sprawdź klucz albo utwórz nowy w Ustawienia > Klucze API.",
    authUnavailable:
      "Nie udało się teraz zweryfikować klucza API. Klucz nie został odrzucony. Spróbuj ponownie za {{seconds}} s.",
    modelNotFound:
      "Model '{{model}}' nie istnieje lub nie jest dla Ciebie dostępny. Lista Twoich modeli: GET /v1/models.",
    paidRequired:
      "API wymaga płatnego konta: dowolnego planu, od {{subPrice}} miesięcznie. Wybierzesz go na {{url}}.",
    toolsUnsupportedByModel:
      "Ten model nie obsługuje wywoływania narzędzi. Wybierz model z obsługą narzędzi albo usuń 'tools'.",
    badToolArguments:
      "Argumenty wywołania narzędzia '{{name}}' nie są poprawnym JSON-em.",
    toolChoiceUnknown:
      "tool_choice wskazuje '{{name}}', którego nie ma w 'tools'.",
    toolMessageNeedsId: "Wiadomość narzędzia {{param}} wymaga tool_call_id.",
    nUnsupported: "Obsługiwane jest tylko n=1.",
    badImageUrl:
      "image_url musi być adresem http(s) albo adresem data: w base64.",
    insufficientCredits:
      "Za mało kredytów. To wywołanie potrzebuje około {{cost}}, masz {{balance}}. Doładuj, żeby kontynuować.",
    rateLimited:
      "Zbyt wiele zapytań w krótkim czasie dla tego klucza. Spróbuj za {{seconds}} s.",
    tooManyStreams:
      "Zbyt wiele jednoczesnych streamów dla tego klucza (limit {{limit}}). Zamknij aktywny stream lub spróbuj za {{seconds}} s.",
    upstreamRateLimited:
      "Dostawca modelu tymczasowo ogranicza liczbę zapytań: {{error}}",
    upstreamFailed: "Dostawca modelu zawiódł: {{error}}",
    balanceCheckFailed:
      "Nie udało się sprawdzić salda. Nic nie zostało uruchomione. Spróbuj ponownie.",
  },

  models: {
    get: {
      title: "Modele zgodne z OpenAI",
      titleShort: "Modele v1",
      description:
        "Wyświetla modele dostępne dla Twojego klucza API. Format listy OpenAI. Uwierzytelnianie przez Authorization: Bearer <klucz>.",
      response: { object: "Typ obiektu" },
      success: {
        title: "Modele wyświetlone",
        description: "Modele dostępne dla tego klucza API",
      },
    },
  },

  completions: {
    post: {
      title: "Chat completions zgodne z OpenAI",
      titleShort: "Chat completions v1",
      description:
        "Wywołaj dowolny model w formacie OpenAI chat completions. Rozliczane z Twoich kredytów po cenach czatu. Obsługuje stream: true.",
      fields: {
        model: {
          label: "Model",
          description: "ID modelu z GET /v1/models",
        },
        messages: {
          label: "Wiadomości",
          description: "Lista wiadomości OpenAI (system, user, assistant)",
        },
        stream: {
          label: "Streaming",
          description: "Wyślij odpowiedź jako server-sent events",
        },
        streamOptions: {
          label: "Opcje streamu",
          description:
            "{ include_usage: true } dodaje końcowy chunk z zużyciem",
        },
        maxTokens: {
          label: "Maks. tokenów",
          description: "Górny limit wygenerowanych tokenów",
        },
        maxCompletionTokens: {
          label: "Maks. tokenów odpowiedzi",
          description: "To samo co max_tokens; ma pierwszeństwo",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura próbkowania, od 0 do 2",
        },
        topP: {
          label: "Top P",
          description: "Próbkowanie nucleus, od 0 do 1",
        },
        stop: {
          label: "Stop",
          description: "Sekwencja zatrzymująca lub ich lista",
        },
        n: {
          label: "Odpowiedzi",
          description: "Obsługiwane jest tylko 1",
        },
        tools: {
          label: "Narzędzia",
          description:
            "Narzędzia funkcyjne OpenAI, które model może wywołać: [{type:'function', function:{name, description, parameters}}]",
        },
        toolChoice: {
          label: "Wybór narzędzia",
          description:
            "none, auto, required albo {type:'function', function:{name}}",
        },
        parallelToolCalls: {
          label: "Równoległe wywołania narzędzi",
          description: "Akceptowane dla zgodności; decyduje model",
        },
      },
      response: { object: "Typ obiektu" },
      success: {
        title: "Completion utworzone",
        description: "Model odpowiedział",
      },
    },
  },

  responses: {
    previousResponseUnsupported:
      "previous_response_id nie jest obsługiwane: odpowiedzi nie są zapisywane. Wyślij całą rozmowę w 'input' z store: false (Codex CLI robi to domyślnie).",
    badInputItem:
      "{{param}} nie nadaje się do użycia: obrazy muszą mieć adres http(s) lub base64 data:, a elementy narzędzi call_id.",
    post: {
      title: "OpenAI Responses API",
      titleShort: "v1 responses",
      description:
        "Wywołaj dowolny model w formacie OpenAI Responses, którym mówi Codex CLI. Bezstanowo: cała rozmowa idzie w input. Obsługuje streaming, narzędzia function, custom i local_shell oraz elementy reasoning.",
      fields: {
        model: { label: "Model", description: "ID modelu z GET /v1/models" },
        input: {
          label: "Wejście",
          description:
            "Tekst albo rozmowa jako elementy Responses (message, function_call, function_call_output, reasoning, ...)",
        },
        instructions: {
          label: "Instrukcje",
          description: "Instrukcje systemowe dla modelu",
        },
        stream: {
          label: "Stream",
          description: "Wyślij odpowiedź jako zdarzenia Responses (SSE)",
        },
        tools: {
          label: "Narzędzia",
          description:
            "Narzędzia function, custom i local_shell. Narzędzia hostowane (web_search, ...) są pomijane.",
        },
        toolChoice: {
          label: "Wybór narzędzia",
          description: "none, auto, required albo {type:'function', name}",
        },
        parallelToolCalls: {
          label: "Równoległe wywołania narzędzi",
          description: "Akceptowane dla zgodności; decyduje model",
        },
        maxOutputTokens: {
          label: "Maks. tokenów wyjścia",
          description: "Górny limit generowanych tokenów",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura próbkowania, od 0 do 2",
        },
        topP: { label: "Top P", description: "Próbkowanie nucleus, od 0 do 1" },
        reasoning: {
          label: "Reasoning",
          description:
            "Akceptowane dla zgodności. Modele rozumujące i tak zwracają elementy reasoning.",
        },
        text: {
          label: "Format tekstu",
          description:
            "{format:{type:'json_schema', schema}} prosi o odpowiedź w JSON",
        },
        store: {
          label: "Zapis",
          description: "Odpowiedzi nigdy nie są zapisywane; wyślij false",
        },
        previousResponseId: {
          label: "ID poprzedniej odpowiedzi",
          description: "Nieobsługiwane: wyślij całą rozmowę",
        },
        include: {
          label: "Include",
          description:
            "Akceptowane dla zgodności. Elementy reasoning zawsze mają encrypted_content do ponownego użycia.",
        },
      },
      response: { object: "Typ obiektu" },
      success: {
        title: "Odpowiedź utworzona",
        description: "Model odpowiedział",
      },
    },
  },

  messages: {
    badContentBlock:
      "{{param}} zawiera blok, którego nie da się użyć: obrazy muszą być w base64 albo pod adresem http(s).",
    post: {
      title: "Anthropic Messages API",
      titleShort: "v1 messages",
      description:
        "Wywołaj dowolny model w formacie Anthropic Messages, którym mówi Claude Code. Klucz jako x-api-key albo Authorization: Bearer. Obsługuje streaming, narzędzia i bloki thinking.",
      fields: {
        model: {
          label: "Model",
          description:
            "ID modelu z GET /v1/models. ID Claude, np. claude-sonnet-4-5-20250929, trafiają do pasującego modelu Claude.",
        },
        messages: {
          label: "Wiadomości",
          description:
            "Wiadomości Anthropic: tury user i assistant z blokami text, image, tool_use, tool_result i thinking",
        },
        system: {
          label: "System",
          description: "Prompt systemowy: tekst albo bloki tekstu",
        },
        maxTokens: {
          label: "Maks. tokenów",
          description: "Górny limit generowanych tokenów",
        },
        stream: {
          label: "Stream",
          description: "Wyślij odpowiedź jako zdarzenia Anthropic (SSE)",
        },
        tools: {
          label: "Narzędzia",
          description:
            "Narzędzia klienta: [{name, description, input_schema}]. Narzędzia serwerowe (web_search, ...) są pomijane.",
        },
        toolChoice: {
          label: "Wybór narzędzia",
          description: "{type: auto | any | none | tool, name}",
        },
        stopSequences: {
          label: "Sekwencje stopu",
          description: "Ciągi znaków, które kończą odpowiedź",
        },
        temperature: {
          label: "Temperatura",
          description: "Temperatura próbkowania",
        },
        topP: { label: "Top P", description: "Próbkowanie nucleus, od 0 do 1" },
        thinking: {
          label: "Thinking",
          description:
            "Akceptowane dla zgodności. Modele rozumujące i tak zwracają bloki thinking.",
        },
      },
      response: { type: "Typ obiektu" },
      success: {
        title: "Wiadomość utworzona",
        description: "Model odpowiedział",
      },
    },
  },

  countTokens: {
    post: {
      title: "Liczenie tokenów Anthropic",
      titleShort: "v1 count tokens",
      description:
        "Szacuje tokeny wejściowe zapytania Anthropic Messages. Bez wywołania modelu, bez kredytów.",
      fields: {
        action: { label: "Akcja", description: "Zawsze count_tokens" },
        model: { label: "Model", description: "ID modelu" },
        messages: { label: "Wiadomości", description: "Wiadomości Anthropic" },
        system: { label: "System", description: "Prompt systemowy" },
        tools: { label: "Narzędzia", description: "Definicje narzędzi" },
      },
      response: { inputTokens: "Tokeny wejściowe" },
      success: {
        title: "Tokeny policzone",
        description: "Szacowana liczba tokenów wejściowych",
      },
    },
  },

  media: {
    images: {
      generations: {
        title: "Generowanie obrazów zgodne z OpenAI",
        titleShort: "v1 obrazy",
        description:
          "Twórz obrazy dowolnym modelem graficznym z GET /v1/models. Format obrazów OpenAI: url (podpisany, ważny 7 dni) lub b64_json. Płacisz za każdy obraz.",
        success: {
          title: "Obrazy gotowe",
          description: "Obrazy są zapisane i podlinkowane",
        },
      },
      edits: {
        title: "Edycja obrazów zgodna z OpenAI",
        titleShort: "v1 edycja obrazów",
        description:
          "Edytuj jeden obraz promptem, na modelu, który przyjmuje obraz na wejściu. Wyślij go jako pole multipart 'image' albo podaj 'image_url'. Płacisz za każdy obraz.",
        success: {
          title: "Obraz zmieniony",
          description: "Edytowany obraz jest zapisany i podlinkowany",
        },
      },
    },
    speech: {
      title: "Zamiana tekstu na mowę zgodna z OpenAI",
      titleShort: "v1 mowa",
      description:
        "Zamień tekst na mowę. Odpowiada bajtami audio (domyślnie mp3). Płacisz za znaki.",
      success: { title: "Mowa gotowa", description: "Plik audio" },
    },
    transcriptions: {
      title: "Transkrypcja zgodna z OpenAI",
      titleShort: "v1 transkrypcje",
      description:
        "Transkrybuj plik audio (pole multipart 'file', do 25 MB). JSON, tekst, SRT, WebVTT albo szczegółowy JSON z segmentami. Płacisz za sekundę nagrania.",
      success: { title: "Audio przepisane", description: "Transkrypcja" },
    },
    translations: {
      title: "Tłumaczenie audio zgodne z OpenAI",
      titleShort: "v1 tłumaczenia",
      description:
        "Zamień plik audio od razu na angielski tekst przez Whisper. Te same formaty i rozliczenie co przy transkrypcji.",
      success: {
        title: "Audio przetłumaczone",
        description: "Angielska transkrypcja",
      },
    },
    videos: {
      create: {
        title: "Generowanie wideo (asynchronicznie)",
        titleShort: "v1 wideo",
        description:
          "Uruchom zadanie wideo w formacie API wideo OpenAI. Od razu zwraca zadanie; status przez GET /v1/videos/{id}, pobieranie przez GET /v1/videos/{id}/content. Płacisz dopiero, gdy wideo jest gotowe.",
        success: {
          title: "Zadanie wideo w kolejce",
          description: "Sprawdzaj je po ID",
        },
      },
      get: {
        title: "Status zadania wideo",
        titleShort: "v1 status wideo",
        description:
          "Status, postęp i URL wyniku zadania wideo. Sprawdzanie jest darmowe i nie wlicza się do ochrony przed nadużyciami.",
        success: {
          title: "Zadanie wideo",
          description: "Aktualny stan zadania",
        },
      },
      content: {
        title: "Pobieranie wideo",
        titleShort: "v1 plik wideo",
        description: "Gotowy plik wideo z zakończonego zadania.",
        success: { title: "Plik wideo", description: "Bajty MP4" },
      },
    },
    music: {
      create: {
        title: "Generowanie muzyki (asynchronicznie)",
        titleShort: "v1 muzyka",
        description:
          "Uruchom zadanie muzyczne. Od razu zwraca zadanie; status przez GET /v1/music/{id}, pobieranie przez GET /v1/music/{id}/content. Płacisz za klip, gdy jest gotowy.",
        success: {
          title: "Zadanie muzyczne w kolejce",
          description: "Sprawdzaj je po ID",
        },
      },
      get: {
        title: "Status zadania muzycznego",
        titleShort: "v1 status muzyki",
        description:
          "Status i URL wyniku zadania muzycznego. Sprawdzanie jest darmowe i nie wlicza się do ochrony przed nadużyciami.",
        success: {
          title: "Zadanie muzyczne",
          description: "Aktualny stan zadania",
        },
      },
      content: {
        title: "Pobieranie muzyki",
        titleShort: "v1 plik muzyczny",
        description: "Gotowy plik audio z zakończonego zadania muzycznego.",
        success: { title: "Plik muzyczny", description: "Bajty audio" },
      },
    },
    file: {
      title: "Pobieranie pliku multimedialnego",
      titleShort: "v1 plik multimedialny",
      description:
        "Pobierz plik wygenerowany przez wywołanie multimedialne. Podpisany URL działa bez klucza przez 7 dni; z Twoim kluczem API zawsze.",
      success: { title: "Plik", description: "Bajty pliku" },
    },
    fields: {
      model: {
        label: "Model",
        imageDescription:
          "ID modelu graficznego z GET /v1/models (modality: image)",
        speechDescription:
          "ID głosu z GET /v1/models (modality: speech), np. openai-nova. Albo tts-1 plus głos.",
        transcriptionDescription:
          "ID modelu transkrypcji z GET /v1/models (modality: transcription). whisper-1 działa.",
        translationDescription:
          "Model Whisper od OpenAI: whisper-1 lub openai-whisper",
        videoDescription: "ID modelu wideo z GET /v1/models (modality: video)",
        musicDescription:
          "ID modelu muzycznego z GET /v1/models (modality: music)",
      },
      prompt: {
        label: "Prompt",
        imageDescription: "Co narysować, do 2000 znaków",
        editDescription: "Co zmienić na obrazie",
        transcriptionDescription:
          "Przyjmowany dla zgodności; nie trafia do każdego dostawcy",
        videoDescription: "Co dzieje się w klipie, do 2000 znaków",
        musicDescription: "Styl, nastrój, instrumenty, tempo",
      },
      n: {
        label: "Obrazy",
        description: "Ile obrazów, od 1 do 4. Każdy jest płatny.",
      },
      size: {
        label: "Rozmiar",
        imageDescription:
          "SZEROKOŚĆxWYSOKOŚĆ, np. 1024x1024 lub 1536x1024, albo auto. Wybiera najbliższy rozmiar i proporcje, które obsługuje model.",
        videoDescription:
          "SZEROKOŚĆxWYSOKOŚĆ, np. 1280x720. Ustala proporcje i, jeśli model na to pozwala, rozdzielczość.",
      },
      aspectRatio: {
        label: "Proporcje",
        imageDescription:
          "1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3 lub 21:9. Ma pierwszeństwo przed size.",
        videoDescription:
          "16:9, 9:16, 1:1, 4:3, 3:4, 3:2, 2:3, 21:9 lub 9:21. Ma pierwszeństwo przed size.",
      },
      quality: {
        label: "Jakość",
        description:
          "standard, hd, low, medium, high lub auto. hd i high wybierają tryb szczegółowy, jeśli model go ma.",
      },
      style: {
        label: "Styl",
        description: "Przyjmowany dla zgodności. Styl opisz w prompcie.",
      },
      responseFormat: {
        label: "Format odpowiedzi",
        imageDescription:
          "url (domyślnie, podpisany link ważny 7 dni) lub b64_json",
        speechDescription:
          "mp3 (domyślnie), opus, aac, flac, wav lub pcm. Dostępne formaty zależą od dostawcy głosu.",
        transcriptionDescription:
          "json (domyślnie), text, srt, verbose_json lub vtt",
      },
      user: {
        label: "Użytkownik",
        description:
          "ID Twojego użytkownika końcowego. Przyjmowany dla zgodności.",
      },
      image: {
        label: "Obraz",
        description: "Obraz do edycji, jako plik multipart",
      },
      imageUrl: {
        label: "URL obrazu",
        description:
          "Obraz do edycji jako URL http(s) lub base64 data: URL, dla zapytań JSON",
        videoDescription:
          "Pierwsza klatka jako URL http(s) lub base64 data: URL (obraz na wideo)",
      },
      mask: {
        label: "Maska",
        description: "Nieobsługiwana. Opisz zmianę w prompcie.",
      },
      input: {
        label: "Tekst",
        description: "Tekst do przeczytania, do 4096 znaków",
      },
      voice: {
        label: "Głos",
        description:
          "Z nazwą modelu OpenAI (tts-1): alloy, nova, onyx, echo, shimmer lub fable. Albo dowolne ID głosu z GET /v1/models.",
      },
      speed: {
        label: "Tempo",
        description:
          "Od 0.25 do 4.0. Działa dla głosów OpenAI, NanoGPT i ElevenLabs.",
      },
      instructions: {
        label: "Instrukcje",
        description:
          "Przyjmowane dla zgodności; głosy czytają tekst dokładnie tak, jak jest",
      },
      file: {
        label: "Plik",
        description:
          "Plik audio: mp3, mp4, m4a, wav, webm, ogg lub flac, do 25 MB",
      },
      language: {
        label: "Język",
        description:
          "Kod ISO-639-1 języka nagrania, np. en lub pl. Domyślnie język z URL.",
      },
      temperature: {
        label: "Temperatura",
        description: "Przyjmowana dla zgodności",
      },
      seconds: {
        label: "Sekundy",
        videoDescription:
          "Długość klipu. Dopasowana do długości, które oferuje model.",
        musicDescription:
          "Docelowa długość: około 8, 20 lub 30 sekund. Model może ją zaokrąglić.",
      },
      resolution: {
        label: "Rozdzielczość",
        description: "np. 720p lub 1080p, jeśli model daje wybór",
      },
      negativePrompt: {
        label: "Prompt negatywny",
        description: "Czego ma nie być w klipie, jeśli model to obsługuje",
      },
      inputReference: {
        label: "Obraz referencyjny",
        description:
          "Pierwsza klatka jako obraz wysłany przez multipart (obraz na wideo)",
      },
      jobId: { label: "ID zadania", description: "ID zwrócone przez POST" },
      threadId: { label: "Folder", description: "Folder, w którym leży plik" },
      filename: { label: "Nazwa pliku", description: "Zapisana nazwa pliku" },
      expires: {
        label: "Wygasa",
        description: "Czas Unix, po którym podpisany link przestaje działać",
      },
      sig: { label: "Podpis", description: "Podpis linku" },
    },
    response: {
      created: "Utworzono",
      object: "Typ obiektu",
      text: "Tekst",
      id: "ID zadania",
      status: "Status",
    },
    errors: {
      badSize:
        "size '{{size}}' to nie SZEROKOŚĆxWYSOKOŚĆ (np. 1024x1024) ani auto.",
      maskUnsupported: "Maski nie są obsługiwane. Opisz zmianę w prompcie.",
      oneImageOnly: "Jeden obraz na edycję. Wyślij pojedyncze 'image'.",
      imageTooLarge: "Obraz jest większy niż {{max}} MB.",
      imageRequired:
        "Wyślij obraz do edycji: pole multipart 'image' albo 'image_url' w JSON.",
      modelCannotEdit:
        "{{model}} nie przyjmuje obrazu na wejściu. Wybierz model obraz na obraz z GET /v1/models (input_modalities zawiera image).",
      storageFailed:
        "Plik powstał, ale nie udało się go zapisać. Spróbuj ponownie.",
      voiceNotFound:
        "Głos '{{voice}}' nie jest dla Ciebie dostępny. Listę głosów daje GET /v1/models (modality: speech), albo użyj modelu tts-1 z głosem nova.",
      formatUnsupported:
        "{{voice}} obsługuje {{supported}}. Wybierz jeden z nich jako response_format.",
      audioTooLarge: "Plik audio jest większy niż 25 MB.",
      fileRequired: "Wyślij audio jako pole multipart 'file'.",
      translationUnsupported:
        "{{model}} nie tłumaczy. Tłumaczenie na angielski działa na whisper-1.",
      jobNotFound: "Brak zadania {{kind}} '{{id}}' na tym koncie.",
      jobNotReady:
        "Zadanie {{kind}} '{{id}}' ma status {{status}}. Pobierz je, gdy status będzie completed.",
      jobInterrupted:
        "Zadanie przerwał restart serwera. Nic nie zostało pobrane z konta. Wyślij je ponownie.",
      jobNotCreated:
        "Nie udało się zapisać zadania. Nic nie zostało pobrane z konta. Spróbuj ponownie.",
      mediaNotFound:
        "Nie znaleziono pliku albo link wygasł. Weź świeży link z zadania albo wyślij swój klucz API.",
      modelNoImageInput:
        "{{model}} nie przyjmuje pierwszej klatki. Wybierz model obraz na wideo z GET /v1/models albo usuń obraz.",
      modelNeedsImage:
        "{{model}} animuje obraz. Wyślij input_reference lub image_url.",
      resolutionUnsupported:
        "{{model}} generuje {{supported}}. Wybierz jedną z nich jako resolution.",
    },
  },

  errors: {
    validation: {
      title: "Błąd walidacji",
      description: "Nieprawidłowe żądanie",
    },
    unauthorized: {
      title: "Brak autoryzacji",
      description: "Wymagany prawidłowy klucz API",
    },
    server: { title: "Błąd serwera", description: "Wewnętrzny błąd serwera" },
    unknown: { title: "Nieznany błąd", description: "Wystąpił nieznany błąd" },
    network: { title: "Błąd sieci", description: "Wystąpił błąd sieci" },
    forbidden: { title: "Zabronione", description: "Odmowa dostępu" },
    notFound: { title: "Nie znaleziono", description: "Nie znaleziono modelu" },
    conflict: { title: "Konflikt", description: "Żądanie koliduje ze stanem" },
  },
};
