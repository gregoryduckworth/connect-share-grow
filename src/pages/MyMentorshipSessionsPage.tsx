
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Video, MessageCircle, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MyMentorshipSessionsPage = () => {
  const upcomingSessions = [
    {
      id: 1,
      mentor: "Sarah Johnson",
      mentorTitle: "Senior Frontend Developer",
      date: "2024-02-15",
      time: "2:00 PM",
      duration: "1 hour",
      topic: "React Best Practices",
      type: "video",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      mentor: "Michael Chen",
      mentorTitle: "Product Manager",
      date: "2024-02-18",
      time: "10:00 AM",
      duration: "45 minutes",
      topic: "Career Transition to PM",
      type: "video",
      avatar: "/placeholder.svg"
    }
  ];

  const pastSessions = [
    {
      id: 3,
      mentor: "Emily Rodriguez",
      mentorTitle: "UX Designer",
      date: "2024-02-10",
      time: "3:00 PM",
      duration: "1 hour",
      topic: "Portfolio Review",
      type: "video",
      rating: 5,
      feedback: "Excellent session! Emily provided great insights on my portfolio structure.",
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      mentor: "David Kim",
      mentorTitle: "Engineering Manager",
      date: "2024-02-05",
      time: "1:00 PM",
      duration: "1 hour",
      topic: "Leadership Skills",
      type: "video",
      rating: 4,
      feedback: "Very helpful discussion about transitioning to management.",
      avatar: "/placeholder.svg"
    }
  ];

  const menteeRequests = [
    {
      id: 5,
      mentee: "Alex Johnson",
      menteeTitle: "Junior Developer",
      requestedDate: "2024-02-20",
      requestedTime: "4:00 PM",
      topic: "JavaScript Fundamentals",
      message: "I'm struggling with async/await and promises. Would love some guidance!",
      avatar: "/placeholder.svg"
    }
  ];

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

      <div>
        <h1 className="text-3xl font-bold text-social-primary mb-2">My Mentorship Sessions</h1>
        <p className="text-muted-foreground">
          Manage your mentoring sessions and track your progress
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={session.avatar} alt={session.mentor} />
                        <AvatarFallback>{session.mentor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{session.mentor}</h3>
                          <p className="text-sm text-muted-foreground">{session.mentorTitle}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {session.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {session.time} ({session.duration})
                          </div>
                          <Badge variant="outline">
                            <Video className="h-3 w-3 mr-1" />
                            Video Call
                          </Badge>
                        </div>
                        <p className="text-sm"><strong>Topic:</strong> {session.topic}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-1" />
                        Join Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                <p className="text-muted-foreground mb-4">
                  Book a session with a mentor to get started
                </p>
                <Link to="/mentorship">
                  <Button>Find a Mentor</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastSessions.map(session => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={session.avatar} alt={session.mentor} />
                    <AvatarFallback>{session.mentor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold">{session.mentor}</h3>
                      <p className="text-sm text-muted-foreground">{session.mentorTitle}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {session.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {session.rating}/5
                      </div>
                    </div>
                    <p className="text-sm"><strong>Topic:</strong> {session.topic}</p>
                    <p className="text-sm text-muted-foreground">{session.feedback}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {menteeRequests.length > 0 ? (
            menteeRequests.map(request => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.avatar} alt={request.mentee} />
                        <AvatarFallback>{request.mentee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{request.mentee}</h3>
                          <p className="text-sm text-muted-foreground">{request.menteeTitle}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {request.requestedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {request.requestedTime}
                          </div>
                        </div>
                        <p className="text-sm"><strong>Topic:</strong> {request.topic}</p>
                        <p className="text-sm text-muted-foreground">{request.message}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Decline
                      </Button>
                      <Button size="sm">
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No mentorship requests</h3>
                <p className="text-muted-foreground">
                  Mentorship requests will appear here when you become a mentor
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Profile</CardTitle>
              <CardDescription>
                Your profile as seen by potential mentees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Complete your mentor application to set up your profile
                </p>
                <Link to="/mentorship/become-mentor" className="mt-4 inline-block">
                  <Button>Become a Mentor</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyMentorshipSessionsPage;
