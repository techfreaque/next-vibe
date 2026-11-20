import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Correr Config de Gráficos",
    titleShort: "Corre Config",
    description:
      "Ejecute un gráfico de un config en línea sin requerir un gráfico guardado",
    fields: {
      config: {
        label: "Graph Config",
        description:
          "Configuración de gráficos en línea (nodos, bordes, gatillo)",
      },
      rangeFrom: {
        label: "Desde",
        description: "Rango de inicio (ISO fecha)",
      },
      rangeTo: {
        label: "A",
        description: "Fin de rango (hora ISO)",
      },
    },
    response: {
      nodeCount: "Números ejecutados",
      errorCount: "Errores",
      errors: "Detalles del error",
    },
    success: {
      title: "Config executed",
      description: "El config de Gráfico corrió con éxito",
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
        description: "La ejecución de los Gráficos falló",
        detail: "Ejecución de Gráficos falló: {{error}}",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Configuración o parámetros de gráficos inválidos",
        detail: "Inválido gráfico config: {{error}}",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Conflicto de recursos",
      },
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
