import clsx from "clsx";
import { MapPin, Phone, User } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// The address cards behind the `locations` section type. Shared by the contact
// page's branch list and by any managed page an admin adds a Locations section
// to, so a branch looks the same wherever it is listed.
export default function LocationCards({ items, columns = 3 }) {
  const locations = (items || []).filter((item) => item?.title || item?.address);
  if (!locations.length) return null;

  return (
    <RevealGroup
      className={clsx(
        "grid gap-5 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4"
      )}
      stagger={0.08}
    >
      {locations.map((item, i) => (
        <RevealItem key={`${item.title}-${i}`} className="h-full">
          <div className="card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                <MapPin size={18} />
              </span>
              <div className="min-w-0">
                {item.title && <h3 className="font-display font-semibold text-ink">{item.title}</h3>}
                {item.subtitle && <p className="text-xs text-ink-soft">{item.subtitle}</p>}
              </div>
            </div>
            {item.address && (
              <address className="mt-4 whitespace-pre-line text-sm not-italic leading-relaxed text-ink-soft">
                {item.address}
              </address>
            )}
            {(item.contact || item.phone) && (
              <div className="mt-auto space-y-1.5 border-t border-brand-100 pt-4 text-sm">
                {item.contact && (
                  <p className="flex items-center gap-2 text-ink">
                    <User size={14} className="shrink-0 text-accent-600" /> {item.contact}
                  </p>
                )}
                {item.phone && (
                  <a
                    href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-2 font-medium text-brand-700 hover:text-accent-600"
                  >
                    <Phone size={14} className="shrink-0 text-accent-600" /> {item.phone}
                  </a>
                )}
              </div>
            )}
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
