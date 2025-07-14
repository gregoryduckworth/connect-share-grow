
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SkillsAutocomplete } from "@/components/mentorship/SkillsAutocomplete";

const BecomeMentorPage = () => {
  const [formData, setFormData] = useState({
    bio: "",
    experience: "",
    availability: "",
    skills: [] as string[],
    mentorshipAreas: [] as string[],
    languages: [] as string[]
  });

  const availableSkills = [
    "Leadership", "Communication", "Project Management", "Career Development", 
    "Public Speaking", "Networking", "Strategic Planning", "Team Building",
    "Marketing", "Sales", "Finance", "Data Analysis", "Design", "Writing",
    "Problem Solving", "Critical Thinking", "Time Management", "Negotiation",
    "Customer Service", "Entrepreneurship", "Innovation", "Coaching"
  ];

  const mentorshipAreas = [
    "Career Guidance", "Skill Development", "Leadership Training", "Interview Preparation",
    "Startup Advice", "Personal Branding", "Work-Life Balance", "Networking",
    "Goal Setting", "Confidence Building", "Communication Skills", "Presentation Skills"
  ];

  const languages = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Other"];

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l: string) => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mentor application:", formData);
    // Handle form submission
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/mentorship">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mentors
          </Button>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-social-primary mb-2">Become a Mentor</h1>
          <p className="text-muted-foreground">
            Share your expertise and help others grow in their careers
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Make an Impact</h3>
              <p className="text-sm text-muted-foreground">
                Help shape the next generation of professionals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Build Your Network</h3>
              <p className="text-sm text-muted-foreground">
                Connect with talented individuals across industries
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Earn Recognition</h3>
              <p className="text-sm text-muted-foreground">
                Build your reputation as a thought leader
              </p>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Tell us about your professional background
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your experience, achievements, and what drives you..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
              <CardDescription>
                Add the skills you can mentor others in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SkillsAutocomplete
                label="Skills"
                selectedSkills={formData.skills}
                onSkillsChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
                availableSkills={availableSkills}
                placeholder="Type to add skills..."
              />
              
              <SkillsAutocomplete
                label="Mentorship Areas"
                selectedSkills={formData.mentorshipAreas}
                onSkillsChange={(areas) => setFormData(prev => ({ ...prev, mentorshipAreas: areas }))}
                availableSkills={mentorshipAreas}
                placeholder="Type to add mentorship areas..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability & Preferences</CardTitle>
              <CardDescription>
                Help us match you with the right mentees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 hours per week</SelectItem>
                    <SelectItem value="3-5">3-5 hours per week</SelectItem>
                    <SelectItem value="5-10">5-10 hours per week</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map(language => (
                    <Button
                      key={language}
                      type="button"
                      variant={formData.languages.includes(language) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleLanguage(language)}
                    >
                      {language}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the mentor guidelines and code of conduct
                </Label>
              </div>
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="background" />
                <Label htmlFor="background" className="text-sm">
                  I consent to a background check if required
                </Label>
              </div>
              <Button type="submit" size="lg" className="w-full">
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default BecomeMentorPage;
