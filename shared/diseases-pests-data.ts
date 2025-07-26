export interface DiseasePest {
  id: string;
  name: string;
  type: 'disease' | 'pest';
  category: 'fungal' | 'bacterial' | 'viral' | 'insect' | 'mite' | 'nematode' | 'environmental';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  commonNames: string[];
  scientificName?: string;
  description: string;
  symptoms: string[];
  causes: string[];
  affectedPlants: string[];
  identification: {
    visualSigns: string[];
    timing: string;
    progression: string;
  };
  prevention: {
    culturalPractices: string[];
    environmentalControls: string[];
    quarantine: string[];
  };
  treatment: {
    organic: string[];
    chemical: string[];
    biological: string[];
    immediate: string[];
    longTerm: string[];
  };
  prognosis: string;
  images?: string[];
}

export const diseasesAndPests: DiseasePest[] = [
  // DISEASES
  {
    id: 'black-rot',
    name: 'Black Rot',
    type: 'disease',
    category: 'bacterial',
    severity: 'critical',
    commonNames: ['Black Rot', 'Soft Rot', 'Bacterial Rot'],
    scientificName: 'Erwinia carotovora, Pectobacterium carotovorum',
    description: 'A devastating bacterial infection that causes rapid tissue breakdown and plant death. Most common and dangerous disease affecting cacti and succulents.',
    symptoms: [
      'Black, mushy, foul-smelling areas on stems or roots',
      'Rapid spreading of dark, wet spots',
      'Plant becomes soft and collapses',
      'Yellow to brown discoloration around infected areas',
      'Foul odor from affected tissue'
    ],
    causes: [
      'Overwatering and poor drainage',
      'High humidity and poor air circulation',
      'Wounds from handling or pests',
      'Contaminated soil or tools',
      'Temperature stress'
    ],
    affectedPlants: ['All cacti and succulents', 'Especially vulnerable: Echeveria, Sedum, Haworthia'],
    identification: {
      visualSigns: [
        'Black or dark brown mushy spots',
        'Tissue that feels soft when pressed',
        'Progressive darkening from infection point',
        'Clear boundary between healthy and infected tissue'
      ],
      timing: 'Can occur year-round, most common in warm, humid conditions',
      progression: 'Extremely rapid - can kill a plant within 24-48 hours'
    },
    prevention: {
      culturalPractices: [
        'Use well-draining soil mix',
        'Water at soil level, avoid getting water on leaves',
        'Allow soil to dry completely between waterings',
        'Sterilize tools between plants',
        'Quarantine new plants for 2-4 weeks'
      ],
      environmentalControls: [
        'Maintain good air circulation',
        'Keep humidity below 50%',
        'Avoid temperature fluctuations',
        'Provide bright, indirect light'
      ],
      quarantine: [
        'Isolate any suspect plants immediately',
        'Monitor for 2-4 weeks before introducing to collection',
        'Check for any soft spots or discoloration'
      ]
    },
    treatment: {
      organic: [
        'Immediately cut away all infected tissue with sterile knife',
        'Cut at least 1 inch into healthy tissue',
        'Dust cut areas with sulfur powder or cinnamon',
        'Let cuts dry for 3-7 days before replanting'
      ],
      chemical: [
        'Apply copper-based bactericide to cut areas',
        'Use hydrogen peroxide 3% solution on cuts',
        'Spray with streptomycin solution (where legal)',
        'Apply systemic bactericide if available'
      ],
      biological: [
        'Use beneficial bacteria like Bacillus subtilis',
        'Apply compost tea to boost plant immunity',
        'Introduce beneficial microorganisms to soil'
      ],
      immediate: [
        'Remove from other plants immediately',
        'Stop all watering',
        'Cut away infected tissue with sterile tools',
        'Dispose of infected material in trash, not compost'
      ],
      longTerm: [
        'Repot in fresh, sterile soil',
        'Improve drainage and air circulation',
        'Reduce watering frequency',
        'Monitor closely for 6+ months'
      ]
    },
    prognosis: 'Poor if not caught early. Can be fatal within days. Early intervention may save part of the plant.'
  },
  {
    id: 'root-rot',
    name: 'Root Rot',
    type: 'disease',
    category: 'fungal',
    severity: 'high',
    commonNames: ['Root Rot', 'Crown Rot', 'Pythium Rot'],
    scientificName: 'Pythium spp., Phytophthora spp., Rhizoctonia spp.',
    description: 'Fungal infection of root system causing gradual decline and eventual plant death. Often goes unnoticed until severe damage has occurred.',
    symptoms: [
      'Yellowing or reddening of lower leaves',
      'Plant appears dehydrated despite moist soil',
      'Stunted growth or failure to thrive',
      'Dark, mushy, or brittle roots',
      'Plant easily lifts from soil'
    ],
    causes: [
      'Overwatering and waterlogged soil',
      'Poor drainage in containers',
      'Contaminated potting mix',
      'Reusing infected containers',
      'Planting too deep'
    ],
    affectedPlants: ['All cacti and succulents', 'Most vulnerable: Lithops, Conophytum, young seedlings'],
    identification: {
      visualSigns: [
        'Dark brown or black roots instead of white/cream',
        'Roots break apart easily when touched',
        'Musty or foul smell from soil',
        'White fungal growth on soil surface'
      ],
      timing: 'Most common in cool, wet seasons',
      progression: 'Slow progression over weeks to months'
    },
    prevention: {
      culturalPractices: [
        'Use fast-draining cactus soil mix',
        'Ensure containers have drainage holes',
        'Water deeply but infrequently',
        'Plant at correct depth',
        'Use clean, sterilized containers'
      ],
      environmentalControls: [
        'Maintain good air circulation around roots',
        'Use elevated benches for drainage',
        'Avoid cold, damp conditions',
        'Control temperature fluctuations'
      ],
      quarantine: [
        'Inspect roots before planting',
        'Quarantine plants with questionable root health',
        'Sterilize tools between plants'
      ]
    },
    treatment: {
      organic: [
        'Remove plant and wash all soil from roots',
        'Cut away all dark, mushy roots with sterile tools',
        'Dust roots with sulfur or cinnamon',
        'Let roots dry for 3-5 days before replanting'
      ],
      chemical: [
        'Apply fungicide containing copper or thiophanate-methyl',
        'Use hydrogen peroxide soil drench',
        'Treat with systemic fungicide',
        'Apply preventive fungicide to healthy roots'
      ],
      biological: [
        'Use mycorrhizal fungi inoculant',
        'Apply beneficial bacteria to new soil',
        'Use compost tea for soil health'
      ],
      immediate: [
        'Stop watering immediately',
        'Remove from pot and inspect roots',
        'Isolate from other plants',
        'Prepare fresh, sterile potting mix'
      ],
      longTerm: [
        'Repot in well-draining mix',
        'Adjust watering schedule',
        'Monitor root health regularly',
        'Improve growing conditions'
      ]
    },
    prognosis: 'Good if caught early with healthy roots remaining. Poor if main taproot is affected.'
  },
  {
    id: 'scale-insects',
    name: 'Scale Insects',
    type: 'pest',
    category: 'insect',
    severity: 'moderate',
    commonNames: ['Scale', 'Hard Scale', 'Soft Scale', 'Armor Scale'],
    scientificName: 'Coccidae, Diaspididae families',
    description: 'Small, dome-shaped insects that attach to plant surfaces and feed on plant juices. Can severely weaken plants if left untreated.',
    symptoms: [
      'Small, round or oval bumps on stems and leaves',
      'Yellow or brown spots where scales feed',
      'Sticky honeydew on plant surfaces',
      'Yellowing and dropping of affected parts',
      'Stunted growth and weakened appearance'
    ],
    causes: [
      'Introduction of infected plants',
      'Poor air circulation',
      'High humidity conditions',
      'Stress from overwatering or underwatering',
      'Indoor conditions favoring reproduction'
    ],
    affectedPlants: ['Most cacti and succulents', 'Particularly: Opuntia, Mammillaria, Jade plants'],
    identification: {
      visualSigns: [
        'Hard, waxy bumps that can be scraped off',
        'Brown, white, or gray colored scales',
        'Shiny honeydew deposits',
        'Yellow stippling on plant surface'
      ],
      timing: 'Year-round indoors, spring-summer outdoors',
      progression: 'Gradual buildup over weeks to months'
    },
    prevention: {
      culturalPractices: [
        'Quarantine new plants for 4-6 weeks',
        'Inspect plants regularly for early detection',
        'Maintain plant health with proper care',
        'Clean leaves periodically with damp cloth',
        'Avoid overcrowding plants'
      ],
      environmentalControls: [
        'Ensure good air circulation',
        'Maintain moderate humidity levels',
        'Provide adequate light for plant health',
        'Avoid over-fertilizing'
      ],
      quarantine: [
        'Thoroughly inspect all new acquisitions',
        'Look for unusual bumps or deposits',
        'Use magnifying glass for small scales'
      ]
    },
    treatment: {
      organic: [
        'Scrape off scales with fingernail or soft brush',
        'Apply rubbing alcohol with cotton swab to individual scales',
        'Use insecticidal soap spray weekly',
        'Apply neem oil every 7-10 days',
        'Rinse plant with strong water spray'
      ],
      chemical: [
        'Apply systemic insecticide containing imidacloprid',
        'Use horticultural oil spray',
        'Apply contact insecticide for crawlers',
        'Use organic pyrethrin spray'
      ],
      biological: [
        'Introduce predatory insects like ladybugs',
        'Use parasitic wasps for biological control',
        'Apply beneficial nematodes to soil'
      ],
      immediate: [
        'Isolate infected plants',
        'Remove heavily infested parts',
        'Clean plant with alcohol swabs',
        'Begin treatment regimen immediately'
      ],
      longTerm: [
        'Repeat treatments every 7-14 days for 6-8 weeks',
        'Monitor for new scale development',
        'Improve plant growing conditions',
        'Continue preventive care practices'
      ]
    },
    prognosis: 'Good with persistent treatment. May take 2-3 months to completely eliminate.'
  },
  {
    id: 'mealybugs',
    name: 'Mealybugs',
    type: 'pest',
    category: 'insect',
    severity: 'moderate',
    commonNames: ['Mealybugs', 'Woolly Aphids', 'Cotton Scale'],
    scientificName: 'Pseudococcidae family',
    description: 'Soft-bodied insects covered in white, waxy secretions. They cluster in plant crevices and feed on plant juices, weakening the plant.',
    symptoms: [
      'White, cotton-like masses in joints and crevices',
      'Yellowing and distortion of affected areas',
      'Sticky honeydew on plant surfaces',
      'Stunted growth and wilting',
      'Black sooty mold on honeydew deposits'
    ],
    causes: [
      'High humidity and poor air circulation',
      'Overwatering and overfertilization',
      'Introduction of infected plants',
      'Stress from environmental changes',
      'Indoor growing conditions'
    ],
    affectedPlants: ['Most succulents', 'Especially: Echeveria, Sedum, Crassula, cacti with deep ribs'],
    identification: {
      visualSigns: [
        'White, fluffy masses that look like cotton',
        'Insects visible as small, pink/yellow bodies under white wax',
        'Clusters in leaf joints, stem crevices, and around spines',
        'Ants attracted to honeydew'
      ],
      timing: 'Year-round indoors, warmer months outdoors',
      progression: 'Rapid reproduction - populations can explode quickly'
    },
    prevention: {
      culturalPractices: [
        'Quarantine new plants thoroughly',
        'Inspect plants weekly, especially hidden areas',
        'Avoid overwatering and overfertilizing',
        'Maintain plant health and vigor',
        'Remove debris and dead material'
      ],
      environmentalControls: [
        'Provide excellent air circulation',
        'Maintain lower humidity levels',
        'Ensure adequate spacing between plants',
        'Clean growing area regularly'
      ],
      quarantine: [
        'Inspect new plants with magnifying glass',
        'Check all crevices and hidden areas',
        'Quarantine for 6-8 weeks minimum'
      ]
    },
    treatment: {
      organic: [
        'Dab individual mealybugs with rubbing alcohol on cotton swab',
        'Spray with insecticidal soap solution',
        'Apply neem oil spray every 5-7 days',
        'Use strong water spray to dislodge insects',
        'Apply diatomaceous earth around plant base'
      ],
      chemical: [
        'Use systemic insecticide containing imidacloprid',
        'Apply contact insecticide spray',
        'Use horticultural oil for smothering',
        'Apply granular systemic insecticide to soil'
      ],
      biological: [
        'Release predatory beetles (Cryptolaemus)',
        'Use parasitic wasps for biological control',
        'Encourage beneficial insects in garden'
      ],
      immediate: [
        'Isolate infected plants immediately',
        'Remove visible mealybugs with alcohol swabs',
        'Rinse plant thoroughly with water',
        'Begin systematic treatment program'
      ],
      longTerm: [
        'Treat every 5-7 days for 4-6 weeks',
        'Continue monitoring for 3+ months',
        'Improve growing conditions',
        'Maintain regular inspection schedule'
      ]
    },
    prognosis: 'Good with consistent treatment. Requires vigilance due to rapid reproduction rates.'
  },
  {
    id: 'spider-mites',
    name: 'Spider Mites',
    type: 'pest',
    category: 'mite',
    severity: 'moderate',
    commonNames: ['Red Spider Mites', 'Two-Spotted Mites', 'Webbing Mites'],
    scientificName: 'Tetranychus urticae, Tetranychus cinnabarinus',
    description: 'Microscopic mites that feed on plant cells, causing stippling and webbing. Thrive in hot, dry conditions.',
    symptoms: [
      'Fine yellow or white stippling on plant surface',
      'Fine webbing on plant parts',
      'Bronze or reddish discoloration',
      'Tiny moving dots visible with magnification',
      'Premature dropping of affected parts'
    ],
    causes: [
      'Hot, dry environmental conditions',
      'Low humidity levels',
      'Poor air circulation',
      'Dust accumulation on plants',
      'Stressed or weakened plants'
    ],
    affectedPlants: ['Most succulents in dry conditions', 'Particularly: Sedum, Echeveria, Crassula'],
    identification: {
      visualSigns: [
        'Extremely fine webbing, especially in morning dew',
        'Stippled or speckled appearance on leaves',
        'Tiny red, yellow, or green moving dots',
        'Bronze or silvery discoloration'
      ],
      timing: 'Most active in hot, dry weather',
      progression: 'Very rapid reproduction - populations double every 3-5 days'
    },
    prevention: {
      culturalPractices: [
        'Maintain adequate humidity around plants',
        'Regularly rinse plants with water',
        'Remove dust and debris from plant surfaces',
        'Avoid water stress',
        'Quarantine new plants'
      ],
      environmentalControls: [
        'Increase humidity with pebble trays',
        'Improve air circulation',
        'Avoid excessively hot, dry conditions',
        'Provide morning humidity'
      ],
      quarantine: [
        'Inspect new plants with magnifying glass',
        'Look for fine webbing or stippling',
        'Monitor in isolation for 4+ weeks'
      ]
    },
    treatment: {
      organic: [
        'Spray with strong water to dislodge mites',
        'Apply insecticidal soap every 3-4 days',
        'Use neem oil spray regularly',
        'Increase humidity around affected plants',
        'Apply diatomaceous earth to growing medium'
      ],
      chemical: [
        'Use miticide specifically designed for spider mites',
        'Apply horticultural oil spray',
        'Rotate different classes of miticides',
        'Use systemic insecticides if severe'
      ],
      biological: [
        'Release predatory mites (Phytoseiulus persimilis)',
        'Use beneficial insects like ladybugs',
        'Encourage natural predators'
      ],
      immediate: [
        'Isolate affected plants',
        'Rinse thoroughly with water',
        'Increase humidity immediately',
        'Begin treatment regimen'
      ],
      longTerm: [
        'Treat every 3-4 days for 2-3 weeks',
        'Continue monitoring for months',
        'Maintain higher humidity levels',
        'Improve environmental conditions'
      ]
    },
    prognosis: 'Good if caught early. Requires consistent treatment due to rapid reproduction.'
  }
];

// Helper functions for filtering and searching
export const getDiseases = () => diseasesAndPests.filter(item => item.type === 'disease');
export const getPests = () => diseasesAndPests.filter(item => item.type === 'pest');
export const getBySeverity = (severity: string) => diseasesAndPests.filter(item => item.severity === severity);
export const getByCategory = (category: string) => diseasesAndPests.filter(item => item.category === category);
export const searchDiseasesAndPests = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return diseasesAndPests.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.commonNames.some(name => name.toLowerCase().includes(lowercaseQuery)) ||
    item.symptoms.some(symptom => symptom.toLowerCase().includes(lowercaseQuery)) ||
    item.description.toLowerCase().includes(lowercaseQuery)
  );
};