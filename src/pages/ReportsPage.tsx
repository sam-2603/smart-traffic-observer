import AppHeader from "@/components/AppHeader";
import { hourlyViolationData, violationTypeDistribution } from "@/lib/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "Mon", violations: 180, challans: 142 },
  { day: "Tue", violations: 210, challans: 175 },
  { day: "Wed", violations: 195, challans: 160 },
  { day: "Thu", violations: 240, challans: 198 },
  { day: "Fri", violations: 260, challans: 220 },
  { day: "Sat", violations: 150, challans: 120 },
  { day: "Sun", violations: 90, challans: 72 },
];

const tooltipStyle = {
  backgroundColor: "hsl(222, 44%, 8%)",
  border: "1px solid hsl(217, 33%, 17%)",
  borderRadius: "8px",
  color: "hsl(210, 40%, 96%)",
};

const ReportsPage = () => {
  return (
    <div>
      <AppHeader title="Reports & Analytics" />
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Violations", value: "1,325", sub: "This Week" },
            { label: "Challans Generated", value: "1,087", sub: "This Week" },
            { label: "Revenue Collected", value: "₹12.4L", sub: "This Month" },
            { label: "Avg. Detection Time", value: "180ms", sub: "Per Frame" },
          ].map((s) => (
            <div key={s.label} className="stat-card text-center">
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Weekly Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="violations" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="challans" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Hourly Line Chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Peak Hours (Today)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={hourlyViolationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="hour" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="violations" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ fill: "hsl(199, 89%, 48%)", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Violation Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={violationTypeDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {violationTypeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Camera stats */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-lg p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">Camera Performance</h3>
            <div className="space-y-3">
              {[
                { name: "Camera 1 - Main Square", violations: 68, pct: 85 },
                { name: "Camera 2 - Junction B", violations: 52, pct: 65 },
                { name: "Camera 3 - Highway Entry", violations: 45, pct: 56 },
                { name: "Camera 4 - School Zone", violations: 38, pct: 48 },
                { name: "Camera 5 - One Way", violations: 24, pct: 30 },
                { name: "Camera 6 - Market Road", violations: 20, pct: 25 },
              ].map((cam) => (
                <div key={cam.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground text-xs">{cam.name}</span>
                    <span className="text-foreground font-medium text-xs">{cam.violations}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${cam.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
