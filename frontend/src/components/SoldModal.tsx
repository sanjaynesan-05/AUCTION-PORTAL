import React, { useEffect, useRef, useState } from "react";
import { Player, Team } from "../services/dataService";

interface SoldModalProps {
  isOpen: boolean;
  player: Player | null;
  team: Team | null;
  soldAmount: number; // in lakhs (as used originally) or numeric value you prefer
  onClose: () => void;
}

/* ---------------------------
   Team palettes (broadcast-grade)
   Keep this close to your source of truth or move it to a shared file.
   --------------------------- */
const teamPalettes: Record<number, {
  primary: string;
  secondary: string;
  accent: string;
  gradient1: string;
  gradient2: string;
  highlight: string;
  text: string;
  textSecondary: string;
}> = {
  1: { // CSK - Chennai Super Kings
    primary: '#F1C40F',
    secondary: '#1A2B59',
    accent: '#E67E22',
    gradient1: '#F7DC6F',
    gradient2: '#F4B41A',
    highlight: '#0A1635',
    text: '#000000',
    textSecondary: '#1A2B59'
  },
  2: { // MI - Mumbai Indians
    primary: '#004BA0',
    secondary: '#D1AB3E',
    accent: '#2E86C1',
    gradient1: '#003B75',
    gradient2: '#B38E1C',
    highlight: '#7FB3D5',
    text: '#FFFFFF',
    textSecondary: '#E8D9B0'
  },
  3: { // RCB - Royal Challengers Bengaluru
    primary: '#DA1F26',
    secondary: '#000000',
    accent: '#D4AF37',
    gradient1: '#A31621',
    gradient2: '#B9972C',
    highlight: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#FFE9B0'
  },
  4: { // KKR - Kolkata Knight Riders
    primary: '#3A225D',
    secondary: '#D4AF37',
    accent: '#5A3E85',
    gradient1: '#1C0934',
    gradient2: '#E5C87A',
    highlight: '#2A1842',
    text: '#FFFFFF',
    textSecondary: '#FFE680'
  },
  5: { // RR - Rajasthan Royals
    primary: '#EA1A8E',
    secondary: '#1B2C58',
    accent: '#C5A572',
    gradient1: '#F5A6D1',
    gradient2: '#F7C6E5',
    highlight: '#2F3F63',
    text: '#FFFFFF',
    textSecondary: '#FFE6F0'
  },
  6: { // SRH - Sunrisers Hyderabad
    primary: '#F26522',
    secondary: '#000000',
    accent: '#D7261E',
    gradient1: '#D35400',
    gradient2: '#FF8F00',
    highlight: '#1D1D1D',
    text: '#FFFFFF',
    textSecondary: '#FFD9B3'
  },
  7: { // DC - Delhi Capitals
    primary: '#17479E',
    secondary: '#D71920',
    accent: '#0A1D43',
    gradient1: '#5DADE2',
    gradient2: '#F03A35',
    highlight: '#1F3A63',
    text: '#FFFFFF',
    textSecondary: '#FFB3B3'
  },
  8: { // PBKS - Punjab Kings
    primary: '#D71920',
    secondary: '#D4AF37',
    accent: '#B7B7B7',
    gradient1: '#A0151A',
    gradient2: '#C89B2C',
    highlight: '#4A4A4A',
    text: '#FFFFFF',
    textSecondary: '#FFE680'
  },
  9: { // GT - Gujarat Titans
    primary: '#0A1A3F',
    secondary: '#D4AF37',
    accent: '#4DB5E3',
    gradient1: '#061024',
    gradient2: '#1F3D66',
    highlight: '#A9DDF7',
    text: '#FFFFFF',
    textSecondary: '#FFF8DC'
  },
  10: { // LSG - Lucknow Super Giants
    primary: '#00A7E1',
    secondary: '#F36F21',
    accent: '#7ED957',
    gradient1: '#007FA6',
    gradient2: '#FFB07A',
    highlight: '#A5E9FF',
    text: '#000000',
    textSecondary: '#333333'
  }
};

