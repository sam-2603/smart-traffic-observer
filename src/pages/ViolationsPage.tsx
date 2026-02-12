import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import StatusBadge from "@/components/StatusBadge";
import ViolationTypeBadge from "@/components/ViolationTypeBadge";
import { mockViolations, violationTypeLabels, violationPenalties, type Violation } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileText, Eye } from "lucide-react";

const ViolationsPage = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);

  const filtered = mockViolations.filter((v) => {
    if (typeFilter !== "all" && v.violationType !== typeFilter) return false;
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <AppHeader title="Violations" />
      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-44 bg-secondary border-border">
              <SelectValue placeholder="Violation Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(violationTypeLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-secondary border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto text-sm text-muted-foreground self-center">
            {filtered.length} violation{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left bg-secondary/30">
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Vehicle</th>
                <th className="p-4 font-medium">Plate</th>
                <th className="p-4 font-medium">Camera</th>
                <th className="p-4 font-medium">Confidence</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-4 text-muted-foreground">{new Date(v.timestamp).toLocaleTimeString()}</td>
                  <td className="p-4"><ViolationTypeBadge type={v.violationType} /></td>
                  <td className="p-4 text-foreground capitalize">{v.vehicleType}</td>
                  <td className="p-4 font-mono text-foreground text-xs">{v.plateNumber}</td>
                  <td className="p-4 text-muted-foreground text-xs">{v.camera}</td>
                  <td className="p-4 text-foreground">{v.confidence}%</td>
                  <td className="p-4"><StatusBadge status={v.status} /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedViolation(v)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      {v.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {v.status === "verified" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary">
                          <FileText className="w-4 h-4" />
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedViolation} onOpenChange={() => setSelectedViolation(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Violation Details</DialogTitle>
          </DialogHeader>
          {selectedViolation && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ViolationTypeBadge type={selectedViolation.violationType} />
                <StatusBadge status={selectedViolation.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="text-foreground font-medium">{new Date(selectedViolation.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Camera</p>
                  <p className="text-foreground font-medium">{selectedViolation.camera}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vehicle</p>
                  <p className="text-foreground font-medium capitalize">{selectedViolation.vehicleType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plate Number</p>
                  <p className="text-foreground font-mono font-medium">{selectedViolation.plateNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="text-foreground font-medium">{selectedViolation.confidence}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Penalty</p>
                  <p className="text-foreground font-medium">₹{violationPenalties[selectedViolation.violationType]}</p>
                </div>
              </div>
              {selectedViolation.details && Object.keys(selectedViolation.details).length > 0 && (
                <div className="bg-secondary/50 rounded-md p-3">
                  <p className="text-xs text-muted-foreground mb-2">Additional Details</p>
                  {Object.entries(selectedViolation.details).map(([k, v]) => (
                    <p key={k} className="text-sm text-foreground">
                      <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}:</span>{' '}
                      <span className="font-medium">{String(v)}</span>
                    </p>
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {selectedViolation.status === "pending" && (
                  <>
                    <Button className="flex-1" variant="default">
                      <CheckCircle className="w-4 h-4 mr-2" /> Verify
                    </Button>
                    <Button className="flex-1" variant="destructive">
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
                {selectedViolation.status === "verified" && (
                  <Button className="flex-1" variant="default">
                    <FileText className="w-4 h-4 mr-2" /> Generate Challan
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViolationsPage;
