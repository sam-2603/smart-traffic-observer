import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import ViolationTypeBadge from "@/components/ViolationTypeBadge";
import { type DashboardStats, type Violation, hourlyViolationData, violationTypeDistribution } from "@/lib/mockData";
import {
  AlertTriangle, FileText, Camera, Clock, Target, CheckCircle, Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { getDashboardStats, getViolations } from "@/services/api";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentViolations, setRecentViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsData, violationsData] = await Promise.all([
          getDashboardStats(),
          getViolations({ limit: 6 }),
        ]);
        setStats(statsData);
        const mapped = violationsData.violations.map((v: any) => ({
          ...v,
          id: v._id || v.id,
          violationType: v.violationType || v.violation_type,
          vehicleType: v.vehicleType || v.vehicle_type,
          plateNumber: v.plateNumber || v.plate_number,
        }));
        setRecentViolations(mapped);
      } catch (err: any) {
        setError("Could not connect to backend. Ensure your Node.js server is running on port 5000.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <AppHeader title="Dashboard" />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Connecting to backend…</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <AppHeader title="Dashboard" />
        <div className="p-6">
          <div className="glass rounded-lg p-6 border border-destructive/30 text-center">
            <p className="text-destructive font-medium">Backend Unavailable</p>
            <p className="text-sm text-muted-foreground mt-2">{error}</p>
            <p className="text-xs text-muted-foreground mt-4">
              Start your Node.js backend: <code className="bg-secondary px-2 py-1 rounded">cd backend && npm run dev</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader title="Dashboard" />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Violations Today" value={stats.totalViolationsToday} icon={AlertTriangle} trend="live" trendUp />
          <StatCard title="Pending Challans" value={stats.pendingChallans} icon={FileText} />
          <StatCard title="Active Cameras" value={stats.activeCameras} icon={Camera} />
          <StatCard title="System Uptime" value={stats.systemUptime} icon={Clock} />
          <StatCard title="Detection Accuracy" value={`${stats.detectionAccuracy}%`} icon={Target} />
          <StatCard title="Processed Challans" value={stats.processedChallans} icon={CheckCircle} />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Violations Today (Hourly)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={hourlyViolationData}>
                <defs>
                  <linearGradient id="violationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="hour" tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 44%, 8%)', border: '1px solid hsl(217, 33%, 17%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)' }} />
                <Area type="monotone" dataKey="violations" stroke="hsl(199, 89%, 48%)" fill="url(#violationGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">By Violation Type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={violationTypeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" stroke="none">
                  {violationTypeDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(222, 44%, 8%)', border: '1px solid hsl(217, 33%, 17%)', borderRadius: '8px', color: 'hsl(210, 40%, 96%)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {violationTypeDistribution.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="text-foreground font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Violations */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-lg p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Recent Violations</h3>
          {recentViolations.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No violations detected yet. Upload a video to get started.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Vehicle</th>
                    <th className="pb-3 font-medium">Plate</th>
                    <th className="pb-3 font-medium">Confidence</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentViolations.map((v) => (
                    <tr key={v.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 text-muted-foreground">{new Date(v.timestamp).toLocaleTimeString()}</td>
                      <td className="py-3"><ViolationTypeBadge type={v.violationType} /></td>
                      <td className="py-3 text-foreground capitalize">{v.vehicleType}</td>
                      <td className="py-3 font-mono text-foreground text-xs">{v.plateNumber || 'UNKNOWN'}</td>
                      <td className="py-3 text-foreground">{(v.confidence * 100).toFixed(1)}%</td>
                      <td className="py-3"><StatusBadge status={v.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
