import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  snapshot: "Datos a {{date}}",
  reviewErrors: "Revisar errores",
  reviewTasks: "Revisar tareas fallidas",
  reviewConnections: "Revisar conexiones",
  title: "Resumen operativo",
  description:
    "Consulta los errores abiertos, las tareas fallidas y el estado de las instancias conectadas.",
  errors: "Errores abiertos",
  tasks: "Tareas fallidas",
  connections: "Conexiones con problemas",
  errorAlert: "Grupos de errores abiertos ({{count}})",
  taskAlert: "Tareas programadas fallidas ({{count}})",
  connectionAlert: "Conexiones que requieren atención ({{count}})",
  attention: "Requiere atención",
  clear: "Estas comprobaciones no muestran incidencias abiertas.",
  unavailable: "Algunas comprobaciones no están disponibles.",
  recent: "Actividad reciente",
  loading: "Cargando el estado del sistema",
  retry: "Reintentar",
};
