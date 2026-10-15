export const legalFramework = {
  act: 'Food Safety and Standards Act, 2006 (34 of 2006)',
  authority: 'Food Safety and Standards Authority of India (FSSAI)',
  enacted: 'Assented to by the President of India on 23 August 2006',
  preamble:
    'The FSS Act, 2006 consolidates and amends the Food Adulteration Act, 1954 and the Preventive Food Adulteration Act, 1954, and repeals the Food Adulteration Act, 1954.',
  keyDefinitions: [
    {
      term: 'Adulterant',
      text: 'Any material which is or could be employed for making the food unsafe, sub-standard, mis-branded, or containing extraneous matter.',
      section: 'Section 2(1)(a)',
    },
    {
      term: 'Unsafe food',
      text: 'Article of food containing any substance, which may render it injurious to health, or which makes it unfit for human consumption.',
      section: 'Section 2(1)(o)',
    },
    {
      term: 'Sub-standard food',
      text: 'Article of food that does not meet the specified standards, but not so as to render the article unsafe.',
      section: 'Section 2(1)(zx)',
    },
    {
      term: 'Extraneous matter',
      text: 'Any foreign matter or food additive present in an article of food in excess of the limits permitted by regulations.',
      section: 'Section 2(1)(de)',
    },
  ],
};

export const penalties = [
  {
    section: 'Section 30',
    offence: 'Sale of food not of the nature, substance or quality demanded',
    punishment: 'Imprisonment up to 3 months, or fine up to INR 5,000, or both',
  },
  {
    section: 'Section 31',
    offence: 'Sale of sub-standard food',
    punishment: 'Imprisonment up to 6 months, or fine up to INR 5,000, or both',
  },
  {
    section: 'Section 32',
    offence: 'Sale of misbranded food',
    punishment: 'Imprisonment up to 3 months, or fine up to INR 10,000, or both',
  },
  {
    section: 'Section 57',
    offence: 'Possessing an adulterant not injurious to health',
    punishment: 'Penalty not exceeding INR 2,00,000',
  },
  {
    section: 'Section 57(1)(ii)',
    offence: 'Possessing an adulterant injurious to health',
    punishment: 'Penalty not exceeding INR 10,00,000',
  },
  {
    section: 'Section 58',
    offence: 'Failure to comply with directions of a Food Safety Officer',
    punishment: 'Penalty up to INR 1,00,000, plus daily fine up to INR 1,00,000 for a continuing offence',
  },
  {
    section: 'Section 59',
    offence: 'Selling unsafe food (first conviction)',
    punishment: 'Imprisonment up to 2 years, or fine up to INR 5,00,000, or both',
  },
  {
    section: 'Section 59(2)',
    offence: 'Selling unsafe food (subsequent conviction)',
    punishment: 'Imprisonment up to 5 years and fine up to INR 10,00,000, and licence cancellation',
  },
  {
    section: 'Section 65',
    offence: 'Carrying on a business without a valid licence',
    punishment: 'Imprisonment up to 2 years and fine up to INR 10,00,000',
  },
  {
    section: 'Section 65A',
    offence: 'Compensation to consumer for injury or death',
    punishment: 'Not less than INR 50,000, up to INR 10,00,000 (latter in case of food containing an adulterant)',
  },
];

