import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const postSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
  tag: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  communityId: string;
  onPostCreated: () => void;
}

const CreatePostForm = ({
  communityId,
  onPostCreated,
}: CreatePostFormProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      tag: "",
    },
  });

  const onSubmit = (data: PostFormData) => {
    // Simulate creating a post
    console.log("Creating post:", {
      ...data,
      tags,
      communityId,
      createdAt: new Date(),
    });

    // Show success message
    toast({
      title: "Post created",
      description: "Your post has been published successfully.",
    });

    // Reset form
    form.reset();
    setTags([]);

    // Close dialog
    setIsDialogOpen(false);

    // Notify parent component
    onPostCreated();
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) return;
    if (tags.includes(tag)) {
      toast({
        title: "Duplicate tag",
        description: "This tag has already been added.",
      });
      return;
    }
    if (tags.length >= 5) {
      toast({
        title: "Too many tags",
        description: "You can only add up to 5 tags.",
      });
      return;
    }

    setTags([...tags, tag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-social-primary hover:bg-social-secondary">
          <Plus className="h-4 w-4 mr-2" />
          Create New Post
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts with the community. Be respectful and follow
            community guidelines.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a title for your post"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts or ask a question..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tags (optional)</FormLabel>
              <div className="flex items-center">
                <Input
                  placeholder="Add tags..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="mr-2"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 bg-social-accent/50"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag} tag</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-social-primary hover:bg-social-secondary"
              >
                Publish Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostForm;
