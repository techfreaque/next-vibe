import type { onboardingTranslations as EnglishOnboardingTranslations } from "../../../en/sections/onboarding";
import { actionsTranslations } from "./actions";
import { completeTranslations } from "./complete";
import { completedTranslations } from "./completed";
import { consultationTranslations } from "./consultation";
import { defaultsTranslations } from "./defaults";
import { detailedDescriptionTranslations } from "./detailedDescription";
import { errorTranslations } from "./error";
import { errorsTranslations } from "./errors";
import { formTranslations } from "./form";
import { loadingTranslations } from "./loading";
import { messagesTranslations } from "./messages";
import { nextStepsTranslations } from "./nextSteps";
import { optionsTranslations } from "./options";
import { paymentTranslations } from "./payment";
import { pricingTranslations } from "./pricing";
import { progressTranslations } from "./progress";
import { questionsTranslations } from "./questions";
import { stepsTranslations } from "./steps";
import { successTranslations } from "./success";
import { tabsTranslations } from "./tabs";
import { tasksTranslations } from "./tasks";
import { unifiedTranslations } from "./unified";

export const onboardingTranslations: typeof EnglishOnboardingTranslations = {
  actions: actionsTranslations,
  complete: completeTranslations,
  completed: completedTranslations,
  consultation: consultationTranslations,
  defaults: defaultsTranslations,
  detailedDescription: detailedDescriptionTranslations,
  error: errorTranslations,
  errors: errorsTranslations,
  form: formTranslations,
  loading: loadingTranslations,
  messages: messagesTranslations,
  nextSteps: nextStepsTranslations,
  options: optionsTranslations,
  payment: paymentTranslations,
  pricing: pricingTranslations,
  progress: progressTranslations,
  questions: questionsTranslations,
  steps: stepsTranslations,
  success: successTranslations,
  tabs: tabsTranslations,
  tasks: tasksTranslations,
  unified: unifiedTranslations,
  title: "Ukończ swoje wdrożenie",
  description:
    "Dołącz do bezpłatnej konsultacji - możesz pominąć opcjonalne kroki poniżej i uzupełnić je razem podczas rozmowy z naszymi ekspertami.",
  welcome: "Witaj w swojej podróży w mediach społecznościowych",
  getStarted:
    "Skonfigurujmy Twoją strategię mediów społecznościowych. Wybierz plan lub zaplanuj konsultację, aby rozpocząć.",
  step: "Krok",
};
