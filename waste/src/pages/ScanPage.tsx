import { useState } from "react";
import { WasteScanner } from "@/components/WasteScanner";
import { WasteResult } from "@/components/WasteResult";
import { ReportDialog } from "@/components/ReportDialog";
import { NearbyLocations } from "@/components/NearbyLocations";
import { wasteCategories, WasteCategory, WasteCategoryInfo } from "@/lib/wasteCategories";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function ScanPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<WasteCategoryInfo | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>("");
  const [confidence, setConfidence] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [itemsDetected, setItemsDetected] = useState<string[]>([]);

  const handleImageCapture = async (image: string) => {
    setCapturedImage(image);
    setIsAnalyzing(true);
    setAiReasoning("");
    setItemsDetected([]);

    try {
      const { data, error } = await supabase.functions.invoke("classify-waste", {
        body: { image },
      });

      if (error) {
        console.error("Classification error:", error);
        toast.error("Failed to analyze image. Please try again.");
        setIsAnalyzing(false);
        return;
      }

      if (data.error) {
        toast.error(data.error);
        setIsAnalyzing(false);
        return;
      }

      const category = data.category as WasteCategory;

      if (wasteCategories[category]) {
        setResult(wasteCategories[category]);
        setConfidence(data.confidence);
        setAiReasoning(data.reasoning || "");
        setItemsDetected(data.items_detected || []);
        toast.success(`Identified as ${wasteCategories[category].name}`);

        // Save scan to history
        try {
          await api.history.create({
            type: "scan",
            category: category,
            status: "completed"
          });
        } catch (err) {
          console.error("Failed to save history:", err);
        }
      } else {
        toast.error("Could not identify waste type. Please try again.");
      }
    } catch (err) {
      console.error("Error calling classify-waste:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCapturedImage("");
    setConfidence(0);
    setAiReasoning("");
    setItemsDetected([]);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Scan Waste</h1>
        <p className="text-muted-foreground">
          Take a photo to identify waste type and get disposal guidance
        </p>
      </div>

      {!result ? (
        <WasteScanner onImageCapture={handleImageCapture} isAnalyzing={isAnalyzing} />
      ) : (
        <div className="space-y-4">
          <WasteResult
            category={result}
            confidence={confidence}
            onReport={() => setShowReport(true)}
            onFindBins={() => setShowLocations(true)}
            reasoning={aiReasoning}
            itemsDetected={itemsDetected}
          />

          <Button onClick={handleReset} variant="outline" className="w-full gap-2">
            <RefreshCw className="w-4 h-4" />
            Scan Another Item
          </Button>
        </div>
      )}

      {result && (
        <>
          <ReportDialog
            open={showReport}
            onClose={() => setShowReport(false)}
            category={result}
            capturedImage={capturedImage}
          />
          <NearbyLocations
            open={showLocations}
            onClose={() => setShowLocations(false)}
            wasteType={result.name}
          />
        </>
      )}
    </div>
  );
}
