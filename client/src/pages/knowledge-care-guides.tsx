import { useState, useEffect } from "react";
import { useAuthOptional } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  Search, 
  Droplet, 
  Sun, 
  Thermometer, 
  Scissors, 
  Bug, 
  AlertTriangle,
  BookOpen,
  ArrowLeft,
  Info
} from "lucide-react";
import Header from "@/components/header";
import { SEO, seoConfigs } from "@/components/seo";
import AmazonAffiliateProducts from "@/components/amazon-affiliate-products";
import { isUnauthorizedError } from "@/lib/authUtils";
import { getFeaturedProducts } from "@shared/amazon-products";
import { cactusGenera, type CactusSpecies } from "@shared/cactus-data";

// Care guide data structure
interface CareGuide {
  genus: string;
  species?: string;
  lighting: {
    intensity: string;
    duration: string;
    seasonalNotes?: string;
  };
  watering: {
    frequency: string;
    method: string;
    seasonalNotes?: string;
  };
  temperature: {
    optimal: string;
    minimum: string;
    maximum: string;
    winterDormancy?: string;
  };
  soil: {
    type: string;
    drainage: string;
    ph: string;
  };
  fertilizing: {
    schedule: string;
    type: string;
    dilution?: string;
  };
  propagation: {
    methods: string[];
    bestTime: string;
    notes?: string;
  };
  commonIssues: {
    problem: string;
    solution: string;
  }[];
  specificNotes?: string[];
}

