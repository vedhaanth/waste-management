import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { wasteCategories } from "@/lib/wasteCategories";
import { Clock, Trash2, FileText, CheckCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("scans");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.history.get();
        // Sort by date desc
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
        toast.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const scans = history.filter(item => item.type === "scan");
  const reports = history.filter(item => item.type === "report");

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">History</h1>
        <p className="text-muted-foreground">
          View your past scans and track pickup requests
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="scans" className="flex-1 gap-2">
            <Trash2 className="w-4 h-4" />
            Scans
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex-1 gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scans" className="space-y-3">
          {scans.length === 0 && (
            <div className="text-center py-12">
              <Trash2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No scans yet</p>
            </div>
          )}
          {scans.map((scan) => {
            const category = wasteCategories[scan.category];
            const Icon = category?.icon || Trash2;
            const categoryName = category?.name || scan.category;
            const bgColor = category?.bgColor || "bg-gray-100";
            const color = category?.color || "text-gray-600";

            return (
              <Card key={scan._id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate capitalize">{categoryName}</h4>
                      {scan.status === "reported" && (
                        <Badge variant="secondary" className="text-xs">Reported</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(scan.createdAt)}</span>
                      {scan.ticketNumber && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-xs">{scan.ticketNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="reports" className="space-y-3">
          {reports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No reports yet</p>
            </div>
          )}
          {reports.map((report) => {
            const category = wasteCategories[report.category];
            const Icon = category?.icon || FileText;
            const categoryName = category?.name || report.category;
            const bgColor = category?.bgColor || "bg-gray-100";
            const color = category?.color || "text-gray-600";

            return (
              <Card key={report._id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold capitalize">{categoryName}</h4>
                      <Badge
                        variant={
                          report.status === "completed"
                            ? "default"
                            : report.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                        className="gap-1"
                      >
                        {report.status === "in_progress" && <Loader2 className="w-3 h-3 animate-spin" />}
                        {report.status === "completed" && <CheckCircle className="w-3 h-3" />}
                        {report.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{report.address}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono bg-accent px-2 py-0.5 rounded">{report.ticketNumber}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(report.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}


