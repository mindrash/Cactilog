// Comprehensive cactus genera and species data for plant collection tracking
export interface CactusGenus {
  name: string;
  commonName?: string;
  species: string[];
}

export const cactusGenera: CactusGenus[] = [
  {
    name: "Trichocereus",
    commonName: "San Pedro",
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
  return genus?.species || [];
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