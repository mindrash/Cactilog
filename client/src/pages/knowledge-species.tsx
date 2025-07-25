import { useRoute, Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Info, MapPin, Calendar, Droplet, Sun, Thermometer, Scissors, Eye, Camera, ExternalLink } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SpeciesImageGallery } from "@/components/species-image-gallery";
import { cactusGenera, type CactusSpecies } from "@shared/cactus-data";

export default function KnowledgeSpecies() {
  const [, params] = useRoute("/knowledge/species/:genusName/:speciesName");
  const { genusName, speciesName } = params || {};

  if (!genusName || !speciesName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Invalid species URL. Please navigate from the Knowledge Base.
              </p>
              <Link href="/knowledge">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Find the genus and verify the species exists
  const genus = cactusGenera.find((g: any) => g.name.toLowerCase() === genusName.toLowerCase());
  
  if (!genus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                The genus "{genusName}" was not found in our database.
              </p>
              <Link href="/knowledge">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Knowledge Base
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Find species (could be string or CactusSpecies object)
  const foundSpecies = genus.species.find((s: any) => {
    if (typeof s === 'string') {
      return s.toLowerCase() === speciesName.toLowerCase();
    }
    return s.name.toLowerCase() === speciesName.toLowerCase();
  });

  const speciesExists = !!foundSpecies;
  
  // Convert to CactusSpecies object for consistent handling
  const species: CactusSpecies = typeof foundSpecies === 'string' 
    ? { name: foundSpecies }
    : foundSpecies || { name: speciesName };
  
  if (!speciesExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                The species "{speciesName}" was not found in the genus {genusName}.
              </p>
              <Link href={`/knowledge/genus/${genusName}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to {genusName}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Generate species information based on botanical knowledge
  const generateSpeciesInfo = (genus: string, species: string) => {
    // Common characteristics based on genus
    const genusInfo: Record<string, any> = {
      mammillaria: {
        nativeRegion: "Mexico and Southwestern United States",
        habitat: "Desert scrublands and rocky outcrops",
        growthForm: "Globular to cylindrical, often clustering",
        flowers: "Small, funnel-shaped, appearing in rings around the crown",
        spines: "Central and radial spines, often hooked",
        careLevel: "Moderate",
        waterNeeds: "Low - allow to dry between waterings",
        lightNeeds: "Bright, direct sunlight",
        temperature: "65-80°F (18-27°C), can tolerate brief cold",
        blooming: "Spring to early summer",
        size: "2-12 inches (5-30 cm) diameter"
      },
      echinocactus: {
        nativeRegion: "Mexico and Southwestern United States",
        habitat: "Desert flats and rocky slopes",
        growthForm: "Large barrel-shaped, solitary",
        flowers: "Yellow, appearing at the crown",
        spines: "Heavy, prominent spines for protection",
        careLevel: "Easy",
        waterNeeds: "Very low - drought tolerant",
        lightNeeds: "Full sun exposure",
        temperature: "70-90°F (21-32°C)",
        blooming: "Summer, mature plants only",
        size: "Up to 4 feet (1.2m) diameter"
      },
      opuntia: {
        nativeRegion: "Americas, widespread distribution",
        habitat: "Desert to semi-arid regions",
        growthForm: "Segmented pads or cylindrical joints",
        flowers: "Large, showy, various colors",
        spines: "Glochids and larger spines",
        careLevel: "Easy",
        waterNeeds: "Low to moderate",
        lightNeeds: "Full sun to partial shade",
        temperature: "Varies by species, many cold-hardy",
        blooming: "Spring to summer",
        size: "Varies greatly by species"
      },
      cereus: {
        nativeRegion: "South America and Caribbean",
        habitat: "Scrublands and coastal areas",
        growthForm: "Tall columnar, often branching",
        flowers: "Large, white, nocturnal",
        spines: "Few to many, variable",
        careLevel: "Easy",
        waterNeeds: "Low to moderate",
        lightNeeds: "Bright light, some direct sun",
        temperature: "65-85°F (18-29°C)",
        blooming: "Summer nights",
        size: "Can reach 30+ feet (9m)"
      },
      // Add default for other genera
      default: {
        nativeRegion: "Americas (specific range varies)",
        habitat: "Arid to semi-arid regions",
        growthForm: "Variable growth form",
        flowers: "Species-specific flowering pattern",
        spines: "Variable spine characteristics",
        careLevel: "Moderate",
        waterNeeds: "Low - typical desert plant needs",
        lightNeeds: "Bright light preferred",
        temperature: "Warm temperatures preferred",
        blooming: "Seasonal, varies by species",
        size: "Variable mature size"
      }
    };

    return genusInfo[genus.toLowerCase()] || genusInfo.default;
  };

  const speciesInfo = generateSpeciesInfo(genus.name, speciesName);
  const scientificName = `${genus.name} ${speciesName}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/knowledge">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Knowledge Base
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href={`/knowledge/genus/${genusName}`}>
            <Button variant="outline" size="sm">
              {genus.name}
            </Button>
          </Link>
          <div className="text-sm text-gray-500">
            → Species Details
          </div>
        </div>

        {/* Species Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="italic text-cactus-green">{scientificName}</span>
          </h1>
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              {genus.commonName}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Cactaceae Family
            </Badge>
            <Badge className="bg-sage text-white text-sm">
              {speciesInfo.careLevel} Care
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
                <TabsTrigger value="characteristics">Features</TabsTrigger>
                <TabsTrigger value="collection">In Collections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      About {scientificName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      <strong>{scientificName}</strong> is a member of the {genus.name} genus, 
                      which is {genus.description.toLowerCase()}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-cactus-green mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Native Region</h4>
                          <p className="text-gray-600 text-sm">{speciesInfo.nativeRegion}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Eye className="w-5 h-5 text-cactus-green mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Growth Form</h4>
                          <p className="text-gray-600 text-sm">{speciesInfo.growthForm}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      Botanical Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SpeciesImageGallery genus={genusName} species={speciesName} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Taxonomic Variants Tab */}
              <TabsContent value="variants">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Taxonomic Variants of {genus.name} {species.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {species.variants && species.variants.length > 0 ? (
                      <div className="space-y-6">
                        <p className="text-gray-700 mb-6">
                          This species has {species.variants.length} documented taxonomic variants including subspecies, varieties, forms, cultivars, clones, and mutations.
                        </p>
                        
                        <div className="grid gap-4">
                          {species.variants.map((variant) => {
                            const getTypeColor = (type: string) => {
                              switch (type) {
                                case 'subspecies': return 'bg-blue-100 text-blue-800 border-blue-200';
                                case 'variety': return 'bg-green-100 text-green-800 border-green-200';
                                case 'form': return 'bg-purple-100 text-purple-800 border-purple-200';
                                case 'cultivar': return 'bg-orange-100 text-orange-800 border-orange-200';
                                case 'clone': return 'bg-pink-100 text-pink-800 border-pink-200';
                                case 'mutation': return 'bg-red-100 text-red-800 border-red-200';
                                default: return 'bg-gray-100 text-gray-800 border-gray-200';
                              }
                            };

                            const formatVariantName = () => {
                              switch (variant.type) {
                                case 'subspecies':
                                  return `${genus.name} ${species.name} subsp. ${variant.name}`;
                                case 'variety':
                                  return `${genus.name} ${species.name} var. ${variant.name}`;
                                case 'form':
                                  return `${genus.name} ${species.name} f. ${variant.name}`;
                                case 'cultivar':
                                  return `${genus.name} ${species.name} '${variant.name}'`;
                                case 'clone':
                                  return `${genus.name} ${species.name} "${variant.name}"`;
                                case 'mutation':
                                  return `${genus.name} ${species.name} ${variant.name}`;
                                default:
                                  return `${genus.name} ${species.name} ${variant.name}`;
                              }
                            };

                            return (
                              <Link 
                                key={variant.name}
                                href={`/knowledge/variant/${genusName}/${species.name}/${variant.name}`}  
                              >
                                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-cactus-green italic text-lg mb-1">
                                        {formatVariantName()}
                                      </h4>
                                      <Badge className={`${getTypeColor(variant.type)} text-xs font-normal`}>
                                        {variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {variant.description && (
                                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                                      {variant.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                                    {variant.discoverer && (
                                      <span>Discovered by {variant.discoverer}</span>
                                    )}
                                    {variant.year && (
                                      <span>{variant.year}</span>
                                    )}
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Understanding Taxonomic Categories</h4>
                          <div className="text-sm text-blue-800 space-y-1">
                            <p><strong>Subspecies:</strong> Geographically distinct populations within a species</p>
                            <p><strong>Variety:</strong> Naturally occurring variants with distinct characteristics</p>
                            <p><strong>Form:</strong> Minor variants, typically differing in single traits</p>
                            <p><strong>Cultivar:</strong> Cultivated varieties selected for specific traits</p>
                            <p><strong>Clone:</strong> Genetically identical plants propagated from one individual</p>
                            <p><strong>Mutation:</strong> Variants arising from genetic changes, often with unusual growth</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Info className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Variants Documented</h3>
                        <p className="text-gray-600 mb-4">
                          Currently, no subspecies, varieties, forms, cultivars, clones, or mutations have been documented for this species in our database.
                        </p>
                        <p className="text-sm text-gray-500">
                          Many species have undocumented variants. If you know of varieties or cultivars, they can be added to your collection manually.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cultivation">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scissors className="w-5 h-5 mr-2" />
                      Cultivation Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Droplet className="w-5 h-5 text-blue-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Watering</h4>
                            <p className="text-gray-600 text-sm">{speciesInfo.waterNeeds}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Sun className="w-5 h-5 text-yellow-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Light Requirements</h4>
                            <p className="text-gray-600 text-sm">{speciesInfo.lightNeeds}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Thermometer className="w-5 h-5 text-red-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Temperature</h4>
                            <p className="text-gray-600 text-sm">{speciesInfo.temperature}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-purple-500 mt-1" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Blooming Season</h4>
                            <p className="text-gray-600 text-sm">{speciesInfo.blooming}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characteristics">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Physical Characteristics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Size</h4>
                        <p className="text-gray-600 text-sm">{speciesInfo.size}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Flowers</h4>
                        <p className="text-gray-600 text-sm">{speciesInfo.flowers}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Spines</h4>
                        <p className="text-gray-600 text-sm">{speciesInfo.spines}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Habitat</h4>
                        <p className="text-gray-600 text-sm">{speciesInfo.habitat}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="collection">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-5 h-5 mr-2" />
                      In Community Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      See how other CactiTracker users are growing {scientificName} in their collections.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">
                        Community collection photos and care notes will be displayed here when available.
                      </p>
                      <Link href="/collection">
                        <Button variant="outline" className="mt-3">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Add to My Collection
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/collection?genus=${genus.name}&species=${speciesName}`}>
                  <Button className="w-full bg-cactus-green hover:bg-cactus-green/90">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Add to My Collection
                  </Button>
                </Link>
                <Link href={`/knowledge/genus/${genusName}`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    View All {genus.name}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Species */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Species</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {genus.species
                    .filter((s: any) => {
                      const name = typeof s === 'string' ? s : s.name;
                      return name.toLowerCase() !== speciesName.toLowerCase();
                    })
                    .slice(0, 5)
                    .map((relatedSpecies: any) => {
                      const name = typeof relatedSpecies === 'string' ? relatedSpecies : relatedSpecies.name;
                      return (
                        <Link 
                          key={name} 
                          href={`/knowledge/species/${genusName}/${name}`}
                        >
                          <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <p className="text-sm italic text-cactus-green">
                              {genus.name} {name}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  {genus.species.length > 6 && (
                    <Link href={`/knowledge/genus/${genusName}`}>
                      <div className="p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center">
                        <p className="text-sm text-gray-500">
                          +{genus.species.length - 6} more species
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}