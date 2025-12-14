"use client";

import { cn } from "next-vibe/shared/utils";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  Atom,
  Book,
  BookOpen,
  Bot,
  Brain,
  Briefcase,
  Bug,
  Camera,
  Coffee,
  Cpu,
  Database,
  DollarSign,
  Dumbbell,
  EyeOff,
  Film,
  Flame,
  Folder,
  FolderClock,
  FolderCode,
  FolderGit,
  FolderHeart,
  FolderOpen,
  Gamepad,
  Globe,
  GraduationCap,
  Heart,
  Home,
  Image,
  Laptop,
  Leaf,
  Library,
  Lightbulb,
  Link,
  Lock,
  Map,
  MessageSquare,
  Microscope,
  Monitor,
  Mountain,
  Music,
  Newspaper,
  Palette,
  Plane,
  Rocket,
  Scale,
  Shield,
  ShieldPlus,
  SiAndroid,
  SiApple,
  SiDiscord,
  SiDocker,
  SiGit,
  SiGithub,
  SiGo,
  SiGoogle,
  SiJavascript,
  SiLinux,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPython,
  SiReact,
  SiReddit,
  SiRust,
  SiTypescript,
  Sparkles,
  Star,
  Terminal,
  TestTube,
  TrendingUp,
  Trophy,
  Users,
  Utensils,
  Zap,
} from "next-vibe-ui/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "next-vibe-ui/ui/popover";
import { Span } from "next-vibe-ui/ui/span";
import type { ComponentType, JSX } from "react";
import React from "react";

import type { IconKey } from "@/app/api/[locale]/agent/chat/model-access/icons";

interface FolderIconSelectorProps {
  value: IconKey;
  onChange: (icon: IconKey) => void;
}
export type FolderIcons = (typeof ICON_OPTIONS)[number]["id"];

