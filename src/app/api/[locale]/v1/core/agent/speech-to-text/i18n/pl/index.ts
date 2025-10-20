/**
 * Speech-to-Text Polish translations
 */

export const translations = {
  post: {
    title: "Mowa na tekst",
    description: "Konwertuj audio na tekst za pomocą transkrypcji AI",
    form: {
      title: "Transkrypcja audio",
      description: "Prześlij plik audio do transkrypcji",
    },
    fileUpload: {
      title: "Przesyłanie pliku audio",
      description: "Prześlij plik audio do transkrypcji",
    },
    audio: {
      label: "Plik audio",
      description: "Plik audio do transkrypcji (MP3, WAV, WebM itp.)",
      validation: {
        maxSize: "Rozmiar pliku musi być mniejszy niż 25 MB",
        audioOnly: "Proszę przesłać plik audio lub wideo",
      },
    },
    provider: {
      label: "Dostawca",
      description: "Dostawca AI do transkrypcji",
    },
    language: {
      label: "Język",
      description: "Język pliku audio",
    },
    response: {
      title: "Wynik transkrypcji",
      description: "Transkrybowany tekst z Twojego audio",
      success: "Sukces",
      text: "Transkrybowany tekst",
      provider: "Użyty dostawca",
      confidence: "Wynik pewności",
    },
    errors: {
      unauthorized: {
        title: "Nieautoryzowany",
        description: "Musisz być zalogowany, aby korzystać z tej funkcji",
      },
      validation: {
        title: "Błąd walidacji",
        description: "Plik audio lub parametry są nieprawidłowe",
      },
      server: {
        title: "Błąd serwera",
        description: "Nie udało się przetworzyć transkrypcji",
      },
      apiKeyMissing: "Klucz API Eden AI nie jest skonfigurowany",
      transcriptionFailed: "Transkrypcja nie powiodła się: {error}",
      noAudioFile: "Nie podano pliku audio",
      internalError: "Wewnętrzny błąd serwera",
      noPublicId: "Nie otrzymano publicznego ID",
      pollFailed: "Nie udało się pobrać wyników transkrypcji",
      failed: "Transkrypcja nie powiodła się",
      timeout: "Przekroczono limit czasu transkrypcji",
    },
    success: {
      title: "Sukces",
      description: "Audio transkrybowane pomyślnie",
      transcriptionComplete: "Transkrypcja zakończona pomyślnie",
    },
  },
  providers: {
    openai: "OpenAI Whisper",
    assemblyai: "AssemblyAI",
    deepgram: "Deepgram",
    google: "Google Speech-to-Text",
    amazon: "Amazon Transcribe",
    microsoft: "Microsoft Azure",
    ibm: "IBM Watson",
    rev: "Rev.ai",
  },
  languages: {
    en: "Angielski",
    de: "Niemiecki",
    pl: "Polski",
    es: "Hiszpański",
    fr: "Francuski",
    it: "Włoski",
  },
};

export default translations;
