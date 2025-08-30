import QuoteForm from "@/components/forms/quote-form";
import SEO from "@/components/seo";
import FloatingChat from "@/components/layout/floating-chat";
import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import BlogCard from "@/components/ui/blog-card";
import { Button } from "@/components/ui/button";
import GalleryItem from "@/components/ui/gallery-item";
import ServiceCard from "@/components/ui/service-card";
import VenueCard from "@/components/ui/venue-card";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  GraduationCap,
  Lightbulb,
  Monitor,
  Palette,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const services = [
  {
    id: "planning",
    title: "Event Planning",
    description:
      "Complete event planning from concept to execution. Timeline management, vendor coordination, and logistics planning.",
    icon: Calendar,
    features: [
      "Timeline Development",
      "Vendor Management",
      "Budget Planning",
      "Day-of Coordination",
    ],
    color: "primary",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    id: "decoration",
    title: "Decoration & Design",
    description:
      "Transform your venue with stunning decorations and custom design elements that reflect your style and vision.",
    icon: Palette,
    features: [
      "Floral Arrangements",
      "Theme Development",
      "Custom Backdrops",
      "Table Settings",
    ],
    color: "accent",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    id: "rentals",
    title: "Equipment Rentals",
    description:
      "Premium equipment rentals including furniture, linens, dishes, and specialty items for any event size.",
    icon: Wrench,
    features: [
      "Furniture & Seating",
      "Linens & Tableware",
      "Tents & Structures",
      "Specialty Items",
    ],
    color: "secondary",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    id: "lighting",
    title: "Lighting & Audio",
    description:
      "Professional lighting and sound systems to create the perfect ambiance and ensure crystal clear audio.",
    icon: Lightbulb,
    features: [
      "LED Lighting Systems",
      "Sound Systems",
      "Microphones & AV",
      "DJ Equipment",
    ],
    color: "primary",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    id: "staging",
    title: "Staging & Displays",
    description:
      "Custom staging solutions, LED screens, and display systems for presentations and performances.",
    icon: Monitor,
    features: [
      "Custom Stages",
      "LED Video Walls",
      "Projection Systems",
      "Backdrops & Signage",
    ],
    color: "accent",
    image:
      "https://images.unsplash.com/photo-1556125574-d7f27ec36a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
  {
    id: "academic",
    title: "Academic Events",
    description:
      "Specialized services for academic institutions including graduations, conferences, and educational seminars.",
    icon: GraduationCap,
    features: [
      "Graduation Ceremonies",
      "Academic Conferences",
      "Educational Seminars",
      "Award Ceremonies",
    ],
    color: "secondary",
    image:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
  },
];

export default function Landing() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("all");

  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog"],
  });

  const { data: galleryItems, isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/gallery", galleryFilter],
    queryFn: async () => {
      const response = await fetch(
        `/api/gallery${
          galleryFilter !== "all" ? `?category=${galleryFilter}` : ""
        }`
      );
      if (!response.ok) throw new Error("Failed to fetch gallery items");
      return response.json();
    },
  });

  const { data: venues, isLoading: venuesLoading } = useQuery({
    queryKey: ["/api/venues"],
  });

  const stats = [
    { label: "Events Completed", value: "500+", icon: Calendar },
    { label: "Happy Clients", value: "200+", icon: Users },
    { label: "Years Experience", value: "10+", icon: Star },
    { label: "Team Members", value: "25+", icon: Users },
  ];

  const galleryFilters = [
    { id: "all", label: "All Events" },
    { id: "weddings", label: "Weddings" },
    { id: "corporate", label: "Corporate" },
    { id: "social", label: "Social Events" },
    { id: "academic", label: "Academic" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Event Planning, Decoration, Rentals, Lighting & Staging"
        description="Professional event planning, decoration, rentals, lighting and staging services. Get quotes, explore venues, and plan your perfect event."
        type="website"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-slate-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              data-testid="hero-title"
            >
              Create <span className="text-amber-500">Unforgettable</span>
              <br />
              Events & Experiences
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              data-testid="hero-description"
            >
              From intimate celebrations to grand corporate events, we bring
              your vision to life with professional planning, stunning
              decoration, and premium equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all"
                onClick={() => setShowQuoteForm(true)}
                data-testid="button-get-quote"
              >
                <Link href="/contact">Get Free Quote</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-black hover:bg-white hover:text-slate-800 px-8 py-4 text-lg transform hover:scale-105 transition-all"
                data-testid="button-view-work"
              >
                <Link href="/gallery">View Our Work</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center"
                  data-testid={`stat-${index}`}
                >
                  <div className="text-3xl font-bold text-amber-500">
                    {stat.value}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              data-testid="services-title"
            >
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive event solutions tailored to your needs. From concept
              to completion, we handle every detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Section */}
      {showQuoteForm && (
        <section className="py-20 bg-gray-100" id="quote">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
                data-testid="quote-title"
              >
                Get Your Free Quote
              </h2>
              <p className="text-xl text-slate-600">
                Tell us about your event and we'll provide a customized quote
                within 24 hours.
              </p>
            </div>
            <QuoteForm />
          </div>
        </section>
      )}

      {/* Find Venues Section */}
      <section className="py-20 bg-white" id="venues">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              data-testid="venues-title"
            >
              Find Event Venues
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the perfect venue for your event. Search by location,
              capacity, and amenities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venuesLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">Loading venues...</div>
              </div>
            ) : Array.isArray(venues) && venues.length > 0 ? (
              venues
                .slice(0, 6)
                .map((venue: any) => <VenueCard key={venue.id} venue={venue} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">
                  No venues available at the moment.
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/venues">View All Venues</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-100" id="gallery">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              data-testid="gallery-title"
            >
              Our Portfolio
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore our recent events and see how we bring visions to life
              with creativity and attention to detail.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {galleryFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={galleryFilter === filter.id ? "default" : "outline"}
                onClick={() => setGalleryFilter(filter.id)}
                data-testid={`filter-${filter.id}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {galleryLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">Loading gallery...</div>
              </div>
            ) : galleryItems?.length > 0 ? (
              galleryItems
                .slice(0, 8)
                .map((item: any) => <GalleryItem key={item.id} item={item} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">
                  No gallery items available.
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white" id="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              data-testid="blog-title"
            >
              Latest from Our Blog
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get insights, tips, and inspiration for planning the perfect
              event. Stay updated with the latest trends in event management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">Loading blog posts...</div>
              </div>
            ) : Array.isArray(blogPosts) && blogPosts.length > 0 ? (
              blogPosts
                .slice(0, 6)
                .map((post: any) => <BlogCard key={post.id} post={post} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">No blog posts available.</div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/blog">Read All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating Chat Icons */}
      <FloatingChat />
    </div>
  );
}
