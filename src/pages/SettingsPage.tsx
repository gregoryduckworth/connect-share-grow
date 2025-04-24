
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [accountSettings, setAccountSettings] = useState({
    email: "user@example.com",
    password: "••••••••",
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "everyone",
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowDirectMessages: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    friendRequests: true,
    messages: true,
    communityUpdates: true,
    emailNotifications: false,
  });

  const handleAccountChange = (field: string, value: string) => {
    setAccountSettings({
      ...accountSettings,
      [field]: value,
    });
  };

  const handlePrivacyChange = (field: string, value: boolean | string) => {
    setPrivacySettings({
      ...privacySettings,
      [field]: value,
    });
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value,
    });
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-social-primary">Settings</h1>
      <p className="text-social-muted">Manage your account settings and preferences</p>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account information and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => handleAccountChange("email", e.target.value)}
                />
                <p className="text-xs text-social-muted">This email is private and used only for account purposes.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={accountSettings.password}
                  onChange={(e) => handleAccountChange("password", e.target.value)}
                />
                <p className="text-xs text-social-muted">Use a strong password with at least 8 characters.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-social-primary hover:bg-social-secondary" onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account access and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Download Your Data</h4>
                  <p className="text-sm text-social-muted">Get a copy of your personal data</p>
                </div>
                <Button variant="outline">Download</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-social-muted">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and visibility on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Online Status</Label>
                  <p className="text-sm text-social-muted">Allow others to see when you're online</p>
                </div>
                <Switch 
                  checked={privacySettings.showOnlineStatus}
                  onCheckedChange={(checked) => handlePrivacyChange("showOnlineStatus", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Friend Requests</Label>
                  <p className="text-sm text-social-muted">Let others send you friend requests</p>
                </div>
                <Switch 
                  checked={privacySettings.allowFriendRequests}
                  onCheckedChange={(checked) => handlePrivacyChange("allowFriendRequests", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Direct Messages</Label>
                  <p className="text-sm text-social-muted">Let others send you direct messages</p>
                </div>
                <Switch 
                  checked={privacySettings.allowDirectMessages}
                  onCheckedChange={(checked) => handlePrivacyChange("allowDirectMessages", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-social-primary hover:bg-social-secondary" onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Friend Requests</Label>
                  <p className="text-sm text-social-muted">Get notified about new friend requests</p>
                </div>
                <Switch 
                  checked={notificationSettings.friendRequests}
                  onCheckedChange={(checked) => handleNotificationChange("friendRequests", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Messages</Label>
                  <p className="text-sm text-social-muted">Get notified about new messages</p>
                </div>
                <Switch 
                  checked={notificationSettings.messages}
                  onCheckedChange={(checked) => handleNotificationChange("messages", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Community Updates</Label>
                  <p className="text-sm text-social-muted">Get notified about updates in your communities</p>
                </div>
                <Switch 
                  checked={notificationSettings.communityUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("communityUpdates", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-social-muted">Receive important updates via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-social-primary hover:bg-social-secondary" onClick={saveSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
