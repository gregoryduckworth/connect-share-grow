
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  name: string;
  age: string;
  email: string;
  bio: string;
  interests: string[];
}

const ProfilePage = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    age: "28",
    email: "sarah.j@example.com",
    bio: "Software developer passionate about UX design and hiking on weekends.",
    interests: ["Technology", "Hiking", "Photography", "Reading"],
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>({...profile});

  const handleEdit = () => {
    setEditMode(true);
    setEditedProfile({...profile});
  };

  const handleSave = () => {
    setProfile({...editedProfile});
    setEditMode(false);
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-social-primary">My Profile</h1>

      <Card className="border-social-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-social-primary rounded-full flex items-center justify-center text-white">
                <User size={32} />
              </div>
              <div>
                <CardTitle className="text-xl">{profile.name}</CardTitle>
                <CardDescription>Member since April 2025</CardDescription>
              </div>
            </div>
            {!editMode ? (
              <Button onClick={handleEdit} variant="outline" className="border-social-primary text-social-primary">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-social-primary hover:bg-social-secondary">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={editedProfile.name} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    value={editedProfile.age} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Private)</Label>
                <Input 
                  id="email" 
                  name="email" 
                  value={editedProfile.email} 
                  onChange={handleChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={editedProfile.bio} 
                  onChange={handleChange} 
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Name</h3>
                  <p>{profile.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Age</h3>
                  <p>{profile.age}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-500">Bio</h3>
                <p>{profile.bio}</p>
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  <span className="font-medium">Email (Private):</span> {profile.email}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full">
            <h3 className="font-medium text-sm text-gray-500 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <div key={index} className="px-3 py-1 bg-social-accent text-social-tertiary rounded-full text-sm">
                  {interest}
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Friend Connections</CardTitle>
          <CardDescription>You have 24 friends on ConnectSphere</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-12 h-12 bg-social-primary/20 rounded-full flex items-center justify-center">
                <User size={20} className="text-social-primary" />
              </div>
            ))}
            <Button variant="outline" className="h-12 rounded-full border-dashed border-social-muted">
              View All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
