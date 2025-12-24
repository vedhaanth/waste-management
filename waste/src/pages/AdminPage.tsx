
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { wasteCategories } from "@/lib/wasteCategories";
import { DatabaseStatus } from "@/components/DatabaseStatus";

export default function AdminPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await api.admin.getReports();
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                toast.error("Failed to load admin reports");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-1">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    View all waste pickup reports and locations
                </p>
            </div>

            <DatabaseStatus />

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Waste Reports</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => {
                        const category = wasteCategories[report.category] || {};
                        const Icon = category.icon || FileText;
                        const bgColor = category.bgColor || "bg-gray-100";
                        const color = category.color || "text-gray-600";

                        // Create google maps link if address looks like coordinates
                        let mapsLink = null;
                        if (report.address && report.address.includes(",")) {
                            const [lat, lng] = report.address.split(",").map((s: string) => s.trim());
                            if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
                                mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
                            }
                        }

                        return (
                            <Card key={report._id} className="p-4 flex flex-col h-full">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-5 h-5 ${color}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold capitalize truncate pr-2">
                                                {category.name || report.category}
                                            </h3>
                                            <Badge variant={report.status === "completed" ? "default" : "secondary"}>
                                                {report.status}
                                            </Badge>
                                        </div>
                                        <p className="text-xs font-mono text-muted-foreground">
                                            {report.ticketNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span className="line-clamp-2">{report.address || "No location provided"}</span>
                                    </div>
                                    <div className="text-xs">
                                        Reported: {new Date(report.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {mapsLink && (
                                    <a
                                        href={mapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View on Map
                                    </a>
                                )}
                            </Card>
                        );
                    })}

                    {reports.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-muted-foreground">No reports found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
