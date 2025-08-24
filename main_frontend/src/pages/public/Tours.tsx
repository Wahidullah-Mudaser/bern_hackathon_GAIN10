import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Users, Star, Mountain } from "lucide-react";

const ToursPage = () => {
  const tours = [
    {
      id: 1,
      name: "Accessible Alpine Experience",
      location: "Jungfraujoch - Top of Europe",
      duration: "Full Day (8 hours)",
      groupSize: "Max 6 people",
      price: "CHF 450",
      rating: 4.9,
      image: "/api/placeholder/400/300",
      highlights: ["Wheelchair accessible trains", "Professional guide", "Adapted viewing platforms", "Glacier experience"],
      description: "Experience the breathtaking beauty of the Swiss Alps with our fully accessible tour to Jungfraujoch. All transportation and viewing areas are wheelchair accessible."
    },
    {
      id: 2,
      name: "Accessible Rhine Falls Adventure",
      location: "Schaffhausen",
      duration: "Half Day (4 hours)",
      groupSize: "Max 8 people", 
      price: "CHF 280",
      rating: 4.7,
      image: "/api/placeholder/400/300",
      highlights: ["Accessible boat rides", "Close-up waterfall viewing", "Accessible paths", "Photography assistance"],
      description: "Visit Europe's most powerful waterfall with specially designed accessible viewing platforms and boat experiences."
    },
    {
      id: 3,
      name: "Swiss Countryside & Accessibility Tour",
      location: "Lucerne & Surroundings",
      duration: "Full Day (7 hours)",
      groupSize: "Max 6 people",
      price: "CHF 380",
      rating: 4.8,
      image: "/api/placeholder/400/300",
      highlights: ["Accessible transport", "Historic sites", "Lake cruise", "Traditional Swiss lunch"],
      description: "Discover the charm of Swiss countryside with accessible transportation and carefully selected barrier-free attractions."
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
            <Mountain className="h-8 w-8 mr-3" />
            <span className="text-lg font-semibold">ACCESSIBLE TOURS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Accessible Tour of Switzerland
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience the stunning beauty of Switzerland with our specially designed accessible tours. 
            Every detail is planned to ensure comfort, safety, and unforgettable memories.
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 max-w-6xl mx-auto">
            {tours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-alpine transition-all duration-300">
                <div className="md:flex">
                  {/* Tour Image */}
                  <div className="md:w-1/3">
                    <div className="aspect-[4/3] md:h-full bg-gradient-alpine flex items-center justify-center">
                      <div className="text-center text-white">
                        <Mountain className="h-12 w-12 mx-auto mb-2" />
                        <span className="font-semibold">{tour.name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tour Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{tour.name}</h3>
                        <div className="flex items-center gap-4 text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{tour.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{tour.groupSize}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(tour.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-2 text-sm font-semibold">{tour.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{tour.price}</div>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{tour.description}</p>

                    {/* Tour Highlights */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Tour Highlights</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tour.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Accessibility Badge */}
                    <div className="mb-6">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ Fully Wheelchair Accessible
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="bg-primary hover:bg-primary-glow">
                        Book Tour
                      </Button>
                      <Button variant="outline">
                        View Itinerary
                      </Button>
                      <Button variant="ghost">
                        <Mail className="h-4 w-4 mr-2" />
                        Ask Questions
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Tours */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Why Choose Our Accessible Tours?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Guidance</h3>
              <p className="text-muted-foreground">
                Our experienced guides are trained in accessibility assistance and local expertise.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Carefully Selected Routes</h3>
              <p className="text-muted-foreground">
                Every location is personally tested for accessibility and safety standards.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Authentic Swiss Experience</h3>
              <p className="text-muted-foreground">
                Experience the real Switzerland while ensuring comfort and accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready for Your Swiss Adventure?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us to discuss your specific needs and preferences. 
            We'll create a customized tour experience just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-glow">
              <Phone className="h-5 w-5 mr-2" />
              Call +41 31 301 55 65
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="h-5 w-5 mr-2" />
              Email for Custom Tour
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
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
            Creating unforgettable accessible travel experiences in Switzerland
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/hotels" className="hover:text-primary">Hotels</Link>
            <Link to="/care-services" className="hover:text-primary">Care Services</Link>
            <Link to="/cms" className="hover:text-primary">CMS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToursPage;