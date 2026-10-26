export default function GlassCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`relative bg-[rgba(18,24,36,0.55)] backdrop-blur-[20px] border border-white/[0.07] rounded-xl ${
        hover
          ? "transition-all duration-300 hover:border-primary-container/40 hover:shadow-[0_16px_48px_-8px_rgba(0,229,255,0.18)]"
          : ""
      } ${className}`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary-container/40 via-white/5 to-transparent" />
      {children}
    </div>
  );
}
