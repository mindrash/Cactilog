import { Link } from "wouter";
import logoImage from "@/assets/cactilog-logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logoImage} 
                alt="Cactilog Logo" 
                className="w-8 h-8"
              />
              <div>
                <span className="text-xl font-bold text-white">
                  <span className="text-green-400">Cacti</span><span className="text-green-300">log</span>
                </span>
                <span className="text-xs bg-green-600 text-yellow-200 px-1.5 py-0.5 rounded ml-1">BETA</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              The complete platform for cactus and succulent enthusiasts. Track, grow, and connect with fellow collectors.
            </p>
            <p className="text-xs text-gray-500">
              Made with 🌵 for plant lovers everywhere
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/collection" className="hover:text-green-400 transition-colors">My Collection</Link></li>
              <li><Link href="/growth-tracking" className="hover:text-green-400 transition-colors">Growth Tracking</Link></li>
              <li><Link href="/knowledge" className="hover:text-green-400 transition-colors">Knowledge Base</Link></li>
              <li><Link href="/photos" className="hover:text-green-400 transition-colors">Photo Gallery</Link></li>
              <li><Link href="/community" className="hover:text-green-400 transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/knowledge/vendors" className="hover:text-green-400 transition-colors">Vendor Directory</Link></li>
              <li><Link href="/knowledge/care-guides" className="hover:text-green-400 transition-colors">Care Guides</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition-colors">About Cactilog</Link></li>
              <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link></li>
              <li><a href="https://github.com/cactilog" className="hover:text-green-400 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-green-400 transition-colors">Disclaimer</Link></li>
              <li><a href="mailto:support@cactilog.app" className="hover:text-green-400 transition-colors">Report Issue</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © {currentYear} Cactilog. All rights reserved. Made with care for the botanical community.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Version 1.0-beta</span>
            <span>•</span>
            <span>Last updated: July 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}