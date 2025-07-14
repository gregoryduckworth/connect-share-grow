
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, Users, BookOpen, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const MentorshipPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = [
    "React", "JavaScript", "TypeScript", "Node.js", "Python", 
    "UI/UX Design", "Product Management", "Data Science", "DevOps", "Mobile Development"
  ];

  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      rating: 4.9,
      sessions: 127,
      skills: ["React", "JavaScript", "TypeScript"],
      bio: "Helping developers master modern web development with 8+ years of experience.",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Product Manager",
      company: "StartupXYZ",
      rating: 4.8,
      sessions: 93,
      skills: ["Product Management", "Strategy", "Analytics"],
      bio: "Passionate about building products that users love. Former Google PM.",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "UX Designer",
      company: "Design Studio",
      rating: 4.9,
      sessions: 156,
      skills: ["UI/UX Design", "Figma", "User Research"],
      bio: "Creating delightful user experiences with a focus on accessibility.",
      avatar: "/placeholder.svg"
    }
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mentor.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => mentor.skills.includes(skill));
    
    return matchesSearch && matchesSkills;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-social-primary mb-2">Find a Mentor</h1>
          <p className="text-muted-foreground">
            Connect with experienced professionals to accelerate your growth
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/mentorship/become-mentor">
            <Button variant="outline">Become a Mentor</Button>
          </Link>
          <Link to="/mentorship/my-sessions">
            <Button>My Sessions</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Mentors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, title, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Filter by Skills:</p>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map(mentor => (
          <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>
                  <p className="text-sm text-muted-foreground">{mentor.company}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{mentor.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{mentor.sessions} sessions</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {mentor.skills.slice(0, 3).map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {mentor.skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{mentor.skills.length - 3} more
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mentor.bio}
              </p>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No mentors found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all available mentors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MentorshipPage;
