import React from "react";
import {
  Bookmark,
  Briefcase,
  FlaskConical,
  Moon,
  Pin,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";
import { BrowserTab, WorkspaceId } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface VerticalSidebarProps {
  tabs: BrowserTab[];
  activeTabId: string;
  activeWorkspace: WorkspaceId;
  tabHibernationEnabled: boolean;
  onSelectWorkspace: (ws: WorkspaceId) => void;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
  onOpenLibrary: () => void;
  onOpenSettings: () => void;
}

const WORKSPACES: { id: WorkspaceId; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: "work", label: "Work", icon: Briefcase },
  { id: "personal", label: "Personal", icon: User },
  { id: "research", label: "Research", icon: FlaskConical },
];

export const VerticalSidebar: React.FC<VerticalSidebarProps> = ({
  tabs,
  activeTabId,
  activeWorkspace,
  tabHibernationEnabled,
  onSelectWorkspace,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onOpenLibrary,
  onOpenSettings,
}) => {
  const workspaceTabs = tabs.filter((t) => t.workspace === activeWorkspace);
  const pinnedTabs = workspaceTabs.filter((t) => t.pinned);
  const regularTabs = workspaceTabs.filter((t) => !t.pinned);

  const sleepingTabs = workspaceTabs.filter(
    (t) => t.sleeping && tabHibernationEnabled && t.id !== activeTabId,
  );
  const totalSavedMb = sleepingTabs.reduce((acc, t) => acc + (t.memorySavedMb ?? 110), 0);

  return (
    <aside
      className="w-[220px] shrink-0 h-full flex flex-col border-r select-none"
      style={{
        backgroundColor: "var(--v-frame)",
        borderColor: "var(--v-border)",
        color: "var(--v-text)",
      }}
    >
      {/* Workspace Switcher Pills */}
      <div className="p-2.5 border-b" style={{ borderColor: "var(--v-border)" }}>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="inline-flex items-center gap-1.5">
            <OrbitLogo size={15} />
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.06em]"
              style={{ color: "var(--v-muted)" }}
            >
              Workspaces
            </span>
          </span>
          <span className="text-[10px] font-mono-ui" style={{ color: "var(--v-muted)" }}>
            {workspaceTabs.length} tabs
          </span>
        </div>
        <div
          className="grid grid-cols-3 gap-1 p-0.5 rounded-[8px] border"
          style={{
            backgroundColor: "var(--v-omnibox)",
            borderColor: "var(--v-border)",
          }}
        >
          {WORKSPACES.map((ws) => {
            const active = ws.id === activeWorkspace;
            return (
              <button
                key={ws.id}
                type="button"
                onClick={() => onSelectWorkspace(ws.id)}
                className="h-[26px] rounded-[6px] text-[11px] font-medium flex items-center justify-center transition-all border"
                style={{
                  backgroundColor: active ? "var(--v-surface)" : "transparent",
                  borderColor: active ? "var(--v-border)" : "transparent",
                  color: active ? "var(--v-accent)" : "var(--v-muted)",
                }}
              >
                {ws.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Tabs List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {/* Pinned Section */}
        {pinnedTabs.length > 0 && (
          <div>
            <div className="flex items-center gap-1 px-1.5 mb-1">
              <Pin className="w-2.5 h-2.5" style={{ color: "var(--v-muted)" }} />
              <span
                className="text-[10px] font-medium uppercase tracking-[0.05em]"
                style={{ color: "var(--v-muted)" }}
              >
                Pinned
              </span>
            </div>
            <div className="space-y-0.5">
              {pinnedTabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                return (
                  <div
                    key={tab.id}
                    onClick={() => onSelectTab(tab.id)}
                    className="group h-[32px] px-2 rounded-[8px] flex items-center gap-2 text-[12px] cursor-pointer transition-colors border"
                    style={{
                      backgroundColor: isActive ? "var(--v-surface)" : "transparent",
                      borderColor: isActive ? "var(--v-border)" : "transparent",
                      color: isActive ? "var(--v-text)" : "var(--v-muted)",
                    }}
                  >
                    <OrbitLogo size={16} />
                    <span className="truncate flex-1 font-medium">{tab.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Open Workspace Tabs */}
        <div>
          <div className="flex items-center justify-between px-1.5 mb-1">
            <span
              className="text-[10px] font-medium uppercase tracking-[0.05em]"
              style={{ color: "var(--v-muted)" }}
            >
              Open Tabs
            </span>
          </div>

          <div className="space-y-0.5">
            {regularTabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const isSleeping = Boolean(tab.sleeping && tabHibernationEnabled && !isActive);

              return (
                <div
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  title={
                    isSleeping
                      ? `Sleeping after 15m idle · ${tab.memorySavedMb ?? 110} MB freed`
                      : tab.title
                  }
                  className="group h-[34px] px-2 rounded-[8px] flex items-center gap-2 text-[12px] cursor-pointer transition-colors border"
                  style={{
                    backgroundColor: isActive ? "var(--v-surface)" : "transparent",
                    borderColor: isActive ? "var(--v-border)" : "transparent",
                    color: isActive ? "var(--v-text)" : "var(--v-muted)",
                    opacity: isSleeping ? 0.72 : 1,
                  }}
                >
                  <div className="relative shrink-0 w-4 h-4">
                    <OrbitLogo size={16} dimmed={isSleeping} />
                    {isSleeping && (
                      <span
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center border"
                        style={{
                          backgroundColor: "var(--v-surface)",
                          borderColor: "var(--v-border)",
                          color: "var(--v-accent)",
                        }}
                      >
                        <Moon className="w-2 h-2" strokeWidth={2.2} />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate leading-tight">{tab.title}</div>
                    {isSleeping && (
                      <div
                        className="text-[10px] font-mono-ui leading-tight"
                        style={{ color: "var(--v-muted)" }}
                      >
                        Sleeping · {tab.memorySavedMb ?? 110} MB freed
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onCloseTab(tab.id, e)}
                    aria-label={`Close ${tab.title}`}
                    className="w-4 h-4 rounded-[4px] opacity-0 group-hover:opacity-80 hover:opacity-100 flex items-center justify-center shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onNewTab}
            className="mt-1.5 w-full h-[30px] px-2 rounded-[8px] flex items-center gap-2 text-[12px] transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--v-muted)" }}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
            <span>New Tab</span>
          </button>
        </div>
      </div>

      {/* Sidebar Footer: Hibernation telemetry + quick links */}
      <div className="p-2.5 border-t space-y-2" style={{ borderColor: "var(--v-border)" }}>
        {tabHibernationEnabled && sleepingTabs.length > 0 && (
          <div
            className="px-2.5 py-1.5 rounded-[8px] border flex items-center justify-between text-[11px]"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
            }}
          >
            <span className="flex items-center gap-1.5" style={{ color: "var(--v-muted)" }}>
              <Moon className="w-3 h-3" style={{ color: "var(--v-accent)" }} />
              <span>{sleepingTabs.length} sleeping</span>
            </span>
            <span className="font-mono-ui font-medium" style={{ color: "var(--v-text)" }}>
              {totalSavedMb} MB saved
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex-1 h-[28px] px-2 rounded-[8px] border text-[11px] flex items-center justify-center gap-1.5 transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
              color: "var(--v-muted)",
            }}
          >
            <Bookmark className="w-3 h-3" />
            <span>Library</span>
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex-1 h-[28px] px-2 rounded-[8px] border text-[11px] flex items-center justify-center gap-1.5 transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
              color: "var(--v-muted)",
            }}
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
