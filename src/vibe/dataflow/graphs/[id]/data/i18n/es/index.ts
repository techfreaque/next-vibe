import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Vibe Sense",
  tags: { vibeSense: "vibe-sense" },
  get: {
    title: "Detalle de Gráficos",
    titleShort: "Datos de Gráficos",
    description: "Ver gráfico con indicadores y señales",
    fields: {
      id: { label: "Gráfico ID", description: "UUID del gráfico" },
      resolution: {
        label: "Resolución",
        description: "Tamaño del cubo para la serie de tiempo",
      },
      cursor: {
        label: "Cursor",
        description: "Tiempos más antiguos cargados para la paginación",
      },
    },
    response: {
      graph: {
        id: "ID",
        slug: "Slug",
        name: "Nombre",
        description: "Descripción",
        ownerType: "Tipo de propietario",
        isActive: "Activa",
        createdAt: "Creado en",
        config: "Config",
      },
      series: {
        nodeId: "Nodo ID",
        timestamp: "Timestamp",
        value: "Valor",
      },
      signals: {
        nodeId: "Nodo ID",
        timestamp: "Timestamp",
        fired: "Disparos",
      },
    },
    widget: {
      loading: "Carga gráfica...",
      back: "Atrás",
      active: "Activa",
      inactive: "Inactivo",
      nodes: "nodos",
      trigger: "Trigger",
      backtest: "Backtest",
      edit: "Editar",
      archive: "Archivar",
      promote: "Promover",
      signal: "Signal",
      noData: "No hay datos en este rango",
      loadingEarlierData: "Cargando datos anteriores...",
    },
    success: {
      title: "Gráfico cargado",
      description: "Gráfico recuperado con éxito",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      server: {
        title: "Error del servidor",
        description: "Failed to load graph",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: { title: "Falló la validación", description: "Inválido ID" },
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
