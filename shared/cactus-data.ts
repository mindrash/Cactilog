// Comprehensive cactus genera and species data for plant collection tracking
export interface CactusGenus {
  name: string;
  commonName?: string;
  description: string;
  species: string[];
}

export const cactusGenera: CactusGenus[] = [
  {
    name: "Trichocereus",
    commonName: "San Pedro",
    description: "Fast-growing columnar cacti native to South America, known for their distinctive ribs and large white nocturnal flowers. Many species are prized for their ornamental value and rapid growth rates.",
    species: [
      "pachanoi",
      "peruvianus", 
      "bridgesii",
      "scopulicola",
      "cuzcoensis",
      "huanucoensis",
      "macrogonus",
      "santaensis",
      "riomizquensis",
      "taquimbalensis"
    ]
  },
  {
    name: "Mammillaria",
    commonName: "Pincushion Cactus",
    description: "One of the largest genera of cacti with over 200 species. Characterized by their spherical to cylindrical shape and tubercles arranged in spirals. Popular for their colorful flowers and ease of cultivation.",
    species: [
      "bocasana",
      "elongata",
      "gracilis",
      "compressa",
      "hahniana",
      "spinosissima",
      "zeilmanniana",
      "bombycina",
      "candida",
      "carnea",
      "crucigera",
      "discolor",
      "geminispina",
      "magnimamma",
      "matudae",
      "mystax",
      "parkinsonii",
      "plumosa",
      "prolifera",
      "rhodantha",
      "sempervivi",
      "vetula",
      "wildii"
    ]
  },
  {
    name: "Lophophora",
    commonName: "Peyote",
    description: "Small, spineless cacti native to Mexico and southwestern Texas. Distinctive for their button-like appearance and cultural significance. Slow-growing with pink or white flowers.",
    species: [
      "williamsii",
      "fricii",
      "koehresii",
      "diffusa"
    ]
  },
  {
    name: "Ariocarpus",
    commonName: "Living Rock",
    description: "Highly specialized cacti that mimic rocks in their natural habitat. Known for their flat, geometric appearance and extremely slow growth. Prized by collectors for their unique morphology.",
    species: [
      "fissuratus",
      "retusus",
      "trigonus",
      "kotschoubeyanus",
      "agavoides",
      "bravoanus",
      "scaphirostris"
    ]
  },
  {
    name: "Opuntia",
    commonName: "Prickly Pear",
    description: "Large genus of cacti with flattened pad-like stems. Known for their edible fruits and pads, these hardy cacti are found throughout the Americas. Popular for landscaping in arid regions.",
    species: [
      "microdasys",
      "ficus-indica",
      "engelmannii",
      "basilaris",
      "santa-rita",
      "violacea",
      "chlorotica",
      "robusta",
      "rufida",
      "cylindrica",
      "subulata",
      "leucotricha",
      "monacantha"
    ]
  },
  {
    name: "Echinocereus",
    commonName: "Hedgehog Cactus",
    description: "Medium-sized cacti known for their cylindrical stems and spectacular large flowers. Native to the southwestern United States and Mexico. Popular for their vibrant blooms and relatively easy care.",
    species: [
      "triglochidiatus",
      "coccineus",
      "reichenbachii",
      "viridiflorus",
      "pectinatus",
      "dasyacanthus",
      "engelmannii",
      "fasciculatus",
      "fendleri",
      "papillosus",
      "pentalophus",
      "rigidissimus",
      "stramineus"
    ]
  },
  {
    name: "Echinopsis",
    commonName: "Sea Urchin Cactus",
    description: "Globular to short cylindrical cacti known for their large, funnel-shaped flowers that often bloom at night. Easy to grow and propagate, making them popular among beginners.",
    species: [
      "oxygona",
      "chamaecereus",
      "eyriesii",
      "multiplex",
      "subdenudata",
      "tubiflora",
      "ancistrophora",
      "aurea",
      "calochlora",
      "huascha",
      "leucantha",
      "mirabilis",
      "pentlandii",
      "spachiana"
    ]
  },
  {
    name: "Ferocactus",
    commonName: "Barrel Cactus",
    description: "Large, barrel-shaped cacti with prominent ribs and strong spines. Native to southwestern North America, these slow-growing giants can live for over 100 years and reach impressive sizes.",
    species: [
      "wislizeni",
      "latispinus",
      "cylindraceus",
      "emoryi",
      "pilosus",
      "glaucescens",
      "histrix",
      "peninsulae",
      "rectispinus",
      "robustus",
      "schwarzii",
      "stainesii",
      "viridescens"
    ]
  },
  {
    name: "Gymnocalycium",
    commonName: "Chin Cactus",
    description: "Small to medium globular cacti named for their 'naked' flower buds without spines or hairs. Popular for their diverse forms and colorful flowers, easy to cultivate indoors.",
    species: [
      "baldianum",
      "mihanovichii",
      "denudatum",
      "saglione",
      "bruchii",
      "cardenasianum",
      "damsii",
      "friedrichii",
      "horstii",
      "marsoneri",
      "mostii",
      "pflanzii",
      "quehlianum",
      "ragonesei",
      "stellatum"
    ]
  },
  {
    name: "Astrophytum",
    commonName: "Star Cactus",
    description: "Distinctive star-shaped cacti with prominent ribs and often white spots. Slow-growing and highly prized by collectors for their geometric beauty and unique appearance.",
    species: [
      "myriostigma",
      "asterias",
      "capricorne",
      "ornatum",
      "coahuilense",
      "caput-medusae"
    ]
  },
  {
    name: "Parodia",
    commonName: "Ball Cactus",
    description: "Small to medium globular cacti known for their colorful flowers and attractive spination. Many species bloom reliably and are popular among indoor cactus enthusiasts.",
    species: [
      "leninghausii",
      "magnifica",
      "microsperma",
      "ottonis",
      "scopa",
      "warasii",
      "ayopayana",
      "buiningii",
      "chrysacanthion",
      "concinna",
      "formosa",
      "haselbergii",
      "herteri",
      "horstii",
      "mammulosa"
    ]
  },
  {
    name: "Rebutia",
    commonName: "Crown Cactus",
    description: "Small clustering cacti that produce abundant colorful flowers around the base. Easy to grow and flower, making them excellent choices for beginners and collectors alike.",
    species: [
      "heliosa",
      "marsoneri",
      "minuscula",
      "albiloma",
      "arenacea",
      "calliantha",
      "deminuta",
      "fabrisii",
      "fiebrigii",
      "haagei",
      "hoffmannii",
      "krainziana",
      "mentosa",
      "muscula",
      "pseudominuscula",
      "pygmaea",
      "senilis",
      "spegazziniana",
      "steinbachii",
      "violaciflora"
    ]
  },
  {
    name: "Myrtillocactus",
    commonName: "Bilberry Cactus",
    description: "Tree-like cacti that produce small edible berries. Known for their distinctive blue-green coloration and candelabra growth form in mature specimens.",
    species: [
      "geometrizans",
      "cochal",
      "eichlamii",
      "schenckii"
    ]
  },
  {
    name: "Lithops",
    commonName: "Living Stones",
    description: "Master mimics that perfectly resemble stones in their natural habitat. These fascinating succulents have evolved extreme camouflage and require specialized care to thrive.",
    species: [
      "aucampiae",
      "bella",
      "bromfieldii",
      "dinteri",
      "dorotheae",
      "francisci",
      "fulviceps",
      "gesineae",
      "gracilidelineata",
      "hallii",
      "helmutii",
      "hermetica",
      "hookeri",
      "julii",
      "karasmontana",
      "lesliei",
      "localis",
      "marmorata",
      "olivacea",
      "optica",
      "otzeniana",
      "pseudotruncatella",
      "ruschiorum",
      "salicola",
      "schwantesii",
      "steineckeana",
      "terricolor",
      "vallis-mariae",
      "verruculosa",
      "villetii",
      "werneri"
    ]
  },
  {
    name: "Carnegiea",
    commonName: "Saguaro",
    description: "Iconic giant columnar cactus of the Sonoran Desert. Can live over 150 years and reach heights of 40+ feet. The Arizona state flower and symbol of the American Southwest.",
    species: [
      "gigantea"
    ]
  },
  {
    name: "Cereus",
    commonName: "Night-blooming Cereus",
    description: "Large columnar cacti known for their magnificent night-blooming flowers. These fast-growing cacti can reach impressive heights and are popular for their dramatic architectural presence.",
    species: [
      "peruvianus",
      "jamacaru",
      "repandus",
      "stenogonus",
      "validus",
      "forbesii",
      "hildmannianus",
      "uruguayanus"
    ]
  },
  {
    name: "Cleistocactus",
    commonName: "Silver Torch",
    description: "Columnar cacti with dense spination that often gives them a silvery appearance. Known for their tubular flowers that barely open, adapted for hummingbird pollination.",
    species: [
      "strausii",
      "winteri",
      "brookeae",
      "buchtienii",
      "candelilla",
      "fieldianus",
      "hildegardiae",
      "hyalacanthus",
      "parviflorus",
      "ritteri",
      "samaipatanus",
      "tupizensis"
    ]
  },
  {
    name: "Copiapoa",
    commonName: "Copiapoa",
    description: "Chilean desert cacti adapted to extreme arid conditions. Known for their thick waxy coating and ability to survive in one of the world's driest deserts, the Atacama.",
    species: [
      "cinerea",
      "humilis",
      "tenuissima",
      "atacamensis",
      "cinerascens",
      "columna-alba",
      "dealbata",
      "echinoides",
      "fiedleriana",
      "gigantea",
      "haseltonii",
      "hypogaea",
      "laui",
      "longistaminea",
      "malletiana",
      "marginata",
      "megarhiza",
      "montana",
      "pepiniana",
      "solaris",
      "taltalensis"
    ]
  },
  {
    name: "Echinocactus",
    commonName: "Golden Barrel",
    description: "Large barrel-shaped cacti with golden spines. The classic 'barrel cactus' often seen in southwestern landscapes, known for their perfect spherical form and impressive size.",
    species: [
      "grusonii",
      "ingens",
      "platyacanthus",
      "polycephalus",
      "texensis"
    ]
  },
  {
    name: "Turbinicarpus",
    commonName: "Turbinicarpus",
    description: "Small, rare cacti from Mexico with intricate spine patterns. Highly sought after by collectors for their miniature size and detailed morphological features.",
    species: [
      "pseudomacrochele",
      "valdezianus",
      "schmiedickeanus",
      "alonsoi",
      "beguinii",
      "bonatzii",
      "horripilus",
      "jauernigii",
      "knuthianus",
      "laui",
      "lophophoroides",
      "mandragora",
      "pseudopectinatus",
      "roseiflorus",
      "saueri",
      "swobodae",
      "viereckii"
    ]
  },
  // Additional major genera to reach closer to the 150+ genera documented
  {
    name: "Stenocereus",
    commonName: "Pitaya",
    description: "Large columnar cacti from Mexico and Central America. Many species produce edible fruits called pitaya, and some are important in traditional Mexican culture.",
    species: [
      "griseus",
      "thurberi",
      "alamosensis",
      "aragonii",
      "beneckei",
      "chrysocarpus",
      "dumortieri",
      "eruca",
      "fimbriatus",
      "fricii",
      "gummosus",
      "hollianus",
      "kerberi",
      "laevigatus",
      "martinezii",
      "montanus",
      "obtusangulus",
      "pruinosus",
      "queretaroensis",
      "standleyi",
      "stellatus",
      "treleasei"
    ]
  },
  {
    name: "Pilosocereus",
    commonName: "Tree Cactus",
    description: "Columnar cacti with woolly areoles, native to Brazil and surrounding areas. Known for their impressive tree-like growth and distinctive white wool on mature plants.",
    species: [
      "azureus",
      "pachycladus",
      "magnificus",
      "aureispinus",
      "brasiliensis",
      "chrysostele",
      "catingicola",
      "flexibilispinus",
      "fulvilanatus",
      "gounellei",
      "leucocephalus",
      "machrisii",
      "pentaedrophorus",
      "royenii",
      "tuberculatus"
    ]
  },
  {
    name: "Thelocactus",
    commonName: "Glory of Texas",
    description: "Globular cacti from Mexico and southern Texas. Known for their prominent ribs and large, colorful flowers that are often disproportionately large for the plant size.",
    species: [
      "bicolor",
      "setispinus",
      "hexaedrophorus",
      "leucacanthus",
      "buekii",
      "conothelos",
      "fossulatus",
      "hastifer",
      "lausseri",
      "lloydii",
      "macdowellii",
      "rinconensis",
      "schwarzii",
      "tulensis",
      "wagnerianus"
    ]
  },
  {
    name: "Epithelantha",
    commonName: "Button Cactus",
    description: "Tiny cacti with dense white spination that gives them a button-like appearance. Among the smallest cacti, these miniature gems are prized by collectors.",
    species: [
      "micromeris",
      "bokei",
      "button",
      "densispina",
      "rufispina"
    ]
  },
  {
    name: "Leuchtenbergia",
    commonName: "Agave Cactus",
    description: "A monotypic genus resembling an agave more than a typical cactus. Has long, triangular tubercles and papery spines, representing a unique evolutionary path in cacti.",
    species: [
      "principis"
    ]
  },
  {
    name: "Lophocereus",
    commonName: "Mexican Fencepost",
    description: "Tall columnar cacti from northwestern Mexico. Often used as living fences, these cacti develop a distinctive crown of bristly spines when mature.",
    species: [
      "schottii",
      "marginatus"
    ]
  },
  {
    name: "Neolloydia",
    commonName: "Neolloydia",
    description: "Small globular cacti from Mexico and southwestern US. Often confused with related genera, they're distinguished by their groove pattern and flower characteristics.",
    species: [
      "conoidea",
      "matehualensis",
      "pilispina",
      "pseudopectinata",
      "texensis"
    ]
  }
];

