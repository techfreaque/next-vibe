/**
 * Client component for managing CSV import dialog
 */

"use client";

import { Upload } from "lucide-react";
import { useTranslation } from "next-vibe/core/client";
import { Button } from "next-vibe-ui/ui/button";
import type React from "react";
import { useState } from "react";

import type { CountryLanguage } from "@/i18n/core/config";

import { CsvImportDialog } from "./csv-import-dialog";

interface CsvImportButtonProps {
  onImportComplete?: () => void;
  locale: CountryLanguage;
}

export function CsvImportButton({
  onImportComplete,
  locale,
}: CsvImportButtonProps): React.JSX.Element {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleImportComplete = (): void => {
    if (onImportComplete) {
      onImportComplete();
    } else {
      // Fallback: refresh the page
      window.location.reload();
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Upload className="h-4 w-4" />
        {t("leads.admin.import.button")}
      </Button>
      <CsvImportDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onImportComplete={handleImportComplete}
        locale={locale}
      />
    </>
  );
}
