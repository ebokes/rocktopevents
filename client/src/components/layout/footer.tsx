import { Link } from "wouter";

export default function Footer() {
  const services = [
    "Event Planning",
    "Decoration & Design",
    "Equipment Rentals",
    "Lighting & Audio",
    "Staging & Displays",
    "Academic Events",
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Get Quote", href: "#quote" },
    { name: "Find Venues", href: "/venues" },
    { name: "Portfolio", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "facebook-f", href: "#" },
    { name: "Instagram", icon: "instagram", href: "#" },
    { name: "Twitter", icon: "twitter", href: "#" },
    { name: "LinkedIn", icon: "linkedin-in", href: "#" },
  ];

  return (
    <footer className="bg-slate-800 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-purple-400">ROCKTOP</span>
              <span className="text-lg text-gray-300 block -mt-1">PREMIUM EVENTS</span>
            </div>
            <p className="text-gray-300 mb-6">
              Creating unforgettable events and experiences with professional planning, stunning decoration, and premium equipment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <i className={`fab fa-${social.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link 
                    href="/services" 
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                    data-testid={`service-link-${service.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-purple-400 transition-colors"
                    data-testid={`quick-link-${link.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-map-marker-alt text-purple-400 mr-3"></i>
                  <span className="text-gray-300">Office Location</span>
                </div>
                <p className="text-gray-400 ml-6" data-testid="contact-address">
                  123 Event Plaza, Suite 456<br />
                  Downtown City, ST 12345
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-phone text-purple-400 mr-3"></i>
                  <span className="text-gray-300">Phone</span>
                </div>
                <p className="text-gray-400 ml-6" data-testid="contact-phone">(555) 123-4567</p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-envelope text-purple-400 mr-3"></i>
                  <span className="text-gray-300">Email</span>
                </div>
                <p className="text-gray-400 ml-6" data-testid="contact-email">info@rocktoppremium.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm" data-testid="copyright">
              &copy; 2024 ROCKTOP PREMIUM EVENTS. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors" data-testid="privacy-link">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors" data-testid="terms-link">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors" data-testid="cookie-link">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
