import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BlogCard from "@/components/ui/blog-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ["/api/blog"],
  });

  const { data: featuredPost } = useQuery({
    queryKey: ["/api/blog/featured"],
    queryFn: async () => {
      // Get the first published post as featured
      if (blogPosts && blogPosts.length > 0) {
        return blogPosts[0];
      }
      return null;
    },
    enabled: !!blogPosts,
  });

  const filteredPosts = blogPosts?.filter((post: any) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const categories = Array.from(new Set(blogPosts?.map((post: any) => post.category) || []));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="blog-hero-title">
            Event Planning Insights
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Get insights, tips, and inspiration for planning the perfect event. Stay updated with the latest trends in event management.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white text-slate-800"
              data-testid="blog-search"
            />
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Featured Article</h2>
            </div>
            
            <Card className="overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto">
                  <img 
                    src={featuredPost.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                    data-testid="featured-post-image"
                  />
                </div>
                <CardContent className="p-8 lg:p-12">
                  <div className="flex items-center text-sm text-slate-600 mb-4">
                    <Badge className="mr-3">Featured</Badge>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span data-testid="featured-post-date">
                      {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4" data-testid="featured-post-title">
                    {featuredPost.title}
                  </h3>
                  <p className="text-slate-600 mb-6 text-lg" data-testid="featured-post-excerpt">
                    {featuredPost.excerpt}
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90" data-testid="featured-post-read-button">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-8 bg-gray-100 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="text-sm">All Categories</Badge>
              {categories.map((category: string) => (
                <Badge key={category} variant="outline" className="text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800">Latest Articles</h2>
            {filteredPosts.length > 0 && (
              <span className="text-slate-600" data-testid="blog-posts-count">
                {filteredPosts.length} articles
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                      <div className="h-6 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12" data-testid="blog-error">
              <div className="text-red-500 mb-4">Failed to load blog posts</div>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12" data-testid="blog-empty">
              <div className="text-slate-600 mb-4">
                {searchTerm ? `No articles found for "${searchTerm}"` : "No blog posts available."}
              </div>
              {searchTerm && (
                <Button onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Get the latest event planning tips, trends, and insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white text-slate-800"
              data-testid="newsletter-email"
            />
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary"
              data-testid="newsletter-subscribe"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
