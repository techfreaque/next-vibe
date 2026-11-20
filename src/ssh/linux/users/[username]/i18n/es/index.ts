import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    localModeOnly: {
      title: "Modo local",
    },
    cannotDeleteCurrentUser: "No se puede borrar el usuario del proceso actual",
    cannotDeleteSystemUser:
      "No se puede eliminar los usuarios del sistema (uid  ⁇  1000)",
    userNotFound: "Usuario no encontrado",
  },

  delete: {
    review: "Consulta la cuenta local en la lista de usuarios de Linux.",
    title: "Eliminar el usuario de Linux",
    titleShort: "Eliminar el usuario",
    description: "Eliminar una cuenta de usuario OS desde el host",
    fields: {
      removeHome: {
        label: "Eliminar Inicio Directorio",
        description: "Eliminar también el directorio de inicio del usuario",
        placeholder: "",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Parámetros inválidos",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso de los administradores necesario",
      },
      forbidden: {
        title: "Acceso denegado",
        description:
          "No puede eliminar usuarios del sistema o usuario del proceso actual",
      },
      server: {
        title: "Error del servidor",
        description: "Fallado para borrar usuario",
      },
      notFound: {
        title: "No encontrado",
        description: "Usuario no encontrado",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error inesperado",
      },
      unsavedChanges: { title: "Cambios sin guardar" },
      conflict: {
        title: "Conflicto",
        description: "El usuario no puede ser eliminado",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      timeout: { title: "Hora de salir", description: "Solicitud cedida" },
    },
    response: {
      ok: { title: "OK" },
    },
    success: {
      title: "Usuario eliminado",
      description: "Su cuenta de usuario OS eliminada con éxito",
    },
  },
};
