
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Heart, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";

const Index = () => {
  const [hotPosts, setHotPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotPosts = async () => {
      try {
        const posts = await api.getHotPosts();
        setHotPosts(posts);
      } catch (error) {
        console.error("Failed to fetch hot posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotPosts();
  }, []);

  return (
    <div className="min-h-full p-6">
      <div className="space-y-6 animate-fade-in">
        <section className="text-left py-10">
          <h1 className="text-3xl md:text-4xl font-bold text-social-primary mb-2">Welcome to ConnectSphere</h1>
          <p className="text-lg text-social-secondary mb-6">Connect with friends and communities that share your interests</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-social-primary hover:bg-social-secondary">
              <Link to="/communities">
                <Users className="mr-2 h-4 w-4" /> Find Communities
              </Link>
            </Button>
          </div>
        </section>

        {/* Hot Topics Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-social-primary" />
            <h2 className="text-2xl font-bold text-social-primary">Hot Topics</h2>
          </div>
          
          {loading ? (
            <div className="text-left">Loading hot topics...</div>
          ) : (
            <div className="space-y-4">
              {hotPosts.map((post) => (
                <Card key={post.id} className="hover-scale text-left">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">
                          <Link 
                            to={`/community/${post.communityId}/post/${post.id}`}
                            className="hover:text-social-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-social-muted">
                          <span>by {post.author}</span>
                          <span>•</span>
                          <Badge variant="secondary">{post.communityName}</Badge>
                          <span>•</span>
                          <span>{post.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-social-muted mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-social-muted">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Index;
