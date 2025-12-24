import { useState } from "react";
import { MapPin, Send, CheckCircle, Loader2, Copy, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WasteCategoryInfo } from "@/lib/wasteCategories";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  category: WasteCategoryInfo;
  capturedImage: string;
}

export function ReportDialog({ open, onClose, category, capturedImage }: ReportDialogProps) {
  const [step, setStep] = useState<"form" | "submitting" | "success">("form");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [gettingLocation, setGettingLocation] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const getLocation = () => {
    setGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGettingLocation(false);
          toast.success("Location captured successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          setGettingLocation(false);
          toast.error("Could not get location. Please enter address manually.");
        }
      );
    } else {
      setGettingLocation(false);
      toast.error("Geolocation not supported");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location && !address) {
      toast.error("Please provide location or address");
      return;
    }

    setStep("submitting");

    try {
      const ticket = `ECO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      await api.history.create({
        type: "report",
        category: category.id, // Or however you get the category key
        status: "in_progress",
        ticketNumber: ticket,
        address: address || (location ? `${location.lat}, ${location.lng}` : "Unknown location")
      });

      setTicketNumber(ticket);
      setStep("success");
    } catch (error) {
      console.error("Report submission failed:", error);
      toast.error("Failed to submit report");
      setStep("form");
    }
  };

  const copyTicket = () => {
    navigator.clipboard.writeText(ticketNumber);
    toast.success("Ticket number copied!");
  };

  const sendSMS = () => {
    // Check if we're in a mobile app
    // @ts-ignore
    const isCapacitor = window.Capacitor;

    // @ts-ignore
    if (isCapacitor && window.Capacitor.Plugins?.Browser) {
      // Use Capacitor Browser plugin to open SMS intent
      const smsUrl = `sms:?body=save%20india`;
      window.open(smsUrl, '_system');
    } else {
      // Fallback for web - try to open SMS URL
      const smsUrl = `sms:?body=save%20india`;
      window.open(smsUrl, '_blank');
    }

    toast.success("Opening SMS app...");
  };

  const handleClose = () => {
    setStep("form");
    setLocation(null);
    setAddress("");
    setDescription("");
    setPhone("");
    onClose();
  };

  const Icon = category.icon;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Report {category.name}
              </DialogTitle>
              <DialogDescription>
                Submit a pickup request to your local municipality
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Captured Image Preview */}
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img src={capturedImage} alt="Waste" className="w-full h-32 object-cover" />
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${category.bgColor} ${category.color}`}>
                  <Icon className="w-3 h-3 inline mr-1" />
                  {category.name}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    className="gap-2"
                  >
                    {gettingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    Get GPS
                  </Button>
                  {location && (
                    <div className="flex-1 flex items-center px-3 bg-accent rounded-md text-sm">
                      <span className="text-accent-foreground">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  placeholder="Enter address for additional reference"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the waste and any special handling requirements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full gap-2" size="lg">
                <Send className="w-4 h-4" />
                Submit Report
              </Button>
            </form>
          </>
        )}

        {step === "submitting" && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin mb-4" />
            <h3 className="text-lg font-semibold mb-2">Submitting Report...</h3>
            <p className="text-muted-foreground">
              Sending to your local municipality
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Report Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Your pickup request has been sent to the authorities
            </p>

            <div className="bg-accent rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Ticket Number</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-lg font-mono font-bold text-foreground">
                  {ticketNumber}
                </code>
                <Button variant="ghost" size="icon" onClick={copyTicket}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <Button onClick={sendSMS} variant="outline" className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Send "Save India" Message
              </Button>
              <p className="text-xs text-muted-foreground">
                Share awareness about environmental conservation
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Save this number to track your request. You will be contacted within 24-48 hours.
            </p>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
