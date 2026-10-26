import Link from "next/link";

type Variant = "primary" | "glass" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary-container text-on-primary-fixed hover:shadow-[0_0_24px_rgba(0,229,255,0.45)] hover:-translate-y-0.5",
  glass:
    "bg-white/[0.04] border border-white/15 text-on-surface hover:border-primary-container hover:text-primary",
  outline:
    "border border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary",
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  icon,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  icon?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-space-sm font-label-md text-label-md uppercase tracking-[0.18em] px-space-lg py-space-md rounded-lg transition-all duration-200 ${styles[variant]} ${className}`}
    >
      {children}
      {icon && <span className="material-symbols-outlined text-body-sm">{icon}</span>}
    </Link>
  );
}
