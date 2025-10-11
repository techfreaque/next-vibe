"use client";

import { Check, ChevronDown } from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import { Form } from "next-vibe-ui/ui";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "next-vibe-ui/ui/command";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import type React from "react";
import { useState } from "react";

import userSearchEndpoints, { type UserSearchResponseType } from "@/app/api/[locale]/v1/core/user/search/definition";
import { useUserSearchEndpoint } from "@/app/api/[locale]/v1/core/user/search/hooks";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UserSelectorProps {
  locale: CountryLanguage;
  value?: string;
  onChange: (userId: string | undefined) => void;
  className?: string;
}

export function UserSelector({
  locale,
  value,
  onChange,
  className,
}: UserSelectorProps): React.JSX.Element {
  const { t } = simpleT(locale);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize user search endpoint with form
  const userSearch = useUserSearchEndpoint();

  // Get current search query from form
  const searchQuery = userSearch.read.form?.watch("search") || "";

  // Get users data
  const apiResponse = userSearch.read.response;
  const users = apiResponse?.success 
    ? (apiResponse.data as UserSearchResponseType).users 
    : [];
  const isLoading = userSearch.read.isLoading || false;

  const handleUserSelect = (userId: string): void => {
    onChange(userId);
    setIsOpen(false);
  };

  const handleClearSelection = (): void => {
    onChange(undefined);
    setIsOpen(false);
  };

  // Find selected user
  const selectedUser = users.find((user: any) => user.id === value);

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="truncate">
              {selectedUser
                ? t("consultations.admin.selectors.userDisplay", {
                    firstName: String((selectedUser).firstName || ''),
                    lastName: String((selectedUser).lastName || ''),
                    email: String((selectedUser).email || ''),
                  })
                : t("consultations.admin.form.userSelect.placeholder")}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <div className="p-2 border-b">
              <Form
                form={userSearch.read.form}
                onSubmit={() => {}}
                className="space-y-2"
              >
                <EndpointFormField
                  name="search"
                  config={{
                    type: "text",
                    label: undefined,
                    placeholder:
                      "consultations.admin.form.userSelect.placeholder",
                  }}
                  control={userSearch.read.form.control}
                  schema={userSearchEndpoints.GET.requestSchema}
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
              ) : users.length === 0 && searchQuery.trim().length > 0 ? (
                <CommandEmpty>
                  {t("consultations.admin.form.search.noResults")}
                </CommandEmpty>
              ) : users.length === 0 ? (
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

                  {/* User list */}
                  {users.map((user: any) => (
                    <CommandItem
                      key={String(user.id)}
                      value={String(user.id)}
                      onSelect={() => handleUserSelect(String(user.id))}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === String(user.id) ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {String(user.firstName || '')} {String(user.lastName || '')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {String(user.email || '')}
                          {user.company && ` • ${String(user.company)}`}
                        </span>
                      </div>
                    </CommandItem>
                  ))}

                  {/* Show pagination info if there are more results */}
                  {apiResponse?.success && (apiResponse.data as UserSearchResponseType).hasMore && (
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
