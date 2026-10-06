export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
    >
      {/* Top right subtle coral glow */}
      <div className="ambient-glow-coral -top-20 -right-20 animate-float-slow opacity-60" />

      {/* Middle left soft sage glow */}
      <div className="ambient-glow-sage top-1/3 -left-32 animate-float-reverse opacity-70" />

      {/* Bottom right gentle lavender glow */}
      <div className="ambient-glow-lavender bottom-10 right-10 animate-float-slow opacity-60" />
    </div>
  );
}
