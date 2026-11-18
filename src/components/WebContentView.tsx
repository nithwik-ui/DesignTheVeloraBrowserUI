import React, { useCallback, useRef, useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  GitPullRequest,
  Lock,
  ShieldCheck,
  X,
} from "lucide-react";
import { BrowserTab } from "../types/velora";
import { ARCH_PHOTOS } from "../data/mockData";
import { OrbitLogo } from "./OrbitLogo";

interface WebContentViewProps {
  activeTab: BrowserTab;
  splitView: boolean;
  splitRatio: number;
  onChangeSplitRatio: (ratio: number) => void;
  onCloseSplitView: () => void;
  onOpenReaderView: () => void;
  onTriggerDownload: (
    filename: string,
    category: "PDFs" | "Archives" | "Documents",
    size: string,
  ) => void;
}

export const WebContentView: React.FC<WebContentViewProps> = ({
  activeTab,
  splitView,
  splitRatio,
  onChangeSplitRatio,
  onCloseSplitView,
  onOpenReaderView,
  onTriggerDownload,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swappedPanes, setSwappedPanes] = useState(false);
  const [downloadedSpec, setDownloadedSpec] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const rawRatio = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(72, Math.max(28, rawRatio));
      onChangeSplitRatio(Math.round(clamped * 10) / 10);
    },
    [isDragging, onChangeSplitRatio],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  }, []);

  const renderMonographArticle = (compact: boolean) => (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: "var(--v-surface)" }}>
      {splitView && (
        <div
          className="sticky top-0 z-10 h-[32px] px-3.5 border-b flex items-center justify-between text-[11px]"
          style={{
            backgroundColor: "var(--v-surface)",
            borderColor: "var(--v-border)",
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: "var(--v-accent)" }}
            />
            <Lock className="w-3 h-3 shrink-0" style={{ color: "var(--v-privacy)" }} />
            <span className="font-mono-ui truncate" style={{ color: "var(--v-muted)" }}>
              monograph.nordic-arch.org/essays/daylight-concrete
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenReaderView}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] border text-[10.5px] font-medium shrink-0"
            style={{
              borderColor: "var(--v-border)",
              color: "var(--v-text)",
            }}
          >
            <BookOpen className="w-3 h-3" style={{ color: "var(--v-accent)" }} />
            <span>Reader</span>
          </button>
        </div>
      )}

      <article
        className={`mx-auto ${compact ? "max-w-[620px] px-6 py-7" : "max-w-[820px] px-10 py-10"}`}
      >
        {/* Minimal Site Masthead */}
        <div
          className="flex items-center justify-between pb-4 mb-7 border-b text-[11.5px]"
          style={{ borderColor: "var(--v-border)", color: "var(--v-muted)" }}
        >
          <span
            className="font-semibold tracking-[0.08em] uppercase"
            style={{ color: "var(--v-text)" }}
          >
            Nordic Architecture Monograph · Issue 19
          </span>
          <div className="flex items-center gap-4">
            <span>Essays</span>
            <span>Material Index</span>
            <button
              type="button"
              onClick={onOpenReaderView}
              className="inline-flex items-center gap-1 font-medium"
              style={{ color: "var(--v-accent)" }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reader View</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="flex items-center gap-2 text-[11.5px]"
            style={{ color: "var(--v-muted)" }}
          >
            <span
              className="px-2 py-0.5 rounded-[6px] border font-mono-ui text-[10.5px]"
              style={{ borderColor: "var(--v-border)", color: "var(--v-text)" }}
            >
              ESSAY 04
            </span>
            <span>By Astrid Lindqvist, MNAL</span>
            <span>·</span>
            <span>7 min read</span>
          </div>

          <h1
            className={`${
              compact ? "text-[24px] leading-[1.24]" : "text-[31px] leading-[1.2]"
            } font-semibold tracking-[-0.02em]`}
            style={{ color: "var(--v-text)" }}
          >
            Tectonic Silence: Low-Carbon Cast Concrete and High-Latitude Daylight
          </h1>

          <p className="text-[14.5px] leading-[1.65]" style={{ color: "var(--v-muted)" }}>
            Above the 59th parallel, low-angle winter sun transforms board-formed mineral surfaces
            from static structure into calibrated optical instruments—eliminating artificial glare
            while sustaining quiet interior warmth.
          </p>
        </div>

        {/* Hero Photography */}
        <figure className="my-6">
          <div
            className="overflow-hidden rounded-[8px] border aspect-[16/9]"
            style={{ borderColor: "var(--v-border)" }}
          >
            <img
              src={ARCH_PHOTOS.heroConcrete}
              alt="Minimalist white architectural concrete volume under crisp Nordic daylight"
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption
            className="mt-2 flex items-center justify-between text-[11.5px]"
            style={{ color: "var(--v-muted)" }}
          >
            <span>
              Fig 1. South-west clerestory baffle, Oslo Fjord Acoustic Pavilion (59.91° N).
            </span>
            <span className="font-mono-ui">DF 4.8% · 4,200K</span>
          </figcaption>
        </figure>

        <div className="space-y-4 text-[14px] leading-[1.75]" style={{ color: "var(--v-text)" }}>
          <p>
            Contemporary civic architecture frequently confuses visual complexity with spatial
            generosity. When structural concrete is cast with 42% ground granulated blast-furnace
            slag (GGBS) and left uncoated, its micro-crystalline reflectance reaches 0.64—diffusing
            grazing winter sunlight deep into reading rooms without mechanical louvers.
          </p>
          <p>
            Paired with triple-glazed low-iron acoustic assemblies, the perimeter wall acts as both
            thermal flywheel and visual threshold. Occupants experience natural circadian
            progression across the workday with zero visual noise.
          </p>
        </div>

        {/* Secondary Two-Card Architectural Figure Grid */}
        <div className="grid grid-cols-2 gap-3.5 my-6">
          <div
            className="rounded-[8px] border overflow-hidden"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-border)",
            }}
          >
            <img
              src={ARCH_PHOTOS.timberInterior}
              alt="Warm Nordic timber acoustic ceiling ribs with soft indirect light"
              className="w-full h-[132px] object-cover"
            />
            <div className="p-3">
              <div className="text-[12px] font-semibold">Spruce Acoustic Coffers</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                Reverberation time held to 0.52s across 18m clear spans.
              </div>
            </div>
          </div>

          <div
            className="rounded-[8px] border overflow-hidden"
            style={{
              backgroundColor: "var(--v-surface-subtle)",
              borderColor: "var(--v-border)",
            }}
          >
            <img
              src={ARCH_PHOTOS.glassFacade}
              alt="Clean structural glass facade reflecting sky and greenery"
              className="w-full h-[132px] object-cover"
            />
            <div className="p-3">
              <div className="text-[12px] font-semibold">Triple Low-Iron Glazing</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--v-muted)" }}>
                Center-of-glass U-value 0.54 W/m²K with 71% VLT.
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );

  const renderSpecPane = (compact: boolean) => (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: "var(--v-surface-subtle)" }}>
      {splitView && (
        <div
          className="sticky top-0 z-10 h-[32px] px-3.5 border-b flex items-center justify-between text-[11px]"
          style={{
            backgroundColor: "var(--v-surface)",
            borderColor: "var(--v-border)",
          }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Lock className="w-3 h-3 shrink-0" style={{ color: "var(--v-privacy)" }} />
            <span className="font-mono-ui truncate" style={{ color: "var(--v-muted)" }}>
              spec.nordic-arch.org/materials/low-carbon-aggregate
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setSwappedPanes((s) => !s)}
              title="Swap left and right split panes"
              className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
              style={{ color: "var(--v-muted)" }}
            >
              <ArrowLeftRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={onCloseSplitView}
              title="Close Split-Screen View"
              className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/6"
              style={{ color: "var(--v-muted)" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className={`mx-auto ${compact ? "max-w-[580px] p-6" : "max-w-[780px] p-10"} space-y-5`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="text-[11px] font-mono-ui uppercase tracking-wider"
              style={{ color: "var(--v-accent)" }}
            >
              MATERIAL SPECIFICATION · REV 4.2
            </div>
            <h2 className="text-[21px] font-semibold tracking-[-0.015em] mt-1">
              Low-Carbon Mineral Aggregate & Glazing Schedule
            </h2>
            <p className="text-[12.5px] mt-1" style={{ color: "var(--v-muted)" }}>
              Cross-referenced companion dataset for Nordic Pavilion Envelope Assemblies (EN 15978
              A1–A3).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setDownloadedSpec(true);
              onTriggerDownload("Nordic_Envelope_Schedule_Rev4.2.pdf", "PDFs", "6.4 MB");
            }}
            className="h-[32px] px-3 rounded-[8px] border text-[12px] font-medium inline-flex items-center gap-1.5 shrink-0 transition-colors"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: downloadedSpec ? "var(--v-privacy)" : "var(--v-border)",
              color: downloadedSpec ? "var(--v-privacy)" : "var(--v-text)",
            }}
          >
            {downloadedSpec ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved to PDFs</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Key Telemetry Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Embodied Carbon", value: "148 kgCO₂e", note: "−41% vs CEM I baseline" },
            { label: "Glazing U-Value", value: "0.54 W/m²K", note: "Argon 90% triple cavity" },
            { label: "Daylight Autonomy", value: "83.4% sDA", note: "300 lux · 50% occupied hrs" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="p-3.5 rounded-[8px] border"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
              }}
            >
              <div className="text-[11px]" style={{ color: "var(--v-muted)" }}>
                {metric.label}
              </div>
              <div className="text-[17px] font-semibold font-mono-ui mt-1">{metric.value}</div>
              <div className="text-[10.5px] mt-1" style={{ color: "var(--v-privacy)" }}>
                {metric.note}
              </div>
            </div>
          ))}
        </div>

        {/* Clean Structural Table */}
        <div
          className="rounded-[8px] border overflow-hidden"
          style={{
            backgroundColor: "var(--v-surface)",
            borderColor: "var(--v-border)",
          }}
        >
          <div
            className="px-4 py-2.5 border-b flex items-center justify-between text-[12px] font-semibold"
            style={{ borderColor: "var(--v-border)" }}
          >
            <span>Envelope Layer Schedule</span>
            <span
              className="text-[11px] font-mono-ui font-normal"
              style={{ color: "var(--v-muted)" }}
            >
              ISO 6946 Verified
            </span>
          </div>
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr
                className="border-b text-[11px]"
                style={{
                  borderColor: "var(--v-border)",
                  color: "var(--v-muted)",
                }}
              >
                <th className="py-2 px-4 font-medium">Assembly Code</th>
                <th className="py-2 px-3 font-medium">Material Composition</th>
                <th className="py-2 px-3 font-medium">Thickness</th>
                <th className="py-2 px-4 font-medium text-right">λ (W/mK)</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--v-border)" }}>
              {[
                ["CON-42G", "Board-formed GGBS Architectural Concrete", "220 mm", "1.35"],
                ["INS-MW1", "High-density Basalt Mineral Wool Batt", "240 mm", "0.034"],
                ["VAP-int", "Smart Hygrovariable Vapor Retarder Membrane", "1.5 mm", "0.17"],
                ["TIM-CLT", "Nordic Spruce Acoustic Rib Lining (PEFC)", "45 mm", "0.12"],
                ["GLZ-3LI", "Triple Low-Iron Glazing + Warm-Edge Spacer", "48 mm", "0.54"],
              ].map(([code, mat, thick, lambda]) => (
                <tr
                  key={code}
                  className="border-b last:border-b-0"
                  style={{ borderColor: "var(--v-border)" }}
                >
                  <td
                    className="py-2.5 px-4 font-mono-ui text-[11.5px]"
                    style={{ color: "var(--v-accent)" }}
                  >
                    {code}
                  </td>
                  <td className="py-2.5 px-3">{mat}</td>
                  <td
                    className="py-2.5 px-3 font-mono-ui text-[11.5px]"
                    style={{ color: "var(--v-muted)" }}
                  >
                    {thick}
                  </td>
                  <td className="py-2.5 px-4 font-mono-ui text-[11.5px] text-right">{lambda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reference Interior Detail Photo */}
        <div
          className="rounded-[8px] border p-3 flex items-center gap-3.5"
          style={{
            backgroundColor: "var(--v-surface)",
            borderColor: "var(--v-border)",
          }}
        >
          <img
            src={ARCH_PHOTOS.curvedTimber}
            alt="Curved Nordic timber wall illuminated by natural skylight"
            className="w-24 h-16 rounded-[6px] object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[12px] font-semibold">Acoustic Timber Baffle Mockup — Bay 04</div>
            <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: "var(--v-muted)" }}>
              Full-scale photometric test verified zero specular glare across 09:00–16:00 winter
              solstice sweep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGenericEngineeringPage = () => (
    <div className="h-full overflow-y-auto p-10" style={{ backgroundColor: "var(--v-surface)" }}>
      <div className="max-w-[780px] mx-auto space-y-5">
        <div
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px]"
          style={{
            borderColor: "var(--v-border)",
            color: "var(--v-privacy)",
            backgroundColor: "var(--v-privacy-soft)",
          }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Loaded cleanly · {activeTab.trackersBlocked} trackers blocked · 1.1.1.1 DoH</span>
        </div>

        <div
          className="p-6 rounded-[8px] border space-y-4"
          style={{
            backgroundColor: "var(--v-surface-subtle)",
            borderColor: "var(--v-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-[12px] font-mono-ui inline-flex items-center gap-2"
              style={{ color: "var(--v-muted)" }}
            >
              <OrbitLogo size={18} />
              <span>{activeTab.url}</span>
            </span>
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-[6px] border"
              style={{ borderColor: "var(--v-border)", color: "var(--v-accent)" }}
            >
              <GitPullRequest className="w-3 h-3" />
              <span>Verified HTTPS</span>
            </span>
          </div>

          <h1 className="text-[22px] font-semibold tracking-[-0.015em]">{activeTab.title}</h1>
          <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--v-muted)" }}>
            This workspace document is active in Velora with zero background telemetry scripts,
            cookie consent overlays automatically suppressed, and hardware-accelerated
            DirectComposition rendering enabled.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <a
              href={activeTab.url}
              target="_blank"
              rel="noreferrer"
              className="h-[32px] px-3.5 rounded-[8px] text-[12px] font-medium text-white inline-flex items-center gap-1.5"
              style={{ backgroundColor: "var(--v-accent)" }}
            >
              <span>Open Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onOpenReaderView}
              className="h-[32px] px-3 rounded-[8px] border text-[12px] font-medium inline-flex items-center gap-1.5"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--v-accent)" }} />
              <span>Open in Reader View</span>
            </button>
            <span
              className="text-[11.5px] inline-flex items-center gap-1"
              style={{ color: "var(--v-muted)" }}
            >
              <ExternalLink className="w-3 h-3" />
              <span>Workspace: {activeTab.workspace}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (!splitView) {
    if (activeTab.kind === "web-spec") {
      return renderSpecPane(false);
    }
    if (activeTab.kind === "web-generic") {
      return renderGenericEngineeringPage();
    }
    return renderMonographArticle(false);
  }

  const leftPane = swappedPanes ? renderSpecPane(true) : renderMonographArticle(true);
  const rightPane = swappedPanes ? renderMonographArticle(true) : renderSpecPane(true);

  return (
    <div
      ref={containerRef}
      className={`h-full w-full flex overflow-hidden ${isDragging ? "select-none cursor-col-resize" : ""}`}
    >
      {/* Left Pane */}
      <div
        className="h-full min-w-0 overflow-hidden"
        style={{ width: `calc(${splitRatio}% - 2px)` }}
      >
        {leftPane}
      </div>

      {/* 4px Draggable Split-Screen Divider */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={Math.round(splitRatio)}
        aria-valuemin={28}
        aria-valuemax={72}
        title="Drag to resize split panes (double-click to reset 50/50)"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={() => onChangeSplitRatio(50)}
        className="group relative w-[4px] shrink-0 h-full cursor-col-resize flex items-center justify-center transition-colors z-20"
        style={{
          backgroundColor: isDragging ? "var(--v-accent)" : "var(--v-border)",
        }}
      >
        <div
          className="w-[4px] h-10 rounded-full transition-colors group-hover:opacity-100"
          style={{
            backgroundColor: isDragging ? "#FFFFFF" : "var(--v-accent)",
            opacity: isDragging ? 0.95 : 0.65,
          }}
        />
      </div>

      {/* Right Pane */}
      <div
        className="h-full min-w-0 overflow-hidden"
        style={{ width: `calc(${100 - splitRatio}% - 2px)` }}
      >
        {rightPane}
      </div>
    </div>
  );
};
