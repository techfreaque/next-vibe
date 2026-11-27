import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  list: {
    title: "Líderes capturados",
    titleShort: "Líderes capturados",
    description: "Todos los que presentaron su forma de imán principal",
    tag: "lead-magnet-captures",
    response: {
      items: "Contactos",
      total: "Total",
      page: "Página",
      pageSize: "Tamaño de la página",
    },
    success: {
      title: "Cargas cargadas",
      description: "Tus leads capturados",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Comprueba tu entrada",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicie sesión para continuar",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No hay pistas encontradas",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      internal: {
        title: "Error del servidor",
        description: "Se produjo un error interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
    },
  },
  widget: {
    empty:
      "Todavía no hay suscriptores. Comparte la página de tu habilidad para ampliar tu lista.",
    exportCsv: "Exportar CSV",
    columns: {
      date: "Fecha",
      name: "Nombre",
      email: "Correo electrónico",
      status: "Estado",
    },
    statusSuccess: "Registrado",
    statusFailed: "Fallido",
  },
};
