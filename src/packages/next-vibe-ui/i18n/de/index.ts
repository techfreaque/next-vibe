import { translations as webTranslations } from "../../web/i18n/de";
import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  web: webTranslations,
  native: {
    ui: {
      autocompleteField: {
        custom: "Benutzerdefiniert",
        noOptionsFound: "Keine Optionen gefunden",
        use: "{{value}} verwenden",
      },
      breadcrumb: {
        navigation: "Breadcrumb-Navigation",
      },
      calendar: {
        stubWarning: "Verwende Stub: Calendar",
        stubLabel: "Calendar (Stub)",
      },
      carousel: {
        stubWarning: "Verwende Stub: Carousel",
        stubLabel: "Carousel (Stub)",
      },
      chart: {
        stubWarning: "Verwende Stub: Chart",
        stubLabel: "Chart (Stub)",
      },
      command: {
        stubWarning: "Verwende Stub: Command",
        stubLabel: "Command (Stub)",
      },
      container: {
        stubWarning: "Verwende Stub: Container",
        stubLabel: "Container (Stub)",
      },
      drawer: {
        stubWarning: "Verwende Stub: Drawer",
        stubLabel: "Drawer (Stub)",
      },
      dropdownItem: {
        stubWarning: "Verwende Stub: DropdownItem",
        stubLabel: "DropdownItem (Stub)",
      },
      form: {
        useFormFieldError:
          "useFormField sollte innerhalb von <FormField> verwendet werden",
        endpointFormField: {
          stubWarning: "Verwende Stub: EndpointFormField",
          stubLabel: "EndpointFormField (Stub)",
        },
        formAlert: {
          stubWarning: "Verwende Stub: FormAlert",
          stubLabel: "FormAlert (Stub)",
        },
        formSection: {
          stubWarning: "Verwende Stub: FormSection",
          stubLabel: "FormSection (Stub)",
        },
        formStub: {
          stubWarning: "Verwende Stub: Form",
          stubLabel: "Form (Form-Stub)",
        },
      },
      inputOtp: {
        stubWarning: "Verwende Stub: InputOtp",
        stubLabel: "InputOtp (Stub)",
      },
      markdown: {
        stubWarning: "Verwende Stub: Markdown",
        stubLabel: "Markdown (Stub)",
      },
      menubar: {
        toggleGroupError:
          "ToggleGroup-Komponenten können nicht außerhalb der ToggleGroup-Komponente gerendert werden",
      },
      pagination: {
        stubWarning: "Verwende Stub: Pagination",
        stubLabel: "Pagination (Stub)",
      },
      phoneField: {
        preferred: "Bevorzugt",
        allCountries: "Alle Länder",
      },
      resizable: {
        stubWarning: "Verwende Stub: Resizable",
        stubLabel: "Resizable (Stub)",
      },
      scrollArea: {
        stubWarning: "Verwende Stub: ScrollArea",
        stubLabel: "ScrollArea (Stub)",
      },
      sheet: {
        stubWarning: "Verwende Stub: Sheet",
        stubLabel: "Sheet (Stub)",
      },
      sidebar: {
        stubWarning: "Verwende Stub: Sidebar",
        stubLabel: "Sidebar (Stub)",
      },
      slider: {
        stubWarning: "Verwende Stub: Slider",
        stubLabel: "Slider (Stub)",
      },
      sonner: {
        stubWarning: "Verwende Stub: Sonner",
        stubLabel: "Sonner (Stub)",
      },
      storage: {
        errorGetting: "Fehler beim Abrufen aus dem Speicher:",
        errorSetting: "Fehler beim Setzen des Speichers:",
        errorRemoving: "Fehler beim Entfernen aus dem Speicher:",
      },
      tabsStub: {
        stubWarning: "Verwende Stub: Tabs",
      },
      tagsField: {
        stubWarning: "Verwende Stub: TagsField",
        stubLabel: "TagsField (Stub)",
      },
      themeProvider: {
        stubWarning: "Verwende Stub: ThemeProvider",
        stubLabel: "ThemeProvider (Stub)",
      },
      title: {
        stubWarning: "Verwende Stub: Title",
        stubLabel: "Title (Stub)",
      },
      toast: {
        stubWarning: "Verwende Stub: Toast",
        stubLabel: "Toast (Stub)",
      },
      toaster: {
        stubWarning: "Verwende Stub: Toaster",
        stubLabel: "Toaster (Stub)",
      },
      toggleGroup: {
        toggleGroupError:
          "ToggleGroup-Komponenten können nicht außerhalb der ToggleGroup-Komponente gerendert werden",
      },
      useMobile: {
        stubWarning: "Verwende Stub: UseMobile",
        stubLabel: "UseMobile (Stub)",
      },
      useToast: {
        stubWarning: "Verwende Stub: useToast",
      },
    },
  },
};
