export const translations = {
  category: "Creator-Profil",
  tags: {
    creator: "creator",
    profile: "profil",
    public: "oeffentlich",
  },
  get: {
    title: "Creator-Profil abrufen",
    description:
      "Oeffentliches Creator-Profil mit Bio, Social-Links und Skill-Anzahl",
    form: {
      title: "Creator-Profil",
      description: "Oeffentliches Profil eines Skill-Creators",
      userId: {
        label: "Benutzer-ID",
        description: "Die Benutzer-ID des Creators",
      },
    },
    response: {
      title: "Creator-Profil",
      description: "Oeffentliche Creator-Profildaten",
      publicName: "Anzeigename",
      avatarUrl: "Avatar",
      bio: "Bio",
      websiteUrl: "Website",
      twitterUrl: "X / Twitter",
      youtubeUrl: "YouTube",
      instagramUrl: "Instagram",
      tiktokUrl: "TikTok",
      githubUrl: "GitHub",
      discordUrl: "Discord",
      creatorAccentColor: "Akzentfarbe",
      creatorHeaderImageUrl: "Header-Bild",
      skillCount: "Skills",
      referralCode: "Empfehlungscode",
    },
    errors: {
      validation: {
        title: "Validierungsfehler",
        description: "Ungueltige Anfrage",
      },
      unauthorized: {
        title: "Nicht autorisiert",
        description: "Nicht autorisiert",
      },
      forbidden: { title: "Verboten", description: "Zugriff verweigert" },
      notFound: {
        title: "Nicht gefunden",
        description: "Creator nicht gefunden",
      },
      conflict: { title: "Konflikt", description: "Anfragenkonflikt" },
      network: { title: "Netzwerkfehler", description: "Netzwerkfehler" },
      unsavedChanges: {
        title: "Ungespeicherte Aenderungen",
        description: "Ungespeicherte Aenderungen",
      },
      internal: { title: "Serverfehler", description: "Interner Fehler" },
      unknown: {
        title: "Unbekannter Fehler",
        description: "Unbekannter Fehler",
      },
    },
    success: {
      title: "Creator-Profil",
      description: "Creator-Profil abgerufen",
    },
  },
};
