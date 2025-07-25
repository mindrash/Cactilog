import { useRoute, Link } from "wouter";
import { ArrowLeft, Info, Tag, Calendar, User, MapPin, Dna, Palette } from "lucide-react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cactusGenera, type CactusSpecies, type TaxonomicVariant } from "@shared/cactus-data";

export default function KnowledgeVariant() {
  const [, params] = useRoute("/knowledge/variant/:genusName/:speciesName/:variantName");
  const { genusName, speciesName, variantName } = params || {};

  if (!genusName || !speciesName || !variantName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Invalid variant URL. Please navigate from the Knowledge Base.
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

  // Find the genus, species, and variant
  const genus = cactusGenera.find((g: any) => g.name.toLowerCase() === genusName.toLowerCase());
  if (!genus) return <div>Genus not found</div>;

  let species: CactusSpecies | null = null;
  let variant: TaxonomicVariant | null = null;

  // Find species (could be string or CactusSpecies object)
  const foundSpecies = genus.species.find((s: any) => {
    if (typeof s === 'string') {
      return s.toLowerCase() === speciesName.toLowerCase();
    }
    return s.name.toLowerCase() === speciesName.toLowerCase();
  });

  if (typeof foundSpecies === 'object') {
    species = foundSpecies as CactusSpecies;
    variant = species.variants?.find(v => v.name.toLowerCase() === variantName.toLowerCase()) || null;
  }

  if (!species || !variant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                The variant "{variantName}" was not found.
              </p>
              <Link href={`/knowledge/species/${genusName}/${speciesName}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Species
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subspecies': return 'bg-blue-100 text-blue-800';
      case 'variety': return 'bg-green-100 text-green-800';
      case 'form': return 'bg-purple-100 text-purple-800';
      case 'cultivar': return 'bg-orange-100 text-orange-800';
      case 'clone': return 'bg-pink-100 text-pink-800';
      case 'mutation': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subspecies': return <Dna className="w-4 h-4" />;
      case 'variety': return <MapPin className="w-4 h-4" />;
      case 'form': return <Palette className="w-4 h-4" />;
      case 'cultivar': return <User className="w-4 h-4" />;
      case 'clone': return <Tag className="w-4 h-4" />;
      case 'mutation': return <Calendar className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'subspecies': return 'A taxonomic rank below species, representing geographically distinct populations';
      case 'variety': return 'A naturally occurring variant within a species, often with distinct characteristics';
      case 'form': return 'A minor variant, typically differing in a single characteristic like flower color';
      case 'cultivar': return 'A cultivated variety selected and maintained by human cultivation';
      case 'clone': return 'A genetically identical population propagated from a single individual';
      case 'mutation': return 'A variant arising from genetic mutation, often with unusual growth patterns';
      default: return 'A taxonomic variant of the species';
    }
  };

  const formatName = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
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
          <Separator orientation="vertical" className="h-4" />
          <Link href={`/knowledge/species/${genusName}/${speciesName}`}>
            <Button variant="outline" size="sm">
              {species.name}
            </Button>
          </Link>
          <div className="text-sm text-gray-500">
            → Variant Details
          </div>
        </div>

        {/* Variant Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge className={`${getTypeColor(variant.type)} flex items-center space-x-1`}>
              {getTypeIcon(variant.type)}
              <span className="capitalize">{variant.type}</span>
            </Badge>
          </div>
          
          <h1 className="page-title-lg mb-2">
            <span className="italic text-cactus-green">{formatName()}</span>
          </h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              {genus.commonName}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Cactaceae Family
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Taxonomic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Taxonomic Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">What is a {variant.type}?</h4>
                  <p className="text-gray-700 text-sm">
                    {getTypeDescription(variant.type)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Full Scientific Name</h4>
                    <p className="text-sm italic text-cactus-green font-medium">
                      {formatName()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Base Species</h4>
                    <p className="text-sm">
                      <span className="italic">{genus.name} {species.name}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {variant.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {variant.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Discovery Information */}
            {(variant.discoverer || variant.year) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Discovery & Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variant.discoverer && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Discovered/Named by</h4>
                      <p className="text-gray-700">{variant.discoverer}</p>
                    </div>
                  )}
                  
                  {variant.year && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Year</h4>
                      <p className="text-gray-700">{variant.year}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Synonyms */}
            {variant.synonyms && variant.synonyms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Synonyms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {variant.synonyms.map((synonym, index) => (
                      <div key={index} className="text-sm italic text-gray-600">
                        {synonym}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/collection?genus=${genus.name}&species=${species.name}&variant=${variant.name}`}>
                  <Button className="w-full bg-cactus-green hover:bg-cactus-green/90">
                    <Tag className="w-4 h-4 mr-2" />
                    Add to Collection
                  </Button>
                </Link>
                <Link href={`/knowledge/species/${genusName}/${speciesName}`}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Species
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Variants */}
            {species.variants && species.variants.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Other Variants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {species.variants
                      .filter(v => v.name !== variant.name)
                      .map((relatedVariant) => (
                        <Link 
                          key={relatedVariant.name} 
                          href={`/knowledge/variant/${genusName}/${speciesName}/${relatedVariant.name}`}
                        >
                          <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-cactus-green">
                                {relatedVariant.name}
                              </p>
                              <Badge size="sm" className={`${getTypeColor(relatedVariant.type)} text-xs`}>
                                {relatedVariant.type}
                              </Badge>
                            </div>
                            {relatedVariant.description && (
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {relatedVariant.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}