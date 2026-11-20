import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Google Sheets",
  titleShort: "Google Sheets",
  description:
    "Agregue automáticamente cada nuevo plomo como fila en su hoja Google. Conecte su cuenta Google - sin necesidad de teclas API.",
  connect: {
    label: "Conecte la cuenta Google",
    description:
      "Inicia sesión con Google para autorizar el acceso a tus hojas de cálculo",
  },
  connected: {
    label: "Conectado",
    description: "Su cuenta Google está conectada",
  },
  spreadsheetId: {
    label: "Hoja de cálculo",
    description: "Seleccione la hoja de cálculo donde se añadirán los cables",
    placeholder: "Seleccione una hoja de cálculo...",
  },
  sheetTab: {
    label: "Tapa de hoja (opcional)",
    description:
      "El nombre de la ficha dentro de la hoja de cálculo. Deja en blanco para usar la primera pestaña.",
    placeholder: "Por ejemplo. Plomo",
  },
  saveTag: "lead-magnet-google-sheets",
  saveTitle: "Guardar configuración de hojas de Google",
  saveDescription: "Conecta tu hoja Google para capturar los cables",
  saveSuccess: {
    title: "Conectado",
    description: "Las nuevas pistas aparecerán como filas en su hoja.",
  },
  oauthStart: {
    title: "Conectar las hojas de Google",
    description:
      "Comience el flujo OAuth Google para autorizar el acceso a la hoja de cálculo",
  },
  oauthCallback: {
    title: "Google Sheets OAuth Callback",
    description:
      "Maneja el intercambio de código OAuth después de la red de Google",
  },
  sheetsList: {
    title: "Lista de hojas de cálculo",
    titleShort: "Hojas de cálculo",
    description:
      "Devuelve la lista de hojas de cálculo accesibles a la cuenta Google conectada",
  },
  errors: {
    validation: {
      title: "Error de validación",
      description: "Comprueba tu entrada",
    },
    unauthorized: {
      title: "Se requiere autenticación",
      description: "Inicie sesión para continuar",
    },
    forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
    notFound: {
      title: "Cuenta o sesión no encontradas",
      description: "No se encontró el recurso",
    },
    conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
    network: {
      title: "Error de red",
      description: "Se produjo un error de red",
    },
    unsavedChanges: {
      title: "Cambios sin guardar",
      description: "Tienes cambios sin guardar",
    },
    internal: {
      title: "Error del servidor",
      description: "Se produjo un error interno",
    },
    unknown: {
      title: "Error desconocido",
      description: "Ocurrió un error desconocido",
    },
    oauthFailed: "La autorización Google falló. Por favor, inténtalo de nuevo.",
    noRefreshToken:
      "Google no devolvió un token refrescante. Por favor, desconecte y vuelva a conectar su cuenta.",
    sheetsApiFailed:
      "No podía cargar hojas de cálculo. Comprueba tu conexión Google.",
    appendFailed: "No podía escribir a Google Sheet. Token puede ser caducado.",
  },
  response: {
    provider: "Proveedor",
    isActive: "Activa",
    spreadsheetId: "hoja de cálculo ID",
    sheetTab: "Ficha de hoja de cálculo",
    sheets: "Hojas de cálculo",
    connected: "Conectado",
  },
  widget: {
    connectTitle: "Conectar las hojas de Google",
    connectDescription:
      "Inicie sesión con Google para agregar automáticamente cada nuevo plomo como fila en su hoja de cálculo.",
    redirectNote:
      "Será redireccionado a Google para otorgar acceso a hojas de cálculo.",
    reconnect: "Reconectar",
    loading: "Carga de hojas de cálculo...",
    noSheets: "No hay hojas de cálculo encontradas",
    refresh: "Lista de referencia",
    selectRequired: "Por favor, seleccione una hoja de cálculo",
    saveFailed: "Falló para salvar. Por favor, inténtalo de nuevo.",
    saving: "Salvando...",
  },
};
