import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Perfil de usuario",

  tag: "avatar",
  errors: {
    user_not_found: "Usuario {{userId}} no encontrado",
    failed_to_upload_avatar:
      "Failed to upload avatar for {{userId}} : {{error}}",
    failed_to_delete_avatar:
      "Failed to delete avatar for {{userId}} : {{error}}",
    invalid_file_type:
      "Tipo de archivo inválido {{providedType}}. Permitido: {{allowedTypes}}",
    file_too_large:
      "Archivo demasiado grande: {{providedSize}}. Max {{maxSize}}",
  },
  debug: {
    uploadingUserAvatar: "Subir el avatar del usuario",
    errorUploadingUserAvatar: "Error cargando avatar usuario",
    deletingUserAvatar: "Eliminación de avatar usuario",
    errorDeletingUserAvatar: "Error de eliminación del usuario avatar",
  },
  success: {
    uploaded: "Avatar subió con éxito",
    deleted: "Avatar borrado con éxito",
    nextSteps: {
      visible: "Su avatar ahora es visible en su perfil",
      update:
        "Puede actualizarlo en cualquier momento desde la configuración de su perfil",
      default: "Su perfil ahora muestra el avatar predeterminado",
      uploadNew:
        "Puede subir un nuevo avatar en cualquier momento desde la configuración de su perfil",
    },
  },
  upload: {
    title: "Subir Avatar",
    titleShort: "Subir Avatar",
    description: "Subir una imagen avatar perfil",
    groups: {
      fileUpload: {
        title: "Cargo de archivos",
        description: "Seleccione y cargue su imagen avatar",
      },
    },
    fields: {
      file: {
        label: "Imagen de Avatar",
        description: "Seleccione un archivo de imagen para su perfil avatar",
        placeholder: "Elija un archivo de imagen...",
        help: "Subir un archivo de imagen (JPG, PNG, GIF) hasta 5MB",
        validation: {
          maxSize: "El tamaño de archivo debe ser inferior a 5MB",
          imageOnly: "Sólo se admiten archivos de imagen",
          unsupportedFormat:
            "Formato de imagen sin soporte. Utilice JPEG, PNG, WebP o GIF.",
        },
      },
    },
    response: {
      title: "Subir la respuesta",
      label: "Subir Resultado",
      description: "Respuesta a la subida de Avatar",
      success: "Subir Exitoso",
      message: "Tu avatar ha sido subido con éxito",
      avatarUrl: "Avatar URL",
      uploadTime: "Tiempo de carga",
      nextSteps: {
        item: "Siguiente paso",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "El archivo subido es inválido o corrupto",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Debes estar conectado para subir un avatar",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to process avatar upload",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error de servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Un error inesperado ocurrió durante la subida",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red durante la subida",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes permiso para subir un avatar",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso solicitado",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Un conflicto ocurrió durante la subida",
      },
    },
    success: {
      title: "Avatar Uploaded",
      description: "Su perfil avatar ha sido subido con éxito",
    },
  },
  delete: {
    title: "Eliminar Avatar",
    titleShort: "Eliminar Avatar",
    description: "Eliminar el perfil actual avatar",
    response: {
      title: "Suprímase la respuesta",
      label: "Suprímase el resultado",
      description: "Respuesta a la eliminación de Avatar",
      success: "Eliminación exitosa",
      message: "Su avatar ha sido borrado con éxito",
      nextSteps: {
        item: "Siguiente paso",
      },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "La solicitud de eliminación de avatar es nula",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Usted debe estar conectado para eliminar su avatar",
      },
      server: {
        title: "Error del servidor",
        description: "Failed to delete avatar",
      },
      internal: {
        title: "Error interno",
        description: "Se produjo un error de servidor interno",
      },
      unknown: {
        title: "Error desconocido",
        description: "Un error inesperado ocurrió durante la eliminación",
      },
      network: {
        title: "Error de red",
        description: "Se produjo un error de red durante la eliminación",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "Usted no tiene permiso para borrar este avatar",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el avatar para eliminar",
      },
      unsaved: {
        title: "Cambios sin guardar",
        description: "Hay cambios sin salvar",
      },
      conflict: {
        title: "Conflicto",
        description: "Se produjo un conflicto durante la eliminación",
      },
    },
    success: {
      title: "Avatar Eliminado",
      description: "Su perfil avatar ha sido eliminado con éxito",
    },
  },
};
