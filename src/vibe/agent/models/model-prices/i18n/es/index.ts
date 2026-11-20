import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Actualizar todos los precios del modelo",
    titleShort: "Precios de actualización",
    description:
      "Obtenga precios en directo para todos los modelos de cada proveedor API (OpenRouter, Replicar, etc.) y actualizar modelos.ts",
    form: {
      title: "Actualización de precios modelo",
    },
    response: {
      summary: {
        title: "Resumen",
        totalProviders: "Proveedores Corren",
        totalModels: "Modelos totales",
        modelsUpdated: "Modelos actualizados",
        fileUpdated: "Actualización de archivos",
      },
      updates: {
        title: "Modelos actualizados",
        model: {
          modelId: "Modelo ID",
          name: "Nombre del modelo",
          provider: "Proveedor",
          field: "Precio Campo",
          value: "Nuevo valor",
          source: "Precio Fuente",
        },
      },
      failures: {
        title: "Precio Fetch Failures",
        model: {
          modelId: "Modelo ID",
          provider: "Proveedor",
          reason: "Razón",
        },
      },
      providerResults: {
        title: "Resultados del proveedor",
        model: {
          provider: "Proveedor",
          modelsFound: "Modelos encontrados",
          modelsUpdated: "Actualizado",
          error: "Error",
        },
      },
    },
    errors: {
      server: {
        title: "Error del servidor",
        description: "Failed to update model prices",
      },
      network: {
        title: "Error de red",
        description: "No podía conectarse a las API de precios",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
        // `title` doubles as the generic errorTypes label - detail lives here so
        // no raw placeholder leaks into those labels.
        detail: "Error desconocido: {{error}}",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted no está autorizado para realizar esta acción",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Se prohíbe el acceso a este recurso.",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto al tramitar la solicitud",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
    },
    success: {
      title: "Operación completada",
      description: "Con éxito busca y actualiza todos los precios del modelo",
    },
  },
  tags: {
    models: "Modelos",
  },
  updateAllModelPrices: {
    name: "Actualizar todos los precios del modelo",
    description:
      "Piezas de precios en vivo para todos los modelos de cada proveedor API y actualizaciones modelos.ts",
  },
};
