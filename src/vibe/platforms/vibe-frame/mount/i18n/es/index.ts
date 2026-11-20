import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Sistema",
  tags: {
    vibeFrame: "Vibe Frame",
    embed: "Embed",
    widget: "Widget",
    config: "Config",
  },
  post: {
    title: "Vibe Frame Config",
    titleShort: "Vibe Frame",
    description:
      "Devuelve URLs iframe para las integraciones solicitadas. Server lee verdaderas cookies de auth (credentials: include) y mints tokens de intercambio de corta duración para que no aparezcan secretos en URLs.",
    container: {
      title: "Vibe Frame Config",
      description: "Solicitar URLs iframe para una o más integraciones",
    },
    fields: {
      leadId: {
        label: "ID del contacto",
        description:
          "Guía de visitantes ID desde la página de host (cross-origin - no se puede leer de cookies)",
      },
      authToken: {
        label: "Auth Token",
        description:
          "JWT auth token desde la sesión de la página de inicio (para los widgets autenticados)",
      },
      integrations: {
        label: "Integraciones",
        description: "Lista de integraciones para configurar",
      },
      integration: {
        label: "Integración",
        description: "Configuración de integración única",
      },
      id: {
        label: "Integración ID",
        description: "Identificador único para esta ranura de integración",
        placeholder: "contact_POST",
      },
      endpoint: {
        label: "Endpoint",
        description:
          "Anulación de identificador de punto final (defaults a id si no se establece)",
        placeholder: "contact_POST",
      },
      hasRendered: {
        label: "Has Rendered",
        description:
          "Establecido a la verdad si esta integración ya está montada - servidor puede saltarla",
      },
      theme: {
        label: "Tema",
        description: "Tema de color para el marco",
      },
      urlPathParams: {
        label: "URL Path Params",
        description: "JSON - parámetros de ruta URL codificados",
        placeholder: '{"id":"123"}',
      },
      data: {
        label: "Datos",
        description: "JSON - datos pre-fill codificados",
        placeholder: "{}",
      },
      widgets: {
        label: "Widgets",
        description: "Mapa de integración ID a widget config",
      },
      widget: {
        label: "Widget",
        description: "Widget config para una integración",
      },
      frameId: {
        label: "Frame ID",
        description: "Marco único ID para la comunicación puente",
      },
      widgetUrl: {
        label: "Widget URL",
        description: "Iframe src URL con token de cambio",
      },
    },
    errors: {
      validation: {
        title: "Parámetros inválidos",
        description: "Los parámetros proporcionados son inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "No tienes acceso",
        description: "No tienes permiso.",
      },
      notFound: {
        title: "Punto final no encontrado",
        description: "Uno o más puntos finales no existen",
      },
      internal: {
        title: "Config falló",
        description: "Se produjo un error al construir la respuesta de config",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto",
      },
    },
    repository: {
      invalidUrlPathParams: "Parámetros de ruta URL inválidos",
      invalidData: "Formato de datos inválidos",
      endpointNotFound: "Punto final no encontrado",
      configFailed: "Failed to build frame config",
      tokenMintFailed: "Fallado a la señal de cambio de menta",
    },
    success: {
      configured: {
        title: "Config listo",
        description: "URL de Iframe generadas con éxito",
      },
    },
  },
};
