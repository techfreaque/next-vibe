import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  post: {
    title: "Muévanse.",
    titleShort: "Mover archivo",
    description: "Mover o cambiar el nombre de un archivo o carpeta.",
    dynamicTitle: "{{from}} → {{to}}",
    status: {
      loading: "Moviéndose...",
      done: "Muévete",
    },
    tags: {
      cortex: "Cortex",
    },
    fields: {
      from: {
        label: "Desde",
        description: "Carretera actual",
      },
      to: {
        label: "A",
        description: "Nuevo camino",
      },
    },
    submitButton: {
      label: "Muévanse.",
      loadingText: "Moviéndose...",
    },
    response: {
      from: { content: "Desde" },
      to: { content: "A" },
      nodesAffected: { text: "Muévete" },
    },
    errors: {
      validation: {
        title: "Mala entrada",
        description: "Compruebe ambos caminos",
      },
      network: {
        title: "Sin conexión",
        description: "No puede llegar al servidor",
      },
      unauthorized: {
        title: "No está atrapado.",
        description: "Inicia sesión primero",
      },
      forbidden: {
        title: "No hay acceso",
        description: "No puedo mover esto.",
      },
      notFound: {
        title: "No encontrado",
        description: "Nada en el camino fuente",
      },
      server: { title: "Error del servidor", description: "Algo rompió." },
      unknown: { title: "Error", description: "Algo salió mal" },
      unsavedChanges: {
        title: "Cambios sin guardar",
        description: "Guardar o descartar primero",
      },
      conflict: {
        title: "Bloqueados",
        description: "Algo ya está en el destino.",
      },
    },
    success: {
      title: "Muévete",
      description: "Listo",
    },
  },
};
