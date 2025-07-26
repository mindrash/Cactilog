import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, Users, Shield, Copyright, Scale } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title="Terms of Service - Cactilog"
        description="Terms of service and user agreement for Cactilog, the cactus and succulent collection management platform."
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="page-title-lg mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 mb-2">
            User Agreement for Cactilog Platform
          </p>
          <p className="text-sm text-gray-500">Last updated: July 26, 2025</p>
        </div>

        {/* Beta Notice */}
        <Card className="mb-8 border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Beta Platform Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Cactilog is currently in beta development. By using this platform, you acknowledge that 
              features may change, new functionality may be added, and occasional service interruptions 
              may occur as we improve the platform. We appreciate your understanding and feedback during 
              this development phase.
            </p>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              By accessing or using Cactilog, you agree to be bound by these Terms of Service and our 
              Privacy Policy. If you disagree with any part of these terms, you may not access the service.
            </p>
            <p className="text-gray-700">
              These terms apply to all visitors, users, and others who access or use the service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-green-500" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Cactilog provides a platform for cactus and succulent enthusiasts to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Document and track plant collections</li>
              <li>Monitor plant growth and health over time</li>
              <li>Share photos and information with the community</li>
              <li>Access educational content about cacti and succulents</li>
              <li>Connect with other plant enthusiasts</li>
            </ul>
            <p className="text-gray-700 mt-4">
              The service is provided "as is" during the beta period, with continuous improvements and updates.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-purple-500" />
              User Accounts & Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Account Creation</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>You must provide accurate information when creating an account</li>
                <li>You are responsible for maintaining account security</li>
                <li>One account per person; no sharing accounts</li>
                <li>You must be 13 years or older to use this service</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Acceptable Use</h4>
              <p className="text-gray-600 text-sm mb-2">You agree not to:</p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Upload inappropriate, offensive, or copyrighted content</li>
                <li>Attempt to interfere with or disrupt the service</li>
                <li>Create false or misleading plant information</li>
                <li>Spam or harass other users</li>
                <li>Violate any laws regarding plant collection or trade</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Content Responsibility</h4>
              <p className="text-gray-600 text-sm">
                You are solely responsible for all content you upload, including photos, descriptions, 
                and other information. Ensure you have rights to any content you share and that it 
                complies with applicable laws.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Plant Information Disclaimer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Plant Information Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Educational Purpose Only</h4>
                <p className="text-gray-600 text-sm">
                  All plant care information, growing guides, and botanical data are provided for 
                  educational purposes only. We are not responsible for plant health outcomes based 
                  on information from our platform.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Legal Compliance</h4>
                <p className="text-gray-600 text-sm">
                  Users are responsible for ensuring their plant collection and any trading activities 
                  comply with local, state, and federal laws. Some cacti may be protected species or 
                  subject to CITES regulations.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">No Medicinal Claims</h4>
                <p className="text-gray-600 text-sm">
                  Cactilog does not provide medical advice or endorse any medicinal uses of plants. 
                  Consult healthcare professionals for any health-related questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Copyright className="h-5 w-5 mr-2 text-indigo-500" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Your Content</h4>
              <p className="text-gray-600 text-sm">
                You retain ownership of all content you upload. By sharing content publicly, you grant 
                Cactilog a non-exclusive license to display, distribute, and use that content within 
                the platform and for promotional purposes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Platform Content</h4>
              <p className="text-gray-600 text-sm">
                The Cactilog platform, including its design, features, and original content, is 
                protected by copyright and other intellectual property laws. You may not copy, 
                modify, or redistribute our platform or content without permission.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Botanical Information</h4>
              <p className="text-gray-600 text-sm">
                Botanical classifications and species information are derived from scientific sources 
                and public domain materials. We respect the intellectual property of researchers and 
                cite sources where applicable.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2 text-blue-500" />
              Service Availability & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Beta Limitations</h4>
              <p className="text-gray-600 text-sm">
                During beta, service availability may be interrupted for updates, maintenance, or 
                improvements. We will provide reasonable notice when possible but cannot guarantee 
                uninterrupted service.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Data Backup</h4>
              <p className="text-gray-600 text-sm">
                While we maintain regular backups, you are encouraged to export your collection data 
                regularly. We recommend keeping your own records of important plant information.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Feature Changes</h4>
              <p className="text-gray-600 text-sm">
                We may add, modify, or remove features during beta development. We will attempt to 
                provide notice of significant changes that affect existing functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-red-500" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by law, Cactilog shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Loss of data or plant collection information</li>
              <li>Plant health issues or losses</li>
              <li>Business interruption or lost profits</li>
              <li>Any damages arising from use of the service</li>
            </ul>
            <p className="text-gray-700">
              Our total liability in any matter arising out of or related to these terms is limited 
              to the amount you paid to use our service (currently $0 during beta).
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800">By You</h4>
                <p className="text-gray-600 text-sm">
                  You may delete your account at any time through your settings page. This will 
                  permanently remove all your data from our servers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">By Us</h4>
                <p className="text-gray-600 text-sm">
                  We may suspend or terminate accounts that violate these terms, engage in harmful 
                  behavior, or for other legitimate reasons. We will provide notice when possible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. We will notify users of material 
              changes via email or platform notification. Your continued use of the service after 
              changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <div>
                <strong>Email:</strong> <a href="mailto:legal@cactilog.app" className="text-cactus-green hover:underline">legal@cactilog.app</a>
              </div>
              <div>
                <strong>Support:</strong> <a href="mailto:support@cactilog.app" className="text-cactus-green hover:underline">support@cactilog.app</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}