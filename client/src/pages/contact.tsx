import { SEO } from "@/components/seo";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Bug, Heart, Github, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-wash/20 to-pine-mist/30 cactus-pattern-bg">
      <SEO 
        title="Contact Cactilog - Get in Touch"
        description="Have questions about Cactilog? Need support or want to provide feedback? Contact our team or connect with the community."
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="page-title-lg mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you! Get in touch with questions, feedback, or suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us more about your question or feedback..."
                    rows={5}
                  />
                </div>
                <Button className="w-full bg-cactus-green hover:bg-cactus-green/90">
                  Send Message
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4">
                We typically respond within 24-48 hours during beta development.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Direct Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-green-500" />
                  Direct Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">General Support</h4>
                  <a href="mailto:support@cactilog.app" className="text-cactus-green hover:underline">
                    support@cactilog.app
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Feedback & Suggestions</h4>
                  <a href="mailto:feedback@cactilog.app" className="text-cactus-green hover:underline">
                    feedback@cactilog.app
                  </a>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Technical Issues</h4>
                  <a href="mailto:tech@cactilog.app" className="text-cactus-green hover:underline">
                    tech@cactilog.app
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Bug Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bug className="h-5 w-5 mr-2 text-orange-500" />
                  Report a Bug
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Found a bug? Help us improve Cactilog by reporting issues on our GitHub repository.
                </p>
                <a 
                  href="https://github.com/cactilog/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cactus-green hover:underline"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Report on GitHub
                </a>
              </CardContent>
            </Card>

            {/* Community */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Join the Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with fellow enthusiasts and get help from the community.
                </p>
                <div className="space-y-2">
                  <a href="https://discord.gg/cactilog" className="block text-cactus-green hover:underline">
                    Discord Server (Coming Soon)
                  </a>
                  <a href="https://reddit.com/r/cactilog" className="block text-cactus-green hover:underline">
                    Reddit Community (Coming Soon)
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Response Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Response Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technical Issues:</span>
                    <span className="font-medium">24-48 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">General Support:</span>
                    <span className="font-medium">1-3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feature Requests:</span>
                    <span className="font-medium">1 week</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Response times may vary during beta development phase.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Is Cactilog free to use?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! Cactilog is completely free during beta and will remain free for core features.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Can I export my collection data?</h4>
                <p className="text-gray-600 text-sm">
                  Absolutely! Export your data in CSV, Excel, or PDF formats anytime.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How do I make my collection private?</h4>
                <p className="text-gray-600 text-sm">
                  Visit Settings to control collection privacy and individual plant visibility.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">When will mobile apps be available?</h4>
                <p className="text-gray-600 text-sm">
                  Mobile apps are planned for 2025. The web version works great on mobile browsers!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}