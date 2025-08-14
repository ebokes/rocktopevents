import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import QuoteForm from "@/components/forms/quote-form";
import ServiceCard from "@/components/ui/service-card";
import GalleryItem from "@/components/ui/gallery-item";
import BlogCard from "@/components/ui/blog-card";
import VenueCard from "@/components/ui/venue-card";
import Chatbot from "@/components/ui/chatbot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Palette, Wrench, Lightbulb, Monitor, GraduationCap, Star, MapPin, Users, DollarSign } from "lucide-react";

const services = [
  {
    id: "planning",
    title: "Event Planning",
    description: "Complete event planning from concept to execution. Timeline management, vendor coordination, and logistics planning.",
    icon: Calendar,
    features: ["Timeline Development", "Vendor Management", "Budget Planning", "Day-of Coordination"],
    color: "primary",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "decoration",
    title: "Decoration & Design",
    description: "Transform your venue with stunning decorations and custom design elements that reflect your style and vision.",
    icon: Palette,
    features: ["Floral Arrangements", "Theme Development", "Custom Backdrops", "Table Settings"],
    color: "accent",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "rentals",
    title: "Equipment Rentals",
    description: "Premium equipment rentals including furniture, linens, dishes, and specialty items for any event size.",
    icon: Wrench,
    features: ["Furniture & Seating", "Linens & Tableware", "Tents & Structures", "Specialty Items"],
    color: "secondary",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "lighting",
    title: "Lighting & Audio",
    description: "Professional lighting and sound systems to create the perfect ambiance and ensure crystal clear audio.",
    icon: Lightbulb,
    features: ["LED Lighting Systems", "Sound Systems", "Microphones & AV", "DJ Equipment"],
    color: "primary",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "staging",
    title: "Staging & Displays",
    description: "Custom staging solutions, LED screens, and display systems for presentations and performances.",
    icon: Monitor,
    features: ["Custom Stages", "LED Video Walls", "Projection Systems", "Backdrops & Signage"],
    color: "accent",
    image: "https://images.unsplash.com/photo-1556125574-d7f27ec36a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  },
  {
    id: "academic",
    title: "Academic Events",
    description: "Specialized services for academic institutions including graduations, conferences, and educational seminars.",
    icon: GraduationCap,
    features: ["Graduation Ceremonies", "Academic Conferences", "Educational Seminars", "Award Ceremonies"],
    color: "secondary",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
  }
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
      const response = await fetch(`/api/gallery${galleryFilter !== 'all' ? `?category=${galleryFilter}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch gallery items');
      return response.json();
    },
  });

  const { data: venues, isLoading: venuesLoading } = useQuery({
    queryKey: ["/api/venues"],
  });

  const stats = [
    { label: "Events Completed", value: "500+", icon: Calendar },
    { label: "Happy Clients", value: "200+", icon: Users },
    { label: "Years Experience", value: "8", icon: Star },
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
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-slate-800 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Create <span className="text-amber-500">Unforgettable</span><br/>
              Events & Experiences
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto" data-testid="hero-description">
              From intimate celebrations to grand corporate events, we bring your vision to life with professional planning, stunning decoration, and premium equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg transform hover:scale-105 transition-all"
                onClick={() => setShowQuoteForm(true)}
                data-testid="button-get-quote"
              >
                Get Free Quote
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 text-lg"
                data-testid="button-view-work"
              >
                <Link href="#gallery">View Our Work</Link>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <div className="text-3xl font-bold text-amber-500">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <Chatbot />
          <Button
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
            data-testid="button-whatsapp"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.688"/>
            </svg>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6" data-testid="services-title">Our Services</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive event solutions tailored to your needs. From concept to completion, we handle every detail.
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
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6" data-testid="quote-title">Get Your Free Quote</h2>
              <p className="text-xl text-slate-600">Tell us about your event and we'll provide a customized quote within 24 hours.</p>
            </div>
            <QuoteForm />
          </div>
        </section>
      )}

      {/* Find Venues Section */}
      <section className="py-20 bg-white" id="venues">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6" data-testid="venues-title">Find Event Venues</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the perfect venue for your event. Search by location, capacity, and amenities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venuesLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">Loading venues...</div>
              </div>
            ) : venues?.length > 0 ? (
              venues.slice(0, 6).map((venue: any) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">No venues available at the moment.</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6" data-testid="gallery-title">Our Portfolio</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore our recent events and see how we bring visions to life with creativity and attention to detail.
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
              galleryItems.slice(0, 8).map((item: any) => (
                <GalleryItem key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">No gallery items available.</div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6" data-testid="blog-title">Latest from Our Blog</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get insights, tips, and inspiration for planning the perfect event. Stay updated with the latest trends in event management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogLoading ? (
              <div className="col-span-full text-center py-8">
                <div className="text-slate-600">Loading blog posts...</div>
              </div>
            ) : blogPosts?.length > 0 ? (
              blogPosts.slice(0, 6).map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))
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
    </div>
  );
}
