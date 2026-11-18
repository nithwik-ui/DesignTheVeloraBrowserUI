import React, { useState } from "react";
import {
  AppWindow,
  BookOpen,
  ChevronRight,
  Columns2,
  Copy,
  Cpu,
  Download,
  FileDown,
  FileSearch,
  Glasses,
  HelpCircle,
  History,
  KeyRound,
  Languages,
  LayoutGrid,
  LogOut,
  Maximize,
  Minus,
  Plus,
  Printer,
  Puzzle,
  Settings,
  Share2,
  SquarePlus,
  Star,
  Trash2,
  Wrench,
  ZoomIn,
} from "lucide-react";
import {
  ActiveFeatureModal,
  BrowserProfile,
  HistoryEntry,
  LibrarySection,
  WorkspaceId,
} from "../types/velora";
import { ProfileAvatar } from "./ProfileAvatar";

interface BrowserMoreMenuProps {
  activeProfile: BrowserProfile;
  incognitoMode: boolean;
  pageZoom: number;
  recentHistory: HistoryEntry[];
  activeWorkspace: WorkspaceId;
  verticalTabs: boolean;
  isBookmarked: boolean;
  onNewTab: () => void;
  onNewWindow: () => void;
  onToggleIncognito: () => void;
  onSwitchToProfileMenu: () => void;
  onOpenLibrary: (section: LibrarySection) => void;
  onNavigateUrl: (url: string, title?: string) => void;
  onSelectWorkspace: (ws: WorkspaceId) => void;
  onToggleVerticalTabs: () => void;
  onToggleBookmark: () => void;
  onSaveCurrentToShortcuts: () => void;
  onChangeZoom: (nextZoom: number) => void;
  onToggleFullscreen: () => void;
  onPrint: () => void;
  onToggleTranslateBar: () => void;
  onOpenFindBar: () => void;
  onCopyCurrentUrl: () => void;
  onSavePageAsPdf: () => void;
  onToggleSplitView: () => void;
  onToggleReaderView: () => void;
  onOpenFeatureModal: (modal: ActiveFeatureModal) => void;
  onOpenOnboarding: () => void;
  onOpenSettings: () => void;
  onExitBrowser: () => void;
  onClose: () => void;
}

type ExpandedSubmenu =
  | null
  | "history"
  | "bookmarks"
  | "tab-groups"
  | "share"
  | "more-tools"
  | "help";

const ZOOM_STEPS = [50, 67, 75, 80, 90, 100, 110, 125, 150];

