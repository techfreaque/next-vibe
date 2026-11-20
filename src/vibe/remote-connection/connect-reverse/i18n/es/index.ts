import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Cuenta",
  tags: {
    remoteConnection: "Conexión remota",
  },
  post: {
    title: "Registro de la instalación local",
    titleShort: "Registro de la instalación",
    description:
      "Llamado por una instancia local durante el flujo de conexión para registrarse en la nube",
    instanceId: {
      label: "Instance ID",
      description: "El identificador único de la instancia local",
      placeholder: "hermes",
      validation: {
        invalid: "Usar sólo letras minúsculas, números e hipnosis",
      },
    },
    localUrl: {
      label: "Local URL",
      description: "La aplicación URL de la instancia local",
      placeholder: "http://localhost:3000",
      validation: {
        required: "Por favor, introduzca el URL local",
        invalid: "Por favor, introduzca un URL válido",
      },
    },
    reverseToken: {
      label: "Token",
      description:
        "JWT token para el remoto para autenticar de nuevo a esta instancia",
    },
    reverseLeadId: {
      label: "Contacto inverso ID",
      description: "Lead ID para la conexión inversa",
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Por favor, compruebe sus datos e inténtelo de nuevo",
      },
      network: {
        title: "Error de red",
        description: "No se pudo conectar con el servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Debes estar conectado para registrar una instancia",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para registrar una instancia.",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      server: {
        title: "Error del servidor",
        description: "Se produjo un error al registrar la instancia",
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
        title: "Instance ID Ya registrado",
        description:
          "Una instancia con este ID ya está registrada para su cuenta. Elija una instancia diferente ID.",
      },
    },
    success: {
      title: "Instance Registered",
      description: "La instancia local se ha registrado con éxito",
    },
  },
};
