import PageBanner from "@/components/ui/PageBanner";
import ExportReach from "@/components/home/ExportReach";
import CtaBanner from "@/components/home/CtaBanner";
import { getContentSections } from "@/lib/data";
import { withHomeDefaults } from "@/lib/homeContent";
import { withExportDefaults } from "@/lib/exportContent";
import { parseHeadedItems, parseDistributorItems } from "@/lib/contentFormat";

// Rendered per request: everything here comes from Admin > Website Content >
// Export (the banner and the regions), so edits show without a rebuild. The
// closing call to action is the homepage's.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Export",
  description: "The countries and regions where Provet's veterinary and aquaculture health products are distributed.",
};

export default async function ExportPage() {
  const [exportContent, homeContent] = await Promise.all([getContentSections("export"), getContentSections("home")]);
  const blocks = withExportDefaults(exportContent);
  const hero = blocks.find((b) => b.key === "hero");
  const regions = blocks.find((b) => b.key === "regions");
  const distributors = blocks.find((b) => b.key === "distributors");
  const countryCount = new Set(
    parseHeadedItems(regions.body).flatMap((r) => r.text.split(/[,;]/).map((c) => c.trim().toLowerCase()).filter(Boolean))
  ).size;
  const cta = withHomeDefaults(homeContent).find((b) => b.key === "cta");

  return (
    <>
      <PageBanner
        variant="immersive"
        eyebrow="Export"
        title={hero.title || "Animal Health, Delivered Worldwide"}
        description={hero.body || undefined}
        image={hero.image || undefined}
        chip={countryCount ? { value: String(countryCount), label: countryCount === 1 ? "country served" : "countries served" } : undefined}
      />
      {regions.isVisible !== false && (
        <ExportReach
          regions={parseHeadedItems(regions.body)}
          contacts={distributors.isVisible === false ? [] : parseDistributorItems(distributors.body)}
          title={regions.title || undefined}
        />
      )}
      {cta && cta.isVisible !== false && <CtaBanner title={cta.title || undefined} body={cta.body} />}
    </>
  );
}
