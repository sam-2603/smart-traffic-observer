import AppHeader from "@/components/AppHeader";
import StatusBadge from "@/components/StatusBadge";
import { mockChallans, violationTypeLabels } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Download, Printer, Send } from "lucide-react";
import { motion } from "framer-motion";

const ChallansPage = () => {
  return (
    <div>
      <AppHeader title="Challan Management" />
      <div className="p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Challans", value: mockChallans.length, color: "text-foreground" },
            { label: "Issued", value: mockChallans.filter(c => c.status === 'issued').length, color: "text-accent" },
            { label: "Sent", value: mockChallans.filter(c => c.status === 'sent').length, color: "text-primary" },
            { label: "Paid", value: mockChallans.filter(c => c.status === 'paid').length, color: "text-success" },
          ].map((s) => (
            <div key={s.label} className="stat-card text-center">
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
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
              {mockChallans.map((c) => (
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
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Printer className="w-4 h-4" />
                      </Button>
                      {c.status === "issued" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
};

export default ChallansPage;
