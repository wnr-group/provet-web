// The sections of the pages laid out in code - Homepage, About Us and Contact
// Us - as the seed creates them: every block each page shows, built-in and
// added, with its text, settings, images, visibility and order.
//
// Generated from the live database (Admin > Website Content), so a freshly
// seeded database renders these pages exactly as the site does, with every
// section a real, editable row rather than a default in code. The seed only
// creates missing rows (`update: {}`), so it never overwrites the admin's
// edits. The retired homepage rows ("mission", "why-us") are not included -
// nothing shows them.

const siteContent = {
  "home": [
    {
      "key": "hero-stats",
      "type": "richText",
      "title": "Trusted by veterinarians nationwide",
      "body": "250+ Products - 15+ Years Experience - 1,200+ Clinics Served",
      "image": "",
      "isVisible": true,
      "order": 0,
      "config": {}
    },
    {
      "key": "feature-strip",
      "type": "cards",
      "title": "Why choose Provet",
      "body": "Reliable Supply: Consistent stock & timely delivery\nCertified Quality: GMP-compliant manufacturing\nResearch Backed: Formulated with veterinary experts\nAnimal Wellness: Focused on better health outcomes",
      "image": "",
      "isVisible": true,
      "order": 1,
      "config": {
        "columns": 3
      }
    },
    {
      "key": "species",
      "type": "richText",
      "title": "Solutions by Species",
      "body": "",
      "image": "",
      "isVisible": true,
      "order": 2,
      "config": {}
    },
    {
      "key": "featured",
      "type": "richText",
      "title": "Featured Products",
      "body": "A snapshot of the medicines veterinarians trust most.",
      "image": "",
      "isVisible": true,
      "order": 3,
      "config": {}
    },
    {
      "key": "stats",
      "type": "richText",
      "title": "By the Numbers",
      "body": "20+ years combined formulation experience - 100+ SKUs across 6 therapeutic categories - Supplying clinics and distributors across the region.",
      "image": "",
      "isVisible": true,
      "order": 4,
      "config": {}
    },
    {
      "key": "knowledge-centre",
      "type": "imageCards",
      "title": "Knowledge Centre",
      "body": "The research and field knowledge behind our solutions.",
      "image": "",
      "isVisible": true,
      "order": 5,
      "config": {
        "columns": 4,
        "imageStyle": "accordion",
        "aspect": "landscape",
        "items": [
          {
            "image": "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=1000&h=900&q=80",
            "title": "Trial Reports",
            "text": "Evidence-based results from our product trials.",
            "href": "/resources/trial-reports"
          },
          {
            "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&h=900&q=80",
            "title": "Technical Articles",
            "text": "In-depth insights, innovative solutions and good practices in poultry and aquaculture health.",
            "href": "/resources/technical-articles"
          },
          {
            "image": "https://images.unsplash.com/photo-1504198322253-cfa87a0ff25f?auto=format&fit=crop&w=1000&h=900&q=80",
            "title": "Magazine",
            "text": "Propulse is Provet's monthly in-house magazine, featuring insights from thought leaders, highlights of our latest initiatives, and updates on new product launches.",
            "href": "/resources/magazine"
          },
          {
            "image": "https://images.unsplash.com/photo-1591951425600-d09958978584?auto=format&fit=crop&w=1000&h=900&q=80",
            "title": "Booklets",
            "text": "Reference booklets for clinics and field teams.",
            "href": "/resources/booklets"
          }
        ]
      }
    },
    {
      "key": "section-8",
      "type": "videos",
      "title": "Explore Provet",
      "body": "",
      "image": "",
      "isVisible": true,
      "order": 6,
      "config": {
        "layout": "grid",
        "items": [
          {
            "url": "https://youtu.be/tbhx8GMEouU?si=hhQMol2ifzqYArrv",
            "title": "",
            "text": ""
          },
          {
            "url": "https://youtu.be/Qg4sIgosKBg?si=mPTk2gXgU6eH2nO3",
            "title": "",
            "text": ""
          },
          {
            "url": "https://youtu.be/SV5lMECOf48?si=L5Cgf7j-VE2fLoCw",
            "title": "",
            "text": ""
          },
          {
            "url": "https://youtu.be/_K5BsB78zzY?si=xPjFcH_W5ogce1u4",
            "title": "",
            "text": ""
          }
        ]
      }
    },
    {
      "key": "testimonials",
      "type": "carousel",
      "title": "What Our Customers Say",
      "body": "",
      "image": "",
      "isVisible": true,
      "order": 7,
      "config": {
        "aspect": "square",
        "autoplay": true,
        "interval": 6000,
        "items": [
          {
            "image": "/content/Fepromix_Testimonials-1024x1024.jpg",
            "title": "Fepromix"
          },
          {
            "image": "/content/Final_Nagronex-SNB_Testimonial-1024x1024.jpg",
            "title": "Nagronex-SNB"
          },
          {
            "image": "/content/Testimonial_Galpromin-XL-1024x1024.jpg",
            "title": "Galpromin-XL"
          },
          {
            "image": "/content/Testimonial_Immulator-1024x1024.jpg",
            "title": "Immulator"
          }
        ]
      }
    },
    {
      "key": "cta",
      "type": "richText",
      "title": "Need help choosing the right product for your clinic?",
      "body": "Our veterinary specialists are ready to guide you through composition, dosage and suitability for your practice.",
      "image": "",
      "isVisible": true,
      "order": 8,
      "config": {}
    }
  ],
  "about": [
    {
      "key": "banner",
      "type": "imageText",
      "title": "Dedicated to Better Animal Health",
      "body": "For over 15 years, Provet has partnered with veterinarians and clinics to deliver reliable, research-backed animal healthcare products.",
      "image": "https://images.unsplash.com/photo-1549488235-42996ae3b650?auto=format&fit=crop&w=1000&h=800&q=80",
      "isVisible": true,
      "order": 0
    },
    {
      "key": "story",
      "type": "richText",
      "title": "Our Story",
      "body": "What began as a small veterinary formulation initiative has grown into a dedicated catalogue of medicines serving companion animal clinics and livestock farms alike. Our team combines pharmaceutical manufacturing experience with a genuine passion for animal health.",
      "image": "",
      "isVisible": true,
      "order": 0,
      "config": {}
    },
    {
      "key": "mission",
      "type": "richText",
      "title": "Our Mission",
      "body": "To provide reliable, well-documented veterinary medicines that veterinarians can prescribe with confidence, supported by clear dosing information and responsive enquiry handling.",
      "image": "",
      "isVisible": true,
      "order": 1,
      "config": {}
    },
    {
      "key": "quality",
      "type": "richText",
      "title": "Quality Commitment",
      "body": "Every formulation in our catalogue is developed with attention to composition accuracy, stability and ease of field use. We document dosage and storage guidance clearly so animal handlers and veterinarians can use our products safely.",
      "image": "",
      "isVisible": true,
      "order": 2,
      "config": {}
    },
    {
      "key": "team",
      "type": "richText",
      "title": "Our Team",
      "body": "Our cross-functional team includes veterinary pharmacologists, quality assurance specialists and field support staff who work together to keep our catalogue relevant to real clinical and farm needs.",
      "image": "",
      "isVisible": true,
      "order": 3,
      "config": {}
    },
    {
      "key": "why-us",
      "type": "list",
      "title": "Why Choose Us",
      "body": "Rigorously tested formulations manufactured to consistent quality standards\nA broad catalogue spanning companion animal and livestock needs\nResponsive technical and enquiry support for veterinarians and distributors\nReliable supply chain and packaging designed for field conditions",
      "isVisible": true,
      "order": 5
    },
    {
      "key": "why-us-figure",
      "type": "richText",
      "title": "Highlight figure",
      "body": "98% Client satisfaction across partner clinics",
      "isVisible": true,
      "order": 6
    },
    {
      "key": "cta",
      "type": "richText",
      "title": "Need help choosing the right product for your clinic?",
      "body": "Our veterinary specialists are ready to guide you through composition, dosage and suitability for your practice.",
      "isVisible": true,
      "order": 7
    }
  ],
  "contact": [
    {
      "key": "hero",
      "type": "richText",
      "title": "We're Here to Help",
      "body": "Reach out for product information, bulk pricing, or veterinary support. Our team responds within one business day.",
      "image": "",
      "isVisible": true,
      "order": 0,
      "config": {}
    },
    {
      "key": "details",
      "type": "cards",
      "title": "Contact details",
      "body": "Visit Us: No. 9, 1st Floor, 2nd Lane, Chakrapani Street, Guindy, Chennai - 600 032\nCall Us: +91 44 2244 2124 / +91 44 2244 2127\nEmail Us: info@provet.in\nWorking Hours: Mon – Sat, 9:00 AM – 6:00 PM",
      "image": "",
      "isVisible": true,
      "order": 1,
      "config": {
        "columns": 3
      }
    },
    {
      "key": "footer",
      "type": "richText",
      "title": "Provet Pharma Private Limited",
      "body": "Excellence through innovation. Solution-oriented veterinary healthcare products backed by expert technical guidance.",
      "image": "",
      "isVisible": true,
      "order": 2,
      "config": {}
    },
    {
      "key": "branches",
      "type": "locations",
      "title": "Branch Locations",
      "body": "Our branches and distribution partners, for stock and support close to your farm.",
      "image": "",
      "isVisible": true,
      "order": 3,
      "config": {
        "columns": 3,
        "items": [
          {
            "title": "Chennai (CWH)",
            "address": "260, First Floor, Gnanam Complex,\nPoonamallee Bye Pass Road,\nPoonamalle, Thiruvallur,\nTamil Nadu - 600 056",
            "contact": "Rajesh Devan",
            "phone": "+91 97908 16924"
          },
          {
            "title": "Nashik (CFA)",
            "subtitle": "ARV Enterprises",
            "address": "Shop No. 1, Darshan Apartment,\nUpnagar, Nashik,\nMaharashtra - 422 006",
            "contact": "Bablu Kalekar",
            "phone": "+91 91464 56873"
          },
          {
            "title": "Kolkata (Branch)",
            "address": "268-XII, Makaltala, Bally,\nDurgapur, Howrah,\nWest Bengal - 711 205",
            "contact": "Sanjoy Sau",
            "phone": "+91 75501 99914"
          },
          {
            "title": "Bhimavaram (Branch)",
            "address": "19-16-113, Old Jagadamba Rice Mill,\nNear Ganganama Temple, Rest House Road,\nBhimavaram, West Godavari District,\nAndhra Pradesh - 534 201",
            "contact": "Omkar Vara Prasad",
            "phone": "+91 95422 20291"
          },
          {
            "title": "Hyderabad (CFA)",
            "subtitle": "Sun Vet Enterprises",
            "address": "1-5-1118/1/20, Jannabanda,\nNear St. Paul's School, Old Alwal,\nSecunderabad, Telangana - 500 010",
            "contact": "Shiva Krishna",
            "phone": "+91 63000 82953"
          },
          {
            "title": "Ambala (CFA)",
            "subtitle": "Somya Nutraceuticals",
            "address": "Third Floor, 3-A-3, Alvid House,\nGrand Trunk Road, New Kuldeep Nagar,\nAmbala, Haryana - 133 001",
            "contact": "Sushil",
            "phone": "+91 93503 65689"
          }
        ]
      }
    }
  ]
};

module.exports = { siteContent };
