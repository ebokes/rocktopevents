import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingChat from "@/components/layout/floating-chat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, HeartHandshake, Sparkles, Users2 } from "lucide-react";
import SEO from "@/components/seo";

export default function About() {
  const values = [
    {
      icon: Sparkles,
      title: "Creativity",
      desc: "Fresh ideas and custom designs that bring every event to life.",
    },
    {
      icon: CheckCircle,
      title: "Excellence",
      desc: "Relentless attention to detail from planning to execution.",
    },
    {
      icon: HeartHandshake,
      title: "Trust",
      desc: "Transparent communication and reliable delivery, every time.",
    },
    {
      icon: Users2,
      title: "Partnership",
      desc: "We collaborate closely to realize your vision and goals.",
    },
  ];

  const stats = [
    { label: "Events Delivered", value: "500+" },
    { label: "Client Satisfaction", value: "98%" },
    { label: "Years Experience", value: "10+" },
    { label: "Team Members", value: "25+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Us — ROCKTOP Premium Events"
        description="Learn about ROCKTOP Premium Events: our mission, values, and team dedicated to crafting unforgettable experiences."
        type="website"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-accent text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521336575822-6da63fb45455?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            data-testid="about-hero-title"
          >
            About Rocktop
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            We design, plan, and deliver memorable events with creativity,
            precision, and passion.
          </p>
          <Button asChild variant="secondary">
            <a href="/contact" data-testid="about-hero-cta">
              Start Your Event
            </a>
          </Button>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4" variant="secondary">
            Our Mission
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Creating Unforgettable Experiences
          </h2>
          <p className="text-lg text-muted-foreground">
            From intimate celebrations to large-scale corporate functions, our
            mission is to transform ideas into seamless, stunning experiences
            that leave lasting impressions.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Our Values
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide how we serve clients and execute
              world-class events.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Card key={i} className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="font-semibold text-foreground mb-1">
                      {v.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {v.desc}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Plan Your Perfect Event?
          </h3>
          <p className="text-muted-foreground mb-6">
            Talk to our team about your vision and requirements—let’s make it
            unforgettable.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="secondary">
              <a href="/contact">Get Free Consultation</a>
            </Button>
            <Button asChild>
              <a href="/gallery">View Our Work</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingChat />
    </div>
  );
}
