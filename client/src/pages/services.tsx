import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingChat from "@/components/layout/floating-chat";
import ServiceCard from "@/components/ui/service-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Palette,
  Wrench,
  Lightbulb,
  Monitor,
  GraduationCap,
  CheckCircle,
  Star,
  Users,
} from "lucide-react";

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

const processSteps = [
  {
    step: 1,
    title: "Consultation",
    description:
      "We start with understanding your vision, requirements, and budget to create a customized plan.",
  },
  {
    step: 2,
    title: "Planning",
    description:
      "Our team develops detailed timelines, vendor coordination, and logistics management.",
  },
  {
    step: 3,
    title: "Execution",
    description:
      "We handle all aspects of your event, ensuring everything runs smoothly on the day.",
  },
  {
    step: 4,
    title: "Follow-up",
    description:
      "After your event, we follow up to ensure satisfaction and gather feedback for future improvements.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "Tech Innovations Inc.",
    text: "ROCKTOP made our corporate retreat absolutely perfect. Their attention to detail and professional service exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Michael & Emma Rodriguez",
    company: "Wedding Couple",
    text: "Our dream wedding became reality thanks to ROCKTOP. They handled everything so professionally, allowing us to enjoy our special day.",
    rating: 5,
  },
  {
    name: "Dr. Patricia Wong",
    company: "University of Excellence",
    text: "The graduation ceremony was flawless. ROCKTOP's academic event expertise really showed in their seamless execution.",
    rating: 5,
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            data-testid="services-hero-title"
          >
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Comprehensive event solutions designed to bring your vision to life
            with excellence and attention to detail.
          </p>
          <Button size="lg" variant="primary" data-testid="button-get-quote">
            Get Free Consultation
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              data-testid="process-title"
            >
              Our Process
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We follow a proven process to ensure your event is perfectly
              planned and executed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card
                key={step.step}
                className="text-center relative"
                data-testid={`process-step-${step.step}`}
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{step.description}</p>
                </CardContent>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-purple-300"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
                data-testid="why-choose-title"
              >
                Why Choose ROCKTOP?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                With years of experience and a passion for creating memorable
                events, we're your trusted partner for any occasion.
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Professional Expertise
                    </h3>
                    <p className="text-slate-600">
                      Our experienced team brings years of industry knowledge to
                      every event.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Full-Service Solutions
                    </h3>
                    <p className="text-slate-600">
                      From planning to execution, we handle every detail of your
                      event.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Customized Approach
                    </h3>
                    <p className="text-slate-600">
                      Every event is unique, and we tailor our services to match
                      your vision.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle className="text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Reliable Partnership
                    </h3>
                    <p className="text-slate-600">
                      We're committed to delivering excellence and building
                      lasting relationships.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Event planning team at work"
                className="rounded-2xl shadow-2xl"
                data-testid="why-choose-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold text-slate-800 mb-6"
              data-testid="testimonials-title"
            >
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients
              have to say about working with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="text-center"
                data-testid={`testimonial-${index}`}
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            data-testid="cta-title"
          >
            Ready to Plan Your Perfect Event?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Let our experienced team help you create an unforgettable
            experience. Get your free consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="primary"
              data-testid="button-get-consultation"
            >
              Get Free Consultation
            </Button>
            <Button
              size="lg"
              variant="primary"
              data-testid="button-view-portfolio"
            >
              View Our Portfolio
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
