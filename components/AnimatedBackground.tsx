export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[length:92px_92px] opacity-[0.035]" />
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-crimson/10 blur-[140px]" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-ice/10 blur-[140px]" />
    </div>
  );
}
