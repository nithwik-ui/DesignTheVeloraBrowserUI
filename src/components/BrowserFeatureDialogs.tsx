import React, { useState } from "react";
import {
  Check,
  Copy,
  Cpu,
  Eye,
  EyeOff,
  KeyRound,
  Moon,
  Plus,
  Puzzle,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  ActiveFeatureModal,
  BrowserExtensionEntry,
  BrowserProfile,
  BrowserTab,
  SavedPasswordEntry,
} from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";
import { ProfileAvatar } from "./ProfileAvatar";

interface BrowserFeatureDialogsProps {
  activeModal: ActiveFeatureModal;
  activeProfile: BrowserProfile;
  passwords: SavedPasswordEntry[];
  extensions: BrowserExtensionEntry[];
  tabs: BrowserTab[];
  onClose: () => void;
  onAddPassword: (domain: string, username: string, password: string) => void;
  onDeletePassword: (id: string) => void;
  onToggleExtension: (id: string) => void;
  onClearBrowsingData: (opts: { history: boolean; downloads: boolean }) => void;
  onToggleTabSleep: (tabId: string) => void;
  onOpenSettings: () => void;
}

export const BrowserFeatureDialogs: React.FC<BrowserFeatureDialogsProps> = ({
  activeModal,
  activeProfile,
  passwords,
  extensions,
  tabs,
  onClose,
  onAddPassword,
  onDeletePassword,
  onToggleExtension,
  onClearBrowsingData,
  onToggleTabSleep,
  onOpenSettings,
}) => {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pwDomain, setPwDomain] = useState("");
  const [pwUser, setPwUser] = useState("");
  const [pwSecret, setPwSecret] = useState("");

  const [clearRange, setClearRange] = useState("all");
  const [clearHistory, setClearHistory] = useState(true);
  const [clearDownloads, setClearDownloads] = useState(false);
  const [clearCookies, setClearCookies] = useState(true);
  const [clearCache, setClearCache] = useState(true);

  if (!activeModal) return null;

  const copyPassword = (id: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xs bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] rounded-[8px] border overflow-hidden select-none"
        style={{
          backgroundColor: "var(--v-popover)",
          borderColor: "var(--v-popover-border)",
          color: "var(--v-text)",
          boxShadow: "var(--v-shadow-popover)",
        }}
      >
        {/* PASSWORDS & AUTOFILL MODAL */}
        {activeModal === "passwords" && (
          <>
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between"
              style={{ borderColor: "var(--v-popover-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4" style={{ color: "var(--v-accent)" }} />
                <span className="text-[14px] font-semibold">Passwords and Autofill</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
              <div className="space-y-2">
                {passwords.map((pw) => {
                  const visible = Boolean(revealedIds[pw.id]);
                  return (
                    <div
                      key={pw.id}
                      className="p-3 rounded-[8px] border flex items-center justify-between gap-3"
                      style={{
                        backgroundColor: "var(--v-surface-subtle)",
                        borderColor: "var(--v-popover-border)",
                      }}
                    >
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-semibold truncate">{pw.domain}</div>
                        <div
                          className="text-[11.5px] font-mono-ui truncate"
                          style={{ color: "var(--v-muted)" }}
                        >
                          {pw.username}
                        </div>
                        <div className="text-[11.5px] font-mono-ui mt-0.5">
                          {visible ? pw.password : "••••••••••••••••"}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedIds((prev) => ({ ...prev, [pw.id]: !prev[pw.id] }))
                          }
                          title={visible ? "Hide password" : "Show password"}
                          className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
                          style={{ color: "var(--v-muted)" }}
                        >
                          {visible ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => copyPassword(pw.id, pw.password)}
                          title="Copy password"
                          className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
                          style={{
                            color: copiedId === pw.id ? "var(--v-privacy)" : "var(--v-muted)",
                          }}
                        >
                          {copiedId === pw.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePassword(pw.id)}
                          title="Remove saved login"
                          className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
                          style={{ color: "var(--v-muted)" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!pwDomain.trim() || !pwUser.trim() || !pwSecret.trim()) return;
                  onAddPassword(pwDomain.trim(), pwUser.trim(), pwSecret.trim());
                  setPwDomain("");
                  setPwUser("");
                  setPwSecret("");
                }}
                className="p-3 rounded-[8px] border space-y-2"
                style={{ borderColor: "var(--v-popover-border)" }}
              >
                <div className="text-[12px] font-semibold">Save new credential</div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Domain"
                    value={pwDomain}
                    onChange={(e) => setPwDomain(e.target.value)}
                    className="h-[30px] px-2.5 rounded-[6px] border bg-transparent text-[12px] outline-none"
                    style={{ borderColor: "var(--v-border)" }}
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={pwUser}
                    onChange={(e) => setPwUser(e.target.value)}
                    className="h-[30px] px-2.5 rounded-[6px] border bg-transparent text-[12px] outline-none"
                    style={{ borderColor: "var(--v-border)" }}
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="password"
                      placeholder="Password"
                      value={pwSecret}
                      onChange={(e) => setPwSecret(e.target.value)}
                      className="min-w-0 flex-1 h-[30px] px-2.5 rounded-[6px] border bg-transparent text-[12px] outline-none"
                      style={{ borderColor: "var(--v-border)" }}
                    />
                    <button
                      type="submit"
                      className="w-[30px] h-[30px] rounded-[6px] flex items-center justify-center text-white shrink-0"
                      style={{ backgroundColor: "var(--v-accent)" }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}

        {/* EXTENSIONS MODAL */}
        {activeModal === "extensions" && (
          <>
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between"
              style={{ borderColor: "var(--v-popover-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <Puzzle className="w-4 h-4" style={{ color: "var(--v-accent)" }} />
                <span className="text-[14px] font-semibold">Extensions</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-2.5">
              {extensions.map((ext) => (
                <div
                  key={ext.id}
                  className="p-3.5 rounded-[8px] border flex items-center justify-between gap-4"
                  style={{
                    backgroundColor: "var(--v-surface-subtle)",
                    borderColor: "var(--v-popover-border)",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <OrbitLogo size={22} dimmed={!ext.enabled} />
                    <div>
                      <div className="text-[13px] font-semibold flex items-center gap-2">
                        <span>{ext.name}</span>
                        <span
                          className="text-[10.5px] font-mono-ui font-normal"
                          style={{ color: "var(--v-muted)" }}
                        >
                          v{ext.version}
                        </span>
                      </div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                        {ext.description}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={ext.enabled}
                    onClick={() => onToggleExtension(ext.id)}
                    className="w-9 h-5 rounded-full p-0.5 transition-colors shrink-0"
                    style={{
                      backgroundColor: ext.enabled ? "var(--v-accent)" : "var(--v-border)",
                    }}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                        ext.enabled ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DELETE BROWSING DATA MODAL */}
        {activeModal === "clear-data" && (
          <>
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between"
              style={{ borderColor: "var(--v-popover-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4" style={{ color: "var(--v-accent)" }} />
                <span className="text-[14px] font-semibold">Delete browsing data</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between text-[12.5px]">
                <span style={{ color: "var(--v-muted)" }}>Time range</span>
                <select
                  value={clearRange}
                  onChange={(e) => setClearRange(e.target.value)}
                  className="h-[30px] px-2.5 rounded-[6px] border text-[12px] outline-none"
                  style={{
                    backgroundColor: "var(--v-surface-subtle)",
                    borderColor: "var(--v-popover-border)",
                    color: "var(--v-text)",
                  }}
                >
                  <option value="hour">Last hour</option>
                  <option value="day">Last 24 hours</option>
                  <option value="all">All time</option>
                </select>
              </div>

              <div className="space-y-2 text-[12.5px]">
                {[
                  {
                    label: "Browsing history",
                    desc: "Clears visited URLs from your local Library",
                    checked: clearHistory,
                    toggle: () => setClearHistory((v) => !v),
                  },
                  {
                    label: "Download history list",
                    desc: "Clears recent list (keeps downloaded files on disk)",
                    checked: clearDownloads,
                    toggle: () => setClearDownloads((v) => !v),
                  },
                  {
                    label: "Cookies and other site data",
                    desc: "Signs you out of non-pinned websites",
                    checked: clearCookies,
                    toggle: () => setClearCookies((v) => !v),
                  },
                  {
                    label: "Cached images and files",
                    desc: "Frees 184 MB of local disk cache",
                    checked: clearCache,
                    toggle: () => setClearCache((v) => !v),
                  },
                ].map((row) => (
                  <label
                    key={row.label}
                    className="p-2.5 rounded-[8px] border flex items-center justify-between cursor-pointer"
                    style={{
                      backgroundColor: "var(--v-surface-subtle)",
                      borderColor: "var(--v-popover-border)",
                    }}
                  >
                    <div>
                      <div className="font-medium">{row.label}</div>
                      <div className="text-[11px]" style={{ color: "var(--v-muted)" }}>
                        {row.desc}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={row.toggle}
                      className="w-4 h-4 accent-[#2563EB]"
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-[32px] px-3 rounded-[8px] border text-[12px]"
                  style={{ borderColor: "var(--v-popover-border)", color: "var(--v-muted)" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearBrowsingData({
                      history: clearHistory,
                      downloads: clearDownloads,
                    });
                    onClose();
                  }}
                  className="h-[32px] px-4 rounded-[8px] text-[12px] font-medium text-white"
                  style={{ backgroundColor: "var(--v-accent)" }}
                >
                  Delete data
                </button>
              </div>
            </div>
          </>
        )}

        {/* TASK MANAGER MODAL */}
        {activeModal === "task-manager" && (
          <>
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between"
              style={{ borderColor: "var(--v-popover-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4" style={{ color: "var(--v-accent)" }} />
                <span className="text-[14px] font-semibold">Velora Task Manager</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-2 max-h-[380px] overflow-y-auto">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="px-3 py-2.5 rounded-[8px] border flex items-center justify-between gap-3 text-[12px]"
                  style={{
                    backgroundColor: "var(--v-surface-subtle)",
                    borderColor: "var(--v-popover-border)",
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <OrbitLogo size={16} dimmed={tab.sleeping} />
                    <span className="truncate font-medium">{tab.title}</span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono-ui text-[11px]" style={{ color: "var(--v-muted)" }}>
                      {tab.sleeping
                        ? `Sleeping (${tab.memorySavedMb ?? 120} MB freed)`
                        : "94 MB RAM"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleTabSleep(tab.id)}
                      className="h-[24px] px-2 rounded-[6px] border text-[11px] inline-flex items-center gap-1"
                      style={{
                        borderColor: "var(--v-popover-border)",
                        color: tab.sleeping ? "var(--v-accent)" : "var(--v-muted)",
                      }}
                    >
                      <Moon className="w-3 h-3" />
                      <span>{tab.sleeping ? "Wake" : "Sleep"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ACCOUNT MANAGEMENT MODAL */}
        {activeModal === "account-manage" && (
          <>
            <div
              className="px-5 py-3.5 border-b flex items-center justify-between"
              style={{ borderColor: "var(--v-popover-border)" }}
            >
              <div className="flex items-center gap-2.5">
                <OrbitLogo size={20} />
                <span className="text-[14px] font-semibold">Velora Account</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/8"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div
                className="p-4 rounded-[8px] border flex items-center gap-3.5"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-popover-border)",
                }}
              >
                <ProfileAvatar profile={activeProfile} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold">{activeProfile.name}</div>
                  <div className="text-[12px]" style={{ color: "var(--v-muted)" }}>
                    {activeProfile.email}
                  </div>
                  <div
                    className="mt-1 inline-flex items-center gap-1 text-[11px]"
                    style={{ color: "var(--v-privacy)" }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>End-to-end encrypted profile vault</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="h-[32px] px-4 rounded-[8px] text-[12px] font-medium text-white"
                  style={{ backgroundColor: "var(--v-accent)" }}
                >
                  Open Browser Settings
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
