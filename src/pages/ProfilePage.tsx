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
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCurrentUser] = useState(!!user);
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
      {
        name: "Photography Enthusiasts",
        role: "Moderator",
        joinedAt: new Date(2023, 0, 15),
      },
      {
        name: "Street Photography",
        role: "Member",
        joinedAt: new Date(2023, 2, 10),
      },
      {
        name: "Landscape Lovers",
        role: "Member",
        joinedAt: new Date(2023, 4, 5),
      },
    ],
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
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
        setProfileData((prev) => ({
          ...prev,
          avatar: e.target?.result as string,
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
    <div
      className="p-4 md:p-6 space-y-6 bg-background min-h-screen"
      data-testid="profile-page-root"
    >
      <div className="grid gap-6">
        {/* Profile Header */}
        <Card data-testid="profile-header-card">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div
                  className="relative"
                  data-testid="profile-avatar-container"
                >
                  <Avatar className="h-24 w-24" data-testid="profile-avatar">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        data-testid="profile-avatar-img"
                      />
                    ) : (
                      <AvatarFallback
                        className="bg-social-primary text-white text-2xl"
                        data-testid="profile-avatar-fallback"
                      >
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
                        data-testid="profile-avatar-upload-input"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-social-primary text-white p-2 rounded-full cursor-pointer hover:bg-social-primary/80 transition-colors"
                        data-testid="profile-avatar-upload-label"
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
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="text-2xl font-bold mb-2"
                        data-testid="profile-name-input"
                      />
                    ) : (
                      <h1
                        className="text-2xl font-bold"
                        data-testid="profile-name"
                      >
                        {profileData.name}
                      </h1>
                    )}
                    <p
                      className="text-social-muted"
                      data-testid="profile-email"
                    >
                      {profileData.email}
                    </p>
                  </div>

                  {isCurrentUser && (
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            onClick={handleSave}
                            data-testid="profile-save-btn"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            data-testid="profile-cancel-btn"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          data-testid="profile-edit-btn"
                        >
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="flex items-center gap-2 text-social-muted"
                    data-testid="profile-age-row"
                  >
                    <Calendar className="h-4 w-4" />
                    <span data-testid="profile-age">
                      Age: {calculateAge(profileData.dateOfBirth)}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-social-muted"
                    data-testid="profile-location-row"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>
                      {isEditing ? (
                        <Input
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Your location"
                          data-testid="profile-location-input"
                        />
                      ) : (
                        <span data-testid="profile-location">
                          {profileData.location}
                        </span>
                      )}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-social-muted"
                    data-testid="profile-join-date-row"
                  >
                    <User className="h-4 w-4" />
                    <span data-testid="profile-join-date">
                      Member since {profileData.joinDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card data-testid="profile-bio-card">
          <CardHeader>
            <CardTitle data-testid="profile-bio-title">About</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    placeholder="Tell us about yourself..."
                    rows={4}
                    data-testid="profile-bio-input"
                  />
                </div>
              </div>
            ) : (
              <p className="text-social-foreground" data-testid="profile-bio">
                {profileData.bio}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Communities Section - Only visible to current user */}
        {isCurrentUser && (
          <Card data-testid="profile-communities-card">
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2"
                data-testid="profile-communities-title"
              >
                <Users className="h-5 w-5" />
                My Communities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid gap-4"
                data-testid="profile-communities-list"
              >
                {profileData.communities.map((community, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    data-testid={`profile-community-row-${index}`}
                  >
                    <div>
                      <h4
                        className="font-medium"
                        data-testid={`profile-community-name-${index}`}
                      >
                        {community.name}
                      </h4>
                      <p
                        className="text-sm text-gray-500"
                        data-testid={`profile-community-joined-${index}`}
                      >
                        Joined {community.joinedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        community.role === "Moderator" ? "default" : "secondary"
                      }
                      data-testid={`profile-community-role-badge-${index}`}
                    >
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
