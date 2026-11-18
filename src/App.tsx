import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Languages, Search, X } from "lucide-react";
import {
  ActiveFeatureModal,
  BookmarkItem,
  BrowserExtensionEntry,
  BrowserProfile,
  BrowserTab,
  DownloadEntry,
  HistoryEntry,
  InternalPageKind,
  LibrarySection,
  ReaderPaperTheme,
  RecentlyClosedEntry,
  ResolvedTheme,
  SavedPasswordEntry,
  ScreenPresetId,
  ShortcutTile,
  VeloraSettings,
  WorkspaceId,
} from "./types/velora";
import {
  DEFAULT_SHORTCUT_TILES,
  INITIAL_BOOKMARKS,
  INITIAL_DOWNLOADS,
  INITIAL_EXTENSIONS,
  INITIAL_HISTORY,
  INITIAL_PASSWORDS,
  INITIAL_PROFILES,
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
import { BrowserFeatureDialogs } from "./components/BrowserFeatureDialogs";

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
  const [profilePopoverOpen, setProfilePopoverOpen] = useState<boolean>(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [featureModal, setFeatureModal] = useState<ActiveFeatureModal>(null);

  // Profiles, Incognito, Zoom, Find & Translate, Passwords & Extensions State
  const [profiles, setProfiles] = useState<BrowserProfile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>("prof-main");
  const [incognitoMode, setIncognitoMode] = useState<boolean>(false);
  const [pageZoom, setPageZoom] = useState<number>(100);
  const [passwords, setPasswords] = useState<SavedPasswordEntry[]>(INITIAL_PASSWORDS);
  const [extensions, setExtensions] = useState<BrowserExtensionEntry[]>(INITIAL_EXTENSIONS);
  const [findBarOpen, setFindBarOpen] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>("");
  const [translateBarOpen, setTranslateBarOpen] = useState<boolean>(false);
  const [targetLang, setTargetLang] = useState<string>("English");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 2600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? profiles[0],
    [profiles, activeProfileId],
  );

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
    setProfilePopoverOpen(false);
    setMoreMenuOpen(false);
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
        if (!incognitoMode) {
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
      }
    },
    [activeTab.id, closeAllPopovers, incognitoMode, navIndex, openOrFocusInternalTab],
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

  // Keyboard Shortcuts matching the 3-Dots Menu hints
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "t") {
        e.preventDefault();
        handleNewTab();
      } else if (mod && e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setIncognitoMode((v) => {
          const next = !v;
          showToast(next ? "Incognito window active — history paused" : "Exited Incognito window");
          return next;
        });
      } else if (mod && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setLibrarySection("downloads");
        openOrFocusInternalTab("library");
      } else if (mod && e.key.toLowerCase() === "h") {
        e.preventDefault();
        setLibrarySection("history");
        openOrFocusInternalTab("library");
      } else if (mod && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setFindBarOpen(true);
      } else if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleToggleBookmark();
        showToast(isBookmarked ? "Removed bookmark" : "Bookmarked current tab");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNewTab, handleToggleBookmark, isBookmarked, openOrFocusInternalTab, showToast]);

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
          profilePopoverOpen={profilePopoverOpen}
          moreMenuOpen={moreMenuOpen}
          showcaseMultiPopoverMode={showcaseMultiPopoverMode}
          downloads={downloads}
          recentHistory={history}
          activeProfile={activeProfile}
          profiles={profiles}
          incognitoMode={incognitoMode}
          pageZoom={pageZoom}
          activeWorkspace={activeWorkspace}
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
              setProfilePopoverOpen(false);
              setMoreMenuOpen(false);
            }
          }}
          onToggleShieldPopover={() => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(false);
            setDownloadsPopoverOpen(false);
            setProfilePopoverOpen(false);
            setMoreMenuOpen(false);
            setShieldPopoverOpen((v) => !v);
          }}
          onToggleDownloadsPopover={() => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(false);
            setShieldPopoverOpen(false);
            setProfilePopoverOpen(false);
            setMoreMenuOpen(false);
            setDownloadsPopoverOpen((v) => !v);
          }}
          onToggleProfilePopover={() => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(false);
            setShieldPopoverOpen(false);
            setDownloadsPopoverOpen(false);
            setMoreMenuOpen(false);
            setProfilePopoverOpen((v) => !v);
          }}
          onToggleMoreMenu={() => {
            setShowcaseMultiPopoverMode(false);
            setOmniboxOpen(false);
            setShieldPopoverOpen(false);
            setDownloadsPopoverOpen(false);
            setProfilePopoverOpen(false);
            setMoreMenuOpen((v) => !v);
          }}
          onCloseMenus={closeAllPopovers}
          onSelectProfile={(profileId) => {
            setIncognitoMode(false);
            setActiveProfileId(profileId);
            const chosen = profiles.find((p) => p.id === profileId);
            if (chosen) {
              showToast(`Switched profile to ${chosen.name}`);
            }
          }}
          onUpdateActiveProfile={(updates) => {
            setProfiles((prev) =>
              prev.map((p) => (p.id === activeProfile.id ? { ...p, ...updates } : p)),
            );
            showToast("Profile updated");
          }}
          onAddProfile={(name, email, color) => {
            const created: BrowserProfile = {
              id: `prof-${Date.now()}`,
              name,
              email,
              avatarType: "initial",
              color,
              initial: name.charAt(0).toUpperCase(),
              syncEnabled: true,
            };
            setProfiles((prev) => [...prev, created]);
            setActiveProfileId(created.id);
            setIncognitoMode(false);
            showToast(`Created and signed into ${name}`);
          }}
          onNewTab={handleNewTab}
          onNewWindow={() => {
            setIncognitoMode(false);
            handleNewTab();
            showToast("Opened fresh Velora browser window session");
          }}
          onToggleIncognito={() => {
            setIncognitoMode((prev) => {
              const next = !prev;
              showToast(
                next
                  ? "Incognito window active — browsing history paused"
                  : "Closed Incognito window",
              );
              return next;
            });
          }}
          onSelectWorkspace={handleSelectWorkspace}
          onToggleVerticalTabs={() => {
            const next = !settings.verticalTabs;
            updateSetting("verticalTabs", next);
            setActivePreset(next ? "vertical-workspaces" : "main-split");
          }}
          onSaveCurrentToShortcuts={() => {
            handleAddShortcut(activeTab.title, activeTab.url);
            showToast(`Pinned "${activeTab.domain}" to New Tab shortcuts`);
          }}
          onChangeZoom={setPageZoom}
          onToggleFullscreen={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => {});
            } else {
              document.documentElement.requestFullscreen?.().catch(() => {
                setIsMaximized((m) => !m);
              });
            }
          }}
          onPrint={() => window.print()}
          onToggleTranslateBar={() => setTranslateBarOpen((t) => !t)}
          onOpenFindBar={() => setFindBarOpen(true)}
          onCopyCurrentUrl={() => {
            navigator.clipboard?.writeText(activeTab.url).catch(() => {});
            showToast(`Copied ${activeTab.url}`);
          }}
          onSavePageAsPdf={() => {
            const safeName = `${activeTab.domain.replace(/[^a-z0-9.-]/gi, "_")}_Capture.pdf`;
            handleTriggerDownload(safeName, "PDFs", "4.8 MB");
            showToast(`Saved ${safeName} to Downloads/PDFs`);
          }}
          onOpenFeatureModal={(modal) => setFeatureModal(modal)}
          onExitBrowser={() => {
            if (incognitoMode) {
              setIncognitoMode(false);
              showToast("Closed Incognito session");
            } else {
              closeAllPopovers();
              setPageZoom(100);
              showToast("Session state saved cleanly to local encrypted store");
            }
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
            if (
              omniboxOpen ||
              shieldPopoverOpen ||
              downloadsPopoverOpen ||
              profilePopoverOpen ||
              moreMenuOpen
            ) {
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

          <div className="relative flex-1 min-w-0 h-full overflow-hidden">
            {/* Floating Find-in-Page Bar (Ctrl+F) */}
            {findBarOpen && (
              <div
                className="absolute top-2.5 right-4 z-30 h-[36px] px-3 rounded-[8px] border flex items-center gap-2"
                style={{
                  backgroundColor: "var(--v-popover)",
                  borderColor: "var(--v-popover-border)",
                  boxShadow: "var(--v-shadow-popover)",
                }}
              >
                <Search className="w-3.5 h-3.5" style={{ color: "var(--v-muted)" }} />
                <input
                  type="text"
                  autoFocus
                  value={findQuery}
                  onChange={(e) => setFindQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setFindBarOpen(false);
                  }}
                  placeholder="Find in page…"
                  className="w-40 bg-transparent text-[12px] outline-none"
                  style={{ color: "var(--v-text)" }}
                />
                {findQuery.trim() && (
                  <span className="text-[11px] font-mono-ui" style={{ color: "var(--v-muted)" }}>
                    {activeTab.title.toLowerCase().includes(findQuery.trim().toLowerCase())
                      ? "1/3"
                      : "2 matches"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setFindBarOpen(false);
                    setFindQuery("");
                  }}
                  className="w-5 h-5 rounded-[4px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
                  style={{ color: "var(--v-muted)" }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Floating Translate Page Bar */}
            {translateBarOpen && (
              <div
                className="absolute top-2.5 left-4 z-30 h-[36px] px-3 rounded-[8px] border flex items-center gap-2.5 text-[12px]"
                style={{
                  backgroundColor: "var(--v-popover)",
                  borderColor: "var(--v-popover-border)",
                  boxShadow: "var(--v-shadow-popover)",
                }}
              >
                <Languages className="w-3.5 h-3.5" style={{ color: "var(--v-accent)" }} />
                <span>Translate page to:</span>
                <select
                  value={targetLang}
                  onChange={(e) => {
                    setTargetLang(e.target.value);
                    showToast(`Page translated to ${e.target.value}`);
                  }}
                  className="h-[24px] px-2 rounded-[6px] border text-[11.5px] outline-none"
                  style={{
                    backgroundColor: "var(--v-surface-subtle)",
                    borderColor: "var(--v-popover-border)",
                    color: "var(--v-text)",
                  }}
                >
                  {["English", "Norwegian", "German", "French", "Japanese", "Spanish"].map(
                    (lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ),
                  )}
                </select>
                <button
                  type="button"
                  onClick={() => setTranslateBarOpen(false)}
                  className="w-5 h-5 rounded-[4px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
                  style={{ color: "var(--v-muted)" }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div
              className="w-full h-full"
              style={{
                zoom: pageZoom / 100,
              }}
            >
              {renderViewportContent()}
            </div>

            {/* Subtle Action Feedback Toast */}
            {toastMessage && (
              <div
                className="absolute bottom-4 right-4 z-40 px-3.5 py-2 rounded-[8px] border text-[12px] font-medium flex items-center gap-2"
                style={{
                  backgroundColor: "var(--v-popover)",
                  borderColor: "var(--v-popover-border)",
                  color: "var(--v-text)",
                  boxShadow: "var(--v-shadow-popover)",
                }}
              >
                <Check className="w-3.5 h-3.5" style={{ color: "var(--v-privacy)" }} />
                <span>{toastMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Feature Dialogs (Passwords, Extensions, Delete Data, Task Manager, Account) */}
        <BrowserFeatureDialogs
          activeModal={featureModal}
          activeProfile={activeProfile}
          passwords={passwords}
          extensions={extensions}
          tabs={tabs}
          onClose={() => setFeatureModal(null)}
          onAddPassword={(domain, username, password) => {
            setPasswords((prev) => [
              {
                id: `pw-${Date.now()}`,
                domain,
                username,
                password,
                updatedAt: "Just now",
              },
              ...prev,
            ]);
            showToast(`Saved login for ${domain}`);
          }}
          onDeletePassword={(id) => {
            setPasswords((prev) => prev.filter((p) => p.id !== id));
            showToast("Removed saved password");
          }}
          onToggleExtension={(id) => {
            setExtensions((prev) =>
              prev.map((ext) => (ext.id === id ? { ...ext, enabled: !ext.enabled } : ext)),
            );
          }}
          onClearBrowsingData={({ history: delHist, downloads: delDl }) => {
            if (delHist) setHistory([]);
            if (delDl) setDownloads([]);
            showToast("Selected browsing data deleted");
          }}
          onToggleTabSleep={(tabId) => {
            setTabs((prev) =>
              prev.map((t) =>
                t.id === tabId
                  ? { ...t, sleeping: !t.sleeping, memorySavedMb: t.memorySavedMb ?? 128 }
                  : t,
              ),
            );
          }}
          onOpenSettings={() => {
            openOrFocusInternalTab("settings");
            setActivePreset("settings");
          }}
        />

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
