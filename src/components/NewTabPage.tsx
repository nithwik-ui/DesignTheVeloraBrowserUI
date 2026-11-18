import React, { useRef, useState } from "react";
import { ArrowRight, Check, Lock, Plus, Search, ShieldCheck, X } from "lucide-react";
import { ShortcutTile, VeloraSettings } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface NewTabPageProps {
  settings: VeloraSettings;
  shortcuts: ShortcutTile[];
  onAddShortcut: (title: string, url: string) => void;
  onRemoveShortcut: (id: string) => void;
  onNavigate: (url: string, title?: string) => void;
  onOpenSettings: () => void;
}

export const NewTabPage: React.FC<NewTabPageProps> = ({
  settings,
  shortcuts,
  onAddShortcut,
  onRemoveShortcut,
  onNavigate,
  onOpenSettings,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [addingShortcut, setAddingShortcut] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) {
      onNavigate(
        "https://monograph.nordic-arch.org/essays/daylight-concrete",
        "Tectonic Silence — Nordic Architecture Monograph",
      );
      return;
    }
    if (trimmed.startsWith("velora://") || trimmed.startsWith("http")) {
      onNavigate(trimmed, trimmed);
    } else if (trimmed.includes(".")) {
      onNavigate(`https://${trimmed}`, trimmed);
    } else {
      onNavigate(
        "https://monograph.nordic-arch.org/essays/daylight-concrete",
        `Search: ${trimmed}`,
      );
    }
  };

  const handleOpenAddForm = () => {
    setAddingShortcut(true);
    setTimeout(() => urlInputRef.current?.focus(), 0);
  };

  const handleSaveShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    const rawUrl = siteUrl.trim();
    if (!rawUrl) return;

    const normalizedUrl =
      rawUrl.startsWith("http://") ||
      rawUrl.startsWith("https://") ||
      rawUrl.startsWith("velora://")
        ? rawUrl
        : `https://${rawUrl}`;

    let derivedTitle = siteName.trim();
    if (!derivedTitle) {
      try {
        const host = new URL(normalizedUrl).hostname.replace(/^www\./, "");
        const base = host.split(".")[0] || host;
        derivedTitle = base.charAt(0).toUpperCase() + base.slice(1);
      } catch {
        derivedTitle = rawUrl;
      }
    }

    onAddShortcut(derivedTitle, normalizedUrl);
    setSiteName("");
    setSiteUrl("");
    setAddingShortcut(false);
  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-between px-6 py-10 overflow-y-auto select-none"
      style={{
        backgroundColor: "var(--v-surface)",
        color: "var(--v-text)",
      }}
    >
      {/* Top subtle spacer for calm vertical balance */}
      <div className="h-4" />

      {/* Center Orbit Brand Mark, Search & User-Saved Website Shortcuts */}
      <div className="w-full max-w-[640px] flex flex-col items-center">
        {/* Orbit Brand Mark */}
        <div className="flex flex-col items-center gap-2.5 mb-7">
          <OrbitLogo size={58} />
          <span className="text-[21px] font-semibold tracking-[-0.02em]">Velora</span>
        </div>

        {/* Pill-Shaped Search Bar */}
        <form onSubmit={handleSubmit} className="w-full mb-7">
          <div
            className="h-[46px] w-full rounded-full px-4 flex items-center gap-3 border transition-colors focus-within:border-[var(--v-accent)]"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-border)",
            }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: "var(--v-muted)" }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search privately or enter address…"
              aria-label="Search the web privately"
              className="flex-1 bg-transparent outline-none text-[13.5px]"
              style={{ color: "var(--v-text)" }}
            />
            <span
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border font-mono-ui"
              style={{
                borderColor: "var(--v-border)",
                backgroundColor: "var(--v-surface)",
                color: "var(--v-muted)",
              }}
            >
              <Lock className="w-2.5 h-2.5" style={{ color: "var(--v-privacy)" }} />
              <span>Zero-log search</span>
            </span>
            <button
              type="submit"
              aria-label="Submit search"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: "var(--v-accent)",
                color: "#FFFFFF",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* User-Saved Shortcuts + "+" Add Website Button */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3">
          {shortcuts.map((tile) => (
            <div
              key={tile.id}
              onClick={() => onNavigate(tile.url, tile.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNavigate(tile.url, tile.title);
                }
              }}
              className="group relative w-[150px] p-3 rounded-[8px] border text-left transition-all hover:-translate-y-0.5 cursor-pointer"
              style={{
                backgroundColor: "var(--v-surface-subtle)",
                borderColor: "var(--v-border)",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveShortcut(tile.id);
                }}
                title={`Remove ${tile.title}`}
                aria-label={`Remove ${tile.title}`}
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-[6px] opacity-0 group-hover:opacity-80 hover:opacity-100 flex items-center justify-center transition-opacity hover:bg-black/8 dark:hover:bg-white/10"
                style={{ color: "var(--v-muted)" }}
              >
                <X className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2.5 pr-3">
                <div
                  className="w-8 h-8 rounded-[8px] border flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "var(--v-surface)",
                    borderColor: "var(--v-border)",
                  }}
                >
                  <OrbitLogo size={20} />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-[12.5px] font-medium truncate"
                    style={{ color: "var(--v-text)" }}
                  >
                    {tile.title}
                  </div>
                  <div
                    className="text-[11px] truncate font-mono-ui"
                    style={{ color: "var(--v-muted)" }}
                  >
                    {tile.domain}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* "+" Add Website Shortcut Trigger */}
          {!addingShortcut && (
            <button
              type="button"
              onClick={handleOpenAddForm}
              title="Save a website shortcut for quick navigation"
              className="h-[58px] px-4 rounded-[8px] border border-dashed flex items-center justify-center gap-2.5 text-[12.5px] font-medium transition-all hover:border-[var(--v-accent)]"
              style={{
                backgroundColor: "var(--v-surface-subtle)",
                borderColor: "var(--v-border)",
                color: "var(--v-muted)",
              }}
            >
              <span
                className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--v-surface)",
                  borderColor: "var(--v-border)",
                  color: "var(--v-accent)",
                }}
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
              </span>
              <span>Add shortcut</span>
            </button>
          )}
        </div>

        {/* Inline Save Website Popover Card */}
        {addingShortcut && (
          <form
            onSubmit={handleSaveShortcut}
            className="mt-3 w-full max-w-[420px] p-4 rounded-[8px] border space-y-3"
            style={{
              backgroundColor: "var(--v-popover)",
              borderColor: "var(--v-popover-border)",
              boxShadow: "var(--v-shadow-popover)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <OrbitLogo size={18} />
                <span className="text-[12.5px] font-semibold">Save Website Shortcut</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddingShortcut(false);
                  setSiteName("");
                  setSiteUrl("");
                }}
                className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
                style={{ color: "var(--v-muted)" }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                ref={urlInputRef}
                type="text"
                required
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setAddingShortcut(false);
                  }
                }}
                placeholder="Website URL (e.g. github.com or figma.com)"
                className="w-full h-[34px] px-3 rounded-[8px] border bg-transparent outline-none text-[12.5px] focus:border-[var(--v-accent)]"
                style={{
                  borderColor: "var(--v-border)",
                  color: "var(--v-text)",
                }}
              />
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setAddingShortcut(false);
                  }
                }}
                placeholder="Shortcut name (optional)"
                className="w-full h-[34px] px-3 rounded-[8px] border bg-transparent outline-none text-[12.5px] focus:border-[var(--v-accent)]"
                style={{
                  borderColor: "var(--v-border)",
                  color: "var(--v-text)",
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAddingShortcut(false);
                  setSiteName("");
                  setSiteUrl("");
                }}
                className="h-[30px] px-3 rounded-[8px] border text-[12px] font-medium"
                style={{
                  borderColor: "var(--v-border)",
                  color: "var(--v-muted)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-[30px] px-3.5 rounded-[8px] text-[12px] font-medium text-white inline-flex items-center gap-1.5"
                style={{ backgroundColor: "var(--v-accent)" }}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Website</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom Tracker & DNS Status Pill */}
      <button
        type="button"
        onClick={onOpenSettings}
        className="h-[32px] px-4 rounded-full border inline-flex items-center gap-3 text-[11.5px] transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "var(--v-surface-subtle)",
          borderColor: "var(--v-border)",
          color: "var(--v-muted)",
        }}
      >
        <span
          className="inline-flex items-center gap-1.5 font-medium"
          style={{
            color: settings.adTrackerBlocking ? "var(--v-privacy)" : "var(--v-muted)",
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
          <span>
            {settings.adTrackerBlocking ? "2,847 trackers & ads blocked" : "Shield paused"}
          </span>
        </span>
        <span aria-hidden="true">·</span>
        <span>
          {settings.cookieBannerHiding ? "42 cookie banners hidden" : "Cookie filter off"}
        </span>
        <span aria-hidden="true">·</span>
        <span className="font-mono-ui" style={{ color: "var(--v-text)" }}>
          {settings.cloudflareDoh ? "Cloudflare 1.1.1.1 DoH (11 ms)" : "Standard DNS"}
        </span>
      </button>
    </div>
  );
};
