import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import StatusBadge from "@/components/StatusBadge";
import ViolationTypeBadge from "@/components/ViolationTypeBadge";
import { violationTypeLabels, violationPenalties, type Violation } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileText, Eye, Loader2 } from "lucide-react";
import { getViolations, verifyViolation } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const ViolationsPage = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchViolations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (typeFilter !== "all") params.violationType = typeFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const data = await getViolations(params);
      // Backend returns violations with _id (MongoDB), map to id for frontend
      const mapped = data.violations.map((v: any) => ({
        ...v,
        id: v._id || v.id,
        violationType: v.violationType || v.violation_type,
        vehicleType: v.vehicleType || v.vehicle_type,
        plateNumber: v.plateNumber || v.plate_number,
        frameNumber: v.frameNumber || v.frame_number,
      }));
      setViolations(mapped);
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
    fetchViolations();
  }, [typeFilter, statusFilter]);

  const handleVerify = async (id: string, status: 'verified' | 'rejected') => {
    try {
      await verifyViolation(id, status);
      toast({
        title: status === 'verified' ? "Violation Verified" : "Violation Rejected",
        description: `Violation has been ${status}.`,
      });
      fetchViolations();
      setSelectedViolation(null);
    } catch {
      toast({ title: "Error", description: "Failed to update violation status.", variant: "destructive" });
    }
  };

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
          <Button variant="outline" size="sm" onClick={fetchViolations} className="ml-auto">
            Refresh
          </Button>
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
            <span className="ml-3 text-muted-foreground">Loading violations from backend…</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && violations.length === 0 && (
          <div className="glass rounded-lg p-10 text-center text-muted-foreground">
            No violations found. Upload a video to detect violations.
          </div>
        )}

        {/* Table */}
        {!loading && violations.length > 0 && (
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
                {violations.map((v) => (
                  <tr key={v.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 text-muted-foreground">{new Date(v.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4"><ViolationTypeBadge type={v.violationType} /></td>
                    <td className="p-4 text-foreground capitalize">{v.vehicleType}</td>
                    <td className="p-4 font-mono text-foreground text-xs">{v.plateNumber || 'UNKNOWN'}</td>
                    <td className="p-4 text-muted-foreground text-xs">{v.camera || '—'}</td>
                    <td className="p-4 text-foreground">{(v.confidence * 100).toFixed(1)}%</td>
                    <td className="p-4"><StatusBadge status={v.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedViolation(v)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {v.status === "pending" && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-success" onClick={() => handleVerify(v.id, 'verified')}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleVerify(v.id, 'rejected')}>
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
        )}
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
                  <p className="text-foreground font-medium">{selectedViolation.camera || '—'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Vehicle</p>
                  <p className="text-foreground font-medium capitalize">{selectedViolation.vehicleType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Plate Number</p>
                  <p className="text-foreground font-mono font-medium">{selectedViolation.plateNumber || 'UNKNOWN'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Confidence</p>
                  <p className="text-foreground font-medium">{(selectedViolation.confidence * 100).toFixed(1)}%</p>
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
                    <Button className="flex-1" variant="default" onClick={() => handleVerify(selectedViolation.id, 'verified')}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Verify
                    </Button>
                    <Button className="flex-1" variant="destructive" onClick={() => handleVerify(selectedViolation.id, 'rejected')}>
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
