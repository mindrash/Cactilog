import { ShoppingCart, ExternalLink, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Import vendor data to get recommendations
const vendorRecommendations = [
  // Seeds specialists - good for most species
  {
    name: "Mesa Garden",
    description: "Premium seed specialist with hand-packed seeds and detailed collection data",
    website: "https://mesagarden.com",
    location: "New Mexico",
    specialties: ["seeds"],
    reputation: "premium",
    priceRange: "premium",
    categories: ["cacti", "succulents"],
    reason: "Excellent seed quality with collection data"
  },
  {
    name: "SeedsCactus.com",
    description: "Fresh seed specialist with recently collected seeds ensuring high germination rates",
    website: "https://seedscactus.com",
    location: "International",
    specialties: ["seeds", "supplies"],
    reputation: "reliable",
    priceRange: "moderate",
    categories: ["cacti", "succulents"],
    reason: "Fresh seeds with cultivation guides"
  },
  {
    name: "CSSA Seed Depot",
    description: "Cactus and Succulent Society of America seed depot with conservation-focused seeds",
    website: "https://shop.cactusandsucculentsociety.org",
    location: "United States",
    specialties: ["seeds"],
    reputation: "premium",
    priceRange: "moderate",
    categories: ["cacti", "succulents"],
    reason: "Society-sourced with conservation documentation"
  },
  // Live plants specialists
  {
    name: "Planet Desert",
    description: "Full-service nursery with own-grown plants and competitive pricing",
    website: "https://planetdesert.com",
    location: "Southern California",
    specialties: ["plants", "pots", "supplies", "soil"],
    reputation: "premium",
    priceRange: "moderate",
    categories: ["cacti", "succulents"],
    reason: "Wide variety with live arrival guarantees"
  },
  {
    name: "California Cactus Center",
    description: "Premium collector plants established in 1976, known for rare specimens",
    website: "https://www.california-cactus-succulents.com",
    location: "Pasadena, CA",
    specialties: ["plants"],
    reputation: "premium",
    priceRange: "luxury",
    categories: ["cacti", "succulents"],
    reason: "Rare specimens and collector plants"
  },
  {
    name: "The Cactus King",
    description: "Expert botanist-run nursery with 250+ species and consultation services",
    website: "https://thecactusking.com",
    location: "Texas",
    specialties: ["plants", "supplies"],
    reputation: "premium",
    priceRange: "premium",
    categories: ["cacti", "succulents"],
    reason: "Expert consultation and rare species"
  }
];

interface VendorRecommendationsProps {
  genus: string;
  species: string;
  maxRecommendations?: number;
}

export function VendorRecommendations({ genus, species, maxRecommendations = 4 }: VendorRecommendationsProps) {
  const scientificName = `${genus} ${species}`;
  
  // Get reputation badge color
  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'luxury': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'reliable': return 'bg-green-100 text-green-800 border-green-200';
      case 'specialty': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get price range badge color
  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case 'luxury': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';  
      case 'moderate': return 'bg-green-100 text-green-800 border-green-200';
      case 'budget': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filter vendors based on species characteristics - for Trichocereus, prioritize seed specialists
  const getRecommendedVendors = () => {
    let recommended = [...vendorRecommendations];
    
    // For Trichocereus species, prioritize seed specialists due to legal considerations
    if (genus.toLowerCase() === 'trichocereus') {
      recommended = recommended.filter(v => 
        v.specialties.includes('seeds') || 
        (v.specialties.includes('plants') && v.reputation === 'premium')
      );
    }
    
    return recommended.slice(0, maxRecommendations);
  };

  const recommendedVendors = getRecommendedVendors();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Purchase {scientificName}
        </CardTitle>
        <p className="text-sm text-gray-600">
          Trusted vendors offering seeds and plants from this species
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendedVendors.map((vendor, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{vendor.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{vendor.description}</p>
                  <p className="text-xs text-sage mb-2">{vendor.reason}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={`${getReputationColor(vendor.reputation)} text-xs`}>
                    {vendor.reputation}
                  </Badge>
                  <Badge className={`${getPriceColor(vendor.priceRange)} text-xs`}>
                    {vendor.priceRange}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {vendor.location}
                  </div>
                  <div className="flex items-center space-x-1">
                    {vendor.specialties.map((specialty, idx) => (
                      <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(vendor.website, '_blank')}
                  className="text-xs"
                >
                  Visit Store
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              <strong>Purchasing Notes:</strong> Always verify species authenticity and legal compliance when purchasing. 
              Seeds are generally recommended for rare species to ensure genetic diversity.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('/vendors', '_blank')}
              >
                View All Trusted Vendors
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}