import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "Au {{date}}",
  reviewErrors: "Consulter les erreurs",
  reviewTasks: "Consulter les tâches en échec",
  reviewConnections: "Vérifier les connexions",
  title: "Vue des opérations",
  description:
    "Consultez les erreurs ouvertes, les tâches en échec et l’état des instances connectées.",
  errors: "Erreurs ouvertes",
  tasks: "Tâches en échec",
  connections: "Connexions dégradées",
  errorAlert: "Groupes d’erreurs ouvertes ({{count}})",
  taskAlert: "Tâches planifiées en échec ({{count}})",
  connectionAlert: "Connexions à vérifier ({{count}})",
  attention: "À examiner",
  clear: "Ces contrôles ne signalent aucun problème ouvert.",
  unavailable: "Certains contrôles sont indisponibles.",
  recent: "Activité récente",
  loading: "Chargement de l’état du système",
  retry: "Réessayer",
};
