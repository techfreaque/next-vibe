"use client";

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Div,
  Input,
  Label,
  ScrollArea,
} from "next-vibe-ui/ui";
import { Plus, X } from "next-vibe-ui/ui/icons";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceType: "folder" | "thread";
  resourceName: string;
  moderatorIds: string[];
  allowedRoles?: string[];
  onSave: (data: { moderatorIds: string[]; allowedRoles?: string[] }) => void;
  locale: CountryLanguage;
}

export function PermissionsDialog({
  open,
  onOpenChange,
  resourceType,
  resourceName,
  moderatorIds,
  allowedRoles = [],
  onSave,
  locale,
}: PermissionsDialogProps): JSX.Element {
  const { t } = simpleT(locale);
  const [localModeratorIds, setLocalModeratorIds] =
    useState<string[]>(moderatorIds);
  const [localAllowedRoles, setLocalAllowedRoles] =
    useState<string[]>(allowedRoles);
  const [newModeratorId, setNewModeratorId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Update local state when props change
  useEffect(() => {
    setLocalModeratorIds(moderatorIds);
    setLocalAllowedRoles(allowedRoles);
    setNewModeratorId("");
    setError(null);
  }, [moderatorIds, allowedRoles, open]);

  const handleAddModerator = (): void => {
    const trimmedId = newModeratorId.trim();

    if (!trimmedId) {
      setError(t("app.chat.permissions.errors.emptyId"));
      return;
    }

    // Basic UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedId)) {
      setError(t("app.chat.permissions.errors.invalidUuid"));
      return;
    }

    if (localModeratorIds.includes(trimmedId)) {
      setError(t("app.chat.permissions.errors.duplicate"));
      return;
    }

    setLocalModeratorIds([...localModeratorIds, trimmedId]);
    setNewModeratorId("");
    setError(null);
  };

  const handleRemoveModerator = (id: string): void => {
    setLocalModeratorIds(localModeratorIds.filter((mid) => mid !== id));
  };

  const handleToggleRole = (role: string): void => {
    setLocalAllowedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSave = (): void => {
    onSave({
      moderatorIds: localModeratorIds,
      allowedRoles: localAllowedRoles,
    });
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddModerator();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t(
              resourceType === "folder"
                ? "app.chat.permissions.folder.title"
                : "app.chat.permissions.thread.title",
            )}
          </DialogTitle>
          <Div className="text-sm text-muted-foreground mt-2">
            {resourceName}
          </Div>
        </DialogHeader>

        <Div className="space-y-4">
          {/* Description */}
          <Div className="text-sm text-muted-foreground">
            {t(
              resourceType === "folder"
                ? "app.chat.permissions.folder.description"
                : "app.chat.permissions.thread.description",
            )}
          </Div>

          {/* Visibility Settings */}
          <Div className="space-y-2">
            <Label>{t("app.chat.permissions.visibility.label")}</Label>
            <Div className="space-y-2 p-3 border rounded-md">
              <Div className="flex items-center space-x-2">
                <Checkbox
                  id="role-public"
                  checked={localAllowedRoles.includes(UserRole.PUBLIC)}
                  onCheckedChange={() => handleToggleRole(UserRole.PUBLIC)}
                />
                <Label
                  htmlFor="role-public"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t("app.chat.permissions.visibility.public")}
                </Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Checkbox
                  id="role-customer"
                  checked={localAllowedRoles.includes(UserRole.CUSTOMER)}
                  onCheckedChange={() => handleToggleRole(UserRole.CUSTOMER)}
                />
                <Label
                  htmlFor="role-customer"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t("app.chat.permissions.visibility.customer")}
                </Label>
              </Div>
              <Div className="flex items-center space-x-2">
                <Checkbox
                  id="role-admin"
                  checked={localAllowedRoles.includes(UserRole.ADMIN)}
                  onCheckedChange={() => handleToggleRole(UserRole.ADMIN)}
                />
                <Label
                  htmlFor="role-admin"
                  className="text-sm font-normal cursor-pointer"
                >
                  {t("app.chat.permissions.visibility.admin")}
                </Label>
              </Div>
            </Div>
            <Div className="text-xs text-muted-foreground">
              {t("app.chat.permissions.visibility.description")}
            </Div>
          </Div>

          {/* Add moderator input */}
          <Div className="space-y-2">
            <Label htmlFor="moderator-id">
              {t("app.chat.permissions.addModerator.label")}
            </Label>
            <Div className="flex gap-2">
              <Input
                id="moderator-id"
                value={newModeratorId}
                onChange={(e) => {
                  setNewModeratorId(e.target.value);
                  setError(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder={t("app.chat.permissions.addModerator.placeholder")}
                className="flex-1"
              />
              <Button onClick={handleAddModerator} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </Div>
            {error && <Div className="text-sm text-destructive">{error}</Div>}
          </Div>

          {/* Moderator list */}
          <Div className="space-y-2">
            <Label>
              {t("app.chat.permissions.moderatorList.label")} (
              {localModeratorIds.length})
            </Label>
            {localModeratorIds.length === 0 ? (
              <Div className="text-sm text-muted-foreground p-4 border border-dashed rounded-md text-center">
                {t("app.chat.permissions.moderatorList.empty")}
              </Div>
            ) : (
              <ScrollArea className="h-[200px] border rounded-md p-2">
                <Div className="space-y-2">
                  {localModeratorIds.map((id) => (
                    <Div
                      key={id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md group hover:bg-muted/80"
                    >
                      <Div className="text-sm font-mono truncate flex-1">
                        {id}
                      </Div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveModerator(id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </Div>
                  ))}
                </Div>
              </ScrollArea>
            )}
          </Div>

          {/* Action buttons */}
          <Div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("app.chat.common.cancel")}
            </Button>
            <Button onClick={handleSave}>
              {t("app.chat.common.save")}
            </Button>
          </Div>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
