import { Card } from "@/components/ui/card";
import { wasteCategories, WasteCategory } from "@/lib/wasteCategories";

interface CategoryGridProps {
  onSelect: (category: WasteCategory) => void;
}

export function CategoryGrid({ onSelect }: CategoryGridProps) {
  const categories = Object.values(wasteCategories);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Card
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 ${category.bgColor} border-transparent hover:${category.borderColor}`}
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${category.color}`} />
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
