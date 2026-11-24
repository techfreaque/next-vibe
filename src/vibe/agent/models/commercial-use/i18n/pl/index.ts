import type { translations as enTranslations } from "../en";

export const translations: typeof enTranslations = {
  enums: {
    status: {
      allowed: "Użytek komercyjny dozwolony",
      restricted: "Użytek komercyjny ograniczony",
      unclear: "Użytek komercyjny niejasny",
    },
    reason: {
      openLicense: "Otwarta licencja, która pozwala na użytek komercyjny.",
      providerTerms:
        "Warunki dostawcy pozwalają na komercyjne wykorzystanie wyników.",
      nonCommercialLicense:
        "Licencja modelu dopuszcza tylko użytek niekomercyjny.",
      separateLicense:
        "Użytek komercyjny wymaga osobnej licencji od twórcy modelu.",
      useLimits:
        "Dostawca wyklucza część zastosowań komercyjnych, np. film, telewizję, gry i odsprzedaż.",
      communityLicense:
        "Licencja społecznościowa z dodatkowymi ograniczeniami. Użytek komercyjny nie jest potwierdzony.",
      hostPersonalUse:
        "Warunki dostawcy hostingu obejmują tylko użytek osobisty.",
      vendorApproval:
        "Twórca modelu zezwala na użytek komercyjny tylko na wniosek.",
      termsUnconfirmed:
        "Nie udało nam się jeszcze potwierdzić warunków dostawcy.",
    },
  },
  label: "Użytek komercyjny",
  checkLicense: "Sprawdź licencję modelu pod kątem swojego zastosowania.",
  termsLink: "Jak działają prawa do treści AI",
};
