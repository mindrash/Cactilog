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
  }
];

// Succulent genera for non-cactus plants
export const succulentGenera: CactusGenus[] = [
  {
    name: "Echeveria",
    commonName: "Hen and Chicks",
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