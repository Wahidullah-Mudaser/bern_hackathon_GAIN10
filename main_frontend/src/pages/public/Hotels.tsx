import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Wifi, Car, Utensils, Accessibility, Star, MapPin } from "lucide-react";

const HotelsPage = () => {
  const hotels = [
    {
      id: 1,
      name: "Swiss Alpine Resort Accessible",
      location: "Interlaken",
      rating: 4.8,
      price: "CHF 280-450",
      image: "/api/placeholder/400/300",
      features: ["Wheelchair accessible rooms", "Accessible bathrooms", "Elevator access", "Accessible parking"],
      amenities: ["Free WiFi", "Restaurant", "Spa", "Pool"],
      description: "Luxury resort with full accessibility features in the heart of the Swiss Alps."
    },
    {
      id: 2,
      name: "Accessible Lakeside Hotel",
      location: "Lake Geneva",
      rating: 4.6,
      price: "CHF 220-380",
      image: "/api/placeholder/400/300",
      features: ["Roll-in showers", "Accessible balconies", "Audio alerts", "Braille signage"],
      amenities: ["Free WiFi", "Restaurant", "Parking", "Lake view"],
      description: "Beautiful lakeside location with comprehensive accessibility accommodations."
    },
    {
      id: 3,
      name: "Mountain View Accessible Lodge",
      location: "Zermatt",
      rating: 4.7,
      price: "CHF 350-520",
      image: "/api/placeholder/400/300",
      features: ["Accessible ski storage", "Modified bathrooms", "Wide doorways", "Accessible paths"],
      amenities: ["Free WiFi", "Restaurant", "Ski access", "Mountain views"],
      description: "Premier mountain lodge with stunning Matterhorn views and full accessibility."
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Wheelchair Accessible Hotels in Switzerland
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover our carefully selected collection of accessible hotels and accommodations 
            throughout Switzerland, all verified for excellent accessibility standards.
          </p>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 max-w-6xl mx-auto">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-alpine transition-all duration-300">
                <div className="md:flex">
                  {/* Hotel Image */}
                  <div className="md:w-1/3">
                    <div className="aspect-[4/3] md:h-full bg-gradient-alpine flex items-center justify-center">
                      <span className="text-white font-semibold">{hotel.name}</span>
                    </div>
                  </div>
                  
                  {/* Hotel Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">{hotel.name}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span>{hotel.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(hotel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                            <span className="ml-2 text-sm font-semibold">{hotel.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{hotel.price}</div>
                        <div className="text-sm text-muted-foreground">per night</div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4">{hotel.description}</p>

                    {/* Accessibility Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Accessibility className="h-4 w-4 text-primary" />
                        Accessibility Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hotel.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        {hotel.amenities.map((amenity, index) => {
                          const getIcon = (amenity: string) => {
                            if (amenity.includes('WiFi')) return <Wifi className="h-4 w-4" />;
                            if (amenity.includes('Restaurant')) return <Utensils className="h-4 w-4" />;
                            if (amenity.includes('Parking')) return <Car className="h-4 w-4" />;
                            return <span className="h-4 w-4" />;
                          };
                          
                          return (
                            <div key={index} className="flex items-center gap-2">
                              {getIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="bg-primary hover:bg-primary-glow">
                        Book Now
                      </Button>
                      <Button variant="outline">
                        View Details
                      </Button>
                      <Button variant="ghost">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Hotel
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Need Help Finding the Right Hotel?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our accessibility experts are here to help you find the perfect accommodation 
            for your specific needs. Contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary-glow">
              <Phone className="h-5 w-5 mr-2" />
              Call +41 31 301 55 65
            </Button>
            <Button size="lg" variant="outline">
              <Mail className="h-5 w-5 mr-2" />
              Email Us
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
            Your trusted partner for accessible travel in Switzerland
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/tours" className="hover:text-primary">Tours</Link>
            <Link to="/care-services" className="hover:text-primary">Care Services</Link>
            <Link to="/cms" className="hover:text-primary">CMS</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HotelsPage;