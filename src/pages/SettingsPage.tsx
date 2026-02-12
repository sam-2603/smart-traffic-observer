import AppHeader from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SettingsPage = () => {
  const [confidence, setConfidence] = useState([85]);
  const [autoApprove, setAutoApprove] = useState(false);
  const [alertSound, setAlertSound] = useState(true);

  return (
    <div>
      <AppHeader title="Settings" />
      <div className="p-6 max-w-3xl space-y-6">
        {/* Detection Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Detection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-foreground">Confidence Threshold: {confidence[0]}%</Label>
              <Slider value={confidence} onValueChange={setConfidence} min={50} max={99} step={1} />
              <p className="text-xs text-muted-foreground">Only violations above this confidence level will be recorded</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Auto-approve High Confidence</Label>
                <p className="text-xs text-muted-foreground">Automatically verify violations above 95% confidence</p>
              </div>
              <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Alert Sound</Label>
                <p className="text-xs text-muted-foreground">Play sound on new violation detection</p>
              </div>
              <Switch checked={alertSound} onCheckedChange={setAlertSound} />
            </div>
          </CardContent>
        </Card>

        {/* Penalty Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Penalty Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Red Light Violation", defaultVal: "1000" },
              { label: "Overspeeding", defaultVal: "2000" },
              { label: "No Helmet", defaultVal: "1000" },
              { label: "Wrong Way", defaultVal: "1500" },
              { label: "Stop Line", defaultVal: "500" },
            ].map((p) => (
              <div key={p.label} className="flex items-center gap-4">
                <Label className="w-40 text-foreground text-sm">{p.label}</Label>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                  <Input defaultValue={p.defaultVal} className="pl-7 bg-secondary border-border text-foreground" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Backend Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-foreground">API Base URL</Label>
              <Input defaultValue="http://localhost:5000/api" className="mt-1 bg-secondary border-border text-foreground" />
            </div>
            <div>
              <Label className="text-foreground">Python Service URL</Label>
              <Input defaultValue="http://localhost:5001" className="mt-1 bg-secondary border-border text-foreground" />
            </div>
          </CardContent>
        </Card>

        <Button size="lg" className="w-full">Save Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
