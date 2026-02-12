import { useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, X, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { uploadVideo } from "@/services/api";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"upload" | "processing">("upload");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ totalViolations: number; jobId: string } | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setPhase("upload");
    setError(null);

    try {
      // Upload phase — progress from axios
      setPhase("upload");
      const data = await uploadVideo(file, (uploadProgress) => {
        // Upload is 0-50%, processing is 50-100%
        setProgress(uploadProgress * 0.5);
        if (uploadProgress >= 100) {
          setPhase("processing");
        }
      });

      // Processing complete
      setProgress(100);

      if (data.success) {
        setResult({
          totalViolations: data.totalViolations,
          jobId: data.jobId,
        });
        setDone(true);
      } else {
        setError(data.error || "Processing failed. Please try again.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Failed to connect to backend. Make sure your Node.js server is running on port 5000.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setPhase("upload");
    setDone(false);
    setError(null);
    setResult(null);
  };

  return (
    <div>
      <AppHeader title="Upload Video" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {done && result ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-xl p-10 text-center space-y-4"
            >
              <CheckCircle className="w-16 h-16 text-success mx-auto" />
              <h2 className="font-display text-2xl font-bold text-foreground">Processing Complete!</h2>
              <p className="text-muted-foreground">
                {result.totalViolations} violation{result.totalViolations !== 1 ? 's' : ''} detected.
                {result.totalViolations > 0 ? " View them in the Violations page." : ""}
              </p>
              <p className="text-xs text-muted-foreground font-mono">Job ID: {result.jobId}</p>
              <div className="flex gap-3 justify-center pt-2">
                {result.totalViolations > 0 && (
                  <Button variant="default" onClick={() => window.location.href = "/violations"}>
                    View Violations
                  </Button>
                )}
                <Button variant="outline" onClick={reset}>
                  Upload Another
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="glass rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors p-12 text-center cursor-pointer"
                onClick={() => document.getElementById("video-input")?.click()}
              >
                <input
                  id="video-input"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">
                  {file ? file.name : "Drop a video file or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">MP4, AVI, MOV — max 500 MB</p>
              </div>

              {/* File info */}
              {file && !uploading && (
                <div className="glass rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileVideo className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-foreground font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {phase === "upload" ? "Uploading video…" : "YOLO processing…"}
                    </span>
                    <span className="text-foreground font-medium">{Math.min(Math.round(progress), 100)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  {phase === "processing" && (
                    <p className="text-xs text-muted-foreground">
                      This may take a few minutes depending on video length.
                    </p>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="glass rounded-lg p-4 border border-destructive/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-destructive font-medium">Upload Failed</p>
                    <p className="text-xs text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Upload button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (phase === "upload" ? "Uploading…" : "Processing with YOLO…") : "Upload & Process Video"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
