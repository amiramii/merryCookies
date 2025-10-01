import Link from "next/link"
import Image from "next/image";
import {
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#ffecc09d] text-white mt-auto relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[#e39fac] rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#e39fac] rounded-full translate-x-12 translate-y-12"></div>
      </div>

      <div className="container mx-auto px-10 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="mb-4">
                <Image
                  src="/cookiesLogo.png"
                  alt=" Merry Cookies Logo"
                  width={250}
                  height={250}
                  className="h-auto w-auto max-w-[250px] max-h-[250px]"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-semibold mb-6 text-[#e39fac] border-b border-[#e39fac] pb-2 inline-block">
              Navigation
            </h4>
            <nav className="space-y-4">
              <Link
                href="/#home"
                className="block text-[#45302b] hover:text-[#e39fac] transition-all duration-300 hover:translate-x-1"
              >
                Home
              </Link>
              <Link
                href="/#about"
                className="block text-[#45302b] hover:text-[#e39fac] transition-all duration-300 hover:translate-x-1"
              >
                About
              </Link>
              <Link
                href="/#menu"
                className="block text-[#45302b] hover:text-[#e39fac] transition-all duration-300 hover:translate-x-1"
              >
                Menu
              </Link>
              
            </nav>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-semibold mb-6 text-[#e39fac] border-b border-[#e39fac] pb-2 inline-block">
              Get in Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#e39fac] mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href="mailto:email@gmail.com"
                    className="text-[#45302b] hover:text-[#e39fac] transition-colors duration-300 block"
                  >
                    email@gmail.com
                  </a>
                  <span className="text-black text-sm">
                    Email us anytime
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#e39fac] mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=3+bis+rue+Brauhauban+Tarbes+France"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#45302b] hover:text-[#e39fac] transition-colors duration-300 block"
                  >
                    3 bis rue Brauhauban, Tarbes
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#e39fac] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[#45302b] text-sm leading-relaxed">
                    <span className="block font-medium">
                      Tuesday to Saturday: 10am to 6pm
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-semibold mb-6 text-[#e39fac] border-b border-[#e39fac] pb-2 inline-block">
              Stay Connected
            </h4>

            {/* Social Media */}
            <div className="mb-6">
              <p className="text-[#45302b] text-sm mb-4">
                Follow us for updates and delicious content
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/merrycookiestarbes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#45302b] hover:bg-[#e39fac] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/merrycookiestarbes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#45302b] hover:bg-[#e39fac] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@merrycookiestarbes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#45302b] hover:bg-[#e39fac] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-8 border-t border-[#45302b]">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-black text-sm">
              <p>
                © {new Date().getFullYear()} Merry Cookies. All rights
                reserved.
              </p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Serving with love worldwide</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-black hover:text-[#e39fac] transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-black hover:text-[#e39fac] transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-black hover:text-[#e39fac] transition-colors duration-300"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
