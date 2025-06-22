
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { User, Camera, MapPin, Calendar, Users } from "lucide-react";

const ProfilePage = () => {
  const { toast } = useToast();
  const [isCurrentUser] = useState(true); // Mock current user check
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Photography enthusiast and community moderator. Love sharing tips and discovering new techniques.",
    location: "San Francisco, CA",
    joinDate: new Date(2023, 0, 15),
    dateOfBirth: new Date(1990, 5, 15),
    avatar: null as string | null,
    communities: [
      { name: "Photography Enthusiasts", role: "Moderator", joinedAt: new Date(2023, 0, 15) },
      { name: "Street Photography", role: "Member", joinedAt: new Date(2023, 2, 10) },
      { name: "Landscape Lovers", role: "Member", joinedAt: new Date(2023, 4, 5) }
    ]
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <AvatarFallback className="bg-social-primary text-white text-2xl">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isCurrentUser && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-social-primary text-white p-2 rounded-full cursor-pointer hover:bg-social-primary/80 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="text-2xl font-bold mb-2"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{profileData.name}</h1>
                    )}
                    <p className="text-social-muted">{profileData.email}</p>
                  </div>
                  
                  {isCurrentUser && (
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button onClick={handleSave}>Save Changes</Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-social-muted">
                    <Calendar className="h-4 w-4" />
                    <span>Age: {calculateAge(profileData.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-social-muted">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {isEditing ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Your location"
                        />
                      ) : (
                        profileData.location
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-social-muted">
                    <User className="h-4 w-4" />
                    <span>Member since {profileData.joinDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <p className="text-social-foreground">{profileData.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Communities Section - Only visible to current user */}
        {isCurrentUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Communities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {profileData.communities.map((community, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{community.name}</h4>
                      <p className="text-sm text-gray-500">
                        Joined {community.joinedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={community.role === "Moderator" ? "default" : "secondary"}>
                      {community.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