// Species-specific care guides
const speciesCareGuides: CareGuide[] = [
  {
    genus: "Trichocereus",
    species: "pachanoi",
    lighting: {
      intensity: "Bright, indirect sunlight to partial shade",
      duration: "6-8 hours daily",
      seasonalNotes: "Can tolerate full sun in cooler climates, provide afternoon shade in hot regions"
    },
    watering: {
      frequency: "Water deeply when soil is completely dry, typically every 7-14 days in summer",
      method: "Soak and drain method - water until it runs from drainage holes",
      seasonalNotes: "Reduce to monthly or less in winter dormancy period"
    },
    temperature: {
      optimal: "65-85°F (18-29°C)",
      minimum: "45°F (7°C) for short periods",
      maximum: "95°F (35°C) with adequate airflow",
      winterDormancy: "50-60°F (10-15°C) promotes healthy dormancy"
    },
    soil: {
      type: "Well-draining cactus mix with added perlite and pumice",
      drainage: "Excellent drainage essential - 30-50% inorganic matter",
      ph: "Slightly acidic to neutral (6.0-7.0)"
    },
    fertilizing: {
      schedule: "Monthly during growing season (spring-early fall)",
      type: "Low-nitrogen cactus fertilizer or balanced 10-10-10",
      dilution: "Dilute to 1/4 strength of recommended concentration"
    },
    propagation: {
      methods: ["Stem cuttings", "Offsets", "Seeds"],
      bestTime: "Late spring to early summer",
      notes: "Allow cut surfaces to callus for 1-2 weeks before planting"
    },
    commonIssues: [
      { problem: "Soft, yellowing base", solution: "Root rot - reduce watering, improve drainage, repot if necessary" },
      { problem: "Slow growth", solution: "Increase light exposure, check for adequate nutrition" },
      { problem: "Etiolation (stretching)", solution: "Provide more direct sunlight gradually" }
    ],
    specificNotes: [
      "Extremely fast-growing compared to most cacti",
      "Can reach 6-20 feet in optimal conditions",
      "Native to high-altitude regions, appreciates temperature fluctuations",
      "Sacred plant in Andean cultures - grow with respect"
    ]
  },
  {
    genus: "Trichocereus",
    species: "peruvianus",
    lighting: {
      intensity: "Full sun to bright indirect light",
      duration: "8-10 hours daily",
      seasonalNotes: "More sun-tolerant than T. pachanoi, appreciates strong morning light"
    },
    watering: {
      frequency: "Water when soil is dry, every 10-21 days in growing season",
      method: "Deep watering with excellent drainage",
      seasonalNotes: "Nearly dry in winter, water only if showing signs of dehydration"
    },
    temperature: {
      optimal: "70-90°F (21-32°C)",
      minimum: "40°F (4°C) for brief periods",
      maximum: "100°F (38°C) with good airflow",
      winterDormancy: "45-55°F (7-13°C) ideal for winter rest"
    },
    soil: {
      type: "Fast-draining mineral-rich mix",
      drainage: "60-70% inorganic matter (pumice, perlite, coarse sand)",
      ph: "Neutral to slightly alkaline (6.5-7.5)"
    },
    fertilizing: {
      schedule: "Every 6-8 weeks during active growth",
      type: "Low-nitrogen, high-phosphorus fertilizer",
      dilution: "Quarter strength liquid fertilizer"
    },
    propagation: {
      methods: ["Stem cuttings", "Offsets from base"],
      bestTime: "Late spring when night temperatures stay above 60°F",
      notes: "Callusing period of 2-3 weeks recommended for large cuttings"
    },
    commonIssues: [
      { problem: "Brown/black spots", solution: "Fungal infection - improve air circulation, reduce humidity" },
      { problem: "Pale coloration", solution: "Insufficient light - gradually increase sun exposure" },
      { problem: "Base becoming soft", solution: "Overwatering - allow soil to dry completely between waterings" }
    ],
    specificNotes: [
      "More cold-hardy than many Trichocereus species",
      "Distinctive blue-green coloration in high light",
      "Can develop impressive spination with age",
      "Native to Peru's coastal and mountain regions"
    ]
  },
  {
    genus: "Mammillaria",
    species: "hahniana",
    lighting: {
      intensity: "Bright, filtered sunlight",
      duration: "4-6 hours direct morning sun",
      seasonalNotes: "Protect from intense afternoon sun, especially in summer"
    },
    watering: {
      frequency: "Water when soil surface is dry, every 14-21 days in summer",
      method: "Water around the base, avoid getting water on the body",
      seasonalNotes: "Minimal water in winter - only if plant shows severe shrinkage"
    },
    temperature: {
      optimal: "65-80°F (18-27°C)",
      minimum: "50°F (10°C)",
      maximum: "85°F (29°C)",
      winterDormancy: "50-60°F (10-15°C) for flower induction"
    },
    soil: {
      type: "Well-draining cactus soil with extra pumice",
      drainage: "50% organic, 50% inorganic mix",
      ph: "Slightly acidic to neutral (6.0-7.0)"
    },
    fertilizing: {
      schedule: "Every 3-4 weeks during growing season",
      type: "Diluted cactus fertilizer with low nitrogen",
      dilution: "1/4 to 1/2 strength"
    },
    propagation: {
      methods: ["Offsets", "Seeds"],
      bestTime: "Spring when offsets are well-developed",
      notes: "Remove offsets when they're at least 1/3 the size of the parent"
    },
    commonIssues: [
      { problem: "Loss of white hairs", solution: "Normal aging process, increase humidity slightly" },
      { problem: "No flowering", solution: "Ensure cool winter dormancy period (50-60°F)" },
      { problem: "Shriveling", solution: "Gradually increase watering frequency" }
    ],
    specificNotes: [
      "Known as 'Old Lady Cactus' for dense white hair covering",
      "Produces beautiful ring of pink/red flowers in spring",
      "Hair provides natural sun protection",
      "Native to central Mexico"
    ]
  }
];

