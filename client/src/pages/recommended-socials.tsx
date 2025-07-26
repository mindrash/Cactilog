import { useState } from "react";
import { SEO } from "@/components/seo";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AmazonAffiliateBanner from "@/components/amazon-affiliate-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Search, Youtube, Instagram, Users, PlayCircle, Camera, Heart } from "lucide-react";

interface SocialAccount {
  id: string;
  platform: "youtube" | "instagram";
  name: string;
  handle: string;
  url: string;
  description: string;
  specialty: string[];
  followers?: string;
  verified?: boolean;
}

const socialAccounts: SocialAccount[] = [
  // YouTube Accounts
  {
    id: "cactus-quest",
    platform: "youtube",
    name: "CactusQuest",
    handle: "@CactusQuest",
    url: "https://www.youtube.com/@CactusQuest",
    description: "Comprehensive cactus and succulent care guides, collection tours, and propagation tutorials.",
    specialty: ["Care Guides", "Collection Tours", "Propagation"],
    followers: "45K+",
    verified: true,
  },
  {
    id: "debra-lee-baldwin",
    platform: "youtube",
    name: "Debra Lee Baldwin",
    handle: "@DebraLeeBaldwin",
    url: "https://www.youtube.com/@DebraLeeBaldwin",
    description: "Award-winning garden photojournalist with 6M+ views. Expert succulent design and care tips.",
    specialty: ["Design", "Expert Tips", "Garden Photography"],
    followers: "6M+ views",
    verified: true,
  },
  {
    id: "laura-eubanks",
    platform: "youtube",
    name: "Design for Serenity",
    handle: "@DesignforSerenity",
    url: "https://www.youtube.com/@DesignforSerenity",
    description: "Celebrity landscape designer Laura Eubanks shares professional design techniques and arrangement tutorials.",
    specialty: ["Landscape Design", "Arrangements", "Professional Tips"],
    followers: "4M+ views",
    verified: true,
  },
  {
    id: "cactus-caffeine",
    platform: "youtube",
    name: "Cactus Caffeine",
    handle: "@CactusCaffeine",
    url: "https://www.youtube.com/@CactusCaffeine",
    description: "Desert gardening expertise from Las Vegas. Perfect for arid climate growing conditions.",
    specialty: ["Desert Gardening", "Arid Climate", "Las Vegas Growing"],
    followers: "56.5K",
    verified: false,
  },
  {
    id: "sucs-for-you",
    platform: "youtube",
    name: "Sucs For You",
    handle: "@SucsForYou",
    url: "https://www.youtube.com/@SucsForYou",
    description: "Propagation demos and care tutorials for challenging climates and difficult growing conditions.",
    specialty: ["Propagation", "Challenging Climates", "Care Tutorials"],
    followers: "52.1K",
    verified: false,
  },
  {
    id: "cacti-mania",
    platform: "youtube",
    name: "Cacti Mania",
    handle: "@CactiMania",
    url: "https://www.youtube.com/@CactiMania",
    description: "All things cacti - growing, caring, and collecting. Great for cactus-specific content.",
    specialty: ["Cacti Focus", "Growing", "Collecting"],
    followers: "11.5K",
    verified: false,
  },
  {
    id: "desert-plants-avalon",
    platform: "youtube",
    name: "Desert Plants of Avalon",
    handle: "@DesertPlantsofAvalon",
    url: "https://www.youtube.com/@DesertPlantsofAvalon",
    description: "30+ years collecting experience from Ireland. European perspective on cactus growing with 500+ plant collection.",
    specialty: ["European Growing", "Collecting", "Euphorbia"],
    followers: "8K+",
    verified: false,
  },
  {
    id: "succulents-sunshine",
    platform: "youtube",
    name: "Succulents and Sunshine",
    handle: "@SucculentsandSunshine",
    url: "https://www.youtube.com/@SucculentsandSunshine",
    description: "Photography-focused content by Cassidy Tuttle. Cold-hardy arrangements and large design projects.",
    specialty: ["Photography", "Cold-Hardy", "Large Designs"],
    followers: "25K+",
    verified: false,
  },
  {
    id: "plant-one-on-me",
    platform: "youtube",
    name: "Plant One On Me",
    handle: "@PlantOneOnMe",
    url: "https://www.youtube.com/@PlantOneOnMe",
    description: "Summer Rayne Oakes' educational content with '365 Days of Plants' and comprehensive plant guides.",
    specialty: ["Education", "Plant Guides", "Indoor Growing"],
    followers: "180K+",
    verified: true,
  },
  {
    id: "planterina",
    platform: "youtube",
    name: "Planterina",
    handle: "@Planterina",
    url: "https://www.youtube.com/@Planterina",
    description: "Amanda Switzer's beginner-friendly guides with real-life examples and pros/cons analysis.",
    specialty: ["Beginner Friendly", "Indoor/Outdoor", "Real Examples"],
    followers: "732K",
    verified: true,
  },
  {
    id: "carmen-whitehead",
    platform: "youtube",
    name: "Carmen Whitehead",
    handle: "@CarmenWhitehead",
    url: "https://www.youtube.com/@CarmenWhitehead",
    description: "Trailing succulent specialist focusing on string plants and rare variety collecting.",
    specialty: ["Trailing Succulents", "Rare Varieties", "String Plants"],
    followers: "15K+",
    verified: false,
  },

  // Instagram Accounts  
  {
    id: "aridzine",
    platform: "instagram",
    name: "Aridzine",
    handle: "@aridzine",
    url: "https://www.instagram.com/aridzine/",
    description: "Stunning cactus and succulent photography with artistic flair and desert plant focus.",
    specialty: ["Photography", "Desert Plants", "Artistic"],
    followers: "25K+",
    verified: false,
  },
  {
    id: "world-of-succulents",
    platform: "instagram",
    name: "World of Succulents",
    handle: "@worldofsucculents",
    url: "https://www.instagram.com/worldofsucculents/",
    description: "Educational hub with plant information, growing tips, care guides, and stunning photography.",
    specialty: ["Education", "Care Guides", "Photography"],
    followers: "850K+",
    verified: true,
  },
  {
    id: "succulent-market",
    platform: "instagram",
    name: "Succulent Market",
    handle: "@succulentmarket",
    url: "https://www.instagram.com/succulentmarket/",
    description: "50+ year family farm sharing care tips, plant varieties, and beautiful specimens.",
    specialty: ["Commercial", "Care Tips", "Family Farm"],
    followers: "180K+",
    verified: true,
  },
  {
    id: "leaf-and-clay",
    platform: "instagram",
    name: "Leaf & Clay",
    handle: "@leafandclay",
    url: "https://www.instagram.com/leafandclay/",
    description: "Community collaboration for succulent enthusiasts and beginners with tips and user submissions.",
    specialty: ["Community", "Beginner Tips", "Collaboration"],
    followers: "320K+",
    verified: true,
  },
  {
    id: "earth-wind-cactus",
    platform: "instagram",
    name: "Earth Wind & Cactus",
    handle: "@earthwindandcactus",
    url: "https://www.instagram.com/earthwindandcactus/",
    description: "Botanical curiosities celebrating cacti with tips from Jonna and Julien.",
    specialty: ["Cacti Focus", "Botanical Curiosities", "Tips"],
    followers: "95K+",
    verified: false,
  },
  {
    id: "cactus-magazine",
    platform: "instagram",
    name: "Cactus Magazine",
    handle: "@cactusmagazine",
    url: "https://www.instagram.com/cactusmagazine/",
    description: "Latest prickly plant pics, products, and design inspiration for cactus enthusiasts.",
    specialty: ["Design", "Products", "Inspiration"],
    followers: "42K+",
    verified: false,
  },
  {
    id: "potted-jungle",
    platform: "instagram",
    name: "The Potted Jungle",
    handle: "@thepottedjungle",
    url: "https://www.instagram.com/thepottedjungle/",
    description: "Jillian's San Diego plant lifestyle content with bonus cute pup pictures.",
    specialty: ["Plant Lifestyle", "San Diego", "Home Decor"],
    followers: "68K+",
    verified: false,
  },
  {
    id: "say-it-succulents",
    platform: "instagram",
    name: "Say It With Succulents",
    handle: "@sayitwithsucculents",
    url: "https://www.instagram.com/sayitwithsucculents/",
    description: "Features both potted succulents and plants in their natural desert habitats.",
    specialty: ["Natural Habitats", "Desert Photography", "Wild Plants"],
    followers: "35K+",
    verified: false,
  },
  {
    id: "succulent-cafe",
    platform: "instagram",
    name: "Succulent Cafe Oceanside",
    handle: "@succulentcafeoceanside",
    url: "https://www.instagram.com/succulentcafeoceanside/",
    description: "Gorgeous photos of succulents adorning their coffee shop with café atmosphere.",
    specialty: ["Café Atmosphere", "Coffee Shop", "Decor"],
    followers: "28K+",
    verified: false,
  },
  {
    id: "allie-grows",
    platform: "instagram",
    name: "Allie Grows Succulents",
    handle: "@alliegrows_succulents",
    url: "https://www.instagram.com/alliegrows_succulents/",
    description: "Personal journey with anxiety healing through plants, formations, and care tips.",
    specialty: ["Mental Health", "Personal Journey", "Care Tips"],
    followers: "45K+",
    verified: false,
  },
  {
    id: "succulent-city",
    platform: "instagram",
    name: "Succulent City",
    handle: "@succulentcity",
    url: "https://www.instagram.com/succulentcity/",
    description: "Urban succulent growing with city-specific tips and apartment-friendly arrangements.",
    specialty: ["Urban Growing", "Apartment Friendly", "City Tips"],
    followers: "155K+",
    verified: true,
  },
];

