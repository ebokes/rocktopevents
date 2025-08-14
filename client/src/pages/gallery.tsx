import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import GalleryItem from "@/components/ui/gallery-item";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const galleryFilters = [
  { id: "all", label: "All Events" },
  { id: "weddings", label: "Weddings" },
  { id: "corporate", label: "Corporate" },
  { id: "social", label: "Social Events" },
  { id: "academic", label: "Academic" },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ["/api/gallery", activeFilter],
    queryFn: async () => {
      const response = await fetch(`/api/gallery${activeFilter !== 'all' ? `?category=${activeFilter}` : ''}`);
      if (!response.ok) throw new Error("Failed to fetch gallery items");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-accent text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="gallery-hero-title">
            Our Portfolio
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Explore our recent events and see how we bring visions to life with creativity and attention to detail.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {galleryFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                onClick={() => setActiveFilter(filter.id)}
                data-testid={`filter-${filter.id}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="w-full h-64 bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12" data-testid="gallery-error">
              <div className="text-red-500 mb-4">Failed to load gallery</div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : galleryItems && galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleryItems.map((item: any) => (
                <GalleryItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="gallery-empty">
              <div className="text-slate-600 mb-4">
                No gallery items found for this category.
              </div>
              <Button onClick={() => setActiveFilter("all")}>
                View All Events
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Featured Events
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Some of our most memorable and successful events that showcase our expertise and creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Featured wedding event"
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Featured
                </Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Elegant Garden Wedding
                </h3>
                <p className="text-slate-600 mb-6">
                  A breathtaking outdoor wedding celebration featuring custom floral arrangements, string lighting, 
                  and a romantic garden setting for 200 guests.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Wedding</Badge>
                  <Badge variant="outline">Outdoor</Badge>
                  <Badge variant="outline">200 Guests</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Featured corporate event"
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Featured
                </Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Tech Summit Conference
                </h3>
                <p className="text-slate-600 mb-6">
                  A high-tech corporate conference with advanced AV setup, professional staging, 
                  and seamless logistics for 500+ attendees.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Corporate</Badge>
                  <Badge variant="outline">Conference</Badge>
                  <Badge variant="outline">500+ Guests</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
