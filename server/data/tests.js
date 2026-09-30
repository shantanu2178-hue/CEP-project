export const standardTests = [
  {
    id: "milk-starch",
    food: "Milk",
    category: "Dairy",
    adulterant: "Starch / Flour Additives",
    whyAdulterated: "Added by unscrupulous vendors to artificially boost solid-not-fat (SNF) measurements and give diluted milk a richer, thicker appearance.",
    healthHazard: "Starch itself is not toxic, but it masks extreme water dilution, compromises nutritional intake for infants and patients, and often indicates unhygienic adulteration batches.",
    hazardLevel: "Moderate",
    testName: "Iodine Reagent Color Test",
    reagentType: "Household / Pharmacy Reagent",
    materials: [
      "5 ml (1 teaspoon) Milk sample",
      "2-3 drops Tincture of Iodine (available at any pharmacy)",
      "Small clear transparent glass or test tube",
      "Stirring spoon or dropper"
    ],
    steps: [
      {
        step: 1,
        title: "Boil Milk Sample",
        detail: "Take 5 ml of the milk sample in a clean heat-proof vessel or bowl. Bring it to a gentle boil for 1 minute, then allow it to cool down to room temperature.",
        timerSeconds: 60
      },
      {
        step: 2,
        title: "Add Iodine Drops",
        detail: "Using a dropper, carefully add 2 to 3 drops of standard tincture of iodine directly onto the cooled milk surface.",
        timerSeconds: 15
      },
      {
        step: 3,
        title: "Observe Color Reaction",
        detail: "Gently swirl the sample. Watch for any rapid color change within 30 to 45 seconds.",
        timerSeconds: 30
      },
      {
        step: 4,
        title: "Capture Clear Photo",
        detail: "Place the sample against a well-lit white paper background and photograph the top-down view for computer vision color analysis.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Milk Result",
      description: "Sample retains a pale yellowish or off-white hue. No dark blue, purple, or ink-black discoloration develops.",
      colorHex: "#fef3c7",
      colorTag: "Pale Cream / Yellowish Tint"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Immediate formation of a deep navy blue, dark violet, or inky black color upon contact with iodine, confirming the formation of a starch-iodine inclusion complex.",
      colorHex: "#1e1b4b",
      colorTag: "Deep Blue / Inky Black"
    },
    detectionRule: {
      type: "blue_black",
      hueMin: 200,
      hueMax: 260,
      satMin: 30,
      valMax: 50,
      thresholdRatio: 0.12,
      suspectedAdulterant: "Starch / Thickening Agent"
    },
    safetyWarnings: [
      "Do NOT drink or taste the milk sample after adding iodine reagent.",
      "Tincture of iodine is for external diagnostic use only; keep away from small children.",
      "Discard tested liquids safely into a sink drain with running water."
    ]
  },
  {
    id: "turmeric-metanil-yellow",
    food: "Turmeric Powder",
    category: "Spices",
    adulterant: "Metanil Yellow (Chemical Azo Dye)",
    whyAdulterated: "Metanil Yellow is a cheap industrial dye illegally used to impart an intensely bright golden-yellow color to low-grade, stale, or adulterated turmeric rhizome powder.",
    healthHazard: "Metanil Yellow is a non-permitted food colorant proven to cause neurotoxicity, testicular damage, and stomach lesions. Prolonged consumption is classified as carcinogenic.",
    hazardLevel: "Critical",
    testName: "Concentrated Acid Stripping Test",
    reagentType: "Acidic Reagent (Lemon/Vinegar or dilute HCl)",
    materials: [
      "1/2 teaspoon Turmeric powder",
      "5 ml Warm water",
      "5-10 drops Concentrated lemon juice, pure white vinegar, or dilute hydrochloric acid",
      "Clear transparent glass tumbler"
    ],
    steps: [
      {
        step: 1,
        title: "Disperse in Warm Water",
        detail: "Dissolve 1/2 teaspoon of turmeric powder in 5 ml of warm water inside a clear transparent glass and stir thoroughly.",
        timerSeconds: 30
      },
      {
        step: 2,
        title: "Add Acid Droplets",
        detail: "Carefully add 5 to 10 drops of concentrated acid (lemon juice / vinegar or dilute hydrochloric acid) down the inside wall of the glass.",
        timerSeconds: 20
      },
      {
        step: 3,
        title: "Observe for Magenta / Pink Flash",
        detail: "Observe whether the solution turns an instant bright fuchsia pink or magenta. If pure, adding water afterwards causes yellow to persist; if Metanil yellow is present, intense pink remains.",
        timerSeconds: 45
      },
      {
        step: 4,
        title: "Take a Photo of the Liquid",
        detail: "Ensure natural white lighting and photograph the colored layer for analysis.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Turmeric Result",
      description: "Turmeric turns a slight reddish-brown with acid, but immediately reverts to a cloudy earthy golden-yellow when diluted with water.",
      colorHex: "#eab308",
      colorTag: "Natural Earthy Golden Yellow"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "The liquid flashes an intense fluorescent magenta, vibrant pink, or crimson purple that persists even upon further dilution with water.",
      colorHex: "#be185d",
      colorTag: "Intense Magenta / Fuchsia Pink"
    },
    detectionRule: {
      type: "magenta_pink",
      hueMin: 290,
      hueMax: 350,
      satMin: 40,
      valMin: 40,
      thresholdRatio: 0.15,
      suspectedAdulterant: "Metanil Yellow Chemical Dye"
    },
    safetyWarnings: [
      "Handle acids carefully. Wash hands immediately if acid comes into contact with bare skin.",
      "Never ingest the chemical reaction mixture.",
      "Perform test on a stable, non-porous countertop."
    ]
  },
  {
    id: "honey-invert-sugar",
    food: "Honey",
    category: "Sweeteners",
    adulterant: "High-Fructose Corn Syrup / Invert Sugar Syrup",
    whyAdulterated: "High-fructose corn syrup, rice syrup, and invert sugar are chemically clear liquids blended in huge quantities to maximize weight at a fraction of genuine beekeeping costs.",
    healthHazard: "High consumption of industrial fructose syrup contributes to non-alcoholic fatty liver disease, metabolic syndrome, insulin resistance, and deceptive diabetic danger.",
    hazardLevel: "Moderate",
    testName: "Cold Water Dissolution & Dispersion Test",
    reagentType: "Household Common Items",
    materials: [
      "1 teaspoon Honey sample",
      "1 glass of cold room-temperature water",
      "Cotton cotton bud or matchstick (optional flame test)"
    ],
    steps: [
      {
        step: 1,
        title: "Pour Cold Water",
        detail: "Fill a clear transparent drinking glass 3/4 full with still, cold water. Do not stir.",
        timerSeconds: 15
      },
      {
        step: 2,
        title: "Drop Honey From Spoon",
        detail: "Hold a spoonful of honey 2 inches above the glass and allow a thick single drop to fall straight down into the water.",
        timerSeconds: 20
      },
      {
        step: 3,
        title: "Observe Sinking Behavior",
        detail: "Watch how the drop travels. Pure honey has high viscosity and sinks straight to the bottom as an intact blob without dissolving.",
        timerSeconds: 40
      },
      {
        step: 4,
        title: "Document Dissolution Pattern",
        detail: "Adulterated sugar syrup immediately begins dispersing, clouds the water column, and dissolves before resting at the base.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Honey Result",
      description: "Honey stays cohesive, drops straight to the bottom of the glass in a solid thread, and settles at the base without clouding the surrounding water.",
      colorHex: "#b45309",
      colorTag: "Dense Undissolved Base Sinking"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "The drop dissolves or breaks apart on contact, creating cloudy streaks, rapid diffusion, and instant swirling sweet liquid in the water column.",
      colorHex: "#fde68a",
      colorTag: "Rapid Water Clouding & Dispersion"
    },
    detectionRule: {
      type: "diffusion_dispersion",
      hueMin: 35,
      hueMax: 55,
      satMin: 20,
      valMin: 60,
      thresholdRatio: 0.25,
      suspectedAdulterant: "Invert Sugar / Corn Syrup Diffusion"
    },
    safetyWarnings: [
      "If using the alternative cotton wick flame test, exercise fire safety and keep water nearby.",
      "Pure honey can crystallize naturally at low temperatures; this is not adulteration."
    ]
  },
  {
    id: "oil-argemone",
    food: "Mustard Oil / Cooking Oil",
    category: "Oils & Fats",
    adulterant: "Argemone Seed Oil (Toxic Weed Oil)",
    whyAdulterated: "Argemone mexicana seeds resemble mustard seeds closely and yield toxic oil used by unscrupulous producers to cheaply dilute cold-pressed mustard oil.",
    healthHazard: "Extremely dangerous! Argemone oil contains toxic alkaloids (sanguinarine & dihydrosanguinarine) causing 'Epidemic Dropsy', severe gastrointestinal distress, bilateral leg swelling, glaucoma, and cardiac arrest.",
    hazardLevel: "Critical",
    testName: "Nitric Acid / Reagent Precipitate Test",
    reagentType: "Pharmacy / Laboratory Acid",
    materials: [
      "5 ml Mustard oil sample",
      "5 ml Concentrated Nitric Acid (or laboratory testing kit)",
      "Heat-resistant glass test tube",
      "Protective gloves"
    ],
    steps: [
      {
        step: 1,
        title: "Sample Preparation",
        detail: "Take 5 ml of mustard oil in a clean glass test tube.",
        timerSeconds: 20
      },
      {
        step: 2,
        title: "Carefully Add Acid",
        detail: "Slowly add 5 ml of concentrated nitric acid down the inside of the tube. Shake gently for 15 seconds.",
        timerSeconds: 30
      },
      {
        step: 3,
        title: "Observe Interface Layer",
        detail: "Let the tube stand undisturbed for 2 minutes. Observe the boundary layer where the oil and acid meet.",
        timerSeconds: 60
      },
      {
        step: 4,
        title: "Check for Crimson / Brown Ring",
        detail: "Pure mustard oil shows no crimson layer. Argemone adulteration produces a distinct reddish-brown precipitate ring at the contact boundary.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Mustard Oil Result",
      description: "Clean golden-yellow separation. The acid layer remains pale or clear with no reddish-brown precipitate ring.",
      colorHex: "#ca8a04",
      colorTag: "Clear Golden Yellow Interface"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Appearance of a dark reddish-brown to crimson ring at the acid-oil interface, or reddish precipitate settling within minutes.",
      colorHex: "#7f1d1d",
      colorTag: "Reddish-Brown Precipitate Ring"
    },
    detectionRule: {
      type: "crimson_brown",
      hueMin: 0,
      hueMax: 25,
      satMin: 45,
      valMax: 65,
      thresholdRatio: 0.18,
      suspectedAdulterant: "Argemone Alkaloid Complex"
    },
    safetyWarnings: [
      "CRITICAL: Argemone oil is poisonous. If your sample tests positive, immediately quarantine the cooking oil and notify public health authorities.",
      "Wear eye protection and gloves when handling nitric acid."
    ]
  },
  {
    id: "chilli-rhodamine-brick",
    food: "Red Chilli Powder",
    category: "Spices",
    adulterant: "Brick Powder & Rhodamine B Industrial Dye",
    whyAdulterated: "Brick dust and talc powder add artificial physical weight; Rhodamine B dye provides an unnaturally vivid red appearance to disguise spent or expired chilli pods.",
    healthHazard: "Rhodamine B is a carcinogenic fluorescent industrial staining dye banned worldwide in food. Brick dust causes chronic bowel perforation and severe kidney stones.",
    hazardLevel: "Critical",
    testName: "Water Sedimentation & Color Bleed Test",
    reagentType: "Household Common Items",
    materials: [
      "1 teaspoon Red chilli powder",
      "1 glass of clean room-temperature water",
      "Glass spoon"
    ],
    steps: [
      {
        step: 1,
        title: "Fill Glass with Water",
        detail: "Fill a clear drinking glass 3/4 full with clean tap water.",
        timerSeconds: 15
      },
      {
        step: 2,
        title: "Sprinkle Powder Gently",
        detail: "Gently sprinkle 1 teaspoon of red chilli powder evenly on the surface of the water without stirring.",
        timerSeconds: 20
      },
      {
        step: 3,
        title: "Watch Sedimentation & Color Trails",
        detail: "Observe for 60 seconds. Pure chilli floats or sinks gradually with natural oily sheen. Brick dust plunges immediately to the bottom like sand. Synthetic dye bleeds artificial crimson streaks downwards.",
        timerSeconds: 60
      },
      {
        step: 4,
        title: "Inspect Residue at Bottom",
        detail: "Rub the sediment settled at the bottom between your fingertips. Gritty texture confirms brick powder / sand.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Chilli Result",
      description: "Spices float on surface or settle slowly. Water remains relatively clear or light orange with subtle natural capsaicin oils. Bottom residue is soft and smooth.",
      colorHex: "#ea580c",
      colorTag: "Natural Soft Orange-Red"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Fast-dropping heavy particles that form gritty sand at the base, accompanied by vivid neon crimson or bright pink dye trails staining the water column.",
      colorHex: "#991b1b",
      colorTag: "Gritty Brick Residue & Dye Bleed"
    },
    detectionRule: {
      type: "crimson_bleed",
      hueMin: 340,
      hueMax: 360,
      satMin: 55,
      valMin: 50,
      thresholdRatio: 0.20,
      suspectedAdulterant: "Rhodamine B Dye / Brick Sediment"
    },
    safetyWarnings: [
      "Avoid inhaling fine chilli dust during the sprinkling step.",
      "Wash hands thoroughly after handling; avoid touching eyes."
    ]
  },
  {
    id: "peas-malachite-green",
    food: "Green Peas / Vegetables",
    category: "Vegetables",
    adulterant: "Malachite Green Dye",
    whyAdulterated: "Malachite Green is an intensely vibrant green industrial textile dye illegally used to coat old, dried, or chemically processed peas to pass them off as fresh garden peas.",
    healthHazard: "Malachite Green is toxic, mutagenic, and a known hepatic carcinogen. Ingesting dye residues causes multi-organ damage and cellular toxicity.",
    hazardLevel: "Critical",
    testName: "Paraffin / Wet Blotting Paper Extraction",
    reagentType: "Liquid Paraffin or White Filter Paper",
    materials: [
      "Handful of fresh or frozen green peas",
      "White filter paper or cotton swab soaked in liquid paraffin / water",
      "Small white saucer"
    ],
    steps: [
      {
        step: 1,
        title: "Place Peas on Saucer",
        detail: "Take 10-15 green peas and place them onto a clean white saucer.",
        timerSeconds: 15
      },
      {
        step: 2,
        title: "Soak Swab / Filter Paper",
        detail: "Take a piece of white filter paper or a clean cotton pad moistened with water or liquid paraffin.",
        timerSeconds: 15
      },
      {
        step: 3,
        title: "Vigorously Rub Surface",
        detail: "Vigorously rub the moist paper across the outer skin of the peas for 30 seconds.",
        timerSeconds: 30
      },
      {
        step: 4,
        title: "Inspect Paper Color Transfer",
        detail: "Look closely at the white paper. Pure peas will not stain the paper. Adulterated peas leave an unmistakable neon green chemical stain on the paper.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Peas Result",
      description: "Filter paper stays clean and white. Natural chlorophyll in plant cell walls does not leach onto dry or lightly damp paper without boiling.",
      colorHex: "#f8fafc",
      colorTag: "Clean White Paper (No Dye Leach)"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Filter paper absorbs a brilliant artificial peacock green or emerald chemical stain transferred directly from the pea skins.",
      colorHex: "#059669",
      colorTag: "Intense Emerald Green Stain"
    },
    detectionRule: {
      type: "malachite_green",
      hueMin: 140,
      hueMax: 175,
      satMin: 45,
      valMin: 35,
      thresholdRatio: 0.16,
      suspectedAdulterant: "Malachite Green Textile Dye"
    },
    safetyWarnings: [
      "Do not eat any peas from a batch showing positive green chemical transfer.",
      "Notify the local municipal food safety office or vendor."
    ]
  },
  {
    id: "black-pepper-papaya",
    food: "Black Pepper",
    category: "Spices",
    adulterant: "Dried Papaya Seeds",
    whyAdulterated: "Dried papaya seeds have nearly the exact same dark brownish-black color and wrinkled round appearance as whole black peppercorns, but cost pennies to harvest.",
    healthHazard: "While not acutely poisonous, papaya seeds have an unpleasant bitter taste, induce stomach distress, and fraudulent batches cheat consumers of genuine piperine benefits.",
    hazardLevel: "Low",
    testName: "Alcohol / Water Flotation Density Test",
    reagentType: "Household Rubbing Alcohol or Water",
    materials: [
      "1 tablespoon Black peppercorns",
      "1 cup of water or diluted alcohol (surgical spirit)",
      "Clear glass tumbler"
    ],
    steps: [
      {
        step: 1,
        title: "Fill Glass with Liquid",
        detail: "Fill a glass with clean water (or rubbing alcohol for even clearer density distinction).",
        timerSeconds: 15
      },
      {
        step: 2,
        title: "Add Peppercorns",
        detail: "Drop the peppercorns into the liquid.",
        timerSeconds: 10
      },
      {
        step: 3,
        title: "Observe Floating vs Sinking",
        detail: "Pure black peppercorns are dense and heavy with piperine oils — they quickly sink to the bottom. Dried papaya seeds are lightweight and hollow inside — they float buoyantly to the surface.",
        timerSeconds: 30
      },
      {
        step: 4,
        title: "Photograph Top Surface",
        detail: "Count the number of floating oval seeds to gauge adulteration percentage.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Peppercorn Result",
      description: "Virtually all peppercorns sink firmly to the bottom of the glass. Liquid surface remains clear.",
      colorHex: "#27272a",
      colorTag: "100% Sunk Dense Peppercorns"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Significant number of wrinkled, oval, shrivelled seeds float on top of the liquid. When pressed, they crush easily without pepper fragrance.",
      colorHex: "#52525b",
      colorTag: "Floating Oval Papaya Seeds"
    },
    detectionRule: {
      type: "flotation_density",
      hueMin: 20,
      hueMax: 50,
      satMin: 10,
      valMax: 40,
      thresholdRatio: 0.20,
      suspectedAdulterant: "Papaya Seeds (Low Density Flotation)"
    },
    safetyWarnings: [
      "If rubbing alcohol was used, do not consume any tested peppercorns.",
      "Safely drain the liquid after logging your test."
    ]
  },
  {
    id: "coffee-chicory",
    food: "Coffee Powder",
    category: "Beverages",
    adulterant: "Excess Unlabeled Chicory / Clay Powder",
    whyAdulterated: "Roasted chicory root powder is much cheaper than Arabica/Robusta coffee beans. While permitted up to 49% in explicitly labeled blends, it is frequently used to adulterate 'pure coffee'.",
    healthHazard: "Consumers with ragweed allergies can have severe allergic reactions to chicory. Cheats consumers paying high prices for pure roasted coffee bean powder.",
    hazardLevel: "Moderate",
    testName: "Cold Water Streak Test",
    reagentType: "Household Common Items",
    materials: [
      "1/2 teaspoon Coffee powder",
      "1 tall transparent glass filled with cold water",
      "White background paper"
    ],
    steps: [
      {
        step: 1,
        title: "Prepare Cold Water Glass",
        detail: "Pour still cold water into a tall transparent glass tumbler.",
        timerSeconds: 15
      },
      {
        step: 2,
        title: "Sprinkle Coffee on Surface",
        detail: "Gently sprinkle 1/2 teaspoon of coffee powder over the water surface. Do NOT stir or shake.",
        timerSeconds: 20
      },
      {
        step: 3,
        title: "Watch for Sinking Streaks",
        detail: "Observe the water column for 2 minutes. Pure coffee particles float on top for a long time due to natural bean oils. Chicory absorbs water instantly, sinks to the bottom, and leaves a noticeable caramel brown trail behind.",
        timerSeconds: 60
      },
      {
        step: 4,
        title: "Photograph the Water Column",
        detail: "Look for downward sinking brownish-yellow streaks emanating from the surface layer.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Coffee Result",
      description: "Coffee particles float comfortably on top. Water underneath remains clear for several minutes without rapid discoloration.",
      colorHex: "#451a03",
      colorTag: "Floating Coffee Crust & Clear Water"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Particles sink quickly to the base, leaving thick dark brown or reddish-yellow bleeding streaks down through the water column.",
      colorHex: "#92400e",
      colorTag: "Dense Sinking Caramel Streaks"
    },
    detectionRule: {
      type: "caramel_streak",
      hueMin: 25,
      hueMax: 45,
      satMin: 40,
      valMin: 35,
      thresholdRatio: 0.18,
      suspectedAdulterant: "Chicory / Caramel Colorant"
    },
    safetyWarnings: [
      "Check the label: if sold as 'Coffee-Chicory mixture', chicory is legally declared. This test flags undeclared adulteration in '100% Pure Coffee'."
    ]
  },
  {
    id: "tea-exhausted-dye",
    food: "Tea Leaves",
    category: "Beverages",
    adulterant: "Exhausted Tea Leaves with Chemical Dye",
    whyAdulterated: "Used (exhausted) tea leaves from hotels and tea stalls are gathered, dried, and coated with artificial coal-tar dyes or iron filings to make them look brand new.",
    healthHazard: "Coal tar dyes are toxic and potential human carcinogens. Iron filings damage teeth and gastrointestinal lining.",
    hazardLevel: "Critical",
    testName: "Cold Water Filter Paper Smear Test",
    reagentType: "Filter Paper or Wet Tissue",
    materials: [
      "1 teaspoon Tea leaves",
      "1 sheet of white filter paper or paper towel",
      "Cold water spray or dropper"
    ],
    steps: [
      {
        step: 1,
        title: "Moisten Paper",
        detail: "Lightly moisten a sheet of white filter paper with clean cold water so it is evenly damp.",
        timerSeconds: 15
      },
      {
        step: 2,
        title: "Spread Tea Leaves",
        detail: "Spread 1 teaspoon of tea leaves evenly across the damp paper.",
        timerSeconds: 20
      },
      {
        step: 3,
        title: "Observe Cold Color Release",
        detail: "Watch the paper for 3 minutes. Natural tea requires hot boiling water to release its tannin color. If artificial chemical color has been added, spots of yellow, red, or dark brown appear immediately on the damp paper.",
        timerSeconds: 90
      },
      {
        step: 4,
        title: "Examine Stained Spots",
        detail: "Lift the tea leaves off. If yellow or brown spots are clearly visible on the paper, synthetic coloring is present.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Tea Result",
      description: "Filter paper stays almost entirely white and unstained with cold water. No localized bleeding of artificial colors.",
      colorHex: "#f8fafc",
      colorTag: "Clean Paper (No Cold Color Release)"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Distinct localized yellow, orange, or deep crimson chemical dye halos bleed outwards around individual tea granules on cold contact.",
      colorHex: "#b45309",
      colorTag: "Artificial Dye Halo Spots"
    },
    detectionRule: {
      type: "dye_spotting",
      hueMin: 20,
      hueMax: 45,
      satMin: 35,
      valMin: 40,
      thresholdRatio: 0.15,
      suspectedAdulterant: "Coal-Tar Chemical Dye / Exhausted Leaves"
    },
    safetyWarnings: [
      "Never consume tea leaves that bleed vivid synthetic color in plain cold water.",
      "Check with a magnet: pass a clean magnet over dry tea leaves to detect iron filing adulteration."
    ]
  },
  {
    id: "ghee-vanaspati",
    food: "Desi Ghee / Butter",
    category: "Dairy",
    adulterant: "Hydrogenated Vegetable Fat (Vanaspati) / Mashed Potato",
    whyAdulterated: "Hydrogenated vegetable fat (Vanaspati) and cheap animal fats are mixed into pure cow or buffalo desi ghee to mimic texture and aroma at 1/5th the raw cost.",
    healthHazard: "Hydrogenated vegetable fats contain high levels of dangerous trans-fats, accelerating cardiovascular arterial plaque, high LDL cholesterol, and coronary heart disease.",
    hazardLevel: "High",
    testName: "Baudouin Test (Furfural / Hydrochloric Acid Test)",
    reagentType: "Pharmacy / Laboratory Acid",
    materials: [
      "5 ml Melted Desi Ghee or Butter",
      "5 ml Concentrated Hydrochloric Acid (HCl)",
      "Pinch of pure table sugar (sucrose)",
      "Glass test tube"
    ],
    steps: [
      {
        step: 1,
        title: "Melt Sample",
        detail: "Melt 5 ml of ghee or butter sample in a clean glass test tube until fully liquid.",
        timerSeconds: 30
      },
      {
        step: 2,
        title: "Add Acid & Sugar",
        detail: "Add 5 ml of hydrochloric acid and a pinch of sugar. Shake the tube vigorously for 1 minute.",
        timerSeconds: 60
      },
      {
        step: 3,
        title: "Let Mixture Settle",
        detail: "Allow the test tube to rest upright in a holder for 5 minutes for the layers to separate.",
        timerSeconds: 90
      },
      {
        step: 4,
        title: "Inspect Lower Acid Layer",
        detail: "By law, sesame oil is added to Vanaspati as a marker. The Baudouin reaction produces an intense crimson/rose red color in the acid layer if Vanaspati is present.",
        timerSeconds: 0
      }
    ],
    normalResult: {
      title: "Pure Desi Ghee Result",
      description: "No change in color of the acid layer. It remains transparent or pale yellow.",
      colorHex: "#fef08a",
      colorTag: "Pale Yellow / Colorless Acid Layer"
    },
    suspiciousResult: {
      title: "Suspected Adulterated Result",
      description: "Lower acid layer turns a distinct rose-red, crimson, or vibrant pink, confirming presence of hydrogenated vegetable fats (Vanaspati).",
      colorHex: "#e11d48",
      colorTag: "Rose-Red / Crimson Acid Layer"
    },
    detectionRule: {
      type: "rose_red",
      hueMin: 330,
      hueMax: 355,
      satMin: 45,
      valMin: 40,
      thresholdRatio: 0.15,
      suspectedAdulterant: "Hydrogenated Fat (Vanaspati) Marker"
    },
    safetyWarnings: [
      "Hydrochloric acid is corrosive. Always add acid slowly, wear gloves, and do not inhale vapors.",
      "Discard test chemicals responsibly. Never taste test mixture."
    ]
  }
];
