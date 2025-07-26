import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, Lock, Cookie, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title="Privacy Policy - Cactilog"
        description="Learn how Cactilog protects your privacy and handles your plant collection data. Our commitment to transparency and user control."
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="page-title-lg mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-2">
            Your privacy matters to us. Here's how we protect your data.
          </p>
          <p className="text-sm text-gray-500">Last updated: July 26, 2025</p>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Eye className="h-5 w-5 mr-2" />
              Privacy at a Glance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Your plant data is yours</strong> - you control what's public or private</li>
              <li>• <strong>No selling of personal information</strong> - we don't monetize your data</li>
              <li>• <strong>Minimal data collection</strong> - only what's needed for the service</li>
              <li>• <strong>Export anytime</strong> - download your full collection data</li>
              <li>• <strong>Delete anytime</strong> - remove your account and all data</li>
            </ul>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-blue-500" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Account Information</h4>
              <p className="text-gray-600 text-sm mb-2">
                When you sign in through Replit Auth, we receive:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Email address (for account identification)</li>
                <li>Display name (if provided by your OAuth provider)</li>
                <li>Profile picture (if provided by your OAuth provider)</li>
                <li>Authentication provider (Google, GitHub, etc.)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Plant Collection Data</h4>
              <p className="text-gray-600 text-sm mb-2">
                Information you voluntarily provide about your plants:
              </p>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Plant identification (genus, species, custom IDs)</li>
                <li>Growth measurements and observations</li>
                <li>Photos you upload</li>
                <li>Acquisition dates and notes</li>
                <li>Privacy settings for each plant</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Usage Information</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                <li>Pages visited and features used (for improving the platform)</li>
                <li>Browser type and device information</li>
                <li>Session data (stored securely in our database)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Service Provision</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Maintain your plant collection</li>
                  <li>Generate growth analytics</li>
                  <li>Enable photo storage and display</li>
                  <li>Facilitate community features</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Platform Improvement</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Analyze usage patterns (anonymized)</li>
                  <li>Debug technical issues</li>
                  <li>Develop new features</li>
                  <li>Optimize performance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-purple-500" />
              Data Sharing & Privacy Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">What's Public vs Private</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="font-medium text-green-600">Public by default:</span>
                  <span className="text-gray-600 text-sm ml-2">Plant listings in community feed (you can change this)</span>
                </div>
                <div>
                  <span className="font-medium text-red-600">Always private:</span>
                  <span className="text-gray-600 text-sm ml-2">Email address, personal notes, acquisition costs</span>
                </div>
                <div>
                  <span className="font-medium text-blue-600">Your choice:</span>
                  <span className="text-gray-600 text-sm ml-2">Individual plant visibility, collection browsing</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">We Never Share With Third Parties</h4>
              <p className="text-gray-600 text-sm">
                We do not sell, rent, or share your personal information with advertisers, data brokers, 
                or other third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Legal Requirements</h4>
              <p className="text-gray-600 text-sm">
                We may disclose information only if required by law enforcement with proper legal process, 
                or to protect the safety of our users or platform integrity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2 text-red-500" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Technical Safeguards</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Secure PostgreSQL database with access controls</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Secure session management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Access Controls</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>OAuth-based authentication (no passwords stored)</li>
                  <li>Limited administrative access</li>
                  <li>Audit logging of data access</li>
                  <li>Secure backup procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cookie className="h-5 w-5 mr-2 text-orange-500" />
              Cookies & Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800">Essential Cookies</h4>
                <p className="text-gray-600 text-sm">
                  Session cookies required for authentication and basic functionality. These cannot be disabled.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">No Tracking Cookies</h4>
                <p className="text-gray-600 text-sm">
                  We do not use analytics cookies, advertising trackers, or third-party tracking scripts during beta.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Your Rights & Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Data Access</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>View all your data anytime in the platform</li>
                  <li>Export your collection in multiple formats</li>
                  <li>Request a complete data archive</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Data Control</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Edit or delete any plant record</li>
                  <li>Change privacy settings anytime</li>
                  <li>Delete your entire account and data</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-500" />
              Questions About Privacy?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about this privacy policy or how we handle your data, please contact us:
            </p>
            <div className="space-y-2">
              <div>
                <strong>Email:</strong> <a href="mailto:privacy@cactilog.app" className="text-cactus-green hover:underline">privacy@cactilog.app</a>
              </div>
              <div>
                <strong>Response time:</strong> <span className="text-gray-600">Within 5 business days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}