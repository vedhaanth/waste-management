import { useState } from "react";
import { wasteCategories, WasteCategory, WasteCategoryInfo } from "@/lib/wasteCategories";
import { CategoryGrid } from "@/components/CategoryGrid";
import { WasteResult } from "@/components/WasteResult";
import { NearbyLocations } from "@/components/NearbyLocations";
import { ReportDialog } from "@/components/ReportDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function GuidePage() {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategoryInfo | null>(null);
  const [showLocations, setShowLocations] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = Object.values(wasteCategories).filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (categoryId: WasteCategory) => {
    setSelectedCategory(wasteCategories[categoryId]);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      {!selectedCategory ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">Waste Guide</h1>
            <p className="text-muted-foreground">
              Learn about different waste types and how to dispose of them properly
            </p>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search waste types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <CategoryGrid onSelect={handleSelect} />
        </>
      ) : (
        <div className="space-y-4">
          <Button onClick={handleBack} variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Button>

          <WasteResult
            category={selectedCategory}
            confidence={100}
            onReport={() => setShowReport(true)}
            onFindBins={() => setShowLocations(true)}
          />

          <NearbyLocations
            open={showLocations}
            onClose={() => setShowLocations(false)}
            wasteType={selectedCategory.name}
          />

          <ReportDialog
            open={showReport}
            onClose={() => setShowReport(false)}
            category={selectedCategory}
            capturedImage=""
          />
        </div>
      )}
    </div>
  );
}