const ICON_OPTIONS: {
  id: IconKey;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  // General folders
  { id: "folder", label: "Folder", Icon: Folder },
  { id: "folder-open", label: "Folder Open", Icon: FolderOpen },
  { id: "folder-heart", label: "Folder Heart", Icon: FolderHeart },
  { id: "folder-clock", label: "Folder Clock", Icon: FolderClock },
  { id: "folder-code", label: "Folder Code", Icon: FolderCode },
  { id: "folder-git", label: "Folder Git", Icon: FolderGit },
  { id: "briefcase", label: "Briefcase", Icon: Briefcase },
  {
    id: "1a",
    label: "1A",
    Icon: ({ className = "" }) => (
      <Span
        className={cn(
          "flex items-center justify-center leading-none bg-linear-to-br from-amber-600 via-yellow-400 to-amber-600 bg-clip-text text-transparent hover:from-amber-500 hover:via-yellow-300 hover:to-amber-500 transition-all duration-300 font-bold text-center animate-gold-sheen bg-size-[150%_100%]",
          className,
        )}
      >
        1A
      </Span>
    ),
  },
  { id: "home", label: "Home", Icon: Home },
  { id: "star", label: "Star", Icon: Star },
  { id: "heart", label: "Heart", Icon: Heart },
  { id: "sparkles", label: "Sparkles", Icon: Sparkles },
  { id: "link", label: "Link", Icon: Link },

  // AI & Technology
  { id: "brain", label: "Brain / AI", Icon: Brain },
  { id: "bot", label: "Bot / AI", Icon: Bot },
  { id: "cpu", label: "CPU / Tech", Icon: Cpu },
  { id: "si-openai", label: "OpenAI", Icon: SiOpenai },
  { id: "terminal", label: "Terminal", Icon: Terminal },
  { id: "laptop", label: "Laptop", Icon: Laptop },
  { id: "monitor", label: "Monitor", Icon: Monitor },
  { id: "database", label: "Database", Icon: Database },
  { id: "bug", label: "Bug / Debug", Icon: Bug },

  // Literature & Education
  { id: "book", label: "Book", Icon: Book },
  { id: "book-open", label: "Book Open", Icon: BookOpen },
  { id: "library", label: "Library", Icon: Library },
  { id: "graduation-cap", label: "Education", Icon: GraduationCap },

  // Politics & News
  { id: "newspaper", label: "News / Politics", Icon: Newspaper },
  { id: "scale", label: "Law / Justice", Icon: Scale },
  { id: "globe", label: "Global / World", Icon: Globe },
  { id: "shield", label: "Security / Defense", Icon: Shield },

  // Communication & Social
  { id: "message-square", label: "Messages / Forum", Icon: MessageSquare },
  { id: "users", label: "Community / Users", Icon: Users },
  { id: "si-reddit", label: "Reddit", Icon: SiReddit },
  { id: "si-discord", label: "Discord", Icon: SiDiscord },

  // Science & Research
  { id: "microscope", label: "Science", Icon: Microscope },
  { id: "test-tube", label: "Chemistry / Lab", Icon: TestTube },
  { id: "atom", label: "Physics / Atom", Icon: Atom },
  { id: "rocket", label: "Space / Innovation", Icon: Rocket },
  { id: "lightbulb", label: "Ideas / Innovation", Icon: Lightbulb },
  { id: "zap", label: "Energy / Power", Icon: Zap },

  // Arts & Entertainment
  { id: "music", label: "Music", Icon: Music },
  { id: "palette", label: "Art / Design", Icon: Palette },
  { id: "film", label: "Movies / Video", Icon: Film },
  { id: "camera", label: "Photography", Icon: Camera },
  { id: "image", label: "Images / Graphics", Icon: Image },
  { id: "gamepad", label: "Gaming", Icon: Gamepad },
  { id: "trophy", label: "Achievements / Sports", Icon: Trophy },

  // Finance & Business
  { id: "dollar-sign", label: "Finance / Money", Icon: DollarSign },
  { id: "trending-up", label: "Business / Growth", Icon: TrendingUp },

  // Lifestyle & Hobbies
  { id: "coffee", label: "Coffee / Casual", Icon: Coffee },
  { id: "utensils", label: "Food / Cooking", Icon: Utensils },
  { id: "dumbbell", label: "Fitness / Health", Icon: Dumbbell },
  { id: "activity", label: "Activity / Sports", Icon: Activity },
  { id: "plane", label: "Travel", Icon: Plane },
  { id: "map", label: "Maps / Navigation", Icon: Map },
  { id: "mountain", label: "Nature / Outdoors", Icon: Mountain },
  { id: "leaf", label: "Environment / Green", Icon: Leaf },
  { id: "flame", label: "Hot Topics / Trending", Icon: Flame },

  // Security & Privacy
  { id: "lock", label: "Privacy / Security", Icon: Lock },
  { id: "eye-off", label: "Incognito / Hidden", Icon: EyeOff },
  { id: "shield-plus", label: "Shield Plus", Icon: ShieldPlus },

  // Programming Languages
  { id: "si-javascript", label: "JavaScript", Icon: SiJavascript },
  { id: "si-typescript", label: "TypeScript", Icon: SiTypescript },
  { id: "si-python", label: "Python", Icon: SiPython },
  { id: "si-rust", label: "Rust", Icon: SiRust },
  { id: "si-go", label: "Go", Icon: SiGo },

  // Frameworks & Tools
  { id: "si-react", label: "React", Icon: SiReact },
  { id: "si-nextdotjs", label: "Next.js", Icon: SiNextdotjs },
  { id: "si-nodejs", label: "Node.js", Icon: SiNodedotjs },
  { id: "si-docker", label: "Docker", Icon: SiDocker },
  { id: "si-git", label: "Git", Icon: SiGit },
  { id: "si-github", label: "GitHub", Icon: SiGithub },

  // Operating Systems & Platforms
  { id: "si-linux", label: "Linux", Icon: SiLinux },
  { id: "si-apple", label: "Apple / macOS", Icon: SiApple },
  { id: "si-android", label: "Android", Icon: SiAndroid },
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
      <PopoverContent
        className="w-80 p-2 max-h-96 overflow-y-auto"
        align="start"
      >
        <Div className="grid grid-cols-6 gap-1">
          {ICON_OPTIONS.map((option) => {
            const Icon = option.Icon;
            return (
              <Button
                key={option.id}
                variant="ghost"
                size="unset"
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
              </Button>
            );
          })}
        </Div>
      </PopoverContent>
    </Popover>
  );
}
