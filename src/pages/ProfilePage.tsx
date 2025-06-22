import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Save, User, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserProfile {
  name: string;
  dateOfBirth: string;
  email: string;
  bio: string;
  interests: string[];
  avatarUrl?: string;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Sarah Johnson",
    dateOfBirth: "1996-03-15",
    email: "sarah.j@example.com",
    bio: "Software developer passionate about UX design and hiking on weekends.",
    interests: ["Technology", "Hiking", "Photography", "Reading"],
    avatarUrl: undefined
  });

  const [editedProfile, setEditedProfile] = useState<UserProfile>({...profile});

  // Mock joined communities data
  const [joinedCommunities] = useState([
    {
      id: "1",
      name: "Photography Enthusiasts",
      memberCount: 1250,
      role: "Member",
      joinedAt: new Date(2024, 2, 15)
    },
    {
      id: "2",
      name: "Web Developers",
      memberCount: 5721,
      role: "Moderator",
      joinedAt: new Date(2024, 1, 8)
    },
    {
      id: "3",
      name: "Fitness & Wellness",
      memberCount: 3189,
      role: "Member",
      joinedAt: new Date(2024, 0, 22)
    }
  ]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

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

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedProfile(prev => ({ ...prev, avatarUrl: result }));
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in p-6">
      <h1 className="text-3xl font-bold text-social-primary">My Profile</h1>

      <Card className="border-social-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-social-primary rounded-full flex items-center justify-center text-white overflow-hidden">
                  {(editMode ? editedProfile.avatarUrl : profile.avatarUrl) ? (
                    <img 
                      src={editMode ? editedProfile.avatarUrl : profile.avatarUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                {editMode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <label htmlFor="avatar-upload" className="cursor-pointer text-white">
                      <Upload size={20} />
                    </label>
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                )}
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
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input 
                    id="dateOfBirth" 
                    name="dateOfBirth" 
                    type="date"
                    value={editedProfile.dateOfBirth} 
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
                  <p>{calculateAge(profile.dateOfBirth)} years old</p>
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

      {/* Joined Communities */}
      <Card>
        <CardHeader>
          <CardTitle>My Communities</CardTitle>
          <CardDescription>Communities you're a member of ({joinedCommunities.length})</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {joinedCommunities.map((community) => (
              <div key={community.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{community.name}</h4>
                  <Badge variant={community.role === "Moderator" ? "default" : "secondary"}>
                    {community.role}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {community.memberCount.toLocaleString()} members
                </p>
                <p className="text-xs text-gray-400">
                  Joined {community.joinedAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
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
