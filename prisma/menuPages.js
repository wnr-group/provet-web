// Content for the pages behind the fixed menu (see lib/navigation.js),
// carried over from the old Provet site at provet.in.
//
// It is kept in its own module rather than inline in seed.js because it is
// real editorial copy rather than demo data: it is the client's own wording,
// and it is the one part of the seed that a content person may want to read
// or amend without scrolling past 500 lines of sample products.
//
// Three deliberate omissions from the old pages:
//
//   * The "let's make something together / Give us a call or drop by
//     anytime" block, and the contact details beside it (a Collins Street,
//     Victoria address, info@domain.com, "+ (066) 0760 0260"). Those are the
//     old site's unreplaced theme boilerplate, not Provet's details, and
//     importing them would put a wrong address and dead mailbox on the new
//     site. The real contact details already live on /contact.
//   * The Avinova / Blunova "learn more" links. Those brands are a tier of
//     the old site's catalogue that this database has no equivalent for, so
//     the copy that mentions them is kept while the dead links are not.
//   * PDF attachments (booklet, magazine and trial-report downloads). There
//     is no resource model to hang a file on yet, so the titles are listed
//     and the files are not invented.
//
// Everything else is the old site's wording as published.

// Images are served from this repo, under public/content, not hotlinked from
// provet.in. They were originally referenced at their old WordPress URLs,
// which made every picture on the new site depend on the old one staying
// online - the moment provet.in went away or reorganised its uploads folder,
// they would all have broken. They are the client's own images, so they are
// committed here and the old site is now only their provenance.
//
// public/uploads is deliberately NOT used: it is gitignored (runtime admin
// uploads), so files there would be missing from a fresh clone or a deploy.