export const prohibitedSales = [
  {
    regulation: 'Reg. 2.1.1(2)',
    prohibition: 'Milk which contains any added water',
    relatedTest: 'milk-starch',
  },
  {
    regulation: 'Reg. 2.1.1(3)',
    prohibition: 'Ghee containing any added matter not exclusively derived from milk fat',
    relatedTest: 'ghee-vanaspati',
  },
  {
    regulation: 'Reg. 2.1.1(4)',
    prohibition: 'Skimmed milk (fat abstracted) sold as milk',
    relatedTest: 'milk-starch',
  },
  {
    regulation: 'Reg. 2.1.1(5)',
    prohibition: 'A mixture of two or more edible oils sold as an edible oil',
    relatedTest: 'oil-argemone',
  },
  {
    regulation: 'Reg. 2.1.1(6)',
    prohibition: 'Vanaspati to which ghee or any other substance has been added',
    relatedTest: 'ghee-vanaspati',
  },
  {
    regulation: 'Reg. 2.1.1(7)',
    prohibition: 'Turmeric containing any foreign substance',
    relatedTest: 'turmeric-metanil-yellow',
  },
  {
    regulation: 'Reg. 2.1.1(8)',
    prohibition: 'Mixture of coffee and any substance other than chicory',
    relatedTest: 'coffee-chicory',
  },
  {
    regulation: 'Reg. 2.1.1(9)',
    prohibition: 'Dahi or curd not prepared from boiled, pasteurised or sterilised milk',
    relatedTest: 'milk-starch',
  },
  {
    regulation: 'Reg. 2.1.1(11)',
    prohibition:
      'Multi-source edible vegetable oil containing mustard oil, manufactured on or after 8 June 2021',
    relatedTest: 'oil-argemone',
  },
  {
    regulation: 'Reg. 2.3.3',
    prohibition:
      'Food resembling but not pure honey may not be marketed, labelled or advertised as honey',
    relatedTest: 'honey-invert-sugar',
  },
  {
    regulation: 'Reg. 2.3.6',
    prohibition:
      'Fresh fruits and vegetables must be free from rotting and free of coating of waxes, mineral oil and colours (beeswax, carnauba or shellac permitted under GMP with label declaration)',
    relatedTest: 'peas-malachite-green',
  },
  {
    regulation: 'Reg. 2.3.15(2)',
    prohibition: 'No vegetable oil shall contain any harmful colouring, flavouring or other matter deleterious to health',
    relatedTest: 'oil-argemone',
  },
  {
    regulation: 'Reg. 2.3.15(4)',
    prohibition:
      'No colour shall be added to hydrogenated vegetable oil unless authorised by the Food Authority, and in no event a colour resembling the colour of ghee',
    relatedTest: 'ghee-vanaspati',
  },
  {
    regulation: 'Reg. 2.3.14(15)',
    prohibition: 'Powdered spices and condiments shall be sold only under packed conditions',
    relatedTest: 'chilli-rhodamine-brick',
  },
];

export const colourRegulation = {
  permittedStandard:
    'Permitted synthetic colours may not exceed 100 parts per million of the final food product; in certain products and beverages the maximum is 200 ppm. Any added synthetic colour must be declared on the label.',
  nonPermittedColours: [
    'Metanil Yellow',
    'Rhodamine B',
    'Malachite Green',
    'Fast Red',
    'Bromo-cresol Purple',
    'Green S',
    'Sudan I',
    'Sudan II',
    'Sudan III',
    'Sudan IV',
  ],
  permittedExamples: [
    'Curcumins (INS 100 100 (i))',
    'Riboflavins (INS 101)',
    'Chlorophyll (INS 140)',
    'Caramel I (INS 150a)',
    'Carotenes (INS 160a)',
    'Annatto extracts (INS 160b (iii))',
    'Paprika oleoresins (INS 160c)',
    'Lycopene (INS 160d)',
    'Beet red (INS 162)',
    'Anthocyanins (INS 163)',
    'Titanium dioxide (INS 171)',
  ],
  note:
    'Using colour to conceal blemishes or inferior produce is itself an offence, because it misleads the consumer into believing the food is sound when it is not.',
};

export const officialLabMethods = {
  document:
    'FSSAI Manual of Methods of Testing and Analysis for Detection of Adulterants',
  note:
    'Published reference laboratory methods used by Food Safety Officers for confirmatory analysis. A positive home-test result indicates grounds for suspicion; only a notified laboratory result constitutes legal proof.',
  chapters: [
    {
      chapter: 'II. Milk and Milk Products',
      methods: [
        {
          test: 'Detection of Thickeners in Milk Products',
          sub: 'Starch, mashed potato and cereal flour; gelatin; blotting paper in rabdi',
          relatedTest: 'milk-starch',
        },
        {
          test: 'Detection of Vanaspati / Hydrogenated Edible Fat in Ghee',
          sub: 'Identity test for hydrogenated fat substitution',
          relatedTest: 'ghee-vanespati',
        },
      ],
    },
    {
      chapter: 'III. Edible Oils and Fats',
      methods: [
        {
          test: 'Detection of Argemone Oil',
          sub: 'Crimson-red colour within 20–30 seconds indicates presence; no colour change in pure oil',
          relatedTest: 'oil-argemone',
        },
        { test: 'Detection of Rancidity', sub: 'Phloroglucinol in diethyl ether with concentrated HCl', relatedTest: 'ghee-vanaspati' },
        { test: 'Detection of Cottonseed Oil', sub: 'Halphen test, 110–115 °C water bath', relatedTest: 'oil-argemone' },
        { test: 'Detection of Mineral Oil in Edible Oil', sub: 'Inverted vapour technique', relatedTest: 'oil-argemone' },
        { test: 'Detection of Castor Oil in Edible Oil', sub: 'Acrolein test', relatedTest: 'oil-argemone' },
      ],
    },
    {
      chapter: 'IV. Spices and Condiments',
      methods: [
        { test: 'Detection of Metanil Yellow in Turmeric Powder', sub: 'Maric acid test', relatedTest: 'turmeric-metanil-yellow' },
        { test: 'Detection of Aniline Dyes in Turmeric Powder', sub: 'Aniline dye detection', relatedTest: 'turmeric-metanil-yellow' },
        { test: 'Detection of Lead Chromate in Turmeric Powder', sub: 'Chromate detection', relatedTest: 'turmeric-metanil-yellow' },
        { test: 'Detection of Brick Powder in Chilli Powder', sub: 'Sedimentation and grit test', relatedTest: 'chilli-rhodamine-brick' },
        { test: 'Detection of Chalk Powder in Turmeric', sub: 'Insoluble residue', relatedTest: 'turmeric-metanil-yellow' },
        { test: 'Detection of Added Starch in Powdered Spices', sub: 'Starch adulteration other than turmeric', relatedTest: 'turmeric-metanil-yellow' },
      ],
    },
  ],
};

