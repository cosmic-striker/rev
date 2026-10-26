export default function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-label-md text-label-md uppercase tracking-[0.18em] text-primary ${className}`}
    >
      {children}
    </span>
  );
}
