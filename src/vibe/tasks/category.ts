import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "automation",
  label: {
    "en-US": "Scheduled work",
    "de-DE": "Geplante Aufgaben",
    "pl-PL": "Zaplanowane zadania",
    "fr-FR": "Tâches planifiées",
    "it-IT": "Attività pianificate",
    "es-ES": "Tareas programadas",
    "sk-SK": "Naplánované úlohy",
    "hi-IN": "शेड्यूल किया काम",
    "en-GLOBAL": "Scheduled work",
  },
  description: {
    "en-US": "Inspect scheduled jobs, task runs and failures.",
    "de-DE": "Prüfen Sie geplante Aufgaben, Ausführungen und Fehler.",
    "pl-PL": "Sprawdź harmonogram zadań, wykonania i błędy.",
    "fr-FR": "Consultez les tâches planifiées, leur exécution et les échecs.",
    "it-IT": "Verifichi le attività pianificate, le esecuzioni e gli errori.",
    "es-ES": "Revise las tareas programadas, las ejecuciones y los fallos.",
    "sk-SK": "Skontrolujte naplánované úlohy, ich priebeh a zlyhania.",
    "hi-IN": "शेड्यूल किए जॉब, टास्क रन और फ़ेलियर जाँचें।",
    "en-GLOBAL": "Inspect scheduled jobs, task runs and failures.",
  },
  group: "system",
  icon: "calendar",
  order: 2,
  adminPathPrefixes: ["vibe/tasks"],
  landing: {
    destinations: ["task-list", "cron-stats", "cron-queue", "cron-history"],
    destinationDescriptions: {
      "task-list": {
        "en-US": "Check task status and upcoming runs.",
        "en-GLOBAL": "Check task status and upcoming runs.",
        "de-DE": "Aufgabenstatus und nächste Ausführungen prüfen.",
        "pl-PL": "Sprawdź stan zadań i terminy kolejnych uruchomień.",
        "fr-FR": "Vérifiez l’état des tâches et les prochaines exécutions.",
        "it-IT": "Controlli lo stato delle attività e le prossime esecuzioni.",
        "es-ES":
          "Compruebe el estado de las tareas y sus próximas ejecuciones.",
        "sk-SK": "Skontrolujte stav úloh a ich najbližšie spustenia.",
        "hi-IN": "टास्क स्टेटस और आने वाले रन जाँचें।",
      },
      "cron-stats": {
        "en-US": "Failing, stuck and overdue tasks with success rates.",
        "en-GLOBAL": "Failing, stuck and overdue tasks with success rates.",
        "de-DE":
          "Fehlschlagende, hängende und überfällige Aufgaben mit Erfolgsquote.",
        "pl-PL":
          "Zadania z błędami, zawieszone i zaległe wraz ze skutecznością.",
        "fr-FR":
          "Tâches en échec, bloquées ou en retard, avec taux de réussite.",
        "it-IT":
          "Attività fallite, bloccate o in ritardo, con tasso di successo.",
        "es-ES": "Tareas fallidas, bloqueadas o atrasadas, con tasa de éxito.",
        "sk-SK": "Zlyhané, zaseknuté a oneskorené úlohy s mierou úspešnosti.",
        "hi-IN": "फ़ेल, अटके और लेट टास्क, सफलता दर के साथ।",
      },
      "cron-queue": {
        "en-US": "What runs next, in order of start time.",
        "en-GLOBAL": "What runs next, in order of start time.",
        "de-DE": "Was als Nächstes läuft, nach Startzeit sortiert.",
        "pl-PL": "Co uruchomi się następne, według godziny startu.",
        "fr-FR": "Ce qui s’exécute ensuite, par heure de départ.",
        "it-IT": "Cosa parte dopo, in ordine di avvio.",
        "es-ES": "Lo que se ejecuta a continuación, por hora de inicio.",
        "sk-SK": "Čo sa spustí ďalej, podľa času spustenia.",
        "hi-IN": "आगे क्या चलेगा, शुरू होने के समय के क्रम में।",
      },
      "cron-history": {
        "en-US": "Past runs with result, duration and errors.",
        "en-GLOBAL": "Past runs with result, duration and errors.",
        "de-DE": "Frühere Läufe mit Ergebnis, Dauer und Fehlern.",
        "pl-PL": "Wcześniejsze uruchomienia z wynikiem, czasem i błędami.",
        "fr-FR": "Exécutions passées avec résultat, durée et erreurs.",
        "it-IT": "Esecuzioni passate con esito, durata ed errori.",
        "es-ES": "Ejecuciones anteriores con resultado, duración y errores.",
        "sk-SK": "Minulé spustenia s výsledkom, trvaním a chybami.",
        "hi-IN": "पिछले रन, नतीजे, अवधि और एरर के साथ।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: "task-list",
    [UserPermissionRole.CUSTOMER]: USER_ME_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
};
