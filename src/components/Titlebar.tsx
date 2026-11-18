import React from "react";
import { Moon, PanelLeft, Plus, Volume2, X } from "lucide-react";
import { BrowserTab, WorkspaceId } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface TitlebarProps {
  tabs: BrowserTab[];
  activeTabId: string;
  activeWorkspace: WorkspaceId;
  verticalTabs: boolean;
  tabHibernationEnabled: boolean;
  isMaximized: boolean;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
  onToggleVerticalTabs: () => void;
  onToggleMaximize: () => void;
}

const WORKSPACE_LABELS: Record<WorkspaceId, string> = {
  work: "Work",
  personal: "Personal",
  research: "Research",
};

export const Titlebar: React.FC<TitlebarProps> = ({
  tabs,
  activeTabId,
  activeWorkspace,
  verticalTabs,
  tabHibernationEnabled,
  isMaximized,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onToggleVerticalTabs,
  onToggleMaximize,
}) => {
  const workspaceTabs = tabs.filter((t) => t.workspace === activeWorkspace);
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? workspaceTabs[0] ?? tabs[0];

  return (
    <header
      className="h-[36px] shrink-0 select-none flex items-center justify-between pl-2 border-b"
      style={{
        backgroundColor: "var(--v-frame)",
        borderColor: "var(--v-border)",
        color: "var(--v-text)",
      }}
    >
      {/* Left section: Vertical tabs toggle + Horizontal tab strip (or compact workspace header) */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-3">
        <div
          className="w-[24px] h-[26px] flex items-center justify-center shrink-0"
          title="Velora Browser"
        >
          <OrbitLogo size={18} />
        </div>
        <button
          type="button"
          onClick={onToggleVerticalTabs}
          title={
            verticalTabs ? "Switch to horizontal tabs" : "Switch to vertical tabs & workspaces"
          }
          className="h-[26px] w-[28px] rounded-[8px] flex items-center justify-center transition-colors shrink-0 border"
          style={{
            backgroundColor: verticalTabs ? "var(--v-accent-soft)" : "transparent",
            borderColor: verticalTabs ? "var(--v-accent)" : "transparent",
            color: verticalTabs ? "var(--v-accent)" : "var(--v-muted)",
          }}
        >
          <PanelLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>

        {verticalTabs ? (
          <div className="flex items-center gap-2 min-w-0 pl-1">
            <span
              className="text-[11px] font-semibold tracking-tight px-2 py-0.5 rounded-[8px] border inline-flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
                color: "var(--v-text)",
              }}
            >
              <OrbitLogo size={13} />
              <span>Velora · {WORKSPACE_LABELS[activeWorkspace]}</span>
            </span>
            <span className="text-[12px] truncate" style={{ color: "var(--v-muted)" }}>
              {activeTab?.title}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto no-scrollbar py-1">
            {workspaceTabs.map((tab) => {
              const isActive = tab.id === activeTabId;
              const isSleeping = Boolean(tab.sleeping && tabHibernationEnabled && !isActive);

              return (
                <div
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectTab(tab.id)}
                  title={
                    isSleeping
                      ? `${tab.title}\nSleeping tab · ${tab.memorySavedMb ?? 120} MB memory freed (click to wake)`
                      : tab.title
                  }
                  className="group relative h-[28px] max-w-[218px] min-w-[120px] flex-1 px-2.5 rounded-[8px] flex items-center gap-2 text-[12px] transition-all cursor-pointer border"
                  style={{
                    backgroundColor: isActive ? "var(--v-surface)" : "transparent",
                    borderColor: isActive ? "var(--v-border)" : "transparent",
                    color: isActive ? "var(--v-text)" : "var(--v-muted)",
                    opacity: isSleeping ? 0.68 : 1,
                  }}
                >
                  {/* Favicon + Sleeping crescent badge */}
                  <div className="relative shrink-0 w-4 h-4 flex items-center justify-center">
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

                  <span className="truncate flex-1 font-normal tracking-[-0.005em]">
                    {tab.title}
                  </span>

                  {isSleeping && tab.memorySavedMb ? (
                    <span
                      className="hidden xl:inline-flex items-center text-[10px] px-1.5 py-0.2 rounded-full border shrink-0 font-mono-ui"
                      style={{
                        borderColor: "var(--v-border)",
                        color: "var(--v-muted)",
                      }}
                    >
                      {tab.memorySavedMb}M
                    </span>
                  ) : null}

                  {!isSleeping && tab.id === "tab-monograph" && isActive ? (
                    <Volume2 className="w-3 h-3 shrink-0 opacity-0" />
                  ) : null}

                  <button
                    type="button"
                    onClick={(e) => onCloseTab(tab.id, e)}
                    aria-label={`Close ${tab.title}`}
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center shrink-0 transition-opacity hover:bg-black/10 dark:hover:bg-white/10 ${
                      isActive ? "opacity-75 hover:opacity-100" : "opacity-0 group-hover:opacity-80"
                    }`}
                  >
                    <X className="w-3 h-3" strokeWidth={1.8} />
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={onNewTab}
              title="New Tab (Ctrl+T)"
              className="h-[26px] w-[26px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: "var(--v-muted)" }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </div>
        )}
      </div>

      {/* Right section: Native Windows 11 Caption Controls (46x36 each) */}
      <div className="flex items-center h-full shrink-0">
        <button
          type="button"
          aria-label="Minimize window"
          className="w-[46px] h-[36px] flex items-center justify-center transition-colors hover:bg-black/6 dark:hover:bg-white/8"
          style={{ color: "var(--v-text)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 5H9" stroke="currentColor" strokeWidth="1" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onToggleMaximize}
          aria-label={isMaximized ? "Restore window" : "Maximize window"}
          className="w-[46px] h-[36px] flex items-center justify-center transition-colors hover:bg-black/6 dark:hover:bg-white/8"
          style={{ color: "var(--v-text)" }}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="1.5" y="3" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1" />
              <path d="M3 3V1.5H8.5V7H7" stroke="currentColor" strokeWidth="1" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="7" height="7" stroke="currentColor" strokeWidth="1" />
            </svg>
          )}
        </button>
        <button
          type="button"
          aria-label="Close window"
          className="w-[46px] h-[36px] flex items-center justify-center transition-colors hover:bg-[#E81123] hover:text-white"
          style={{ color: "var(--v-text)" }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.1" />
          </svg>
        </button>
      </div>
    </header>
  );
};
