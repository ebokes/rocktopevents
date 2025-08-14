import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ContactForm from "@/components/forms/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Our Office",
    details: ["123 Event Plaza", "Suite 456", "Downtown City, ST 12345"],
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["(555) 123-4567", "Mon-Fri: 9AM-6PM"],
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@rocktoppremium.com", "quotes@rocktoppremium.com"],
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const businessHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
  { day: "Sunday", hours: "By Appointment" },
];

const socialLinks = [
  { name: "Facebook", icon: "fab fa-facebook-f", href: "#", color: "text-blue-600" },
  { name: "Instagram", icon: "fab fa-instagram", href: "#", color: "text-pink-500" },
  { name: "Twitter", icon: "fab fa-twitter", href: "#", color: "text-blue-400" },
  { name: "LinkedIn", icon: "fab fa-linkedin-in", href: "#", color: "text-blue-700" },
  { name: "YouTube", icon: "fab fa-youtube", href: "#", color: "text-red-600" },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="contact-hero-title">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Ready to start planning your perfect event? Contact us today for a free consultation and let's bring your vision to life.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6" data-testid="contact-info-title">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start" data-testid={`contact-info-${index}`}>
                        <div className={`${info.bgColor} p-3 rounded-lg mr-4`}>
                          <Icon className={`${info.color} text-xl`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 mb-1">{info.title}</h3>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-slate-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`${social.color} hover:opacity-75 transition-opacity p-3 bg-white rounded-lg shadow-sm hover:shadow-md`}
                      data-testid={`social-${social.name.toLowerCase()}`}
                    >
                      <i className={`${social.icon} text-xl`}></i>
                    </a>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="text-primary mr-2" />
                    <h3 className="text-xl font-bold text-slate-800">Business Hours</h3>
                  </div>
                  <div className="space-y-2">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between" data-testid={`business-hours-${index}`}>
                        <span className="text-slate-600">{schedule.day}</span>
                        <span className="text-slate-800 font-medium">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Contact Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  data-testid="quick-contact-whatsapp"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp Us
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  data-testid="quick-contact-call"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now: (555) 123-4567
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Find Our Office</h2>
            <p className="text-slate-600">Visit us at our convenient downtown location</p>
          </div>
          
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center text-slate-600">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Google Maps integration showing our office location</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  How far in advance should I book your services?
                </h3>
                <p className="text-slate-600">
                  We recommend booking 3-6 months in advance for weddings and large events, 
                  and 4-8 weeks for corporate events. However, we can accommodate shorter timelines based on availability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Do you provide services outside your local area?
                </h3>
                <p className="text-slate-600">
                  Yes, we travel for destination events. Additional travel costs may apply based on location and distance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  What's included in your event planning packages?
                </h3>
                <p className="text-slate-600">
                  Our packages vary based on your needs but typically include venue coordination, 
                  vendor management, timeline development, and day-of coordination. We'll provide a detailed breakdown with your quote.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Do you offer payment plans?
                </h3>
                <p className="text-slate-600">
                  Yes, we offer flexible payment plans to make our services accessible. 
                  We typically require a deposit to secure your date, with the balance due in installments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
