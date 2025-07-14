
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, BookOpen, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BecomeMentorPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    bio: "",
    experience: "",
    availability: "",
    hourlyRate: "",
    skills: [] as string[],
    mentorshipAreas: [] as string[],
    languages: [] as string[]
  });

  const availableSkills = [
    "React", "JavaScript", "TypeScript", "Node.js", "Python", 
    "UI/UX Design", "Product Management", "Data Science", "DevOps", 
    "Mobile Development", "Machine Learning", "Cloud Computing"
  ];

  const mentorshipAreas = [
    "Career Guidance", "Technical Skills", "Leadership", "Interview Prep",
    "Startup Advice", "Code Review", "Project Management", "Personal Branding"
  ];

  const languages = ["English", "Spanish", "French", "German", "Mandarin", "Japanese", "Other"];

  const toggleItem = (item: string, field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Microsoft, Startup"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>
              
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
                Select the skills you can mentor others in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableSkills.map(skill => (
                    <Badge
                      key={skill}
                      variant={formData.skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleItem(skill, 'skills')}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Mentorship Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mentorshipAreas.map(area => (
                    <Badge
                      key={area}
                      variant={formData.mentorshipAreas.includes(area) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleItem(area, 'mentorshipAreas')}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
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
              <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="rate">Hourly Rate (Optional)</Label>
                  <Input
                    id="rate"
                    type="number"
                    placeholder="Leave empty for free mentoring"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {languages.map(language => (
                    <Badge
                      key={language}
                      variant={formData.languages.includes(language) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleItem(language, 'languages')}
                    >
                      {language}
                    </Badge>
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
