/**
 * English translations for WS Provider Models endpoint
 */

import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Modelos AI",
  tags: {
    models: "modelos",
    aiModels: "ai-models",
  },
  get: {
    title: "Lista Modelos AI",
    titleShort: "Modelos AI",
    description:
      "Devuelve todos los modelos AI disponibles con información de precios y capacidad",
    response: {
      models: {
        title: "Modelos",
      },
      id: {
        content: "Modelo ID",
      },
      name: {
        content: "Nombre",
      },
      provider: {
        content: "Proveedor",
      },
      category: {
        content: "Categoría",
      },
      description: {
        content: "Descripción",
      },
      contextWindow: {
        content: "Ventana de contexto",
      },
      supportsTools: {
        content: "Herramientas de soporte",
      },
      creditCost: {
        content: "Costo de crédito",
      },
    },
    success: {
      title: "Modelos logrados",
      description: "Lista de modelos AI recuperada con éxito",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Acceso denegado",
      },
      notFound: {
        title: "No encontrado",
        description: "Modelos no encontrados",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to retrieve models",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
  },
};
