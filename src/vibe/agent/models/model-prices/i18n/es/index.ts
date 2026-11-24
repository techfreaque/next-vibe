import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Agent",

  get: {
    title: "Actualizar todos los precios del modelo",
    titleShort: "Precios de actualización",
    description:
      "Consulta los precios vigentes de los proveedores y muestra los cambios propuestos. Usa --write en la CLI local para aplicarlos.",
    form: {
      title: "Actualización de precios modelo",
      write: "Escribir cambios en los archivos fuente",
    },
    response: {
      diff: "Diferencias en los archivos fuente",
      summary: {
        title: "Resumen",
        totalProviders: "Proveedores Corren",
        totalModels: "Modelos totales",
        modelsUpdated: "Cambios propuestos",
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
      description:
        "Se consultaron los precios de los proveedores y se compararon con el catálogo.",
    },
  },
  tags: {
    models: "Modelos",
  },
  updateAllModelPrices: {
    name: "Actualizar todos los precios de los modelos",
    description:
      "Compara los precios vigentes de los proveedores con el catálogo y registra las diferencias para su revisión.",
  },
};
