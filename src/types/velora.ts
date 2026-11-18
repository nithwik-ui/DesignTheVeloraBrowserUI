export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export type WorkspaceId = "work" | "personal" | "research";

export type ScreenPresetId =
  | "main-split"
  | "vertical-workspaces"
  | "omnibox-popovers"
  | "new-tab"
  | "reader-view"
  | "library"
  | "settings"
  | "onboarding";

export type InternalPageKind =
  | "web-article"
  | "web-spec"
  | "web-generic"
  | "newtab"
  | "reader"
  | "library"
  | "settings";

export interface BrowserTab {
  id: string;
  workspace: WorkspaceId;
  title: string;
  url: string;
  domain: string;
  path: string;
  kind: InternalPageKind;
  faviconColor: string;
  faviconGlyph: string;
  sleeping?: boolean;
  memorySavedMb?: number;
  pinned?: boolean;
  trackersBlocked: number;
  https: boolean;
}

export interface ShortcutTile {
  id: string;
  title: string;
  domain: string;
  url: string;
}

export interface AutocompleteItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  path: string;
  category: "url" | "bookmark" | "history" | "search" | "open-tab";
  workspace?: WorkspaceId;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  folder: "Architecture" | "Engineering" | "Reading List" | "Tools";
  addedAt: string;
}

export interface HistoryEntry {
  id: string;
  title: string;
  url: string;
  domain: string;
  visitedAt: string;
  dayGroup: "Today" | "Yesterday";
}

export interface RecentlyClosedEntry {
  id: string;
  title: string;
  url: string;
  domain: string;
  closedAgo: string;
  tabCount?: number;
  workspace: WorkspaceId;
}

export interface DownloadEntry {
  id: string;
  filename: string;
  size: string;
  sourceDomain: string;
  category: "PDFs" | "Archives" | "Images" | "Documents";
  folderPath: string;
  status: "completed" | "downloading";
  progress?: number;
  completedAt: string;
}

export interface VeloraSettings {
  themeMode: ThemeMode;
  adTrackerBlocking: boolean;
  cookieBannerHiding: boolean;
  cloudflareDoh: boolean;
  tabHibernation15m: boolean;
  smartDownloadSorting: boolean;
  verticalTabs: boolean;
}

export type LibrarySection = "bookmarks" | "history" | "recently-closed" | "downloads";

export type ReaderPaperTheme = "white" | "sepia" | "black";

export interface BrowserProfile {
  id: string;
  name: string;
  email: string;
  avatarType: "starry-tower" | "orbit" | "initial";
  color: string;
  initial: string;
  syncEnabled: boolean;
}

export interface SavedPasswordEntry {
  id: string;
  domain: string;
  username: string;
  password: string;
  updatedAt: string;
}

export interface BrowserExtensionEntry {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
}

export type ActiveFeatureModal =
  | null
  | "passwords"
  | "extensions"
  | "clear-data"
  | "task-manager"
  | "account-manage";
