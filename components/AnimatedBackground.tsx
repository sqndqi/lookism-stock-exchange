export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_6%,rgba(239,35,60,.16),transparent_25%),radial-gradient(circle_at_78%_12%,rgba(138,180,248,.12),transparent_28%),linear-gradient(180deg,#030407_0%,#06080d_45%,#030407_100%)]" />
      <div className="absolute inset-0 bg-grid bg-[length:84px_84px] opacity-[0.09]" />
      <div className="absolute inset-0 bg-scanline opacity-[0.075]" />
      <div className="absolute left-[-10%] top-1/4 h-px w-[120%] -rotate-6 bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-64 w-full bg-[radial-gradient(ellipse_at_bottom,rgba(245,184,75,.08),transparent_62%)]" />
      <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(circle_at_center,white_0.5px,transparent_0.5px)] [background-size:5px_5px]" />
    </div>
  );
}
