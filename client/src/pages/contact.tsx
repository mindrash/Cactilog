import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title="Contact Cactilog - Get in Touch"
        description="Have questions about Cactilog? Need support or want to provide feedback? Contact our team or connect with the community."
      />
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="page-title-lg mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Contact options are being developed as we continue to improve Cactilog<sup className="text-xs font-bold text-cactus-green">BETA</sup>
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Coming Soon Card */}
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cactus-green/20 to-succulent-green/20 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-cactus-green" />
              </div>
              <CardTitle className="text-2xl">Contact Support Coming Soon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-600 text-lg leading-relaxed">
                We're working on setting up proper support channels for Cactilog. While the platform is in beta development, 
                we're focusing our efforts on building the core features you need to manage your plant collections.
              </p>

              <div className="bg-lime-wash/30 rounded-lg p-6 border border-lime-wash/50">
                <div className="flex items-center justify-center mb-3">
                  <Clock className="h-5 w-5 text-cactus-green mr-2" />
                  <span className="font-semibold text-cactus-green">Coming Soon</span>
                </div>
                <ul className="text-gray-700 space-y-2 text-left max-w-md mx-auto">
                  <li>• Email support system</li>
                  <li>• Bug reporting tools</li>
                  <li>• Community forums</li>
                  <li>• Knowledge base & FAQ</li>
                  <li>• Feature request portal</li>
                </ul>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-4">
                  In the meantime, enjoy exploring Cactilog's collection management features!
                </p>
                <Link href="/">
                  <Button className="bg-cactus-green hover:bg-cactus-green/90">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cactilog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Beta Notice */}
          <Card className="mt-8 border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600 font-medium">Beta Development Phase</span>
              </div>
              <p className="text-sm text-gray-500">
                Cactilog is currently in active development. We're prioritizing core features like 
                collection management, growth tracking, and photo uploads. Support channels will be 
                available as we move toward full release.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}