export const BrowserMoreMenu: React.FC<BrowserMoreMenuProps> = ({
  activeProfile,
  incognitoMode,
  pageZoom,
  recentHistory,
  activeWorkspace,
  verticalTabs,
  isBookmarked,
  onNewTab,
  onNewWindow,
  onToggleIncognito,
  onSwitchToProfileMenu,
  onOpenLibrary,
  onNavigateUrl,
  onSelectWorkspace,
  onToggleVerticalTabs,
  onToggleBookmark,
  onSaveCurrentToShortcuts,
  onChangeZoom,
  onToggleFullscreen,
  onPrint,
  onToggleTranslateBar,
  onOpenFindBar,
  onCopyCurrentUrl,
  onSavePageAsPdf,
  onToggleSplitView,
  onToggleReaderView,
  onOpenFeatureModal,
  onOpenOnboarding,
  onOpenSettings,
  onExitBrowser,
  onClose,
}) => {
  const [expanded, setExpanded] = useState<ExpandedSubmenu>(null);

  const toggleSub = (sub: Exclude<ExpandedSubmenu, null>) => {
    setExpanded((prev) => (prev === sub ? null : sub));
  };

  const stepZoom = (dir: -1 | 1) => {
    const idx = ZOOM_STEPS.findIndex((z) => z >= pageZoom);
    const currentIdx = idx === -1 ? ZOOM_STEPS.indexOf(100) : idx;
    const nextIdx = Math.min(ZOOM_STEPS.length - 1, Math.max(0, currentIdx + dir));
    onChangeZoom(ZOOM_STEPS[nextIdx]);
  };

  const rowClass =
    "w-full h-[33px] px-3 rounded-[6px] flex items-center justify-between gap-3 text-[12.5px] hover:bg-black/5 dark:hover:bg-white/6 transition-colors text-left";

  return (
    <div
      role="menu"
      aria-label="Velora browser menu"
      onClick={(e) => e.stopPropagation()}
      className="absolute top-[44px] right-2 w-[304px] max-h-[calc(100vh-96px)] overflow-y-auto rounded-[8px] border py-1.5 z-50 select-none"
      style={{
        backgroundColor: "var(--v-popover)",
        borderColor: "var(--v-popover-border)",
        color: "var(--v-text)",
        boxShadow: "var(--v-shadow-popover)",
      }}
    >
      {/* Section 1: Tabs & Windows */}
      <div className="px-1.5 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onNewTab();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <SquarePlus className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>New tab</span>
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--v-muted)" }}>
            Ctrl+T
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onNewWindow();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <AppWindow className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>New window</span>
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--v-muted)" }}>
            Ctrl+N
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleIncognito();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Glasses className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>{incognitoMode ? "Close Incognito window" : "New Incognito window"}</span>
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--v-muted)" }}>
            Ctrl+Shift+N
          </span>
        </button>
      </div>

      <div className="my-1.5 border-t" style={{ borderColor: "var(--v-popover-border)" }} />

      {/* Section 2: Highlighted Signed-in Profile Pill + Data Rows */}
      <div className="px-2 pb-1">
        <button
          type="button"
          onClick={onSwitchToProfileMenu}
          className="w-full h-[40px] px-2.5 rounded-[8px] flex items-center justify-between transition-colors"
          style={{
            backgroundColor: "var(--v-accent-soft)",
          }}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <ProfileAvatar profile={activeProfile} size={24} incognito={incognitoMode} />
            <span className="text-[12.5px] font-medium truncate">
              {incognitoMode ? "Incognito" : activeProfile.name}
            </span>
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <span
              className="text-[11px] px-2 py-0.5 rounded-full border font-medium"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-popover-border)",
                color: "var(--v-text)",
              }}
            >
              {incognitoMode ? "Private" : "Signed in"}
            </span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
          </span>
        </button>
      </div>

      <div className="px-1.5 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onOpenFeatureModal("passwords");
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <KeyRound className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Passwords and autofill</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
        </button>

        {/* History + Expandable Quick List */}
        <button type="button" onClick={() => toggleSub("history")} className={rowClass}>
          <span className="flex items-center gap-3">
            <History className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>History</span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded === "history" ? "rotate-90" : ""}`}
            style={{ color: "var(--v-muted)" }}
          />
        </button>
        {expanded === "history" && (
          <div
            className="mx-1.5 my-1 p-1.5 rounded-[8px] border space-y-0.5"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onOpenLibrary("history");
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center justify-between text-[11.5px] font-medium hover:bg-black/5 dark:hover:bg-white/6"
              style={{ color: "var(--v-accent)" }}
            >
              <span>Open full History</span>
              <span>Ctrl+H</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenLibrary("recently-closed");
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center justify-between text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <span>Recently closed tabs</span>
            </button>
            {recentHistory.slice(0, 3).map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  onNavigateUrl(h.url, h.title);
                  onClose();
                }}
                className="w-full h-[26px] px-2 rounded-[6px] text-left text-[11px] truncate hover:bg-black/5 dark:hover:bg-white/6"
                style={{ color: "var(--v-muted)" }}
              >
                {h.title}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onOpenLibrary("downloads");
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Download className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Downloads</span>
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--v-muted)" }}>
            Ctrl+J
          </span>
        </button>

        {/* Bookmarks and lists */}
        <button type="button" onClick={() => toggleSub("bookmarks")} className={rowClass}>
          <span className="flex items-center gap-3">
            <Star className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Bookmarks and lists</span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded === "bookmarks" ? "rotate-90" : ""}`}
            style={{ color: "var(--v-muted)" }}
          />
        </button>
        {expanded === "bookmarks" && (
          <div
            className="mx-1.5 my-1 p-1.5 rounded-[8px] border space-y-0.5"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onToggleBookmark();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center justify-between text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <span>{isBookmarked ? "Remove bookmark" : "Bookmark this tab"}</span>
              <span style={{ color: "var(--v-muted)" }}>Ctrl+D</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenLibrary("bookmarks");
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center justify-between text-[11.5px] font-medium hover:bg-black/5 dark:hover:bg-white/6"
              style={{ color: "var(--v-accent)" }}
            >
              <span>Bookmark Manager</span>
            </button>
          </div>
        )}

        {/* Tab groups / Workspaces */}
        <button type="button" onClick={() => toggleSub("tab-groups")} className={rowClass}>
          <span className="flex items-center gap-3">
            <LayoutGrid className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Tab groups</span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded === "tab-groups" ? "rotate-90" : ""}`}
            style={{ color: "var(--v-muted)" }}
          />
        </button>
        {expanded === "tab-groups" && (
          <div
            className="mx-1.5 my-1 p-1.5 rounded-[8px] border space-y-0.5"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            {(["work", "personal", "research"] as WorkspaceId[]).map((ws) => (
              <button
                key={ws}
                type="button"
                onClick={() => {
                  onSelectWorkspace(ws);
                  onClose();
                }}
                className="w-full h-[28px] px-2 rounded-[6px] flex items-center justify-between text-[11.5px] capitalize hover:bg-black/5 dark:hover:bg-white/6"
                style={{
                  color: activeWorkspace === ws ? "var(--v-accent)" : "var(--v-text)",
                }}
              >
                <span>{ws} group</span>
                {activeWorkspace === ws && <span className="text-[10.5px]">Active</span>}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                onToggleVerticalTabs();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] text-left text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
              style={{ color: "var(--v-muted)" }}
            >
              {verticalTabs ? "Switch to Horizontal Tabs" : "Open Vertical Tabs Sidebar"}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onOpenFeatureModal("extensions");
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Puzzle className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Extensions</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenFeatureModal("clear-data");
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Trash2 className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Delete browsing data...</span>
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--v-muted)" }}>
            Ctrl+Shift+Del
          </span>
        </button>
      </div>

      <div className="my-1.5 border-t" style={{ borderColor: "var(--v-popover-border)" }} />

      {/* Section 3: Live Zoom & Fullscreen Controls */}
      <div className="px-4 py-1 flex items-center justify-between text-[12.5px]">
        <span className="flex items-center gap-3">
          <ZoomIn className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
          <span>Zoom</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => stepZoom(-1)}
            title="Zoom out"
            className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
            style={{ borderColor: "var(--v-popover-border)" }}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onChangeZoom(100)}
            title="Reset zoom to 100%"
            className="w-11 text-center text-[12px] font-mono-ui"
          >
            {pageZoom}%
          </button>
          <button
            type="button"
            onClick={() => stepZoom(1)}
            title="Zoom in"
            className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
            style={{ borderColor: "var(--v-popover-border)" }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          <span className="h-5 w-px mx-1" style={{ backgroundColor: "var(--v-popover-border)" }} />

          <button
            type="button"
            onClick={() => {
              onToggleFullscreen();
              onClose();
            }}
            title="Toggle full screen (F11)"
            className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
            style={{ borderColor: "var(--v-popover-border)" }}
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="my-1.5 border-t" style={{ borderColor: "var(--v-popover-border)" }} />

      {/* Section 4: Page Actions & Tools */}
      <div className="px-1.5 space-y-0.5">
        <button
          type="button"
          onClick={() => {
            onClose();
            onPrint();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Printer className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Print...</span>
          </span>
          <span className="text-[11.5px]" style={{ color: "var(--v-muted)" }}>
            Ctrl+P
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onToggleTranslateBar();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Languages className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Translate...</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenFindBar();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <FileSearch className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Find and edit</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
        </button>

        {/* Cast, save and share */}
        <button type="button" onClick={() => toggleSub("share")} className={rowClass}>
          <span className="flex items-center gap-3">
            <Share2 className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Cast, save and share</span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded === "share" ? "rotate-90" : ""}`}
            style={{ color: "var(--v-muted)" }}
          />
        </button>
        {expanded === "share" && (
          <div
            className="mx-1.5 my-1 p-1.5 rounded-[8px] border space-y-0.5"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onCopyCurrentUrl();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center gap-2 text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <Copy className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
              <span>Copy page link</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSavePageAsPdf();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center gap-2 text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <FileDown className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
              <span>Save page as PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onSaveCurrentToShortcuts();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center gap-2 text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <Plus className="w-3.5 h-3.5" style={{ color: "var(--v-accent)" }} />
              <span>Pin site to New Tab shortcuts</span>
            </button>
          </div>
        )}

        {/* More tools */}
        <button type="button" onClick={() => toggleSub("more-tools")} className={rowClass}>
          <span className="flex items-center gap-3">
            <Wrench className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>More tools</span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded === "more-tools" ? "rotate-90" : ""}`}
            style={{ color: "var(--v-muted)" }}
          />
        </button>
        {expanded === "more-tools" && (
          <div
            className="mx-1.5 my-1 p-1.5 rounded-[8px] border space-y-0.5"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onToggleSplitView();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center gap-2 text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <Columns2 className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
              <span>Split-Screen View</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleReaderView();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center gap-2 text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
              <span>Distraction-Free Reader View</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenFeatureModal("task-manager");
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] flex items-center gap-2 text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              <Cpu className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
              <span>Task Manager (Shift+Esc)</span>
            </button>
          </div>
        )}
      </div>

      <div className="my-1.5 border-t" style={{ borderColor: "var(--v-popover-border)" }} />

      {/* Section 5: Help, Settings & Exit */}
      <div className="px-1.5 space-y-0.5">
        <button type="button" onClick={() => toggleSub("help")} className={rowClass}>
          <span className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Help</span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${expanded === "help" ? "rotate-90" : ""}`}
            style={{ color: "var(--v-muted)" }}
          />
        </button>
        {expanded === "help" && (
          <div
            className="mx-1.5 my-1 p-1.5 rounded-[8px] border space-y-0.5"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-popover-border)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] text-left text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              About Velora Orbit v1.8.0
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenOnboarding();
                onClose();
              }}
              className="w-full h-[28px] px-2 rounded-[6px] text-left text-[11.5px] hover:bg-black/5 dark:hover:bg-white/6"
            >
              First-Run Welcome Setup
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            onOpenSettings();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <Settings className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Settings</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onExitBrowser();
            onClose();
          }}
          className={rowClass}
        >
          <span className="flex items-center gap-3">
            <LogOut className="w-4 h-4" style={{ color: "var(--v-muted)" }} />
            <span>Exit</span>
          </span>
        </button>
      </div>
    </div>
  );
};
