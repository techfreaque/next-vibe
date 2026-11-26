/**
 * Category definition for the Notifications module.
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { NOTIFICATIONS_LIST_ALIAS } from "./constants";

export const category: CategoryDefinition = {
  key: "notifications",
  label: {
    "en-US": "Notifications",
    "en-GLOBAL": "Notifications",
    "de-DE": "Benachrichtigungen",
    "pl-PL": "Powiadomienia",
    "fr-FR": "Notifications",
    "it-IT": "Notifiche",
    "es-ES": "Notificaciones",
    "sk-SK": "Oznámenia",
  },
  description: {
    "en-US": "Finished work, alerts and replies, unread first.",
    "en-GLOBAL": "Finished work, alerts and replies, unread first.",
    "de-DE": "Erledigte Aufgaben, Warnungen und Antworten, Ungelesenes zuerst.",
    "pl-PL":
      "Zakończone zadania, alerty i odpowiedzi, nieprzeczytane najpierw.",
    "fr-FR": "Tâches terminées, alertes et réponses, non lues en premier.",
    "it-IT": "Attività concluse, avvisi e risposte, prima i non letti.",
    "es-ES": "Tareas terminadas, alertas y respuestas, primero lo no leído.",
    "sk-SK": "Dokončené úlohy, upozornenia a odpovede, neprečítané navrchu.",
  },
  group: "business",
  icon: "bell",
  order: 70,
  landing: {
    destinations: ["notifications"],
    destinationDescriptions: {
      notifications: {
        "en-US": "Everything that finished while you were away, unread first.",
        "en-GLOBAL":
          "Everything that finished while you were away, unread first.",
        "de-DE":
          "Alles, was in Ihrer Abwesenheit fertig wurde, Ungelesenes zuerst.",
        "pl-PL":
          "Wszystko, co zakończyło się pod twoją nieobecność, nieprzeczytane najpierw.",
        "fr-FR":
          "Tout ce qui s’est terminé en votre absence, non lus en premier.",
        "it-IT":
          "Tutto ciò che si è concluso in sua assenza, prima i non letti.",
        "es-ES": "Todo lo que terminó en su ausencia, primero lo no leído.",
        "sk-SK":
          "Všetko, čo sa dokončilo počas vašej neprítomnosti, neprečítané navrchu.",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: NOTIFICATIONS_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: NOTIFICATIONS_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: NOTIFICATIONS_LIST_ALIAS,
  },
  subcategories: {},
};
