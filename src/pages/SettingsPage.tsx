import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Palette } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { t, getSupportedLanguages } from "@/lib/i18n";
import { useTheme } from "@/contexts/ThemeContext";

const SettingsPage = () => {
  const { toast } = useToast();
  const { theme, language, setTheme, updateLanguage } = useTheme();
  const [profile, setProfile] = useState({
    displayName: "John Doe",
    bio: "Photography enthusiast and community moderator",
    location: "San Francisco, CA",
  });

  const [notifications, setNotifications] = useState({
    communityUpdates: true,
    directMessages: true,
    connectionRequests: true,
  });

  const [privacy, setPrivacy] = useState({
    showLocation: true,
    allowDirectMessages: true,
  });

  // Force re-render when language changes
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const handleSaveProfile = () => {
    toast({
      title: t("settings.profile") + " updated",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance settings updated",
      description: "Your appearance preferences have been saved.",
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    updateLanguage(newLanguage);
    toast({
      title: t("settings.language") + " updated",
      description: "Language has been changed successfully.",
    });
  };

  return (
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="settings-page-root"
    >
      <div className="mb-6 text-left" data-testid="settings-header">
        <h1
          className="text-2xl sm:text-3xl font-bold text-foreground mb-2"
          data-testid="settings-title"
        >
          {t("settings.title")}
        </h1>
        <p
          className="text-sm sm:text-base text-muted-foreground"
          data-testid="settings-subtitle"
        >
          Manage your account preferences and privacy settings
        </p>
      </div>

      <Tabs
        defaultValue="profile"
        className="w-full"
        data-testid="settings-tabs"
      >
        <TabsList
          className="grid w-full grid-cols-4 mb-6"
          data-testid="settings-tabs-list"
        >
          <TabsTrigger
            value="profile"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            data-testid="settings-tab-profile"
          >
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t("settings.profile")}</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            data-testid="settings-tab-notifications"
          >
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {t("settings.notifications")}
            </span>
            <span className="sm:hidden">Notifs</span>
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            data-testid="settings-tab-privacy"
          >
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t("settings.privacy")}</span>
            <span className="sm:hidden">Privacy</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            data-testid="settings-tab-appearance"
          >
            <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t("settings.appearance")}</span>
            <span className="sm:hidden">Theme</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="profile"
          className="mt-6"
          data-testid="settings-tab-content-profile"
        >
          <Card>
            <CardHeader className="text-left">
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and bio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    data-testid="settings-profile-displayname-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    data-testid="settings-profile-location-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell others about yourself..."
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  data-testid="settings-profile-bio-textarea"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                data-testid="settings-profile-save-btn"
              >
                {t("settings.save")} Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="mt-6"
          data-testid="settings-tab-content-notifications"
        >
          <Card>
            <CardHeader className="text-left">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div
                className="flex items-center justify-between"
                data-testid="settings-notifications-community-updates-row"
              >
                <div>
                  <Label
                    htmlFor="communityUpdates"
                    className="text-base font-medium"
                  >
                    Community Updates
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications about community activity
                  </p>
                </div>
                <Switch
                  id="communityUpdates"
                  checked={notifications.communityUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      communityUpdates: checked,
                    }))
                  }
                  data-testid="settings-notifications-community-updates-switch"
                />
              </div>

              <div
                className="flex items-center justify-between"
                data-testid="settings-notifications-direct-messages-row"
              >
                <div>
                  <Label
                    htmlFor="directMessages"
                    className="text-base font-medium"
                  >
                    Direct Messages
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for new messages
                  </p>
                </div>
                <Switch
                  id="directMessages"
                  checked={notifications.directMessages}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      directMessages: checked,
                    }))
                  }
                  data-testid="settings-notifications-direct-messages-switch"
                />
              </div>

              <div
                className="flex items-center justify-between"
                data-testid="settings-notifications-connection-requests-row"
              >
                <div>
                  <Label
                    htmlFor="connectionRequests"
                    className="text-base font-medium"
                  >
                    Connection Requests
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications for connection requests
                  </p>
                </div>
                <Switch
                  id="connectionRequests"
                  checked={notifications.connectionRequests}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      connectionRequests: checked,
                    }))
                  }
                  data-testid="settings-notifications-connection-requests-switch"
                />
              </div>

              <Button
                onClick={handleSaveNotifications}
                data-testid="settings-notifications-save-btn"
              >
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="privacy"
          className="mt-6"
          data-testid="settings-tab-content-privacy"
        >
          <Card>
            <CardHeader className="text-left">
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and contact you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div
                className="flex items-center justify-between"
                data-testid="settings-privacy-show-location-row"
              >
                <div>
                  <Label
                    htmlFor="showLocation"
                    className="text-base font-medium"
                  >
                    Show Location
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display your location on your profile
                  </p>
                </div>
                <Switch
                  id="showLocation"
                  checked={privacy.showLocation}
                  onCheckedChange={(checked) =>
                    setPrivacy((prev) => ({ ...prev, showLocation: checked }))
                  }
                  data-testid="settings-privacy-show-location-switch"
                />
              </div>

              <div
                className="flex items-center justify-between"
                data-testid="settings-privacy-allow-dms-row"
              >
                <div>
                  <Label
                    htmlFor="allowDirectMessages"
                    className="text-base font-medium"
                  >
                    Allow Direct Messages
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Let others send you direct messages
                  </p>
                </div>
                <Switch
                  id="allowDirectMessages"
                  checked={privacy.allowDirectMessages}
                  onCheckedChange={(checked) =>
                    setPrivacy((prev) => ({
                      ...prev,
                      allowDirectMessages: checked,
                    }))
                  }
                  data-testid="settings-privacy-allow-dms-switch"
                />
              </div>

              <Button
                onClick={handleSavePrivacy}
                data-testid="settings-privacy-save-btn"
              >
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="appearance"
          className="mt-6"
          data-testid="settings-tab-content-appearance"
        >
          <Card>
            <CardHeader className="text-left">
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={theme}
                  onValueChange={setTheme}
                  data-testid="settings-appearance-theme-select"
                >
                  <SelectTrigger data-testid="settings-appearance-theme-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="light"
                      data-testid="settings-appearance-theme-light"
                    >
                      Light
                    </SelectItem>
                    <SelectItem
                      value="dark"
                      data-testid="settings-appearance-theme-dark"
                    >
                      Dark
                    </SelectItem>
                    <SelectItem
                      value="system"
                      data-testid="settings-appearance-theme-system"
                    >
                      System
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">{t("settings.language")}</Label>
                <Select
                  value={language}
                  onValueChange={handleLanguageChange}
                  data-testid="settings-appearance-language-select"
                >
                  <SelectTrigger data-testid="settings-appearance-language-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getSupportedLanguages().map((lang) => (
                      <SelectItem
                        key={lang.code}
                        value={lang.code}
                        data-testid={`settings-appearance-language-option-${lang.code}`}
                      >
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSaveAppearance}
                data-testid="settings-appearance-save-btn"
              >
                {t("settings.save")} Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