// General care guide for cacti without specific guides
const generalCactusGuide: CareGuide = {
  genus: "General",
  lighting: {
    intensity: "Bright, indirect sunlight to partial direct sun",
    duration: "6-8 hours of light daily",
    seasonalNotes: "Gradually acclimate to direct sun, provide afternoon shade in extremely hot climates"
  },
  watering: {
    frequency: "Water deeply when soil is completely dry - typically every 1-3 weeks",
    method: "Soak and drain method - water until it flows from drainage holes",
    seasonalNotes: "Reduce watering frequency by 50-75% in winter dormancy"
  },
  temperature: {
    optimal: "65-85°F (18-29°C) during growing season",
    minimum: "50°F (10°C) for most species",
    maximum: "95°F (35°C) with adequate ventilation",
    winterDormancy: "50-65°F (10-18°C) promotes healthy dormancy and flowering"
  },
  soil: {
    type: "Well-draining cactus and succulent potting mix",
    drainage: "Excellent drainage critical - add 30-50% perlite, pumice, or coarse sand",
    ph: "Slightly acidic to neutral (6.0-7.0)"
  },
  fertilizing: {
    schedule: "Monthly during growing season (spring through early fall)",
    type: "Low-nitrogen cactus fertilizer or balanced fertilizer",
    dilution: "Dilute to 1/4 to 1/2 strength"
  },
  propagation: {
    methods: ["Seeds", "Offsets", "Stem cuttings (for applicable species)"],
    bestTime: "Late spring to early summer when temperatures are consistently warm",
    notes: "Allow cut surfaces to callus for several days to weeks before planting"
  },
  commonIssues: [
    { problem: "Yellowing or soft base", solution: "Root rot from overwatering - reduce watering, improve drainage" },
    { problem: "Etiolation (stretching)", solution: "Insufficient light - gradually increase light exposure" },
    { problem: "Shriveling despite watering", solution: "Root damage or extremely dry air - check roots, increase humidity slightly" },
    { problem: "Brown/black spots", solution: "Fungal issues - improve air circulation, avoid overhead watering" },
    { problem: "Slow or no growth", solution: "Check lighting, nutrition, and ensure plant isn't root-bound" }
  ],
  specificNotes: [
    "Most cacti require a winter dormancy period with cooler temperatures and reduced watering",
    "Overwatering is the #1 cause of cactus death - when in doubt, don't water",
    "Clay pots provide better drainage than plastic but dry out faster",
    "Many cacti need cool winter temperatures (50-60°F) to initiate flowering"
  ]
};

