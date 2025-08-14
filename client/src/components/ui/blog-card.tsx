import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    category: string;
    featuredImage?: string;
    publishedAt?: string;
    createdAt: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const publishDate = new Date(post.publishedAt || post.createdAt);
  const defaultImage = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
  
  const categoryColors: { [key: string]: string } = {
    'Corporate': 'bg-amber-500',
    'Design': 'bg-pink-500',
    'Planning': 'bg-purple-600',
    'Technology': 'bg-green-600',
    'Sustainability': 'bg-green-500',
    'Catering': 'bg-orange-500',
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow" data-testid={`blog-card-${post.id}`}>
      <div className="relative">
        <img 
          src={post.featuredImage || defaultImage}
          alt={post.title}
          className="w-full h-48 object-cover"
          data-testid={`blog-image-${post.id}`}
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center text-sm text-slate-600 mb-3">
          <Badge 
            className={`mr-3 text-white ${categoryColors[post.category] || 'bg-slate-500'}`}
            data-testid={`blog-category-${post.id}`}
          >
            {post.category}
          </Badge>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span data-testid={`blog-date-${post.id}`}>
              {publishDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2" data-testid={`blog-title-${post.id}`}>
          {post.title}
        </h3>
        
        <p className="text-slate-600 mb-4 line-clamp-3" data-testid={`blog-excerpt-${post.id}`}>
          {post.excerpt}
        </p>
        
        <Button 
          variant="ghost" 
          className="text-purple-600 font-semibold hover:text-purple-800 p-0"
          asChild
          data-testid={`button-read-post-${post.id}`}
        >
          <Link href={`/blog/${post.slug}`}>
            Read More →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
