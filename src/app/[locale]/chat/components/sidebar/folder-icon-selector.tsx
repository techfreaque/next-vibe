"use client";

import {
  SiDocker,
  SiGit,
  SiGithub,
  SiGoogle,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTypescript,
} from "@icons-pack/react-simple-icons";
import {
  Briefcase,
  Folder,
  FolderClock,
  FolderCode,
  FolderGit,
  FolderHeart,
  FolderOpen,
  Heart,
  Home,
  Star,
} from "lucide-react";
import { cn } from "next-vibe/shared/utils";
import type { ComponentType, JSX } from "react";
import React from "react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/packages/next-vibe-ui/web/ui";

interface FolderIconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

const ICON_OPTIONS = [
  { id: "folder", label: "Folder", Icon: Folder },
  { id: "folder-open", label: "Folder Open", Icon: FolderOpen },
  { id: "folder-heart", label: "Folder Heart", Icon: FolderHeart },
  { id: "folder-clock", label: "Folder Clock", Icon: FolderClock },
  { id: "folder-code", label: "Folder Code", Icon: FolderCode },
  { id: "folder-git", label: "Folder Git", Icon: FolderGit },
  { id: "briefcase", label: "Briefcase", Icon: Briefcase },
  { id: "home", label: "Home", Icon: Home },
  { id: "star", label: "Star", Icon: Star },
  { id: "heart", label: "Heart", Icon: Heart },
  { id: "si-javascript", label: "JavaScript", Icon: SiJavascript },
  { id: "si-typescript", label: "TypeScript", Icon: SiTypescript },
  { id: "si-python", label: "Python", Icon: SiPython },
  { id: "si-react", label: "React", Icon: SiReact },
  { id: "si-nextdotjs", label: "Next.js", Icon: SiNextdotjs },
  { id: "si-nodejs", label: "Node.js", Icon: SiNodedotjs },
  { id: "si-docker", label: "Docker", Icon: SiDocker },
  { id: "si-git", label: "Git", Icon: SiGit },
  { id: "si-github", label: "GitHub", Icon: SiGithub },
  { id: "si-google", label: "Google", Icon: SiGoogle },
];

export function getIconComponent(
  iconId: string,
): ComponentType<{ className?: string }> {
  const option = ICON_OPTIONS.find((opt) => opt.id === iconId);
  return option?.Icon || Folder;
}

export function FolderIconSelector({
  value,
  onChange,
}: FolderIconSelectorProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const SelectedIcon = getIconComponent(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <SelectedIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="grid grid-cols-5 gap-1">
          {ICON_OPTIONS.map((option) => {
            const Icon = option.Icon;
            return (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors",
                  value === option.id && "bg-accent border-2 border-primary",
                )}
                title={option.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
