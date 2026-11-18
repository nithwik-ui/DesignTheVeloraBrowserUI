import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Clock,
  Columns2,
  Download,
  ExternalLink,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Lock,
  Moon,
  MoreVertical,
  RotateCw,
  Search,
  ShieldCheck,
  Star,
  Sun,
} from "lucide-react";
import {
  ActiveFeatureModal,
  AutocompleteItem,
  BrowserProfile,
  BrowserTab,
  DownloadEntry,
  HistoryEntry,
  LibrarySection,
  ResolvedTheme,
  VeloraSettings,
  WorkspaceId,
} from "../types/velora";
import { AUTOCOMPLETE_SUGGESTIONS } from "../data/mockData";
import { OrbitLogo } from "./OrbitLogo";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfilePopover } from "./ProfilePopover";
import { BrowserMoreMenu } from "./BrowserMoreMenu";

interface NavbarProps {
  activeTab: BrowserTab;
  resolvedTheme: ResolvedTheme;
  settings: VeloraSettings;
  splitView: boolean;
  readerView: boolean;
  isBookmarked: boolean;
  omniboxOpen: boolean;
  shieldPopoverOpen: boolean;
  downloadsPopoverOpen: boolean;
  profilePopoverOpen: boolean;
  moreMenuOpen: boolean;
  showcaseMultiPopoverMode: boolean;
  downloads: DownloadEntry[];
  recentHistory: HistoryEntry[];
  activeProfile: BrowserProfile;
  profiles: BrowserProfile[];
  incognitoMode: boolean;
  pageZoom: number;
  activeWorkspace: WorkspaceId;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onNavigateUrl: (url: string, title?: string) => void;
  onSetOmniboxOpen: (open: boolean) => void;
  onToggleShieldPopover: () => void;
  onToggleDownloadsPopover: () => void;
  onToggleProfilePopover: () => void;
  onToggleMoreMenu: () => void;
  onCloseMenus: () => void;
  onSelectProfile: (profileId: string) => void;
  onUpdateActiveProfile: (updates: Partial<BrowserProfile>) => void;
  onAddProfile: (name: string, email: string, color: string) => void;
  onNewTab: () => void;
  onNewWindow: () => void;
  onToggleIncognito: () => void;
  onSelectWorkspace: (ws: WorkspaceId) => void;
  onToggleVerticalTabs: () => void;
  onSaveCurrentToShortcuts: () => void;
  onChangeZoom: (zoom: number) => void;
  onToggleFullscreen: () => void;
  onPrint: () => void;
  onToggleTranslateBar: () => void;
  onOpenFindBar: () => void;
  onCopyCurrentUrl: () => void;
  onSavePageAsPdf: () => void;
  onOpenFeatureModal: (modal: ActiveFeatureModal) => void;
  onExitBrowser: () => void;
  onToggleSplitView: () => void;
  onToggleReaderView: () => void;
  onToggleBookmark: () => void;
  onOpenLibrary: (section?: LibrarySection) => void;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  onQuickToggleTheme: () => void;
  onUpdateSetting: <K extends keyof VeloraSettings>(key: K, value: VeloraSettings[K]) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  resolvedTheme,
  settings,
  splitView,
  readerView,
  isBookmarked,
  omniboxOpen,
  shieldPopoverOpen,
  downloadsPopoverOpen,
  profilePopoverOpen,
  moreMenuOpen,
  showcaseMultiPopoverMode,
  downloads,
  recentHistory,
  activeProfile,
  profiles,
  incognitoMode,
  pageZoom,
  activeWorkspace,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
  onNavigateUrl,
  onSetOmniboxOpen,
  onToggleShieldPopover,
  onToggleDownloadsPopover,
  onToggleProfilePopover,
  onToggleMoreMenu,
  onCloseMenus,
  onSelectProfile,
  onUpdateActiveProfile,
  onAddProfile,
  onNewTab,
  onNewWindow,
  onToggleIncognito,
  onSelectWorkspace,
  onToggleVerticalTabs,
  onSaveCurrentToShortcuts,
  onChangeZoom,
  onToggleFullscreen,
  onPrint,
  onToggleTranslateBar,
  onOpenFindBar,
  onCopyCurrentUrl,
  onSavePageAsPdf,
  onOpenFeatureModal,
  onExitBrowser,
  onToggleSplitView,
  onToggleReaderView,
  onToggleBookmark,
  onOpenLibrary,
  onOpenSettings,
  onOpenOnboarding,
  onQuickToggleTheme,
  onUpdateSetting,
}) => {
  const [query, setQuery] = useState("");
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const [siteShieldEnabled, setSiteShieldEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!omniboxOpen) {
      setQuery("");
      setHighlightedIdx(0);
    }
  }, [omniboxOpen, activeTab.url]);

  // Strictly enforce max 6 rows in Omnibox Autocomplete Dropdown
  const suggestions: AutocompleteItem[] = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return AUTOCOMPLETE_SUGGESTIONS.slice(0, 6);
    }
    const filtered = AUTOCOMPLETE_SUGGESTIONS.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.domain.toLowerCase().includes(trimmed) ||
        item.url.toLowerCase().includes(trimmed),
    );
    const directItem: AutocompleteItem = {
      id: "ac-direct-query",
      title:
        trimmed.includes(".") || trimmed.startsWith("velora://")
          ? `Open ${trimmed}`
          : `Search "${query.trim()}" privately`,
      url:
        trimmed.startsWith("http") || trimmed.startsWith("velora://")
          ? query.trim()
          : trimmed.includes(".")
            ? `https://${query.trim()}`
            : `https://monograph.nordic-arch.org/essays/daylight-concrete`,
      domain: trimmed.includes(".") ? query.trim() : "Encrypted Search",
      path: trimmed.includes(".") ? "" : " — 1.1.1.1 DoH",
      category: trimmed.includes(".") ? "url" : "search",
    };
    return [directItem, ...filtered].slice(0, 6);
  }, [query]);

  const effectiveBlockedCount =
    settings.adTrackerBlocking && siteShieldEnabled ? activeTab.trackersBlocked : 0;

  const activeDownloadCount = downloads.filter((d) => d.status === "downloading").length;

  const handleOmniboxFocus = () => {
    onSetOmniboxOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((prev) => (prev + 1) % Math.max(1, suggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((prev) => (prev - 1 < 0 ? Math.max(0, suggestions.length - 1) : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = suggestions[highlightedIdx];
      if (chosen) {
        onNavigateUrl(chosen.url, chosen.title);
        onSetOmniboxOpen(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "Escape") {
      onSetOmniboxOpen(false);
      inputRef.current?.blur();
    }
  };

  const renderDownloadIcon = (category: DownloadEntry["category"]) => {
    switch (category) {
      case "PDFs":
        return <FileText className="w-4 h-4" style={{ color: "var(--v-accent)" }} />;
      case "Archives":
        return <FileArchive className="w-4 h-4" style={{ color: "#D97706" }} />;
      case "Images":
        return <ImageIcon className="w-4 h-4" style={{ color: "var(--v-privacy)" }} />;
      default:
        return <FileSpreadsheet className="w-4 h-4" style={{ color: "var(--v-muted)" }} />;
    }
  };

  return (
    <div
      className="relative h-[40px] shrink-0 px-2.5 flex items-center gap-2 border-b z-30"
      style={{
        backgroundColor: "var(--v-surface)",
        borderColor: "var(--v-border)",
        color: "var(--v-text)",
      }}
    >
      {/* Left Navigation Controls */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          title="Back (Alt+Left)"
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors disabled:opacity-35 hover:bg-black/5 dark:hover:bg-white/6"
          style={{ color: "var(--v-text)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          title="Forward (Alt+Right)"
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors disabled:opacity-35 hover:bg-black/5 dark:hover:bg-white/6"
          style={{ color: "var(--v-text)" }}
        >
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={onReload}
          title="Reload page (Ctrl+R)"
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/6"
          style={{ color: "var(--v-text)" }}
        >
          <RotateCw className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </div>

      {/* Center Pill-Shaped (999px) Omnibox */}
      <div
        className={`relative flex-1 ${
          showcaseMultiPopoverMode ? "max-w-[540px]" : "max-w-[760px] mx-auto"
        }`}
      >
        <div
          className="h-[30px] rounded-full px-3 flex items-center gap-2 border transition-all"
          style={{
            backgroundColor: omniboxOpen ? "var(--v-omnibox-focus)" : "var(--v-omnibox)",
            borderColor: omniboxOpen ? "var(--v-accent)" : "var(--v-border)",
          }}
        >
          {/* Orbit Icon + HTTPS Padlock */}
          <span
            className="flex items-center gap-1.5 shrink-0"
            title={
              activeTab.url.startsWith("velora://")
                ? "Velora Secure Internal Surface"
                : "Connection is secure (TLS 1.3 · X25519)"
            }
          >
            <OrbitLogo size={15} />
            <Lock
              className="w-3.5 h-3.5"
              strokeWidth={1.9}
              style={{
                color: activeTab.https ? "var(--v-privacy)" : "var(--v-muted)",
              }}
            />
          </span>

          {/* URL / Search Input */}
          <div
            className="flex-1 min-w-0 flex items-center h-full cursor-text"
            onClick={() => {
              onSetOmniboxOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            {omniboxOpen ? (
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightedIdx(0);
                }}
                onFocus={handleOmniboxFocus}
                onKeyDown={handleKeyDown}
                placeholder={activeTab.url}
                aria-label="Address and search bar"
                className="w-full bg-transparent outline-none text-[12.5px]"
                style={{ color: "var(--v-text)" }}
              />
            ) : (
              <div className="truncate text-[12.5px] select-none">
                <span className="font-medium" style={{ color: "var(--v-text)" }}>
                  {activeTab.domain}
                </span>
                {activeTab.path && (
                  <span style={{ color: "var(--v-muted)" }}>{activeTab.path}</span>
                )}
              </div>
            )}
          </div>

          {/* Inline Omnibox Pills: Privacy Shield Badge + Cloudflare 1.1.1.1 DNS Pill + Reader + Star */}
          <div className="flex items-center gap-1.5 shrink-0">
            {pageZoom !== 100 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeZoom(100);
                }}
                title="Reset page zoom to 100%"
                className="h-[20px] px-2 rounded-full text-[10.5px] font-mono-ui border"
                style={{
                  backgroundColor: "var(--v-surface)",
                  borderColor: "var(--v-border)",
                  color: "var(--v-accent)",
                }}
              >
                {pageZoom}%
              </button>
            )}

            {/* Privacy Shield Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleShieldPopover();
              }}
              title="Velora Privacy Shield — Trackers & Cookie Banners Blocked"
              className="h-[20px] px-2 rounded-full flex items-center gap-1 text-[11px] font-medium transition-opacity hover:opacity-90 border"
              style={{
                backgroundColor:
                  settings.adTrackerBlocking && siteShieldEnabled
                    ? "var(--v-privacy-soft)"
                    : "transparent",
                borderColor: shieldPopoverOpen ? "var(--v-privacy)" : "var(--v-border)",
                color:
                  settings.adTrackerBlocking && siteShieldEnabled
                    ? "var(--v-privacy)"
                    : "var(--v-muted)",
              }}
            >
              <ShieldCheck className="w-3 h-3" strokeWidth={2} />
              <span className="font-mono-ui">{effectiveBlockedCount}</span>
            </button>

            {/* Cloudflare 1.1.1.1 DNS Pill */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleShieldPopover();
              }}
              title={
                settings.cloudflareDoh
                  ? "Encrypted DNS-over-HTTPS active via Cloudflare 1.1.1.1"
                  : "Cloudflare 1.1.1.1 DoH disabled — click to inspect"
              }
              className="hidden sm:inline-flex h-[20px] px-2 rounded-full items-center gap-1 text-[10.5px] font-mono-ui border transition-colors"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
                color: settings.cloudflareDoh ? "var(--v-text)" : "var(--v-muted)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: settings.cloudflareDoh ? "var(--v-privacy)" : "var(--v-muted)",
                }}
              />
              <span>{settings.cloudflareDoh ? "1.1.1.1" : "DNS Off"}</span>
            </button>

            {/* Reader View Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleReaderView();
              }}
              title="Toggle Distraction-Free Reader View (F9)"
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: readerView ? "var(--v-accent-soft)" : "transparent",
                color: readerView ? "var(--v-accent)" : "var(--v-muted)",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>

            {/* Bookmark Star */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
              title={isBookmarked ? "Remove bookmark" : "Bookmark this page (Ctrl+D)"}
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center transition-colors"
              style={{
                color: isBookmarked ? "var(--v-accent)" : "var(--v-muted)",
              }}
            >
              <Star
                className="w-3.5 h-3.5"
                strokeWidth={1.8}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>

        {/* Omnibox Autocomplete Dropdown (Strictly Max 6 Rows) */}
        {omniboxOpen && (
          <div
            role="listbox"
            aria-label="Omnibox autocomplete suggestions"
            className="absolute left-0 right-0 top-[35px] rounded-[8px] border p-1.5 z-40"
            style={{
              backgroundColor: "var(--v-popover)",
              borderColor: "var(--v-popover-border)",
              boxShadow: "var(--v-shadow-popover)",
            }}
          >
            <div className="space-y-0.5">
              {suggestions.slice(0, 6).map((item, idx) => {
                const isSelected = idx === highlightedIdx;
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIdx(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onNavigateUrl(item.url, item.title);
                      onSetOmniboxOpen(false);
                    }}
                    className="h-[36px] px-2.5 rounded-[6px] flex items-center justify-between gap-3 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isSelected ? "var(--v-accent-soft)" : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "var(--v-omnibox)",
                          color: isSelected ? "var(--v-accent)" : "var(--v-muted)",
                        }}
                      >
                        {item.category === "search" ? (
                          <Search className="w-3 h-3" />
                        ) : item.category === "bookmark" ? (
                          <Star className="w-3 h-3" />
                        ) : item.category === "history" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <OrbitLogo size={14} />
                        )}
                      </span>

                      <div className="min-w-0 flex items-center gap-2 text-[12px]">
                        <span className="truncate font-medium" style={{ color: "var(--v-text)" }}>
                          {item.title}
                        </span>
                        <span
                          className="truncate text-[11.5px] font-mono-ui"
                          style={{ color: "var(--v-muted)" }}
                        >
                          — {item.domain}
                          {item.path}
                        </span>
                      </div>
                    </div>

                    {item.category === "open-tab" && (
                      <span
                        className="text-[10.5px] px-2 py-0.5 rounded-full border shrink-0 font-medium"
                        style={{
                          borderColor: "var(--v-border)",
                          backgroundColor: "var(--v-surface)",
                          color: "var(--v-accent)",
                        }}
                      >
                        Switch to tab
                      </span>
                    )}
                    {item.category === "bookmark" && (
                      <span className="text-[10.5px] shrink-0" style={{ color: "var(--v-muted)" }}>
                        Bookmark
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="mt-1 pt-1 px-2.5 border-t flex items-center justify-between text-[10.5px]"
              style={{
                borderColor: "var(--v-popover-border)",
                color: "var(--v-muted)",
              }}
            >
              <span>Up to 6 instant local matches · Zero keystroke telemetry</span>
              <span className="font-mono-ui">↑↓ Navigate · ↵ Open</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Minimalist Action Bar */}
      <div className="flex items-center gap-1 shrink-0 ml-auto">
        {/* Split-Screen View Toggle */}
        <button
          type="button"
          onClick={onToggleSplitView}
          title="Split-Screen View (Ctrl+Shift+2)"
          className="h-[28px] px-2 rounded-[8px] flex items-center gap-1.5 text-[11.5px] transition-colors border"
          style={{
            backgroundColor: splitView ? "var(--v-accent-soft)" : "transparent",
            borderColor: splitView ? "var(--v-accent)" : "transparent",
            color: splitView ? "var(--v-accent)" : "var(--v-text)",
          }}
        >
          <Columns2 className="w-3.5 h-3.5" strokeWidth={1.8} />
          <span className="hidden lg:inline font-medium">Split</span>
        </button>

        {/* Downloads Popover Trigger */}
        <button
          type="button"
          onClick={onToggleDownloadsPopover}
          title="Downloads"
          className="relative w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors border"
          style={{
            backgroundColor: downloadsPopoverOpen ? "var(--v-accent-soft)" : "transparent",
            borderColor: downloadsPopoverOpen ? "var(--v-accent)" : "transparent",
            color: downloadsPopoverOpen ? "var(--v-accent)" : "var(--v-text)",
          }}
        >
          <Download className="w-3.5 h-3.5" strokeWidth={1.8} />
          {activeDownloadCount > 0 && (
            <span
              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--v-accent)" }}
            />
          )}
        </button>

        {/* Library Page */}
        <button
          type="button"
          onClick={() => onOpenLibrary("bookmarks")}
          title="Library — Bookmarks, History & Downloads (Ctrl+H)"
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/6"
          style={{
            color: activeTab.kind === "library" ? "var(--v-accent)" : "var(--v-text)",
          }}
        >
          <Bookmark className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>

        {/* Quick Theme Switch */}
        <button
          type="button"
          onClick={onQuickToggleTheme}
          title={`Switch to ${resolvedTheme === "light" ? "Dark" : "Light"} Mode`}
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/6"
          style={{ color: "var(--v-text)" }}
        >
          {resolvedTheme === "light" ? (
            <Moon className="w-3.5 h-3.5" strokeWidth={1.8} />
          ) : (
            <Sun className="w-3.5 h-3.5" strokeWidth={1.8} />
          )}
        </button>

        {/* Account / Profile PFP Trigger */}
        <button
          type="button"
          onClick={onToggleProfilePopover}
          title={
            incognitoMode
              ? "Incognito Profile active — click to switch profile"
              : `${activeProfile.name} (${activeProfile.email})`
          }
          aria-label="Account and profiles"
          className={`h-[28px] ${
            incognitoMode ? "px-2 gap-1.5" : "w-[28px]"
          } rounded-full flex items-center justify-center transition-all border`}
          style={{
            backgroundColor: profilePopoverOpen ? "var(--v-accent-soft)" : "transparent",
            borderColor: profilePopoverOpen ? "var(--v-accent)" : "transparent",
          }}
        >
          <ProfileAvatar profile={activeProfile} size={22} incognito={incognitoMode} />
          {incognitoMode && (
            <span className="text-[11px] font-medium pr-0.5" style={{ color: "var(--v-text)" }}>
              Incognito
            </span>
          )}
        </button>

        {/* Vertical 3-Dots Browser More Menu Trigger */}
        <button
          type="button"
          onClick={onToggleMoreMenu}
          title="Customise and control Velora"
          aria-label="Customise and control Velora"
          className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-colors border hover:bg-black/5 dark:hover:bg-white/6"
          style={{
            backgroundColor: moreMenuOpen ? "var(--v-accent-soft)" : "transparent",
            borderColor: moreMenuOpen ? "var(--v-accent)" : "transparent",
            color: moreMenuOpen ? "var(--v-accent)" : "var(--v-text)",
          }}
        >
          <MoreVertical className="w-4 h-4" strokeWidth={1.9} />
        </button>
      </div>

      {/* Floating Privacy Shield Popover */}
      {shieldPopoverOpen && (
        <div
          role="dialog"
          aria-label="Velora Privacy Shield"
          className={`absolute top-[44px] w-[308px] rounded-[8px] border p-3.5 z-40 ${
            downloadsPopoverOpen ? "right-[334px]" : "right-[124px]"
          }`}
          style={{
            backgroundColor: "var(--v-popover)",
            borderColor: "var(--v-popover-border)",
            boxShadow: "var(--v-shadow-popover)",
          }}
        >
          <div
            className="flex items-start justify-between gap-2 pb-3 border-b"
            style={{ borderColor: "var(--v-popover-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--v-privacy-soft)",
                  color: "var(--v-privacy)",
                }}
              >
                <OrbitLogo size={22} />
              </div>
              <div>
                <div className="text-[12.5px] font-semibold leading-tight">
                  Privacy Shield{" "}
                  {siteShieldEnabled && settings.adTrackerBlocking ? "Active" : "Paused"}
                </div>
                <div
                  className="text-[11px] font-mono-ui truncate max-w-[165px]"
                  style={{ color: "var(--v-muted)" }}
                >
                  {activeTab.domain}
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={siteShieldEnabled && settings.adTrackerBlocking}
              onClick={() => setSiteShieldEnabled((v) => !v)}
              className="w-9 h-5 rounded-full p-0.5 transition-colors shrink-0"
              style={{
                backgroundColor:
                  siteShieldEnabled && settings.adTrackerBlocking
                    ? "var(--v-privacy)"
                    : "var(--v-border)",
              }}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  siteShieldEnabled && settings.adTrackerBlocking
                    ? "translate-x-4"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="py-2.5 space-y-2 text-[12px]">
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--v-muted)" }}>Cross-site trackers blocked</span>
              <span className="font-mono-ui font-semibold" style={{ color: "var(--v-privacy)" }}>
                {effectiveBlockedCount > 0 ? Math.max(1, effectiveBlockedCount - 5) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--v-muted)" }}>Ad & telemetry scripts blocked</span>
              <span className="font-mono-ui font-semibold" style={{ color: "var(--v-privacy)" }}>
                {effectiveBlockedCount > 0 ? Math.min(5, effectiveBlockedCount) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: "var(--v-muted)" }}>Cookie consent banners hidden</span>
              <span className="font-mono-ui font-medium">
                {settings.cookieBannerHiding ? "2 auto-dismissed" : "Off"}
              </span>
            </div>
          </div>

          <div
            className="p-2.5 rounded-[8px] border flex items-center justify-between text-[11.5px]"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <div>
              <div className="font-medium flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: settings.cloudflareDoh ? "var(--v-privacy)" : "var(--v-muted)",
                  }}
                />
                <span>Cloudflare 1.1.1.1 DoH</span>
              </div>
              <div className="text-[10.5px] font-mono-ui" style={{ color: "var(--v-muted)" }}>
                {settings.cloudflareDoh
                  ? "TLS 1.3 Encrypted · 11 ms"
                  : "System unencrypted resolver"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSetting("cloudflareDoh", !settings.cloudflareDoh)}
              className="text-[11px] font-medium px-2 py-1 rounded-[6px] border"
              style={{
                borderColor: "var(--v-popover-border)",
                color: "var(--v-accent)",
              }}
            >
              {settings.cloudflareDoh ? "Active" : "Enable"}
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            className="mt-2.5 w-full h-[28px] rounded-[6px] text-[11.5px] font-medium flex items-center justify-center gap-1.5 transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--v-omnibox)",
              color: "var(--v-text)",
            }}
          >
            <span>Privacy & Shield Settings</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Downloads Popover */}
      {downloadsPopoverOpen && (
        <div
          role="dialog"
          aria-label="Recent Downloads"
          className="absolute top-[44px] right-3 w-[312px] rounded-[8px] border p-3 z-40"
          style={{
            backgroundColor: "var(--v-popover)",
            borderColor: "var(--v-popover-border)",
            boxShadow: "var(--v-shadow-popover)",
          }}
        >
          <div
            className="flex items-center justify-between pb-2.5 mb-2 border-b"
            style={{ borderColor: "var(--v-popover-border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-[12.5px] font-semibold">Downloads</span>
              {settings.smartDownloadSorting && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-[6px] border font-medium"
                  style={{
                    borderColor: "var(--v-popover-border)",
                    color: "var(--v-accent)",
                    backgroundColor: "var(--v-accent-soft)",
                  }}
                >
                  Smart Sorted
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onOpenLibrary("downloads")}
              className="text-[11px] font-medium hover:underline"
              style={{ color: "var(--v-accent)" }}
            >
              See all
            </button>
          </div>

          <div className="space-y-1.5">
            {downloads.slice(0, 3).map((dl) => (
              <div
                key={dl.id}
                className="p-2 rounded-[8px] border transition-colors"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-popover-border)",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{renderDownloadIcon(dl.category)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11.5px] font-medium truncate">{dl.filename}</div>
                    <div
                      className="text-[10.5px] font-mono-ui flex items-center gap-1.5 mt-0.5"
                      style={{ color: "var(--v-muted)" }}
                    >
                      <span>{dl.size}</span>
                      <span>·</span>
                      <span>{settings.smartDownloadSorting ? dl.folderPath : "Downloads"}</span>
                    </div>

                    {dl.status === "downloading" ? (
                      <div className="mt-1.5">
                        <div
                          className="h-1.5 w-full rounded-full overflow-hidden"
                          style={{ backgroundColor: "var(--v-border)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${dl.progress ?? 76}%`,
                              backgroundColor: "var(--v-accent)",
                            }}
                          />
                        </div>
                        <div
                          className="text-[10px] font-mono-ui mt-1"
                          style={{ color: "var(--v-muted)" }}
                        >
                          {dl.progress ?? 76}% · {dl.completedAt}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 flex items-center justify-between text-[10.5px]">
                        <span
                          className="inline-flex items-center gap-1"
                          style={{ color: "var(--v-privacy)" }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified · {dl.completedAt}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenLibrary("downloads")}
                          className="inline-flex items-center gap-1 hover:underline"
                          style={{ color: "var(--v-muted)" }}
                        >
                          <FolderOpen className="w-3 h-3" />
                          <span>Folder</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account & Profiles Popover */}
      {profilePopoverOpen && (
        <ProfilePopover
          activeProfile={activeProfile}
          profiles={profiles}
          incognitoMode={incognitoMode}
          onSelectProfile={onSelectProfile}
          onUpdateActiveProfile={onUpdateActiveProfile}
          onAddProfile={onAddProfile}
          onToggleIncognito={onToggleIncognito}
          onOpenFeatureModal={onOpenFeatureModal}
          onClose={onCloseMenus}
        />
      )}

      {/* Vertical 3-Dots Browser More Menu */}
      {moreMenuOpen && (
        <BrowserMoreMenu
          activeProfile={activeProfile}
          incognitoMode={incognitoMode}
          pageZoom={pageZoom}
          recentHistory={recentHistory}
          activeWorkspace={activeWorkspace}
          verticalTabs={settings.verticalTabs}
          isBookmarked={isBookmarked}
          onNewTab={onNewTab}
          onNewWindow={onNewWindow}
          onToggleIncognito={onToggleIncognito}
          onSwitchToProfileMenu={() => {
            onCloseMenus();
            onToggleProfilePopover();
          }}
          onOpenLibrary={(sec) => onOpenLibrary(sec)}
          onNavigateUrl={onNavigateUrl}
          onSelectWorkspace={onSelectWorkspace}
          onToggleVerticalTabs={onToggleVerticalTabs}
          onToggleBookmark={onToggleBookmark}
          onSaveCurrentToShortcuts={onSaveCurrentToShortcuts}
          onChangeZoom={onChangeZoom}
          onToggleFullscreen={onToggleFullscreen}
          onPrint={onPrint}
          onToggleTranslateBar={onToggleTranslateBar}
          onOpenFindBar={onOpenFindBar}
          onCopyCurrentUrl={onCopyCurrentUrl}
          onSavePageAsPdf={onSavePageAsPdf}
          onToggleSplitView={onToggleSplitView}
          onToggleReaderView={onToggleReaderView}
          onOpenFeatureModal={onOpenFeatureModal}
          onOpenOnboarding={onOpenOnboarding}
          onOpenSettings={onOpenSettings}
          onExitBrowser={onExitBrowser}
          onClose={onCloseMenus}
        />
      )}
    </div>
  );
};
