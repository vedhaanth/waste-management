import { useState, useEffect } from 'react';
import { useMongoDB } from '@/hooks/useMongoDB';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, Users, Recycle, TrendingUp } from 'lucide-react';

export default function DatabaseStatus() {
  const { isConnected, isLoading, testConnection, getStats } = useMongoDB();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const handleTestConnection = async () => {
    await testConnection();
  };

  const handleLoadStats = async () => {
    setStatsLoading(true);
    const result = await getStats();
    if (result.success) {
      setStats(result.data);
    }
    setStatsLoading(false);
  };

  useEffect(() => {
    if (isConnected) {
      handleLoadStats();
    }
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            MongoDB Atlas Connection
          </CardTitle>
          <CardDescription>
            Test and monitor your database connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              onClick={handleTestConnection}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Recycle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.totalItems || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.totalUsers || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Items</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.recentItems || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  stats?.itemsByType?.[0]?._id || 'None'
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.itemsByType?.[0]?.count || 0} items
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {isConnected && stats && (
        <Card>
          <CardHeader>
            <CardTitle>Items by Category</CardTitle>
            <CardDescription>
              Distribution of waste items by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.itemsByType?.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="capitalize">{item._id}</span>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              )) || (
                  <p className="text-muted-foreground">No items yet</p>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}