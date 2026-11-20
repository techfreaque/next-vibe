import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  providers: {
    memories: "Memorias",
    documents: "Documentos",
    skills: "Skills",
    favorites: "Favoritos",
    threads: "Conversaciones",
  },
  providerDescriptions: {
    memories: "Sincronice sus recuerdos de AI en casos",
    documents: "Sincronice su biblioteca de documentos",
    skills: "Destrezas personalizadas sincronizadas y sugerencias",
    favorites: "Configuraciones favoritas guardadas Sync",
    threads: "Sincronización de hilos y mensajes de conversación",
  },
  get: {
    title: "Proveedores de sincronización",
    titleShort: "Proveedores de sincronización",
    description:
      "Listar todos los proveedores de sincronización registrados para la configuración de conexión",
    errors: {
      validation: {
        title: "Error de validación",
        description: "Solicitud inválida",
      },
      network: { title: "Error de red", description: "No conectado" },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión para continuar",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Función de personal necesaria",
      },
      notFound: {
        title: "No encontrado",
        description: "No hay proveedores registrados",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to load providers",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Tienes cambios sin guardar",
      },
      conflict: { title: "Conflicto", description: "Se produjo un conflicto" },
    },
    success: {
      title: "Proveedores cargados",
      description:
        "Lista de proveedores de sincronización recuperada con éxito",
    },
  },
};