// Succulent genera for non-cactus plants
export const succulentGenera: CactusGenus[] = [
  {
    name: "Echeveria",
    commonName: "Hen and Chicks",
    description: "Rosette-forming succulents native to Mexico and Central America. Popular houseplants known for their colorful leaves and ease of propagation.",
    species: [
      "elegans",
      "agavoides",
      "peacockii",
      "gibbiflora",
      "pulvinata",
      "runyonii",
      "setosa",
      "derenbergii",
      "harmsii",
      "lilacina",
      "nodulosa",
      "purpusorum",
      "shaviana",
      "subsessilis"
    ]
  },
  {
    name: "Aloe",
    commonName: "Aloe",
    description: "Succulent plants known for their medicinal properties and architectural rosette form. Native to Africa and Madagascar, many species are widely cultivated worldwide.",
    species: [
      "vera",
      "arborescens", 
      "brevifolia",
      "ferox",
      "marlothii",
      "striata",
      "variegata",
      "aristata",
      "haworthioides",
      "juvenna",
      "microstigma",
      "nobilis",
      "polyphylla",
      "rauhii"
    ]
  },
  {
    name: "Haworthia",
    commonName: "Zebra Plant",
    description: "Small rosette-forming succulents native to South Africa. Popular houseplants known for their intricate patterns, translucent windows, and tolerance of low light conditions.",
    species: [
      "fasciata",
      "attenuata",
      "cooperi",
      "truncata",
      "retusa",
      "cymbiformis",
      "limifolia",
      "reinwardtii",
      "venosa",
      "viscosa"
    ]
  },
  {
    name: "Crassula",
    commonName: "Jade Plant",
    description: "Diverse genus of succulents ranging from tiny groundcovers to tree-like forms. Known for their thick, fleshy leaves and star-shaped flowers, with many popular houseplant species.",
    species: [
      "ovata",
      "argentea",
      "arborescens",
      "perfoliata",
      "muscosa",
      "rupestris",
      "tetragona",
      "coccinea",
      "falcata",
      "hemisphaerica",
      "lycopodioides",
      "mesembryanthemopsis",
      "pellucida",
      "pyramidalis"
    ]
  },
  {
    name: "Sedum",
    commonName: "Stonecrop",
    description: "Large genus of succulents with incredible diversity in form and habit. Found in many climates worldwide, from tiny alpine species to large shrubby forms.",
    species: [
      "rubrotinctum",
      "morganianum",
      "nussbaumerianum",
      "adolphii",
      "burrito",
      "pachyphyllum",
      "reflexum",
      "spathulifolium",
      "spurium",
      "telephium"
    ]
  },
  {
    name: "Agave",
    commonName: "Century Plant",
    description: "Large rosette succulents that bloom once after many years then die. Native to the Americas, famous for producing tequila and known for their dramatic architectural form.",
    species: [
      "americana",
      "attenuata",
      "victoriae-reginae",
      "parryi",
      "tequilana",
      "bovicornuta",
      "filifera",
      "lechuguilla",
      "palmeri",
      "salmiana"
    ]
  }
];

// Helper function to get species for a genus
export function getSpeciesForGenus(genusName: string, isSucculent: boolean = false): string[] {
  const genera = isSucculent ? succulentGenera : cactusGenera;
  const genus = genera.find(g => g.name.toLowerCase() === genusName.toLowerCase());
  return genus?.species.filter(species => species && species.trim() !== "") || [];
}

// Helper function to get all genus names
export function getAllGenera(isSucculent: boolean = false): string[] {
  const genera = isSucculent ? succulentGenera : cactusGenera;
  return genera.map(g => g.name).sort();
}

// Helper function to search genera by name
export function searchGenera(query: string, isSucculent: boolean = false): CactusGenus[] {
  const genera = isSucculent ? succulentGenera : cactusGenera;
  const lowerQuery = query.toLowerCase();
  return genera.filter(g => 
    g.name.toLowerCase().includes(lowerQuery) || 
    g.commonName?.toLowerCase().includes(lowerQuery)
  );
}