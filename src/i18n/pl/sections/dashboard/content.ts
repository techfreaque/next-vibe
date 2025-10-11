import type { contentTranslations as EnglishContentTranslations } from "../../../en/sections/dashboard/content";

export const contentTranslations: typeof EnglishContentTranslations = {
  title: "Harmonogram treści",
  description: "Zarządzaj i planuj treści swoich mediów społecznościowych",
  createPost: "Utwórz post",
  createNewPost: "Utwórz nowy post",
  createNewPostDescription:
    "Utwórz nowy post dla swoich kont w mediach społecznościowych.",
  editPost: "Edytuj post",
  editPostDescription: "Edytuj swój post w mediach społecznościowych.",
  updatePost: "Zaktualizuj post",
  platform: "Platforma",
  content: "Treść",
  scheduledDate: "Data zaplanowana",
  allPlatforms: "Wszystkie platformy",
  allStatuses: "Wszystkie statusy",
  scheduledPosts: "Zaplanowane posty",
  scheduledPostsDescription:
    "Wyświetl i zarządzaj swoimi zaplanowanymi postami",
  draftPosts: "Szkice postów",
  draftPostsDescription: "Wyświetl i zarządzaj swoimi szkicami postów",
  noPostsFound: "Nie znaleziono postów",
  noDraftPostsFound: "Nie znaleziono szkiców postów",
  confirmDelete: "Czy na pewno chcesz usunąć ten post?",
  status: {
    label: "Status",
    draft: "Szkic",
    scheduled: "Zaplanowany",
    published: "Opublikowany",
    failed: "Nieudany",
  },
  tabs: {
    calendar: "Kalendarz",
    list: "Widok listy",
    drafts: "Szkice",
  },
  detail: {
    title: "Szczegóły treści",
    description: "Wyświetl i zarządzaj swoim postem",
    backToCalendar: "Powrót do kalendarza",
    edit: "Edytuj",
    delete: "Usuń",
    deleting: "Usuwanie...",
    publishNow: "Opublikuj teraz",
    publishing: "Publikowanie...",
    confirmDelete: "Usuń post",
    confirmDeleteDescription:
      "Czy na pewno chcesz usunąć ten post? Ta akcja nie może zostać cofnięta.",
    confirmPublish: "Opublikuj post",
    confirmPublishDescription:
      "Czy na pewno chcesz opublikować ten post teraz? Będzie natychmiast widoczny dla Twoich odbiorców.",
    media: "Media",
    analytics: "Analiza",
    createdAt: "Utworzono",
  },
  platforms: {
    instagram: "Instagram",
    facebook: "Facebook",
    twitter: "Twitter",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    youtube: "YouTube",
  },
  analytics: {
    likes: "Polubienia",
    comments: "Komentarze",
    shares: "Udostępnienia",
  },
  migrateData: "Migruj dane treści",
  migrateDataDescription:
    "To zmigruje dane Twoich treści ze starej bazy danych do nowej. Ten proces może potrwać kilka chwil w zależności od ilości danych.",
  migrateDataNote:
    "Twoje istniejące dane pozostaną w starej bazie danych jako kopia zapasowa. Po migracji wszystkie nowe treści będą przechowywane w nowej bazie danych.",
  startMigration: "Rozpocznij migrację",
  migrating: "Migrowanie...",
  toast: {
    postCreated: "Post utworzony",
    postCreatedDescription: "Twój post został pomyślnie utworzony.",
    errorCreatingPost: "Błąd tworzenia postu",
    errorCreatingPostDescription:
      "Wystąpił błąd podczas tworzenia Twojego postu.",
    postUpdated: "Post zaktualizowany",
    postUpdatedDescription: "Twój post został pomyślnie zaktualizowany.",
    errorUpdatingPost: "Błąd aktualizacji postu",
    errorUpdatingPostDescription:
      "Wystąpił błąd podczas aktualizacji Twojego postu.",
    postDeleted: "Post usunięty",
    postDeletedDescription: "Twój post został pomyślnie usunięty.",
    errorDeletingPost: "Błąd usuwania postu",
    errorDeletingPostDescription:
      "Wystąpił błąd podczas usuwania Twojego postu.",
    unexpectedError: "Wystąpił nieoczekiwany błąd.",
    migrationSuccessful: "Migracja pomyślna",
    migrationFailed: "Migracja nie powiodła się",
    postPublished: "Post opublikowany",
    postPublishedDescription: "Twój post został pomyślnie opublikowany.",
    errorPublishingPost: "Błąd publikowania postu",
    errorPublishingPostDescription:
      "Wystąpił błąd podczas publikowania Twojego postu.",
  },
};
