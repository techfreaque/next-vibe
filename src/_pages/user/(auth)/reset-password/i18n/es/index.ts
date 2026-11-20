import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  errors: {
    unknown: "Se produjo un error desconocido",
    title: "Error",
  },
  meta: {
    passwordReset: {
      title: "Restablece tu contraseña | {{appName}}",
      description: "Restablece la contraseña de tu cuenta de {{appName}}",
      category: "Autenticación",
      imageAlt: "Restablecimiento de contraseña",
      keywords: "restablecer contraseña, olvidé mi contraseña, {{appName}}",
    },
  },
  auth: {
    resetPassword: {
      errors: {
        loadingError:
          "No se pudo cargar el formulario para restablecer la contraseña",
      },
    },
  },
};
