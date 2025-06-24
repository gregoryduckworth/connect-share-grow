import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Users, Flag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const AdminSettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "Social Community Platform",
    allowRegistration: true,
    requireEmailVerification: true,
    moderatorRequestsEnabled: true,
    autoApproveCommunities: false,
    maxCommunityNameLength: 50,
    maxPostTitleLength: 200,
    inactiveModerator: 90, // days
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings Saved",
      description: "All settings have been updated successfully.",
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center gap-3 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-social-primary leading-tight">
            Admin Settings
          </h1>
          <p className="text-social-muted text-base">
            Configure platform settings and policies
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* General Settings */}
        <Card className="shadow-md border-2 border-social-primary/10 col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-social-primary" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic platform configuration and display settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) =>
                  handleSettingChange("siteName", e.target.value)
                }
                className="bg-white"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start text-left">
                <Label className="font-semibold text-base">
                  Allow New User Registration
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable new user signups
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) =>
                  handleSettingChange("allowRegistration", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start text-left">
                <Label className="font-semibold text-base">
                  Require Email Verification
                </Label>
                <p className="text-sm text-muted-foreground">
                  Users must verify their email before accessing the platform
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) =>
                  handleSettingChange("requireEmailVerification", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Community Settings */}
        <Card className="shadow-md border-2 border-social-secondary/10 col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Flag className="h-5 w-5 text-social-secondary" />
              Community Settings
            </CardTitle>
            <CardDescription>
              Configure how communities are created and managed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start text-left">
                <Label className="font-semibold text-base">
                  Auto-approve Communities
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new community requests
                </p>
              </div>
              <Switch
                checked={settings.autoApproveCommunities}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoApproveCommunities", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCommunityName">
                Max Community Name Length
              </Label>
              <Input
                id="maxCommunityName"
                type="number"
                value={settings.maxCommunityNameLength}
                onChange={(e) =>
                  handleSettingChange(
                    "maxCommunityNameLength",
                    parseInt(e.target.value)
                  )
                }
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPostTitle">Max Post Title Length</Label>
              <Input
                id="maxPostTitle"
                type="number"
                value={settings.maxPostTitleLength}
                onChange={(e) =>
                  handleSettingChange(
                    "maxPostTitleLength",
                    parseInt(e.target.value)
                  )
                }
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Moderation Settings (full width on mobile, 1 col on desktop) */}
        <Card className="shadow-md border-2 border-social-accent/10 md:col-span-1 col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-social-accent" />
              Moderation Settings
            </CardTitle>
            <CardDescription>
              Configure moderation policies and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start text-left">
                <Label className="font-semibold text-base">
                  Enable Moderator Requests
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to request moderator status for communities
                </p>
              </div>
              <Switch
                checked={settings.moderatorRequestsEnabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("moderatorRequestsEnabled", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inactiveModerator">
                Inactive Moderator Threshold (days)
              </Label>
              <Input
                id="inactiveModerator"
                type="number"
                value={settings.inactiveModerator}
                onChange={(e) =>
                  handleSettingChange(
                    "inactiveModerator",
                    parseInt(e.target.value)
                  )
                }
                className="bg-white"
              />
              <p className="text-sm text-muted-foreground">
                Alert admins when moderators have been inactive for this many
                days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSaveSettings}
          className="bg-social-primary hover:bg-social-secondary px-8 py-2 text-lg font-semibold shadow-md"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
