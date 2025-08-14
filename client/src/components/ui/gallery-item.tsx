import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface GalleryItemProps {
  item: {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    eventType?: string;
  };
}

export default function GalleryItem({ item }: GalleryItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <div 
      className="group cursor-pointer relative overflow-hidden rounded-xl shadow-lg"
      data-testid={`gallery-item-${item.id}`}
    >
      <div className="relative">
        <img 
          src={item.imageUrl}
          alt={item.title}
          className={`w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          data-testid={`gallery-image-${item.id}`}
        />
        {!imageLoaded && (
          <div className="w-full h-64 bg-gray-200 animate-pulse" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
          <div className="p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Badge className="mb-2" variant="secondary">{item.category}</Badge>
            <h4 className="font-semibold text-lg mb-1" data-testid={`gallery-title-${item.id}`}>
              {item.title}
            </h4>
            {item.description && (
              <p className="text-sm" data-testid={`gallery-description-${item.id}`}>
                {item.description}
              </p>
            )}
            {item.eventType && (
              <p className="text-sm opacity-75" data-testid={`gallery-event-type-${item.id}`}>
                {item.eventType}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
