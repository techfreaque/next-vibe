/**
 * Category definition for the SSH/Infrastructure module.
 * Covers connections, browser terminal, and Linux user management.
 * Command execution and file access now live in cortex (cortex-exec, cortex-list/read).
 */

import type { CategoryDefinition } from "next-vibe/help-tool/category-types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { SSH_CONNECTIONS_LIST_ALIAS } from "@/ssh/connections/list/constants";
import { USER_ME_ALIAS } from "@/user/private/me/constants";

export const category: CategoryDefinition = {
  key: "ssh",
  label: {
    "en-US": "SSH & Infra",
    "en-GLOBAL": "SSH & Infra",
    "de-DE": "SSH & Infra",
    "pl-PL": "SSH i Infra",
    "fr-FR": "SSH et infra",
    "it-IT": "SSH e infrastruttura",
    "es-ES": "SSH e infraestructura",
    "sk-SK": "SSH a infraštruktúra",
    "hi-IN": "SSH और इन्फ़्रा",
  },
  description: {
    "en-US": "Open a shell on your servers and manage their login accounts.",
    "en-GLOBAL":
      "Open a shell on your servers and manage their login accounts.",
    "de-DE":
      "Shells auf Ihren Servern öffnen und deren Anmeldekonten verwalten.",
    "pl-PL": "Otwieraj powłokę na serwerach i zarządzaj kontami logowania.",
    "fr-FR": "Ouvrez un terminal sur vos serveurs et gérez leurs comptes.",
    "it-IT": "Apra una shell sui server e ne gestisca gli account di accesso.",
    "es-ES":
      "Abra una terminal en sus servidores y gestione sus cuentas de acceso.",
    "sk-SK":
      "Otvorte shell na svojich serveroch a spravujte prihlasovacie účty.",
    "hi-IN": "अपने सर्वर पर शेल खोलें और उनके लॉगिन अकाउंट मैनेज करें।",
  },
  group: "platform",
  icon: "terminal",
  order: 20,
  landing: {
    destinations: ["ssh-connections-list", "ssh_linux_users_list_GET"],
    actions: ["ssh_connections_create_POST", "ssh_linux_users_create_POST"],
    destinationDescriptions: {
      "ssh-connections-list": {
        "en-US": "Servers and instances you can open a shell on.",
        "en-GLOBAL": "Servers and instances you can open a shell on.",
        "de-DE":
          "Server und Instanzen, auf denen Sie eine Shell öffnen können.",
        "pl-PL": "Serwery i instancje, na których otworzysz powłokę.",
        "fr-FR": "Serveurs et instances où ouvrir un terminal.",
        "it-IT": "Server e istanze su cui aprire una shell.",
        "es-ES": "Servidores e instancias en los que abrir una terminal.",
        "sk-SK": "Servery a inštancie, na ktorých otvoríte shell.",
        "hi-IN": "वे सर्वर और इंस्टेंस जिन पर आप शेल खोल सकते हैं।",
      },
      ssh_linux_users_list_GET: {
        "en-US": "Login accounts on the host operating system.",
        "en-GLOBAL": "Login accounts on the host operating system.",
        "de-DE": "Anmeldekonten im Betriebssystem des Hosts.",
        "pl-PL": "Konta logowania w systemie hosta.",
        "fr-FR": "Comptes de connexion du système hôte.",
        "it-IT": "Account di accesso del sistema operativo host.",
        "es-ES": "Cuentas de acceso del sistema operativo del host.",
        "sk-SK": "Prihlasovacie účty v operačnom systéme hostiteľa.",
        "hi-IN": "होस्ट ऑपरेटिंग सिस्टम के लॉगिन अकाउंट।",
      },
    },
  },
  defaultEntry: {
    [UserPermissionRole.ADMIN]: SSH_CONNECTIONS_LIST_ALIAS,
    [UserPermissionRole.CUSTOMER]: SSH_CONNECTIONS_LIST_ALIAS,
    [UserPermissionRole.PUBLIC]: USER_ME_ALIAS,
  },
  subcategories: {
    Connections: {
      icon: "link-2",
      order: 0,
      label: {
        "en-US": "Connections",
        "en-GLOBAL": "Connections",
        "de-DE": "Verbindungen",
        "pl-PL": "Połączenia",
        "fr-FR": "Connexions",
        "it-IT": "Connessioni",
        "es-ES": "Conexiones",
        "sk-SK": "Pripojenia",
        "hi-IN": "कनेक्शन",
      },
    },
    Linux: {
      icon: "user",
      order: 1,
      label: {
        "en-US": "Linux Users",
        "en-GLOBAL": "Linux Users",
        "de-DE": "Linux-Benutzer",
        "pl-PL": "Użytkownicy Linux",
        "fr-FR": "Utilisateurs Linux",
        "it-IT": "Utenti Linux",
        "es-ES": "Usuarios de Linux",
        "sk-SK": "Používatelia Linuxu",
        "hi-IN": "Linux यूज़र",
      },
    },
  },
};
