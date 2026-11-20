import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  passwordStrength: {
    label: "Seguridad de la contraseña",
    weak: "Débil",
    fair: "Aceptable",
    good: "Buena",
    strong: "Fuerte",
    requirement: {
      minLength: {
        icon: "✗",
        text: "Al menos 8 caracteres",
      },
      uppercase: {
        icon: "✗",
        text: "Al menos una letra mayúscula",
      },
      lowercase: {
        icon: "✗",
        text: "Por lo menos una carta inferior",
      },
      number: {
        icon: "✗",
        text: "Al menos un número",
      },
      special: {
        icon: "!",
        text: "Carácter especial (opcional, mejora la fuerza)",
      },
    },
  },
  post: {
    title: "_components",
    description: "_ punto final de los componentes",
    form: {
      title: "_components Configuration",
      description: "Configurar los parámetros _components",
    },
    response: {
      title: "Respuesta",
      description: "Datos de respuesta _components",
    },
    errors: {
      unauthorized: {
        title: "Se requiere autenticación",
        description: "Inicia sesión para continuar",
      },
      validation: {
        title: "Error de validación",
        description: "Parámetros de solicitud no válidos",
      },
      server: {
        title: "Error del servidor",
        description: "Ocurrió un error interno del servidor",
      },
      unknown: {
        title: "Error desconocido",
        description: "Ocurrió un error desconocido",
      },
      network: {
        title: "Error de red",
        description: "Ocurrió un error de red",
      },
      forbidden: {
        title: "Acceso denegado",
        description: "No tienes acceso",
      },
      notFound: {
        title: "No encontrado",
        description: "No se encontró el recurso",
      },
      conflict: {
        title: "Conflicto",
        description: "Hay un conflicto entre los datos",
      },
    },
    success: {
      title: "Operación completada",
      description: "La operación se completó correctamente",
    },
  },
};
