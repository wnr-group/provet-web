// Seed script for local development / demos.
//
// NOTE: All copy below (category/product descriptions, about/home content
// blocks) is realistic-sounding PLACEHOLDER content written for this seed
// script because the real client content has not been provided yet. Swap it
// out via the admin panel (or by editing this file and re-seeding) once real
// copy is available.

require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const { PLATFORMS } = require("../lib/socialSchema");
const { DEFAULT_FEEDBACK_CONFIG, DEFAULT_FEEDBACK_FIELDS } = require("../lib/feedbackSchema");
// Real copy carried over from the old provet.in site - see the notes there.
const { menuPages } = require("./menuPages");

function slug(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Curated, verified Unsplash photo IDs (free license, no attribution
// required for CDN hotlinking) - grouped by what they depict so the mapping
// below stays legible. See img() for how a width/height gets applied.
const PHOTO = {
  labScientist: "1579165466949-3180a3d056d5",
  cattleField: "1589248529232-69c286cf2cb4",
  vetInjectingDog: "1770836037275-38b44e4b101f",
  vetExaminingDog: "1770836037289-e00e5f351d11",
  tabletsSpilled: "1758345680670-20a895a2dba3",
  dogAtVet: "1630438994394-3deff7a591bf",
  vialsAndIvBottle: "1576671081837-49000212a370",
  // Blank white pharma bottle, no readable label (not the earlier
  // "Afteravo Essentials AfterCoweed Gummy" bottle, a real branded human
  // supplement with its full product name printed on it).
  supplementBottle: "1664216294580-079bc527ae49",
  dogRunningBeach: "1530281700549-e82e7bf110d6",
  // Clear, unlabeled spray bottle (not the earlier bottle branded "ESSENTIAL"
  // with a visible logo).
  antisepticSpray: "1550572017-4b7a301b9d81",
  vetWithDachshund: "1770836037793-95bdbf190f71",
  labShelves: "1766297247072-93fd815afef3",
  poultryBarn: "1694854038360-56b29a16fb0c",
  hen: "1517419800355-7ea1a4b1f68d",
  roosterCloseUp: "1755777339174-bb10939126ce",
  fishFarmAerial: "1766744489655-328ec3d4f417",
  cattleGrazing: "1498191923457-88552caeccb3",
  goatsGrazing: "1622837699015-9a4cb8b7a94b",
  // Clean oral/liquid dose bottle, background bottles' labels illegible (not
  // the earlier photo, a real branded "blendarchive" product with its
  // tagline printed on it).
  oralMedicineBottle: "1635166304271-04931640a450",
  blisterPack: "1630094539386-280edfb5d46a",
  // Blank/unbranded label (not the earlier "Ela De Pure Gel Facial Cleanser"
  // tube, which had a competing brand's real, readable product name on it).
  gelTube: "1595387644458-363fe11c900e",
  clearSprayBottle: "1550572017-4b7a301b9d81",
};

function img(id, w = 600, h = 400) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;
}

const CATEGORY_PHOTO = {
  "Antibiotics & Anti-infectives": PHOTO.tabletsSpilled,
  "Anti-parasitics": PHOTO.dogAtVet,
  "Vaccines & Biologicals": PHOTO.vialsAndIvBottle,
  "Nutritional Supplements": PHOTO.supplementBottle,
  "Pain Management & Anti-inflammatories": PHOTO.dogRunningBeach,
  "Wound Care & Antiseptics": PHOTO.antisepticSpray,
};

const categoriesData = [
  {
    name: "Antibiotics & Anti-infectives",
    description:
      "Broad and narrow-spectrum antibacterial formulations for treating bacterial infections in companion and farm animals.",
    products: [
      {
        name: "Amoxiclav Vet 250mg Tablets",
        sku: "AMX-250-TAB",
        shortDescription: "Amoxicillin-clavulanate combination tablets for bacterial infections.",
        composition: "Amoxicillin trihydrate 200mg + Clavulanic acid 50mg per tablet.",
        uses:
          "Indicated for skin, soft tissue, respiratory and urinary tract infections caused by susceptible bacteria in dogs and cats.",
        dosage: "12.5mg/kg body weight twice daily, orally, for 5-7 days or as directed by a veterinarian.",
        applications: "Companion animals - dogs and cats.",
        specifications: { packSize: "10 x 10 tablets", form: "Tablet", storage: "Store below 25°C, protect from light" },
        packSize: "10 x 10 tablets",
        images: [img(PHOTO.tabletsSpilled), img(PHOTO.blisterPack)],
        isFeatured: true,
      },
      {
        name: "Oxytetracycline LA Injection",
        sku: "OXY-LA-100",
        shortDescription: "Long-acting oxytetracycline injection for livestock.",
        composition: "Oxytetracycline dihydrate 200mg/ml, long-acting formulation.",
        uses:
          "Treatment of respiratory infections, foot rot, pink eye and wound infections in cattle, sheep and goats.",
        dosage: "1ml per 10kg body weight, single intramuscular injection, repeat after 72 hours if needed.",
        applications: "Cattle, sheep, goats, swine.",
        specifications: { packSize: "100ml", form: "Injectable", storage: "Store below 25°C, do not freeze" },
        packSize: "100ml",
        images: [img(PHOTO.vialsAndIvBottle), img(PHOTO.cattleGrazing)],
        isFeatured: false,
      },
      {
        name: "Enrofloxacin 10% Oral Solution",
        sku: "ENR-10-OS",
        shortDescription: "Fluoroquinolone oral solution for poultry and swine.",
        composition: "Enrofloxacin 100mg/ml.",
        uses: "Control of colibacillosis, chronic respiratory disease and other bacterial infections in poultry.",
        dosage: "1ml per 4 litres of drinking water for 3-5 consecutive days.",
        applications: "Poultry, swine.",
        specifications: { packSize: "1 litre", form: "Oral solution", storage: "Store below 25°C, protect from light" },
        packSize: "1 litre",
        images: [img(PHOTO.oralMedicineBottle), img(PHOTO.poultryBarn)],
        isFeatured: false,
      },
      {
        name: "Ceftiofur Sterile Suspension",
        sku: "CEF-STR-50",
        shortDescription: "Third-generation cephalosporin injectable suspension.",
        composition: "Ceftiofur hydrochloride equivalent to 50mg ceftiofur/ml.",
        uses: "Treatment of bovine respiratory disease and foot rot associated with susceptible organisms.",
        dosage: "1ml per 50kg body weight, once daily by intramuscular injection for 3-5 days.",
        applications: "Cattle.",
        specifications: { packSize: "100ml", form: "Injectable suspension", storage: "Refrigerate 2-8°C" },
        packSize: "100ml",
        images: [img(PHOTO.vialsAndIvBottle), img(PHOTO.cattleGrazing)],
        isFeatured: false,
      },
    ],
  },
  {
    name: "Anti-parasitics",
    description:
      "Endo- and ecto-parasiticide solutions to control worms, ticks, fleas and mites across species.",
    products: [
      {
        name: "Ivermectin 1% Injection",
        sku: "IVM-1-INJ",
        shortDescription: "Broad-spectrum endectocide injection for livestock.",
        composition: "Ivermectin 10mg/ml.",
        uses: "Controls gastrointestinal roundworms, lungworms, mites, lice and ticks in cattle, sheep and pigs.",
        dosage: "1ml per 50kg body weight, single subcutaneous injection.",
        applications: "Cattle, sheep, pigs.",
        specifications: { packSize: "50ml", form: "Injectable", storage: "Store below 30°C" },
        packSize: "50ml",
        images: [img(PHOTO.vialsAndIvBottle), img(PHOTO.goatsGrazing)],
        isFeatured: true,
      },
      {
        name: "Fipronil Spot-On for Dogs",
        sku: "FIP-SPT-DOG",
        shortDescription: "Topical spot-on for flea and tick control in dogs.",
        composition: "Fipronil 10% w/v topical solution.",
        uses: "Kills fleas, ticks and chewing lice; provides protection for up to 4 weeks.",
        dosage: "One pipette per dog applied to the skin between the shoulder blades, once monthly.",
        applications: "Dogs.",
        specifications: { packSize: "3 x 1.34ml pipettes", form: "Spot-on", storage: "Store below 25°C" },
        packSize: "3 x 1.34ml pipettes",
        images: [img(PHOTO.dogAtVet)],
        isFeatured: true,
      },
      {
        name: "Albendazole 10% Suspension",
        sku: "ALB-10-SUS",
        shortDescription: "Broad-spectrum dewormer suspension for livestock.",
        composition: "Albendazole 100mg/ml.",
        uses: "Effective against roundworms, tapeworms, lungworms and liver flukes in cattle, sheep and goats.",
        dosage: "1ml per 10kg body weight, single oral dose; repeat as advised by veterinarian.",
        applications: "Cattle, sheep, goats.",
        specifications: { packSize: "1 litre", form: "Oral suspension", storage: "Shake well before use" },
        packSize: "1 litre",
        images: [img(PHOTO.oralMedicineBottle), img(PHOTO.goatsGrazing)],
        isFeatured: false,
      },
    ],
  },
  {
    name: "Vaccines & Biologicals",
    description:
      "Preventive vaccines and biological products supporting herd health and companion animal immunization programs.",
    products: [
      {
        name: "Canine Combo DHPPi Vaccine",
        sku: "VAC-DHPPI",
        shortDescription: "Multivalent vaccine for core canine diseases.",
        composition: "Modified live virus vaccine against Distemper, Hepatitis, Parainfluenza and Parvovirus.",
        uses: "Active immunization of healthy dogs against the four core canine viral diseases.",
        dosage: "1ml dose administered subcutaneously; primary course followed by annual boosters.",
        applications: "Dogs.",
        specifications: { packSize: "1 dose vial + diluent", form: "Lyophilized vaccine", storage: "Store 2-8°C, protect from light" },
        packSize: "1 dose vial + diluent",
        images: [img(PHOTO.vialsAndIvBottle), img(PHOTO.vetWithDachshund)],
        isFeatured: true,
      },
      {
        name: "FMD Trivalent Vaccine",
        sku: "VAC-FMD-TRI",
        shortDescription: "Inactivated trivalent vaccine against Foot-and-Mouth Disease.",
        composition: "Inactivated FMD virus antigens (serotypes O, A, Asia-1) with oil adjuvant.",
        uses: "Active immunization of cattle, buffalo, sheep and goats against Foot-and-Mouth Disease.",
        dosage: "2ml dose administered intramuscularly; revaccinate every 6 months.",
        applications: "Cattle, buffalo, sheep, goats.",
        specifications: { packSize: "50 dose vial", form: "Injectable emulsion", storage: "Store 2-8°C, do not freeze" },
        packSize: "50 dose vial",
        images: [img(PHOTO.vialsAndIvBottle), img(PHOTO.cattleGrazing)],
        isFeatured: false,
      },
      {
        name: "Feline Tricat Vaccine",
        sku: "VAC-TRICAT",
        shortDescription: "Trivalent vaccine for core feline diseases.",
        composition: "Modified live vaccine against Feline Panleukopenia, Rhinotracheitis and Calicivirus.",
        uses: "Active immunization of healthy cats against the three core feline viral diseases.",
        dosage: "1ml dose administered subcutaneously; primary course followed by annual boosters.",
        applications: "Cats.",
        specifications: { packSize: "1 dose vial + diluent", form: "Lyophilized vaccine", storage: "Store 2-8°C" },
        packSize: "1 dose vial + diluent",
        images: [img(PHOTO.vialsAndIvBottle)],
        isFeatured: false,
      },
    ],
  },
  {
    name: "Nutritional Supplements",
    description:
      "Vitamin, mineral and tonic formulations to support growth, fertility, immunity and general wellness.",
    products: [
      {
        name: "Multivitamin Booster Syrup",
        sku: "MVB-SYP-200",
        shortDescription: "Multivitamin liquid tonic for growth and recovery support.",
        composition: "Vitamins A, D3, E, B-complex with lysine and essential trace minerals.",
        uses: "Supports appetite, growth and recovery during and after illness or stress in pets and livestock.",
        dosage: "5-10ml per day orally, or as directed by a veterinarian, mixed with feed or water.",
        applications: "Dogs, cats, cattle, poultry.",
        specifications: { packSize: "200ml", form: "Oral liquid", storage: "Store below 25°C" },
        packSize: "200ml",
        images: [img(PHOTO.oralMedicineBottle), img(PHOTO.supplementBottle)],
        isFeatured: false,
      },
      {
        name: "Calcium & Phosphorus Bolus",
        sku: "CAP-BOL-10",
        shortDescription: "Mineral bolus supporting bone health and milk production.",
        composition: "Calcium 250g, Phosphorus 125g, Vitamin D3 and trace minerals per bolus pack.",
        uses: "Prevents and manages milk fever, downer cow syndrome and supports peak lactation performance.",
        dosage: "One bolus daily for 5 days around calving, or as directed by a veterinarian.",
        applications: "Dairy cattle, buffalo.",
        specifications: { packSize: "10 boluses", form: "Bolus", storage: "Store in a cool, dry place" },
        packSize: "10 boluses",
        images: [img(PHOTO.blisterPack), img(PHOTO.cattleGrazing)],
        isFeatured: true,
      },
      {
        name: "Liver Tonic Suspension",
        sku: "LIV-TON-200",
        shortDescription: "Hepatoprotective herbal-mineral tonic.",
        composition: "Silymarin, choline chloride, sorbitol and B-complex vitamins.",
        uses: "Supports liver function and appetite recovery in animals under metabolic stress.",
        dosage: "10-20ml orally once daily for 7-10 days.",
        applications: "Dogs, cats, cattle.",
        specifications: { packSize: "200ml", form: "Oral suspension", storage: "Store below 25°C, shake well" },
        packSize: "200ml",
        images: [img(PHOTO.oralMedicineBottle)],
        isFeatured: false,
      },
    ],
  },
  {
    name: "Pain Management & Anti-inflammatories",
    description:
      "NSAID and analgesic formulations to manage pain, fever and inflammation in a range of species.",
    products: [
      {
        name: "Meloxicam 0.5% Oral Suspension",
        sku: "MEL-05-OS",
        shortDescription: "NSAID suspension for pain and inflammation relief.",
        composition: "Meloxicam 1.5mg/ml oral suspension.",
        uses: "Relief of pain and inflammation in musculoskeletal disorders and post-operative pain in dogs and cats.",
        dosage: "0.2mg/kg on day one, then 0.1mg/kg once daily, orally, mixed with food.",
        applications: "Dogs, cats.",
        specifications: { packSize: "100ml", form: "Oral suspension", storage: "Store below 25°C" },
        packSize: "100ml",
        images: [img(PHOTO.oralMedicineBottle), img(PHOTO.dogRunningBeach)],
        isFeatured: true,
      },
      {
        name: "Flunixin Meglumine Injection",
        sku: "FLU-MEG-100",
        shortDescription: "Injectable NSAID for pain, fever and inflammation.",
        composition: "Flunixin meglumine equivalent to 50mg flunixin/ml.",
        uses: "Control of pyrexia and inflammation associated with respiratory disease and mastitis in cattle.",
        dosage: "2ml per 45kg body weight, once daily by intravenous or intramuscular injection, up to 3 days.",
        applications: "Cattle, horses.",
        specifications: { packSize: "100ml", form: "Injectable", storage: "Store below 25°C, protect from light" },
        packSize: "100ml",
        images: [img(PHOTO.vialsAndIvBottle), img(PHOTO.cattleGrazing)],
        isFeatured: false,
      },
      {
        name: "Diclofenac Gel for Animals",
        sku: "DIC-GEL-30",
        shortDescription: "Topical anti-inflammatory gel for localized pain relief.",
        composition: "Diclofenac diethylamine 1.16% w/w gel.",
        uses: "Local relief of pain and swelling associated with sprains, strains and joint inflammation.",
        dosage: "Apply a thin layer to the affected area 2-3 times daily.",
        applications: "Dogs, horses.",
        specifications: { packSize: "30g tube", form: "Topical gel", storage: "Store below 25°C" },
        packSize: "30g tube",
        images: [img(PHOTO.gelTube)],
        isFeatured: false,
      },
    ],
  },
  {
    name: "Wound Care & Antiseptics",
    description:
      "Topical antiseptic and wound-management products to clean, protect and support healing of wounds and skin conditions.",
    products: [
      {
        name: "Povidone-Iodine Antiseptic Solution",
        sku: "PVI-SOL-500",
        shortDescription: "Broad-spectrum antiseptic solution for wound cleaning.",
        composition: "Povidone-iodine 10% w/v solution.",
        uses: "Disinfection of wounds, cuts, abrasions and pre/post-surgical skin preparation.",
        dosage: "Apply topically to the affected area 1-2 times daily, diluted as required.",
        applications: "All species.",
        specifications: { packSize: "500ml", form: "Topical solution", storage: "Store below 25°C" },
        packSize: "500ml",
        images: [img(PHOTO.clearSprayBottle)],
        isFeatured: false,
      },
      {
        name: "Herbal Wound Healing Spray",
        sku: "HWS-SPR-100",
        shortDescription: "Fast-drying antiseptic spray with fly-repellent action.",
        composition: "Chlorhexidine gluconate, neem extract and herbal actives in an aerosol base.",
        uses: "Protects fresh wounds, cuts and post-surgical sites from infection and flies.",
        dosage: "Spray liberally on the affected area once or twice daily until healed.",
        applications: "Cattle, horses, dogs.",
        specifications: { packSize: "100ml aerosol", form: "Spray", storage: "Store below 25°C, away from flame" },
        packSize: "100ml aerosol",
        images: [img(PHOTO.antisepticSpray)],
        isFeatured: true,
      },
      {
        name: "Silver Sulfadiazine Cream",
        sku: "SSD-CRM-50",
        shortDescription: "Antimicrobial cream for burns and infected wounds.",
        composition: "Silver sulfadiazine 1% w/w cream.",
        uses: "Prevention and treatment of infection in burns, ulcers and chronic wounds.",
        dosage: "Apply a thin layer to cleaned wound area once or twice daily.",
        applications: "Dogs, cats, horses.",
        specifications: { packSize: "50g tube", form: "Cream", storage: "Store below 25°C" },
        packSize: "50g tube",
        images: [img(PHOTO.gelTube)],
        isFeatured: false,
      },
    ],
  },
];

const bannersData = [
  {
    title: "Complete Poultry Health Solutions",
    subtitle: "Antibiotics, vaccines and growth-support formulations trusted by poultry farms nationwide.",
    image: img(PHOTO.hen, 1920, 800),
    ctaText: "Explore Products",
    ctaLink: "/products",
    order: 0,
  },
  {
    title: "From Day-Old Chicks to Full Flock Health",
    subtitle: "Brooding support, growth formulations and biosecurity products for commercial poultry operations.",
    image: img(PHOTO.poultryBarn, 1920, 800),
    ctaText: "Explore Products",
    ctaLink: "/products",
    order: 1,
  },
  {
    title: "Trusted Veterinary Medicines, Backed by Science",
    subtitle: "Quality formulations for companion animals and livestock, from a partner you can rely on.",
    image: img(PHOTO.labScientist, 1920, 800),
    ctaText: "Explore Products",
    ctaLink: "/products",
    order: 2,
  },
  {
    title: "Comprehensive Anti-parasitic Range",
    subtitle: "Protecting herds and companion animals from ticks, worms and mites, season after season.",
    image: img(PHOTO.cattleField, 1920, 800),
    ctaText: "Explore Products",
    ctaLink: "/products",
    order: 3,
  },
  {
    title: "Vaccination Programs That Work",
    subtitle: "Biologicals designed for real-world herd health and companion animal immunization schedules.",
    image: img(PHOTO.vetInjectingDog, 1920, 800),
    ctaText: "Explore Products",
    ctaLink: "/products",
    order: 4,
  },
  {
    title: "Partnering with Veterinarians Nationwide",
    subtitle: "A growing catalogue built with input from practicing veterinarians and animal health experts.",
    image: img(PHOTO.vetExaminingDog, 1920, 800),
    ctaText: "Explore Products",
    ctaLink: "/products",
    order: 5,
  },
];

const homeContent = [
  {
    key: "mission",
    title: "Our Mission",
    body: "We are committed to making high-quality, affordable veterinary medicines accessible to clinics, farms and animal care professionals everywhere, backed by rigorous quality control and responsive support.",
    order: 0,
  },
  {
    key: "why-us",
    title: "Why Choose Us",
    body: "- Rigorously tested formulations manufactured to consistent quality standards\n- A broad catalogue spanning companion animal and livestock needs\n- Responsive technical and enquiry support for veterinarians and distributors\n- Reliable supply chain and packaging designed for field conditions",
    order: 1,
  },
  {
    key: "stats",
    title: "By the Numbers",
    body: "20+ years combined formulation experience - 100+ SKUs across 6 therapeutic categories - Supplying clinics and distributors across the region.",
    order: 2,
  },
  {
    // Carried over from the old Provet homepage, where the testimonials are
    // designed graphics rather than quotable text - the words are inside the
    // image. That is why there are no quotes or attributions here: they can't
    // be read out of a JPEG, and inventing them would put words in a real
    // customer's mouth. Each slide's caption is the product it refers to,
    // taken from the image's own filename, so the alt text says something.
    key: "testimonials",
    type: "carousel",
    title: "What Our Customers Say",
    order: 3,
    config: JSON.stringify({
      aspect: "square",
      autoplay: true,
      interval: 6000,
      items: [
        {
          image: "/content/Fepromix_Testimonials-1024x1024.jpg",
          title: "Fepromix",
        },
        {
          image: "/content/Final_Nagronex-SNB_Testimonial-1024x1024.jpg",
          title: "Nagronex-SNB",
        },
        {
          image: "/content/Testimonial_Galpromin-XL-1024x1024.jpg",
          title: "Galpromin-XL",
        },
        {
          image: "/content/Testimonial_Immulator-1024x1024.jpg",
          title: "Immulator",
        },
      ],
    }),
  },
];

const aboutContent = [
  {
    key: "story",
    title: "Our Story",
    body: "What began as a small veterinary formulation initiative has grown into a dedicated catalogue of medicines serving companion animal clinics and livestock farms alike. Our team combines pharmaceutical manufacturing experience with a genuine passion for animal health.",
    order: 0,
  },
  {
    key: "mission",
    title: "Our Mission",
    body: "To provide reliable, well-documented veterinary medicines that veterinarians can prescribe with confidence, supported by clear dosing information and responsive enquiry handling.",
    order: 1,
  },
  {
    key: "quality",
    title: "Quality Commitment",
    body: "Every formulation in our catalogue is developed with attention to composition accuracy, stability and ease of field use. We document dosage and storage guidance clearly so animal handlers and veterinarians can use our products safely.",
    order: 2,
  },
  {
    key: "team",
    title: "Our Team",
    body: "Our cross-functional team includes veterinary pharmacologists, quality assurance specialists and field support staff who work together to keep our catalogue relevant to real clinical and farm needs.",
    order: 3,
  },
];


async function main() {
  console.log("Seeding database...");
  const refreshed = { categories: 0, products: 0, banners: 0 };

  // --- Admin user -----------------------------------------------------
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@provet.in" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@provet.in",
      passwordHash,
      role: "admin",
    },
  });
  console.log("Created admin user: admin@provet.in / Admin@123");

  // --- Categories + products -------------------------------------------
  //
  // Rows are upserted with `update: {}` so a reseed never overwrites copy an
  // admin has edited. That also meant image changes made in this file never
  // reached a database seeded before them: the rows already existed, so the
  // new URLs were skipped and the old picsum.photos placeholders stayed put.
  //
  // refreshImage() closes that gap without reintroducing the clobbering: it
  // replaces an image only while it is still one of those placeholders. An
  // admin-uploaded picture, or one already matching this file, is left alone.
  const isPlaceholder = (value) => typeof value === "string" && value.includes("picsum.photos");
  const featuredSlugs = [];

  for (const catData of categoriesData) {
    const catSlug = slug(catData.name);
    const category = await prisma.category.upsert({
      where: { slug: catSlug },
      update: {},
      create: {
        name: catData.name,
        slug: catSlug,
        description: catData.description,
        image: img(CATEGORY_PHOTO[catData.name]),
      },
    });

    if (isPlaceholder(category.image)) {
      await prisma.category.update({
        where: { id: category.id },
        data: { image: img(CATEGORY_PHOTO[catData.name]) },
      });
      refreshed.categories += 1;
    }

    for (const p of catData.products) {
      const pSlug = slug(p.name);
      const product = await prisma.product.upsert({
        where: { slug: pSlug },
        update: {},
        create: {
          name: p.name,
          slug: pSlug,
          sku: p.sku,
          categoryId: category.id,
          shortDescription: p.shortDescription,
          composition: p.composition,
          uses: p.uses,
          dosage: p.dosage,
          applications: p.applications,
          specifications: JSON.stringify(p.specifications),
          images: JSON.stringify(p.images),
          packSize: p.packSize,
          isFeatured: !!p.isFeatured,
          isActive: true,
        },
      });
      // `images` is a JSON-encoded array; one stale entry means the whole
      // set predates the current photo list, so it is replaced wholesale.
      if ((JSON.parse(product.images || "[]") || []).some(isPlaceholder)) {
        await prisma.product.update({
          where: { id: product.id },
          data: { images: JSON.stringify(p.images) },
        });
        refreshed.products += 1;
      }

      if (p.isFeatured) featuredSlugs.push(product.slug);
    }

    console.log(`Seeded category "${catData.name}" (${catData.products.length} products)`);
  }

  // --- Banners ----------------------------------------------------------
  for (const banner of bannersData) {
    const existing = await prisma.banner.findFirst({ where: { title: banner.title } });
    if (!existing) {
      await prisma.banner.create({ data: banner });
    } else if (isPlaceholder(existing.image)) {
      await prisma.banner.update({ where: { id: existing.id }, data: { image: banner.image } });
      refreshed.banners += 1;
    }
  }
  console.log(`Seeded ${bannersData.length} banners`);

  // --- Content blocks -----------------------------------------------------
  for (const section of homeContent) {
    await prisma.contentBlock.upsert({
      where: { page_key: { page: "home", key: section.key } },
      update: {},
      create: { page: "home", ...section },
    });
  }
  for (const section of aboutContent) {
    await prisma.contentBlock.upsert({
      where: { page_key: { page: "about", key: section.key } },
      update: {},
      create: { page: "about", ...section },
    });
  }
  console.log("Seeded content blocks for pages: home, about");

  // --- Menu pages -----------------------------------------------------------
  // One row per entry in lib/navigation.js, so every menu item resolves to a
  // real page the moment the site boots instead of a 404. Deliberately thin:
  // a title, an intro and one starter section each. The copy is placeholder
  // scaffolding for the admin to replace - nothing here claims to be Provet's
  // actual editorial content, and `update: {}` means a reseed never
  // overwrites what an admin has since written.
  for (const page of menuPages) {
    await prisma.page.upsert({
      where: { key: page.key },
      update: {},
      create: {
        key: page.key,
        title: page.title,
        description: page.description,
        heroImage: page.heroImage ?? null,
      },
    });
    for (const [index, section] of page.sections.entries()) {
      await prisma.contentBlock.upsert({
        where: { page_key: { page: page.key, key: section.key } },
        update: {},
        create: {
          page: page.key,
          order: index,
          ...section,
          config: section.config ? JSON.stringify(section.config) : null,
        },
      });
    }
  }
  console.log(`Seeded ${menuPages.length} menu pages`);

  // --- Social media links ---------------------------------------------------
  // Seeded as empty and disabled on purpose: Provet's real profile URLs aren't
  // known here, and inventing them would put dead links on every public page.
  // The rows exist so the admin screen has a stable, ordered list to fill in;
  // `update: {}` keeps any URL an admin has already configured.
  for (const [index, platform] of PLATFORMS.entries()) {
    await prisma.socialLink.upsert({
      where: { platform: platform.key },
      update: {},
      create: { platform: platform.key, url: null, isActive: false, order: index },
    });
  }
  console.log(`Seeded ${PLATFORMS.length} social link placeholders (all disabled - add URLs in Admin > Social Media)`);

  // --- Feedback form settings -----------------------------------------------
  // `update: {}` so re-seeding never clobbers settings an admin has changed.
  await prisma.feedbackSetting.upsert({
    where: { key: "default" },
    update: {},
    create: { key: "default", ...DEFAULT_FEEDBACK_CONFIG },
  });
  for (const field of DEFAULT_FEEDBACK_FIELDS) {
    await prisma.feedbackField.upsert({ where: { key: field.key }, update: {}, create: field });
  }
  console.log(`Seeded feedback form settings and ${DEFAULT_FEEDBACK_FIELDS.length} built-in fields`);

  // --- Sample enquiries -----------------------------------------------------
  const sampleProduct = await prisma.product.findFirst({ where: { slug: featuredSlugs[0] } });
  const existingEnquiries = await prisma.enquiry.count();
  if (existingEnquiries === 0) {
    await prisma.enquiry.createMany({
      data: [
        {
          name: "Dr. Ravi Kumar",
          email: "ravi.kumar@example-clinic.com",
          phone: "+91-9876543210",
          subject: "Bulk pricing for Meloxicam suspension",
          message: "We run a 3-vet clinic and would like bulk pricing for the Meloxicam 0.5% suspension.",
          productId: sampleProduct ? sampleProduct.id : null,
          status: "new",
        },
        {
          name: "Green Valley Farms",
          email: "procurement@greenvalleyfarms.example",
          phone: "+91-9123456780",
          subject: "FMD vaccine availability",
          message: "Please share availability and lead time for the FMD Trivalent Vaccine for a 200-head herd.",
          status: "read",
        },
        {
          name: "Dr. Anita Sharma",
          email: "anita.sharma@petcarehospital.example",
          subject: "General product catalogue request",
          message: "Could you send over your full product catalogue and MSDS sheets for our records?",
          status: "resolved",
        },
      ],
    });
    console.log("Seeded 3 sample enquiries");
  }

  const totalRefreshed = refreshed.categories + refreshed.products + refreshed.banners;
  if (totalRefreshed) {
    console.log(
      `Refreshed placeholder images on ${refreshed.categories} categories, ` +
        `${refreshed.products} products, ${refreshed.banners} banners`
    );
  }

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
