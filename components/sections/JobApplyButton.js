"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import JobApplicationForm from "@/components/sections/JobApplicationForm";

// "Apply now" on a job poster: opens the application form (JobApplicationForm)
// over the page. `job` is the position's title, shown at the top and sent with
// the application.
//
// A native <dialog>: it traps focus, closes on Escape and sits above the page
// without any z-index juggling. A click on its dimmed backdrop closes it too.
export default function JobApplyButton({ job }) {
  const dialogRef = useRef(null);
  const uid = useId();
  // Bumped on every opening, so the form starts clean each time (the key remounts it).
  const [round, setRound] = useState(0);
  const position = job || "General application";

  // The page behind does not scroll while the form is open: locked in open(),
  // released whenever the dialog closes (Escape, backdrop, buttons) or unmounts.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const unlock = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", unlock);
    return () => {
      dialog.removeEventListener("close", unlock);
      unlock();
    };
  }, []);

  const open = () => {
    setRound((r) => r + 1);
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={open} className="btn-accent mt-auto">
        Apply now <ArrowUpRight size={16} aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-title`}
        onClick={(e) => e.target === dialogRef.current && close()}
        className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(34rem,calc(100vw-1.5rem))] overflow-y-auto rounded-3xl bg-white p-0 text-left shadow-[0_40px_80px_-30px_rgba(21,18,48,0.6)] backdrop:bg-brand-900/60 backdrop:backdrop-blur-[3px]"
      >
        <div className="relative bg-gradient-to-r from-brand-800 via-brand-700 to-[#4b2a8f] px-6 py-5 text-white sm:px-8">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X size={18} />
          </button>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-200">Apply for</p>
          <h2 id={`${uid}-title`} className="mt-1 pr-10 font-display text-xl font-bold leading-snug">
            {position}
          </h2>
        </div>
        <JobApplicationForm key={round} job={position} onClose={close} />
      </dialog>
    </>
  );
}
