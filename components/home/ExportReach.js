import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import ExportMap from "@/components/home/ExportMap";
import { buildExportMap } from "@/lib/worldMap";
import { countryKey } from "@/lib/countries";

// The "export" Website Content block: the regions and countries Provet
// distributes to, drawn as a world map. Each row of the block is "Region:
// Country, Country, ..." (see lib/homeContent.js). The headline figures are
// counted from the rows, so the admin never has to keep a total in step with
// the lists.
function countries(text) {
  return String(text || "")
    .split(/[,;]/)
    .map((c) => c.trim())
    .filter(Boolean);
}

// `contacts` is [{ heading: country, name, address, phone, email }] from the
// "distributors" block; a country with one (and something in it) becomes
// clickable on the map section.
export default function ExportReach({ regions, contacts = [], title = "Exporting Across the Globe" }) {
  const rows = (regions || [])
    .map((r) => ({ name: r.heading, countries: countries(r.text) }))
    .filter((r) => r.name && r.countries.length);
  if (!rows.length) return null;

  const total = new Set(rows.flatMap((r) => r.countries.map((c) => c.toLowerCase()))).size;
  const { outlines, dots } = buildExportMap(rows);

  const contactOf = new Map(
    contacts.filter((c) => c.name || c.address || c.phone || c.email).map((c) => [countryKey(c.heading), c])
  );
  const view = rows.map((r) => ({
    name: r.name,
    countries: r.countries.map((name) => {
      const key = countryKey(name);
      return { name, key, contact: contactOf.get(key) || null };
    }),
  }));

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 sm:py-20">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            animated
            align="center"
            eyebrow="International Coverage"
            title={title}
            description={`${total} ${total === 1 ? "country" : "countries"} across ${rows.length} ${rows.length === 1 ? "region" : "regions"} trust Provet for animal health.`}
          />
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-6xl">
          <ExportMap outlines={outlines} dots={dots} regions={view} />
        </Reveal>
      </div>
    </section>
  );
}
