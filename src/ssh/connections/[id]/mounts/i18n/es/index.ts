import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "SSH",

  errors: {
    noRowReturned: "No hay fila devuelta de la inserción",
    notYourConnection: "Esta conexión no te pertenece a ti",
    mountNotFound: "El monte no se encontró",
  },

  list: {
    title: "Directores montados",
    titleShort: "Montes",
    description:
      "Atajos de directorio designados para esta conexión. Cada montaje aparece como /ssh/ <connection> / <name> / en corteza. Las terminales comienzan en el directorio de montaje predeterminado.",
    fields: {
      connectionId: {
        label: "Conexión",
        description: "La conexión SSH estos montajes pertenecen a",
      },
    },
    response: {
      mounts: { title: "Montes" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revisa la entrada y prueba de nuevo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      server: {
        title: "Error del servidor",
        description: "Failed to load mounts",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
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
        title: "Conflicto",
        description: "El nombre del monte ya existe en esta conexión",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
    },
    success: {
      title: "Montes cargados",
      description: "Montajes de directorio para esta conexión",
    },
  },

  create: {
    title: "Agregar el monte",
    titleShort: "Agregar el monte",
    description:
      "Agregue un atajo de directorio llamado. El nombre se convierte en un segmento de ruta: /ssh/ <connection> / <name> /",
    fields: {
      connectionId: {
        label: "Conexión ID",
        description: "La conexión SSH para añadir el montaje a",
      },
      path: {
        label: "Directorio de caminos",
        description:
          "Camino absoluto en la máquina, por ejemplo /home/max/project. Cortex segmento = nombre de base. El cierre predeterminado de la terminal cuando este es el montaje predeterminado.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Monte predeterminado",
        description:
          "Las nuevas sesiones terminales comienzan en este directorio. Sólo un montaje puede ser predeterminado por conexión.",
      },
    },
    response: {
      id: { title: "Mount ID" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revise los campos del formulario e inténtelo de nuevo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      server: {
        title: "Error del servidor",
        description: "Failed para guardar el montaje",
      },
      notFound: {
        title: "No encontrado",
        description: "Conexión no encontrada",
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
        title: "Nombre Taken",
        description: "Un montaje con este nombre ya existe en esta conexión",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
    },
    success: {
      title: "Monte Añadido",
      description: "Monto de directorio añadido con éxito",
    },
  },

  detail: {
    titleGet: "Monte",
    titleShortGet: "Monte",
    descriptionGet: "Ver un acceso directo montado.",
    titlePatch: "Editar montaje",
    titleShortPatch: "Editar montaje",
    descriptionPatch: "Renombrar o mover un atajo de directorio montado.",
    titleDelete: "Quitar el monte",
    titleShortDelete: "Quitar el monte",
    descriptionDelete:
      "Eliminar un atajo de montaje del directorio de esta conexión.",
    fields: {
      mountId: {
        label: "Mount ID",
        description: "Identificador único de este montaje",
      },
      path: {
        label: "Directorio de caminos",
        description:
          "Camino absoluto en la máquina. Cortex segmento = nombre de base.",
        placeholder: "/home/user/project",
      },
      isDefault: {
        label: "Monte predeterminado",
        description: "Nuevas sesiones terminales comienzan en este directorio",
      },
    },
    response: {
      id: { title: "Mount ID" },
      name: { title: "Nombre" },
      path: { title: "Camino" },
      isDefault: { title: "Predeterminado" },
      createdAt: { title: "Creado" },
      updatedAt: { title: "Actualizado" },
      deleted: { title: "Suprimidos" },
    },
    errors: {
      validation: {
        title: "Error de validación",
        description: "Revisa la entrada y prueba de nuevo",
      },
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Acceso requerido",
      },
      forbidden: { title: "Acceso denegado", description: "Acceso denegado" },
      server: {
        title: "Error del servidor",
        description: "Failed para actualizar el montaje",
      },
      notFound: {
        title: "No encontrado",
        description: "El monte no se encontró",
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
        title: "Nombre Taken",
        description: "Un montaje con este nombre ya existe en esta conexión",
      },
      network: {
        title: "Error de red",
        description: "No podía llegar al servidor",
      },
    },
    successGet: {
      title: "Montaje cargado",
      description: "Detalles del montaje",
    },
    successPatch: {
      title: "Actualización de montaje",
      description: "Montaje actualizado con éxito",
    },
    successDelete: {
      title: "Monte Quitado",
      description: "Montaje eliminado con éxito",
    },
    widget: {
      confirmDelete: "¿Retirar este montaje?",
    },
  },

  widget: {
    noMounts: "No hay monturas configuradas",
    noMountsHint:
      "Agregue un montaje para crear un atajo de directorio. Las terminales comenzarán en el directorio de montaje predeterminado.",
    addMount: "Agregar el monte",
    defaultBadge: "predeterminado",
    cortexPath: "Carretera de Cortex",
    cortexPathPrefix: "/ssh/…/",
    pathArrow: "→",
  },
};
