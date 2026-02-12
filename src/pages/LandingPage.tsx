import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Camera,
  Zap,
  BarChart3,
  AlertTriangle,
  FileText,
  ArrowRight,
  Eye,
  Gauge,
  HardHat,
  Ban,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Camera, title: "Multi-Camera Coverage", desc: "Monitor up to 24 cameras simultaneously with real-time YOLO detection" },
  { icon: Zap, title: "Instant Detection", desc: "AI-powered violation detection in under 200ms per frame" },
  { icon: BarChart3, title: "Smart Analytics", desc: "Comprehensive reports with trend analysis and predictive insights" },
  { icon: FileText, title: "Auto Challan", desc: "Automated challan generation with OCR plate recognition" },
];

const violationTypes = [
  { icon: AlertTriangle, name: "Red Light", color: "text-destructive" },
  { icon: Gauge, name: "Overspeeding", color: "text-warning" },
  { icon: HardHat, name: "No Helmet", color: "text-primary" },
  { icon: Ban, name: "Wrong Way", color: "text-purple-400" },
  { icon: StopCircle, name: "Stop Line", color: "text-success" },
  { icon: Eye, name: "Lane Violation", color: "text-accent" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 h-16 border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">TrafficAI</span>
        </div>
        <Link to="/dashboard">
          <Button variant="default" size="sm">
            Open Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto px-8 py-24 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            AI-Powered Traffic Monitoring
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Smart Traffic Violation
            <br />
            <span className="text-primary">Detection System</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Leverage YOLOv8 computer vision to automatically detect traffic violations,
            recognize license plates, and generate challans — all in real time.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg">
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="outline" size="lg">
                Upload Video
              </Button>
            </Link>
          </div>

          {/* Live stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 glass rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: "Violations Today", value: "247" },
              { label: "Active Cameras", value: "12" },
              { label: "Accuracy", value: "97.3%" },
              { label: "Challans Issued", value: "158" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-display font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
          Core Capabilities
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} className="stat-card">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Violation Types */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <h2 className="font-display text-3xl font-bold text-center text-foreground mb-12">
          Detectable Violations
        </h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {violationTypes.map((v) => (
            <motion.div
              key={v.name}
              variants={item}
              className="glass rounded-lg p-5 text-center group hover:border-primary/30 transition-all"
            >
              <v.icon className={`w-8 h-8 mx-auto mb-3 ${v.color}`} />
              <p className="text-sm font-medium text-foreground">{v.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        © 2026 TrafficAI — Smart Traffic Violation Detection System
      </footer>
    </div>
  );
};

export default LandingPage;
