import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Sparkles } from "lucide-react";
import { amazonProducts, type AmazonProduct } from "@shared/amazon-products";

interface AmazonAffiliateBannerProps {
  category?: string;
  limit?: number;
  title?: string;
  compact?: boolean;
}

export default function AmazonAffiliateBanner({ 
  category, 
  limit = 3, 
  title = "Recommended Supplies",
  compact = false
}: AmazonAffiliateBannerProps) {
  // Filter products by category if specified
  let filteredProducts = amazonProducts;
  if (category) {
    filteredProducts = amazonProducts.filter(product => product.category === category);
  }
  
  // Get random selection from filtered products
  const shuffleArray = (array: typeof filteredProducts) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const selectedProducts = shuffleArray(filteredProducts).slice(0, limit);

  if (selectedProducts.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-900">Quality Supplies</span>
            </div>
            <a
              href={selectedProducts[0].affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Shop Now
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {selectedProducts[0].title} - {selectedProducts[0].price}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        </div>
        
        <div className="grid gap-4">
          {selectedProducts.map((product) => (
            <div key={product.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white rounded-lg border border-orange-100">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-12 h-12 object-cover rounded shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/48/48';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 break-words">
                  {product.title.length > 60 ? `${product.title.substring(0, 60)}...` : product.title}
                </h4>
                <p className="text-xs text-gray-600 break-words mt-1">
                  {product.description.length > 80 ? `${product.description.substring(0, 80)}...` : product.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2">
                  <span className="text-sm font-medium text-orange-600">
                    {product.price}
                  </span>
                  <span className="text-xs text-gray-500">
                    ⭐ {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Shop
                </Button>
              </a>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-orange-100 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            As an Amazon Associate, Cactilog earns from qualifying purchases. 
            These recommendations help support our platform while providing quality supplies for your plants.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}