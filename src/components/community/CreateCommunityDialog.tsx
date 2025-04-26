
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  name: z.string().min(3, { message: "Community name must be at least 3 characters." }).max(50),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(500),
  tags: z.array(z.string()).default([]).or(
    z.string().transform((val) => val.split(",").map((tag) => tag.trim()).filter(Boolean))
  )
});

type FormValues = z.infer<typeof formSchema>;

const CreateCommunityDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    }
  });

  const onSubmit = (data: FormValues) => {
    // Here we would submit the community for admin approval
    console.log("Community submitted for approval:", data);
    
    toast({
      title: "Community submitted for approval",
      description: "Your community request has been submitted to the admin team for review.",
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-social-primary hover:bg-social-secondary">
          <Plus className="h-4 w-4 mr-2" /> Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Community</DialogTitle>
          <DialogDescription>
            Create a community around your interests. Your request will be reviewed by an admin.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Photography Enthusiasts" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear, descriptive name for your community.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your best shots, photography tips, and camera recommendations."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Explain what your community is about and who should join.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Photography, Art, Creative" 
                      value={Array.isArray(field.value) ? field.value.join(',') : field.value as string}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Add tags to help others find your community.
                  </FormDescription>
                  {field.value && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(() => {
                        // Safe parsing function to handle all possible types
                        if (Array.isArray(field.value)) {
                          return field.value;
                        } else if (typeof field.value === 'string') {
                          return field.value.split(",");
                        } else {
                          return [];
                        }
                      })().map((tag: string, index: number) => {
                        return tag.trim() ? (
                          <Badge key={index} variant="secondary" className="bg-social-accent/50">
                            {tag.trim()}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-social-primary hover:bg-social-secondary">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityDialog;
