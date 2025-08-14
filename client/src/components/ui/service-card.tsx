import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    icon: any;
    features: string[];
    color: string;
    image: string;
  };
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  
  const colorVariants = {
    primary: "bg-purple-600",
    secondary: "bg-amber-500",
    accent: "bg-pink-500",
  };

  const hoverColorVariants = {
    primary: "hover:bg-purple-700",
    secondary: "hover:bg-amber-600",
    accent: "hover:bg-pink-600",
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden" data-testid={`service-card-${service.id}`}>
      <div className="relative">
        <div 
          className="h-64 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300" />
      </div>
      
      <CardContent className="p-8">
        <div className="flex items-center mb-4">
          <div className={`${colorVariants[service.color as keyof typeof colorVariants]} bg-opacity-10 p-3 rounded-lg mr-4`}>
            <Icon className={`text-2xl ${
              service.color === 'primary' ? 'text-purple-600' :
              service.color === 'secondary' ? 'text-amber-500' :
              'text-pink-500'
            }`} />
          </div>
          <CardTitle className="text-2xl text-slate-800">{service.title}</CardTitle>
        </div>
        
        <p className="text-slate-600 mb-6">{service.description}</p>
        
        <ul className="text-sm text-slate-600 mb-6 space-y-2">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="text-green-500 mr-2 h-4 w-4" />
              {feature}
            </li>
          ))}
        </ul>
        
        <Button 
          className={`w-full ${colorVariants[service.color as keyof typeof colorVariants]} ${hoverColorVariants[service.color as keyof typeof hoverColorVariants]} text-white font-semibold transition-colors`}
          data-testid={`button-learn-more-${service.id}`}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
}
