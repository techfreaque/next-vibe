import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: {
    vibeSense: "vibe-sense",
  },
  enums: {
    outcome: {
      started: "Iniciados",
      paid: "Pagados",
      abandoned: "Abandonados o rechazados",
    },
  },
  post: {
    title: "Checkouts",
    titleShort: "Checkouts",
    description:
      "Checkouts de paquetes y nuevas suscripciones abiertos por periodo, según el resultado. Abandonado: la sesión caducó a las 24 h o se rechazó el cobro. Sin renovaciones ni cuentas admin.",
    fields: {
      resolution: {
        label: "Resolución",
        description: "Plazo de cálculo",
      },
      range: {
        label: "Rango",
        description: "Rango de tiempo para la consulta",
      },
      lookback: {
        label: "Mira atrás.",
        description: "Barras extra antes de empezar el rango",
      },
      result: {
        label: "Checkouts",
        description: "Serie de tiempo de producción",
      },
      meta: {
        label: "Meta",
        description: "Metadatos de ejecución de nodos",
      },
      outcome: {
        label: "Resultado",
        description: "Iniciados (todos), pagados o abandonados/rechazados",
      },
    },
    success: {
      title: "Checkouts calculados",
      description: "Serie de checkouts devuelta",
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
        description: "La consulta falló.",
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
      conflict: {
        title: "Conflicto",
        description: "Conflicto",
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
