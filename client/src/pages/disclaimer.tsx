import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Scale, Heart, Leaf } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title="Disclaimer - Cactilog"
        description="Important disclaimers and limitations regarding the use of Cactilog for plant collection management and botanical information."
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="page-title-lg mb-4">Disclaimer</h1>
          <p className="text-lg text-gray-600">
            Important information about using Cactilog
          </p>
          <p className="text-sm text-gray-500 mt-2">Last updated: July 26, 2025</p>
        </div>

        {/* General Disclaimer */}
        <Card className="mb-8 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              General Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              The information provided on Cactilog is for general informational and educational purposes only. 
              While we strive for accuracy, we make no representations or warranties of any kind, express or 
              implied, about the completeness, accuracy, reliability, or suitability of the information contained 
              on this platform.
            </p>
          </CardContent>
        </Card>

        {/* Plant Care Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-green-500" />
              Plant Care & Botanical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Educational Purpose Only</h4>
              <p className="text-gray-600 text-sm">
                All plant care guides, growing tips, and botanical information are provided for educational 
                purposes only. Plant care requirements can vary significantly based on local climate, soil 
                conditions, individual plant health, and other environmental factors.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">No Guarantee of Success</h4>
              <p className="text-gray-600 text-sm">
                Following care instructions or advice found on Cactilog does not guarantee plant health, 
                growth success, or survival. Every plant is unique, and growing conditions vary widely.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Professional Consultation</h4>
              <p className="text-gray-600 text-sm">
                For valuable or rare specimens, or if you're unsure about care requirements, we recommend 
                consulting with local botanical experts, extension services, or experienced growers in your area.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Regulatory */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2 text-blue-500" />
              Legal & Regulatory Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">CITES & Protected Species</h4>
              <p className="text-gray-600 text-sm">
                Many cacti and succulents are protected under CITES (Convention on International Trade in 
                Endangered Species) or local conservation laws. Users are solely responsible for ensuring 
                their collection, cultivation, and any trading activities comply with all applicable laws.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Import/Export Regulations</h4>
              <p className="text-gray-600 text-sm">
                International and interstate movement of plants may require permits, inspections, or be 
                prohibited entirely. Check with appropriate agricultural authorities before acquiring plants 
                from other regions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Local Laws</h4>
              <p className="text-gray-600 text-sm">
                Some plants may be prohibited in certain areas due to invasive species concerns or other 
                local regulations. Research local laws before acquiring new plants.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Disclaimer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Medical & Safety Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">No Medical Advice</h4>
              <p className="text-gray-600 text-sm">
                Cactilog does not provide medical advice or recommendations. Any mention of traditional uses, 
                medicinal properties, or health benefits of plants is for historical and educational interest only.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Safety Precautions</h4>
              <p className="text-gray-600 text-sm">
                Many cacti and succulents have spines, thorns, or toxic properties. Handle plants carefully, 
                wear appropriate protection, and keep potentially harmful plants away from children and pets.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Allergies & Sensitivities</h4>
              <p className="text-gray-600 text-sm">
                Some people may be allergic or sensitive to plant materials, sap, or spines. If you experience 
                any adverse reactions, discontinue handling and seek appropriate medical attention.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User-Generated Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2 text-purple-500" />
              User-Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Community Contributions</h4>
              <p className="text-gray-600 text-sm">
                Information, photos, and advice shared by community members represent personal experiences 
                and opinions. This content has not been professionally verified and should not be considered 
                authoritative botanical or horticultural advice.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Plant Identification</h4>
              <p className="text-gray-600 text-sm">
                Plant identifications provided by users or automated systems may be incorrect. For accurate 
                identification of valuable or potentially dangerous plants, consult with qualified botanists 
                or horticulturists.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Limitations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Platform Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Beta Status</h4>
              <p className="text-gray-600 text-sm">
                Cactilog is currently in beta development. Features may change, data structures may be 
                modified, and service interruptions may occur. While we maintain backups, we recommend 
                keeping your own records of important plant information.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Data Loss</h4>
              <p className="text-gray-600 text-sm">
                Despite our best efforts to maintain data integrity, technical issues, server problems, 
                or other unforeseen circumstances could result in data loss. Regular exports of your 
                collection data are recommended.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">External Links</h4>
              <p className="text-gray-600 text-sm">
                Cactilog may contain links to external websites, vendors, or resources. We are not 
                responsible for the content, practices, or reliability of these external sites.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Vendor & Purchase Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Vendor Recommendations</h4>
              <p className="text-gray-600 text-sm">
                Vendor listings and recommendations are provided for informational purposes. We do not 
                guarantee the quality, reliability, or legitimacy of any vendors, and we are not responsible 
                for transactions between users and vendors.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Amazon Affiliate Links</h4>
              <p className="text-gray-600 text-sm">
                Some product links may be Amazon affiliate links. This means we may earn a small commission 
                from qualifying purchases, at no extra cost to you. This helps support the platform's development.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2 text-red-500" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by law, Cactilog and its operators shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Plant health issues, death, or loss resulting from information on the platform</li>
              <li>Legal issues arising from plant collection, cultivation, or trading</li>
              <li>Losses resulting from data loss, service interruptions, or platform changes</li>
              <li>Any damages arising from vendor transactions or product recommendations</li>
              <li>Injuries or adverse reactions from handling plants</li>
            </ul>
            <p className="text-gray-700">
              Use of Cactilog and any actions taken based on information from the platform are at your own 
              risk and discretion.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}