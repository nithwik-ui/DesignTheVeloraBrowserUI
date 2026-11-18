import React, { useState } from "react";
import { Check, Monitor, Moon, ShieldCheck, Sun } from "lucide-react";
import { ResolvedTheme, ThemeMode, VeloraSettings } from "../types/velora";
import { OrbitLogo } from "./OrbitLogo";

interface SettingsViewProps {
  settings: VeloraSettings;
  resolvedTheme: ResolvedTheme;
  onUpdateSetting: <K extends keyof VeloraSettings>(key: K, value: VeloraSettings[K]) => void;
  onOpenOnboarding: () => void;
}

type SettingsCategory = "all" | "appearance" | "privacy" | "performance" | "downloads";

const CATEGORIES: {
  id: SettingsCategory;
  label: string;
}[] = [
  { id: "all", label: "All Settings" },
  { id: "appearance", label: "Appearance & Tabs" },
  { id: "privacy", label: "Privacy & 1.1.1.1 DNS" },
  { id: "performance", label: "Sleeping Tabs" },
  { id: "downloads", label: "Smart Downloads" },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  resolvedTheme,
  onUpdateSetting,
  onOpenOnboarding,
}) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("all");

  const showSection = (cat: Exclude<SettingsCategory, "all">) =>
    activeCategory === "all" || activeCategory === cat;

  const renderSwitch = (
    checked: boolean,
    onChange: (next: boolean) => void,
    label: string,
    privacyAccent = false,
  ) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="w-10 h-[22px] rounded-full p-0.5 transition-colors shrink-0"
      style={{
        backgroundColor: checked
          ? privacyAccent
            ? "var(--v-privacy)"
            : "var(--v-accent)"
          : "var(--v-border)",
      }}
    >
      <span
        className={`block w-[18px] h-[18px] rounded-full bg-white transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0"
        }`}
      />
    </button>
  );

  const themeCards: {
    mode: ThemeMode;
    title: string;
    subtitle: string;
    frameBg: string;
    surfaceBg: string;
    borderHex: string;
    accentHex: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      mode: "light",
      title: "Light Mode",
      subtitle: "#F3F4F6 frame · #FFFFFF surfaces",
      frameBg: "#F3F4F6",
      surfaceBg: "#FFFFFF",
      borderHex: "#E5E7EB",
      accentHex: "#2563EB",
      icon: Sun,
    },
    {
      mode: "dark",
      title: "Dark Mode",
      subtitle: "#0D0D0F frame · #18181B surfaces",
      frameBg: "#0D0D0F",
      surfaceBg: "#18181B",
      borderHex: "#2E2E34",
      accentHex: "#3B82F6",
      icon: Moon,
    },
    {
      mode: "system",
      title: "Windows 11 System",
      subtitle: `Follows OS (${resolvedTheme === "dark" ? "Dark" : "Light"} active)`,
      frameBg: resolvedTheme === "dark" ? "#0D0D0F" : "#F3F4F6",
      surfaceBg: resolvedTheme === "dark" ? "#18181B" : "#FFFFFF",
      borderHex: resolvedTheme === "dark" ? "#2E2E34" : "#E5E7EB",
      accentHex: "#2563EB",
      icon: Monitor,
    },
  ];

  return (
    <div
      className="h-full w-full flex overflow-hidden"
      style={{
        backgroundColor: "var(--v-surface)",
        color: "var(--v-text)",
      }}
    >
      {/* Left Settings Category Column */}
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
            <OrbitLogo size={32} />
            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold tracking-[-0.01em] leading-tight">
                Velora Settings
              </h1>
              <p
                className="text-[11px] mt-0.5 font-mono-ui truncate"
                style={{ color: "var(--v-muted)" }}
              >
                Orbit 1.8.0 · Win11 x64
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className="w-full h-[36px] px-2.5 rounded-[8px] flex items-center gap-2.5 text-[12.5px] font-medium transition-colors border"
                  style={{
                    backgroundColor: active ? "var(--v-surface)" : "transparent",
                    borderColor: active ? "var(--v-border)" : "transparent",
                    color: active ? "var(--v-accent)" : "var(--v-text)",
                  }}
                >
                  <OrbitLogo size={16} dimmed={!active} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2.5">
          <div
            className="p-3 rounded-[8px] border flex items-center gap-2.5"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
            }}
          >
            <OrbitLogo size={26} />
            <div className="min-w-0">
              <div className="text-[11.5px] font-semibold truncate">Orbit Core Active</div>
              <div className="text-[10.5px]" style={{ color: "var(--v-privacy)" }}>
                Zero telemetry verified
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenOnboarding}
            className="w-full h-[34px] px-3 rounded-[8px] border text-[12px] font-medium flex items-center justify-center gap-2 transition-colors hover:opacity-90"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
              color: "var(--v-text)",
            }}
          >
            <OrbitLogo size={16} />
            <span>Run First-Run Setup</span>
          </button>
        </div>
      </aside>

      {/* Right Settings Controls Column */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="max-w-[780px] mx-auto space-y-7 pb-10">
          {/* Velora Orbit Identity Header Card */}
          <div
            className="p-5 rounded-[8px] border flex flex-wrap items-center justify-between gap-4"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-border)",
            }}
          >
            <div className="flex items-center gap-4">
              <OrbitLogo size={54} />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-semibold tracking-[-0.015em]">
                    Velora Orbit Browser
                  </h2>
                  <span
                    className="text-[10.5px] px-2 py-0.5 rounded-full font-mono-ui"
                    style={{
                      backgroundColor: "var(--v-privacy-soft)",
                      color: "var(--v-privacy)",
                    }}
                  >
                    Up to date · v1.8.0
                  </span>
                </div>
                <p className="text-[12.5px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                  Native Windows 11 desktop browser powered by Orbit privacy shield and 1.1.1.1
                  encrypted DNS.
                </p>
              </div>
            </div>
          </div>

          {/* Appearance & Theme Selector Cards */}
          {showSection("appearance") && (
            <section className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <OrbitLogo size={20} />
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                    Appearance & Theme
                  </h2>
                  <p className="text-[12.5px]" style={{ color: "var(--v-muted)" }}>
                    Fluent-inspired native Windows 11 surfaces with 1px hairline borders and zero
                    visual clutter.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {themeCards.map((card) => {
                  const selected = settings.themeMode === card.mode;
                  return (
                    <button
                      key={card.mode}
                      type="button"
                      onClick={() => onUpdateSetting("themeMode", card.mode)}
                      className="p-3 rounded-[8px] border text-left transition-all"
                      style={{
                        backgroundColor: "var(--v-surface-subtle)",
                        borderColor: selected ? "var(--v-accent)" : "var(--v-border)",
                      }}
                    >
                      {/* Mini Browser Chrome Preview with Orbit Emblem */}
                      <div
                        className="h-[74px] rounded-[6px] border p-2 flex flex-col justify-between mb-2.5"
                        style={{
                          backgroundColor: card.frameBg,
                          borderColor: card.borderHex,
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <OrbitLogo size={11} />
                          <div
                            className="h-2.5 w-14 rounded-[3px]"
                            style={{ backgroundColor: card.surfaceBg }}
                          />
                          <div
                            className="h-2 w-8 rounded-full opacity-50"
                            style={{ backgroundColor: card.borderHex }}
                          />
                        </div>
                        <div
                          className="h-9 rounded-[4px] border px-2.5 flex items-center gap-2"
                          style={{
                            backgroundColor: card.surfaceBg,
                            borderColor: card.borderHex,
                          }}
                        >
                          <OrbitLogo size={20} />
                          <div
                            className="h-2 w-16 rounded-full"
                            style={{ backgroundColor: card.accentHex }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[12.5px] font-semibold flex items-center gap-1.5">
                          <OrbitLogo size={15} />
                          <span>{card.title}</span>
                        </span>
                        {selected && (
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: "var(--v-accent)" }}
                          >
                            <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <div
                        className="text-[11px] font-mono-ui mt-0.5"
                        style={{ color: "var(--v-muted)" }}
                      >
                        {card.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Vertical Tabs Layout Option */}
              <div
                className="p-4 rounded-[8px] border flex items-center justify-between gap-4"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-border)",
                }}
              >
                <div>
                  <div className="text-[13px] font-medium">
                    Vertical Tabs & Workspaces Sidebar (220px)
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                    Dock Work, Personal, and Research workspace pills and tabs along the left frame
                    edge.
                  </div>
                </div>
                {renderSwitch(
                  settings.verticalTabs,
                  (v) => onUpdateSetting("verticalTabs", v),
                  "Vertical Tabs & Workspaces Sidebar",
                )}
              </div>
            </section>
          )}

          {/* Privacy & Network Shield */}
          {showSection("privacy") && (
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <OrbitLogo size={20} />
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                    Privacy Shield & Encrypted DNS
                  </h2>
                  <p className="text-[12.5px]" style={{ color: "var(--v-muted)" }}>
                    Native Rust content-blocking engine and encrypted DNS—no third-party extensions
                    required.
                  </p>
                </div>
              </div>

              <div
                className="rounded-[8px] border divide-y overflow-hidden"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-border)",
                }}
              >
                <div
                  className="p-4 flex items-center justify-between gap-4 border-b"
                  style={{ borderColor: "var(--v-border)" }}
                >
                  <div>
                    <div className="text-[13px] font-medium flex items-center gap-2">
                      <span>Strict Ad & Cross-Site Tracker Blocking</span>
                      <span
                        className="text-[10.5px] px-2 py-0.5 rounded-full font-mono-ui"
                        style={{
                          backgroundColor: "var(--v-privacy-soft)",
                          color: "var(--v-privacy)",
                        }}
                      >
                        EasyList + EasyPrivacy
                      </span>
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                      Blocks network-level tracking beacons, fingerprinting scripts, and intrusive
                      ad frames.
                    </div>
                  </div>
                  {renderSwitch(
                    settings.adTrackerBlocking,
                    (v) => onUpdateSetting("adTrackerBlocking", v),
                    "Ad and Tracker Blocking",
                    true,
                  )}
                </div>

                <div
                  className="p-4 flex items-center justify-between gap-4 border-b"
                  style={{ borderColor: "var(--v-border)" }}
                >
                  <div>
                    <div className="text-[13px] font-medium">Auto-Hide Cookie Consent Banners</div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                      Automatically rejects non-essential consent popups and removes sticky GDPR
                      overlays.
                    </div>
                  </div>
                  {renderSwitch(
                    settings.cookieBannerHiding,
                    (v) => onUpdateSetting("cookieBannerHiding", v),
                    "Cookie Banner Hiding",
                    true,
                  )}
                </div>

                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-medium flex items-center gap-2">
                      <span>Cloudflare 1.1.1.1 DNS-over-HTTPS (DoH)</span>
                      <span
                        className="text-[10.5px] px-2 py-0.5 rounded-[6px] border font-mono-ui"
                        style={{
                          borderColor: "var(--v-border)",
                          color: "var(--v-text)",
                        }}
                      >
                        https://cloudflare-dns.com/dns-query
                      </span>
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                      Encrypts every domain lookup over TLS 1.3 to prevent ISP snooping and DNS
                      tampering.
                    </div>
                  </div>
                  {renderSwitch(
                    settings.cloudflareDoh,
                    (v) => onUpdateSetting("cloudflareDoh", v),
                    "Cloudflare 1.1.1.1 DNS-over-HTTPS",
                    true,
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Performance & Sleeping Tabs */}
          {showSection("performance") && (
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <OrbitLogo size={20} />
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                    Memory & Tab Hibernation
                  </h2>
                  <p className="text-[12.5px]" style={{ color: "var(--v-muted)" }}>
                    Keep background workspaces responsive while minimizing RAM and battery draw.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-[8px] border flex items-center justify-between gap-4"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-border)",
                }}
              >
                <div>
                  <div className="text-[13px] font-medium">
                    15-Minute Tab Hibernation (Sleeping Tabs)
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                    Automatically suspends background tabs after 15 minutes of inactivity, freeing
                    up to 78% of tab memory.
                  </div>
                </div>
                {renderSwitch(
                  settings.tabHibernation15m,
                  (v) => onUpdateSetting("tabHibernation15m", v),
                  "15-minute tab hibernation",
                )}
              </div>
            </section>
          )}

          {/* Downloads & Smart Sorting */}
          {showSection("downloads") && (
            <section className="space-y-3">
              <div className="flex items-center gap-2.5">
                <OrbitLogo size={20} />
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.01em]">
                    Downloads & File Organization
                  </h2>
                  <p className="text-[12.5px]" style={{ color: "var(--v-muted)" }}>
                    Keep your Windows Downloads folder clean automatically.
                  </p>
                </div>
              </div>

              <div
                className="p-4 rounded-[8px] border space-y-3"
                style={{
                  backgroundColor: "var(--v-surface-subtle)",
                  borderColor: "var(--v-border)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[13px] font-medium">Smart Download Sorting</div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                      Route downloaded files by MIME type into structured subfolders without extra
                      prompts.
                    </div>
                  </div>
                  {renderSwitch(
                    settings.smartDownloadSorting,
                    (v) => onUpdateSetting("smartDownloadSorting", v),
                    "Smart download sorting",
                  )}
                </div>

                {settings.smartDownloadSorting && (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t"
                    style={{ borderColor: "var(--v-border)" }}
                  >
                    {[
                      [".pdf, .epub", "~/Downloads/PDFs"],
                      [".zip, .7z, .tar", "~/Downloads/Archives"],
                      [".png, .jpg, .svg", "~/Downloads/Images"],
                      [".csv, .docx, .md", "~/Downloads/Documents"],
                    ].map(([exts, dest]) => (
                      <div
                        key={dest}
                        className="p-2 rounded-[6px] border text-[11px] font-mono-ui"
                        style={{
                          backgroundColor: "var(--v-surface)",
                          borderColor: "var(--v-border)",
                        }}
                      >
                        <div style={{ color: "var(--v-accent)" }}>{dest}</div>
                        <div className="mt-0.5" style={{ color: "var(--v-muted)" }}>
                          {exts}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
