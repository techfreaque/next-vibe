import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  tags: { vibeSense: "vibe-sense" },
  enums: {
    source: {
      public: "Público (invitados)",
      usersFree: "Usuarios gratis",
      paid: "De pago",
      gifted: "Regalados",
      internal: "Internos (admins)",
      unattributed: "Sin atribuir (historial)",
    },
  },
  post: {
    titleShort: "Uso por origen",
    title: "Créditos gastados por origen",
    description:
      "Créditos gastados, divididos según quién los gastó y qué créditos pagaron: público (invitados), usuarios gratis, de pago, regalados, internos, sin atribuir. La suma de los orígenes da el gasto total.",
    fields: {
      resolution: { label: "Resolución", description: "Intervalo de cálculo" },
      range: { label: "Rango", description: "Periodo a consultar" },
      lookback: {
        label: "Historial",
        description: "Barras extra antes del inicio del rango",
      },
      source: {
        label: "Origen",
        description:
          "Qué créditos contar: invitados públicos, créditos gratis de cuentas registradas, de pago (suscripción + packs), regalados (asignados por admin), internos (cuentas admin) o historial sin atribuir",
      },
      result: {
        label: "Créditos gastados",
        description: "Serie temporal de salida",
      },
      meta: { label: "Meta", description: "Metadatos de ejecución del nodo" },
    },
    success: {
      title: "Créditos por origen calculados",
      description: "Serie de créditos por origen devuelta",
    },
    errors: {
      unauthorized: {
        title: "No autorizado",
        description: "Se requiere autenticación",
      },
      forbidden: {
        title: "Prohibido",
        description: "Se requiere acceso de administrador",
      },
      server: { title: "Error del servidor", description: "La consulta falló" },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      validation: {
        title: "Validación fallida",
        description: "Parámetros de solicitud no válidos",
      },
      notFound: { title: "No encontrado", description: "No encontrado" },
      conflict: { title: "Conflicto", description: "Conflicto" },
      network: {
        title: "Error de red",
        description: "La solicitud de red falló",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guarda los cambios primero",
      },
    },
  },
};
