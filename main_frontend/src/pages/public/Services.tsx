import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Heart, Users, Clock, Shield, Stethoscope, Home } from "lucide-react";

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      name: "Personal Care Assistance",
      icon: Users,
      duration: "24/7 Available",
      price: "CHF 45-65/hour",
      description: "Professional personal care assistants trained in disability support and Swiss hospitality.",
      features: [
        "Mobility assistance",
        "Personal hygiene support", 
        "Medication management",
        "Meal assistance",
        "Transfer support"
      ]
    },
    {
      id: 2,
      name: "Medical Equipment Rental",
      icon: Stethoscope,
      duration: "Daily/Weekly rates",
      price: "From CHF 25/day",
      description: "High-quality medical equipment delivered to your accommodation throughout Switzerland.",
      features: [
        "Wheelchairs (manual/electric)",
        "Hospital beds",
        "Shower chairs",
        "Walking aids",
        "Oxygen equipment"
      ]
    },
    {
      id: 3,
      name: "Companion Services",
      icon: Heart,
      duration: "Flexible hours",
      price: "CHF 35-50/hour",
      description: "Friendly companions to enhance your Swiss travel experience with local knowledge.",
      features: [
        "Sightseeing companion",
        "Shopping assistance",
        "Transportation support",
        "Language interpretation",
        "Emergency support"
      ]
    },
    {
      id: 4,
      name: "Home Nursing Care",
      icon: Home,
      duration: "As needed",
      price: "CHF 85-120/hour",
      description: "Qualified nurses available for in-room medical care and health monitoring.",
      features: [
        "Medication administration",
        "Wound care",
        "Health monitoring",
        "IV therapy",
        "Post-surgery care"
      ]
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Fully Insured & Licensed",
      description: "All our care providers are licensed professionals with comprehensive insurance coverage."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Emergency support line available around the clock for your peace of mind."
    },
    {
      icon: Heart,
      title: "Personalized Care",
      description: "Every care plan is tailored to your specific needs and preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center">
                <div className="bg-primary text-white rounded-lg p-2 mr-3">
                  <span className="font-bold text-lg">C&G</span>
                </div>
                <div>
                  <h1 className="font-bold text-xl text-foreground">Claire & George</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                +41 31 301 55 65
              </span>
              <Link to="/cms" className="text-primary hover:underline">
                CMS
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 mr-3" />
            <span className="text-lg font-semibold">CARE SERVICES</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Holidays with Care
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Additional services offered by Claire & George to ensure you have a relaxing 
            and stress-free holiday – nothing is too much trouble.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <Card key={service.id} className="hover:shadow-alpine transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.name}</CardTitle>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{service.duration}</span>
                        <span className="font-semibold text-primary">{service.price}</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Service Includes:</h4>
                    <div className="grid gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-2 w-2 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 flex gap-3">
                      <Button className="bg-primary hover:bg-primary-glow">
                        Request Service
                      </Button>
                      <Button variant="outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Our Care Services?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-red-50 border-red-200">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="bg-red-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-800 mb-4">24/7 Emergency Support</h2>
                <p className="text-red-700 mb-6 max-w-2xl mx-auto">
                  Our emergency support line is available 24 hours a day, 7 days a week. 
                  If you need immediate assistance during your stay, don't hesitate to call.
                </p>
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency: +41 31 301 55 65
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact for Custom Care */}
      <section className="bg-foreground text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need Custom Care Solutions?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Every traveler has unique needs. Contact us to discuss your specific requirements 
            and we'll create a personalized care plan for your Swiss holiday.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Phone className="h-5 w-5 mr-2" />
              Call for Consultation
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-foreground">
              <Mail className="h-5 w-5 mr-2" />
              Email Care Team
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary text-white rounded-lg p-2 mr-3">
              <span className="font-bold text-lg">C&G</span>
            </div>
            <div>
              <h3 className="font-bold text-xl">Claire & George</h3>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            Caring for your comfort and well-being throughout Switzerland
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/hotels" className="hover:text-primary">Hotels</Link>
            <Link to="/tours" className="hover:text-primary">Tours</Link>
            <Link to="/cms" className="hover:text-primary">CMS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;