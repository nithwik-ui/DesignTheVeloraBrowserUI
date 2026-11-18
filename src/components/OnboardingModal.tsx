import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Monitor,
  Moon,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { ThemeMode, VeloraSettings } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface OnboardingModalProps {
  settings: VeloraSettings;
  onUpdateSetting: <K extends keyof VeloraSettings>(key: K, value: VeloraSettings[K]) => void;
  onClose: () => void;
}

const BROWSER_SOURCES = [
  { id: "edge", name: "Microsoft Edge", detail: "Profile 1 · 142 bookmarks, 4 workspaces" },
  { id: "chrome", name: "Google Chrome", detail: "Default · 98 bookmarks, saved logins" },
  { id: "firefox", name: "Mozilla Firefox", detail: "default-release · 64 bookmarks" },
  { id: "brave", name: "Arc / Brave", detail: "Spaces & pinned tabs" },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  settings,
  onUpdateSetting,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBrowser, setSelectedBrowser] = useState("edge");
  const [importItems, setImportItems] = useState({
    bookmarks: true,
    history: true,
    passwords: false,
    openTabs: true,
  });
  const [importDone, setImportDone] = useState(false);

  const toggleImportItem = (key: keyof typeof importItems) => {
    setImportItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Velora first-run setup"
      className="absolute inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-black/45"
    >
      <div
        className="w-full max-w-[560px] rounded-[8px] border overflow-hidden select-none"
        style={{
          backgroundColor: "var(--v-popover)",
          borderColor: "var(--v-popover-border)",
          color: "var(--v-text)",
          boxShadow: "var(--v-shadow-popover)",
        }}
      >
        {/* Modal Top Bar + Step Indicator */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--v-popover-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <OrbitLogo size={26} />
            <span className="text-[13.5px] font-semibold">Welcome to Velora</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {([1, 2, 3] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  aria-label={`Step ${s}`}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: step === s ? "22px" : "8px",
                    backgroundColor: step === s ? "var(--v-accent)" : "var(--v-border)",
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono-ui" style={{ color: "var(--v-muted)" }}>
              {step}/3
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Dismiss setup modal"
              className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
              style={{ color: "var(--v-muted)" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Step Body */}
        <div className="p-6 min-h-[305px] flex flex-col justify-between">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <div
                  className="text-[11px] font-mono-ui uppercase tracking-wider"
                  style={{ color: "var(--v-accent)" }}
                >
                  Step 1 of 3 · Appearance
                </div>
                <h2 className="text-[20px] font-semibold tracking-[-0.015em] mt-1">
                  Choose a calm native surface
                </h2>
                <p className="text-[12.5px] mt-1" style={{ color: "var(--v-muted)" }}>
                  Designed for Windows 11 with zero feeds, zero AI sidebars, and crisp 1px
                  hairlines.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                {(
                  [
                    {
                      mode: "light" as ThemeMode,
                      label: "Light",
                      desc: "Daylight studio",
                      frame: "#F3F4F6",
                      surf: "#FFFFFF",
                      bdr: "#E5E7EB",
                      icon: Sun,
                    },
                    {
                      mode: "dark" as ThemeMode,
                      label: "Dark",
                      desc: "Low-glare carbon",
                      frame: "#0D0D0F",
                      surf: "#18181B",
                      bdr: "#2E2E34",
                      icon: Moon,
                    },
                    {
                      mode: "system" as ThemeMode,
                      label: "System",
                      desc: "Syncs with Win11",
                      frame: "#18181B",
                      surf: "#FFFFFF",
                      bdr: "#6B7280",
                      icon: Monitor,
                    },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const active = settings.themeMode === item.mode;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => onUpdateSetting("themeMode", item.mode)}
                      className="p-3 rounded-[8px] border text-left transition-all"
                      style={{
                        backgroundColor: "var(--v-surface-subtle)",
                        borderColor: active ? "var(--v-accent)" : "var(--v-popover-border)",
                      }}
                    >
                      <div
                        className="h-14 rounded-[6px] border p-2 flex flex-col justify-between mb-2.5"
                        style={{
                          backgroundColor: item.frame,
                          borderColor: item.bdr,
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <OrbitLogo size={10} />
                          <div
                            className="h-2 w-10 rounded-full"
                            style={{ backgroundColor: item.surf }}
                          />
                        </div>
                        <div
                          className="h-6 rounded-[4px] px-1.5 flex items-center gap-1.5"
                          style={{ backgroundColor: item.surf }}
                        >
                          <OrbitLogo size={14} />
                          <div className="h-1.5 w-10 rounded-full bg-[#2563EB]" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-semibold flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.label}</span>
                        </span>
                        {active && (
                          <Check className="w-3.5 h-3.5" style={{ color: "var(--v-accent)" }} />
                        )}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                        {item.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div
                  className="text-[11px] font-mono-ui uppercase tracking-wider"
                  style={{ color: "var(--v-accent)" }}
                >
                  Step 2 of 3 · Browser Migration
                </div>
                <h2 className="text-[20px] font-semibold tracking-[-0.015em] mt-1">
                  Import bookmarks & workspaces locally
                </h2>
                <p className="text-[12.5px] mt-1" style={{ color: "var(--v-muted)" }}>
                  Bring your existing bookmarks and tabs in one click—processed 100% offline on
                  disk.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BROWSER_SOURCES.map((src) => {
                  const active = selectedBrowser === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => {
                        setSelectedBrowser(src.id);
                        setImportDone(false);
                      }}
                      className="p-2.5 rounded-[8px] border text-left transition-colors"
                      style={{
                        backgroundColor: "var(--v-surface-subtle)",
                        borderColor: active ? "var(--v-accent)" : "var(--v-popover-border)",
                      }}
                    >
                      <div className="text-[12.5px] font-semibold flex items-center justify-between">
                        <span>{src.name}</span>
                        {active && (
                          <Check className="w-3.5 h-3.5" style={{ color: "var(--v-accent)" }} />
                        )}
                      </div>
                      <div
                        className="text-[11px] truncate mt-0.5"
                        style={{ color: "var(--v-muted)" }}
                      >
                        {src.detail}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      ["bookmarks", "Bookmarks"],
                      ["history", "History"],
                      ["openTabs", "Open Tabs"],
                      ["passwords", "Passwords"],
                    ] as const
                  ).map(([key, label]) => {
                    const checked = importItems[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleImportItem(key)}
                        className="h-[28px] px-2.5 rounded-[6px] border text-[11.5px] inline-flex items-center gap-1.5"
                        style={{
                          backgroundColor: checked ? "var(--v-accent-soft)" : "transparent",
                          borderColor: checked ? "var(--v-accent)" : "var(--v-popover-border)",
                          color: checked ? "var(--v-accent)" : "var(--v-muted)",
                        }}
                      >
                        <Check className="w-3 h-3" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setImportDone(true)}
                  className="h-[28px] px-3 rounded-[6px] border text-[11.5px] font-medium inline-flex items-center gap-1.5"
                  style={{
                    borderColor: importDone ? "var(--v-privacy)" : "var(--v-popover-border)",
                    color: importDone ? "var(--v-privacy)" : "var(--v-text)",
                  }}
                >
                  {importDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Imported 142 items</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Test Import</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <div
                  className="text-[11px] font-mono-ui uppercase tracking-wider"
                  style={{ color: "var(--v-privacy)" }}
                >
                  Step 3 of 3 · Privacy & Performance Defaults
                </div>
                <h2 className="text-[20px] font-semibold tracking-[-0.015em] mt-1">
                  Shielded and quiet out of the box
                </h2>
                <p className="text-[12.5px] mt-1" style={{ color: "var(--v-muted)" }}>
                  Verify your default protections. You can adjust these anytime from the omnibox
                  shield.
                </p>
              </div>

              <div
                className="rounded-[8px] border divide-y"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-popover-border)",
                }}
              >
                {(
                  [
                    [
                      "adTrackerBlocking",
                      "Block Ads & Cross-Site Trackers",
                      "Built-in Rust filter lists with zero memory overhead",
                    ],
                    [
                      "cookieBannerHiding",
                      "Auto-Hide Cookie Consent Banners",
                      "Suppresses repetitive GDPR & consent popups automatically",
                    ],
                    [
                      "cloudflareDoh",
                      "Cloudflare 1.1.1.1 Encrypted DNS (DoH)",
                      "Protects domain lookups with TLS 1.3 encryption",
                    ],
                    [
                      "tabHibernation15m",
                      "15-Minute Sleeping Tabs",
                      "Hibernates inactive background tabs to conserve RAM",
                    ],
                  ] as const
                ).map(([key, title, desc]) => {
                  const enabled = settings[key];
                  return (
                    <div
                      key={key}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-3 border-b last:border-b-0"
                      style={{ borderColor: "var(--v-popover-border)" }}
                    >
                      <div>
                        <div className="text-[12.5px] font-medium flex items-center gap-1.5">
                          <ShieldCheck
                            className="w-3.5 h-3.5"
                            style={{
                              color: enabled ? "var(--v-privacy)" : "var(--v-muted)",
                            }}
                          />
                          <span>{title}</span>
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--v-muted)" }}>
                          {desc}
                        </div>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={enabled}
                        onClick={() => onUpdateSetting(key, !enabled)}
                        className="w-9 h-5 rounded-full p-0.5 transition-colors shrink-0"
                        style={{
                          backgroundColor: enabled ? "var(--v-privacy)" : "var(--v-border)",
                        }}
                      >
                        <span
                          className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                            enabled ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="px-6 py-3.5 border-t flex items-center justify-between"
          style={{
            backgroundColor: "var(--v-surface-subtle)",
            borderColor: "var(--v-popover-border)",
          }}
        >
          <button
            type="button"
            onClick={() => (step > 1 ? setStep((s) => (s - 1) as 1 | 2 | 3) : onClose())}
            className="h-[32px] px-3 rounded-[8px] border text-[12px] font-medium inline-flex items-center gap-1.5"
            style={{
              borderColor: "var(--v-popover-border)",
              color: "var(--v-muted)",
            }}
          >
            {step > 1 ? (
              <>
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </>
            ) : (
              <span>Skip Setup</span>
            )}
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="h-[32px] px-4 rounded-[8px] text-[12px] font-medium text-white inline-flex items-center gap-1.5"
              style={{ backgroundColor: "var(--v-accent)" }}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="h-[32px] px-4 rounded-[8px] text-[12px] font-medium text-white inline-flex items-center gap-1.5"
              style={{ backgroundColor: "var(--v-accent)" }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Start Browsing in Velora</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