export default function SoldModal({
  isOpen,
  player,
  team,
  soldAmount,
  onClose,
}: SoldModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    } else {
      // keep mounted for exit animation
      const t = setTimeout(() => setMounted(false), 380);
      return () => clearTimeout(t);
    }
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;

  if (!player) {
    console.warn("SoldModal: Missing player data", { player, team, soldAmount });
    return null;
  }

  const teamId = (team as any)?.id || 1;
  const palette = teamPalettes[teamId] || teamPalettes[1];
  const displayTeam = team || {
    name: "Unknown Team",
    shortName: "UNK",
    logo: null,
  };

  const formattedAmount = (() => {
    if (typeof soldAmount === "number") {
      return `₹${Number(soldAmount).toLocaleString("en-IN")}L`;
    }
    return `${soldAmount}`;
  })();

  return (
    <div
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 60%)",
          backdropFilter: "blur(6px) saturate(110%)",
        }}
      />

      {/* Modal container */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-5xl mx-auto transform transition-all duration-450 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{
          filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.75))",
        }}
        aria-labelledby="sold-title"
      >
        {/* Inline style block for keyframes / svg filters */}
        <style>{`
          @keyframes shine-sweep {
            0% { transform: translateX(-120%) skewX(-10deg); opacity: 0; }
            40% { opacity: 0.65; }
            100% { transform: translateX(120%) skewX(-10deg); opacity: 0; }
          }
          @keyframes pulse-glow {
            0% { opacity: 0.6; transform: scale(0.98); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0.6; transform: scale(0.98); }
          }
          .shine-sweep {
            animation: shine-sweep 2.2s cubic-bezier(.2,.9,.2,1) 0s forwards;
            will-change: transform, opacity;
          }
          .breathing {
            animation: pulse-glow 2.6s ease-in-out infinite;
          }
        `}</style>

        {/* Card */}
        <div
          className="relative rounded-2xl overflow-hidden border-8"
          style={{
            borderColor: palette.secondary,
            background: `linear-gradient(180deg, ${palette.gradient1} 0%, ${palette.gradient2} 100%)`,
          }}
        >
          {/* Top glow strip */}
          <div
            style={{
              height: 6,
              background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent}, ${palette.secondary})`,
            }}
          />

          <div className="flex flex-col md:flex-row">
            {/* LEFT: Player Visual Panel */}
            <div
              className="w-full md:w-5/12 relative p-7 flex flex-col items-center justify-center gap-4"
              style={{
                background: palette.secondary,
                boxShadow: `inset 0 0 60px ${palette.highlight}22, inset 0 -30px 80px ${palette.accent}22`,
                borderRight: `8px solid ${palette.accent}`,
              }}
            >
              {/* Decorative rim/flare */}
              <svg
                className="absolute -left-16 -top-16 opacity-20 breathing"
                width="280"
                height="280"
                viewBox="0 0 280 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ mixBlendMode: "screen" }}
                aria-hidden
              >
                <defs>
                  <radialGradient id="g1" cx="0.5" cy="0.5">
                    <stop offset="0%" stopColor={palette.accent} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={palette.highlight} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="140" cy="140" r="120" fill="url(#g1)" />
              </svg>

              {/* Player image with premium frame */}
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  width: 240,
                  height: 300,
                  borderRadius: 18,
                  boxShadow: `0 30px 90px rgba(0,0,0,0.7), 0 6px 24px ${palette.accent}40`,
                  border: `6px solid ${palette.primary}`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.12), rgba(255,255,255,0.02))",
                    mixBlendMode: "overlay",
                  }}
                />
                <img
                  src={player.image || ""}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.onerror = null;
                    el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      player.name
                    )}&background=${palette.secondary.replace("#", "")}&color=${palette.text.replace(
                      "#",
                      ""
                    )}&size=480`;
                  }}
                  alt={player.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: "translateZ(0)",
                  }}
                />
                {/* Inner shine sweep */}
                <div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  aria-hidden
                >
                  <div
                    className="shine-sweep"
                    style={{
                      width: "30%",
                      height: "120%",
                      background:
                        "linear-gradient(120deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.0) 100%)",
                      transform: "translateX(-160%) skewX(-10deg)",
                    }}
                  />
                </div>
              </div>

              {/* Player meta */}
              <div className="text-center mt-1 w-full">
                <div
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: palette.textSecondary }}
                >
                  Auctioned Player
                </div>
                <h2
                  id="sold-title"
                  className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2"
                  style={{ color: palette.text, textShadow: "0 6px 26px rgba(0,0,0,0.5)" }}
                >
                  {player.name}
                </h2>
                <div
                  className="mt-2 text-sm font-medium"
                  style={{ color: palette.accent, opacity: 0.95 }}
                >
                  {(player as any).role || "All-Rounder"} • {(player as any).country || "Unknown"}
                </div>

                {/* Small stat row */}
                <div
                  className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold"
                  style={{ color: palette.textSecondary }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black" style={{ color: palette.primary }}>
                      {(player as any).age ?? "-"}
                    </span>
                    <span>Age</span>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black" style={{ color: palette.accent }}>
                      {(player as any).matches ?? "-"}
                    </span>
                    <span>Matches</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Amount & Team Panel */}
            <div
              className="w-full md:w-7/12 relative p-8 flex flex-col items-center justify-center gap-6"
              style={{
                background: `linear-gradient(180deg, ${palette.primary}E8 0%, ${palette.gradient1}C0 100%)`,
                borderLeft: `8px solid ${palette.accent}`,
              }}
            >
              {/* Floating Sold badge */}
              <div
                className="absolute -top-6 right-6 z-30 transform rotate-6"
                style={{
                  perspective: 800,
                }}
              >
                <div
                  className="px-6 py-2 rounded-lg font-black text-xl tracking-wider shadow-2xl transform translate-z-10"
                  style={{
                    background: "linear-gradient(180deg,#ff4b6e,#ff2d55)",
                    color: "#fff",
                    border: "2px solid rgba(255,255,255,0.12)",
                    boxShadow: "0 16px 40px rgba(255,45,85,0.22), inset 0 -4px 0 rgba(0,0,0,0.12)",
                    textShadow: "0 2px 12px rgba(0,0,0,0.45)",
                  }}
                >
                  SOLD ✓
                </div>
              </div>

              {/* Large amount */}
              <div className="text-center mt-4">
                <p
                  className="text-sm uppercase font-semibold tracking-widest mb-2"
                  style={{ color: palette.textSecondary }}
                >
                  Sold Amount
                </p>
                <div className="relative inline-block">
                  <div
                    className="text-7xl md:text-8xl font-extrabold"
                    style={{
                      color: palette.accent,
                      textShadow: `0 24px 40px rgba(0,0,0,0.55), 0 6px 20px ${hexToRgba(
                        palette.accent,
                        0.25
                      )}`,
                      lineHeight: 0.9,
                    }}
                  >
                    {formattedAmount}
                  </div>

                  {/* subtle underline glow */}
                  <div
                    style={{
                      height: 6,
                      width: "56%",
                      margin: "6px auto 0",
                      background: `linear-gradient(90deg, ${hexToRgba(
                        palette.accent,
                        0.0
                      )}, ${palette.accent}, ${hexToRgba(palette.accent, 0.0)})`,
                      borderRadius: 999,
                      boxShadow: `0 10px 30px ${hexToRgba(palette.accent, 0.18)}`,
                    }}
                  />
                </div>
              </div>

              {/* Team Card */}
              <div
                className="relative z-10 rounded-xl p-6 w-full max-w-sm text-center"
                style={{
                  background: hexToRgba(palette.secondary, 0.18),
                  border: `2px solid ${hexToRgba(palette.accent, 0.28)}`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: palette.textSecondary }}
                >
                  Sold To
                </p>

                {/* Team Logo */}
                <div className="flex justify-center mb-3">
                  {displayTeam.logo ? (
                    <img
                      src={displayTeam.logo}
                      alt={displayTeam.name}
                      className="w-20 h-20 object-contain rounded-full p-1"
                      style={{
                        background: hexToRgba(palette.primary, 0.06),
                        boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
                        border: `3px solid ${hexToRgba(palette.accent, 0.22)}`,
                      }}
                      onError={(e) => {
                        const el = e.currentTarget;
                        el.onerror = null;
                        el.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          displayTeam.name
                        )}&background=${palette.secondary.replace("#", "")}&color=${palette.accent.replace(
                          "#",
                          ""
                        )}&size=128`;
                      }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center font-black text-lg"
                      style={{
                        background: hexToRgba(palette.accent, 0.08),
                        color: palette.accent,
                        border: `2px solid ${hexToRgba(palette.primary, 0.14)}`,
                      }}
                    >
                      {String(displayTeam.shortName || "UNK").slice(0, 3).toUpperCase()}
                    </div>
                  )}
                </div>

                <div
                  className="font-extrabold text-xl"
                  style={{ color: palette.accent }}
                >
                  {displayTeam.name}
                </div>
                <div
                  className="text-sm font-semibold tracking-wider mt-1"
                  style={{ color: palette.textSecondary }}
                >
                  {displayTeam.shortName}
                </div>
              </div>

              {/* CTA / Close */}
              <div className="mt-6">
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition"
                  style={{
                    background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
                    color: palette.text,
                    boxShadow: `0 14px 40px ${hexToRgba(palette.accent, 0.18)}`,
                    border: `1px solid ${hexToRgba(palette.secondary, 0.18)}`,
                  }}
                >
                  Close
                </button>
              </div>

              {/* Decorative bottom glow */}
              <div
                className="absolute bottom-6 left-6 right-6 h-12 rounded-xl pointer-events-none"
                style={{
                  background: `radial-gradient(closest-side, ${hexToRgba(
                    palette.accent,
                    0.12
                  )}, transparent 55%)`,
                }}
              />
            </div>
          </div>

          {/* Optional subtle stadium floor reflection */}
          <div
            style={{
              height: 24,
              background: `linear-gradient(180deg, transparent, rgba(0,0,0,0.18))`,
            }}
          />
        </div>

        {/* Center vignette / particles (cheap particle look using SVG) */}
        <svg
          width="0"
          height="0"
          style={{ position: "absolute" }}
          aria-hidden
        >
          <defs>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

/* ---------------------------
   Helper: convert HEX to rgba
   --------------------------- */
function hexToRgba(hex: string, alpha = 1) {
  try {
    const h = hex.replace("#", "");
    const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return `rgba(0,0,0,${alpha})`;
  }
}