export const surveyData = {
  title: 'FSSAI All-India Edible Oil Survey',
  published: 'Report on Edible Oil Survey, January 2022',
  scope: 'Conducted across all States and Union Territories on 25–27 August 2021, using 43 FSSAI-notified laboratories.',
  headline: {
    samplesAnalysed: 4433,
    argemoneOilPositive: 15,
    argemoneOilRate: 0.34,
  },
  breakdown: [
    { label: 'Mustard oil', shareOfFailures: 66.7 },
    { label: 'Rice bran oil', shareOfFailures: 13.3 },
    { label: 'Soybean oil', shareOfFailures: 13.3 },
    { label: 'Palm oil', shareOfFailures: 6.7 },
  ],
  healthNote:
    'Argemone oil is reported to cause glaucoma, dropsy and sometimes total blindness due to the presence of alkaloids such as sanguinarine and dihydrosanguinarine.',
};

export const productStandards = [
  {
    parameter: 'Trans fatty acids in refined vegetable oil',
    limit: 'Not more than 2.0% by weight (from 1 January 2022)',
    relatedTest: 'ghee-vanaspati',
  },
  {
    parameter: 'Hexane residue in refined solvent-extracted oil',
    limit: 'Not more than 0.5 ppm (press-expelled oils shall be free from hexane residue)',
    relatedTest: 'oil-argemone',
  },
  {
    parameter: 'Test for Argemone oil in edible oils',
    limit: 'Shall be NEGATIVE',
    relatedTest: 'oil-argemone',
  },
  {
    parameter: 'Total Polar Compounds in unused vegetable oil or fat',
    limit: 'Not more than 25%',
    relatedTest: 'oil-argemone',
  },
];

export const sources = [
  {
    title: 'Food Safety and Standards Act, 2006',
    publisher: 'Government of India',
    url: 'https://fssai.gov.in/docs/food-law/act-2006/Food_Safety_and_Standards_Act_2006.pdf',
  },
  {
    title: 'FSS (Prohibition and Restrictions on Sales) Regulations, 2011',
    publisher: 'FSSAI',
    url: 'https://www.fssai.gov.in/upload/uploadfiles/files/Comp_Prohibition%20and%20Restrcition%20of%20sales_XI_01042025.pdf',
  },
  {
    title: 'FSS (Food Products Standards and Food Additives) Regulations, 2011',
    publisher: 'FSSAI',
    url: 'https://fssai.gov.in/upload/uploadfiles/files/Comp_Food.pdf',
  },
  {
    title: 'Manual of Methods of Testing and Analysis for Detection of Adulterants',
    publisher: 'FSSAI',
    url: 'https://www.fssai.gov.in/upload/uploadfiles/files/Manual_Methods_Testing_Adulterants_18_10_2019.pdf',
  },
  {
    title: 'FAQ on Food Colours',
    publisher: 'FSSAI',
    url: 'https://www.fssai.gov.in/docs/standards/faqpdf/FAQ_Food_Colours.pdf',
  },
  {
    title: 'Report on Edible Oil Survey (January 2022)',
    publisher: 'FSSAI',
    url: 'https://fssai.gov.in/upload/uploadfiles/files/Report_Edible_Oil_Survey_27_01_2022.pdf',
  },
  {
    title: 'Food Safety Regulations index',
    publisher: 'FSSAI',
    url: 'https://www.fssai.gov.in/cms/food-safety-and-standards-regulations.php',
  },
];