export const translations = {
  category: "Profil Twórcy",
  tags: {
    creator: "tworca",
    profile: "profil",
    public: "publiczny",
  },
  get: {
    title: "Pobierz profil twórcy",
    description:
      "Publiczny profil twórcy skilla z bio, linkami i liczba skilli",
    form: {
      title: "Profil twórcy",
      description: "Publiczny profil twórcy skilla",
      userId: {
        label: "ID uzytkownika",
        description: "ID uzytkownika twórcy",
      },
    },
    response: {
      title: "Profil twórcy",
      description: "Publiczne dane profilu twórcy",
      publicName: "Nazwa wyswietlana",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Strona",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Kolor akcentu",
      creatorHeaderImageUrl: "Obraz naglówka",
      skillCount: "Skille",
      referralCode: "Kod polecajacy",
    },
    errors: {
      validation: {
        title: "Blad walidacji",
        description: "Nieprawidlowe zapytanie",
      },
      unauthorized: {
        title: "Brak autoryzacji",
        description: "Brak autoryzacji",
      },
      forbidden: { title: "Zabroniony", description: "Brak dostepu" },
      notFound: {
        title: "Nie znaleziono",
        description: "Twórca nie znaleziony",
      },
      conflict: { title: "Konflikt", description: "Konflikt zapytania" },
      network: { title: "Blad sieci", description: "Blad sieci" },
      unsavedChanges: {
        title: "Niezapisane zmiany",
        description: "Niezapisane zmiany",
      },
      internal: { title: "Blad serwera", description: "Wewnetrzny blad" },
      unknown: { title: "Nieznany blad", description: "Nieznany blad" },
    },
    success: {
      title: "Profil twórcy",
      description: "Profil twórcy pobrany",
    },
  },
};
