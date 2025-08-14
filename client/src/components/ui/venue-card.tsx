import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, DollarSign } from "lucide-react";

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    description?: string;
    address: string;
    city: string;
    state: string;
    capacity: number;
    pricePerDay: string;
    amenities?: string[];
    images?: string[];
    rating: string;
    reviewCount: number;
  };
}

export default function VenueCard({ venue }: VenueCardProps) {
  const mainImage = venue.images?.[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600';
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" data-testid={`venue-card-${venue.id}`}>
      <div className="relative">
        <img 
          src={mainImage}
          alt={venue.name}
          className="w-full h-48 object-cover"
          data-testid={`venue-image-${venue.id}`}
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-slate-800 flex-1" data-testid={`venue-name-${venue.id}`}>
            {venue.name}
          </h3>
          <div className="flex items-center text-sm">
            <div className="flex text-yellow-400 mr-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(parseFloat(venue.rating)) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-slate-600" data-testid={`venue-rating-${venue.id}`}>
              {venue.rating} ({venue.reviewCount})
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-slate-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span data-testid={`venue-location-${venue.id}`}>{venue.city}, {venue.state}</span>
        </div>
        
        <div className="flex items-center text-sm text-slate-600 mb-4">
          <Users className="h-4 w-4 mr-1" />
          <span data-testid={`venue-capacity-${venue.id}`}>Up to {venue.capacity} guests</span>
        </div>
        
        {venue.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2" data-testid={`venue-description-${venue.id}`}>
            {venue.description}
          </p>
        )}
        
        {venue.amenities && venue.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {venue.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {venue.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{venue.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-purple-600 font-semibold">
            <DollarSign className="h-4 w-4 mr-1" />
            <span data-testid={`venue-price-${venue.id}`}>From ${venue.pricePerDay}/day</span>
          </div>
          <Button size="sm" data-testid={`button-view-venue-${venue.id}`}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
