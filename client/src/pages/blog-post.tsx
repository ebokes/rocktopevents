import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingChat from "@/components/layout/floating-chat";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/seo";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog post not found");
        }
        throw new Error("Failed to fetch blog post");
      }
      return response.json();
    },
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["/api/blog/related", post?.category],
    queryFn: async () => {
      if (!post) return [];
      const response = await fetch(`/api/blog`);
      if (!response.ok) return [];
      const allPosts = await response.json();
      return allPosts
        .filter((p: any) => p.category === post.category && p.id !== post.id)
        .slice(0, 3);
    },
    enabled: !!post,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4" />
            <div className="h-12 bg-gray-200 rounded mb-6" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-red-500 mb-4" data-testid="blog-post-error">
            {error?.message || "Blog post not found"}
          </div>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryColors: { [key: string]: string } = {
    'Corporate': 'bg-amber-500',
    'Design': 'bg-pink-500',
    'Planning': 'bg-purple-600',
    'Technology': 'bg-green-600',
    'Sustainability': 'bg-green-500',
    'Catering': 'bg-orange-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${post.title} — Blog`}
        description={post.excerpt}
        type="article"
        image={post.featuredImage}
        publishedTime={(post.publishedAt || post.createdAt) as string}
        modifiedTime={(post.updatedAt || post.publishedAt || post.createdAt) as string}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          image: post.featuredImage ? [post.featuredImage] : undefined,
          datePublished: post.publishedAt || post.createdAt,
          dateModified: post.updatedAt || post.publishedAt || post.createdAt,
          mainEntityOfPage: typeof window !== "undefined" ? window.location.href : undefined,
          author: {
            "@type": "Organization",
            name: "ROCKTOP Premium Events",
          },
          publisher: {
            "@type": "Organization",
            name: "ROCKTOP Premium Events",
            logo: {
              "@type": "ImageObject",
              url:
                typeof window !== "undefined"
                  ? `${window.location.origin}/favicon.ico`
                  : "/favicon.ico",
            },
          },
        }}
      />
      <Navbar />
      
      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4" data-testid="back-to-blog">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Badge 
              className={`mr-4 text-white ${categoryColors[post.category] || 'bg-slate-500'}`}
              data-testid="blog-post-category"
            >
              {post.category}
            </Badge>
            <Calendar className="h-4 w-4 mr-1" />
            <span data-testid="blog-post-date">
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight" data-testid="blog-post-title">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8" data-testid="blog-post-excerpt">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-8 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-medium mr-4">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-slate-800">ROCKTOP Team</p>
                <p className="text-sm text-slate-600">Event Planning Experts</p>
              </div>
            </div>
            
            <Button variant="outline" size="sm" data-testid="share-button">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img 
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              data-testid="blog-post-featured-image"
            />
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          data-testid="blog-post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h3 className="text-sm font-medium text-foreground mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="outline" data-testid={`tag-${index}`}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost: any) => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32">
                    <img 
                      src={relatedPost.featuredImage || "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge 
                      className={`mb-2 text-white ${categoryColors[relatedPost.category] || 'bg-slate-500'}`}
                      size="sm"
                    >
                      {relatedPost.category}
                    </Badge>
                    <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
      
      {/* Floating Chat Icons */}
      <FloatingChat />
    </div>
  );
}
