import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import Rocktop from "../../../assets/rocktop-img3.webp";
import RocktopLogo3 from "../../../assets/rocktop-logo4.webp";

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
    { name: "Get Quote", href: "/contact" },
    { name: "Find Venues", href: "/venues" },
    { name: "Portfolio", href: "/gallery" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: faFacebookF,
      href: "https://www.facebook.com/Rocktopevents/",
    },
    {
      name: "Instagram",
      icon: faInstagram,
      href: "https://www.instagram.com/rocktopevents/",
    },
    {
      name: "X",
      icon: faXTwitter,
      href: "https://x.com/Rocktop_events",
    },
    {
      name: "Pinterest",
      icon: faPinterest,
      href: "https://www.pinterest.com/rocktopevents/",
    },
  ];

  return (
    <footer className="bg-slate-800 text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            {/* <div className="mb-6">
              <span className="text-3xl font-bold text-purple-400">
                ROCKTOP
              </span>
              <span className="text-lg text-gray-300 block -mt-1">
                PREMIUM EVENTS
              </span>
            </div> */}
            <div className="flex items-center mb-6">
              <Link href="/" data-testid="logo">
                <div className="flex space-x-2 items-stretch">
                  <img
                    src={RocktopLogo3}
                    className="w-16 h-14 mt-1"
                    alt="Rocktop Logo"
                    style={{ maxWidth: "100%" }}
                  />
                  <div className="flex flex-col">
                    <img
                      src={Rocktop}
                      className="mt-1 w-24"
                      alt="rocktop img"
                      style={{ maxWidth: "100%" }}
                    />
                    <span className="text-sm text-slate-200 min-w-[110px]">
                      Premium Events
                    </span>
                  </div>
                </div>
              </Link>
            </div>
            <p className="text-gray-300 mb-6">
              Creating unforgettable events and experiences with professional
              planning, stunning decoration, and premium equipment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-xl" />
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
                    data-testid={`service-link-${service
                      .toLowerCase()
                      .replace(/[^a-z0-9]/g, "-")}`}
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
                    data-testid={`quick-link-${link.name
                      .toLowerCase()
                      .replace(" ", "-")}`}
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
                  4 Amawbia bypass,
                  <br />
                  Opposite Jezco Petrol Station,
                  <br />
                  Awka, Anambra State.
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-phone text-purple-400 mr-3"></i>
                  <span className="text-gray-300">Phone</span>
                </div>
                <p className="text-gray-400 ml-6" data-testid="contact-phone">
                  (+234) 813 6842 241
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <i className="fas fa-envelope text-purple-400 mr-3"></i>
                  <span className="text-gray-300">Email</span>
                </div>
                <p className="text-gray-400 ml-6" data-testid="contact-email">
                  rocktopevents@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm" data-testid="copyright">
              &copy; 2025 ROCKTOP PREMIUM EVENTS. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                data-testid="privacy-link"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                data-testid="terms-link"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-purple-400 text-sm transition-colors"
                data-testid="cookie-link"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
