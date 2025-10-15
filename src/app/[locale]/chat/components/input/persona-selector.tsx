"use client";

import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@/packages/next-vibe-ui/web/ui";

import { DEFAULT_PERSONAS, type Persona } from "../../lib/config/personas";
import { SelectorBase, type SelectorOption } from "./selector-base";
import { useFavorites } from "./use-favorites";

interface PersonaSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const STORAGE_KEY_PERSONAS = "chat-personas";
const STORAGE_KEY_FAVORITES = "chat-favorite-personas";

const DEFAULT_FAVORITES = ["professional", "creative", "technical"];

export function PersonaSelector({
  value,
  onChange,
}: PersonaSelectorProps): JSX.Element {
  const [personas, setPersonas] = useState<Persona[]>(DEFAULT_PERSONAS);
  const [favorites, toggleFavorite, setFavorites] = useFavorites(
    STORAGE_KEY_FAVORITES,
    DEFAULT_FAVORITES,
  );
  const [addPersonaOpen, setAddPersonaOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({
    name: "",
    description: "",
    icon: "✨",
    systemPrompt: "",
  });

  // Load personas from localStorage
  useEffect(() => {
    const storedPersonas = localStorage.getItem(STORAGE_KEY_PERSONAS);
    if (storedPersonas) {
      try {
        const parsed = JSON.parse(storedPersonas);
        setPersonas([...DEFAULT_PERSONAS, ...parsed]);
      } catch (e) {
        console.error("Failed to load personas:", e);
      }
    }
  }, []);

  // Save custom personas to localStorage
  const savePersonas = (newPersonas: Persona[]) => {
    const customPersonas = newPersonas.filter(
      (p) => !DEFAULT_PERSONAS.find((dp) => dp.id === p.id),
    );
    localStorage.setItem(STORAGE_KEY_PERSONAS, JSON.stringify(customPersonas));
    setPersonas(newPersonas);
  };

  const handleAddPersona = () => {
    if (!newPersona.name.trim()) {
      return;
    }

    const persona: Persona = {
      id: `custom-${Date.now()}`,
      name: newPersona.name,
      description: newPersona.description,
      icon: newPersona.icon,
      systemPrompt: newPersona.systemPrompt,
    };

    savePersonas([...personas, persona]);
    setFavorites([...favorites, persona.id]);
    onChange(persona.id);
    setAddPersonaOpen(false);
    setNewPersona({ name: "", description: "", icon: "✨", systemPrompt: "" });
  };

  // Convert personas to selector options
  const options: SelectorOption<string>[] = personas.map((persona) => ({
    id: persona.id,
    name: persona.name,
    description: persona.description,
    icon: <span className="text-base leading-none">{persona.icon}</span>,
  }));

  return (
    <>
      <SelectorBase
        value={value}
        onChange={onChange}
        options={options}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onAddNew={() => setAddPersonaOpen(true)}
        placeholder="Select Persona"
        addNewLabel="Create Custom Persona"
        groupByProvider={false}
      />

      {/* Add Custom Persona Dialog */}
      <Dialog open={addPersonaOpen} onOpenChange={setAddPersonaOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Custom Persona</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="persona-name">Name</Label>
              <Input
                id="persona-name"
                placeholder="e.g., Code Reviewer"
                value={newPersona.name}
                onChange={(e) =>
                  setNewPersona({ ...newPersona, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona-icon">Icon (emoji)</Label>
              <Input
                id="persona-icon"
                placeholder="✨"
                value={newPersona.icon}
                onChange={(e) =>
                  setNewPersona({ ...newPersona, icon: e.target.value })
                }
                maxLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona-description">Description</Label>
              <Input
                id="persona-description"
                placeholder="Brief description of the persona"
                value={newPersona.description}
                onChange={(e) =>
                  setNewPersona({ ...newPersona, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="persona-prompt">System Prompt</Label>
              <Textarea
                id="persona-prompt"
                placeholder="You are a..."
                value={newPersona.systemPrompt}
                onChange={(e) =>
                  setNewPersona({ ...newPersona, systemPrompt: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setAddPersonaOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPersona}
                disabled={!newPersona.name.trim()}
              >
                Create Persona
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
