import React, { useMemo, useState } from "react";
import {
  Bookmark,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileArchive,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import {
  BookmarkItem,
  DownloadEntry,
  HistoryEntry,
  LibrarySection,
  RecentlyClosedEntry,
} from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface LibraryViewProps {
  activeSection: LibrarySection;
  bookmarks: BookmarkItem[];
  history: HistoryEntry[];
  recentlyClosed: RecentlyClosedEntry[];
  downloads: DownloadEntry[];
  smartDownloadSorting: boolean;
  onSelectSection: (section: LibrarySection) => void;
  onNavigate: (url: string, title?: string) => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
  onRestoreClosedTab: (entry: RecentlyClosedEntry) => void;
}

const NAV_ITEMS: {
  id: LibrarySection;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { id: "history", label: "History", icon: Clock },
  { id: "recently-closed", label: "Recently Closed", icon: RotateCcw },
  { id: "downloads", label: "Downloads", icon: Download },
];

export const LibraryView: React.FC<LibraryViewProps> = ({
  activeSection,
  bookmarks,
  history,
  recentlyClosed,
  downloads,
  smartDownloadSorting,
  onSelectSection,
  onNavigate,
  onDeleteBookmark,
  onDeleteHistory,
  onClearHistory,
  onRestoreClosedTab,
}) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [selectedDlCategory, setSelectedDlCategory] = useState<string>("All");

  const q = filterQuery.trim().toLowerCase();

  const filteredBookmarks = useMemo(
    () =>
      bookmarks.filter(
        (b) =>
          (selectedFolder === "All" || b.folder === selectedFolder) &&
          (!q || b.title.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q)),
      ),
    [bookmarks, selectedFolder, q],
  );

  const filteredHistory = useMemo(
    () =>
      history.filter(
        (h) => !q || h.title.toLowerCase().includes(q) || h.domain.toLowerCase().includes(q),
      ),
    [history, q],
  );

  const filteredClosed = useMemo(
    () =>
      recentlyClosed.filter(
        (c) => !q || c.title.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q),
      ),
    [recentlyClosed, q],
  );

  const filteredDownloads = useMemo(
    () =>
      downloads.filter(
        (d) =>
          (selectedDlCategory === "All" || d.category === selectedDlCategory) &&
          (!q || d.filename.toLowerCase().includes(q) || d.sourceDomain.toLowerCase().includes(q)),
      ),
    [downloads, selectedDlCategory, q],
  );

  const sectionCounts: Record<LibrarySection, number> = {
    bookmarks: bookmarks.length,
    history: history.length,
    "recently-closed": recentlyClosed.length,
    downloads: downloads.length,
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
      className="h-full w-full flex overflow-hidden"
      style={{
        backgroundColor: "var(--v-surface)",
        color: "var(--v-text)",
      }}
    >
      {/* Left Navigation Column */}
      <aside
        className="w-[236px] shrink-0 h-full border-r p-4 flex flex-col justify-between select-none"
        style={{
          backgroundColor: "var(--v-surface-subtle)",
          borderColor: "var(--v-border)",
        }}
      >
        <div>
          <div
            className="px-2 pb-3.5 mb-3 border-b flex items-center gap-2.5"
            style={{ borderColor: "var(--v-border)" }}
          >
            <OrbitLogo size={30} />
            <div>
              <h1 className="text-[15px] font-semibold tracking-[-0.01em] leading-tight">
                Library
              </h1>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                Local-first Orbit index
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className="w-full h-[36px] px-2.5 rounded-[8px] flex items-center justify-between text-[12.5px] font-medium transition-colors border"
                  style={{
                    backgroundColor: active ? "var(--v-surface)" : "transparent",
                    borderColor: active ? "var(--v-border)" : "transparent",
                    color: active ? "var(--v-accent)" : "var(--v-text)",
                  }}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </span>
                  <span
                    className="text-[11px] font-mono-ui px-1.5 py-0.5 rounded-[6px]"
                    style={{
                      backgroundColor: "var(--v-omnibox)",
                      color: "var(--v-muted)",
                    }}
                  >
                    {sectionCounts[item.id]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div
          className="p-3 rounded-[8px] border text-[11px] space-y-1"
          style={{
            backgroundColor: "var(--v-surface)",
            borderColor: "var(--v-border)",
            color: "var(--v-muted)",
          }}
        >
          <div className="font-medium flex items-center gap-1.5" style={{ color: "var(--v-text)" }}>
            <OrbitLogo size={15} />
            <span>SQLite Encrypted Store</span>
          </div>
          <div>All bookmarks and browsing history stay strictly on this Windows device.</div>
        </div>
      </aside>

      {/* Right Content Column */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="max-w-[820px] mx-auto space-y-5">
          {/* Section Header + Search Input */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-semibold tracking-[-0.015em] capitalize">
                {activeSection.replace("-", " ")}
              </h2>
              <p className="text-[12.5px]" style={{ color: "var(--v-muted)" }}>
                {activeSection === "bookmarks" &&
                  "Saved architecture references, specifications, and engineering tools."}
                {activeSection === "history" &&
                  "Chronological local browsing log with one-click item removal."}
                {activeSection === "recently-closed" &&
                  "Reopen recently closed tabs directly into their original workspace."}
                {activeSection === "downloads" &&
                  (smartDownloadSorting
                    ? "Smart Download Sorting active — files automatically routed into category folders."
                    : "Standard flat Downloads directory.")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="h-[34px] w-[240px] rounded-[8px] px-3 flex items-center gap-2 border"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-border)",
                }}
              >
                <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--v-muted)" }} />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder={`Filter ${activeSection.replace("-", " ")}…`}
                  className="w-full bg-transparent outline-none text-[12px]"
                  style={{ color: "var(--v-text)" }}
                />
              </div>

              {activeSection === "history" && history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="h-[34px] px-3 rounded-[8px] border text-[12px] font-medium inline-flex items-center gap-1.5 hover:opacity-90"
                  style={{
                    backgroundColor: "var(--v-surface-subtle)",
                    borderColor: "var(--v-border)",
                    color: "var(--v-text)",
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-filters for Bookmarks / Downloads */}
          {activeSection === "bookmarks" && (
            <div className="flex items-center gap-1.5">
              {["All", "Architecture", "Engineering", "Reading List", "Tools"].map((folder) => {
                const active = selectedFolder === folder;
                return (
                  <button
                    key={folder}
                    type="button"
                    onClick={() => setSelectedFolder(folder)}
                    className="h-[28px] px-3 rounded-[8px] text-[12px] font-medium border transition-colors"
                    style={{
                      backgroundColor: active ? "var(--v-accent-soft)" : "var(--v-surface-subtle)",
                      borderColor: active ? "var(--v-accent)" : "var(--v-border)",
                      color: active ? "var(--v-accent)" : "var(--v-muted)",
                    }}
                  >
                    {folder}
                  </button>
                );
              })}
            </div>
          )}

          {activeSection === "downloads" && (
            <div className="flex items-center gap-1.5">
              {["All", "PDFs", "Archives", "Documents", "Images"].map((cat) => {
                const active = selectedDlCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedDlCategory(cat)}
                    className="h-[28px] px-3 rounded-[8px] text-[12px] font-medium border transition-colors"
                    style={{
                      backgroundColor: active ? "var(--v-accent-soft)" : "var(--v-surface-subtle)",
                      borderColor: active ? "var(--v-accent)" : "var(--v-border)",
                      color: active ? "var(--v-accent)" : "var(--v-muted)",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* List Surface */}
          <div
            className="rounded-[8px] border divide-y overflow-hidden"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
            }}
          >
            {activeSection === "bookmarks" &&
              (filteredBookmarks.length === 0 ? (
                <div className="p-8 text-center text-[13px]" style={{ color: "var(--v-muted)" }}>
                  No matching bookmarks found.
                </div>
              ) : (
                filteredBookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border-b last:border-b-0"
                    style={{ borderColor: "var(--v-border)" }}
                  >
                    <div
                      onClick={() => onNavigate(bm.url, bm.title)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <OrbitLogo size={16} />
                        <span className="text-[13px] font-medium truncate">{bm.title}</span>
                        <span
                          className="text-[10.5px] px-2 py-0.5 rounded-[6px] border shrink-0"
                          style={{
                            borderColor: "var(--v-border)",
                            color: "var(--v-muted)",
                          }}
                        >
                          {bm.folder}
                        </span>
                      </div>
                      <div
                        className="text-[11.5px] font-mono-ui truncate mt-0.5"
                        style={{ color: "var(--v-muted)" }}
                      >
                        {bm.url}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px]" style={{ color: "var(--v-muted)" }}>
                        {bm.addedAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate(bm.url, bm.title)}
                        title="Open bookmark"
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
                        style={{ color: "var(--v-muted)" }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteBookmark(bm.id)}
                        title="Remove bookmark"
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
                        style={{ color: "var(--v-muted)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ))}

            {activeSection === "history" &&
              (filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-[13px]" style={{ color: "var(--v-muted)" }}>
                  Browsing history is clean.
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border-b last:border-b-0"
                    style={{ borderColor: "var(--v-border)" }}
                  >
                    <div
                      onClick={() => onNavigate(item.url, item.title)}
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="text-[13px] font-medium truncate">{item.title}</div>
                      <div
                        className="text-[11.5px] font-mono-ui truncate mt-0.5"
                        style={{ color: "var(--v-muted)" }}
                      >
                        {item.domain} · {item.dayGroup}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className="text-[11.5px] font-mono-ui"
                        style={{ color: "var(--v-muted)" }}
                      >
                        {item.visitedAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => onDeleteHistory(item.id)}
                        title="Delete from history"
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
                        style={{ color: "var(--v-muted)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ))}

            {activeSection === "recently-closed" &&
              (filteredClosed.length === 0 ? (
                <div className="p-8 text-center text-[13px]" style={{ color: "var(--v-muted)" }}>
                  All recently closed tabs have been restored.
                </div>
              ) : (
                filteredClosed.map((closed) => (
                  <div
                    key={closed.id}
                    className="px-4 py-3 flex items-center justify-between gap-4 border-b last:border-b-0"
                    style={{ borderColor: "var(--v-border)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium truncate">{closed.title}</span>
                        <span
                          className="text-[10.5px] px-2 py-0.5 rounded-[6px] border capitalize"
                          style={{
                            borderColor: "var(--v-border)",
                            color: "var(--v-muted)",
                          }}
                        >
                          {closed.workspace}
                        </span>
                      </div>
                      <div
                        className="text-[11.5px] font-mono-ui truncate mt-0.5"
                        style={{ color: "var(--v-muted)" }}
                      >
                        {closed.url} · Closed {closed.closedAgo}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRestoreClosedTab(closed)}
                      className="h-[30px] px-3 rounded-[8px] border text-[12px] font-medium inline-flex items-center gap-1.5 shrink-0 transition-colors"
                      style={{
                        backgroundColor: "var(--v-surface-subtle)",
                        borderColor: "var(--v-border)",
                        color: "var(--v-accent)",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore Tab</span>
                    </button>
                  </div>
                ))
              ))}

            {activeSection === "downloads" &&
              filteredDownloads.map((dl) => (
                <div
                  key={dl.id}
                  className="px-4 py-3.5 flex items-center justify-between gap-4 border-b last:border-b-0"
                  style={{ borderColor: "var(--v-border)" }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 rounded-[8px] border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: "var(--v-surface-subtle)",
                        borderColor: "var(--v-border)",
                      }}
                    >
                      {renderDownloadIcon(dl.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium truncate">{dl.filename}</div>
                      <div
                        className="text-[11.5px] font-mono-ui flex items-center gap-2 mt-0.5"
                        style={{ color: "var(--v-muted)" }}
                      >
                        <span>{dl.size}</span>
                        <span>·</span>
                        <span>{dl.sourceDomain}</span>
                        <span>·</span>
                        <span style={{ color: "var(--v-accent)" }}>
                          {smartDownloadSorting ? `~/${dl.folderPath}` : "~/Downloads"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {dl.status === "downloading" ? (
                      <span
                        className="text-[11px] font-mono-ui px-2.5 py-1 rounded-full border"
                        style={{
                          borderColor: "var(--v-accent)",
                          color: "var(--v-accent)",
                        }}
                      >
                        {dl.progress ?? 76}% downloading
                      </span>
                    ) : (
                      <span
                        className="text-[11.5px] inline-flex items-center gap-1"
                        style={{ color: "var(--v-privacy)" }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{dl.completedAt}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      className="h-[28px] px-2.5 rounded-[6px] border text-[11.5px] inline-flex items-center gap-1"
                      style={{
                        borderColor: "var(--v-border)",
                        color: "var(--v-text)",
                      }}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};
