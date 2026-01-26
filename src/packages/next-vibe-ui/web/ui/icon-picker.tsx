/**
 * Icon Picker Component for Web
 * Simplified icon selection UI with categories and search
 * @packageDocumentation
 */

import { cn } from "next-vibe/shared/utils";
import type { JSX } from "react";
import { useMemo, useState } from "react";

import type { CategoryKey } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import {
  Icon,
  ICON_CATEGORIES,
  type IconKey,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/icon-field/icons";
import { useTranslation } from "@/i18n/core/client";

import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";
import { Div } from "./div";
import { Input } from "./input";
import { Span } from "./span";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

/**
 * Icon Picker props interface
 */
export interface IconPickerProps {
  name?: string;
  /** Current selected icon key */
  value?: IconKey;
  /** Callback when icon is selected */
  onChange: (iconKey: IconKey) => void;
  /** Optional className for trigger button */
  className?: string;
  /** Trigger button size */
  size?: "sm" | "default" | "lg";
}

/**
 * Icon Picker Component for Web
 */
export function IconPicker({
  value,
  onChange,
  className,
  size = "default",
  name,
}: IconPickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const { t } = useTranslation();

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    const categoryIcons = ICON_CATEGORIES[activeCategory].icons;
    if (!searchQuery) {
      return categoryIcons;
    }

    const query = searchQuery.toLowerCase();
    return categoryIcons.filter((iconKey) =>
      iconKey.toLowerCase().includes(query),
    );
  }, [searchQuery, activeCategory]);

  // Button size classes
  const sizeClasses = {
    sm: "h-8 w-8 p-0",
    default: "h-10 w-10 p-0",
    lg: "h-12 w-12 p-0",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(sizeClasses[size], className)}
          title={t("app.ui.iconPicker.selectIcon")}
        >
          {value ? (
            <Icon icon={value} className={iconSizeClasses[size]} />
          ) : (
            // eslint-disable-next-line oxlint-plugin-i18n/no-literal-string -- Non-translatable placeholder icon
            <Span className="text-muted-foreground text-xs">?</Span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-[80vh] p-0 flex flex-col m-4">
        {/* Scrollable content wrapper */}
        <Div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {/* Header with search */}
          <Div className="flex flex-col gap-3 p-4 border-b bg-card shrink-0">
            <Span className="font-semibold text-sm">
              {t("app.ui.iconPicker.title")}
            </Span>
            <Input
              placeholder={t("app.ui.iconPicker.searchPlaceholder")}
              value={searchQuery}
              onChange={(e): void => setSearchQuery(e.target.value)}
              className="h-9"
              name={name}
            />
          </Div>

          {/* Category tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={(val): void => setActiveCategory(val as CategoryKey)}
            className="flex flex-col flex-1 min-h-0"
          >
            <TabsList className="w-full h-auto flex-wrap justify-start gap-1 p-2 border-b rounded-none bg-muted/30 shrink-0">
              {Object.entries(ICON_CATEGORIES).map(
                ([categoryKey, category]) => (
                  <TabsTrigger
                    key={categoryKey}
                    value={categoryKey}
                    className="text-xs px-2 py-1"
                  >
                    {t(category.name)}
                  </TabsTrigger>
                ),
              )}
            </TabsList>

            {/* Icon grid */}
            <TabsContent value={activeCategory} className="mt-0 border-0 p-0">
              <Div className="grid grid-cols-8 gap-1 p-3">
                {filteredIcons.map((iconKey) => {
                  const isSelected = value === iconKey;

                  return (
                    <Button
                      key={iconKey}
                      variant="ghost"
                      size="sm"
                      onClick={(): void => {
                        onChange(iconKey);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-center h-10 w-full rounded-md hover:bg-accent transition-colors",
                        isSelected && "bg-accent border-2 border-primary",
                      )}
                      title={iconKey}
                    >
                      <Icon icon={iconKey} className="h-4 w-4" />
                    </Button>
                  );
                })}
              </Div>
            </TabsContent>
          </Tabs>
        </Div>
      </DialogContent>
    </Dialog>
  );
}

IconPicker.displayName = "IconPicker";
