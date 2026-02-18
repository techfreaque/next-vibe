import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  category: "Benutzer",
  tag: "Benutzerverwaltung",

  id: {
    get: {
      title: "Benutzer abrufen",
      description:
        "Detaillierte Informationen zu einem bestimmten Benutzer abrufen",
      container: {
        title: "Benutzerdetails",
        description: "Detaillierte Benutzerinformationen anzeigen",
      },
      id: {
        label: "Benutzer-ID",
        description: "Eindeutige Kennung für den Benutzer",
        placeholder: "Benutzer-ID eingeben...",
      },
      response: {
        userProfile: {
          title: "Benutzerprofil",
          description: "Detaillierte Benutzerprofilinformationen",
          basicInfo: {
            title: "Grundinformationen",
            description: "Kernbenutzerinformationen",
            id: {
              content: "Benutzer-ID",
            },
            email: {
              content: "E-Mail-Adresse",
            },
            privateName: {
              content: "Privater Name",
            },
            publicName: {
              content: "Öffentlicher Name",
            },
            firstName: {
              content: "Vorname",
            },
            lastName: {
              content: "Nachname",
            },
            company: {
              content: "Unternehmen",
            },
          },
          contactDetails: {
            title: "Kontaktdaten",
            description: "Benutzer-Kontaktinformationen",
            phone: {
              content: "Telefonnummer",
            },
            preferredContactMethod: {
              content: "Bevorzugte Kontaktmethode",
            },
            website: {
              content: "Website",
            },
          },
        },
        profileDetails: {
          title: "Profildetails",
          description: "Zusätzliche Profilinformationen",
          imageUrl: {
            content: "Profilbild",
          },
          bio: {
            content: "Biografie",
          },
          jobTitle: {
            content: "Berufsbezeichnung",
          },
          leadId: {
            content: "Zugeordnete Lead-ID",
          },
        },
        accountStatus: {
          title: "Kontostatus",
          description: "Informationen zum Benutzerkontostatus",
          isActive: {
            content: "Aktiver Status",
          },
          emailVerified: {
            content: "E-Mail verifiziert",
          },
          stripeCustomerId: {
            content: "Stripe-Kunden-ID",
          },
          userRoles: {
            content: "Benutzerrollen",
          },
        },
        timestamps: {
          title: "Zeitstempel",
          description: "Erstellungs- und Aktualisierungszeitstempel",
          createdAt: {
            content: "Erstellt am",
          },
          updatedAt: {
            content: "Aktualisiert am",
          },
        },
        leadId: {
          content: "Zugehörige Lead-ID",
        },
        email: {
          content: "E-Mail-Adresse",
        },
        privateName: {
          content: "Privater Name",
        },
        publicName: {
          content: "Öffentlicher Name",
        },
        firstName: {
          content: "Vorname",
        },
        lastName: {
          content: "Nachname",
        },
        company: {
          content: "Unternehmen",
        },
        phone: {
          content: "Telefonnummer",
        },
        preferredContactMethod: {
          content: "Bevorzugte Kontaktmethode",
        },
        imageUrl: {
          content: "Profilbild",
        },
        bio: {
          content: "Biografie",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Berufsbezeichnung",
        },
        emailVerified: {
          content: "E-Mail verifiziert",
        },
        isActive: {
          content: "Aktiver Status",
        },
        stripeCustomerId: {
          content: "Stripe-Kunden-ID",
        },
        userRoles: {
          content: "Benutzerrollen",
        },
        createdAt: {
          content: "Erstellt am",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisierter Zugriff",
          description:
            "Sie müssen angemeldet sein, um Benutzerdetails anzuzeigen",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Benutzer-ID angegeben",
        },
        forbidden: {
          title: "Zugriff verboten",
          description:
            "Sie haben keine Berechtigung, diesen Benutzer anzuzeigen",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Der angeforderte Benutzer konnte nicht gefunden werden",
        },
        conflict: {
          title: "Konfliktfehler",
          description:
            "Benutzer kann aufgrund bestehender Konflikte nicht abgerufen werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server kann nicht hergestellt werden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer kann aufgrund eines Serverfehlers nicht abgerufen werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Abrufen des Benutzers aufgetreten",
        },
      },
      success: {
        title: "Benutzer erfolgreich abgerufen",
        description: "Benutzerinformationen wurden erfolgreich abgerufen",
      },
    },
    put: {
      title: "Benutzer aktualisieren",
      description: "Benutzerinformationen und Profildetails aktualisieren",
      container: {
        title: "Benutzer aktualisieren",
        description: "Benutzerinformationen und Einstellungen ändern",
      },
      id: {
        label: "Benutzer-ID",
        description: "Eindeutige Kennung für den zu aktualisierenden Benutzer",
        placeholder: "Benutzer-ID eingeben...",
      },
      sections: {
        basicInfo: {
          title: "Grundinformationen",
          description: "Grundlegende Benutzerinformationen aktualisieren",
        },
        contactInfo: {
          title: "Kontaktinformationen",
          description: "Kontaktdaten aktualisieren",
        },
        profileDetails: {
          title: "Profildetails",
          description: "Zusätzliche Profilinformationen aktualisieren",
        },
        adminSettings: {
          title: "Administrative Einstellungen",
          description: "Administrative Einstellungen aktualisieren",
        },
      },
      email: {
        label: "E-Mail-Adresse",
        description:
          "E-Mail-Adresse des Benutzers für Anmeldung und Kommunikation",
        placeholder: "E-Mail-Adresse eingeben...",
      },
      privateName: {
        label: "Privater Name",
        description:
          "Vollständiger rechtlicher Name des Benutzers (nur für Administratoren sichtbar)",
      },
      publicName: {
        label: "Öffentlicher Name",
        description: "Anzeigename des Benutzers (für alle Benutzer sichtbar)",
      },
      firstName: {
        label: "Vorname",
        description: "Vorname des Benutzers",
        placeholder: "Vorname eingeben...",
      },
      lastName: {
        label: "Nachname",
        description: "Nachname des Benutzers",
        placeholder: "Nachname eingeben...",
      },
      company: {
        label: "Unternehmen",
        description: "Unternehmen oder Organisation des Benutzers",
        placeholder: "Unternehmen eingeben...",
      },
      phone: {
        label: "Telefonnummer",
        description: "Kontakt-Telefonnummer des Benutzers",
        placeholder: "Telefonnummer eingeben...",
      },
      preferredContactMethod: {
        label: "Bevorzugte Kontaktmethode",
        description: "Wie der Benutzer bevorzugt kontaktiert werden möchte",
      },
      bio: {
        label: "Biografie",
        description: "Kurze Beschreibung über den Benutzer",
        placeholder: "Biografie eingeben...",
      },
      website: {
        label: "Website",
        description: "Persönliche oder Unternehmens-Website des Benutzers",
        placeholder: "Website-URL eingeben...",
      },
      jobTitle: {
        label: "Berufsbezeichnung",
        description: "Berufsbezeichnung oder Position des Benutzers",
        placeholder: "Berufsbezeichnung eingeben...",
      },
      emailVerified: {
        label: "E-Mail verifiziert",
        description: "Ob die E-Mail des Benutzers verifiziert ist",
      },
      isActive: {
        label: "Aktiver Status",
        description: "Ob das Benutzerkonto aktiv ist",
      },
      leadId: {
        label: "Lead-ID",
        description: "Zugehörige Lead-Kennung",
        placeholder: "Lead-ID eingeben...",
      },
      response: {
        leadId: {
          content: "Zugehörige Lead-ID",
        },
        email: {
          content: "E-Mail-Adresse",
        },
        privateName: {
          content: "Privater Name",
        },
        publicName: {
          content: "Öffentlicher Name",
        },
        firstName: {
          content: "Vorname",
        },
        lastName: {
          content: "Nachname",
        },
        company: {
          content: "Unternehmen",
        },
        phone: {
          content: "Telefonnummer",
        },
        preferredContactMethod: {
          content: "Bevorzugte Kontaktmethode",
        },
        imageUrl: {
          content: "Profilbild",
        },
        bio: {
          content: "Biografie",
        },
        website: {
          content: "Website",
        },
        jobTitle: {
          content: "Berufsbezeichnung",
        },
        emailVerified: {
          content: "E-Mail verifiziert",
        },
        isActive: {
          content: "Aktiver Status",
        },
        stripeCustomerId: {
          content: "Stripe-Kunden-ID",
        },
        userRoles: {
          content: "Benutzerrollen",
        },
        createdAt: {
          content: "Erstellt am",
        },
        updatedAt: {
          content: "Aktualisiert am",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisierter Zugriff",
          description:
            "Sie müssen angemeldet sein, um Benutzer zu aktualisieren",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description:
            "Bitte überprüfen Sie die Formulardaten und versuchen Sie es erneut",
        },
        forbidden: {
          title: "Zugriff verboten",
          description:
            "Sie haben keine Berechtigung, diesen Benutzer zu aktualisieren",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description:
            "Der zu aktualisierende Benutzer konnte nicht gefunden werden",
        },
        conflict: {
          title: "Aktualisierungskonflikt",
          description:
            "Die Benutzerdaten stehen im Konflikt mit vorhandenen Datensätzen",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer kann aufgrund eines Serverfehlers nicht aktualisiert werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Aktualisieren des Benutzers aufgetreten",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server kann nicht hergestellt werden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
      },
      success: {
        title: "Benutzer erfolgreich aktualisiert",
        description: "Benutzerinformationen wurden erfolgreich aktualisiert",
      },
    },
    delete: {
      title: "Benutzer löschen",
      description: "Benutzerkonto dauerhaft löschen",
      container: {
        title: "Benutzer löschen",
        description: "Benutzer dauerhaft aus dem System entfernen",
      },
      id: {
        label: "Benutzer-ID",
        description: "Eindeutige Kennung für den zu löschenden Benutzer",
        placeholder: "Benutzer-ID eingeben...",
        helpText: "WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden",
      },
      response: {
        deletionResult: {
          title: "Löschungsergebnis",
          description: "Ergebnis des Löschvorgangs",
          success: {
            content: "Löschung erfolgreich",
          },
          message: {
            content: "Löschungsnachricht",
          },
          deletedAt: {
            content: "Gelöscht am",
          },
        },
        success: {
          content: "Löschung erfolgreich",
        },
        message: {
          content: "Löschungsnachricht",
        },
      },
      errors: {
        unauthorized: {
          title: "Nicht autorisierter Zugriff",
          description: "Sie müssen angemeldet sein, um Benutzer zu löschen",
        },
        validation: {
          title: "Validierung fehlgeschlagen",
          description: "Ungültige Benutzer-ID für Löschung angegeben",
        },
        forbidden: {
          title: "Zugriff verboten",
          description: "Sie haben keine Berechtigung, Benutzer zu löschen",
        },
        notFound: {
          title: "Benutzer nicht gefunden",
          description: "Der zu löschende Benutzer konnte nicht gefunden werden",
        },
        server: {
          title: "Serverfehler",
          description:
            "Benutzer kann aufgrund eines Serverfehlers nicht gelöscht werden",
        },
        unknown: {
          title: "Unbekannter Fehler",
          description:
            "Ein unerwarteter Fehler ist beim Löschen des Benutzers aufgetreten",
        },
        conflict: {
          title: "Konfliktfehler",
          description:
            "Benutzer kann aufgrund bestehender Abhängigkeiten nicht gelöscht werden",
        },
        network: {
          title: "Netzwerkfehler",
          description: "Verbindung zum Server kann nicht hergestellt werden",
        },
        unsavedChanges: {
          title: "Ungespeicherte Änderungen",
          description:
            "Sie haben ungespeicherte Änderungen, die verloren gehen",
        },
      },
      success: {
        title: "Benutzer erfolgreich gelöscht",
        description: "Benutzer wurde erfolgreich gelöscht",
      },
    },
    widget: {
      userProfile: "Benutzerprofil",
      active: "Aktiv",
      inactive: "Inaktiv",
      leadId: "Lead-ID:",
      viewLead: "Lead anzeigen",
      created: "Erstellt",
      lastUpdated: "Zuletzt aktualisiert",
      fullProfile: "Vollständiges Profil",
      referrals: "Empfehlungen",
      subscription: "Abonnement",
      creditHistory: "Kreditverlauf",
      deleteUser: "Benutzer löschen",
      userDeletedSuccessfully: "Benutzer erfolgreich gelöscht",
      deletedAt: "Gelöscht am",
      confirmDeletion: "Löschung bestätigen",
      confirmDeletionMessage:
        "Dadurch wird der Benutzer und alle zugehörigen Daten dauerhaft gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
    },
  },
};
