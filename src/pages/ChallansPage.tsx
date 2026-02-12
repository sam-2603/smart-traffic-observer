import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import StatusBadge from "@/components/StatusBadge";
import { violationTypeLabels, type Challan } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Download, Printer, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getChallans } from "@/services/api";

const ChallansPage = () => {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChallans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChallans();
      const mapped = data.challans.map((c: any) => ({
        ...c,
        id: c._id || c.id,
      }));
      setChallans(mapped);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        "Could not connect to backend. Ensure your Node.js server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallans();
  }, []);

  const summaryStats = [
    { label: "Total Challans", value: challans.length, color: "text-foreground" },
    { label: "Issued", value: challans.filter(c => c.status === 'issued').length, color: "text-accent" },
    { label: "Sent", value: challans.filter(c => c.status === 'sent').length, color: "text-primary" },
    { label: "Paid", value: challans.filter(c => c.status === 'paid').length, color: "text-success" },
  ];

  return (
    <div>
      <AppHeader title="Challan Management" />
      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="stat-card text-center">
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="glass rounded-lg p-4 border border-destructive/30 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading challans…</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && challans.length === 0 && (
          <div className="glass rounded-lg p-10 text-center text-muted-foreground">
            No challans found. Generate challans from verified violations.
          </div>
        )}

        {/* Table */}
        {!loading && challans.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left bg-secondary/30">
                  <th className="p-4 font-medium">Challan #</th>
                  <th className="p-4 font-medium">Vehicle</th>
                  <th className="p-4 font-medium">Owner</th>
                  <th className="p-4 font-medium">Violation</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Issue Date</th>
                  <th className="p-4 font-medium">Due Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {challans.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-mono text-primary text-xs">{c.challanNumber}</td>
                    <td className="p-4 font-mono text-foreground text-xs">{c.vehicleNumber}</td>
                    <td className="p-4 text-foreground">{c.ownerName}</td>
                    <td className="p-4 text-muted-foreground">{violationTypeLabels[c.violationType] || c.violationType}</td>
                    <td className="p-4 text-foreground font-semibold">₹{c.penaltyAmount}</td>
                    <td className="p-4 text-muted-foreground">{c.issueDate}</td>
                    <td className="p-4 text-muted-foreground">{c.dueDate}</td>
                    <td className="p-4"><StatusBadge status={c.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Printer className="w-4 h-4" /></Button>
                        {c.status === "issued" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary"><Send className="w-4 h-4" /></Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallansPage;
