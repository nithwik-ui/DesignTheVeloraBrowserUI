import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookmarkItem,
  BrowserTab,
  DownloadEntry,
  HistoryEntry,
  InternalPageKind,
  LibrarySection,
  ReaderPaperTheme,
  RecentlyClosedEntry,
  ResolvedTheme,
  ScreenPresetId,
  ShortcutTile,
  VeloraSettings,
  WorkspaceId,
} from "./types/velora";
import {
  DEFAULT_SHORTCUT_TILES,
  INITIAL_BOOKMARKS,
  INITIAL_DOWNLOADS,
  INITIAL_HISTORY,
  INITIAL_RECENTLY_CLOSED,
  INITIAL_TABS,
} from "./data/mockData";
import { ORBIT_ICON_URL } from "./components/OrbitLogo";
import { Titlebar } from "./components/Titlebar";
import { Navbar } from "./components/Navbar";
import { VerticalSidebar } from "./components/VerticalSidebar";
import { WebContentView } from "./components/WebContentView";
import { NewTabPage } from "./components/NewTabPage";
import { ReaderView } from "./components/ReaderView";
import { LibraryView } from "./components/LibraryView";
import { SettingsView } from "./components/SettingsView";
import { OnboardingModal } from "./components/OnboardingModal";
import { ShowcaseBar } from "./components/ShowcaseBar";

function parseUrlMetadata(
  url: string,
  fallbackTitle?: string,
): {
  domain: string;
  path: string;
  kind: InternalPageKind;
  title: string;
  https: boolean;
} {
  if (url === "velora://newtab") {
    return {
      domain: "velora://newtab",
      path: "",
      kind: "newtab",
      title: "New Tab",
      https: true,
    };
  }
  if (url === "velora://library") {
    return {
      domain: "velora://library",
      path: "",
      kind: "library",
      title: "Library — Velora",
      https: true,
    };
  }
  if (url === "velora://settings") {
    return {
      domain: "velora://settings",
      path: "",
      kind: "settings",
      title: "Settings — Velora",
      https: true,
    };
  }

  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const domain = parsed.hostname;
    const path = parsed.pathname === "/" ? "" : `${parsed.pathname}${parsed.search}`;
    const kind: InternalPageKind = domain.includes("monograph.nordic-arch.org")
      ? "web-article"
      : domain.includes("spec.nordic-arch.org")
        ? "web-spec"
        : "web-generic";
    return {
      domain,
      path,
      kind,
      title:
        fallbackTitle ??
        (kind === "web-article"
          ? "Tectonic Silence — Nordic Architecture Monograph"
          : kind === "web-spec"
            ? "Low-Carbon Aggregate & Glazing Spec v4.2"
            : domain),
      https: parsed.protocol === "https:",
    };
  } catch {
    return {
      domain: url,
      path: "",
      kind: "web-generic",
      title: fallbackTitle ?? url,
      https: true,
    };
  }
}

