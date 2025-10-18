import type { translations as EnglishBatchTranslations } from "../../../en/leads/admin/batch";

export const translations: typeof EnglishBatchTranslations = {
  filter_count: "{{total}} leadów pasuje do aktualnych filtrów",
  current_page_count: "{{count}} leadów na stronie {{page}}",
  scope_current_page: "Bieżąca strona",
  scope_all_pages: "Wszystkie strony",
  preview: "Podgląd zmian",
  apply: "Zastosuj zmiany",
  delete: "Usuń",
  select_action: "Wybierz akcję",
  select_value: "Wybierz wartość",
  actions: {
    update_status: "Aktualizuj status",
    update_stage: "Aktualizuj etap kampanii",
    update_source: "Aktualizuj źródło",
    delete: "Usuń leady",
  },
  preview_title: "Podgląd aktualizacji wsadowej",
  delete_preview_title: "Podgląd usuwania wsadowego",
  confirm_title: "Potwierdź aktualizację wsadową",
  delete_confirm: {
    title: "Potwierdź usuwanie wsadowe",
  },
  result_title: "Wyniki operacji wsadowej",
  preview_description:
    "Przejrzyj {{count}} leadów, które zostaną zaktualizowane",
  delete_preview_description:
    "Przejrzyj {{count}} leadów, które zostaną usunięte. Ta akcja nie może być cofnięta.",
  planned_changes: "Planowane zmiany",
  change_status: "Status → {{status}}",
  change_stage: "Etap kampanii → {{stage}}",
  change_source: "Źródło → {{source}}",
  confirm_update: "Potwierdź aktualizację",
  confirm_delete: "Potwierdź usunięcie",
  success_message: "Pomyślnie zaktualizowano {{updated}} z {{total}} leadów",
  delete_success_message: "Pomyślnie usunięto {{deleted}} z {{total}} leadów",
  error_message: "Nie udało się zaktualizować leadów. Spróbuj ponownie.",
  errors_title: "Błędy ({{count}})",
  processing: "Przetwarzanie...",
  close: "Zamknij",
  results: {
    title: "Wyniki operacji wsadowej",
  },
  confirm: {
    title: "Potwierdź aktualizację wsadową",
  },
};
