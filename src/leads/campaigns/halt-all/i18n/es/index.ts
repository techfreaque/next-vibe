import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Detengan todas las campañas",
  description: "Parar todas las campañas de correo electrónico activas",
  post: {
    title: "Detengan todas las campañas",
    titleShort: "Halt Campaigns",
    description:
      "Detenga inmediatamente todas las campañas de correo electrónico activas y cancele los envíos pendientes",
    fields: {
      confirm: {
        label: "Confirmación de suspensión",
        description:
          "Compruebe para confirmar que desea detener todas las campañas",
      },
      reason: {
        label: "Razón",
        description: "Razones para detener (opcional)",
      },
    },
    response: {
      halted: "Campañas suspendidas",
      emailsCancelled: "Correos cancelados",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debe ser administrador",
      },
      forbidden: { title: "Acceso denegado", description: "No hay permiso" },
      server: {
        title: "Error del servidor",
        description: "Failed to halt campaigns",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      validation: {
        title: "Error de validación",
        description: "La confirmación debe ser comprobada",
      },
      notFound: {
        title: "No encontrado",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: { title: "Error de red", description: "Error de red" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Cambios sin guardar",
      },
    },
    success: {
      title: "Campañas suspendidas",
      description: "Todas las campañas se han detenido con éxito",
    },
  },
  widget: {
    title: "De emergencia:",
    description:
      "Detenga inmediatamente todas las campañas de correo electrónico activas. Use esto en caso de errores o problemas urgentes.",
    haltButton: "Detengan todas las campañas",
    halting: "Halting...",
    confirmTitle: "¿Detener todas las campañas?",
    confirmDescription:
      "Esto de inmediato detendrá todas las campañas de correo electrónico activas y cancelará los correos electrónicos pendientes. Esta acción no se puede deshacer.",
    confirmButton: "Sí, lo detengo todo.",
    cancelButton: "Cancelar",
    done: "Detenido",
  },
};
