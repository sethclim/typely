import { useState } from "react";

type ResumeStyle = "engineering" | "sales" | "design";

export default function ResumeStylePicker({
  onSelect,
}: {
  onSelect?: (style: ResumeStyle) => void;
}) {
  const [selected, setSelected] = useState<ResumeStyle | null>(null);

  const pick = (style: ResumeStyle) => {
    setSelected(style);
    onSelect?.(style);
  };

  const baseCard =
    "relative cursor-pointer rounded-2xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl";

  const selectedRing =
    "ring-2 ring-purple-500 bg-white/20 scale-[1.02]";

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Choose your resume style
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Engineering */}
        <div
          onClick={() => pick("engineering")}
          className={`${baseCard} ${
            selected === "engineering" ? selectedRing : ""
          }`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/20 to-indigo-500/10 pointer-events-none" />

          <h3 className="text-xl font-semibold text-white mb-2">
            Engineering
          </h3>
          <p className="text-sm text-white/70">
            Clean, structured, technical-forward layout. Perfect for software,
            data, and systems roles.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>• Dense skill sections</li>
            <li>• Minimal color</li>
            <li>• Emphasis on projects & tooling</li>
          </ul>
        </div>

        {/* Sales */}
        <div
          onClick={() => pick("sales")}
          className={`${baseCard} ${
            selected === "sales" ? selectedRing : ""
          }`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-400/10 pointer-events-none" />

          <h3 className="text-xl font-semibold text-white mb-2">
            Sales
          </h3>
          <p className="text-sm text-white/70">
            Bold, outcome-driven layout highlighting revenue, metrics, and wins.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>• KPI-first sections</li>
            <li>• Strong callouts</li>
            <li>• Achievement-heavy bullets</li>
          </ul>
        </div>

        {/* Design */}
        <div
          onClick={() => pick("design")}
          className={`${baseCard} ${
            selected === "design" ? selectedRing : ""
          }`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-400/10 pointer-events-none" />

          <h3 className="text-xl font-semibold text-white mb-2">
            Design
          </h3>
          <p className="text-sm text-white/70">
            Visual-first layout with creative spacing and typography emphasis.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>• Strong typography</li>
            <li>• Portfolio-ready spacing</li>
            <li>• Brand-focused layout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
