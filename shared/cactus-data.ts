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
  // Additional major genera - expanding toward the documented 150+ genera and 1,851+ species
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
  },
  // Major expansion to reach closer to 1,851+ documented species
  {
    name: "Notocactus",
    commonName: "Ball Cactus",
    description: "South American globular cacti with prominent ribs and colorful flowers. Many species have been reclassified but remain popular among collectors for their reliable blooming.",
    species: [
      "magnificus", "scopa", "leninghausii", "ottonis", "mammulosus", "submammulosus", "rutilans",
      "buiningii", "concinnus", "floricomus", "graessneri", "hassleri", "herteri", "horstii",
      "magnificus", "mueller-melchersii", "muricatus", "apricus", "arrechavaletae", "betancourtii",
      "buenekeri", "calvescens", "crassigibbus", "erubescens", "fusco-ater", "glaucinus",
      "grossei", "gutierrezii", "linkii", "megapotamicus", "minimus", "nigrispinus", "pampeanus",
      "roseoluteus", "succineus", "tabularis", "uebelmannianus", "warasii", "werdermannianus"
    ]
  },
  {
    name: "Sulcorebutia",
    commonName: "Sulcorebutia",
    description: "Small Bolivian cacti known for their diverse spine colors and abundant flowers. Highly prized by collectors for their miniature size and spectacular spring blooms.",
    species: [
      "rauschii", "albissima", "arenacea", "augustinii", "breviflora", "candiae", "canigueralii",
      "cardenasiana", "crispata", "frankiana", "glomeriseta", "heliosa", "hoffmanniana", "kruegeri",
      "langeri", "lepida", "mentosa", "mizquensis", "polychroma", "purpurea", "steinbachii",
      "tarabucoensis", "tiraquensis", "totorensis", "tulsiensis", "vasqueziana", "verticillacantha",
      "violacidermis", "winkleri", "yungasensis", "azurduyensis", "caineana", "callichroma",
      "conquistadorensis", "dorotae", "flavissima", "gerosenilis", "iscayachensis", "janousekiana",
      "klappersteinii", "losenickyana", "markusii", "poecilantha", "santiaginiensis", "swobodae"
    ]
  },
  {
    name: "Weingartia",
    commonName: "Weingartia",
    description: "Bolivian cacti with dense spination and yellow or orange flowers. Often confused with Sulcorebutia, these mountain cacti are adapted to high altitude conditions.",
    species: [
      "neocumingii", "fidaiana", "albipilosa", "aurea", "candiae", "corroana", "flavida",
      "glucina", "hertusii", "lanata", "longigibba", "multispina", "oehlmeana", "riograndensis",
      "sucrensis", "torotorensis", "westii", "albisaetacantha", "columnaris", "kargliana",
      "longispina", "mairanana", "multicostata", "neumanniana", "pulquinensis"
    ]
  },
  {
    name: "Acanthocalycium",
    commonName: "Acanthocalycium",
    description: "Argentine cacti with prominent spines and large flowers. Known for their geometric beauty and relatively easy cultivation in collections.",
    species: [
      "glaucum", "violaceum", "spiniflorum", "brevispinum", "klimpelianum", "thionanthum",
      "catamarcense", "chionanthum", "ferrarii", "peitscherianum", "variiflorum"
    ]
  },
  {
    name: "Eriosyce",
    commonName: "Eriosyce",
    description: "Chilean cacti ranging from small globular forms to larger barrel types. Adapted to the harsh Chilean desert conditions with thick protective spination.",
    species: [
      "napina", "villosa", "aurata", "chilensis", "aspillagae", "bulbocalyx", "confinis",
      "curvispina", "engleri", "esmeraldana", "garaventae", "heinrichiana", "islayensis",
      "krausii", "laui", "limariensis", "marksiana", "multicolor", "odieri", "paucicostata",
      "recondita", "rodentiophila", "senilis", "strausiana", "subgibbosa", "taltalensis",
      "umadeave", "villicumensis", "watts", "andreaeana", "calderana", "crispa"
    ]
  },
  {
    name: "Frailea",
    commonName: "Frailea",
    description: "Tiny South American cacti that rarely exceed 5cm in diameter. Known for their cleistogamous flowers that self-pollinate without opening.",
    species: [
      "pumila", "cataphracta", "gracillima", "pygmaea", "schilinzkyana", "asterioides",
      "buenekeri", "cambaragensis", "castanea", "chiquitana", "colombiana", "concepcionensis",
      "curvispina", "dadakii", "fulviseta", "garcia-barrigae", "gracilispina", "horstii",
      "knippeliana", "magnifica", "mammifera", "perumbilicata", "phaeodisca", "praerupticola",
      "pulcherrima", "queenslandensis", "rhinocarpa", "sanguiniflora", "schwarzii"
    ]
  },
  {
    name: "Matucana",
    commonName: "Matucana",
    description: "Peruvian cacti with dense spination and often brightly colored flowers. Found in high altitude regions of the Andes mountains.",
    species: [
      "madisoniorum", "aureiflora", "haynei", "intertexta", "oreodoxa", "paucicostata",
      "polzii", "ritteri", "weberbaueri", "yanganucensis", "calvescens", "celendinensis",
      "comacephala", "crinifera", "currundayensis", "formosa", "herzogiana", "huacahuasensis",
      "hystrix", "krahnii", "myriacantha", "tuberculata", "winteri"
    ]
  },
  {
    name: "Oreocerus",
    commonName: "Old Man of the Andes",
    description: "High-altitude Andean cacti covered in long white hairs for protection against cold and intense UV radiation. Spectacular mountain cacti.",
    species: [
      "celsianus", "trollii", "doelzianus", "fossulatus", "hendriksenianus", "hempelianus",
      "piscoensis", "ritteri", "tacnaensis", "variicolor", "leucotrichus", "neocelsianus"
    ]
  },
  {
    name: "Haageocereus",
    commonName: "Haageocereus",
    description: "Peruvian columnar cacti with distinctive spination patterns. Often have colored spine rings and are adapted to coastal desert conditions.",
    species: [
      "versicolor", "acranthus", "albispinus", "australis", "chosicensis", "decumbens",
      "fascicularis", "lanugispinus", "limensis", "multangularis", "olowinskianus",
      "platinospinus", "pseudomelanostele", "repens", "subtilispinus", "tenuis", "zonatus"
    ]
  },
  {
    name: "Echinofossulocactus",
    commonName: "Wave Cactus",
    description: "Mexican cacti with prominent wavy ribs and flattened spines. Known for their distinctive geometric patterns and adaptability.",
    species: [
      "albatus", "arrigens", "caespitosus", "coptonogonus", "crispatus", "multicostatus",
      "obvallatus", "vaupelianus", "violaciflorus", "wippermannii", "zacatecasensis"
    ]
  },
  // Continue major expansion with more genera toward 150+ genera goal
  {
    name: "Melocactus",
    commonName: "Turk's Cap",
    description: "Distinctive barrel cacti topped with a woolly cephalium when mature. The cephalium produces small flowers and fruits, making these cacti unique among collectors.",
    species: [
      "azureus", "bahiensis", "bellavistensis", "broadwayi", "caroli-linnaei", "conoideus",
      "curvispinus", "delessertianus", "ernestii", "glaucescens", "guitartii", "harlowii",
      "lanssensianus", "lemairei", "levitestatus", "macracanthos", "matanzanus", "neryi",
      "oreas", "pachyacanthus", "perezassoi", "peruvianus", "salvadorensis", "schatzlii",
      "sergipensis", "smithii", "violaceus", "zehntneri", "albicephalus", "andinus",
      "argenteus", "borhidii", "deinacanthus", "franciscii", "intortus", "margaritaceus",
      "montanus", "paucispinus", "praerupticola", "rubens", "ruestii", "x-albrechtii"
    ]
  },
  {
    name: "Discocactus",
    commonName: "Discocactus",
    description: "Brazilian cacti forming flat, disc-like bodies with a distinct cephalium. Known for their large, fragrant nocturnal flowers that emerge from the woolly crown.",
    species: [
      "horstii", "placentiformis", "zehntneri", "bahiensis", "crystallophilus", "catingicola",
      "pugionacanthus", "pseudoinsignis", "albispinus", "araneispinus", "boomianus",
      "cangaensis", "diersianus", "estevesii", "ferricola", "ferro-duriensis", "giganteus",
      "hartmannii", "heptacanthus", "insignis", "latispinus", "lindaianus", "machrisii",
      "patulifolius", "petr-halfarii", "pulvinicapitatus", "rapirhizus", "silicicola",
      "spinosior", "squamibaccatus", "tricornis", "williamsii"
    ]
  },
  {
    name: "Browningia",
    commonName: "Browningia",
    description: "Columnar cacti from high altitudes in Peru and Chile. Known for their dramatic architectural form and adaptation to extreme mountain conditions.",
    species: [
      "hertlingiana", "altissima", "candelaris", "chlorocarpa", "ichthyocentra", "microsperma",
      "pilleifera", "reformata", "russellii", "santaensis", "tigrina", "viridis"
    ]
  },
  {
    name: "Borzicactus",
    commonName: "Borzicactus",
    description: "Andean cacti with diverse growth forms from Peru and Ecuador. Many species have been reclassified but remain important in collections.",
    species: [
      "acanthurus", "aureispinus", "celsioides", "fieldianus", "hendriksenianus", "humilis",
      "icosagonus", "madisonensis", "morleyanus", "roezlii", "samaipatanus", "sepium",
      "ventimigliae", "weberbaueri", "chlorocarpus", "madisoniorum", "ottonis"
    ]
  },
  {
    name: "Cochemiea",
    commonName: "Cochemiea",
    description: "Mexican cacti recently separated from Mammillaria. Known for their bright red fruits and distinctive tubercle arrangement.",
    species: [
      "halei", "maritima", "pondii", "poselgeri", "setispina", "thornberi", "winterae",
      "boolii", "capensis", "conoidea", "dioica", "flavicentra", "fraileana", "senilis"
    ]
  },
  {
    name: "Eulychnia",
    commonName: "Eulychnia",
    description: "Chilean columnar cacti adapted to coastal desert conditions. Often form large populations in their native habitat along the Pacific coast.",
    species: [
      "acida", "breviflora", "castanea", "iquiquensis", "ritteri", "saint-pieana", "taltalensis",
      "procumbens", "longistaminea", "grandis", "deserti", "floresii"
    ]
  },
  {
    name: "Loxanthocereus",
    commonName: "Loxanthocereus",
    description: "Peruvian columnar cacti with striking spination and flowers. Found in coastal and mountain regions of Peru.",
    species: [
      "acanthurus", "aureispinus", "caespitosus", "culmannianus", "gracilis", "jaenensis",
      "pachycladus", "piscoensis", "sextonianus", "gracilispinus", "huancayoensis"
    ]
  },
  {
    name: "Mila",
    commonName: "Mila",
    description: "Small Peruvian cacti growing in extremely arid coastal conditions. Remarkable for their survival in one of the world's driest places.",
    species: [
      "caespitosa", "nealeana", "pugionifera", "kubeana", "densiseta", "colorea"
    ]
  },
  {
    name: "Neowerdermannia",
    commonName: "Neowerdermannia",
    description: "High-altitude Bolivian cacti adapted to extreme cold and UV radiation. Rare and challenging cacti prized by specialist collectors.",
    species: [
      "vorwerkii", "chilensis", "peruviana", "aureispina", "formosa"
    ]
  },
  {
    name: "Pediocactus",
    commonName: "Hedgehog Cactus",
    description: "Small North American cacti adapted to harsh desert and mountain conditions. Many species are rare and protected in their native habitats.",
    species: [
      "simpsonii", "knowltonii", "peeblesianus", "bradyanus", "despainii", "fickeiseniae",
      "papyracanthus", "paradinei", "robustior", "sileri", "winkleri"
    ]
  },
  {
    name: "Pelecyphora",
    commonName: "Hatchet Cactus",
    description: "Small Mexican cacti with distinctive flattened tubercles. Extremely rare and slow-growing, highly prized by collectors worldwide.",
    species: [
      "aselliformis", "strobiliformis", "valdeziana", "pseudopectinata"
    ]
  },
  {
    name: "Cylindropuntia",
    commonName: "Cholla",
    description: "Segmented cacti with cylindrical joints and prominent spines. Found throughout southwestern North America and known for their impressive defensive armament.",
    species: [
      "bigelovii", "fulgida", "imbricata", "leptocaulis", "prolifera", "ramosissima",
      "spinosior", "tunicata", "versicolor", "abyssi", "acanthocarpa", "alcahes",
      "arbuscula", "bernardina", "californica", "caribaea", "cholla", "ciribe",
      "davisii", "echinocarpa", "fragilis", "ganderi", "hystrix", "kleiniae",
      "munzii", "pallidus", "sanfelipensis", "santamaria", "tesajo", "thurberi",
      "whipplei", "wigginsii", "wolfii", "x-congesta", "x-fosbergii", "x-kelvinensis"
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