export default function App() {
  // Core Settings State
  const [settings, setSettings] = useState<VeloraSettings>({
    themeMode: "light",
    adTrackerBlocking: true,
    cookieBannerHiding: true,
    cloudflareDoh: true,
    tabHibernation15m: true,
    smartDownloadSorting: true,
    verticalTabs: false,
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  useEffect(() => {
    document.title = "Velora";
    let iconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.type = "image/png";
    iconLink.href = ORBIT_ICON_URL;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const resolvedTheme: ResolvedTheme =
    settings.themeMode === "system" ? (systemPrefersDark ? "dark" : "light") : settings.themeMode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("velora-light", "velora-dark", "dark");
    if (resolvedTheme === "dark") {
      root.classList.add("velora-dark", "dark");
    } else {
      root.classList.add("velora-light");
    }
  }, [resolvedTheme]);

  // Tabs & Workspaces State
  const [tabs, setTabs] = useState<BrowserTab[]>(INITIAL_TABS);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>("work");
  const [activeTabId, setActiveTabId] = useState<string>("tab-monograph");

  // Split View & Reader View State
  const [splitView, setSplitView] = useState<boolean>(true);
  const [splitRatio, setSplitRatio] = useState<number>(52);
  const [readerView, setReaderView] = useState<boolean>(false);
  const [readerFontSize, setReaderFontSize] = useState<number>(18);
  const [readerPaperTheme, setReaderPaperTheme] = useState<ReaderPaperTheme>("sepia");

  // Popovers & Modal State
  const [omniboxOpen, setOmniboxOpen] = useState<boolean>(false);
  const [shieldPopoverOpen, setShieldPopoverOpen] = useState<boolean>(false);
  const [downloadsPopoverOpen, setDownloadsPopoverOpen] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  // Window & Showcase State
  const [isMaximized, setIsMaximized] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<ScreenPresetId>("main-split");
  const [showcaseCollapsed, setShowcaseCollapsed] = useState<boolean>(false);
  const [showcaseMultiPopoverMode, setShowcaseMultiPopoverMode] = useState<boolean>(false);

  // Library Data State
  const [librarySection, setLibrarySection] = useState<LibrarySection>("bookmarks");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [history, setHistory] = useState<HistoryEntry[]>(INITIAL_HISTORY);
  const [recentlyClosed, setRecentlyClosed] =
    useState<RecentlyClosedEntry[]>(INITIAL_RECENTLY_CLOSED);
  const [downloads, setDownloads] = useState<DownloadEntry[]>(INITIAL_DOWNLOADS);
  const [shortcuts, setShortcuts] = useState<ShortcutTile[]>(() => {
    if (typeof window === "undefined") return DEFAULT_SHORTCUT_TILES;
    try {
      const saved = window.localStorage.getItem("velora_saved_shortcuts_v1");
      return saved ? (JSON.parse(saved) as ShortcutTile[]) : DEFAULT_SHORTCUT_TILES;
    } catch {
      return DEFAULT_SHORTCUT_TILES;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("velora_saved_shortcuts_v1", JSON.stringify(shortcuts));
    } catch {
      // ignore storage quota errors
    }
  }, [shortcuts]);

  const handleAddShortcut = useCallback((title: string, url: string) => {
    const meta = parseUrlMetadata(url, title);
    const created: ShortcutTile = {
      id: `sc-${Date.now()}`,
      title,
      domain: meta.domain,
      url,
    };
    setShortcuts((prev) => [...prev, created]);
  }, []);

  const handleRemoveShortcut = useCallback((id: string) => {
    setShortcuts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Simple Navigation History Stack for Back/Forward
  const [navStack, setNavStack] = useState<string[]>([
    "https://monograph.nordic-arch.org/essays/daylight-concrete",
  ]);
  const [navIndex, setNavIndex] = useState<number>(0);

  const activeTab = useMemo(() => {
    return (
      tabs.find((t) => t.id === activeTabId) ??
      tabs.find((t) => t.workspace === activeWorkspace) ??
      tabs[0]
    );
  }, [tabs, activeTabId, activeWorkspace]);

  const isBookmarked = useMemo(
    () => bookmarks.some((b) => b.url === activeTab.url),
    [bookmarks, activeTab.url],
  );

  const closeAllPopovers = useCallback(() => {
    setOmniboxOpen(false);
    setShieldPopoverOpen(false);
    setDownloadsPopoverOpen(false);
    setShowcaseMultiPopoverMode(false);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof VeloraSettings>(key: K, value: VeloraSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSelectTab = useCallback(
    (tabId: string) => {
      closeAllPopovers();
      setReaderView(false);
      setActiveTabId(tabId);
      setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, sleeping: false } : t)));
    },
    [closeAllPopovers],
  );

  const handleSelectWorkspace = useCallback(
    (ws: WorkspaceId) => {
      closeAllPopovers();
      setReaderView(false);
      setActiveWorkspace(ws);
      const firstInWs = tabs.find((t) => t.workspace === ws);
      if (firstInWs) {
        setActiveTabId(firstInWs.id);
      }
    },
    [tabs, closeAllPopovers],
  );

  const openOrFocusInternalTab = useCallback(
    (kind: "newtab" | "library" | "settings") => {
      closeAllPopovers();
      setReaderView(false);
      setSplitView(false);
      const url = `velora://${kind}`;
      const existing = tabs.find((t) => t.workspace === activeWorkspace && t.kind === kind);
      if (existing) {
        setActiveTabId(existing.id);
        return;
      }
      const meta = parseUrlMetadata(url);
      const newTab: BrowserTab = {
        id: `tab-${kind}-${Date.now()}`,
        workspace: activeWorkspace,
        title: meta.title,
        url,
        domain: meta.domain,
        path: "",
        kind,
        faviconColor: "#2563EB",
        faviconGlyph: kind === "newtab" ? "V" : kind === "library" ? "B" : "S",
        sleeping: false,
        trackersBlocked: 0,
        https: true,
      };
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    },
    [tabs, activeWorkspace, closeAllPopovers],
  );

  const handleCloseTab = useCallback(
    (tabId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const closingTab = tabs.find((t) => t.id === tabId);
      if (closingTab && !closingTab.url.startsWith("velora://")) {
        setRecentlyClosed((prev) => [
          {
            id: `rc-${Date.now()}`,
            title: closingTab.title,
            url: closingTab.url,
            domain: closingTab.domain,
            closedAgo: "Just now",
            workspace: closingTab.workspace,
          },
          ...prev,
        ]);
      }

      const remainingInWs = tabs.filter((t) => t.workspace === activeWorkspace && t.id !== tabId);
      if (remainingInWs.length === 0) {
        const fallback: BrowserTab = {
          id: `tab-new-${Date.now()}`,
          workspace: activeWorkspace,
          title: "New Tab",
          url: "velora://newtab",
          domain: "velora://newtab",
          path: "",
          kind: "newtab",
          faviconColor: "#2563EB",
          faviconGlyph: "V",
          sleeping: false,
          trackersBlocked: 0,
          https: true,
        };
        setTabs((prev) => [...prev.filter((t) => t.id !== tabId), fallback]);
        setActiveTabId(fallback.id);
        setSplitView(false);
        return;
      }

      setTabs((prev) => prev.filter((t) => t.id !== tabId));
      if (activeTabId === tabId) {
        setActiveTabId(remainingInWs[0].id);
      }
    },
    [tabs, activeWorkspace, activeTabId],
  );

  const handleNewTab = useCallback(() => {
    closeAllPopovers();
    setReaderView(false);
    setSplitView(false);
    const created: BrowserTab = {
      id: `tab-nt-${Date.now()}`,
      workspace: activeWorkspace,
      title: "New Tab",
      url: "velora://newtab",
      domain: "velora://newtab",
      path: "",
      kind: "newtab",
      faviconColor: "#2563EB",
      faviconGlyph: "V",
      sleeping: false,
      trackersBlocked: 0,
      https: true,
    };
    setTabs((prev) => [...prev, created]);
    setActiveTabId(created.id);
    setActivePreset("new-tab");
  }, [activeWorkspace, closeAllPopovers]);

  const handleNavigateUrl = useCallback(
    (url: string, title?: string, pushHistory = true) => {
      closeAllPopovers();
      setReaderView(false);

      if (url === "velora://library") {
        openOrFocusInternalTab("library");
        setActivePreset("library");
        return;
      }
      if (url === "velora://settings") {
        openOrFocusInternalTab("settings");
        setActivePreset("settings");
        return;
      }
      if (url === "velora://newtab") {
        openOrFocusInternalTab("newtab");
        setActivePreset("new-tab");
        return;
      }

      const meta = parseUrlMetadata(url, title);
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTab.id
            ? {
                ...t,
                url,
                domain: meta.domain,
                path: meta.path,
                kind: meta.kind,
                title: meta.title,
                https: meta.https,
                sleeping: false,
                trackersBlocked: meta.kind === "web-article" ? 14 : 6,
              }
            : t,
        ),
      );

      if (pushHistory) {
        setNavStack((prev) => [...prev.slice(0, navIndex + 1), url]);
        setNavIndex((prev) => prev + 1);
        setHistory((prev) => [
          {
            id: `hs-${Date.now()}`,
            title: meta.title,
            url,
            domain: meta.domain,
            visitedAt: "Just now",
            dayGroup: "Today",
          },
          ...prev,
        ]);
      }
    },
    [activeTab.id, closeAllPopovers, navIndex, openOrFocusInternalTab],
  );

  const handleBack = useCallback(() => {
    if (navIndex <= 0) return;
    const prevUrl = navStack[navIndex - 1];
    setNavIndex((i) => i - 1);
    handleNavigateUrl(prevUrl, undefined, false);
  }, [navIndex, navStack, handleNavigateUrl]);

  const handleForward = useCallback(() => {
    if (navIndex >= navStack.length - 1) return;
    const nextUrl = navStack[navIndex + 1];
    setNavIndex((i) => i + 1);
    handleNavigateUrl(nextUrl, undefined, false);
  }, [navIndex, navStack, handleNavigateUrl]);

  const handleToggleBookmark = useCallback(() => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === activeTab.url);
      if (exists) {
        return prev.filter((b) => b.url !== activeTab.url);
      }
      return [
        {
          id: `bm-${Date.now()}`,
          title: activeTab.title,
          url: activeTab.url,
          domain: activeTab.domain,
          folder: "Reading List",
          addedAt: "Just now",
        },
        ...prev,
      ];
    });
  }, [activeTab]);

  const handleRestoreClosedTab = useCallback((entry: RecentlyClosedEntry) => {
    const meta = parseUrlMetadata(entry.url, entry.title);
    const restored: BrowserTab = {
      id: `tab-restored-${Date.now()}`,
      workspace: entry.workspace,
      title: entry.title,
      url: entry.url,
      domain: meta.domain,
      path: meta.path,
      kind: meta.kind,
      faviconColor: "#0D9488",
      faviconGlyph: entry.title.charAt(0).toUpperCase(),
      sleeping: false,
      trackersBlocked: 5,
      https: true,
    };
    setRecentlyClosed((prev) => prev.filter((c) => c.id !== entry.id));
    setTabs((prev) => [...prev, restored]);
    setActiveWorkspace(entry.workspace);
    setActiveTabId(restored.id);
  }, []);

  const handleTriggerDownload = useCallback(
    (filename: string, category: "PDFs" | "Archives" | "Documents", size: string) => {
      const created: DownloadEntry = {
        id: `dl-${Date.now()}`,
        filename,
        size,
        sourceDomain: activeTab.domain,
        category,
        folderPath: `Downloads/${category}`,
        status: "completed",
        completedAt: "Just now",
      };
      setDownloads((prev) => [created, ...prev]);
      setDownloadsPopoverOpen(true);
    },
    [activeTab.domain],
  );

  // Direct 1-click preset transitions for all 8 required Velora screens & states
  const applyScreenPreset = useCallback(
    (preset: ScreenPresetId) => {
      setActivePreset(preset);
      setOnboardingOpen(false);
      closeAllPopovers();

      switch (preset) {
        case "main-split": {
          updateSetting("verticalTabs", false);
          setActiveWorkspace("work");
          setActiveTabId("tab-monograph");
          setReaderView(false);
          setSplitView(true);
          setSplitRatio(52);
          break;
        }
        case "vertical-workspaces": {
          updateSetting("verticalTabs", true);
          setActiveWorkspace("work");
          setActiveTabId("tab-monograph");
          setReaderView(false);
          setSplitView(false);
          break;
        }
        case "omnibox-popovers": {
          updateSetting("verticalTabs", false);
          setActiveWorkspace("work");
          setActiveTabId("tab-monograph");
          setReaderView(false);
          setSplitView(false);
          setShowcaseMultiPopoverMode(true);
          setOmniboxOpen(true);
          setShieldPopoverOpen(true);
          setDownloadsPopoverOpen(true);
          break;
        }
        case "new-tab": {
          updateSetting("verticalTabs", false);
          setReaderView(false);
          setSplitView(false);
          openOrFocusInternalTab("newtab");
          break;
        }
        case "reader-view": {
          updateSetting("verticalTabs", false);
          setActiveWorkspace("work");
          setActiveTabId("tab-monograph");
          setSplitView(false);
          setReaderView(true);
          break;
        }
        case "library": {
          updateSetting("verticalTabs", false);
          setReaderView(false);
          setSplitView(false);
          openOrFocusInternalTab("library");
          break;
        }
        case "settings": {
          updateSetting("verticalTabs", false);
          setReaderView(false);
          setSplitView(false);
          openOrFocusInternalTab("settings");
          break;
        }
        case "onboarding": {
          updateSetting("verticalTabs", false);
          setActiveWorkspace("work");
          setActiveTabId("tab-monograph");
          setReaderView(false);
          setSplitView(true);
          setOnboardingOpen(true);
          break;
        }
      }
    },
    [closeAllPopovers, openOrFocusInternalTab, updateSetting],
  );

  const renderViewportContent = () => {
    if (readerView) {
      return (
        <ReaderView
          fontSize={readerFontSize}
          paperTheme={readerPaperTheme}
          onChangeFontSize={setReaderFontSize}
          onChangePaperTheme={setReaderPaperTheme}
          onCloseReader={() => {
            setReaderView(false);
            setActivePreset("main-split");
          }}
        />
      );
    }

    if (activeTab.kind === "newtab") {
      return (
        <NewTabPage
          settings={settings}
          shortcuts={shortcuts}
          onAddShortcut={handleAddShortcut}
          onRemoveShortcut={handleRemoveShortcut}
          onNavigate={handleNavigateUrl}
          onOpenSettings={() => applyScreenPreset("settings")}
        />
      );
    }

    if (activeTab.kind === "library") {
      return (
        <LibraryView
          activeSection={librarySection}
          bookmarks={bookmarks}
          history={history}
          recentlyClosed={recentlyClosed}
          downloads={downloads}
          smartDownloadSorting={settings.smartDownloadSorting}
          onSelectSection={setLibrarySection}
          onNavigate={handleNavigateUrl}
          onDeleteBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
          onDeleteHistory={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
          onClearHistory={() => setHistory([])}
          onRestoreClosedTab={handleRestoreClosedTab}
        />
      );
    }

    if (activeTab.kind === "settings") {
      return (
        <SettingsView
          settings={settings}
          resolvedTheme={resolvedTheme}
          onUpdateSetting={updateSetting}
          onOpenOnboarding={() => setOnboardingOpen(true)}
        />
      );
    }

    return (
      <WebContentView
        activeTab={activeTab}
        splitView={splitView}
        splitRatio={splitRatio}
        onChangeSplitRatio={setSplitRatio}
        onCloseSplitView={() => setSplitView(false)}
        onOpenReaderView={() => {
          setSplitView(false);
          setReaderView(true);
          setActivePreset("reader-view");
        }}
        onTriggerDownload={handleTriggerDownload}
      />
    );
  };

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex flex-col items-center justify-center ${
        resolvedTheme === "dark" ? "velora-dark" : "velora-light"
      }`}
      style={{
        backgroundColor: isMaximized ? "var(--v-frame)" : "#1F242D",
      }}
    >
      {/* Windows 11 Native Browser Window Shell */}
      <div
        className={`relative flex flex-col overflow-hidden transition-all ${
          isMaximized
            ? "w-full h-full"
            : "w-[min(1440px,96vw)] h-[min(900px,94vh)] rounded-[8px] border shadow-2xl"
        }`}
        style={{
          backgroundColor: "var(--v-frame)",
          borderColor: "var(--v-border)",
          color: "var(--v-text)",
        }}
      >
        {/* 36px Integrated Windows 11 Titlebar */}
        <Titlebar
          tabs={tabs}
          activeTabId={activeTab.id}
          activeWorkspace={activeWorkspace}
          verticalTabs={settings.verticalTabs}
          tabHibernationEnabled={settings.tabHibernation15m}
          isMaximized={isMaximized}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
          onToggleVerticalTabs={() => {
            const next = !settings.verticalTabs;
            updateSetting("verticalTabs", next);
            setActivePreset(next ? "vertical-workspaces" : "main-split");
          }}
          onToggleMaximize={() => setIsMaximized((m) => !m)}
        />

        {/* 40px Navigation Bar with Pill Omnibox & Popovers */}
        <Navbar
          activeTab={activeTab}
          resolvedTheme={resolvedTheme}
          settings={settings}
          splitView={splitView}
          readerView={readerView}
          isBookmarked={isBookmarked}
          omniboxOpen={omniboxOpen}
          shieldPopoverOpen={shieldPopoverOpen}
          downloadsPopoverOpen={downloadsPopoverOpen}
          showcaseMultiPopoverMode={showcaseMultiPopoverMode}
          downloads={downloads}
          canGoBack={navIndex > 0}
          canGoForward={navIndex < navStack.length - 1}
          onBack={handleBack}
          onForward={handleForward}
          onReload={closeAllPopovers}
          onNavigateUrl={handleNavigateUrl}
          onSetOmniboxOpen={(open) => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(open);
            if (open) {
              setShieldPopoverOpen(false);
              setDownloadsPopoverOpen(false);
            }
          }}
          onToggleShieldPopover={() => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(false);
            setDownloadsPopoverOpen(false);
            setShieldPopoverOpen((v) => !v);
          }}
          onToggleDownloadsPopover={() => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(false);
            setShieldPopoverOpen(false);
            setDownloadsPopoverOpen((v) => !v);
          }}
          onToggleSplitView={() => {
            closeAllPopovers();
            setReaderView(false);
            if (
              activeTab.kind === "newtab" ||
              activeTab.kind === "library" ||
              activeTab.kind === "settings"
            ) {
              setActiveWorkspace("work");
              setActiveTabId("tab-monograph");
              setSplitView(true);
            } else {
              setSplitView((s) => !s);
            }
          }}
          onToggleReaderView={() => {
            closeAllPopovers();
            setSplitView(false);
            setReaderView((r) => !r);
          }}
          onToggleBookmark={handleToggleBookmark}
          onOpenLibrary={(section = "bookmarks") => {
            setLibrarySection(section);
            openOrFocusInternalTab("library");
            setActivePreset("library");
          }}
          onOpenSettings={() => {
            openOrFocusInternalTab("settings");
            setActivePreset("settings");
          }}
          onOpenOnboarding={() => {
            closeAllPopovers();
            setOnboardingOpen(true);
            setActivePreset("onboarding");
          }}
          onQuickToggleTheme={() =>
            updateSetting("themeMode", resolvedTheme === "light" ? "dark" : "light")
          }
          onUpdateSetting={updateSetting}
        />

        {/* Main Body: Optional 220px Vertical Sidebar + Active Browser Surface */}
        <div
          className="relative flex-1 min-h-0 flex overflow-hidden"
          onClick={() => {
            if (omniboxOpen || shieldPopoverOpen || downloadsPopoverOpen) {
              closeAllPopovers();
            }
          }}
        >
          {settings.verticalTabs && (
            <VerticalSidebar
              tabs={tabs}
              activeTabId={activeTab.id}
              activeWorkspace={activeWorkspace}
              tabHibernationEnabled={settings.tabHibernation15m}
              onSelectWorkspace={handleSelectWorkspace}
              onSelectTab={handleSelectTab}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
              onOpenLibrary={() => {
                openOrFocusInternalTab("library");
                setActivePreset("library");
              }}
              onOpenSettings={() => {
                openOrFocusInternalTab("settings");
                setActivePreset("settings");
              }}
            />
          )}

          <div className="flex-1 min-w-0 h-full overflow-hidden">{renderViewportContent()}</div>
        </div>

        {/* Centered 3-Step First-Run Onboarding Modal over Blurred Backdrop */}
        {onboardingOpen && (
          <OnboardingModal
            settings={settings}
            onUpdateSetting={updateSetting}
            onClose={() => {
              setOnboardingOpen(false);
              setActivePreset("main-split");
            }}
          />
        )}

        {/* Collapsible 8-State Showcase Switcher Bar */}
        <ShowcaseBar
          activePreset={activePreset}
          resolvedTheme={resolvedTheme}
          collapsed={showcaseCollapsed}
          onSelectPreset={applyScreenPreset}
          onToggleTheme={() =>
            updateSetting("themeMode", resolvedTheme === "light" ? "dark" : "light")
          }
          onToggleCollapsed={() => setShowcaseCollapsed((c) => !c)}
        />
      </div>
    </div>
  );
}
