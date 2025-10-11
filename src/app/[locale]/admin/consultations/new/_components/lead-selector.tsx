"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "next-vibe-ui/ui/command";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import type React from "react";
import { useState } from "react";

import leadSearchDefinition, {
  type LeadSearchGetResponseTypeOutput,
} from "@/app/api/[locale]/v1/core/leads/search/definition";
import { useLeadSearchEndpoint } from "@/app/api/[locale]/v1/core/leads/search/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadSelectorProps {
  locale: CountryLanguage;
  value?: string;
  onChange: (leadId: string | undefined) => void;
  className?: string;
}

export function LeadSelector({
  locale,
  value,
  onChange,
  className,
}: LeadSelectorProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize lead search endpoint with form
  const leadSearch = useLeadSearchEndpoint();

  // Get current search query from form
  const searchQuery = leadSearch.read.form?.watch("search") || "";

  // Get leads data
  const apiResponse: LeadSearchGetResponseTypeOutput["leads"] =
    leadSearch.read.response;
  const leads = apiResponse?.success ? apiResponse.data.leads : [];
  const isLoading = leadSearch.read.isLoading || false;

  const handleLeadSelect = (leadId: string): void => {
    onChange(leadId);
    setIsOpen(false);
  };

  const handleClearSelection = (): void => {
    onChange(undefined);
    setIsOpen(false);
  };

  // Find selected lead
  const selectedLead = leads.find((lead: any) => lead.id === value);

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="truncate">
              {selectedLead
                ? t("consultations.admin.selectors.leadDisplay", {
                    businessName: String(
                      (selectedLead).businessName || "",
                    ),
                    email: String((selectedLead).email || ""),
                  })
                : t("consultations.admin.form.leadSelect.placeholder")}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <div className="p-2 border-b">
              <Form
                form={leadSearch.read.form}
                onSubmit={() => {}}
                className="space-y-2"
              >
                <EndpointFormField
                  name="search"
                  config={{
                    type: "text",
                    label: undefined,
                    placeholder: "leads.search.placeholder",
                  }}
                  control={leadSearch.read.form.control}
                  schema={leadSearchDefinition.GET.requestSchema}
                  theme={{
                    style: "none",
                    showAllRequired: false,
                  }}
                />
              </Form>
            </div>
            <CommandList>
              {isLoading ? (
                <CommandEmpty>{t("common.loading")}</CommandEmpty>
              ) : leads.length === 0 && searchQuery.trim().length > 0 ? (
                <CommandEmpty>
                  {t("consultations.admin.form.search.noResults")}
                </CommandEmpty>
              ) : leads.length === 0 ? (
                <CommandEmpty>
                  {t("consultations.admin.form.search.noResults")}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {/* Clear selection option */}
                  {value && (
                    <CommandItem onSelect={handleClearSelection}>
                      <Check className="mr-2 h-4 w-4 opacity-0" />
                      <span className="text-gray-500 italic">
                        {t("consultations.admin.selectors.clearSelection")}
                      </span>
                    </CommandItem>
                  )}

                  {/* Lead list */}
                  {leads.map((lead: any) => (
                    <CommandItem
                      key={String(lead.id)}
                      value={String(lead.id)}
                      onSelect={() => handleLeadSelect(String(lead.id))}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === String(lead.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {String(lead.businessName || "")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {String(lead.email || "")} •{" "}
                          {String(lead.status || "")}
                        </span>
                      </div>
                    </CommandItem>
                  ))}

                  {/* Show pagination info if there are more results */}
                  {apiResponse?.success && apiResponse.data.hasMore && (
                    <div className="px-2 py-1 text-xs text-muted-foreground border-t">
                      {t("consultations.admin.selectors.moreResults")}
                    </div>
                  )}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
