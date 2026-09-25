// Provet's real product catalogue, carried over from the old provet.in site
// (the Avinova poultry and Blunova aquaculture ranges). Generated from the
// site's WordPress pages; every product keeps its source URL in `source` as
// provenance. Copy is as published there, with only these adaptations:
//
//   * The old site nested categories under two brands; Category here is flat,
//     so the brand is kept as a specification on each product, the three
//     Antibacterials sub-pages became their own categories, and category
//     names that existed under both brands carry a Poultry / Aqua qualifier.
//   * Its sections map onto the product fields: the intro -> shortDescription,
//     Indications + Benefits -> uses, (Recommended) Dosage + Method of
//     Administration -> dosage, Presentation -> packSize, and the tagline and
//     withdrawal period -> specifications.
//   * ECTOCYP and NAGROWALL are listed under both brands with different copy,
//     so the aqua versions use the slugs ectocyp-aqua and nagrowall-aqua.
//   * Product images are committed under public/content/products, for the
//     same reason menuPages.js gives: nothing here depends on provet.in
//     staying online.

const oldSiteCategories = [
  {
    "name": "AGPs",
    "brand": "Avinova",
    "description": "AGPs from the Avinova poultry health range.",
    "products": [
      {
        "name": "AVILOMAX 100",
        "slug": "avilomax-100",
        "shortDescription": "Avilomax 100 is an antibiotic that inhibits bacterial protein synthesis, effectively controlling the growth and maturation of Clostridium spp. and other gram-positive bacteria. Its targeted action helps prevent infections and promotes healthier livestock by reducing bacterial loads. It has synergistic benefits when used in conjunction with a well-balanced coccidiostat program.",
        "composition": "Each kg of Avilomax 100 contains Avilamycin – 100 g.",
        "uses": "• Prevents necrotic enteritis caused by Clostridium perfringens in growing broiler chickens.\n• Increased weight gain and improved feed efficiency in broiler chickens.",
        "dosage": "1000 g per MT of feed to yield 10 ppm of Avilamycin or as advised by the nutritionist.\n\nMethod of administration\nMust be thoroughly mixed in broiler feed before use. For better dispersion, it is recommended that Avilomax 100 be thoroughly mixed with a small quantity of the feed ingredients.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Targeted Control of Gram-Positive Bacteria",
          "withdrawalPeriod": "Meat : Nil; Eggs : Do not use in birds that produce or may in future produce eggs for human consumption."
        },
        "images": [
          "/content/products/avilomax-100.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/avilomax-100/"
      },
      {
        "name": "BACTOMAX 150",
        "slug": "bactomax-150",
        "shortDescription": "Bactomax is produced by strict fermentation control and process. It has a higher pH and, therefore, lower minors. It is the original chlortetracycline calcium complex form, and it is stable in pH, moisture, and temperature during storage and processing.",
        "composition": "Chlortetracycline Hydrochloride – 15%",
        "uses": "• It is the chlortetracycline of choice – consistent high quality achieved by superior microbial strain, strict fermentation control and process, and high standard specifications.\n• Intrinsically, it is more stable than generic CTC Hcl and has better action than generic CTC Hcl.\n• Less reactive than water-soluble generic CTC Hcl.\n• Stable during extrusion and pelleting.",
        "dosage": "335 g per ton of feed",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Complete Antibiotic Feed Supplement for Poultry"
        },
        "images": [
          "/content/products/bactomax-150.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/bactomax-150/"
      },
      {
        "name": "BAMBERCIN 80",
        "slug": "bambercin-80",
        "shortDescription": "Bambercin 80 contains the dry mycelium of Bambermycins and is the only phosphorous-containing glycolipid antibiotic exclusively used in animal feed, specifically developed as a performance-promoting feed additive. It has a bacteriostatic effect, especially on gram-positive bacteria, and it creates a prebiotic effect, enhancing gut health.",
        "composition": "Bambermycin/Flavophospholipol – 80 mg per gram.",
        "uses": "• Stimulates the rate of weight gain, improves feed conversion efficiency, and increases egg production.\n• Boosts immune function by releasing muramyl dipeptide enzyme from the cell wall.\n• Enhances carcass characteristics and pigmentation.\n• No measurable residues in animal tissues, and hence, no withdrawal period is required.\n• No evidence of cross-resistance to other antibiotics such as Penicillins, Tetracyclines, or Macrolides.",
        "dosage": "62.5 g per MT of complete feed corresponding to 5 ppm of Bambermycin or as advised by a nutritionist.",
        "packSize": "1 kg and 10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Bambermycin/Flavophospholipol – 80 mg per gram"
        },
        "images": [
          "/content/products/bambercin-80.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/bambercin-80/"
      },
      {
        "name": "BAMBERCIN PLUS",
        "slug": "bambercin-plus",
        "shortDescription": "Bambercin Plus works well against many harmful bacteria, gram-positive bacteria, and gram-negative organisms, especially those like Salmonella E. Coli and Enterococcus faecium, which are common in poultry and can be resistant to other antibiotics.",
        "composition": "Bambercin Plus is a combination of Bambermycin – 2% (antibiotic), adequate colony-forming units of Probiotics such as Bacillus Subtilis and B. licheniformis, fortified with Curcumin (Phytobiotic) for improving performance and productivity.",
        "uses": "• Stops bacteria growth, causes no cross-resistance for bacteria, reduces resistance spread, and lowers the amount of harmful and resistant bacteria in the droppings.\n• Strengthens the gut barrier by making the gut lining stronger and preventing harmful bacteria from attaching to the gut.\n• Fights against harmful bacteria like C. perfringens, which causes Necrotic Enteritis.\n• Helps regulate and strengthen the bird’s immune system and survive tough conditions like heat and storage.",
        "dosage": "250 grams per MT of finished feed or as advised by the Poultry Nutritionist.",
        "packSize": "10 kg and 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Novel and Potent Tribiotic"
        },
        "images": [
          "/content/products/bambercin-plus.jpg"
        ],
        "isFeatured": true,
        "source": "https://provet.in/products/avinova/agps/bambercin-plus/"
      },
      {
        "name": "ENRAMIX 80",
        "slug": "enramix-80",
        "shortDescription": "Enramix 80 has a strong bactericidal effect under both aerobic and anaerobic conditions. It is effective primarily against gram-positive bacteria such as Clostridium perfringens, which causes Necrotic Enteritis in poultry.",
        "composition": "Each kg of Enramix 80 contains 80 g of Enramycin Hydrochloride.",
        "uses": "• Excellent growth promoter and improves feed efficiency at very low inclusion level in feed.\n• No cross-resistance development with other antibiotics or antibacterial agents.\n• Poor absorption from the GI tract and has minimal tissue residual effect.\n• Suppresses ammonia-producing organisms, thereby reducing ammonia levels in the intestinal contents and blood.\n• Reduces wet droppings in poultry.",
        "dosage": "62.5 – 125 grams per MT of feed to obtain a concentration of 5-10 ppm of Enramycin Hydrochloride.",
        "packSize": "10 kg and 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Antimicrobial Feed Additive"
        },
        "images": [
          "/content/products/enramix-80.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/enramix-80/"
      },
      {
        "name": "ERMISOL-FS20",
        "slug": "ermisol-fs20",
        "shortDescription": "Ermisol FS 20 is effective against infections caused by micro-organisms in poultry, sensitive to Erythromycin, especially economically important diseases such as infectious Coryza and Mycoplasmal infections. Erythromycin binds reversibly to the 50s subunit of ribosomes, resulting in the blockage of transpeptidation or translocation reactions, leading to impaired and inhibited protein synthesis and inhibited cell growth.",
        "composition": "Erythromycin thiocyanate – 20%",
        "uses": "• Improves performance and productivity\n• Helps in the prevention and control of CRD & infectious respiratory diseases caused by Erythromycin.\n• Boosts immunity by modulating macrophage function.",
        "dosage": "125 – 250 g per ton of feed or as advised by the consultant.",
        "packSize": "1 kg and 10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Potent Antimicrobial against Respiratory Infections",
          "withdrawalPeriod": "Meat : 3 days; Egg : 6 days"
        },
        "images": [
          "/content/products/ermisol-fs20.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/ermisol-fs-20/"
      },
      {
        "name": "FRZ 20",
        "slug": "frz-20",
        "shortDescription": "FRZ 20 is effective against a range of gram-positive and gram-negative bacteria. It is particularly used for gastrointestinal and respiratory infections in animals. It helps improve both productivity and performance in broilers and layers.",
        "composition": "Each kg of FRZ 20 contains Furazolidone – 200 g.",
        "uses": "• Prevents infections caused by E. coli, fowl typhoid, and fowl cholera.\n• Minimizes bacterial load in the gut.\n• Improves egg production in layers and weight gain in broilers.\n• Controls enteritis and loose droppings.",
        "dosage": "250 to 500 g per MT of complete feed continuously for a period of 5 to 7 days or as advised by the nutritionist.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Antimicrobial Agent to Treat Bacterial Infections"
        },
        "images": [
          "/content/products/frz-20.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/frz-20/"
      },
      {
        "name": "NOSITIDE-10",
        "slug": "nositide-10",
        "shortDescription": "Nositide-10 contains Nosiheptide, a polypeptide antibiotic produced by the fermentation of Streptomyces actuosus. It has an anti-bactericidal effect on gram-positive bacteria and a few gram-negative bacteria.",
        "composition": "Nosiheptide",
        "uses": "• Stimulates the rate of weight gain, improves feed conversion efficiency, increases egg production, and improves carcass quality.\n• No measurable residues in animal tissues.\n• Compatible with common feed additives and competitive exclusion products.\n• No evidence of cross-resistance to other antibiotics such as Penicillins, Tetracyclines, or Macrolides.",
        "dosage": "250 g per MT of complete feed corresponding to 2.5 ppm of Nosihelptide or as advised by the nutritionist.\n\nMethod of administration\nOrally, well homogenized into feed. For proper homogenization in feed, it is recommended to mix the measured quantity of the product with a small amount of feed and then add this premix to the complete feed.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "A Polypeptide Antibiotic",
          "withdrawalPeriod": "Meat : 7 days"
        },
        "images": [
          "/content/products/nositide-10.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/agps/nositide-10/"
      }
    ],
    "image": "/content/products/avilomax-100.jpg"
  },
  {
    "name": "Antibacterial Injectables",
    "brand": "Avinova",
    "description": "Antibacterial Injectables from the Avinova poultry health range.",
    "products": [
      {
        "name": "AMICAJECT",
        "slug": "amicaject",
        "shortDescription": "Amicaject is an antibiotic that is used to treat a wide range of bacterial infections, particularly those caused by gram-negative bacteria. It disrupts protein synthesis in bacteria, effectively eliminating harmful pathogens.",
        "composition": "Each ml contains Amikacin Sulphate equivalent to Amikacin: 250 mg",
        "uses": "General bacterial infections",
        "dosage": "By IM/SC route after dilution with sterile water 15 mg to 20 mg per kg body weight or as recommended by a Registered Veterinary practitioner.",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Aminoglycoside Anti-bacterial",
          "withdrawalPeriod": "Egg : 7 days; Meat : 22 days"
        },
        "images": [
          "/content/products/amicaject.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/amicaject/"
      },
      {
        "name": "BACTOJECT LA",
        "slug": "bactoject-la",
        "shortDescription": "BactojectLA provides sustained therapeutic levels of the antibiotic, reducing the need for frequent dosing and ensuring prolonged protection.",
        "composition": "Each ml contains:\nOxytetracycline Dihydrate IP equivalent to anhydrous Oxytetracycline : 200 mg\n2 Pyrrolidone IP (as vehicle) : q.s",
        "uses": "• General bacterial infections\n• Infections of gastro-intestinal tract, genito-urinary tract, respiratory system including mycoplasma, enterotoxemia and effective in certain viral and protozoan diseases.",
        "dosage": "Poultry : 50 mg per kg body weight by subcutaneous route into the mild back region of the neck.\nCattle, Sheep, and Goat: 20 mg per kg body weight by deep intramuscular route.",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Sustained anti-bacterial activity",
          "withdrawalPeriod": "Egg : 7 days; Meat : 22 days"
        },
        "images": [
          "/content/products/bactoject-la.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/bactojectla/"
      },
      {
        "name": "CEFTIJECT",
        "slug": "ceftiject",
        "shortDescription": "Ceftiject is used to treat a variety of bacterial infections caused by gram-positive and gram-negative bacteria. It works by inhibiting the synthesis of bacterial cell walls, leading to the elimination of the infection.",
        "composition": "Each vial contains Ceftiofur Sodium Sterile powder equivalent to Ceftiofur activity: 1g",
        "uses": "• Early chick mortality\n• Infections caused by Ceftiofur sensitive bacteria.",
        "dosage": "Subcutaneous injection in the neck region of day-old chicks at a dosage of 0.08 mg – 0.20 mg per chick.",
        "packSize": "1 g",
        "specifications": {
          "brand": "Avinova",
          "profile": "Wide spectrum antimicrobial",
          "withdrawalPeriod": "Meat : 4 days after last administration"
        },
        "images": [
          "/content/products/ceftiject.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/ceftiject/"
      },
      {
        "name": "GENTAJECT",
        "slug": "gentaject",
        "shortDescription": "Gentaject is an antibiotic that is used to treat a wide range of bacterial infections, particularly those caused by gram-negative bacteria. It disrupts protein synthesis in bacteria, leading to their rapid elimination.",
        "composition": "Each ml contains Gentamycin Sulphate equivalent to Gentamycin: 40 mg",
        "uses": "General bacterial infections",
        "dosage": "By IM/SC route after dilution with sterile water 8 mg per kg body weight or as recommended by a Registered Veterinary practitioner.",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Aminoglycoside Anti-bacterial",
          "withdrawalPeriod": "Egg : 7 days; Meat : 22 days"
        },
        "images": [
          "/content/products/gentaject.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/gentaject/"
      },
      {
        "name": "LINCOVET",
        "slug": "lincovet",
        "shortDescription": "Lincovet is a lincomycin-based antibiotic used to treat a variety of bacterial infections, particularly those caused by gram-positive bacteria, including certain strains of mycoplasma. It works by inhibiting bacterial protein synthesis, effectively stopping the growth and spread of the infection.",
        "composition": "Each ml contains:\nLincomycin Hydrochloride equivalent to Lincomycin base  : 300 mg\nBenzyl Alcohol IP : 2% V/V",
        "uses": "For the prevention, control, and treatment of mycoplasmosis.",
        "dosage": "By IM, IV, and SC route\nCattle, Camel, Sheep, and Goat: 1 ml per 30 kg body weight\nDog and Cat : 1 ml per 15 kg body weight\nPoultry : 20 mg per kg body weight or 1 ml per 15 kg body weight.\nOr as advised by a registered medical practitioner.",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Antimycoplasmal Lincosamide",
          "withdrawalPeriod": "Milk : 7 days; Chicken (Meat and Offal) : 22 days"
        },
        "images": [
          "/content/products/lincovet.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/lincovet/"
      },
      {
        "name": "PATHOJECT CT",
        "slug": "pathoject-ct",
        "shortDescription": "PathojectCT is a combination antibiotic formulated for use in Poultry to treat a broad spectrum of bacterial infections, particularly those involving gram-positive and gram-negative bacteria. The dual-action of PathogenCT, combining the strengths of two antibiotics, enhances its effectiveness in targeting multiple pathogens simultaneously, ensuring comprehensive treatment.",
        "composition": "Each ml contains:\nCeftriaxone Sodium I.P. (Sterile) eq. to Anhydrous Ceftriaxone : 5000 mg\nTazobactum Sodium I.P. (Sterile) eq. to Anhydrous Tazobactum : 625 mg",
        "uses": "Effective treatment of severe and mixed bacterial infections",
        "dosage": "As directed by registered veterinary practitioner\nWithdrawal Period\nMilk : 7 days after last administration\nMeat : 28 days after last administration",
        "packSize": "5625 mg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Synergistic and Potent Anti-Infective combination"
        },
        "images": [
          "/content/products/pathoject-ct.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/pathojectct/"
      },
      {
        "name": "PROVIJECT DS",
        "slug": "proviject-ds",
        "shortDescription": "ProvijectDS is designed to provide essential vitamins and nutrients to ensure better liveability and performance. It improves growth rates, enhances immune function, and supports recovery from illness or stress. They are especially useful during periods of high production, such as during egg-laying or growth phases, or when poultry are experiencing environmental changes or disease outbreaks.",
        "composition": "Each ml contains:\nVitamin A IP  : 4000 IU\nVitamin D3 IP  : 4000 IU\nVitamin E Acetate IP   : 8 mg\nNiacinamide IP   : 20 mg\nThiamine HCL IP  : 20 mg\nPyridoxine HCL IP  : 10 mg\nRiboflavin Phosphate Sodium IP  : 2 mg\nD – Panthenol IP  : 2 mg\nVitamin B12 IP  : 20 mcg\nD – Biotin BP : 20 mcg",
        "uses": "All types of stress conditions and vitamin deficiencies",
        "dosage": "By IM/SC route as recommended by a Registered Veterinary practitioner.",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Multi Vitamin Injectable"
        },
        "images": [
          "/content/products/proviject-ds.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/provijectds/"
      },
      {
        "name": "SYNERJECT AT",
        "slug": "synerject-at",
        "shortDescription": "SynerjectAt is a broad spectrum bactericidal with excellent activity against Mycoplasma spp. It is highly safe and excellent against mixed infections.",
        "composition": "Each ml contains:\nAmikacin Sulphate IP  : 250 mg\nEquivalent to Amikacin Tylosin Tartrate IP  : 250 mg\nEquivalent to Tylosin Vitamin B12 IP  : 20 mcg\nMethyl Paraben IP  : 0.18% w/v\nPropyl Paraben IP  : 0.02% w/v\nBenzyl Alcohol IP  : 2% w/v\nPropylene Glycol & water for injection IP : q.s",
        "uses": "Mixed bacterial infections",
        "dosage": "1 ml per 15 – 20 kg body weight by IM or SC route",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Potent Antibiotic with Dual Action"
        },
        "images": [
          "/content/products/synerject-at.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/synerjectat/"
      },
      {
        "name": "TYLOJECT",
        "slug": "tyloject",
        "shortDescription": "Tyloject is a macrolide antibiotic widely used in the prevention and treatment of CRD associated with Mycoplasma gallisepticum in broilers and replacement chicks or at the time of vaccination or other stress conditions in chicken.",
        "composition": "Each ml contains Tylosin Tartrate equivalent to Tylosin: 200 mg.",
        "uses": "Prevention and treatment of mycoplasmosis",
        "dosage": "15 mg per kg body weight or as recommended by a registered veterinary practitioner.",
        "packSize": "100 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Effective Mycoplasma Control"
        },
        "images": [
          "/content/products/tyloject.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/injectables/tyloject/"
      }
    ],
    "image": "/content/products/amicaject.jpg"
  },
  {
    "name": "Antibacterial Liquids",
    "brand": "Avinova",
    "description": "Antibacterial Liquids from the Avinova poultry health range.",
    "products": [
      {
        "name": "LEBROCIN-BH",
        "slug": "lebrocin-bh",
        "shortDescription": "Lebrocin-BH is a synergistic combination of Levofloxacin and Bromhexine that is used to combat bacterial respiratory complications. It is highly effective against a wide range of bacterial species. It can be used for the prevention, control, and treatment of severe bacterial respiratory and mycoplasmal infections of poultry, including CRD, CCRD, Infectious Coryza, Necrotic Enteritis, Colibacillosis, Salmonellosis, and Fowl Cholera.",
        "composition": "Lebrocin-BH is an oral solution that consists of 10% Levofloxacin and 1.5% Bromhexine.",
        "uses": "Highly effective against a wide range of bacterial species and can be used for the prevention, control and treatment of severe bacterial respiratory and mycoplasmic infections of poultry including CRD, CCRD, Infectious Coryza, Nectrotic Enteritis, Colibacillosis, Salmonellosis, and Fowl Cholera.\n\nBenefits\n• Maximizes bacterial killing through synergistic action of Levofloxacin and Bromhexine, minimizes the emergence of bacterial resistance, and prevents re-occurrence of disease due to high bacterial eradication.\n• Inhibits bacterial growth and toxin production, thereby reducing damage to birds, and provides more time to the immune system.\n• Helps in faster duration therapy and expedites recovery from infections.\n• Reduces mortality and improves performance.",
        "dosage": "1 ml of Lebrocin-BH per 10 kg body weight for 3-5 days based on the severity of the infection or as recommended by a Registered Veterinary Practitioner.",
        "packSize": "1000 ml and 5000 ml HDPE containers",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Antibacterial",
          "withdrawalPeriod": "Egg : 7 days after the last administration; Meat : 5 days after the last administration"
        },
        "images": [
          "/content/products/lebrocin-bh.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/liquids/lebrocin-bh/"
      },
      {
        "name": "PROVEFLOX",
        "slug": "proveflox",
        "shortDescription": "Proveflox is a synergistic combination of Enrofloxacin and Bromhexine for oral use for the prevention, control, and treatment of a wide range of bacterial respiratory infections in poultry. It is highly safe to use at all stages of the flock, and it has anti-oxidant and immune-stimulant properties.",
        "composition": "Proveflox is an oral solution with Enrofloxacin – 20% and Bromhexine – 1.5%.",
        "uses": "For the prevention and treatment of severe respiratory infections of poultry, including Mycoplasmosis, Infectious Coryza, Colibacillosis, Salmonellosis, and fowl Cholera.\n\nBenefits\n• Rapid recovery from infections due to synergistic combination.\n• Highly effective against most common infections of poultry.\n• Reduces salmonella shedding.\n• Fluorinated molecule – lowered drug resistance.",
        "dosage": "1 ml per 20 kg body weight.\nTo be administered continuously for a period of 3 to 5 days once daily in drinking water, depending on the severity of the infection or as recommended by the registered veterinary practitioner.",
        "packSize": "1000 ml and 5000 ml HDPE containers",
        "specifications": {
          "brand": "Avinova",
          "profile": "Antibacterial Bronchodilator Mucolytic Expectorant",
          "withdrawalPeriod": "Egg : 7 days after the last administration; Meat : 5 days after the last administration"
        },
        "images": [
          "/content/products/proveflox.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/liquids/proveflox/"
      },
      {
        "name": "QUINACIP-10",
        "slug": "quinacip-10",
        "shortDescription": "Quinacip-10 is the 1st Ciprofloxacin formulation in liquid form, and it is completely soluble in water, which facilitates ease of usage and administration. Ciprofloxacin is a second-generation fluoroquinolone antibacterial agent with broad spectrum bactericidal activity. It exhibits excellent activity against gram-positive and gram-negative bacteria, mycoplasma, and anerobic bacteria. It acts by inhibiting DNA Gyrase and Topoiosmerase IV enzymes, thereby inhibiting DNA replication/transcription leading to the death of pathogens.",
        "composition": "Quinacip-10 is an oral solution that contains 10% Ciprofloxacin.",
        "uses": "Quinacip-10 is indicated for the control, prevention, and treatment of most common bacterial infections of poultry including Mycoplasmosis in both young and adult birds.\n\nBenefits\n• One of the most active quinolones and has excellent broad-spectrum activity against the most common pathogens affecting poultry.\n• Achieves maximum plasma concentration within 30 minutes of oral administration\n• It is well tolerated and has a high margin of safety\n• Exhibits excellent post-antibiotic effect",
        "dosage": "10 mg per kg body weight and 1 ml of Quinacip-10 is sufficient for a total body weight of 10 kg. Quinacip-10 is to be administered orally through drinking water continuously for a period of 3-5 days depending upon the severity of infection under the strict supervision of a registered veterinary practitioner.",
        "packSize": "500 ml HDPE containers",
        "specifications": {
          "brand": "Avinova",
          "profile": "Ciprofloxacin 10% Oral Solution"
        },
        "images": [
          "/content/products/quinacip-10.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/liquids/quinacip-10/"
      }
    ],
    "image": "/content/products/lebrocin-bh.jpg"
  },
  {
    "name": "Antibacterial Powders",
    "brand": "Avinova",
    "description": "Antibacterial Powders from the Avinova poultry health range.",
    "products": [
      {
        "name": "AZMIVET",
        "slug": "azmivet",
        "shortDescription": "Azmivet is known for its broad-spectrum activity against bacterial infections. It works by inhibiting bacterial protein synthesis, helping to control infections and promote faster recovery while minimizing secondary implications.",
        "composition": "Azithromycin Dihydrate : 10% w/w",
        "uses": "• Control and treatment of bacterial infections, including secondary and mixed infections.\n• Anti-inflammatory and immune-modulatory activity",
        "dosage": "10 ml per kg body weight once daily in drinking water for 3 to 5 days.",
        "packSize": "500 g",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Anti-Bacterial"
        },
        "images": [
          "/content/products/azmivet.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/powder/azmivet/"
      },
      {
        "name": "BACTIPHAGE-EC",
        "slug": "bactiphage-ec",
        "shortDescription": "Bactiphage-EC is designed to be used as a water-soluble feed additive. It is a cocktail of four bacteriophages – each of the four isolates is present at a high concentration (2 x 107 PFU per phage per gram of product). Each of the bacteriophages has unique properties and a specific role in the cocktail. It has a broad spectrum of activity and is far less prone to resistance. It has faster cidal action on the pathogen.",
        "composition": "Indian isolates of lytic bacteriophages that are lethal to APEC (Avian Pathogenic Escherichia Coli). It contains the lead phages, the associate phage, and the guard phage.",
        "uses": "• Protects against production losses due to E. Coli related disease stress in sub-clinically affected birds.\n• Drastically improves processing plant hygiene as far as coliforms are concerned. Usage for the last seven days in finisher broilers has been found to be extremely useful in reducing carcass contamination at the processing plant.",
        "dosage": "Broilers\nPre-started stage  : 1g per 20 birds per day from day 1 to day 7\nFinisher stage : 1g per 10 birds per day from day 30 to day 37\nBreeders and Commercial Layer : 1g per 10 birds per day medication should be done for 10 days in a month for whole lifetime\nFor use as spray on day-old chicks and feed during high disease pressure:\nStep 1  : Mix 650 g of Bactiphage-EC in 10 litres of water.\nStep 2  : Mix with liquid to be sprayed on 1000 day-old chicks or 1 MT of feed.",
        "packSize": "100 g and 500 g",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Next Generation Solution Against E.Coli"
        },
        "images": [
          "/content/products/bactiphage-ec.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/powder/bactiphage-ec/"
      },
      {
        "name": "NEDOBAC",
        "slug": "nedobac",
        "shortDescription": "Nedobac is formulated as a soluble powder, combining Neomycin and Doxycycline. It is designed to effectively combat a broad spectrum of bacterial infections, providing targeted action against both gram-positive and gram-negative bacteria. It helps improve animal health by controlling infections and promoting recovery.",
        "composition": "Neomycin Sulphate I.P equivalent to Neomycin base : 100 mg\nDoxycycline Hydrochloride I.P equivalent to Doxycycline : 100 mg\nExcipients : q.s",
        "uses": "• Prevents and controls early chick mortality\n• Prevention of secondary bacteria complications due to CRD\n• Treatment of non-specific diarrhoea\n• Prevention of mixed bacterial infections",
        "dosage": "For prevention of early chick mortality (ECM):\n1 g in 5 to 10 litres of drinking water\nFor treatment of ECM, Necrotic Enteritis, Fowl Typhoid, Salmonellosis, etc.:\n1 g in 2 to 4 litres of drinking water\nIn case of acute conditions, the dose should be doubled on the 1st day of administration for rapid recovery from infections.",
        "packSize": "100 g",
        "specifications": {
          "brand": "Avinova",
          "profile": "Potent Antibiotic with Dual Action",
          "withdrawalPeriod": "Egg : 14 days; Meat : 5 days"
        },
        "images": [
          "/content/products/nedobac.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/powder/nedobac/"
      },
      {
        "name": "SULTRIVET",
        "slug": "sultrivet",
        "shortDescription": "Sultrivet is a bactericidal drug and is effective against most of the bacterial infections of Poultry and Livestock",
        "composition": "Sulphadiazine I.P : 10% w/w\nTrimethroprim I.P : 2% w/w",
        "uses": "• Protects against CRD, CCRD, Bacillary White Diarrhea, Early Chick Mortality, Colibacillosis, Coccidiosis, and Infectious Coryza in Poultry\n• Protects against Haemorrhagic Septicaemia and Respiratory Tract Infections in Cattle, Sheep, and Goats.",
        "dosage": "Poultry\n1 g per litre of drinking water for 3 to 5 days or as advised by the consultant.\nCattle, Sheep, and Goats\n125 mg per kg of body weight per day through drinking water in divided doses or through feed as an electuary for 3 to 5 or as advised by the registered veterinary practitioner.\nIn case of acute conditions, the dose should be doubled on the 1st day of administration for rapid recovery from infections.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Bactericidal Drug",
          "withdrawalPeriod": "Meat and Egg  : 12 days; Milk : 4 days"
        },
        "images": [
          "/content/products/sultrivet.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antibacterials/powder/sultrivet/"
      }
    ],
    "image": "/content/products/azmivet.jpg"
  },
  {
    "name": "Anticoccidials",
    "brand": "Avinova",
    "description": "Anticoccidials from the Avinova poultry health range.",
    "products": [
      {
        "name": "CLOPICOX",
        "slug": "clopicox",
        "shortDescription": "Clopicox is a synthetic anticoccidial that inhibits the development of sporozoites and trophozoites of Eimeria spp.",
        "composition": "Clopido – 25%",
        "uses": "• Excellent coccidiosis control and broader protection.\n• Less rapid development of resistance.\n• No cross-resistance as it is the only pyridinol to be used as an anticoccidial.",
        "dosage": "500 g per ton of finished feed. In case of a higher infection, the dosage can be increased to 1 kg.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Pyridinol Anticoccidial",
          "withdrawalPeriod": "Meat : 5 days; Eggs : Not to be used in birds which produce eggs or egg products for human consumption"
        },
        "images": [
          "/content/products/clopicox.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/clopicox/"
      },
      {
        "name": "DIZUCOX 10",
        "slug": "dizucox-10",
        "shortDescription": "Dizucox 10 is a synthetic and non-ionophore anticoccidial with high anticoccidial activity, even at low levels. It has a strong broad-spectrum coccidial activity against developing first & second-generation schizonts and gamonts of Eimeria spp., affecting chicken. It kills or irreversibly damages most of the parasitic stages and thereby restores efficacy against ionophore anticoccidials.",
        "composition": "Diclazuril – 1%",
        "uses": "• Has strong activity in the later stages of coccidia and allows early natural immunity development.\n• Reduces lesion scores and improves the performance and health of birds.\n• Has no cross-resistance to commonly used anti-bacterials.\n• Zero withdrawal period.\n• Highly flexible and fits into all types of anti-coccidial programs.",
        "dosage": "100 g per ton of feed.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Potent, Flexible and Safe Anticoccidial"
        },
        "images": [
          "/content/products/dizucox-10.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/dizucox-10/"
      },
      {
        "name": "MADURACOX 10",
        "slug": "maduracox-10",
        "shortDescription": "Maduracox 10 is a broad-spectrum, monovalent glycoside ionophore. It is an ideal anticoccidial for use with other anticoccidials in rotation and shuttle programs for effective coccidiosis control.",
        "composition": "Maduramycin Ammonium Granulated – 1%.",
        "uses": "• Effective against E. tenella, E. necatrix, E. maxima, E. accervulina, and E. mitis.\n• Helps in the development of immunity in chickens, preventing further proliferation of coccidian strains resistant to synthetic anticoccidials.\n• Maintains stability of the active ingredient because of its unique granulated form.",
        "dosage": "500 g (5 ppm) per MT of finished feed.\nMaduracox 10 should not be used in laying hens or in hens whose eggs are intended for human consumption directly or indirectly.\nMaduracox 10 should be withdrawn in chickens 5 days before slaughter for human consumption.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Anticoccidial Feed Additive"
        },
        "images": [
          "/content/products/maduracox-10.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/maduracox-10/"
      },
      {
        "name": "MONENCOX",
        "slug": "monencox",
        "shortDescription": "Monencox is a monovalent polyether ionophore and a fermentation product of Streptomyces cinnamonensis with potent anti-coccidial activity against Eimeria spp. The granularity ensures homogeneous mixing and reduces wastage.",
        "composition": "Monensin Sodium – 20% Granular.",
        "uses": "• Broad spectrum activity and excellent coccidiosis control.\n• Improves weight gain and optimizes feed conversion.\n• Allows birds to develop natural immunity to coccidial infections.\n• Not deposited in the GIT and not deposited in muscles and organs.",
        "dosage": "450 to 550 g per ton of finished feed for broilers and chickens reared for laying up to 16 weeks.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Potent Ionophore Anti-coccidial",
          "withdrawalPeriod": "Meat : 1 day; Eggs : Not to be used in birds which produce eggs or egg products for human consumption"
        },
        "images": [
          "/content/products/monencox.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/monencox/"
      },
      {
        "name": "MONENCOX NCB",
        "slug": "monencox-ncb",
        "shortDescription": "Monencox NCB is a synergistic combination of Monensin and Nicarbazin, combining the capabilities of ionophores and synthetic compounds with synergistic results, offering flexibility and minimizing adverse effects. The granularity ensures homogeneous mixing and reduces wastage. The combination acts as a double tap and ensures immunity development.",
        "composition": "Monensin Sodium – 8%, and Nicarbazin – 8% Granular premix.",
        "uses": "• Broad spectrum activity and excellent coccidiosis control.\n• Improves weight gain and optimizes feed conversion.\n• Allows birds to develop natural immunity to coccidial infections.",
        "dosage": "500 g per ton of finished feed.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Potent Ionophore and Synthetic Compounds Anti-coccidial",
          "withdrawalPeriod": "Meat : Nil; Eggs : Not to be used in birds which produce eggs or egg products for human consumption"
        },
        "images": [
          "/content/products/monencox-ncb.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/monencox-ncb/"
      },
      {
        "name": "ROBECOX 100",
        "slug": "robecox-100",
        "shortDescription": "Robecox 100 is an ideal and effective clean-up anticoccidial to be used in programmes designed to prevent clinical and sub-clinical coccidiosis because of its broad-spectrum anticoccidial activity and unique chemical structure that prevents cross-resistance with other anticoccidial molecules.",
        "composition": "Robenidine Hydrochloride – 10%",
        "uses": "• Highly potent and effective anticoccidial for controlling all species of Eimeria.\n• Superior reduction of lesion score compared to other chemicals.\n• Less risk of necrotic enteritis.",
        "dosage": "Mix Robecox at a level of 300 to 500 g per MT of feed.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Thorough Clean-up Anti-coccidial",
          "withdrawalPeriod": "Meat : Remove all medicated feed 5 days before slaughter for human consumption.; Eggs : Not to be used in birds which produce eggs or egg products for human consumption"
        },
        "images": [
          "/content/products/robecox-100.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/robecox-100/"
      },
      {
        "name": "SALCOMAX 120",
        "slug": "salcomax-120",
        "shortDescription": "Salcomax 120 is a unique and free-flowing granular Salinomycin premix manufactured using advanced technology that ensures Salinomycin activity in every granule.",
        "composition": "Each kg of Salcomax 120 contains 120 g of Salinomycin, a monovalent ionophore anticoccidial.",
        "uses": "• Destroys cell structure, resulting in cell bursting and leading to the death of the coccidial organism.\n• Deprives the microorganisms of the energy required for their growth.\n• Helps in the customization of coccidiosis control programmes to your specific needs.\n• Stable in all types of premixes and feeds.",
        "dosage": "500 g per MT of feed corresponding to 60 ppm of Salinomycin.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Anticoccidial Feed Supplement"
        },
        "images": [
          "/content/products/salcomax-120.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/salcomax-120/"
      },
      {
        "name": "SYNERCOX",
        "slug": "synercox",
        "shortDescription": "Synercox is a unique combination of Maduramycin and Nicarbazin. The combination provides excellent coccidiosis control by combining different modes and sites of action of both drugs.",
        "composition": "Maduramycin – 0.75% and Nicarbazin – 8%.",
        "uses": "• Excellent coccidiosis control and broader protection.\n• Improves weight gain and optimizes feed conversion.\n• Allows birds to develop subtle immunity to coccidial infections.\n• Uniform mixing in feed and less wastage due to low dusting.",
        "dosage": "Thoroughly mix Synercox into feed at a level of 500 g per ton of feed to obtain a concentration of 3.75 mg of Maduramycin and 40 mg Nicarbazin per kg of feed, respectively.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Potent Ionophore Anti-coccidial",
          "withdrawalPeriod": "Meat : Nil; Eggs : Not to be used in birds which produce eggs or egg products for human consumption"
        },
        "images": [
          "/content/products/synercox.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/anticoccidials/synercox/"
      }
    ],
    "image": "/content/products/clopicox.jpg"
  },
  {
    "name": "Antimycoplasmals",
    "brand": "Avinova",
    "description": "Antimycoplasmals from the Avinova poultry health range.",
    "products": [
      {
        "name": "TIATEC 10",
        "slug": "tiatec-10",
        "shortDescription": "Tiatec 10 contains Tiamulin Hydrogen Fumarate, a semi-synthetic Pleuromutilin Antibiotic. It is highly effective against gram-positive bacteria and mycoplasmas in poultry. It does not directly affect Escherichia Coli, but exhibits an anti-adhesive effect, which facilitates the action of other antibiotics.",
        "composition": "Each kg contains:\nTiamulin Hydrogen Fumarate : 100 mg\nCarrier up to : 1 kg",
        "uses": "For prevention and control of Mycoplasmal infection (enzootic pneumonia, chronic respiratory disease) in chickens.",
        "dosage": "Layers/Breeders: 500 g of Tiatec 10 premix per MT of feed (50 ppm) for a week in a month throughout the laying period.\nBroilers: 300 g of Tiatec 10 premix per MT of feed (30 ppm) for a period of 3 to 5 weeks.\nFor improved performance and egg production: 100-200 g of Tiatec 10 premix per MT of feed (10-20 ppm) or as recommended by consultant.\n\nMethod of administration\nOrally, well homegenized into feed.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Tiamulin 10% Granulated Premix"
        },
        "images": [
          "/content/products/tiatec-10.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antimycoplasmals/tiatec-10/"
      },
      {
        "name": "TIATEC 80",
        "slug": "tiatec-80",
        "shortDescription": "Tiatec 80 contains Tiamulin Hydrogen Fumarate, a semi-synthetic Pleuromutilin Antibiotic. It is bacteriostatic and has a wide spectrum of activity, but particularly active against Mycoplasmas in poultry. It does not directly affect Escherichia Coli, but exhibits an anti-adhesive effect, which facilitates the action of other antibiotics. It has a synergistic activity with tetracyclines.",
        "composition": "Each kg contains:\nTiamulin Hydrogen Fumarate : 800 mg\nExcipients : Up to 1 g",
        "uses": "For prevention and control of Mycoplasmal infection (enzootic pneumonia, chronic respiratory disease) in chickens.",
        "dosage": "Prevention and treatment of CRD and infectious synovitis in broilers, replacement pullets, laying and breeding hens: 25 to 50 mg per kg bodyweight per day.\n\nMethod of administration\nOrally, well homegenized into feed.",
        "packSize": "500 g HDPE container",
        "specifications": {
          "brand": "Avinova",
          "profile": "Tiamulin Hydrogen Fumarate – 80% Microgranulated"
        },
        "images": [
          "/content/products/tiatec-80.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antimycoplasmals/tiatec-80/"
      },
      {
        "name": "TILCOVET 250",
        "slug": "tilcovet-250",
        "shortDescription": "Tilcovet 250 has a wide spectrum of activity against gram-positive organisms affecting poultry as well as gram-negative organisms. It is recommended primarily for respiratory diseases associated with Mycoplasma spp. and other bacteria sensitive to Tilmicosin.",
        "composition": "Tilcovet 250 oral solution contains 250 mg of Tilmicosin per ml. It is a semi-synthetic macrolide antibiotic obtained from Tylosin, which affects bacterial protein synthesis.",
        "uses": "• Prevention of respiratory infections associated with Mycoplasma gallisepticum and M. Synoviae\n• Potent against gram-positive and some gram-negative organisms.\n• Distribution of Tilmicosin happens across all the tissues, and its elimination is relatively slow, making it potent against bacteria with continuous effect.",
        "dosage": "For oral administration through drinking water\nPrevention: 10–15 mg/kg body weight for 3–5 days and repeat every 4–6 weeks.\nControl: 15 – 20 mg/kg body weight for 3-5 days and repeat every 4-6 weeks.\nOr as advised by a registered Veterinary Practitioner.",
        "packSize": "120 ml and 480 ml HDPE bottle",
        "specifications": {
          "brand": "Avinova",
          "profile": "A Semi-Synthetic Macrolide Antibiotic"
        },
        "images": [
          "/content/products/tilcovet-250.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antimycoplasmals/tilcovet-250/"
      },
      {
        "name": "TYLORATE-SP50",
        "slug": "tylorate-sp50",
        "shortDescription": "Tylorate-SP50 is a macrolide antibiotic with strong activity against gram-positive bacteria, mycoplasmas, and some gram-negative bacteria. It is used to treat and prevent respiratory infections such as Chronic Respiratory Disease (CRD) and mycoplasmosis. It works by inhibiting bacterial protein synthesis, promoting faster recovery, and improving overall health and productivity.",
        "composition": "Each g contains:\nTylosin Tartrate I.P : 500 mg\nExcipients : q.s",
        "uses": "• As an aid in the prevention, control, and treatment of Chronic Respiratory Disease caused by Mycoplasma gallisepticum and Infectious Synovitis caused by Mycoplasma synoviae in chicken.\n• As an aid in the prevention, control, and treatment of Necrotic Enteritis caused by Clostridium perfringens in chicken.",
        "dosage": "Chronic Respiratory Disease: 110-220 mg of Tylosin activity per kg body weight (1g of Tylorate-SP50 per 4.55-2.28 kg body weight) for 3-5 days or as advised by a registered veterinary practitioner.\nNecrotic Enteritis: 20-50 mg of Tylosin activity per kg body weight (1g of Tylorate-SP50 per 2.5-10 kg body weight) for 3-5 days or advised by a registered veterinary practitioner.\n\nMethod of administration\nTake the required quantity of Tylorate-SP50 in a container and add water into it. Do not add Tylorate-SP50 into water. Prepare a fresh solution every time just before the administration.",
        "packSize": "100 and 500 g",
        "specifications": {
          "brand": "Avinova",
          "profile": "Tylosin Tartrate – 50% w/w Soluble Powder",
          "withdrawalPeriod": "Meat: 1 day; Eggs: Nil"
        },
        "images": [
          "/content/products/tylorate-sp50.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antimycoplasmals/tylorate-sp50/"
      },
      {
        "name": "TYLOTEC 10",
        "slug": "tylotec-10",
        "shortDescription": "Tylotec 10 is a macrolide antibiotic with a bacteriostatic effect, inhibiting the synthesis of bacterial proteins. It does not directly act on some microbes like E. coli and Salmonella spp., but exerts an anti-adhesive effect (hindering their adhesion to the intestinal villi, their penetration through the intestinal mucous membrane and impeding their colonization phase as well).",
        "composition": "Each kg contains:\nTylosin Phosphate equivalent to Tylosin base 100 g.",
        "uses": "• For prevention and treatment of infections caused by Tylosin sensitive bacteria – mycoplasmosis, chronic respiratory disease and infectious synovitis in chicken and turkeys, spirochetosis (borreliosis) in chicken and infectious sinusitis in turkeys.\n\nBenefits\n• Has a wide spectrum of activity against gram-positive and some gram-negative bacteria – Streptococcus spp., Staphylococcus spp., Campylobacter coli, Pasteurella spp., Mycoplasma spp., some large viruses, including some anaerobic microbes.\n• Anticoccidial activity against Eimeria tenella.\n• Improves body weight gain and feed conversion efficiency in chicken.",
        "dosage": "200 to 500 grams of Tylotec 10 per MT of finished feed corresponding to 20-50 ppm of Tylosin, ensuring proper and homogenous mixing in the feed.",
        "packSize": "1 kg triple layer metallised polyester pouch and 25 kg multilayered bag.; 12 units of 1 kg packs in carton",
        "specifications": {
          "brand": "Avinova",
          "profile": "Tylosin Phosphate – 10% Granulated Premix"
        },
        "images": [
          "/content/products/tylotec-10.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antimycoplasmals/tylotec-10/"
      },
      {
        "name": "TYLVATEC SOLUBLE",
        "slug": "tylvatec-soluble",
        "shortDescription": "Tylvalosin, a macrolide antibiotic, acts by inhibiting protein synthesis, is highly active against mainly gram-positive bacteria, mycoplasma and some gram-negative bacteria. It exerts both bacteriostatic and bactericidal activity, demonstrating concentration and time dependent killing. It also acts intracellularly by reaching relatively high intracellular concentrations in phagocytic cells (macrophages and neutrophils) helping the innate immune system.",
        "composition": "62.5% w/w Tylvalosin as Tylvalosin Tartrate.",
        "uses": "• Treatment and metaphylaxis of Mycoplasmosis caused by susceptible strains of Mycoplasma gallisepticum, M. synoviae, other Mycoplasma species and diseases associated with Clostridium perfringens and Ornithobacterium rhinotracheale.\n\nBenefits\n• Excellent activity against Mycoplasma gallisepticum, M. synoviae, Clostridium perfringens & ORT.\n• Very low MIC and low MMC/MIC ratio, compared to other treatment choices, ensuring clinical efficacy.\n• Reduces and eliminates Egg Apex Abnormalities (EAA) associated with MS in commercial layers.\n• Good palatability unlike Tiamulin, with no drop in water, feed consumption or egg production.",
        "dosage": "Bird Type\nDosage Form\nDosage\n\n\nCommercial Broilers and Layers\nWater soluble\n20-25 mg tylvalosin/kg body weight for 3 days in day-old chicks\n\n\n15-25 mg tylvalosin/kg body weight for 2-3 days in the 3rd week\n\n\nFood Premix\n50 ppm tylvalosin in the 1st and 3rd weeks\n\n\n30 ppm tylvalosin for the first three weeks continuously\n\n\nBreeders\nWater soluble\n25 mg tylvalosin/kg body weight for 3 days for day-old chicks\n\n\n15-25 mg tylvalosin/kg body weight for 3 days in the 5th, 9th, 13th, and 17th weeks\n\n\nFood Premix\n50 ppm tylvalosin for 1 week every 4 weeks till end of lay\n\n\n30 ppm tylvalosin continuously till end of lay",
        "packSize": "100 g, 500 g & 10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "62.5% w/w Tylvalosin as Tylvalosin Tartrate",
          "withdrawalPeriod": "Meat and Offal: 2 days; Eggs: Nil"
        },
        "images": [
          "/content/products/tylvatec-soluble.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antimycoplasmals/tylvatec-soluble/"
      }
    ],
    "image": "/content/products/tiatec-10.jpg"
  },
  {
    "name": "Antiparasitics",
    "brand": "Avinova",
    "description": "Antiparasitics from the Avinova poultry health range.",
    "products": [
      {
        "name": "ECTOCYP",
        "slug": "ectocyp",
        "shortDescription": "Ectocyp is a powerful, non-systemic ectoparasiticide with a broad spectrum of activity against ticks, mites, flies, fleas, and lice. Formulated with a synthetic type II pyrethroid, it delivers a potent knockdown and killing effect. Ectocyp is designed for safe and effective use, featuring a high safety margin and non-cumulative properties. Its potency remains stable under sunlight and air, making it ideal for various environmental conditions.",
        "composition": "Cypermethrin High Cis 10% w/v.",
        "uses": "Prevention and control of infestation with ticks, mites, flies, fleas, and lice in Poultry, Cattle, Sheep, Dogs, and Farm premises.\n\nBenefits\n• Prevents transmission of ectoparasite-borne diseases.\n• Reduces ectoparasitic stress and improves productivity.\n• Maintains healthy skin and lustrous, glossy body coat.",
        "dosage": "Poultry: 3 to 5 ml per litre of water as a spray.\nCattle, Sheep, and Dogs: 1 ml per litre of water as a whole body spray or wash or dip, ensuring thorough coverage of preferential areas of parasites.\nFarm premises: 5 to 10 ml per litre of water per 25 sq. feet in empty shed premises.\nNote: Ectocyp is safe to be administered at any stage of pregnancy, lactation, or lay. For effective control of ectoparasites, Ectocyp has to be sprayed on the farm premises and sheds, especially on all crevices, walls, floors, etc., after removing all dirt and debris.",
        "packSize": "5 ml, 15 ml, 50 ml, and 1 litre aluminium containers with plastic measuring cups",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Effective Ectoparasiticide"
        },
        "images": [
          "/content/products/ectocyp.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antiparasitics/ectocyp/"
      },
      {
        "name": "MECTIMAX",
        "slug": "mectimax",
        "shortDescription": "Ivermectin is a broad-spectrum antiparasitic drug belonging to the Avermectin family, which constitutes a potent new class of anthelmintic agents. They are naturally derived products of microbial action, displaying an exceptionally wide range of antiparasitic efficacy against external and internal parasites of domestic animals.",
        "composition": "Each 10 ml contains Ivermectin – 12 mg.",
        "uses": "Poultry:\nInternal parasites like Nematodes, Capillaria spp. (crop worm) and Ascaridia spp. and external parasites like mite and lice infestations.\nSheep and Goats:\nGastrointestinal worms (adult and immature) – Cooperia spp., Haemonchus contortus, Ostertagia circumcinta, Trichostrongylus spp., Nematodirus spp., Oesophagostomum spp., Strongyloides papillosus and adult Chaberiat ovina.\nLungworms (adult and immature) – Dictyocaulus filaria.\nNasal bot (all larval stages) – Oestrus ovis.\nExternal parasites like tick, mite, and lice infestations.\nCalves and Cattle:\nGastrointestinal worms (adult and immature) – Ostertagia spp., Cooperia spp., Haemonchus placei, Trichostrongylus axei, Nematodirus spp., Oesophagostomum spp., Strongyloides spp., Bunostomum phlebotomum, Toxocara spp.\nLungworms – Dictyocaulus viviparus.\nExternal parasites like tick, mite, and lice infestations.",
        "dosage": "For oral administration:\nPoultry, Sheep, Goats, Calves, and Cattle: 0.2 mg per kg body weight or 1 ml per 6 kg body weight.\nFor control of ectoparasites (e.g., lice, mites, etc.), repeat treatment the following day.\nMedicated water should be used within 24 hours.\nAdditional dosage instructions for poultry:\n• Multiply the average weight of the birds to be treated with the number of birds.\n• Administer the quantity of Mectimax @ 1 ml per 6 kg body weight in 1/4th of the daily water consumption of the flock to be treated.\n• Withdraw normal fresh water 1 hour before administration.\n• Return to normal water after complete consumption of the medicated water.",
        "packSize": "1 litre HDPE bottles",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Endecto Parasiticide",
          "withdrawalPeriod": "Meat and Egg  : 14 days after the last administration.; Milk : 7 days after the last administration."
        },
        "images": [
          "/content/products/mectimax.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/antiparasitics/mectimax/"
      }
    ],
    "image": "/content/products/ectocyp.jpg"
  },
  {
    "name": "Poultry Disinfectants",
    "brand": "Avinova",
    "description": "Poultry Disinfectants from the Avinova poultry health range.",
    "products": [
      {
        "name": "PROFECT-N",
        "slug": "profect-n",
        "shortDescription": "Profect-N is a unique blend of powerful and compatible biocides, and it is highly effective even in the presence of organic matter. It has a broad-spectrum activity that is durable, non-corrosive, and effective against all types of pathogenic viruses, bacteria, fungi & protozoa. It is biodegradable, eco-friendly, and safe for human and animal life.",
        "composition": "Triple salt containing Potassium Monopersulphate, Potassium Hydrogen Sulphate, and Potassium Sulphate – 50% w/w.\nSodium Dichloroisocyanurate – 5% w/w\nExcipients – q.s",
        "uses": "• Potent surfactant with high acidic and oxidizing power ensures superior destruction of biofilms.\n• Reduces incidence of disease outbreaks.\n• Safe, stable, and proven in complex conditions.",
        "dosage": "Drinking water disinfection: 1 g per 10 litres of water or 1g per 5 litres during disease outbreaks.\nTerminal disinfection: 5 g per litre of water.\nBiofilm cleaning in pipelines: 10 g per litre of water for 5 to 6 hours or overnight.\nAerial spray (in the presence of birds): 5 g per litre of water.\nEgg disinfection, hatchery spray/mop: 5 to 10 g per liter of water.\n• Clean all surfaces thoroughly before application and remove all dirt and debris.\n• Apply through pressure washers (1 litre of Profect-N solution per 10 m2 of floor space) or in header tanks.\n• Allow 15-20 minutes contact time and wash thoroughly with clean water.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Highly Potent Broad Spectrum Sanitizer"
        },
        "images": [
          "/content/products/profect-n.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/disinfectants/profect-n/"
      },
      {
        "name": "SANIPRO",
        "slug": "sanipro",
        "shortDescription": "Sanipro is an effervescent water sanitizer designed for effective disinfection. It provides a fast-acting solution for sanitizing water, ensuring the elimination of harmful bacteria and pathogens. Sanipro’s effervescent formula makes it easy to use, offering reliable and safe water sanitation.",
        "composition": "Each uncoated tablet contains:\nSodium Dichloroisocyanurate (Anhydrous) IS  : 4.16 g\nAvailable Chlorine : 2400 mg",
        "uses": "• It is very effective against all types of microbes – bacteria, viruses, fungi, and other spores. It can be used for all types of sanitization procedures.\n• Stable even in the presence of organic matter and high water hardness.\n• Safe, odourless, highly soluble, economical, stable, and has minimal residual effect on treated surfaces and farm effluents.",
        "dosage": "Application\nDose Rate\n\n\nDW Sanitization (normal), misting, fogging, aquaculture ponds\n1 tab/500 litres\n\n\nDW Sanitization (mild contamination/disease outbreak)\n1 tab/250 litres\n\n\nCleaning of water systems\n1 tab/100 litres\n\n\nEgg mopping, hand sanitization\n1 tab/25 litres\n\n\nEquipment, vehicle, floor, and wall disinfection\n1 tab/5 litres\n\n\nFoot bath\n1 tab/2.5 litres",
        "packSize": "20 tablets per bottle and 100 bottles in a shipper",
        "specifications": {
          "brand": "Avinova",
          "profile": "Effervescent Water Sanitizer"
        },
        "images": [
          "/content/products/sanipro.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/disinfectants/sanipro/"
      }
    ],
    "image": "/content/products/profect-n.jpg"
  },
  {
    "name": "Enzymes",
    "brand": "Avinova",
    "description": "Enzymes from the Avinova poultry health range.",
    "products": [
      {
        "name": "ULTIPHYTE",
        "slug": "ultiphyte",
        "shortDescription": "Ultiphyte is a new-generation Phytase of bacterial origin produced from E. coli through submerged liquid fermentation with high yield. It catalyzes the stepwise release of inorganic orthophosphate from Phytate and improves the availability of phosphorous and other nutrients in the animal feed. It ensures excellent stability, high biological efficiency, and better performance.",
        "composition": "Each gram of Ultiphyte contains – Phytase – 5000 IU",
        "uses": "• Reduces the supplementation of expensive inorganic phosphorous in feed, thus reducing feed costs and increasing profitability. It reduces the excretion of phosphorous through manure by 40 to 60%, thereby reducing environmental pollution.\n• Improves FCR, daily weight gain, and flock uniformity.\n• Reduces the likely risk of heavy metal poisoning and microbial contamination caused by the use of DCP and other chemicals.\n• Reduces wet droppings and odour and improves litter quality, leading to less contamination.",
        "dosage": "60 to 100 g per ton of finished feed or as advised by a Nutritionist.",
        "packSize": "5 kg and 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Ultimate Phytase"
        },
        "images": [
          "/content/products/ultiphyte.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/enzymes/ultiphyte/"
      },
      {
        "name": "ZYMOMAX FORTE",
        "slug": "zymomax-forte",
        "shortDescription": "Zymomax Forte is a very unique blend of 11 microbial enzymes that takes care of various problems in poultry, like the effects caused by the presence of NSPs, Phytates, Galactosides, and ANFs in multiple feeds.",
        "composition": "It is a combination of α-Amylase, Cellulase, Xylanase, Pectinase, Phytase, Protease, Lipase, Hemicellulase, β-Galactosidase, β-Glucanase, and Mannanase.",
        "uses": "• Improves FCR.\n• Increases daily weight gain in broilers and the number of eggs in layers and breeders.\n• Optimizes the use of conventional and non-conventional feed ingredients.\n• Reduces wet droppings and odour and improves litter quality, leading to cleaner eggs.\n• Improves absorption efficiency of antibiotics, amino acids, and minerals.",
        "dosage": "200 g per ton of finished feed or as advised by a Nutritionist.",
        "packSize": "20 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "An Optimized Blend of Enzymes"
        },
        "images": [
          "/content/products/zymomax-forte.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/enzymes/zymomax-forte/"
      },
      {
        "name": "ZYMOMAX PRO",
        "slug": "zymomax-pro",
        "shortDescription": "Zymomax Pro is a high-performance, bacterial, and thermostable protease enzyme derived from Bacillus spp., and it is potentiated with spores of probiotics like Bacillus coagulans. It helps improve protein digestibility and optimal amino acid availability. It works on all kinds of protein sources, minimizes cost, and maximizes productivity.",
        "composition": "Protease enzyme (NLT 6 lakh units per gram) derived from Bacillus spp., and probiotics like Bacillus coagulans (NLT 1 billion CFU per gram).",
        "uses": "• It supports gut health by improving protein digestibility – reduces undigested protein entering the hind GI tract, and reduces protein fermentation in the large intestine.\n• Reduces protein levels without sacrificing performance due to its ability to get more from the existing protein.\n• It minimizes nitrogen output in manure and reduces ammonia emissions.\n• It improves productivity and performance while reducing the cost of production of feeds.",
        "dosage": "250 to 500 g per MT of finished feed, depending upon the feed formulation or as advised by a Nutritionist.",
        "packSize": "10 kg and 25 kg HDPE drums",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Ideal Protease Potentiated with Probiotics"
        },
        "images": [
          "/content/products/zymomax-pro.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/enzymes/zymomax-pro/"
      },
      {
        "name": "ZYMOMAX-XAP",
        "slug": "zymomax-xap",
        "shortDescription": "Zymomax-Xap is a unique and high-performance enzyme combination that helps improve the performance of modern diets. It targets soluble and insoluble fiber in the diet and releases encapsulated nutrients. It has high bio-efficacy to maximize starch digestibility and provides energy to fuel growth. It targets proteins and improves amino acid digestibility and starch accessibility.",
        "composition": "Each gram contains:\nXylanase  : 20000 units\nAmylase : 2000 units\nProtease : 40000 units\nCarrier : q. s",
        "uses": "• Reduces feed cost without compromising on bird performance.\n• Improves feed conversion ratio.\n• Free-flowing and dust-free, making it safe and convenient to handle.\n• Thermostable and can withstand pelleting temperatures up to 95o",
        "dosage": "100 g per MT of complete feed or as advised by a Nutritionist.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "A Unique and High-Performance Enzyme Combination"
        },
        "images": [
          "/content/products/zymomax-xap.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/enzymes/zymomax-xap/"
      }
    ],
    "image": "/content/products/ultiphyte.jpg"
  },
  {
    "name": "Fly Control",
    "brand": "Avinova",
    "description": "Fly Control from the Avinova poultry health range.",
    "products": [
      {
        "name": "LARVISTAT 100",
        "slug": "larvistat-100",
        "shortDescription": "Larvistat 100 is a triazine derivative and an insect growth regulator developed for the control of fly larvae in manure and other breeding sites in animal housing. It interferes with the molting process of larvae and pupation, leading to deformed or/and dead larvae, pupae, and adults. It mainly affects the dipteran larval molt in the first larval stages (L1, L3), and its effect on the last larval stage (L3) is limited.",
        "composition": "Each kg contains Cyromazine: 100 mg.",
        "uses": "• Improves productivity and performance while improving appetite and increasing feed intake.\n• Control fly larvae in poultry farms.\n• No cross-resistance development.\n• Poorly metabolized and excreted, it is unchanged in retaining effectiveness.\n• Improves litter quality by reducing unwanted noxious gases like Ammonia (NH3) and Hydrogen Sulphide (H2S)",
        "dosage": "50 g per ton of feed or as recommended by a Nutritionist.\nDirections for use:\nMix the recommended quantity of Larvistat 100 with the finished feed after the preparation of the premix. Start the usage when flies become active and continue for 4-6 weeks or until the fly population is under control.\nAdulticide is recommended after each usage of Larvistat 100 in order to control the influx of adult flies from external sources.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Insect Growth Regulator"
        },
        "images": [
          "/content/products/larvistat-100.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/fly-control/larvistat-100/"
      },
      {
        "name": "LARVISTAT GOLD",
        "slug": "larvistat-gold",
        "shortDescription": "Larvistat Gold offers excellent solutions for solving the fly menace, facilitating growth, nutrient utilization, and obtaining a return on investment, and it makes you stress-free. It is highly effective with contact action interfering with molting, chitin biosynthesis & deposition, pupation, and growth of fly larvae. It possesses good antimicrobial, antioxidant, astringent, and stimulant properties.",
        "composition": "Larvistat Gold contains Cyromazine, potentiated with Polyguanidine butyrate, a natural polymer, allicin, curcumin, cinnamon tannins, cinnamon oil, and zinc curcuminates.",
        "uses": "• Improves productivity, performance, appetite, feed intake, FCR, and survival rate.\n• Control fly larvae in poultry farms.\n• Reduces the pathogen load in feed and intestine because of its strong antimicrobial properties.\n• Reduces intestinal motility and acts as an anti-diarrhoeal.\n• Improves litter quality by reducing unwanted noxious gases like Ammonia (NH3) and Hydrogen Sulphide (H2S).\n• Allows food to stay for a longer time in the intestine and helps in better absorption of nutrients.",
        "dosage": "125 g per MT of finished feed or as recommended by a consultant.\nDirections for use:\nMix the recommended quantity of Larvistat Gold with the finished feed after the preparation of the premix. Start the usage when flies become active and continue for 4-6 weeks or until the fly population is under control.\nAdulticide is recommended after each usage of Larvistat Gold in order to control the influx of adult flies from external sources.",
        "packSize": "1 kg and 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Insect Growth Regulator and Non-Antibiotic Antimicrobial"
        },
        "images": [
          "/content/products/larvistat-gold.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/fly-control/larvistat-gold/"
      },
      {
        "name": "LARVISTAT NATURA",
        "slug": "larvistat-natura",
        "shortDescription": "Larvistat Natura makes the litter dry and effectively addresses the issue of preventing fly breeding. By ensuring dry litter, Larvistat Natura facilitates larval control and, in turn, fly control.",
        "composition": "It is a synergistic blend of non-chemical, non-toxic, and specially processed natural minerals, natural complex polysaccharides, yucca saponins, and garlic essential oil.",
        "uses": "• Aids in effective fly control in dung, litter, and droppings and control of storage pests.\n• Increases protein utilization, as it slows down the peristaltic movement of feed inside the intestine. Hence, it directly reduces the release of ammonia and methane.\n• Help reduce ammonia concentrations and odour in litter.\n• Improvement in feed conversion ratio.",
        "dosage": "3 kg per MT of compounded animal feed or as recommended by a Nutritionist.",
        "packSize": "25 kg paper bag with inner & outer liner",
        "specifications": {
          "brand": "Avinova",
          "profile": "Feed Through Fly Control. Natural Toxin Binder. Pellet Binder"
        },
        "images": [
          "/content/products/larvistat-natura.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/fly-control/larvistat-natura/"
      },
      {
        "name": "LARVISTAT SUPER",
        "slug": "larvistat-super",
        "shortDescription": "Larvistat Gold offers excellent solutions for solving the fly menace, facilitating growth, nutrient utilization, and obtaining a return on investment, and it makes you stress-free. It is highly effective with contact action interfering with molting, chitin biosynthesis & deposition, pupation, and growth of fly larvae.",
        "composition": "Larvistat Gold contains:\nCyromazine – 4%\nHalquinol – 48%\nAllicin – 2%\nZeolites – q.s",
        "uses": "• Improves productivity, performance, appetite, feed intake, FCR, and survival rate.\n• Control fly larvae in poultry farms.\n• Reduces the pathogen load in feed and intestine because of its strong antimicrobial properties.\n• Reduces intestinal motility and acts as an anti-diarrhoeal.\n• Improves litter quality by reducing unwanted noxious gases like Ammonia (NH3) and Hydrogen Sulphide (H2S).\n• Allows food to stay for a longer time in the intestine and helps in better absorption of nutrients.",
        "dosage": "125 g per MT of finished feed or as recommended by a consultant.\nDirections for use:\nMix the recommended quantity of Larvistat Gold with the finished feed after the preparation of the premix. Start the usage when flies become active and continue for 4-6 weeks or until the fly population is under control.\nAdulticide is recommended after each usage of Larvistat Gold in order to control the influx of adult flies from external sources.",
        "packSize": "1 kg and 10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Insect Growth Regulator and Non-Antibiotic Antimicrobial"
        },
        "images": [
          "/content/products/larvistat-super.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/fly-control/larvistat-super/"
      }
    ],
    "image": "/content/products/larvistat-100.jpg"
  },
  {
    "name": "Immunomodulators",
    "brand": "Avinova",
    "description": "Immunomodulators from the Avinova poultry health range.",
    "products": [
      {
        "name": "IMMULATOR",
        "slug": "immulator",
        "shortDescription": "Immulators help birds grow better and stay healthy by feeding and strengthening the immune system, as well as improving gut health by reducing inflammation and supporting the gut.",
        "composition": "Immulator is a unique and novel combination of optimal concentrations of Beta Glucans, Nucleotides, Natural Peptides, Selenium, Vitamin E, Vitamin B6, Allicin, Curcumin, Eugenol, Tributyrins, & Betaine, fortified with phytochemical principles of Capsicum, Ginger, Valerian, and Asphaltum to provide immunity and fight against various harmful microbes affecting poultry.",
        "uses": "• Improves growth, performance, FCR, weight gain, and livability and lowers the mortality rate of birds.\n• Helps in intestinal immune-modulation & pathogen binding. It acts as a nutrient source for gut microbiota & as an energy source for immune cells and intestinal mucosa.\n• Improves intestinal integrity and helps in the development of healthy GIT microbiota.\n• Stimulates non-specific immunity and improves titre and efficacy of vaccines.",
        "dosage": "2-3 ml per litre of drinking water for 3-5 days or as advised by the Poultry Nutritionist.",
        "packSize": "1000 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Superlative Immune Booster"
        },
        "images": [
          "/content/products/immulator.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/immunomodulator/immulator/"
      }
    ],
    "image": "/content/products/immulator.jpg"
  },
  {
    "name": "NAGPs",
    "brand": "Avinova",
    "description": "NAGPs from the Avinova poultry health range.",
    "products": [
      {
        "name": "NAGROMUNE",
        "slug": "nagromune",
        "shortDescription": "Nagromune is a rich source of free Nucleotides & Nucleosides, Short Chain Polypeptides, MOS, and β-Glucans, derived from GMO-free, purified yeast cell walls of Saccharomyces Cerevisiae for better intestinal villi & organ growth, efficient feed conversion, growth, productivity, and immunity.",
        "composition": "Nucleotides & Nucleosides, MOS, β-Glucans, Peptides & Polypeptides, and Glutamine.",
        "uses": "• Enhances immunity, improves health status, and helps to prevent mortality.\n• Helps in better intestinal villi integrity & organ growth and thereby improves feed efficiency.\n• Stable during pelleting and extrusion processes.\n• Actively supports rapid tissue turnover during phases of growth, reproduction, stress, and disease.\n• Compatible with other feed additives and not affected by ionophores or antibiotics.",
        "dosage": "500 g to 2.5 kg per MT of finished feed or as advised by a Nutritionist.",
        "packSize": "10 kg and 25 kg multi-layered bags",
        "specifications": {
          "brand": "Avinova",
          "profile": "Non-antibiotic Growth Promoter"
        },
        "images": [
          "/content/products/nagromune.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nagps/nagromune/"
      },
      {
        "name": "NAGRONEX ESF",
        "slug": "nagronex-esf",
        "shortDescription": "Nagronex ESF helps in increasing intestinal dimensions and the villus height/crypt depth ratio, which leads to a wider surface area for the absorption of nutrients and electrolytes, thus combating villus atrophy and promoting intestinal integrity.",
        "composition": "Nagronex ESF is a synergistic combination of essential oils such as Oregano, Clove, Cinnamon & Eucalyptus, and short-chain fatty acids with Antibacterial, Antiviral, Antifungal, Cocciodiostatic and antioxidant properties that promote performance and productivity.",
        "uses": "• Promotes good bacteria, and its strong antimicrobial action helps reduce gut diseases and improve gut health.\n• Keeps the intestines healthy, boosts the immune system, and antioxidant property protects cells and stimulates natural enzyme production for better digestion.\n• Significantly boosts growth, egg production, egg quality, and feed efficiency.\n• Lowers mortality rates and prevents protozoan infections.",
        "dosage": "100 grams per MT of feed or as advised by the Poultry Nutritionist.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Phytobiotic Growth Promoter"
        },
        "images": [
          "/content/products/nagronex-esf.jpg"
        ],
        "isFeatured": true,
        "source": "https://provet.in/products/avinova/nagps/nagronex-esf/"
      },
      {
        "name": "NAGRONEX SNB",
        "slug": "nagronex-snb",
        "shortDescription": "Nagronex SNB is a special feed additive for poultry that combines a probiotic and a prebiotic. It is designed to support medicated feed programs and provide an alternative to some antibiotics used in poultry farming.",
        "composition": "Nagronex SNB is a combination of Bacillus Subtilis, Yeast Cell Wall Extract, and Zoo-Technical Additives.",
        "uses": "• Better gut health leads to stronger and healthier birds.\n• Improves feed efficiency and reduces disease – lower production costs.\n• Reduces contamination in eggs and meat, contributing to safer food production.\n• Enhances the birds’ natural defenses, leading to overall health and reduced mortality.",
        "dosage": "450 grams per MT of complete feed or as advised by the Poultry Nutritionist.",
        "packSize": "10 kg and 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Novel Synbiotic Feed Additive"
        },
        "images": [
          "/content/products/nagronex-snb.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nagps/nagronex-snb/"
      },
      {
        "name": "NAGROWALL",
        "slug": "nagrowall",
        "shortDescription": "Nagrowall is a functional fiber with prebiotic properties derived from highly purified Saccharomyces Cerevisia yeast cell walls. It helps boost immunity and pathogen agglutination of Salmonella spp and E. coli.",
        "composition": "Nagrowall, among all the cell wall extracts present in the market, offers the highest concentrations of beta-glucans and MOS.\nNagrowall, among all the cell wall extracts present in the market, offers the highest concentrations of beta-glucans and MOS.",
        "uses": "• 95% of agglutination of Salmonella spp. and 90% agglutination of E. coli.\n• Prevents diarrhea and boosts the immune status of young animals.\n• Helps offset pathogenic bacteria challenge in farms\n• Helps alleviate chronic mycotoxin contamination.\n• 95% of agglutination of Salmonella spp. and 90% agglutination of E. coli.\n• Prevents diarrhea and boosts the immune status of young animals.\n• Helps offset pathogenic bacteria challenge in farms\n• Helps alleviate chronic mycotoxin contamination.",
        "dosage": "Broilers\nAll stages: 0.5 – 1 kg per ton of finished feed\nLayers\nGrowers: 1 kg per ton of finished feed\nLayers: 1 kg per ton of finished feed\nBroilers\nAll stages: 0.5 – 1 kg per ton of finished feed\nLayers\nGrowers: 1 kg per ton of finished feed\nLayers: 1 kg per ton of finished feed",
        "packSize": "25 kg; Non-antibiotic Growth Promoter; Nagrowall is a functional fiber with prebiotic properties derived from highly purified Saccharomyces Cerevisia yeast cell walls. It helps boost immunity and pathogen agglutination of Salmonella spp and E. coli.; 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Non-antibiotic Growth Promoter"
        },
        "images": [
          "/content/products/nagrowall.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nagps/nagrowall/"
      }
    ],
    "image": "/content/products/nagromune.jpg"
  },
  {
    "name": "Poultry Nutritional Supplements",
    "brand": "Avinova",
    "description": "Poultry Nutritional Supplements from the Avinova poultry health range.",
    "products": [
      {
        "name": "AVIGRA",
        "slug": "avigra",
        "shortDescription": "Avigra is a unique and innovative blend of vitamins, minerals, essential fatty acids, and chito oligosaccharides fortified with herbal extracts for improving fertility and hatchability. It can be used specifically in middle age flocks to improve semen yield and fertility. It can also be used on female breeders and to enhance performance in commercial layers.",
        "composition": "Vitamins, Minerals, Essential Fatty Acids, Chito Oligosaccharides, and Herbal Extracts.",
        "uses": "• Increases semen quality, volume, viscosity, and color (pearly white).\n• Increases sperm motility and mass activity.\n• Improves libido, semen release, sexual performance, and reduces stress.\n• Increases the testicle size, aids in early maturity & increases the Sertoli cell mass when given for 10 days between 21 and 24 weeks.\n• Increases the number of saleable chicks per parent.",
        "dosage": "Male Breeders:\nThe recommended usage of Avigra in male breeders is 0.5 ml per bird for 10 days continuously in a month from the start of the laying period (24 weeks) up to culling.\nMethod of use:\n• Mix 500 ml of Avigra with 1500 ml of drinking water.\n• Add this 2000 ml of the solution into 5 kg of feed, mix it properly, and make a wet mash.\n• Top dress this wet mash in the feeder for 1000 males.\n• Reduce this 5 g feed in morning allowance.",
        "packSize": "1000 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "The Ultimate Fertility and Hatchability Enhancer"
        },
        "images": [
          "/content/products/avigra.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nutritional-supplements/avigra/"
      },
      {
        "name": "AVIGRA DM",
        "slug": "avigra-dm",
        "shortDescription": "Avigra DM is a unique and innovative blend of vitamins, minerals, essential fatty acids, and chito oligosaccharides fortified with herbal extracts to improve fertility in the male parent stock. It can be used specifically in middle age flocks to improve semen yield and fertility.",
        "composition": "Vitamins, Minerals, Essential Fatty Acids, Chito Oligosaccharides, and Herbal Extracts.",
        "uses": "• Increases semen quality, volume, viscosity, and color (pearly white).\n• Increases sperm motility and mass activity.\n• Improves libido, semen release, sexual performance, and reduces stress.\n• Increases the testicle size, aids in early maturity & increases the Sertoli cell mass when given in alternate weeks between 18 and 24 weeks.",
        "dosage": "0.5 g per bird per day continuously for ten days in a month. To be repeated every month.",
        "packSize": "500 g",
        "specifications": {
          "brand": "Avinova",
          "profile": "Improves Semen Quality, Vigor, and Vitality"
        },
        "images": [
          "/content/products/avigra-dm.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nutritional-supplements/avigra-dm/"
      },
      {
        "name": "EGANCE",
        "slug": "egance",
        "shortDescription": "Egance is a premium supplement formulated with a blend of essential nutrients to support overall health and vitality. It offers a holistic approach to wellness, promoting strength, immunity, and well-being.",
        "composition": "Egance is an innovative and synergistic blend consisting of optimal quantities of the following components: Calcium & Phosphorous, Vitamin C, Vitamin D3, Essential Fatty Acids, Xanthophylls, Asphaltum, and Herbal Extracts.",
        "uses": "• Increases egg number and decreases egg breakage.\n• Improve fertility and immunity.\n• Improves egg yolk color.\n• Decreases thin-shelled eggs.\n• Increases egg size.",
        "dosage": "500 g per MT of complete feed or as advised by a Nutritionist",
        "packSize": "1 kg, 10 kg, and 25 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "EGGcellence Naturally"
        },
        "images": [
          "/content/products/egance.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nutritional-supplements/egance/"
      },
      {
        "name": "GALPROMIN XL",
        "slug": "galpromin-xl",
        "shortDescription": "Galpromin XL is a nutritional supplement containing optimum quantities of minerals and amino acids that help enhance performance and productivity.",
        "composition": "Galpromin XL contains optimum quantities of amino acids, lactic acid, tricholine citrate, natural antioxidants, betaine, sodium, sodium, phosphorous, magnesium, iron, copper, cobalt, manganese, selenium, and zinc in a suitable base.",
        "uses": "• Improves growth and body weight.\n• Improve egg production and egg quality.\n• Makes up for mineral deficiencies and amino acid requirements.\n• Acts as a support during lameness.\n• Overcomes various stress conditions.",
        "dosage": "Layers: 10 to 20 ml per 100 birds through water\nBroilers: 5 t0 10 ml per 100 birds through water\nOr as advised by the nutritionist.",
        "packSize": "1000 ml and 5000 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Nutritional Combination of Minerals and Amino Acids"
        },
        "images": [
          "/content/products/galpromin-xl.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nutritional-supplements/galpromin-xl/"
      },
      {
        "name": "PEPTONIC GOLD",
        "slug": "peptonic-gold",
        "shortDescription": "Peptonic Gold is an innovative and unique natural growth promoter that helps enhance productivity and performance in farm animals. It improves the performance of mycotoxin binders and helps in quick relief from renal and hepatic damage.",
        "composition": "Peptonic Gold is an optimized blend of Vitamins, Choline Chloride, FOS, Betaine, Amino Acids, Yeast Extract, Beta Glucan, Esterified Acetic Acid, Esterified Butyric Acid, Acetic Acid, Formic Acid, Propionic Acid, Essential Oils, Plant Extracts, and Essential Fatty Acids.",
        "uses": "• Improves intestinal integrity and helps in the development of healthy GIT microbiota.\n• Improve growth, performance, FCR, and weight gain.\n• Enhances the immune system and lowers the mortality rate.\n• Improves egg-shell quality and laying performance.\n• Helps in preventing fatty liver syndrome.\n• Has no residues, no withdrawal period, and does not generate bacterial resistance.",
        "dosage": "0.5 ml per litre of drinking water or as recommended by a Nutritionist.\nBroilers: As a natural growth promoter during the first 7 days and last 7 days of the production cycle and for 3 days during stress conditions like vaccination and diseases.\nBreeders and Layers: As a natural growth promoter during the first 7 days of the production cycle and for 7 to 14 days during stress conditions like vaccination, diseases, and production drops.",
        "packSize": "500 ml, 1000 ml, and 5000 ml",
        "specifications": {
          "brand": "Avinova",
          "profile": "Natural Growth Promoter"
        },
        "images": [
          "/content/products/peptonic-gold.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nutritional-supplements/peptonic-gold/"
      },
      {
        "name": "YEASELPRO",
        "slug": "yeaselpro",
        "shortDescription": "Yeaselpro is produced from specially selected Saccharomyces Cerevisiae yeast, which is developed to absorb inorganic Selenium from media naturally. Through yeast metabolism, Selenium gets chelated with amino acids, resulting in organic forms known as Selenomethionine (SeMet) and Selenocysteine (SeCys), which are the ideal forms of absorption. It helps improve immunity, reproductive efficiency, enzymatic action, and other vital functions.",
        "composition": "Selected Saccharomyces Cerevisiae Yeast.",
        "uses": "• Improves egg quality & freshness; promotes fertility, hatchability, and chick survival in poultry.\n• Improves fertility and reduces the incidence of retained placenta in cattle.\n• Improves health and immunity in fish.",
        "dosage": "Or as advised by a Nutritionist or Aquaculture Consultant.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Yeast Selenium"
        },
        "images": [
          "/content/products/yeaselpro.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/nutritional-supplements/yeaselpro/"
      }
    ],
    "image": "/content/products/avigra.jpg"
  },
  {
    "name": "Other Poultry Products",
    "brand": "Avinova",
    "description": "Other Poultry Products from the Avinova poultry health range.",
    "products": [
      {
        "name": "RESPROSOL",
        "slug": "resprosol",
        "shortDescription": "Resprosol, a phytobiotic, is supportive of antibacterials in the control and effective management of respiratory conditions like CRD, Infectious Coryza, and IB.",
        "composition": "Resprosol is an optimized combination of natural herbs such as Curcuma longa (Turmeric), Justicia adhatoda (Vasaka), Terminalia bellirica (Bahera), Ocimum sanctum (Tulsi), Glycyrrhiza glabra (Mulethi), Zingiber officinale (Ginger), Piper longum (Long Pepper) in a suitable and compatible base.",
        "uses": "• Aids in quick relief from all types of respiratory problems.\n• Relieves respiratory congestion of any origin and clears occlusions in air passages.\n• Provides fast relief from dyspnoea and respiratory rales.\n• Minimizes incidence of secondary bacterial complications.\n• No residues, no drug resistance, and no withdrawal period.",
        "dosage": "Drinking water application for 100 birds for 3-5 days:\nChicks – 5 ml\nGrowers and Broilers – 10 ml\nLayers and Breeders – 15 ml\nOr as advised by a Registered Veterinary Practitioner\nAerial spray/farm fogging application:\n40 ml per litre of water per 1000 cubic feet or as advised by a Registered Veterinary Practitioner.",
        "packSize": "1 litre and 5 litres",
        "specifications": {
          "brand": "Avinova",
          "profile": "Phytobiotic for Respiratory Health"
        },
        "images": [
          "/content/products/resprosol.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/others/resprosol/"
      }
    ],
    "image": "/content/products/resprosol.jpg"
  },
  {
    "name": "Poultry Probiotics",
    "brand": "Avinova",
    "description": "Poultry Probiotics from the Avinova poultry health range.",
    "products": [
      {
        "name": "PRONEXIN",
        "slug": "pronexin",
        "shortDescription": "Pronexin is a scientifically formulated blend of non-pathogenic and pure microbial cultures of probiotic strains in a stable, compatible, and nutritious base for improving performance and productivity in poultry.",
        "composition": "Each gram of Pronexin contains a total viable count of NLT 2 x 109 (2 billion) CFU of the following strains: Bacillus coagulans, Bacillus subtilis, Bacillus licheniformis, Lactobacillus acidophilus, Lactobacillus plantarum, Saccharomyces cerevisiae, Lactobacillus rhamnosus, Enterococcus faecium and Bifidobacterium bifidum that aids in better performance & productivity, optimum gut health and nutrient utilization.",
        "uses": "• Inhibits the growth of pathogenic bacteria by competitive exclusion and increases disease resistance.\n• Improves the rate of intestinal growth in chicks.\n• Improves digestion, uptake of nutrients, and mineral absorption.\n• Aids in the synthesis of digestive enzymes by birds.\n• Helps in maintaining favorable and optimum gut pH.",
        "dosage": "Chicks: 1 g per litre of drinking for the first 5-7 days of life.\nAdult birds: 1 g per 4 litres of drinking water for 5 days.\nOr as recommended by a consultant.",
        "packSize": "100g, 500 g, and 1 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Highly Potent and Soluble Multi-Strain Probiotic Supplement"
        },
        "images": [
          "/content/products/pronexin.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/probiotic/pronexin/"
      }
    ],
    "image": "/content/products/pronexin.jpg"
  },
  {
    "name": "Poultry Toxin Binders",
    "brand": "Avinova",
    "description": "Poultry Toxin Binders from the Avinova poultry health range.",
    "products": [
      {
        "name": "SYNTOBIND",
        "slug": "syntobind",
        "shortDescription": "Syntobind binds multiple mycotoxins and has a high affinity to adsorb even low concentrations of mycotoxins, improving overall performance and productivity.",
        "composition": "Syntobind is a unique and synergistic blend of dipolar and treated HSCAS, sodium bentonite, activated carbon, buffered organic acids and their salts, MOS, Bacillus subtilis, and Andrographis paniculata (Kalmegh).",
        "uses": "• Does not bind essential nutrients like vitamins & minerals, and it is effective at low inclusion levels.\n• Acts fast in the digestive tract, and it is stable over a wide pH range.\n• Improves egg production and shell quality.\n• Protects and corrects liver.\n• Protects the intestinal mucosa from the damaging effects of mycotoxins.",
        "dosage": "500 g to 1 kg per MT of feed or as advised by the nutritionist.",
        "packSize": "20 kg",
        "specifications": {
          "brand": "Avinova",
          "profile": "Broad Spectrum Mycotoxin Binder, Mould Inhibitor, and Hepatoprotector"
        },
        "images": [
          "/content/products/syntobind.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/avinova/toxin-binder/syntobind/"
      }
    ],
    "image": "/content/products/syntobind.jpg"
  },
  {
    "name": "Ammonia Reducers",
    "brand": "Blunova",
    "description": "Ammonia Reducers from the Blunova aquaculture range.",
    "products": [
      {
        "name": "DYNABLEND",
        "slug": "dynablend",
        "shortDescription": "An optimized combination of Dynablend provides adequate colony forming units of beneficial bacteria along with essential enzymes to help breakdown sludge, food waste particles, improve digestion and reduce ammonia & hydrogen sulphide",
        "composition": "Dynablend is an innovative and optimized combination of Yucca schidigera, adequate number of colony forming units of various probiotics such as Bacillus spp., Lactobacillus achidophilus & Saccharomyces cerevisiae and enzymes such as Protease, Amylase, Lipase, Beta-Glucanase, Xylanase & Cellulase fortified with Nitrifying & Denitrifying bacteria in a compatible base.",
        "uses": "• Inhibits urease activity.\n• Reduces the ammonia & H2S concentration.\n• Prevents the pathological bacterial growth.\n• Reduces odour & sludge.\n• Provides helpful bacteria & essential enzymes to breakdown sludge & superfluous food.\n• Helps to stabilize beneficial bacteria in the gut preventing growth of harmful bacteria.\n• Prevents diseases like black gills, swollen gills, tail rot, and necrosis of appendages.",
        "dosage": "Preventio : 500 g/acre of pond to be repeated every 10 to 15 days.\nControl : 1 kg to 1.5 kg/acre of pond to be repeated every 10 to 15 days.\nOr as advised by the Aquaculture Consultant\n\nMethod of administration\nMix the required quantity of Dynablend in water and spread in pond water.",
        "packSize": "500 g & 1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Stable Combination for Reducing Ammonia"
        },
        "images": [
          "/content/products/dynablend.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/ammonia-reducers/dynablend/"
      },
      {
        "name": "ENVIPRO GOLD",
        "slug": "envipro-gold",
        "shortDescription": "Envipro Gold is an excellent urease inhibitor. It improves digestion, assimilation, and immunity, as it reduces the movement of feed through gut, which in turn reduces the loss of nitrogen through droppings. It acts as an antimicrobial, antioxidant, immunostimulant and carminative. It is non-toxic and biodegrable, and has no withdrawal period.",
        "composition": "Envipro Gold contains actives such as Polyphenols & Triterpernoid Saponins, which react with ammonia in the ponds and reduce free ammonia levels significantly.",
        "uses": "• Reduces ammonia and other noxious gases.\n• Prevents growth of pathogenic bacteria.\n• Enhances the activity of intestinal enzyme system.\n• Improvs feed intake & growth.\n• Helps relieve stress and improves survival rate.",
        "dosage": "Pond application : 250 ml/acre of pond water. To be repeated every 10 to 15 days.\nFeed application : 1ml/kg of food.\nOr as advised by the Aquaculture Consultant",
        "packSize": "500 ml",
        "specifications": {
          "brand": "Blunova",
          "profile": "Phytobiotic Ammonia Binder"
        },
        "images": [
          "/content/products/envipro-gold.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/ammonia-reducers/envipro-gold/"
      },
      {
        "name": "NITRISOL HP",
        "slug": "nitrisol-hp",
        "shortDescription": "Nitrisol HP is highly potent in controlling nitrite levels in aqua ponds and reduces nitrates to nitrogen while oxidizing elemental sulphur and reducing sulphur compounds (S2-, S2O32-, SO32) to sulphates.",
        "composition": "Nitrisol HP is a unique combination of optimized colony forming units of Bacillus spp, Nitrifying and Denitrifying strains of Probiotics fortified with Yucca Schidigera, Thiobacillus denitrificans, Nitrosomanas eutropha, and Nitrobacter Winogradskyi.",
        "uses": "• Removes nitrogen from pond effectively. Solubilizes phosphates and cleans the pond water.\n• Prevent growth of vibrio spp. and suppresses the growth of undesirable microbes in ponds.\n• Converts nitrites into nitrates to improve water quality.\n• Decomposes waste & organic matter, and reduce growth of fungus.\n• Breaks the cycle of formation of nitrites in aqua ponds.",
        "dosage": "The solution prepared by mixing Nitrisol Pack 1 & Pack 2 should be mixed in one acre of pond water or as advised by an aquaculture consultant.",
        "packSize": "Pack 1 Powder: 500 gm; Pack 2 Liquid: 1 L",
        "specifications": {
          "brand": "Blunova",
          "profile": "A Complete Solution for Nitrites"
        },
        "images": [
          "/content/products/nitrisol-hp.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/ammonia-reducers/nitrisol-hp/"
      }
    ],
    "image": "/content/products/dynablend.jpg"
  },
  {
    "name": "Aqua Disinfectants & Sanitizers",
    "brand": "Blunova",
    "description": "Aqua Disinfectants & Sanitizers from the Blunova aquaculture range.",
    "products": [
      {
        "name": "BENZATEC BR20",
        "slug": "benzatec-br20",
        "shortDescription": "Benzatec BR20 is a cationic surfactant, which works by denaturing the proteins of the bacterial and fungal cells, affecting the metabolic reactions of the cells and causing vital substances to leak out, thereby causing death. The phyto-compound properties of  Benzatec – BR20 has potent antibacterial properties against the most common bacterial pathogens affecting fish & shrimps. It is an effective fungicide and has immunomodulatory function which help in preventing the occurrence of diseases.",
        "composition": "Benzatec BR20 is an innovative combination of ADBAB – 20% and Cinnamaldehyde – 1%, potentiated with suitable stabilizers and activators.",
        "uses": "• Prevention and control of bacterial, fungal, protozoal, and algal infections in aquaculture ponds.\n• Prevention and control of antenna rot, tail rot, gill rot, red gill, fin rot, and muscle necrosis in prawns and shrimps.",
        "dosage": "Pond water disinfection : 250 – 500 ml per acre per meter water depth\nOr as advised by the Aquaculture Consultant",
        "packSize": "1000 ml and 5000 ml",
        "specifications": {
          "brand": "Blunova",
          "profile": "Powerful and Proven Biocide and Deodarant"
        },
        "images": [
          "/content/products/benzatec-br20.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/disinfectants-and-sanitizers/benzatec-80/"
      },
      {
        "name": "PROFECT PLUS",
        "slug": "profect-plus",
        "shortDescription": "Profect-Plus is the most proven, fast-acting, and non-corrosive broad-spectrum sanitizer that is effective against all types of pathogenic viruses, bacteria, fungi, and protozoa.",
        "composition": "Profect-Plus is a triple salt containing Potassium Monopersulphate, Potassium Hydrogen Sulphate, & Potassium Sulphate with Sodium Dichloroisocyanurate (NaDCC) in combination with required excipients that help reduce the incidence of disease outbreaks and enhance survivability.",
        "uses": "• Effective against a wide range of aquatic pathogens, including White Spot Virus (WSSV) and Monodon Baculo Virus (MBV) and bacteria such as Vibrio spp.\n• Potent surfactant with high acidic and oxidizing power ensuring superior destruction of biofilms\n• Does not affect water quality, dissolved oxygen levels, and phytoplankton in the pond.\n• Biodegradable, eco-friendly & safe for human and animal life.",
        "dosage": "Aquaculture Hatcheries\nShrimp/Fish : 5 g per 1000 litre of water\nAquaculture Ponds\nShrimp/Fish : 500 g – 1 kg per hectare\nProcessing Units\nShrimp/Fish wash & water sanitization : 5 – 10 g per 1000 litre of water\nSanitization of pre-cleaned surfaces and equipment, including nets, aerators, paddles, hatchery equipment, and foot dips\n10 g per litre of water\n\nMethod of administration\nDissolve the required quantity of Profect-Plus in water outside the tank/pond in a clean container and then spray uniformly throughout the tank/pond.",
        "packSize": "500 grams",
        "specifications": {
          "brand": "Blunova",
          "profile": "Highly Potent Broad-Spectrum Sanitizer"
        },
        "images": [
          "/content/products/profect-plus.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/disinfectants-and-sanitizers/profect-plus/"
      }
    ],
    "image": "/content/products/benzatec-br20.jpg"
  },
  {
    "name": "Aqua Feed Additives",
    "brand": "Blunova",
    "description": "Aqua Feed Additives from the Blunova aquaculture range.",
    "products": [
      {
        "name": "BLUCEE",
        "slug": "blucee",
        "shortDescription": "Blucee provides a potent source of Vitamin C, essential for enhancing the immune system and overall health of shrimp larvae. The product ensures rapid dissolution and easy absorption, supporting optimal growth and resilience in shrimp hatcheries.",
        "composition": "L-Ascorbic Acid (Vitamin C)",
        "uses": "• Helps to relieve the larvae from stress conditions.\n• Prevents the colonization of bacterial pathogens in the gut.\n• Improves disease resistance.\n• Helps in free moulting in larval and post larval stages.",
        "dosage": "Under normal conditions : 2-3 ppm\nUnder stress conditions : 5 ppm\nOr as advised by a Hatchery consultant depending upon the prevailing conditions in the tanks.\n\nMethod of administration\nBlucee should be thoroughly mixed with water as per the recommended usage levels.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Potent and Soluble L-Ascorbic Acid (Vitamin C) for use in Shrimp Hatcheries"
        },
        "images": [
          "/content/products/blucee.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/feed-additives/blucee/"
      },
      {
        "name": "CEEMAX",
        "slug": "ceemax",
        "shortDescription": "Ceemax is an innovative product that offers many advantages – mainly reflected in great chemical stability, bioavailability, and water durability. These advantages make it the best choice for different types of extruded feed or pelleted feed with better cost efficiency.",
        "composition": "L-Ascorbic Acid 2-Phosphate (Vitamin C)",
        "uses": "• Excellent pelleting stability – after extruding process with temperatures as high as 150oC, the Vitamin C retention of Ceemax has been estimated to be over 80% compared to coated Vitamin C and crystal Vitamin C products that show about 25% and 10% retention.\n• Excellent storage stability – the Vitamin C retention of Ceemax is found to be far higher than coated and crystal Vitamin C products even after 45 days of storage.\n• Excellent water durability – after placing the shrimp feed in 20oC seawater for 5 minutes, the Vitamin C retentions of Ceemax and crystal Vitamin C have been found to be 62% and 7.8% respectively.\n• Excellent bio-availability – accumulation in hepatopancreas and the digestion and absorption rates of Ceemax are high compared to other forms of Vitamin C.",
        "dosage": "Shrimps : 0.6 to 1.5 g/kg of feed\nFish : 0.2 to 0.8 g/kg of feed\nDuring unfavorable conditions such as high temperature or polluted water, the usage level may be increased by 50 – 100%. When there is a disease, the usage level may be increased by 200-500%.\nThe inclusion levels may be fixed as per the advice of the Aquaculture Consultant",
        "packSize": "1 kg and 25 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "The Most Stable and Bio-available Vitamin C"
        },
        "images": [
          "/content/products/ceemax.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/feed-additives/ceemax/"
      },
      {
        "name": "ORBIGEL-HP",
        "slug": "orbigel-hp",
        "shortDescription": "Orbigel HP is used effectively to bind the feed additives to achieve the desired growth & to prevent the diseases in aquaculture ponds. It is easily digestible by the animals and it plays an important role in immune function, lipid metabolism, gene expression, and reproduction and growth of animals. It helps improve the osmotic tolerance, and decrease the vibrio species concentration in the intestinal microbiota of marine shrimp.",
        "composition": "A stable and optimized blend of Ferrous Gluconate, Nicotinamide, Calcium Lactate, Yeast Extract, Choline Chloride, Cobalt Sulphate, Copper Sulphate, Sodium Propionate, and Zinc Sulphate in a suitable and compatible base.",
        "uses": "• Maximizes production and optimizes FCR.\n• Improves functional efficiency of liver & pancreas.\n• Helps in better utilization of nutrients in the body.\n• Helps to regulate the metabolic activity.\n• Enhances the molting efficiency and prevents loose shell in shrimp.\n• Increases the bio availability of feed and feed supplements.\n• Ensures proper digestion and improved health.",
        "dosage": "Shrimp/Fish feed: 10 to 15g/kg of feed or as recommended by an Aquaculture Consultant.",
        "packSize": "5 litres and 30 litres HDPE Jar",
        "specifications": {
          "brand": "Blunova",
          "profile": "High Performance Hepato-Pancreatic Stimulant cum Feed Binding Gel"
        },
        "images": [
          "/content/products/orbigel-hp.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/feed-additives/orbigel-hp/"
      },
      {
        "name": "PATHOSTAT BLU",
        "slug": "pathostat-blu",
        "shortDescription": "Pathostat Blu helps regulate digestion and enzyme functions and stimulates cell receptors. It is an excellent immune booster and energizer and helps fight off bacteria, viruses, and fungi.",
        "composition": "Pathostat Blu is a unique and optimized combination of Tannins, Polyphenols, Mucilage, Cynalon Dactylon Extract, Curcumin, Tricholine Citrate, Allicin, Thymol, Potassium Diformate, Formic Acid and Minerals that help improve the health and performance of shrimps.",
        "uses": "• Improves feed intake and rejuvenates the damaged hepatopancreas cells, and improves the digestibility of feed.\n• Improves gut health by eliminating all kinds of pathogens.\n• Improves nutrient absorption, reduces mortality, and enhances survival rate.\n• Improves daily weight gain and reduces FCR.\n• Maintains bacteriostatic and bactericidal effects against gram-positive and gram-negative bacteria.\n• Has antiviral and antifungal properties and is effective against WSSV, EHP, WFS, and other diseases.",
        "dosage": "For prevention : 10 to 15 gms per kg of feed (once in two days in the last feed of the day)\nFor control : 15 to 20 gms per kg of feed (twice a day for one week followed by once in two days)\nOr as advised by the Aquaculture Consultant\n\nMethod of administration\nFor better results, the required quantity of Pathostat Blu should be mixed thoroughly with Orbigel to make a premix. Then, this premix should be properly remixed with the final feed before being fed.",
        "packSize": "500 grams",
        "specifications": {
          "brand": "Blunova",
          "profile": "Unique Combination of Antiviral, Antibacterial, and Antifungal Phytobiotics"
        },
        "images": [
          "/content/products/pathostat-blu.jpg"
        ],
        "isFeatured": true,
        "source": "https://provet.in/products/blunova/feed-additives/pathostat-blu/"
      },
      {
        "name": "SYNGROMIX",
        "slug": "syngromix",
        "shortDescription": "Syngromix helps in improving productivity and growth in fish & shrimps. It consists of a highly efficient liver protector to preserve the hepatic activity along the production cycle, avoiding lipid degeneration of the liver or lipid accumulation in the hepatocytes cells. The acidifying action of the protected organic acids in the intestine of fish and shrimps results in better and improved digestibility which favours a number of intestinal saprophytic microorganisms against pathogens.",
        "composition": "Syngromix is an optimized blend of protected organic acids, selected plant extracts and essential oils.",
        "uses": "• Improves the intestinal health.\n• Improves the digestibility of feed.\n• Improves the absorption of nutrients.\n• Reduces mortality.\n• Improves FCR and daily weight gain.\n• Maintains bacteriostatic & bactericidal effects against Gram-positive and Gram-negative bacteria.",
        "dosage": "Shrimps : 10 to 15 grams per kg of feed.\nFish : 7 to 10 grams per kg of feed.\nTo be given daily on continuous basis or as advised by the Aquaculture Consultant\n\nMethod of administration\nFor better results, the required quantity of Syngromix should be mixed in the feed along with feed probiotics and binder.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Phytobiotic Hepatopancreatic Protector & Growth Enhancer"
        },
        "images": [
          "/content/products/syngromix.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/feed-additives/syngromix/"
      },
      {
        "name": "VIBROCID",
        "slug": "vibrocid",
        "shortDescription": "Vibrocid is a natural product made from plant extracts that helps keep your fish and shrimp healthy by fighting off harmful bacteria, especially Vibrio species.",
        "composition": "Vibrocid consists of an exceptional and natural blend of selected & protected vegetable extracts and test organic acids and their salts in combination with short-chain fatty acids in desired concentrations. It helps prevent and control bacterial infections, especially caused by Vibrio spp. in shrimps & prawns during their growing phase.",
        "uses": "• Improves the digestibility of feed.\n• Improves the absorption of nutrients.\n• Controls and reduces mortality due to viral & bacterial infections, especially Vibrio spp.\n• Maintains bacteriostatic & bactericidal effects against pathogenic bacteria.\n• Improves FCR & daily growth rate.",
        "dosage": "Commercial Ponds & Hatcheries\nFor prevention : 10 to 15 gms per kg of feed in one meal on a daily basis\nFor control : 15 to 20 gms per kg of feed in 1 or 2 meals for 7 to 10 days continuously  followed by prevention levels when Shrimp’s uropods and peripods become red & Vibrio loads in water are high.\nOr as advised by the Aquaculture Consultant\n\nMethod of administration\nFor better results, the required quantity of Vibrocid should be mixed in the feed along with 10 g of Nagrowall & Orbigel HP.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Phytobiotic Growth Enhancer"
        },
        "images": [
          "/content/products/vibrocid.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/feed-additives/vibrocid/"
      },
      {
        "name": "YEAFORTE PLUS",
        "slug": "yeaforte-plus",
        "shortDescription": "Yeaforte Plus is an advanced direct-fed microbial formulation, which is designed to support and maintain a balanced growth rate in fish and shrimp, promoting overall health and productivity in aquaculture environments.",
        "composition": "Yeaforte Plus is a microbial formulation providing Saccharomyces Cerevisiae and Bacillus spp.",
        "uses": "• Pond application – improves ecology, reduces pH, stabilizes plankton production, improves water quality with beneficial bacteria.\n• Feed supplement – enhances survival rate, improves daily weight gain, improves resistance against diseases, improves absorption of nutrients from the gut, enhances cell repair, and binds pathogens in the gut and restricts them from colonizing.",
        "dosage": "Pond application : 1-2 kg/acre of pond\nFeed application : 1-2 g/kg of feed\nOr as advised by the Aquaculture Consultant\n\nMethod of administration\nFor better results, the required quantity of Yeoforte Plus should be mixed thoroughly with rice dust and jaggery before application",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "A Novel Direct Fed Microbial (DFM) Formulation"
        },
        "images": [
          "/content/products/yeaforte-plus.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/feed-additives/yeaforte-plus/"
      }
    ],
    "image": "/content/products/blucee.jpg"
  },
  {
    "name": "Immunostimulants",
    "brand": "Blunova",
    "description": "Immunostimulants from the Blunova aquaculture range.",
    "products": [
      {
        "name": "NAGROWALL",
        "slug": "nagrowall-aqua",
        "shortDescription": "NagroWall is a natural GMO-free additive and a source of Free Nucleotides and Nucleosides, which is obtained from the fermentation of selected strains of Saccharomyces cerevisiae ethanol yeast, using a process that stimulates cell breakdown and RNA digestion, through endogenous and exogenous enzymes.",
        "composition": "NagroWall is an optimized combination of MOS, Beta Glucans, Nucletides, and Nucleosides.",
        "uses": "• Restricts the colonization of pathogens in gut.\n• Improves FCR and helps in better metabolism.\n• Improves palatability of feed.\n• Prevents damage to intestinal epithelial cells during white-gut disease and enhances cell repair.\n• Reduces the mortality rate due to EMS/RMS.",
        "dosage": "Regular usage\nShrimp : 10-12 g/kg of feed\nFish : 5-10 g/kg of feed\nDuring stress\nShrimp : 15-20 g/kg of feed\nFish : 10-13 g/kg of feed\nOr as advised by the Aquaculture Consultant",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Non-Antibiotic Growth & Immunity Enhancer"
        },
        "images": [
          "/content/products/nagrowall-aqua.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/immunostimulant/nagrowall/"
      }
    ],
    "image": "/content/products/nagrowall-aqua.jpg"
  },
  {
    "name": "Mineral Mixtures",
    "brand": "Blunova",
    "description": "Mineral Mixtures from the Blunova aquaculture range.",
    "products": [
      {
        "name": "MAXIGRO-XL",
        "slug": "maxigro-xl",
        "shortDescription": "Maxigro-XL is a synergistic and optimal nutritional combination of minerals fortified with Amino Acids, Immunostimulants, and Antioxidants specifically designed for use in shrimp hatcheries.",
        "composition": "Maxigro-XL contains important minerals such as Sodium, Potassium, Magnesium, Iron, Copper, Cobalt, Manganese, Selenium, and Zinc, fortified with various amino acids, natural antioxidants, and natural complex polysaccharides. The natural fibre, in combination with complex polysaccharides, helps to improve the gut health of shrimps.",
        "uses": "• Improves the conversion of Zoea & mysis stages\n• Improves shrimp nauplii, zoea, mysis, and post-larvae moulting & recovery\n• Stimulates the immune system against pathogens. Increases disease resistance and reduces stress\n• Improves gut health\n• Improves the survival rate of post-larvae & shrimp\n• Improves growth & overall performance and productivity",
        "dosage": "Shrimp Hatcheries\nNauplii – Zoea tanks : 0.5 – 1 ppm daily\nZoea – Mysis – PL tanks : 2 – 3 ppm daily\nPost Larvae tanks : 3 – 4 ppm daily\nNursery tanks : 4 – 5 ppm daily\nShrimp Ponds\n5 ml/kg of feed or 100 ml per acre of pond.\nOr as advised by the Aquaculture Consultant",
        "packSize": "1 litre",
        "specifications": {
          "brand": "Blunova",
          "profile": "Nutritional combination of minerals fortified with Amino acids, Immunostimulants, and Antioxidants"
        },
        "images": [
          "/content/products/maxigro-xl.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/maxigro-xl/"
      },
      {
        "name": "MINBLEND",
        "slug": "minblend",
        "shortDescription": "Minblend is a carefully formulated blend of essential macro minerals that helps ensure a balanced aquatic environment and desired pond health. It helps in promoting the well-being and growth of aquatic species.",
        "composition": "Minblend is an optimized combination of essential macro minerals such as Calcium, Magnesium, Potassium, Sodium and Chlorides in a compatible base.",
        "uses": "• Improves availability of essential macro-nutrients.\n• Controls mineral ratio equilibrium in pond water.\n• Prevents and control cramps and white muscle problems in shrimps.\n• Reduces and controls low survival rate and slow mortality in shrimps.\n• Introduces timely moulting to obtain desired ADG in shrimps.\n• Helps to maintain health and uniform growth.\n• Improves FCR and productivity in fish and shrimps.",
        "dosage": "During pond preparation : 20 to 30 kg/ha\nDuring culture : 10 to 20 kg/ha/week\nDuring rainy season/moulting : 50 to 100 kg/ha\nIn feed application:\nFor fish and prawn feed : 10 kg per ton of feed or as advised by an Aquaculture Consultant.\n\nMethod of administration\nTake required quantity of Minblend and mix with water or sand and then sprinkle on the pond surface.",
        "packSize": "25 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Stable Blend of Macro Minerals"
        },
        "images": [
          "/content/products/minblend.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/minblend/"
      },
      {
        "name": "MINTROPLEX GOLD",
        "slug": "mintroplex-gold",
        "shortDescription": "Mintroplex Gold is a innovative formulation of chelated minerals, vitamins, and amino acids crafted to enhance the growth and performance of shrimp and fish. Its unique blend ensures optimal health, supporting robust development and overall vitality in aquaculture environments.",
        "composition": "Mintroplex Gold contains optimal quantities of Calcium, Phosphorous, Cobalt, Copper, Iodine, Iron, Magnesium, Manganese, Potassium, Selenium, Sodium, Sulphur, Zinc, Vitamin A, Vitamin D3, Vitamin E, Biotin, Nicotinamide, Lysine, and Methionine in a suitable base.",
        "uses": "• Prevents and controls loose shell disease.\n• Counters vitamin and mineral deficiencies.\n• Stimulates and regulates moulting.\n• Helps in quick formation of hardened outer layer.\n• Acts as a growth promoter.\n• Reduces stress and mortality.",
        "dosage": "Shrimp\nRegular use : 5 g per kg of feed once a day\nDuring moulting : 10 g per kg of feed twice a day\nPond application : 4 kg per acre\nOr advised by the Aquaculture Consultant.\nFish\n5 g per kg of feed or as advised by the Aquaculture Consultant.\n\nMethod of administration\nFor better results, the required quantity of Mintroplex Gold should be mixed thoroughly with binder to make a premix. Then this premix should be remixed with the feed properly before feeding.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Innovative Blend of Chelated Minerals, Vitamins, and Amino Acids"
        },
        "images": [
          "/content/products/mintroplex-gold.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/mintroplex-gold/"
      },
      {
        "name": "MINTROPLEX ULTRA",
        "slug": "mintroplex-ultra",
        "shortDescription": "Mintroplex Ultra is a nutritional supplementation in ionic form which plays a major role in various functions of the body and growth. Improper ratios of Na, K, Mg, and Ca minerals lead to osmotic stress, which has a cascading effect on the growth and survival of the shrimp, which is addressed by Mintroplex Ultra.",
        "composition": "Each ml contains:\nCalcium diacid phosphate : 103.80 mg\nPhosphorous pentoxide : 236.20 mg\nMagnesium diacid phosphate : 109.40 mg\nSodium diacid phosphate : 45.40 mg\nManganese diacid phosphate  : 11.20 mg\nZinc diacid phosphate : 10.40 mg\nCopper diacid phosphate : 2.60 mg\nCobalt diacid phosphate : 0.12 mg",
        "uses": "• Easily absorbed as the mineral ingredients are in ionic form.\n• Aids in moulting and growth.\n• Optimizes exuviating process.\n• Maintains brightness and rigidity of outer layer.\n• Prevents and controls loose shell disease.\n• Improves performance and productivity.",
        "dosage": "Shrimps and Fishes\n5 ml per kg of feed to be used continuously during culture period. Use 10 ml per kg of feed for quickly improving the productivity.\n\nMethod of administration\nMix required quantity of Mintroplex Ultra uniformly in feed, dry the feed in shade for about 30 minutes and then sprinkle in the pond.",
        "packSize": "1 litre",
        "specifications": {
          "brand": "Blunova",
          "profile": "Nutritional Combination of Highly Bioavailable Minerals"
        },
        "images": [
          "/content/products/mintroplex-ultra.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/mintroplex-ultra/"
      },
      {
        "name": "MIPRAMAX",
        "slug": "mipramax",
        "shortDescription": "Mipramax is a comprehensive formulation of minerals, probiotics, and amino acids designed to promote the health and growth of aquatic species. By supporting a balanced environment, it enhances nutrient absorption and strengthens overall vitality, ensuring optimal conditions for aquatic life.",
        "composition": "Mipramax is an optimized combination of important essential minerals, enriched with adequate colony forming units of probiotics such as Bacillus subtilis, Bacillus licheniformis, Bacillus pumulis, Bacillus polymyxa and Bacillus megaterium and Amino Acids such as Methionine and Lysine in a stable and compatible base.",
        "uses": "• Enhances disease resistance and defence mechanisms.\n• Regulates osmosis, nerve impulse and muscle control.\n• Improves fertility, FCR, uniform growth, digestion, and survivability.\n• Promotes plankton development.\n• Optimizes the utilization of dietary nutrients.\n• Prevents the imbalance of mineral ions in water.\n• Promotes regular moulting in shrimps.\n• Improves hormonal and enzymatic activities.",
        "dosage": "For aquaculture ponds:\nDuring pond preparation : 20 to 30 kg/ha\nDuring culture : 10 to 20 kg/ha once in a fortnight\nIn feed application:\nFor fish and prawn feed : 10 kg per ton of feed or as advised by an Aquaculture Consultant.",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Essential minerals, probiotics, and amino acids"
        },
        "images": [
          "/content/products/mipramax.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/mipramax/"
      },
      {
        "name": "SOLUMIN-L",
        "slug": "solumin-l",
        "shortDescription": "Solumin-L is an optimized, highly bioavailable and concentrated blend of essential micro and macro minerals for healthy shrimp hatchery management. It is highly effective during all stages of growth, and it helps maintain acid-base balance and are important in osmoregulation. It is easily absorbed as the mineral ingredients are in ionic form.",
        "composition": "Solumin-L is an innovative and optimized combination of various essential minerals in ionic form such as Calcium, Phosphorous, Magnesium, Sodium, Manganese, Zinc, Copper, and Cobalt for healthy shrimp hatchery management.",
        "uses": "• Enhances the defence mechanism, immunity, and disease resistance.\n• Improves performance, productivity, survival, and growth.\n• Helps in development of endo and exo-skeletal systems.\n• Optimizes utilization of dietary nutrients.\n• Regulates osmosis, nerve impulses, and muscle control.\n• Corrects imbalance of mineral ions in water.\n• Improves hormonal and enzymatic activities.",
        "dosage": "3 to 5 ml per MT of water corresponding to 3 ppm to 5 ppm or as advised by the Aquaculature Consultant",
        "packSize": "1 litre",
        "specifications": {
          "brand": "Blunova",
          "profile": "Bioavailable and Essential Micro & Macro Minerals"
        },
        "images": [
          "/content/products/solumin-l.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/solumin-l/"
      },
      {
        "name": "SOLUMIN-S",
        "slug": "solumin-s",
        "shortDescription": "Solumin-S is an optimized and high soluble blend of essential minerals enriched with amino acids and probiotics for health shrimp hatchery management. This blend supports robust growth, enhances immune function, and improves the overall survival rate of shrimp larvae. It ensures optimum nutrient absorption, contributing to healthier and more resilient shrimp.",
        "composition": "Solumin-S is a highly soluble and concentrated blend of micro and macro minerals enriched with Lysine, Methionine, and adequate colony forming units of Bacillus spp. in a stable and compatible base.",
        "uses": "• Enhances the defence mechanism, immunity, and disease resistance.\n• Improves FCR, productivity, survival, and growth.\n• Helps in development of endo and exo-skeletal systems.\n• Optimizes utilization of dietary nutrients.\n• Regulates osmosis, nerve impulses, and muscle control.\n• Corrects imbalance of mineral ions in water.\n• Improves hormonal and enzymatic activities.",
        "dosage": "3 to 5 g per MT of water corresponding to 3 ppm to 5 ppm or as advised by the Aquaculature Consultant.\n\nMethod of administration\nLarval Rearing – add the required quantity of Solumin-S directly into the rearing tanks.\nMaturation – Mix the required quantity of Solumin-S with fresh/frozen food one hour before feeding. In case of pellet diets, water or cod liver oil may be used for binding.",
        "packSize": "500 g",
        "specifications": {
          "brand": "Blunova",
          "profile": "Essential Minerals Enriched with Amino Acids and Probiotics"
        },
        "images": [
          "/content/products/solumin-s.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/mineral-mixtures/solumin-s/"
      }
    ],
    "image": "/content/products/maxigro-xl.jpg"
  },
  {
    "name": "Other Aqua Products",
    "brand": "Blunova",
    "description": "Other Aqua Products from the Blunova aquaculture range.",
    "products": [
      {
        "name": "RAPROSOFT",
        "slug": "raprosoft",
        "shortDescription": "Raprosoft is a water hardness controller for aquaculture ponds. It helps stabilize alkalinity and balances pH fluctuations, and improves water quality by stabilizing hardness. It functions well in both fresh and salt water.",
        "composition": "Ethylene Di-amine Tetra Acetic Acid (EDTA) along with active water softening agents.",
        "uses": "• Controls heavy metal toxicity.\n• Minimizes free ammonia in pond water.\n• No residues and environmental friendly.\n• Helps in moulting of shrimps.\n• Promotes plankton growth.",
        "dosage": "1 to 2 kg per acre or as advised by the Aquaculture Consultant.\n\nMethod of administration\nMix in 50 litres of water and broadcast uniformly throughout the pond.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Water Hardness Controller for Aquaculture Ponds"
        },
        "images": [
          "/content/products/raprosoft.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/others/raprosoft/"
      }
    ],
    "image": "/content/products/raprosoft.jpg"
  },
  {
    "name": "Oxygen Supplements",
    "brand": "Blunova",
    "description": "Oxygen Supplements from the Blunova aquaculture range.",
    "products": [
      {
        "name": "DISSOX FLA",
        "slug": "dissox-fla",
        "shortDescription": "Dissox FLA is an eco-friendly solution designed to maintain optimal pond conditions by generating and stabilizing dissolved oxygen levels. It effectively absorbs harmful gases from the pond bottom and reduces organic load, ensuring a healthy environment for aquatic life. With no residues or withdrawal period, Dissox FLA is non-toxic and safe, providing reliable performance without any biochemical activity.",
        "composition": "Sodium Carbonate Peroxyhydrate",
        "uses": "• Immediate release of optimum quantity of oxygen when applied.\n• Prevention of floating head in fish & shrimp.\n• Improving the water quality.\n• Absorption and degradation of organic matter in water.\n• Reducing nitrite and hydrogen sulphide levels in pond.",
        "dosage": "For regular application : 1-2 kg per acre of pond\nIn case of oxygen depletion : 2-3 kg per acre of pond\nSpread Dissox FLA tablet directly into the pond\nDuring transportation : 3 g per cubic meter water\nOr as advised by the Aquaculture Consultant\n\nMethod of administration\nDo not dilute Dissox FLA in water before spreading.\nDo not allow contact of Dissox FLA with water before spreading the tablet into pond.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Eco-friendly Solution for Dissolved Oxygen"
        },
        "images": [
          "/content/products/dissox-fla.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/oxygen-supplements/dissox-fla/"
      }
    ],
    "image": "/content/products/dissox-fla.jpg"
  },
  {
    "name": "Parasiticides",
    "brand": "Blunova",
    "description": "Parasiticides from the Blunova aquaculture range.",
    "products": [
      {
        "name": "ARGUCIDE",
        "slug": "argucide",
        "shortDescription": "Argucide is a powerful ectoparasiticide designed to eliminate both mature and immature external parasites from fish, promoting healthier growth and boosting the immune system. By reducing stress and preventing secondary infections, Argucide helps lower mortality rates and supports faster wound healing, ensuring the well-being of fish",
        "composition": "Argucide is a natural plant extract based unique blend containing concentrated garlic extract not less than 0.5% for control and treatment of ectoparasites in fish in aquaculture ponds/tanks.",
        "uses": "• No external parasites.\n• Relieves from stress.\n• Improves absorption of nutrients.\n• Heals wound faster.\n• Improves immunity.\n• Improves growth rate and body weight.",
        "dosage": "Fish feed : 1.5 to 2.5 g/kg\nLive fish weight : 25 to 30 g/ton to be administered twice daily\nOr as advised by the Aquaculture Consultant",
        "packSize": "1 kg HDPE Jar",
        "specifications": {
          "brand": "Blunova",
          "profile": "A Complete Ectoparsiticide for Fish"
        },
        "images": [
          "/content/products/argucide.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/parasiticides/argucide/"
      },
      {
        "name": "ECTOCYP",
        "slug": "ectocyp-aqua",
        "shortDescription": "Ectocyp is a highly effective ectoparasiticide with a broad spectrum of action against ticks, mites, flies, fleas, and lice in cattle, sheep, poultry, dogs, and farm premises. As a synthetic type II pyrethroid, it delivers a potent knockdown and killing effect while maintaining a high safety margin. Its effectiveness is sustained in various environmental conditions, with its potency unaffected by sunlight and air.",
        "composition": "Cypermethrin High Cis 10% W/V.",
        "uses": "• Prevents transmission of ectoparasite borne diseases.\n• Reduces ectoparasitic stress & improves productivity.\n• Maintains healthy skin and lustrous, glossy body coat.",
        "dosage": "Cattle, Sheep, Dogs    : 1ml per litre of water as a whole-body spray or wash or dip ensuring thorough coverage of preferential areas of parasites.\nPoultry : 3-5 ml per litre of water as a spray\nFarm premises : 5-10 ml per litre of water per 25 sq. ft. in empty premises.",
        "packSize": "5ml, 15 ml, 50 ml, and 1 litre aluminium containers",
        "specifications": {
          "brand": "Blunova",
          "profile": "The Effective Ectoparsiticide"
        },
        "images": [
          "/content/products/ectocyp-aqua.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/parasiticides/ectocyp/"
      }
    ],
    "image": "/content/products/argucide.jpg"
  },
  {
    "name": "Aqua Probiotics",
    "brand": "Blunova",
    "description": "Aqua Probiotics from the Blunova aquaculture range.",
    "products": [
      {
        "name": "AQUABAC",
        "slug": "aquabac",
        "shortDescription": "Aquabac is a high-quality probiotic blend designed to support and enhance the health of aquatic systems. It promotes a balanced microbial environment, improving overall water quality and boosting the vitality of aquatic life.",
        "composition": "Aquabac is an optimized probiotic blend containing not less than (NLT) 5 billion CFU per gram of viable spores of B. subtilis, B. licheniformis, L. acidophilus, L. sporogenes, and Saccharomyces cervisiae in a compatible base.",
        "uses": "• Highly effective in bioremediation of all kinds of organic waste materials.\n• Reduces stress conditions in pond water.\n• Helps in elimination of pathogenic bacterial populations from pond water.\n• Minimizes number of water changes during culture period.\n• Promotes growth and development of phytoplankton in pond water.",
        "dosage": "Biofloc : 200 to 250 g per 10000 litres water tank.\nFish ponds : 500 g per acre\nShrimps and Fish Hatcheries  : 50 to 70 g per 1000 litres of water.\nOr as advised by the Aquaculture Consultant.\n\nMethod of administration\nThe required quantity of Aquabac should be soaked for 30 minutes before applying in pond for better results.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Soil and Water Probiotic for Stabilizing Pond Ecology"
        },
        "images": [
          "/content/products/aquabac.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/probiotics/aquabac/"
      },
      {
        "name": "BACITOX PLUS",
        "slug": "bacitox-plus",
        "shortDescription": "Bacitox Plus converts harmful chemicals (H2S, NH3, NO2) into simpler forms that feed Plankton and other beneficial pond life. It turns NH3 and NO2 into nitrogen gas and breaks down toxic H2S, improving water quality and smell. It releases bacteriocins to kill harmful bacteria.",
        "composition": "Bacitox Plus is an optimized probiotic blend containing not less than 10 billion CFU per gram of viable spores of B. subtilis, B. licheniformis, B. megaterium, B. polymyxa, Nitrosomanas, Nitrobacter, Rhodobacter, Rhodococcus, and Thibacillus Denitrificans in a compatible base, which helps in conditioning the pond water and soil.",
        "uses": "• Maintains hygienic pond bottom & makes water clear by digesting sediments.\n• Keeps the pond free from toxic materials and malodorous gases. Maintains the dissolved oxygen level by bringing down BOD and COD levels.\n• Keeps the pond free from pathogenic microorganisms and improves survival and productivity.\n• Effective over a wide range of pH and salinity.\n• Maintains stable plankton bloom",
        "dosage": "Shrimp Ponds\nApplication Schedule\nShrimp Stocking Density\n\n\n<10 PL/sq.m Black Tiger (or) <30 PL/sq.m Vannamei\n>10 PL/sq.m Black Tiger (or) >30 PL/sq.m Vannamei\n\n\n5 to 7 days before stocking\n400 g per acre\n600 g per acre\n\n\nEvery 10 to 15 days after stocking\n200 g per acre\n400 g per acre\nFish Ponds                              : 100 g to 150 g per acre\nShrimp & Fish Hatcheries       : 25 g to 40 g per 1000 litres of water\nOr as advised by the Aquaculture Consultant\n\nMethod of administration\nThe required quantity of Bacitox Plus should be soaked for 30 minutes before applying in the pond for better results.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Unique & Innovative Soil and Water Conditioner"
        },
        "images": [
          "/content/products/bacitox-plus.jpg"
        ],
        "isFeatured": true,
        "source": "https://provet.in/products/blunova/probiotics/bacitox-plus/"
      },
      {
        "name": "FEPROMIX",
        "slug": "fepromix",
        "shortDescription": "Fepromix is an optimum blend of Probiotic formulation designed to promote a healthy gut flora in fish and shrimp. By fostering a balanced intestinal environment, it enhances digestion, boosts immunity, and supports overall growth and vitality in aquaculture.",
        "composition": "Fepromix consists of an optimum number of colony forming units of select beneficial strains of Sachharomyces spp., Lactobacillus spp., Bididobacterium spp., and Bacillus spp.",
        "uses": "• Limits the activity of harmful pathogenic bacteria.\n• Maintains a healthy and balanced gut microflora.\n• Improves animal metabolism.\n• Reduces digestive upsets.\n• Improves FCR, disease resistance, and lowers mortality.",
        "dosage": "Shrimps : 3 to 5 g per kg of feed\nFish : 2 to 2.5 g per kg of feed\nOr as advised by the Aquaculture Consultant.",
        "packSize": "1 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "An Optimized Blend of Gut Probiotics"
        },
        "images": [
          "/content/products/fepromix.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/probiotics/fepromix/"
      },
      {
        "name": "HATCHPRO",
        "slug": "hatchpro",
        "shortDescription": "Hatchpro is a specialized blend of non-pathogenic microbial cultures designed to enhance water conditioning in shrimp hatcheries. This formulation improves water quality, ensuring an efficient and healthy environment for shrimp development. It is highly effective in both fresh water and sea water.",
        "composition": "Hatchpro is a blend of non-pathogenic and pure microbial cultures of Bacillus subtilis, Bacillus licheniformis, Bacillus megaterium, Bacillus polymyxa, Bacillus pumilus, Bacillus coagulans, and Bacillus clausii enriched with nitrifying and denitrifying bacteria and saccharomyces cerevisiae in a stable, compatible and nutritive base.",
        "uses": "• Inhibits growth of pathogenic bacteria and increases disease resistance.\n• Maintains water hygiene and makes water clear by digesting the sediments.\n• Keeps the tanks free from toxic materials and malodorous gases.\n• Leaves no residues and hence environment friendly.",
        "dosage": "Under normal conditions:\nDay before stocking  : 2 g per MT of culture water\nN5 to PL1 : 1 g per MT of culture water\nPL1 to PL12  : 0.5 g per MT of culture water\nDuring conditions like Zoea 2 syndrome:\n2 to 5 g per MT of culture water till Z3 stage.\nFor Broodstock:\n2 to 5 g per MT of culture water\nOr as advised by the Aquaculture Consultant.",
        "packSize": "500 g",
        "specifications": {
          "brand": "Blunova",
          "profile": "Potent and Soluble Probiotic Water Conditioner"
        },
        "images": [
          "/content/products/hatchpro.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/probiotics/hatchpro/"
      },
      {
        "name": "RHODOBAC",
        "slug": "rhodobac",
        "shortDescription": "Rhodobac is a liquid probiotic formulation designed to improve water quality in aquaculture systems. By enhancing the natural biological processes, it ensures a cleaner environment, leading to healthier aquatic life and more efficient farming operations, and it is effective in wide range of salinity.",
        "composition": "Rhodobac consists of adequate colony forming units of Rhodococcus spp., Rhodobacter spp., Bacillus spp., Nitrosomous spp., and Lactobacillus spp., fortified with nitrifying and denitrifying bacteria in liquid form.",
        "uses": "• Enhances zooplankton in pond.\n• Directly inhibits pathogenic microbes and competes with harmful microbes.\n• Controls sludge build up, stabilizes existing algal blooms, and improves water quality.\n• Breaks down dissolved protein.\n• Fragments unused feed.\n• Eliminates malodour from ponds.\n• Controls H2S (Desulphurization).\n• Prevents stress factors in ponds.",
        "dosage": "1 to 5 litres per acre of pond depending on the hygienic condition of the pond or as advised by the Aquaculture Consultant.\n\nMethod of administration\nTake required quantity of Rhodobac and mix with water or sand and then sprinkle on the pond surface.",
        "packSize": "1 litre, 5 litres, and 20 litres",
        "specifications": {
          "brand": "Blunova",
          "profile": "Stable Multi Strain Liquid Probiotic Blend"
        },
        "images": [
          "/content/products/rhodobac.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/probiotics/rhodobac/"
      }
    ],
    "image": "/content/products/aquabac.jpg"
  },
  {
    "name": "Aqua Toxin Binders",
    "brand": "Blunova",
    "description": "Aqua Toxin Binders from the Blunova aquaculture range.",
    "products": [
      {
        "name": "ZEOMIN",
        "slug": "zeomin",
        "shortDescription": "Zeomin is a unique blend of mineral zeolites that ensures optimum adsorption, catalysis and cation exchange. Zeomin with its unique porous properties and its stability in water, forms a unique feature for physical and chemical treatment of aquaculture ponds.",
        "composition": "Zeomin provides optimal levels of Silica, Alumina, Oxides of Calcium and other important minerals in the following composition:\nSiO2 : 82.35 to 85%\nAl2O3 : 5.28 to 8%\nFe2O3 : 0.8 to 2%\nCaO : 2.7 to 3%",
        "uses": "• Optimum Adsorption – provides a vast surface area for adsorption of toxic gases to make the habitat clean & healthy for aquatic life.\n• Optimum Catalytic Action – purifies the water and improves the dissolved oxygen content in the aquaculture ponds.\n• Optimum Cation Exchange Capacity – exchanges ammonia and other poisonous gases in water, improves soil and water quality and helps prevent the diseases, which in turn helps promote growth, survivability and profits.",
        "dosage": "10 to 15 kg per acre or as recommended by the Aquaculture Consultant",
        "packSize": "5 kg, 10 kg, and 25 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "A Unique Blend of Mineral Zeolites"
        },
        "images": [
          "/content/products/zeomin.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/toxin-binders/zeomin/"
      },
      {
        "name": "ZEOMIN FORTE",
        "slug": "zeomin-forte",
        "shortDescription": "Zeomin Forte is an advanced triple action mineral zeolite with probiotics for optimum adsorption, catalysis and cation exchange to ensure desired pond hygiene.",
        "composition": "Zeomin Forte provides optimal levels of Silica, Alumina, and Oxides of Calcium fortified with Bacillus spp., in the following composition:\nSiO2  : 82.35 to 85%\nAl2O3  : 5.28 to 8%\nFe2O3  : 0.8 to 2%\nCaO : 2.7 to 3%\nBacillus spp.: NLT 2500 million CFU per kg",
        "uses": "• Probiotic Effect – various strains of Bacillus spp., help prevent and control bacterial pathogens, improve water quality and stabilize oxygen levels in water.\n• Optimum Adsorption – provides a vast surface area for adsorption of toxic gases to make the pond clean & healthy for aquatic life.\n• Optimum Catalytic Action – purifies the water and improves the dissolved oxygen content in the aquaculture ponds.\n• Optimum Cation Exchange Capacity – exchanges ammonia and other poisonous gases in water, improves soil and water quality and helps prevent the occurrence of diseases.",
        "dosage": "10 to 15 kg per acre or as recommended by the Aquaculture Consultant",
        "packSize": "10 kg",
        "specifications": {
          "brand": "Blunova",
          "profile": "Advanced Triple Action Mineral Zeolite with Probiotics"
        },
        "images": [
          "/content/products/zeomin-forte.jpg"
        ],
        "isFeatured": false,
        "source": "https://provet.in/products/blunova/toxin-binders/zeomin-forte/"
      }
    ],
    "image": "/content/products/zeomin.jpg"
  }
];

module.exports = { oldSiteCategories };
