import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  initial: {
    subject: "gracias por suscribirte - estás en buena compañía",
    previewText: "una nota rápida del equipo",
    greeting: "Hey,",
    thankYou:
      "Gracias por suscribirse a unbottled.ai. Su apoyo financia directamente el desarrollo y nos mantiene independientes.",
    valueSummary:
      "Como suscriptor, usted tiene acceso prioritario a todos los modelos {{modelCount}}, límites de uso más altos y primer acceso a nuevas características.",
    whatIsNext:
      "Revisaremos de vez en cuando con consejos, nuevos aspectos destacados y actualizaciones. Nada excesivo - sólo las cosas que realmente valen su tiempo.",
    signature: "El equipo unbottled.ai",
  },
  followup1: {
    subject: "nueva característica que podrías haber perdido",
    previewText: "acaba de añadir la semana pasada",
    greeting: "Hey,",
    newFeature:
      "Acabamos de enviar una característica en la que hemos estado trabajando durante un tiempo: modo de comparación de modelos. Ejecute el mismo impulso en múltiples modelos simultáneamente y compare salidas.",
    howToUse:
      "Usted lo encontrará en el selector del modelo - haga clic en 'Comparar' en lugar de elegir un solo modelo. Funciona mejor para tareas creativas donde desea ver diferentes enfoques.",
    encouragement:
      "Sigue explorando. Estás usando una de las pocas plataformas AI que realmente confía en que decidas lo que necesitas.",
    signature: "El equipo unbottled.ai",
  },
  followup2: {
    subject: "estás sacando más de esto que la mayoría de los usuarios",
    previewText: "propina rápida para ir más allá",
    greeting: "Hey,",
    milestone:
      "Los suscriptores como usted usan unbottled.ai significativamente más que los usuarios libres. Eso nos dice que has encontrado valor real en él.",
    insiderTip:
      "Consejo de usuario de potencia: guarde sus indicaciones del sistema más utilizado como presets. Ir a Ajustes → Prompt Presets y ahorrarás tiempo significativo en tareas recurrentes.",
    signature: "El equipo unbottled.ai",
  },
  followup3: {
    subject: "¿Qué debemos construir después?",
    previewText: "en realidad leemos esto.",
    greeting: "Hey,",
    roadmap:
      "Estamos planeando nuestro próximo trimestre de desarrollo y queremos saber lo que más importa a los suscriptores. ¿Qué característica haría unbottled.ai 10x más útil para usted?",
    feedback:
      "Responder a este correo electrónico con su respuesta. Leemos todas las respuestas e influye directamente en lo que priorizamos.",
    signature: "El equipo unbottled.ai",
  },
  nurture: {
    subject: "un año de no conferencias",
    previewText: "gracias por quedarse",
    greeting: "Hey,",
    appreciation:
      "Agradecemos que te quedes con unbottled.ai. Cada suscriptor que se queda nos dice que estamos construyendo algo que valga la pena construir.",
    exclusiveContent:
      "Pronto para suscriptores a largo plazo: acceso temprano a nuestro API y una función de ajuste de modelo dedicada. Te avisaremos primero.",
    signature: "El equipo unbottled.ai",
  },
  reactivation: {
    subject: "gran actualización vale la pena saber sobre",
    previewText: "hemos estado ocupados",
    greeting: "Hey,",
    loyalty:
      "Llevas un tiempo con nosotros y queremos asegurarnos de que sabes lo que hemos enviado recientemente.",
    bigUpdate:
      "Principales actualizaciones: nuevo nivel de modelo sin censura, 3 veces más rápidos tiempos de respuesta, y una interfaz rediseñado que mejora significativamente el flujo de trabajo. Inicie sesión para verla.",
    signature: "El equipo unbottled.ai",
  },
};