export default function KnowledgeCareGuides() {
  const { isAuthenticated } = useAuthOptional();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenus, setSelectedGenus] = useState("all");
  const [selectedSpecies, setSelectedSpecies] = useState("all");

  // Public page - no auth required

  // Get all available species for filtering
  const allSpecies = cactusGenera.flatMap(genus => 
    genus.species.map(species => ({
      genus: genus.name,
      species: typeof species === 'string' ? species : species.name
    }))
  );

  // Filter available care guides
  const filteredGuides = speciesCareGuides.filter(guide => {
    const matchesSearch = 
      guide.genus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guide.species && guide.species.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenus = selectedGenus === "all" || guide.genus === selectedGenus;
    const matchesSpecies = selectedSpecies === "all" || guide.species === selectedSpecies;
    
    return matchesSearch && matchesGenus && matchesSpecies;
  });

  const careProducts = getFeaturedProducts('care');

  // Get unique genera for filtering
  const availableGenera = Array.from(new Set(speciesCareGuides.map(g => g.genus)));

  const CareGuideCard = ({ guide, isGeneral = false }: { guide: CareGuide; isGeneral?: boolean }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-cactus-green" />
            <span className="italic text-cactus-green">
              {guide.genus} {guide.species && guide.species}
            </span>
          </div>
          {isGeneral && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <Info className="w-3 h-3 mr-1" />
              General Care
            </Badge>
          )}
        </CardTitle>
        {isGeneral && (
          <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            This is general cactus care information. Species-specific guides provide more targeted advice when available.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                    Lighting
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-2">{guide.lighting.intensity}</p>
                  <p className="text-xs text-gray-600">Duration: {guide.lighting.duration}</p>
                  {guide.lighting.seasonalNotes && (
                    <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">
                      {guide.lighting.seasonalNotes}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Droplet className="w-4 h-4 mr-2 text-blue-500" />
                    Watering
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-700 mb-2">{guide.watering.frequency}</p>
                  <p className="text-xs text-gray-600 mb-2">Method: {guide.watering.method}</p>
                  {guide.watering.seasonalNotes && (
                    <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      {guide.watering.seasonalNotes}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Thermometer className="w-4 h-4 mr-2 text-red-500" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Optimal:</span> {guide.temperature.optimal}</p>
                    <p><span className="font-medium">Min:</span> {guide.temperature.minimum}</p>
                    <p><span className="font-medium">Max:</span> {guide.temperature.maximum}</p>
                    {guide.temperature.winterDormancy && (
                      <p className="text-xs text-purple-600 bg-purple-50 p-2 rounded mt-2">
                        <span className="font-medium">Winter:</span> {guide.temperature.winterDormancy}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Leaf className="w-4 h-4 mr-2 text-green-500" />
                    Soil & Fertilizing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Soil:</span> {guide.soil.type}</p>
                    <p><span className="font-medium">pH:</span> {guide.soil.ph}</p>
                    <p><span className="font-medium">Fertilizer:</span> {guide.fertilizing.type}</p>
                    <p className="text-xs text-gray-600">{guide.fertilizing.schedule}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Scissors className="w-4 h-4 mr-2 text-purple-500" />
                    Propagation
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {guide.propagation.methods.map((method, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm"><span className="font-medium">Best time:</span> {guide.propagation.bestTime}</p>
                    {guide.propagation.notes && (
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {guide.propagation.notes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Detailed Soil Requirements</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Mix:</span> {guide.soil.type}</p>
                    <p><span className="font-medium">Drainage:</span> {guide.soil.drainage}</p>
                    <p><span className="font-medium">pH Range:</span> {guide.soil.ph}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {guide.fertilizing.dilution && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Fertilizer Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm"><span className="font-medium">Dilution:</span> {guide.fertilizing.dilution}</p>
                  <p className="text-sm"><span className="font-medium">Schedule:</span> {guide.fertilizing.schedule}</p>
                  <p className="text-sm"><span className="font-medium">Type:</span> {guide.fertilizing.type}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Bug className="w-4 h-4 mr-2 text-red-500" />
                  Common Issues & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {guide.commonIssues.map((issue, idx) => (
                    <div key={idx} className="border-l-4 border-red-200 pl-4">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        Problem: {issue.problem}
                      </p>
                      <p className="text-sm text-gray-700">
                        Solution: {issue.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {guide.specificNotes && guide.specificNotes.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    Species-Specific Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {guide.specificNotes.map((note, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-cactus-green rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO {...seoConfigs.careGuides} />
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/knowledge">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Knowledge Base
              </Button>
            </Link>
          </div>
          <h1 className="page-title-xl mb-2 flex items-center">
            <Leaf className="w-8 h-8 mr-3 text-cactus-green" />
            Cactus & Succulent Care Guides
          </h1>
          <p className="text-gray-600">
            Detailed cultivation guides for specific species, with general care information when species-specific data isn't available.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search genus or species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedGenus} onValueChange={setSelectedGenus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by genus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genera</SelectItem>
                  {availableGenera.map(genus => (
                    <SelectItem key={genus} value={genus}>{genus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-cactus-green mb-1">
                {speciesCareGuides.length}
              </div>
              <div className="text-sm text-gray-600">Species-Specific Guides</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-forest mb-1">
                {availableGenera.length}
              </div>
              <div className="text-sm text-gray-600">Genera Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-desert-sage mb-1">
                1
              </div>
              <div className="text-sm text-gray-600">General Guide Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Care Guides */}
        <div className="space-y-6">
          {filteredGuides.length > 0 ? (
            <>
              <h2 className="section-title mb-4">Species-Specific Care Guides</h2>
              {filteredGuides.map((guide, idx) => (
                <CareGuideCard key={idx} guide={guide} />
              ))}
            </>
          ) : searchTerm ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="subsection-title mb-2">
                  No species-specific guides found for "{searchTerm}"
                </h3>
                <p className="text-gray-600 mb-4">
                  Use the general cactus care guide below, or try searching for a different species.
                </p>
              </CardContent>
            </Card>
          ) : null}

          {/* General Care Guide */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="section-title mb-4">General Cactus Care Guide</h2>
            <CareGuideCard guide={generalCactusGuide} isGeneral={true} />
          </div>

          {/* Amazon Affiliate Products Section */}
          <div className="border-t border-gray-200 pt-8">
            <AmazonAffiliateProducts 
              products={careProducts}
              title="Essential Care & Growing Supplies"
              context="Professional Tools"
            />
          </div>
        </div>
      </div>
    </div>
  );
}