import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  enums: {
    resolution: {
      "1m": "1 minuto",
      "3m": "3 minutos",
      "5m": "5 minutos",
      "15m": "15 minutos",
      "30m": "30 minutos",
      "1h": "1 hora",
      "4h": "4 horas",
      "1d": "1 día",
      "1w": "1 semana",
      "1M": "1 Mes",
    },
  },
  tags: { vibeSense: "vibe-sense" },
  post: {
    title: "Corre Backtest",
    titleShort: "Backtest",
    description:
      "Ejecute un respaldo sobre un rango histórico (actuaciones simuladas)",
    fields: {
      id: { label: "Gráfico ID", description: "UUID del gráfico" },
      rangeFrom: { label: "Desde", description: "Backtest range start" },
      rangeTo: { label: "A", description: "Retroceso final de rango" },
      resolution: {
        label: "Resolución",
        description: "Calendario para la evaluación",
      },
    },
    response: {
      runId: "Corre ID",
      eligible: "Eligible",
      ineligibleNodes: "Nodos ineligibles",
    },
    widget: {
      eligible: "Eligible",
      notEligible: "No es eligible",
      runLabel: "Corre:",
      ineligibleNodesLabel: "Nodos ineligibles:",
      ineligibleNodesHint:
        "Estos nodos no pueden ser respaldados (desestimar los datos persistentes, resolución incompatible o lógica sólo de script).",
    },
    success: {
      title: "Retroceso completo",
      description: "Backtest corrió con éxito",
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
        description: "La prueba falló.",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Falló la validación",
        description: "Parámetros inválidos",
      },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Gráfico no encontrado",
      },
      conflict: { title: "Conflicto", description: "Conflicto de recursos" },
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
