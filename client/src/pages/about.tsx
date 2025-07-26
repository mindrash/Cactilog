import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Database, Camera, TrendingUp, Heart, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title="About Cactilog - Our Mission & Story"
        description="Learn about Cactilog's mission to connect cactus and succulent enthusiasts worldwide. Discover our features, community values, and commitment to botanical education."
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="page-title-lg mb-4">About Cactilog</h1>
          <p className="text-xl text-gray-600 mb-4">
            Empowering cactus and succulent enthusiasts worldwide
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            BETA Platform - Continuously Growing
          </Badge>
        </div>

        {/* Mission Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Cactilog was born from a passion for cacti and succulents and the desire to create 
              a comprehensive platform where enthusiasts can document, track, and share their botanical 
              journeys. We believe every plant has a story, and every collector deserves tools that 
              help them nurture their passion while connecting with a vibrant community of fellow growers.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-500" />
                Smart Collection Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track your plants with detailed taxonomic information, custom IDs, and comprehensive 
                metadata. Our system supports complex botanical classifications including subspecies, 
                varieties, cultivars, and clones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Growth Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Monitor your plants' progress with detailed growth tracking, health scoring, and 
                environmental observations. Visualize trends and compare growth rates across your collection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-500" />
                Photo Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Capture and organize photos of your plants with timestamps and metadata. Build a 
                visual diary of your collection's evolution and share highlights with the community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-orange-500" />
                Community Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Connect with thousands of fellow enthusiasts, browse public collections, and discover 
                new species. Share your knowledge and learn from experienced growers worldwide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Knowledge Base */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Comprehensive Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Our knowledge base features over 1,200 species across 60+ genera, providing detailed 
              information about:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Botanical classifications and taxonomic hierarchy</li>
              <li>Species-specific care guides and cultivation requirements</li>
              <li>Historical and cultural significance</li>
              <li>Propagation techniques and growing tips</li>
              <li>Trusted vendor recommendations and purchasing guides</li>
            </ul>
          </CardContent>
        </Card>

        {/* Community Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Our Community Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Education First</h4>
                <p className="text-gray-600 text-sm">
                  We prioritize accurate botanical information and responsible cultivation practices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Inclusive Community</h4>
                <p className="text-gray-600 text-sm">
                  Welcoming growers of all experience levels, from beginners to experts.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Privacy Respected</h4>
                <p className="text-gray-600 text-sm">
                  Your collection data is yours - choose what to share publicly or keep private.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Open Source Spirit</h4>
                <p className="text-gray-600 text-sm">
                  Built with transparency and community contributions in mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beta Information */}
        <Card>
          <CardHeader>
            <CardTitle>Beta Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Cactilog is currently in beta development, which means we're actively adding new features 
              and improvements based on community feedback. While the platform is fully functional, 
              you may occasionally encounter new features being added or minor issues being resolved.
            </p>
            <p className="text-gray-600">
              We appreciate your patience and feedback as we continue to grow and improve the platform 
              for the entire botanical community.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}