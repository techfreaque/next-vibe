import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  denied: {
    notPaid:
      "Conectar su propia instancia necesita una cuenta pagada. Cualquier paquete de crédito o suscripción lo desbloquea.",
    noConnection:
      "No hay conexión activa para esta cuenta. Conecta tu instancia primero, luego vuelve a entrar.",
    connectionLimit:
      "Límite de conexión alcanzado: instancias {{max}} por cuenta. Desconectar uno para añadir otro.",
    rateLimited: "Demasiadas peticiones de su caso. Entrada en {{seconds}} s.",
    invalidUrl:
      "Instance URL debe ser un origen claro como https://my-box.example.com, sin camino o consulta.",
  },
};
