
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const interestOptions = [
  { id: "technology", label: "Technology" },
  { id: "sports", label: "Sports" },
  { id: "cooking", label: "Cooking" },
  { id: "music", label: "Music" },
  { id: "movies", label: "Movies & TV" },
  { id: "travel", label: "Travel" },
  { id: "books", label: "Books & Literature" },
  { id: "art", label: "Art & Design" },
  { id: "gaming", label: "Gaming" },
  { id: "fitness", label: "Fitness & Health" },
  { id: "photography", label: "Photography" },
  { id: "fashion", label: "Fashion" },
];

const profileSchema = z.object({
  birthdate: z.date({
    required_error: "Please select your date of birth",
  }).refine(date => {
    // Ensure user is at least 13 years old
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return date <= minAge;
  }, { message: "You must be at least 13 years old to register" }),
  interests: z.array(z.string()).min(1, { message: "Please select at least one interest" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSetup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the user data from the previous step
  const userData = location.state?.userData;

  // If no user data is present, redirect to the registration page
  if (!userData) {
    navigate("/register");
    return null;
  }

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      interests: [],
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Combine the user data from the previous step with the profile data
      const completeUserData = {
        ...userData,
        birthdate: data.birthdate,
        interests: data.interests,
      };
      
      // Simulate user registration
      console.log("Complete registration data:", completeUserData);
      
      // Show success message
      toast({
        title: "Registration complete!",
        description: "Your account has been created successfully.",
      });
      
      // Redirect to login
      navigate("/login");
    } catch (err) {
      setError("Failed to complete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Complete your profile</CardTitle>
        <CardDescription className="text-center">We need a few more details to personalize your experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const today = new Date();
                          const minAge = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
                          return date > minAge || date < new Date("1900-01-01");
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    You must be at least 13 years old to register.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Interests</FormLabel>
                    <FormDescription>
                      Select topics you're interested in to help us personalize your experience
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {interestOptions.map((interest) => (
                      <FormField
                        key={interest.id}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={interest.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(interest.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, interest.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== interest.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {interest.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/register")}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-social-primary hover:bg-social-secondary"
                disabled={loading}
              >
                {loading ? "Completing..." : "Complete Registration"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;
