import type { emailTranslations as EnglishEmailTranslations } from "../../../../../en/sections/auth/signup/email";
import { afterProfileTranslations } from "./afterProfile";
import { firstStepTranslations } from "./firstStep";
import { ourServiceTranslations } from "./ourService";
import { primaryActionTranslations } from "./primaryAction";

export const emailTranslations: typeof EnglishEmailTranslations = {
  afterProfile: afterProfileTranslations,
  firstStep: firstStepTranslations,
  ourService: ourServiceTranslations,
  primaryAction: primaryActionTranslations,
  subject:
    "🎉 Witaj w {{appName}} - Twoja spersonalizowana podróż w mediach społecznościowych zaczyna się teraz!",
  title: "Witaj na pokładzie, {{firstName}}!",
  previewText:
    "Ukończ konfigurację i otrzymaj spersonalizowane treści mediów społecznościowych stworzone specjalnie dla Twojego biznesu!",
  welcomeMessage:
    "Gratulacje dołączenia do {{appName}}! Jesteśmy podekscytowani, że możemy pomóc Ci stworzyć potężną obecność w mediach społecznościowych z niestandardowymi treściami i strategią dostosowaną specjalnie do Twojego biznesu.",
  featuresIntro: "Oto czego możesz oczekiwać od {{appName}}:",
  feature1: "🎨 Profesjonalne tworzenie i planowanie treści",
  feature2: "📊 Zaawansowana analiza i wgląd w wydajność",
  feature3: "💬 Komunikacja z odbiorcami i narzędzia zaangażowania",
  feature4: "🎯 Optymalizacja strategii oparta na danych",
  needHelp: "Pytania? Jesteśmy tutaj, aby pomóc!",
  supportMessage:
    "Nasz zespół jest tutaj, aby zapewnić Twój sukces. Niezależnie od tego, czy potrzebujesz pomocy w wyborze planu, czy chcesz omówić swoje cele w mediach społecznościowych, szybko się z Tobą skontaktujemy.",
  contactSupport: "Skontaktuj się z naszym zespołem",
  excited:
    "Nie możemy się doczekać, aby zobaczyć, jak Twoja obecność w mediach społecznościowych rozkwita!",
  signoff: "Z poważaniem,\nZespół {{appName}}",
  ctaButton: "Dołącz teraz",
};
