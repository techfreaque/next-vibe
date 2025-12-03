import { translations as idTranslations } from "../../[id]/i18n/en";

export const translations = {
  title: "Edit SMTP Account",
  description: "Edit SMTP account configuration",
  container: {
    title: "SMTP Account Details",
    description: "Update SMTP account settings and configuration",
  },
  fields: {
    name: {
      label: "Account Name",
      description: "Name of the SMTP account",
      placeholder: "Enter account name",
    },
    description: {
      label: "Description",
      description: "Account description",
      placeholder: "Enter account description",
    },
    host: {
      label: "SMTP Host",
      description: "SMTP server hostname",
      placeholder: "smtp.example.com",
    },
    port: {
      label: "Port",
      description: "SMTP server port",
      placeholder: "587",
    },
    securityType: {
      label: "Security Type",
      description: "SMTP connection security type",
      placeholder: "Select security type",
    },
    username: {
      label: "Username",
      description: "SMTP authentication username",
      placeholder: "Enter username",
    },
    password: {
      label: "Password",
      description: "SMTP authentication password",
      placeholder: "Enter password",
    },
    fromEmail: {
      label: "From Email",
      description: "Default sender email address",
      placeholder: "sender@example.com",
    },
    priority: {
      label: "Priority",
      description: "Account priority for load balancing",
      placeholder: "Enter priority number",
    },
  },
  response: {
    account: {
      title: "Updated Account",
      description: "Successfully updated SMTP account",
      id: "Account ID",
      name: "Account Name",
      host: "SMTP Host",
      port: "Port",
      username: "Username",
      fromEmail: "From Email",
    },
  },
  id: idTranslations,
};
