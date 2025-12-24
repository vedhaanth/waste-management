import { useState } from "react";
import { MapPin, AlertTriangle, ChevronDown, ChevronUp, Recycle, Info, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WasteCategoryInfo } from "@/lib/wasteCategories";

interface WasteResultProps {
  category: WasteCategoryInfo;
  confidence: number;
  onReport: () => void;
  onFindBins: () => void;
  reasoning?: string;
  itemsDetected?: string[];
}

export function WasteResult({ category, confidence, onReport, onFindBins, reasoning, itemsDetected }: WasteResultProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("disposal");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Icon = category.icon;

  return (
    <Card className="overflow-hidden border-2 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <CardHeader className={`${category.bgColor} border-b ${category.borderColor} p-6`}>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl ${category.bgColor} border-2 ${category.borderColor} flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${category.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className={`text-2xl font-bold ${category.color}`}>{category.name}</h2>
              {category.requiresReport && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Requires Report
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{category.description}</p>
            {itemsDetected && itemsDetected.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {itemsDetected.map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
            {reasoning && (
              <p className="text-sm text-muted-foreground mt-2 italic">
                AI: {reasoning}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 flex-1 bg-background rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-primary rounded-full transition-all duration-1000`}
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{confidence}% match</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Disposal Instructions */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("disposal")}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="font-medium">Disposal Instructions</span>
            </div>
            {expandedSection === "disposal" ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSection === "disposal" && (
            <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <ul className="space-y-2">
                {category.disposalInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recycling Options */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("recycling")}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Recycle className="w-5 h-5 text-chart-2" />
              <span className="font-medium">Recycling Options</span>
            </div>
            {expandedSection === "recycling" ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSection === "recycling" && (
            <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <ul className="space-y-2">
                {category.recyclingOptions.map((option, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <ArrowRight className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pro Tips */}
        <div className="border-b border-border">
          <button
            onClick={() => toggleSection("tips")}
            className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-chart-4" />
              <span className="font-medium">Pro Tips</span>
            </div>
            {expandedSection === "tips" ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
          {expandedSection === "tips" && (
            <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <ul className="space-y-2">
                {category.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <ArrowRight className="w-4 h-4 text-chart-4 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <Button onClick={onFindBins} variant="outline" className="w-full gap-2" size="lg">
            <MapPin className="w-5 h-5" />
            Find Nearby Bins & Centers
          </Button>
          
          {category.requiresReport && (
            <Button onClick={onReport} variant="destructive" className="w-full gap-2" size="lg">
              <AlertTriangle className="w-5 h-5" />
              Report for Pickup
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
