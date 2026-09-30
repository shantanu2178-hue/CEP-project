// Pre-rendered sample test reaction photos for instant AI Computer Vision evaluation
export const sampleTestImages = [
  {
    id: "milk-starch-positive",
    testId: "milk-starch",
    label: "Milk + Iodine (Starch Positive)",
    food: "Milk",
    description: "Boiled milk reacting with iodine drops, showing intense dark navy blue/black starch complex.",
    targetColor: "blue_black",
    expectedResult: "Suspected Positive",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='200' cy='150' r='110' fill='%23ffffff' stroke='%2394a3b8' stroke-width='6'/><circle cx='200' cy='150' r='100' fill='%23fef3c7'/><circle cx='180' cy='140' r='55' fill='%231e1b4b'/><circle cx='220' cy='160' r='50' fill='%230f172a'/><path d='M160,110 Q190,130 230,120 T250,170 T170,180 Z' fill='%231e1b4b'/><circle cx='195' cy='150' r='35' fill='%23090d16'/><text x='200' y='285' font-family='sans-serif' font-weight='bold' font-size='13' fill='%2393c5fd' text-anchor='middle'>Test Reaction: Dark Navy Blue Complex</text></svg>"
  },
  {
    id: "milk-pure-negative",
    testId: "milk-starch",
    label: "Pure Milk + Iodine (Negative)",
    food: "Milk",
    description: "Genuine unadulterated milk with iodine drops; retains creamy pale yellow hue without blue/black discoloration.",
    targetColor: "cream_yellow",
    expectedResult: "Normal / Negative",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%231e293b'/><circle cx='200' cy='150' r='110' fill='%23ffffff' stroke='%2394a3b8' stroke-width='6'/><circle cx='200' cy='150' r='100' fill='%23fffbeb'/><circle cx='190' cy='145' r='20' fill='%23fef08a' opacity='0.7'/><circle cx='215' cy='155' r='15' fill='%23fde68a' opacity='0.6'/><text x='200' y='285' font-family='sans-serif' font-weight='bold' font-size='13' fill='%2386efac' text-anchor='middle'>Test Reaction: Pale Creamy White (Negative)</text></svg>"
  },
  {
    id: "turmeric-metanil-positive",
    testId: "turmeric-metanil-yellow",
    label: "Turmeric + Acid (Metanil Yellow Positive)",
    food: "Turmeric Powder",
    description: "Turmeric powder solution treated with acid droplets, flashing intense fluorescent magenta/pink.",
    targetColor: "magenta_pink",
    expectedResult: "Suspected Positive",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><circle cx='200' cy='150' r='110' fill='%23334155' stroke='%2364748b' stroke-width='4'/><circle cx='200' cy='150' r='100' fill='%23be185d'/><circle cx='180' cy='135' r='60' fill='%23db2777'/><circle cx='220' cy='165' r='50' fill='%239d174d'/><circle cx='200' cy='150' r='30' fill='%23f43f5e'/><text x='200' y='285' font-family='sans-serif' font-weight='bold' font-size='13' fill='%23fbcfe8' text-anchor='middle'>Test Reaction: Vivid Magenta Acid Flash</text></svg>"
  },
  {
    id: "turmeric-pure-negative",
    testId: "turmeric-metanil-yellow",
    label: "Pure Turmeric + Acid (Negative)",
    food: "Turmeric Powder",
    description: "Pure turmeric solution; retains earthy golden-yellow color upon dilution with water.",
    targetColor: "earthy_yellow",
    expectedResult: "Normal / Negative",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><circle cx='200' cy='150' r='110' fill='%23334155' stroke='%2364748b' stroke-width='4'/><circle cx='200' cy='150' r='100' fill='%23ca8a04'/><circle cx='185' cy='140' r='60' fill='%23eab308'/><circle cx='215' cy='160' r='45' fill='%23a16207'/><text x='200' y='285' font-family='sans-serif' font-weight='bold' font-size='13' fill='%23fef08a' text-anchor='middle'>Test Reaction: Earthy Golden Yellow</text></svg>"
  },
  {
    id: "oil-argemone-positive",
    testId: "oil-argemone",
    label: "Mustard Oil + Nitric Acid (Argemone Positive)",
    food: "Mustard Oil",
    description: "Nitric acid interface layer displaying a dark reddish-brown precipitate boundary ring.",
    targetColor: "crimson_brown",
    expectedResult: "Suspected Positive",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><rect x='120' y='30' width='160' height='220' rx='8' fill='%231e293b' stroke='%23475569' stroke-width='4'/><rect x='125' y='40' width='150' height='90' fill='%23eab308'/><rect x='125' y='130' width='150' height='35' fill='%237f1d1d'/><rect x='125' y='165' width='150' height='80' fill='%23f8fafc'/><text x='200' y='152' font-family='sans-serif' font-weight='bold' font-size='11' fill='%23ffffff' text-anchor='middle'>REDDISH-BROWN RING</text><text x='200' y='285' font-family='sans-serif' font-weight='bold' font-size='13' fill='%23fca5a5' text-anchor='middle'>Interface Precipitate Ring Formed</text></svg>"
  },
  {
    id: "peas-malachite-positive",
    testId: "peas-malachite-green",
    label: "Green Peas Rub (Malachite Green Positive)",
    food: "Green Peas",
    description: "White filter paper rubbed vigorously against treated peas, absorbing vibrant artificial neon green dye.",
    targetColor: "malachite_green",
    expectedResult: "Suspected Positive",
    dataUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%230f172a'/><rect x='80' y='40' width='240' height='200' rx='12' fill='%23ffffff' stroke='%23cbd5e1' stroke-width='3'/><circle cx='200' cy='140' r='60' fill='%23059669'/><circle cx='180' cy='130' r='35' fill='%2310b981'/><circle cx='225' cy='150' r='25' fill='%23047857'/><text x='200' y='285' font-family='sans-serif' font-weight='bold' font-size='13' fill='%2386efac' text-anchor='middle'>Filter Paper: Artificial Green Chemical Stain</text></svg>"
  }
];
