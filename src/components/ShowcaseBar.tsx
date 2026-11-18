import React from "react";
import { ChevronDown, ChevronUp, Moon, Sun } from "lucide-react";
import { ResolvedTheme, ScreenPresetId } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface ShowcaseBarProps {
  activePreset: ScreenPresetId;
  resolvedTheme: ResolvedTheme;
  collapsed: boolean;
  onSelectPreset: (preset: ScreenPresetId) => void;
  onToggleTheme: () => void;
  onToggleCollapsed: () => void;
}

const PRESETS: { id: ScreenPresetId; index: number; label: string }[] = [
  { id: "main-split", index: 1, label: "Main + Split View" },
  { id: "vertical-workspaces", index: 2, label: "Vertical Tabs" },
  { id: "omnibox-popovers", index: 3, label: "Omnibox & Popovers" },
  { id: "new-tab", index: 4, label: "Calm New Tab" },
  { id: "reader-view", index: 5, label: "Reader View" },
  { id: "library", index: 6, label: "Library" },
  { id: "settings", index: 7, label: "Settings" },
  { id: "onboarding", index: 8, label: "Onboarding" },
];

export const ShowcaseBar: React.FC<ShowcaseBarProps> = ({
  activePreset,
  resolvedTheme,
  collapsed,
  onSelectPreset,
  onToggleTheme,
  onToggleCollapsed,
}) => {
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={onToggleCollapsed}
        title="Show 8-Screen Velora State Switcher"
        className="fixed bottom-2 right-3 z-50 h-[26px] px-2.5 rounded-full border text-[11px] font-medium flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity"
        style={{
          backgroundColor: "var(--v-popover)",
          borderColor: "var(--v-popover-border)",
          color: "var(--v-text)",
        }}
      >
        <OrbitLogo size={14} />
        <span>Screens (1–8)</span>
        <ChevronUp className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div
      className="h-[34px] shrink-0 px-3 border-t flex items-center justify-between gap-2 select-none overflow-x-auto"
      style={{
        backgroundColor: "var(--v-frame)",
        borderColor: "var(--v-border)",
        color: "var(--v-text)",
      }}
    >
      <div className="flex items-center gap-1 min-w-max">
        <span
          className="text-[10.5px] font-semibold uppercase tracking-[0.06em] pr-1.5 inline-flex items-center gap-1.5"
          style={{ color: "var(--v-muted)" }}
        >
          <OrbitLogo size={14} />
          <span>Velora States:</span>
        </span>
        {PRESETS.map((p) => {
          const active = activePreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p.id)}
              className="h-[24px] px-2.5 rounded-[6px] text-[11px] font-medium inline-flex items-center gap-1.5 border transition-colors"
              style={{
                backgroundColor: active ? "var(--v-surface)" : "transparent",
                borderColor: active ? "var(--v-accent)" : "transparent",
                color: active ? "var(--v-accent)" : "var(--v-muted)",
              }}
            >
              <span className="font-mono-ui text-[10px] opacity-75">{p.index}.</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          className="h-[24px] px-2.5 rounded-[6px] border text-[11px] font-medium inline-flex items-center gap-1.5"
          style={{
            backgroundColor: "var(--v-surface)",
            borderColor: "var(--v-border)",
            color: "var(--v-text)",
          }}
        >
          {resolvedTheme === "light" ? (
            <>
              <Sun className="w-3 h-3" style={{ color: "var(--v-accent)" }} />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3 h-3" style={{ color: "var(--v-accent)" }} />
              <span>Dark</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onToggleCollapsed}
          title="Hide state switcher bar"
          className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
          style={{ color: "var(--v-muted)" }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
