import React from "react";
import { Clock, Minus, Plus, X } from "lucide-react";
import { ReaderPaperTheme } from "../types/velora";
import { ARCH_PHOTOS } from "../data/mockData";
import { OrbitLogo } from "./OrbitLogo";

interface ReaderViewProps {
  fontSize: number;
  paperTheme: ReaderPaperTheme;
  onChangeFontSize: (size: number) => void;
  onChangePaperTheme: (theme: ReaderPaperTheme) => void;
  onCloseReader: () => void;
}

const PAPER_STYLES: Record<
  ReaderPaperTheme,
  { bg: string; surface: string; text: string; muted: string; border: string; label: string }
> = {
  white: {
    bg: "#FFFFFF",
    surface: "#F9FAFB",
    text: "#111827",
    muted: "#6B7280",
    border: "#E5E7EB",
    label: "White",
  },
  sepia: {
    bg: "#FAF5E8",
    surface: "#F3ECDA",
    text: "#2B2218",
    muted: "#6E5F4D",
    border: "#E3D8C1",
    label: "Sepia",
  },
  black: {
    bg: "#0B0B0D",
    surface: "#151519",
    text: "#E4E4E7",
    muted: "#9CA3AF",
    border: "#26262C",
    label: "Black",
  },
};

export const ReaderView: React.FC<ReaderViewProps> = ({
  fontSize,
  paperTheme,
  onChangeFontSize,
  onChangePaperTheme,
  onCloseReader,
}) => {
  const palette = PAPER_STYLES[paperTheme];

  const stepFont = (delta: number) => {
    const next = Math.min(22, Math.max(15, fontSize + delta));
    onChangeFontSize(next);
  };

  return (
    <div
      className="relative h-full w-full overflow-y-auto transition-colors"
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
      }}
    >
      {/* Floating Reader Appearance Controls */}
      <div className="sticky top-4 z-20 flex justify-end px-6 pointer-events-none">
        <div
          className="pointer-events-auto h-[38px] px-2.5 rounded-[8px] border flex items-center gap-2 shadow-sm"
          style={{
            backgroundColor: palette.surface,
            borderColor: palette.border,
          }}
        >
          <OrbitLogo size={16} />
          {/* Font Size Controls */}
          <div
            className="flex items-center gap-1 pr-2 border-r"
            style={{ borderColor: palette.border }}
          >
            <button
              type="button"
              onClick={() => stepFont(-1)}
              title="Decrease font size"
              className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:opacity-80"
              style={{ color: palette.text }}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="text-[11px] font-mono-ui w-9 text-center"
              style={{ color: palette.muted }}
            >
              {fontSize}px
            </span>
            <button
              type="button"
              onClick={() => stepFont(1)}
              title="Increase font size"
              className="w-6 h-6 rounded-[6px] flex items-center justify-center hover:opacity-80"
              style={{ color: palette.text }}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* White / Sepia / Black Paper Theme Pills */}
          <div
            className="flex items-center gap-1 pr-2 border-r"
            style={{ borderColor: palette.border }}
          >
            {(["white", "sepia", "black"] as ReaderPaperTheme[]).map((mode) => {
              const swatch = PAPER_STYLES[mode];
              const active = paperTheme === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChangePaperTheme(mode)}
                  className="h-[24px] px-2 rounded-[6px] text-[11px] font-medium flex items-center gap-1.5 border transition-all"
                  style={{
                    backgroundColor: swatch.bg,
                    color: swatch.text,
                    borderColor: active ? "#2563EB" : swatch.border,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full border"
                    style={{
                      backgroundColor: swatch.text,
                      borderColor: swatch.border,
                    }}
                  />
                  <span>{swatch.label}</span>
                </button>
              );
            })}
          </div>

          {/* Exit Reader View */}
          <button
            type="button"
            onClick={onCloseReader}
            title="Exit Distraction-Free Reader View"
            className="h-[24px] px-2 rounded-[6px] text-[11px] font-medium flex items-center gap-1 hover:opacity-80"
            style={{ color: palette.muted }}
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Centered 680px Distraction-Free Column */}
      <article className="w-full max-w-[680px] mx-auto px-6 pt-4 pb-20">
        <header className="pb-6 mb-7 border-b" style={{ borderColor: palette.border }}>
          <div
            className="flex items-center gap-2.5 text-[12px] mb-3"
            style={{ color: palette.muted }}
          >
            <span className="font-semibold uppercase tracking-[0.06em]">
              monograph.nordic-arch.org
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>7 min read</span>
            </span>
          </div>

          <h1 className="text-[32px] leading-[1.22] font-semibold tracking-[-0.022em]">
            Tectonic Silence: Low-Carbon Cast Concrete and High-Latitude Daylight
          </h1>

          <div className="mt-3 text-[13px]" style={{ color: palette.muted }}>
            By Astrid Lindqvist, MNAL · Nordic Architecture Monograph, Issue 19
          </div>
        </header>

        <figure className="mb-8">
          <img
            src={ARCH_PHOTOS.heroConcrete}
            alt="Minimalist concrete pavilion illuminated by Nordic daylight"
            className="w-full h-[320px] object-cover rounded-[8px] border"
            style={{ borderColor: palette.border }}
          />
          <figcaption className="mt-2 text-[12px]" style={{ color: palette.muted }}>
            South-west clerestory baffle in board-formed low-carbon concrete, Oslo Fjord Pavilion.
          </figcaption>
        </figure>

        <div className="space-y-5 leading-[1.8]" style={{ fontSize: `${fontSize}px` }}>
          <p>
            Above the fifty-ninth parallel, daylight is never neutral. In December, solar altitude
            barely clears six degrees at noon, skimming horizontally across water and stone before
            retreating into blue twilight. Architecture built for these latitudes succeeds not by
            maximizing glass area, but by choreographing how oblique rays decelerate across matte
            interior surfaces.
          </p>

          <p>
            When Portland clinker is substituted at forty-two percent with ground granulated
            blast-furnace slag, cured concrete shifts toward a warm pale limestone register. Cast
            against Douglas fir formwork without synthetic sealers, the wall diffuses low-angle
            glare into a quiet, shadowless luminance across reading tables.
          </p>

          <blockquote
            className="my-6 pl-4 py-1 border-l-2 italic"
            style={{
              borderColor: "#2563EB",
              color: palette.muted,
            }}
          >
            “Calmness in civic rooms—just as in software tools—emerges from what the designer
            refuses to add: no ornamental distraction, only structure, light, and clear proportion.”
          </blockquote>

          <p>
            Acoustic comfort reinforces optical stillness. Deep spruce ceiling coffers absorb
            mid-frequency speech energy while concealing low-velocity displacement ventilation.
            Visitors remain focused for hours without eye strain or cognitive fatigue, demonstrating
            that restraint remains the highest-performing technology in contemporary design.
          </p>
        </div>
      </article>
    </div>
  );
};