// Page banners. The old site had no hero image on any of these pages, so
// these are curated Unsplash photos from the same set seed.js already uses
// for categories and products - placeholders chosen to suit each page, not
// Provet photography. Replace them in Admin > Website Content > Hero image.
const hero = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&h=600&q=80`;

const menuPages = [
  {
    key: "about/who-we-are",
    title: "Who We Are",
    heroImage: hero("1770836037793-95bdbf190f71"),
    description: "Provet is a solution-oriented provider of animal healthcare innovations.",
    sections: [
      {
        key: "intro",
        type: "richText",
        title: "Who We Are",
        body: [
          "Provet is a solution-oriented provider of animal healthcare innovations.",
          "We love what we do and we do it with passion. We value the experimentation, and the smart incentives.",
        ].join("\n\n"),
      },
      {
        key: "reach",
        type: "cards",
        title: "Our Reach",
        body: [
          "Establishment: In the last fifteen years, we have established our presence in India, with growing penetration in the emerging markets of Egypt, Vietnam, Saudi Arabia, Peru, Bangladesh, Sri Lanka, and Nepal.",
          "Customers partnership: We have partnered with 100s of customers in the poultry and aquaculture space, helping them achieve optimal health and performance of their produce. We bring in our years of expertise and experience in these sectors to develop innovative products that help farmers achieve high performance.",
          "Solutions: Our expertise, quality conscience, innovative formulations, and differentiators improve our customers' productivity and performance. We bundle all of our solutions with convenient technical services and support, ensuring peace of mind for the farmers and resulting in high quality and production yield.",
        ].join("\n"),
        config: { columns: 3 },
      },
      {
        key: "differentiators",
        type: "list",
        title: "What Sets Us Apart",
        body: ["Quality Conscience", "Innovative Formulations", "Convenient Technical Services and Support"].join("\n"),
      },
      {
        key: "vision-mission",
        type: "cards",
        title: "Vision & Mission",
        body: [
          "Vision: To be Recognized as a Complete Solution Provider Offering Affordable, Innovative & Research Based Solutions for Healthcare & Nutrition to the Veterinary Farming Fraternity Globally.",
          "Mission: To be One Amongst the Most Innovative and the Most Admired Global Companies in the Animal Health Care and Nutrition Business with the Best Industry Practices and Ethics.",
        ].join("\n"),
        config: { columns: 2 },
      },
      {
        key: "management-team",
        type: "imageCards",
        title: "Management Team",
        config: {
          columns: 2,
          // The portraits are 300x300; shown full-width they were oversized
          // and visibly upscaled, so they render as circular avatars above
          // the text instead.
          imageStyle: "avatar",
          items: [
            {
              image: "/content/provet-team-1-01-300x300.png",
              title: "Dr. Muthu Selvan, Managing Director",
              text: "Over 30 years in animal health - Venky's, Hoechst, Intervet (MSD) and Ranbaxy (Animal Health). Co-founded Provet in 2009 and is responsible for the overall profitability and growth of the organization. BVSc, Madras Veterinary College.",
            },
            {
              image: "/content/provet-team-2-01-300x300.png",
              title: "Dr. S. Senthil, Director",
              text: "Over 30 years in animal health - Venkateshwara Hatcheries Ltd., Dabur Ayurvet and Vamso Biotec. Co-founded Provet in 2009 and is responsible for operations. BVSc, Madras Veterinary College.",
            },
          ],
        },
      },
      {
        key: "management-team-detail",
        type: "cards",
        title: "In Their Own Words",
        isVisible: false,
        // The full biographies as published, kept but hidden: the cards above
        // carry a trimmed version that fits beside a portrait. Switch the eye
        // icon in the admin to show these instead.
        body: [
          "Dr. Muthu Selvan, Managing Director: With over 30 years of experience in the animal health industry, Dr. Muthu has held key roles in sales, marketing, and technical services at leading companies such as Venky's, Hoechst, Intervet (MSD), and Ranbaxy (Animal Health). These roles equipped Dr. Muthu with a comprehensive understanding of the industry, laying the foundation for his entrepreneurial journey. Dr. Muthu founded Provet in 2009, and since its inception, Provet has been dedicated to advancing animal health through innovative solutions and services. Dr. Muthu currently functions as the Managing Director of Provet, and he is responsible for the overall profitability and growth of the organization. Dr. Muthu has a Bachelor's degree in Veterinary Science (BVSc) from Madras Veterinary College.",
          "Dr. S. Senthil, Director: With over 30 years of experience in the animal health industry, Dr. Senthil has served in various sales and technical services roles at esteemed organizations, including Venkateshwara Hatcheries Ltd., Dabur Ayurvet, and Vamso Biotec. This diverse experience provided Dr. Senthil with deep insights into the industry and honed his expertise in managing complex business operations. Leveraging this rich experience, Dr. Senthil founded Provet along with Dr. Muthu in 2009. Since then, Provet has been at the forefront of delivering innovative animal health solutions, consistently driving excellence and growth in the field. Dr. Senthil currently functions as the Director of Provet, and he is responsible for the operations at Provet. Dr. Senthil has a Bachelor's degree in Veterinary Science (BVSc) from Madras Veterinary College.",
        ].join("\n"),
        config: { columns: 2 },
      },
      {
        key: "cta",
        type: "cta",
        title: "Committed to Animal Well-Being",
        body: "Get in touch with us.",
        config: { buttons: [{ label: "Contact Us", href: "/contact", style: "accent" }] },
      },
    ],
  },

  {
    key: "about/core-values",
    title: "Core Values",
    heroImage: hero("1498191923457-88552caeccb3"),
    description:
      "By living our core values, we prove ourselves as Provet's best employees and demonstrate our finest human qualities, which help us grow and maintain harmony in the workplace.",
    sections: [
      {
        key: "intro",
        type: "richText",
        title: "Living Our Core Values",
        body: "By living our core values, we prove ourselves as Provet's best employees and demonstrate our finest human qualities, which help us grow and maintain harmony in the workplace.",
      },
      {
        key: "values",
        // Numbered rows rather than a card grid: the other About pages already
        // use cards, and five one-line values read better as a list than as
        // five boxes.
        type: "numberedRows",
        title: "Our Values",
        body: [
          "Customer Focus: Only reason to be in business.",
          "Performance Focus: Providing complete solutions.",
          "Entrepreneurial Drive: Ownership driven.",
          "Team Work: Together in one direction.",
          "Trust and Integrity: Respect for all.",
        ].join("\n"),
      },
      {
        key: "cta",
        type: "cta",
        title: "Committed to Animal Well-Being",
        body: "Provet's aim is to provide affordable, innovative, and research-based solutions for healthcare and nutrition to the veterinary farming fraternity globally.",
        config: { buttons: [{ label: "Contact Us", href: "/contact", style: "accent" }] },
      },
    ],
  },

  {
    key: "about/why-provet",
    title: "Why Provet",
    heroImage: hero("1694854038360-56b29a16fb0c"),
    description: "Trusted, proven, and comprehensive solutions in the poultry and aquaculture space.",
    sections: [
      {
        key: "reasons",
        type: "list",
        title: "Why Provet",
        body: [
          "Trusted, proven, and comprehensive solutions in the poultry and aquaculture space",
          "Our commitment to quality is demonstrated by hundreds of repeat customers",
          "Innovative formulations - tribiotics, synbiotics, and natural growth promoters with unparalleled technical services",
        ].join("\n"),
      },
      {
        key: "range",
        type: "categoryGrid",
        title: "Our Product Range",
        config: { limit: 6 },
      },
      {
        key: "cta",
        type: "cta",
        title: "Committed to Animal Well-Being",
        body: "Provet's aim is to provide affordable, innovative, and research-based solutions for healthcare and nutrition to the veterinary farming fraternity globally.",
        config: { buttons: [{ label: "Contact Us", href: "/contact", style: "accent" }] },
      },
    ],
  },

  {
    key: "resources/technical-articles",
    title: "Technical Articles",
    heroImage: hero("1579165466949-3180a3d056d5"),
    description: "In-depth insights, innovative solutions and good practices in poultry and aquaculture health.",
    sections: [
      {
        key: "streams",
        type: "cards",
        title: "Technical Articles",
        body: [
          "Poultry: Gain access to in-depth insights, innovative solutions, emerging trends, and good practices in poultry health and nutrition. These articles bridge scientific advancements with practical applications to ensure optimized flock performance and sustainability.",
          "Aquaculture: Deep dive into aquaculture innovations, covering advanced strategies and research-driven approaches for improving aquatic species' health, water quality, and farm productivity.",
        ].join("\n"),
        config: { columns: 2 },
      },
      // The articles each range listed. On the old site every title linked to
      // a page with no body, so the titles are all there is to carry over -
      // they are listed as cards rather than linked to empty pages.
      {
        key: "poultry-articles",
        type: "cards",
        title: "Poultry (Avinova)",
        body: [
          "Comparative efficacy of various growth promoters on the performance of broiler chicken",
          "Essential oils and their benefits in poultry",
          "Synbiotics and gut health",
        ].join("\n"),
        config: { columns: 3 },
      },
      {
        key: "aqua-articles",
        type: "cards",
        title: "Aquaculture (Blunova)",
        body: [
          "Black gill disease in pacific",
          "An overview of Argulus (Fish Lice) infestation in fish ponds",
          "An overview of Hepatopancreatic Microsporidiosis (HPM) in shrimp farming",
          "Infectious Myonecrosis Virus (IMNV)",
          "Stress management in aquaculture",
        ].join("\n"),
        config: { columns: 3 },
      },
      {
        key: "cta",
        type: "cta",
        title: "Looking for something specific?",
        body: "Our technical team can point you to the right article or product.",
        config: { buttons: [{ label: "Contact Us", href: "/contact", style: "accent" }] },
      },
    ],
  },

  {
    key: "resources/booklets",
    title: "Booklets",
    heroImage: hero("1766297247072-93fd815afef3"),
    description: "Reference booklets for clinics and field teams.",
    sections: [
      {
        key: "titles",
        type: "imageCards",
        title: "Available Booklets",
        config: {
          columns: 3,
          aspect: "portrait",
          items: [
            {
              image: "/content/Anticoccidials.jpg",
              title: "Anticoccidial Feed Additives",
            },
            {
              image: "/content/Injectables.jpg",
              title: "Injectables",
            },
            {
              image: "/content/Natural-growth-promoters-1.jpg",
              title: "Natural Growth Promoters",
            },
          ],
        },
      },
      {
        key: "cta",
        type: "cta",
        title: "Request a booklet",
        body: "Get in touch and we'll send the booklet you need, or browse the full product range.",
        config: {
          buttons: [
            { label: "Contact Us", href: "/contact", style: "accent" },
            { label: "Browse Products", href: "/products", style: "outline" },
          ],
        },
      },
    ],
  },

  {
    key: "resources/magazine",
    title: "Magazine",
    heroImage: hero("1517419800355-7ea1a4b1f68d"),
    description:
      "Propulse is Provet's monthly in-house magazine, featuring insights from thought leaders, highlights of our latest initiatives, and updates on new product launches.",
    sections: [
      {
        key: "intro",
        type: "richText",
        title: "Propulse",
        body: [
          "Propulse is Provet's monthly in-house magazine, featuring insights from thought leaders, highlights of our latest initiatives, and updates on new product launches.",
          "The publication connects readers with advancements in animal health and showcases Provet's commitment to innovation and excellence in veterinary care.",
        ].join("\n\n"),
      },
      {
        key: "recent-issues",
        type: "imageCards",
        // Only the issues the old site actually listed by name and cover.
        // The archive runs back to August 2022; those earlier titles were
        // not enumerated there, so they are not invented here.
        title: "Recent Issues",
        config: {
          columns: 4,
          aspect: "portrait",
          items: [
            { image: "/content/Aug-2025_Thumbnail.jpg", title: "Propulse August 2025" },
            { image: "/content/Juny-2025_Thumbnail.jpg", title: "Propulse July 2025" },
            { image: "/content/June-2025_Thumbnail.jpg", title: "Propulse June 2025" },
            { image: "/content/May-2025_Thumbnail.jpg", title: "Propulse May 2025" },
            { image: "/content/April-2025_Thumbnail.jpg", title: "Propulse April 2025" },
            { image: "/content/March-2025_Thumbnail.jpg", title: "Propulse March 2025" },
            { image: "/content/February-2025_Thumbnail.jpg", title: "Propulse February 2025" },
            { image: "/content/January-2025_Thumbnail.jpg", title: "Propulse January 2025" },
          ],
        },
      },
      {
        key: "archive-note",
        type: "richText",
        body: "The Propulse archive runs back to August 2022. Contact us for back issues.",
      },
    ],
  },

  {
    key: "resources/trial-reports",
    title: "Trial Reports",
    heroImage: hero("1766744489655-328ec3d4f417"),
    description: "Evidence-based results from our product trials.",
    sections: [
      {
        key: "intro",
        type: "richText",
        title: "Trial Reports",
        body: "Our trial reports offer evidence-based results from product trials. It shows the performance and benefits of our solutions in diverse aquaculture environments, contributing to better farm management and yield improvements.",
      },
      // The reports each range listed. As with the technical articles, every
      // title on the old site linked to a page with no body, so the titles are
      // listed on their own. Two slips in the old listing are corrected: a
      // repeated "in Broiler feeds" and "zymomax pro" in lower case.
      {
        key: "poultry-reports",
        type: "cards",
        title: "Poultry (Avinova)",
        body: [
          "Effects of a multienzyme preparation (Zymomax Forte) on the incidence of loose droppings in layer chicken",
          "A comparative study on the effects of dietary supplementation of different gut acting growth promoters on performance of male broiler chickens",
          "Comparative evaluation of Nagronex SNB against competitors' probiotics and Antibiotic Growth Promoters in Broiler feeds",
          "Study on the efficacy of Zymomax Pro on the performance of commercial broilers",
        ].join("\n"),
        config: { columns: 2 },
      },
      {
        key: "aqua-reports",
        type: "cards",
        title: "Aquaculture (Blunova)",
        body: [
          "Efficacy of BACITOX PLUS in Improving the Water Quality Parameters in Aquaculture Ponds",
          "Efficacy of Pathostat Blu in controlling mortality due to severe vibrio loads in shrimp farming",
        ].join("\n"),
        config: { columns: 2 },
      },
      {
        key: "cta",
        type: "cta",
        title: "Request a trial report",
        body: "Our technical team can share the findings relevant to your operation.",
        config: { buttons: [{ label: "Contact Us", href: "/contact", style: "accent" }] },
      },
    ],
  },

  {
    key: "media/news",
    title: "News",
    heroImage: hero("1755777339174-bb10939126ce"),
    description: "Announcements and updates from Provet.",
    sections: [
      {
        key: "items",
        type: "cards",
        title: "Latest News",
        body: [
          "BLUNOVA Bhimavaram Seminar (WG District) - 27 October 2017: The BLUNOVA Strategic Business Unit organized a technical seminar on Aquamimicry and role of Synbiotics in combination with nucleotides & nucleosides for disease management during culture period on 27th October 2017, in Bhimavaram (West Godavari District in Andhra Pradesh state).",
          "World Veterinary Day - 29 April 2017: This year the \"World Veterinary Day\" was celebrated on 29th April 2017, by the entire veterinary community across the world. On this occasion Provet took pride in wishing them and expressed gratitude for their selfless service & invaluable contribution towards the health of both animals & humans.",
          "Launch of Nitrisol HP - 12 December 2016: A new and innovative product \"NITRISOL HP\" was launched during the half yearly meeting of BLUNOVA held at Hotel KAY, Vijayawada. NITRISOL HP is a combination of selected & optimally potentiated probiotics for effective control of Nitrite levels in aquaculture ponds.",
          "Provet Day Celebrations - 14 October 2016: Birthday and the 7th Anniversary of Provet was celebrated as Provet Day on 14th October, 2016 with much fanfare across the country by team members and business partners.",
          "Provet Layer Technical Meeting - 25 July 2016: Successful Layer Technical Meeting was organized at Hotel La Casa Inn, Anand on \"Gut Health and Immunity in Poultry\" on 25th July 2016.",
        ].join("\n"),
        config: { columns: 2 },
      },
    ],
  },

  {
    key: "media/events",
    title: "Events",
    heroImage: hero("1589248529232-69c286cf2cb4"),
    description: "Seminars, technical meetings and field programmes.",
    sections: [
      {
        key: "items",
        type: "imageCards",
        title: "Past Events",
        // The old site lists these as bare titles and dates, with the write-up
        // and a photo gallery on a page of their own. There is no model here
        // to hang a detail page on, so each event keeps its full write-up and
        // one representative photo from its gallery on the card instead of
        // being flattened to a line of text.
        config: {
          columns: 2,
          imageStyle: "card",
          aspect: "landscape",
          items: [
            {
              image: "/content/Puneet_Taplu_GM_SBU_Head_lighting_the_seminar_inaguration_lamp_in_Bhimavaram.jpg",
              title: "BLUNOVA Bhimavaram Seminar (WG District) - 27 October 2017",
              text: "The BLUNOVA Strategic Business Unit organized a technical seminar on Aquamimicry and role of Synbiotics in combination with nucleotides & nucleosides for disease management during culture period on 27th October 2017, in Bhimavaram (West Godavari District in Andhra Pradesh state). A unique non antibiotic growth promoter \"NAGROWALL\", a combination of Probiotic, Prebiotic, Nucleotides and Nucleosides, was launched during the seminar at Hotel Ananda Inn, Bhimavaram. The NagroWall brochures were released by the guest speakers Dr. Suguna, Principal Scientist and Dr. Veerabhadra Rao, Scientist, from Fishery Research Station, Bhimavaram.",
            },
            {
              image: "/content/WVD16.jpg",
              title: "World Veterinary Day - 29 April 2017",
              text: "This year the \"World Veterinary Day\" was celebrated on 29th April 2017, by the entire veterinary community across the world. On this occasion Provet took pride in wishing them and expressed gratitude for their selfless service & invaluable contribution towards the health of both animals & humans, animal welfare, food safety & security. Celebrations were held by Provet's team members with many renowned veterinarians all over India.",
            },
            {
              image: "/content/image1.png",
              title: "Launch of Nitrisol HP - 12 December 2016",
              text: "A new and innovative product \"NITRISOL HP\" was launched during the half yearly meeting of BLUNOVA - the aquaculture division of Provet - held at Hotel KAY, Vijayawada, Andhra Pradesh on 22/10/2016. NITRISOL HP is a combination of selected and optimally potentiated probiotics providing adequate colony forming units, for effective control of Nitrite levels in aquaculture ponds. It was launched by Ms. Rashmi Mohare, Assistant Product Manager, with Mr. Puneet Taplu, General Manager & SBU Head, and Mr. Srihari Baburao, Zonal Business Manager - South.",
            },
            {
              image: "/content/provetdayimage1.jpg",
              title: "Provet Day Celebrations - 14 October 2016",
              text: "Birthday and the 7th Anniversary of Provet was celebrated as Provet Day on 14th October, 2016 with much fanfare across the country by our team members along with our esteemed customers, consultants, veterinarians, technicians, stockists, dealers, retailers and business partners.",
            },
            {
              image: "/content/photo-52.jpg",
              title: "Provet Layer Technical Meeting, Anand - 25 July 2016",
              text: "A successful Layer Technical Meeting was organized at Hotel La Casa Inn, Anand on \"Gut Health and Immunity in Poultry\", to emphasise the importance of gut health in poultry production, on 25th July 2016. Dr. K S Prajapati delivered the chief guest address to around 50 farmers, alongside poultry specialists Dr. Nishant Patel, Mr. Nilkamal Patel and Dr. Prabhat Gupta.",
            },
          ],
        },
      },
      {
        key: "cta",
        type: "cta",
        title: "Meet us at an event",
        body: "Get in touch to find out where our team will be next.",
        config: { buttons: [{ label: "Contact Us", href: "/contact", style: "accent" }] },
      },
    ],
  },

  {
    key: "careers",
    title: "Careers",
    heroImage: hero("1622837699015-9a4cb8b7a94b"),
    description: "Build your career with a team that puts animal health first.",
    sections: [
      {
        key: "intro",
        type: "richText",
        title: "Coming Soon",
        // The old careers page carries no openings - it says only "Coming
        // Soon". Kept as-is rather than inventing roles.
        body: "We're not advertising any openings right now. If you'd like to be considered for a future role, get in touch and tell us about yourself.",
      },
      {
        key: "cta",
        type: "cta",
        title: "Interested in joining us?",
        body: "Send us your details and we'll be in touch when something opens up.",
        config: { buttons: [{ label: "Get in Touch", href: "/contact", style: "accent" }] },
      },
    ],
  },
];

module.exports = { menuPages };
