import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingChat from "@/components/layout/floating-chat";
import VenueCard from "@/components/ui/venue-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Users, Filter } from "lucide-react";
import SEO from "@/components/seo";

interface VenueFilters {
  location: string;
  capacity: string;
  eventType: string;
}

export default function Venues() {
  const [filters, setFilters] = useState<VenueFilters>({
    location: "",
    capacity: "",
    eventType: "",
  });

  const { data: venues, isLoading, error } = useQuery({
    queryKey: ["/api/venues", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.location) params.append("city", filters.location);
      if (filters.capacity && filters.capacity !== "any") params.append("capacity", filters.capacity);
      if (filters.eventType && filters.eventType !== "any") params.append("eventType", filters.eventType);
      
      const response = await fetch(`/api/venues?${params}`);
      if (!response.ok) throw new Error("Failed to fetch venues");
      return response.json();
    },
  });

  const handleFilterChange = (key: keyof VenueFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ location: "", capacity: "", eventType: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Event Venues — Find the Perfect Venue"
        description="Discover and filter venues by location, capacity, and event type to find the perfect space for your event."
        type="website"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-accent text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="venues-hero-title">
            Find Your Perfect Venue
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Discover amazing venues for your event. Search by location, capacity, and amenities to find the perfect space.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg" data-testid="venue-filters">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="City, state, or zip code"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
                    className="pl-10"
                    data-testid="filter-location"
                  />
                </div>
                
                <Select value={filters.capacity} onValueChange={(value) => handleFilterChange("capacity", value)}>
                  <SelectTrigger data-testid="filter-capacity">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Any capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any capacity</SelectItem>
                    <SelectItem value="1-50">1-50 guests</SelectItem>
                    <SelectItem value="51-100">51-100 guests</SelectItem>
                    <SelectItem value="101-200">101-200 guests</SelectItem>
                    <SelectItem value="201-500">201-500 guests</SelectItem>
                    <SelectItem value="500+">500+ guests</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filters.eventType} onValueChange={(value) => handleFilterChange("eventType", value)}>
                  <SelectTrigger data-testid="filter-event-type">
                    <SelectValue placeholder="Any event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any event type</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="social">Social Event</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="flex-1"
                    data-testid="button-clear-filters"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800" data-testid="venues-results-title">
              Available Venues
            </h2>
            {venues && (
              <span className="text-slate-600" data-testid="venues-count">
                {venues.length} venues found
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12" data-testid="venues-error">
              <div className="text-red-500 mb-4">Failed to load venues</div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : venues && venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {venues.map((venue: any) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="venues-empty">
              <div className="text-slate-600 mb-4">
                No venues found matching your criteria.
              </div>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Venues Map View
          </h2>
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center text-slate-600">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Google Maps integration shows venue locations</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Floating Chat Icons */}
      <FloatingChat />
    </div>
  );
}
