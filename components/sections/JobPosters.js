import { Maximize2 } from "lucide-react";
import JobApplyButton from "@/components/sections/JobApplyButton";
import JobApplicationForm from "@/components/sections/JobApplicationForm";
import Pic from "@/components/ui/Pic";
import { Enter, EnterGroup, EnterItem } from "@/components/sections/entrances";

// The Careers page's openings: each job is a poster the admin uploads
// (Admin > Website Content > Careers > an Image cards section set to "Job
// posters"). The poster is shown whole at its own proportions - never cropped,
// since its lettering runs to the edges - as a framed print with a soft shadow.
// Hovering lifts it and offers "View full poster"; clicking opens it full size
// in a new tab so the small print can be read. Under it sit the job title, an
// optional line of details and an "Apply now" button, which opens an application
// form (JobApplyButton) whose answers are emailed to HR.
//
// Posters keep a fixed, modest size (20rem wide) and as many as fit sit on one
// row, centred - so a wide screen is filled with more posters, never with bigger
// ones. On wide screens the row reaches out past the page column into the side
// margins; the admin's "Posters per row" (4 by default) caps how many share a
// row. One or two posters simply stay centred at the same size.
//
// `items` are the section's cards: { image, title, text }. A card with
// no image is skipped - a job here is its poster.
//
// The section always ends with VacancyEnquiry, a form for asking about any
// vacancy - so the Careers page has a way in whether or not a job is posted.
// With no poster at all (none posted, or every one taken down) the form stands
// alone, under a "No openings right now" heading; it does not depend on the
// section having a title or text.
const POSTER_REM = 20;
const GAP_REM = 2.5;

export default function JobPosters({ section, items }) {
  const posters = items.filter((it) => it.image);
  if (!posters.length) return <VacancyEnquiry hasJobs={false} />;
  const perRow = section.config.columns || 4;
  // The widest the row may be: that many posters and the gaps between them.
  const maxWidth = `${perRow * POSTER_REM + (perRow - 1) * GAP_REM}rem`;

  return (
    <div>
      <Enter preset="drop">
        <Heading title={section.title} description={section.body} />
      </Enter>
      <div className="lg:-mx-6 xl:-mx-12 2xl:-mx-24">
      <div className="mx-auto" style={{ maxWidth }}>
      <EnterGroup className="flex flex-wrap justify-center gap-x-8 gap-y-12 lg:gap-x-10" stagger={0.1}>
        {posters.map((job, i) => (
          <EnterItem key={i} preset="spring" className="w-full max-w-[20rem]">
            <article className="group flex h-full flex-col">
              <a
                href={job.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View the ${job.title || "job"} poster full size`}
                className="relative block overflow-hidden rounded-2xl bg-white shadow-[0_24px_44px_-22px_rgba(32,27,75,0.55)] ring-1 ring-brand-900/10 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_34px_56px_-24px_rgba(32,27,75,0.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <Pic
                  src={job.image}
                  alt={job.title ? `${job.title} - job poster` : "Job poster"}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                  className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-brand-900/70 to-transparent px-4 pb-4 pt-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100"
                >
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-800 shadow-soft">
                    <Maximize2 size={13} /> View full poster
                  </span>
                </span>
              </a>

              <div className="mt-5 flex flex-1 flex-col items-center gap-2 px-1 text-center">
                {job.title && <h3 className="font-display text-lg font-bold leading-snug text-ink">{job.title}</h3>}
                {job.text && <p className="text-sm leading-relaxed text-ink-soft">{job.text}</p>}
                <JobApplyButton job={job.title} />
              </div>
            </article>
          </EnterItem>
        ))}
      </EnterGroup>
      </div>
      </div>
      <div className="mt-16 sm:mt-20">
        <VacancyEnquiry hasJobs />
      </div>
    </div>
  );
}

function Heading({ title, description }) {
  if (!title && !description) return null;
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {title && <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h2>}
      {title && <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-12 rounded-full bg-accent-500" />}
      {description && <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">{description}</p>}
    </div>
  );
}

// A form to ask about vacancies - the same details and resume as the "Apply now"
// form, sent to the same HR address. Under the posters it is for the role that is
// not among them; with no posters it explains that nothing is open right now.
function VacancyEnquiry({ hasJobs }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Enter preset="drop">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {hasJobs ? "Don't see the right role?" : "No openings right now"}
          </h2>
          <span aria-hidden="true" className="mx-auto mt-3 block h-1 w-12 rounded-full bg-accent-500" />
          <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            {hasJobs
              ? "Ask us about any vacancy, or leave your details and your resume, and we will get in touch when a suitable role opens."
              : "We have no jobs posted at the moment. Ask us about any vacancy, or leave your details and we will get in touch when a suitable role opens."}
          </p>
        </div>
      </Enter>
      <Enter preset="spring">
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-brand-100/70">
          <div className="h-1.5 bg-gradient-to-r from-accent-500 to-brand-600" aria-hidden="true" />
          <JobApplicationForm enquiry className="px-5 py-6 sm:px-8 sm:py-8" />
        </div>
      </Enter>
    </div>
  );
}
