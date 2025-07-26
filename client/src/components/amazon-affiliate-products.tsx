import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ExternalLink } from "lucide-react";
import { AmazonProduct } from "@shared/amazon-products";

interface AmazonAffiliateProductsProps {
  products: AmazonProduct[];
  title?: string;
  context?: string;
  className?: string;
}

export default function AmazonAffiliateProducts({ 
  products, 
  title = "Recommended Products", 
  context,
  className = "" 
}: AmazonAffiliateProductsProps) {
  if (products.length === 0) return null;

  const formatRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className={`bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-orange-600">📦</span>
          {title}
        </h3>
        {context && (
          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
            {context}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {products.map((product) => (
          <Card key={product.id} className="bg-white border-orange-100 hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const fallback = target.nextElementSibling as HTMLSpanElement;
                      target.style.display = 'none';
                      fallback.style.display = 'flex';
                    }}
                  />
                  <span className="text-2xl hidden">🌵</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight mb-1">
                    {product.title}
                  </h4>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {formatRating(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviewCount.toLocaleString()})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-600 text-sm">
                      {product.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="h-7 text-xs bg-orange-600 hover:bg-orange-700"
                      onClick={() => window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                {product.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>🔗 As an Amazon Associate, we earn from qualifying purchases</p>
      </div>
    </div>
  );
}

// Specialized components for different contexts
interface ProductSidebarProps {
  family?: string;
  genus?: string;
  context: 'collection' | 'species' | 'care' | 'home';
  className?: string;
}

export function ProductSidebar({ family, genus, context, className }: ProductSidebarProps) {
  // This would be expanded with actual product fetching logic
  const getContextualProducts = () => {
    // Mock data for now - would fetch from amazonProducts based on context
    return [];
  };

  const products = getContextualProducts();
  
  if (products.length === 0) return null;

  return (
    <AmazonAffiliateProducts 
      products={products}
      title="Recommended for You"
      context={`${family || genus || 'Plants'} Care`}
      className={className}
    />
  );
}