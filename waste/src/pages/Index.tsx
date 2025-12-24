import { Link } from "react-router-dom";
import { Camera, BookOpen, MapPin, TrendingUp, ArrowRight, Leaf, Recycle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { wasteCategories } from "@/lib/wasteCategories";

export default function Index() {
  const quickActions = [
    {
      icon: Camera,
      label: "Scan Waste",
      description: "Identify & classify waste instantly",
      to: "/scan",
      primary: true,
    },
    {
      icon: BookOpen,
      label: "Waste Guide",
      description: "Learn about disposal methods",
      to: "/guidance",
    },
    {
      icon: MapPin,
      label: "Find Bins",
      description: "Locate nearby recycling points",
      to: "/scan",
    },
  ];

  const stats = [
    { label: "Items Scanned", value: "24", icon: Camera },
    { label: "Properly Disposed", value: "21", icon: Recycle },
    { label: "CO₂ Saved", value: "12kg", icon: Leaf },
  ];

  const categories = Object.values(wasteCategories).slice(0, 4);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 mb-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-sm font-medium text-primary-foreground/80">AI-Powered</span>
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">
            Smart Waste Sorting
          </h2>
          <p className="text-primary-foreground/80 mb-4 max-w-xs">
            Snap a photo and let AI identify the correct disposal method for your waste
          </p>
          <Button asChild variant="secondary" className="gap-2">
            <Link to="/scan">
              <Camera className="w-4 h-4" />
              Start Scanning
            </Link>
          </Button>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-primary-foreground/10" />
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary-foreground/5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="text-center p-4">
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.to + action.label} to={action.to}>
                <Card className={`p-4 transition-all hover:shadow-md ${action.primary ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.primary ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{action.label}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Waste Categories Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Waste Categories</h3>
          <Link to="/guidance" className="text-sm text-primary font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to="/guidance">
                <Card className={`p-4 transition-all hover:shadow-md ${category.bgColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${category.bgColor} border ${category.borderColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
