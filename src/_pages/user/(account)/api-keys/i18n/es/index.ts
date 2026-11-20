import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  title: "Llaves API",
  metaTitle: "API keys - {{appName}}",
  description:
    "Una llave, modelos {{modelCount}}. Formatos OpenAI y Anthropic, facturados de sus créditos.",
  unauthenticated: {
    title: "Inicie sesión para administrar sus teclas API",
    subtitle:
      "Las llaves pertenecen a tu cuenta. Inicie sesión, elija cualquier plan de {{subPrice}} al mes, y cree su primera clave en segundos.",
    point1: "{{modelCount}} modelos detrás de un OpenAI -compatible endpoint",
    point2:
      "Obras en Claude Code, Codex, OpenCode, Cline y cualquier OpenAI SDK",
    point3: "El mismo precio que el chat. No hay una cuenta separada de API.",
    logIn: "Iniciar sesión",
    signUp: "Crear cuenta",
    docs: "Lea primero los documentos API",
  },
};
