import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Cliente sin cabeza",
    titleShort: "headless",
    description: "Iniciar el cliente de conexión remota sin cabeza",
    form: {
      title: "Cliente sin cabeza",
      description:
        "Comienza a conectar WS y ejecutar herramientas. No hay servidor web.",
    },
    fields: {
      computerName: {
        title: "Nombre de la computadora",
        description:
          "Identificador para esta máquina (defaults a OS nombre de host)",
      },
      remoteUrl: {
        title: "Remoto URL",
        description: "instancia de nube URL para conectarse a",
      },
      leadId: {
        title: "ID del contacto",
        description: "Su UUID líder en la instancia remota",
      },
      token: { title: "Token", description: "Conexion auth token" },
      output: { title: "Producto" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Entrada inválida",
      },
      network: { title: "Error de red", description: "Error de red" },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Se requiere autenticación",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      notFound: {
        title: "Cuenta o sesión no encontradas",
        description: "Cuenta o sesión no encontradas",
      },
      server: {
        title: "Error del servidor",
        description: "Error del servidor",
      },
      unknown: { title: "Error desconocido", description: "Error desconocido" },
      conflict: { title: "Conflicto", description: "Conflicto" },
      migrationFailed: "La migración falló",
      migrationError: "Error de migración",
    },
    success: {
      title: "Cliente sin cabeza comenzó",
      description:
        "Inversa- WS se abren, esperando las solicitudes de herramientas",
    },
  },
};
