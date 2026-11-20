import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "OR",
    titleShort: "OR",
    description:
      "Fuegos cuando cualquier señal de entrada se dispara en un temporizador dado",
    fields: {
      signals: {
        label: "Corrientes de señalización",
        description: "Arregle de los flujos de señal a OR juntos",
      },
      result: {
        label: "Resultado",
        description: "Eventos de señalización de salida",
      },
    },
    success: {
      title: "OR evaluado",
      description: "Actos de señalización devueltos",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso de los administradores necesario",
      },
      server: {
        title: "Error del servidor",
        description: "La evaluación OR falló",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Cuenta o sesión no encontradas",
      },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "Solicitud de red falló",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar los cambios primero",
      },
    },
  },
};
