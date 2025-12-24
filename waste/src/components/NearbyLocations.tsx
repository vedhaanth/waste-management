import { useState, useEffect } from "react";
import { MapPin, Navigation, Clock, Phone, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Location {
  id: string;
  name: string;
  type: "bin" | "center";
  address: string;
  distance: string;
  hours: string;
  phone?: string;
  acceptedTypes: string[];
}

interface NearbyLocationsProps {
  open: boolean;
  onClose: () => void;
  wasteType: string;
}

// Mock data for nearby locations
const mockLocations: Location[] = [
  {
    id: "1",
    name: "Green Street Recycling Bin",
    type: "bin",
    address: "123 Green Street, City Center",
    distance: "0.3 km",
    hours: "24/7",
    acceptedTypes: ["Recyclable", "Organic"]
  },
  {
    id: "2",
    name: "City Recycling Center",
    type: "center",
    address: "456 Environment Ave, Industrial Zone",
    distance: "1.2 km",
    hours: "Mon-Sat: 8AM-6PM",
    phone: "(555) 123-4567",
    acceptedTypes: ["Recyclable", "E-waste", "Hazardous"]
  },
  {
    id: "3",
    name: "EcoPoint Collection Hub",
    type: "center",
    address: "789 Sustainability Blvd",
    distance: "2.5 km",
    hours: "Mon-Fri: 9AM-5PM",
    phone: "(555) 987-6543",
    acceptedTypes: ["All Types"]
  },
  {
    id: "4",
    name: "Community Compost Station",
    type: "bin",
    address: "321 Garden Lane, Park District",
    distance: "0.8 km",
    hours: "24/7",
    acceptedTypes: ["Organic"]
  }
];

export function NearbyLocations({ open, onClose, wasteType }: NearbyLocationsProps) {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Simulate loading
      setTimeout(() => {
        setLocations(mockLocations);
        setLoading(false);
      }, 1000);
    }
  }, [open]);

  const openInMaps = (address: string) => {
    const encoded = encodeURIComponent(address);

    // Check if we're running in a mobile app (Capacitor)
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || !!(window as any).Capacitor;

    if (isMobile) {
      // Use geo URI for mobile devices to open native map app
      const geoUrl = `geo:0,0?q=${encoded}`;
      window.open(geoUrl, '_system');
    } else {
      // Fallback to Google Maps web for desktop
      window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nearby Disposal Points
          </DialogTitle>
          <DialogDescription>
            Find the closest bins and recycling centers for {wasteType}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6 py-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
              <p className="text-muted-foreground">Finding nearby locations...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {locations.map((location) => (
                <Card key={location.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">{location.name}</h4>
                        <Badge variant={location.type === "center" ? "default" : "secondary"} className="shrink-0">
                          {location.type === "center" ? "Center" : "Bin"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{location.address}</span>
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <Navigation className="w-3 h-3" />
                          {location.distance}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {location.hours}
                        </span>
                        {location.phone && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {location.phone}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {location.acceptedTypes.map((type) => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openInMaps(location.address)}
                      className="shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border mt-2">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
