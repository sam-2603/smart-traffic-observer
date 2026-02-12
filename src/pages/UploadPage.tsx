import { useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Upload, FileVideo, X, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("video/")) setFile(f);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Simulate upload/processing progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setDone(true);
          return 100;
        }
        return p + Math.random() * 8;
      });
    }, 300);
  };

  const reset = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setDone(false);
  };

  return (
    <div>
      <AppHeader title="Upload Video" />
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {done ? (
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
                3 violations detected. View them in the Violations page.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="default" onClick={() => window.location.href = "/violations"}>
                  View Violations
                </Button>
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
                    <span className="text-muted-foreground">Uploading & Processing…</span>
                    <span className="text-foreground font-medium">{Math.min(Math.round(progress), 100)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                </div>
              )}

              {/* Upload button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? "Processing…" : "Upload & Process Video"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadPage;
