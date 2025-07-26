import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, AlertTriangle, Bug, Activity, ShieldAlert, Microscope, Heart, Users, Calendar, ArrowRight, ExternalLink } from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import { SEO } from "../components/seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import AmazonAffiliateProducts from "../components/amazon-affiliate-products";

import { diseasesAndPests, getDiseases, getPests, type DiseasePest } from "../../../shared/diseases-pests-data";

const seoConfigs = {
  diseasesAndPests: {
    title: "Cactus & Succulent Diseases and Pests Guide - Identification & Treatment | Cactilog",
    description: "Comprehensive guide to identifying and treating common diseases and pests affecting cacti and succulents. Expert advice on prevention, organic treatments, and emergency care protocols.",
    keywords: "cactus diseases, succulent pests, plant disease identification, mealybugs treatment, scale insects, root rot prevention, black rot treatment, spider mites, fungal diseases, bacterial infections, organic pest control, plant health, botanical medicine",
    canonical: "/knowledge/diseases-pests"
  }
};

export default function KnowledgeDiseasesAndPests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter and search diseases/pests
  const filteredItems = useMemo(() => {
    let filtered = diseasesAndPests;

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by severity
    if (selectedSeverity !== "all") {
      filtered = filtered.filter(item => item.severity === selectedSeverity);
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.commonNames.some(name => name.toLowerCase().includes(search)) ||
        item.symptoms.some(symptom => symptom.toLowerCase().includes(search)) ||
        item.description.toLowerCase().includes(search) ||
        item.affectedPlants.some(plant => plant.toLowerCase().includes(search))
      );
    }

    return filtered;
  }, [searchTerm, selectedType, selectedSeverity, selectedCategory]);

  const getTypeIcon = (type: string) => {
    return type === 'disease' ? <Activity className="h-4 w-4" /> : <Bug className="h-4 w-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fungal': return <Microscope className="h-3 w-3" />;
      case 'bacterial': return <Activity className="h-3 w-3" />;
      case 'viral': return <ShieldAlert className="h-3 w-3" />;
      case 'insect': return <Bug className="h-3 w-3" />;
      case 'mite': return <Bug className="h-3 w-3" />;
      case 'nematode': return <Microscope className="h-3 w-3" />;
      case 'environmental': return <AlertTriangle className="h-3 w-3" />;
      default: return <AlertTriangle className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO {...seoConfigs.diseasesAndPests} />
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/knowledge" className="hover:text-cactus-green">Knowledge Base</Link>
            <ArrowRight className="h-4 w-4" />
            <span>Diseases & Pests</span>
          </div>
          <h1 className="page-title-xl mb-4">Diseases & Pests Guide</h1>
          <p className="text-gray-600 max-w-3xl">
            Comprehensive identification and treatment guide for common diseases and pests affecting cacti and succulents. 
            Learn to recognize symptoms early, apply effective treatments, and prevent future problems.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{getDiseases().length}</div>
              <div className="text-sm text-gray-600">Diseases</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Bug className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{getPests().length}</div>
              <div className="text-sm text-gray-600">Pests</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShieldAlert className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">
                {diseasesAndPests.filter(item => item.severity === 'critical').length}
              </div>
              <div className="text-sm text-gray-600">Critical Issues</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">Prevention</div>
              <div className="text-sm text-gray-600">Focus</div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Emergency Protocol:</strong> If you suspect bacterial rot or viral infection, 
            isolate the plant immediately and begin treatment within 24 hours. Early intervention is critical for plant survival.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search diseases & pests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="disease">Diseases</SelectItem>
                        <SelectItem value="pest">Pests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Severity</label>
                    <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="All severities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="fungal">Fungal</SelectItem>
                        <SelectItem value="bacterial">Bacterial</SelectItem>
                        <SelectItem value="viral">Viral</SelectItem>
                        <SelectItem value="insect">Insect</SelectItem>
                        <SelectItem value="mite">Mite</SelectItem>
                        <SelectItem value="nematode">Nematode</SelectItem>
                        <SelectItem value="environmental">Environmental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="subsection-title mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or filters to find relevant diseases and pests.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredItems.map((item) => (
                  <DiseasePestCard key={item.id} item={item} />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Professional Treatment Tools */}
            <AmazonAffiliateProducts 
              products={[
                {
                  id: "neem-oil-treatment",
                  title: "Organic Neem Oil for Plant Protection",
                  price: "$12.99",
                  rating: 4.3,
                  reviewCount: 3200,
                  category: "fertilizer",
                  tags: ["organic", "neem-oil", "fungicide", "insecticide"],
                  imageUrl: "https://m.media-amazon.com/images/I/81D1Rs8OvLL._AC_SY679_.jpg",
                  description: "Organic treatment for fungal diseases, mites, and common plant pests",
                  affiliateUrl: "https://www.amazon.com/dp/B00GRAJTEK?tag=mindrash-20&linkCode=ogi&th=1&psc=1"
                },
                {
                  id: "succulent-tools-treatment",
                  title: "Precision Plant Care Tools",
                  price: "$18.99",
                  rating: 4.3,
                  reviewCount: 892,
                  category: "tools", 
                  tags: ["tools", "tongs", "pruning", "watering"],
                  imageUrl: "https://m.media-amazon.com/images/I/61Blda+HRvL._AC_SY300_SX300_.jpg",
                  description: "Complete mini garden hand tools with tongs, pruning shears for pest removal",
                  affiliateUrl: "https://www.amazon.com/dp/B01GWSBQVA?tag=mindrash-20&linkCode=ogi&th=1&psc=1"
                },
                {
                  id: "precision-tweezers",
                  title: "Curved Tip Precision Tweezers",
                  price: "$14.95",
                  rating: 4.8,
                  reviewCount: 346,
                  category: "tools",
                  tags: ["tweezers", "curved-tip", "stainless-steel", "precision"],
                  imageUrl: "https://m.media-amazon.com/images/I/61VdJbibWkL._AC_SX355_.jpg",
                  description: "Ideal tool for removing pests and debris from tight spaces without plant damage",
                  affiliateUrl: "https://www.amazon.com/dp/B07HQLDZZD?tag=mindrash-20&linkCode=ogi&th=1&psc=1"
                },
                {
                  id: "care-guide-book",
                  title: "Succulent Care & Treatment Guide",
                  price: "$19.95",
                  rating: 4.6,
                  reviewCount: 1432,
                  category: "books",
                  tags: ["succulent", "design", "care", "drought-tolerant"],
                  imageUrl: "https://m.media-amazon.com/images/I/81etdhhfUOL._SY342_.jpg",
                  description: "Comprehensive guide including disease identification and treatment protocols",
                  affiliateUrl: "https://www.amazon.com/dp/B01D8JDJ9K?tag=mindrash-20&linkCode=ogi&th=1&psc=1"
                }
              ]}
              title="Essential Treatment Tools"
              className="w-full"
            />

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Emergency Actions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Isolate infected plants</li>
                    <li>• Stop watering immediately</li>
                    <li>• Sterilize tools between plants</li>
                    <li>• Remove infected tissue</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Prevention Keys</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Well-draining soil</li>
                    <li>• Proper air circulation</li>
                    <li>• Quarantine new plants</li>
                    <li>• Regular inspections</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">Treatment Hierarchy</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>1. Physical removal</li>
                    <li>2. Organic treatments</li>
                    <li>3. Chemical applications</li>
                    <li>4. Biological controls</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Related Knowledge */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/knowledge/care-guides" className="block">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium text-sm">Care Guides</div>
                      <div className="text-xs text-gray-600">Species-specific care instructions</div>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/knowledge/species" className="block">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium text-sm">Species Database</div>
                      <div className="text-xs text-gray-600">Browse plant species information</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/vendors" className="block">
                  <Button variant="ghost" className="w-full justify-start h-auto p-3">
                    <div className="text-left">
                      <div className="font-medium text-sm">Trusted Vendors</div>
                      <div className="text-xs text-gray-600">Find treatment supplies</div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function DiseasePestCard({ item }: { item: DiseasePest }) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {item.type === 'disease' ? <Activity className="h-5 w-5 text-red-500" /> : <Bug className="h-5 w-5 text-orange-500" />}
              <CardTitle className="text-xl">{item.name}</CardTitle>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getSeverityColor(item.severity)}>
                {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getCategoryIcon(item.category)}
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Badge>
              {item.scientificName && (
                <Badge variant="secondary" className="italic text-xs">
                  {item.scientificName}
                </Badge>
              )}
            </div>

            <CardDescription className="text-sm leading-relaxed">
              {item.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Common Names */}
        {item.commonNames.length > 1 && (
          <div>
            <h4 className="font-medium text-sm mb-1">Also Known As:</h4>
            <p className="text-sm text-gray-600">{item.commonNames.slice(1).join(", ")}</p>
          </div>
        )}

        {/* Key Symptoms */}
        <div>
          <h4 className="font-medium text-sm mb-2">Key Symptoms:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {item.symptoms.slice(0, 3).map((symptom, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{symptom}</span>
              </li>
            ))}
            {item.symptoms.length > 3 && (
              <li className="text-xs text-gray-500 italic">
                +{item.symptoms.length - 3} more symptoms
              </li>
            )}
          </ul>
        </div>

        {/* Affected Plants */}
        <div>
          <h4 className="font-medium text-sm mb-1">Commonly Affects:</h4>
          <p className="text-sm text-gray-600">{item.affectedPlants.join(", ")}</p>
        </div>

        {/* Expandable Sections */}
        <Tabs value={expandedSection || "none"} onValueChange={setExpandedSection} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="identification" className="text-xs">ID & Signs</TabsTrigger>
            <TabsTrigger value="prevention" className="text-xs">Prevention</TabsTrigger>
            <TabsTrigger value="treatment" className="text-xs">Treatment</TabsTrigger>
            <TabsTrigger value="prognosis" className="text-xs">Prognosis</TabsTrigger>
          </TabsList>

          <TabsContent value="identification" className="mt-4 space-y-3">
            <div>
              <h5 className="font-medium text-sm mb-2">Visual Signs:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {item.identification.visualSigns.map((sign, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-1">Timing:</h5>
              <p className="text-sm text-gray-600">{item.identification.timing}</p>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-1">Progression:</h5>
              <p className="text-sm text-gray-600">{item.identification.progression}</p>
            </div>
          </TabsContent>

          <TabsContent value="prevention" className="mt-4 space-y-3">
            <div>
              <h5 className="font-medium text-sm mb-2">Cultural Practices:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {item.prevention.culturalPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-sm mb-2">Environmental Controls:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {item.prevention.environmentalControls.map((control, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{control}</span>
                  </li>
                ))}
              </ul>
            </div>
            {item.prevention.quarantine.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2">Quarantine Measures:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {item.prevention.quarantine.map((measure, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="treatment" className="mt-4 space-y-3">
            {item.treatment.immediate.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2 text-red-600">Immediate Action:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {item.treatment.immediate.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h5 className="font-medium text-sm mb-2 text-green-600">Organic Treatment:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {item.treatment.organic.map((treatment, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>

            {item.treatment.chemical.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2 text-blue-600">Chemical Treatment:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {item.treatment.chemical.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.treatment.biological.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2 text-purple-600">Biological Control:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {item.treatment.biological.map((treatment, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1">•</span>
                      <span>{treatment}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.treatment.longTerm.length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2 text-gray-600">Long-term Care:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {item.treatment.longTerm.map((care, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span>{care}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="prognosis" className="mt-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-sm mb-2">Recovery Outlook:</h5>
              <p className="text-sm text-gray-700">{item.prognosis}</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'moderate': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'critical': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'fungal': return <Microscope className="h-3 w-3" />;
    case 'bacterial': return <Activity className="h-3 w-3" />;
    case 'viral': return <ShieldAlert className="h-3 w-3" />;
    case 'insect': return <Bug className="h-3 w-3" />;
    case 'mite': return <Bug className="h-3 w-3" />;
    case 'nematode': return <Microscope className="h-3 w-3" />;
    case 'environmental': return <AlertTriangle className="h-3 w-3" />;
    default: return <AlertTriangle className="h-3 w-3" />;
  }
}