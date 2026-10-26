import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-space-md px-margin text-center bg-surface-container-lowest">
      <span className="font-label-md text-label-md uppercase tracking-[0.22em] text-primary-fixed">
        Error 404 // Signal Lost
      </span>
      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary uppercase tracking-tighter">
        Frame Not Found
      </h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
        This transmission has been archived, re-cut, or never made it out of the
        editing bay.
      </p>
      <Link
        href="/"
        className="mt-space-sm bg-primary-container text-on-primary-fixed font-label-md text-label-md uppercase tracking-[0.18em] px-space-lg py-space-md rounded-none border-2 border-primary-container shadow-lg hover:bg-tertiary-fixed hover:border-tertiary-fixed hover:text-on-tertiary-fixed transition-all flex items-center gap-space-sm"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Campus Coverage
      </Link>
    </div>
  );
}