export default function RecommendedSocials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<"all" | "youtube" | "instagram">("all");

  const filteredAccounts = socialAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.specialty.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPlatform = selectedPlatform === "all" || account.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const youtubeAccounts = filteredAccounts.filter(acc => acc.platform === "youtube");
  const instagramAccounts = filteredAccounts.filter(acc => acc.platform === "instagram");

  const getPlatformIcon = (platform: string) => {
    return platform === "youtube" ? <Youtube className="h-4 w-4" /> : <Instagram className="h-4 w-4" />;
  };

  const getPlatformColor = (platform: string) => {
    return platform === "youtube" ? "bg-red-100 text-red-800" : "bg-pink-100 text-pink-800";
  };

  return (
    <>
      <SEO 
        title="Recommended Social Media Accounts | Cactilog"
        description="Discover the best YouTube channels and Instagram accounts for cactus and succulent enthusiasts. Expert tips, care guides, and inspiration from top creators."
        keywords="cactus youtube, succulent instagram, plant social media, cactus channels, succulent accounts"
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="page-title-xl mb-4">Recommended Social Media</h1>
                <p className="text-gray-600 text-lg mb-6">
                  Discover the best YouTube channels and Instagram accounts for cactus and succulent enthusiasts. 
                  From expert care guides to stunning photography, these creators share valuable knowledge and inspiration.
                </p>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search accounts, descriptions, or specialties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedPlatform === "all" ? "default" : "outline"}
                      onClick={() => setSelectedPlatform("all")}
                      className="whitespace-nowrap"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      All Platforms
                    </Button>
                    <Button
                      variant={selectedPlatform === "youtube" ? "default" : "outline"}
                      onClick={() => setSelectedPlatform("youtube")}
                      className="whitespace-nowrap"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      YouTube
                    </Button>
                    <Button
                      variant={selectedPlatform === "instagram" ? "default" : "outline"}
                      onClick={() => setSelectedPlatform("instagram")}
                      className="whitespace-nowrap"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                  </div>
                </div>

                {/* Results Summary */}
                <div className="mb-6 text-gray-600">
                  Showing {filteredAccounts.length} accounts
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedPlatform !== "all" && ` on ${selectedPlatform}`}
                </div>
              </div>

              {/* YouTube Section */}
              {(selectedPlatform === "all" || selectedPlatform === "youtube") && youtubeAccounts.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Youtube className="h-6 w-6 text-red-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">YouTube Channels</h2>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {youtubeAccounts.length} channels
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {youtubeAccounts.map((account) => (
                      <Card key={account.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                {account.name}
                                {account.verified && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-gray-500 mt-1">
                                {account.handle}
                              </CardDescription>
                              {account.followers && (
                                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                                  <PlayCircle className="h-4 w-4" />
                                  {account.followers}
                                </div>
                              )}
                            </div>
                            <Badge className={getPlatformColor(account.platform)}>
                              {getPlatformIcon(account.platform)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {account.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {account.specialty.map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            asChild 
                            className="w-full"
                            variant="outline"
                          >
                            <a 
                              href={account.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Youtube className="h-4 w-4" />
                              Visit Channel
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Instagram Section */}
              {(selectedPlatform === "all" || selectedPlatform === "instagram") && instagramAccounts.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Instagram className="h-6 w-6 text-pink-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">Instagram Accounts</h2>
                    <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                      {instagramAccounts.length} accounts
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instagramAccounts.map((account) => (
                      <Card key={account.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2 text-lg">
                                {account.name}
                                {account.verified && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </CardTitle>
                              <CardDescription className="text-gray-500 mt-1">
                                {account.handle}
                              </CardDescription>
                              {account.followers && (
                                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                                  <Heart className="h-4 w-4" />
                                  {account.followers}
                                </div>
                              )}
                            </div>
                            <Badge className={getPlatformColor(account.platform)}>
                              {getPlatformIcon(account.platform)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {account.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1 mb-4">
                            {account.specialty.map((spec, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button 
                            asChild 
                            className="w-full"
                            variant="outline"
                          >
                            <a 
                              href={account.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Instagram className="h-4 w-4" />
                              Visit Profile
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredAccounts.length === 0 && (
                <div className="text-center py-12">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or platform filter to find more accounts.
                  </p>
                </div>
              )}

              {/* Amazon Affiliate Products */}
              <div className="mt-12">
                <AmazonAffiliateBanner 
                  title="Growing & Content Creation Tools"
                  limit={3}
                />
              </div>

              {/* Footer Note */}
              <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Want to suggest an account?</h3>
                <p className="text-gray-600 text-sm">
                  Know of a great cactus or succulent creator we're missing? These recommendations are curated from 
                  active, authentic accounts that provide valuable content to the plant community. Quality and authenticity 
                  are our top priorities.
                </p>
              </div>
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </>
  );
}