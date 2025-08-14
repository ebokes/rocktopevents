import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  Star, 
  Users, 
  TrendingUp,
  MessageCircle,
  Image,
  MapPin,
  BarChart3,
  Download,
  RefreshCw
} from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch dashboard data
  const { data: quotes, isLoading: quotesLoading, error: quotesError } = useQuery({
    queryKey: ["/api/quotes"],
    retry: false,
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/contact"],
    retry: false,
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog?published=false");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
    retry: false,
  });

  const { data: galleryItems, isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/gallery"],
    retry: false,
  });

  const { data: venues, isLoading: venuesLoading } = useQuery({
    queryKey: ["/api/venues"],
    retry: false,
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (quotesError && isUnauthorizedError(quotesError as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [quotesError, toast]);

  // Update quote status mutation
  const updateQuoteStatusMutation = useMutation({
    mutationFn: async ({ id, status, estimatedCost }: { id: string, status: string, estimatedCost?: string }) => {
      return apiRequest("PATCH", `/api/quotes/${id}/status`, { status, estimatedCost });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({ title: "Quote updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update quote",
        variant: "destructive",
      });
    },
  });

  // Update contact message status mutation
  const updateContactStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return apiRequest("PATCH", `/api/contact/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
      toast({ title: "Message updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  // Calculate dashboard stats
  const totalQuotes = quotes?.length || 0;
  const pendingQuotes = quotes?.filter((q: any) => q.status === "pending")?.length || 0;
  const completedEvents = quotes?.filter((q: any) => q.status === "completed")?.length || 0;
  const totalRevenue = quotes?.reduce((sum: number, q: any) => {
    return sum + (parseFloat(q.estimatedCost || "0"));
  }, 0) || 0;

  const stats = [
    {
      title: "Total Bookings",
      value: totalQuotes.toString(),
      change: "+12% from last month",
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: "Revenue",
      value: `$${Math.round(totalRevenue).toLocaleString()}`,
      change: "+8% from last month", 
      icon: DollarSign,
      color: "text-secondary",
    },
    {
      title: "Active Quotes",
      value: pendingQuotes.toString(),
      change: "Pending response",
      icon: FileText,
      color: "text-accent",
    },
    {
      title: "Client Satisfaction",
      value: "4.9",
      change: "Average rating",
      icon: Star,
      color: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2" data-testid="admin-title">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Manage your events, bookings, and content</p>
          </div>
          <div className="mt-4 lg:mt-0 flex gap-3">
            <Button variant="outline" data-testid="export-data">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                queryClient.invalidateQueries();
                toast({ title: "Dashboard refreshed" });
              }}
              data-testid="refresh-dashboard"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} data-testid={`stat-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                      <Icon className={`${stat.color} h-6 w-6`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="quotes" data-testid="tab-quotes">Quotes</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Messages</TabsTrigger>
            <TabsTrigger value="blog" data-testid="tab-blog">Blog</TabsTrigger>
            <TabsTrigger value="gallery" data-testid="tab-gallery">Gallery</TabsTrigger>
            <TabsTrigger value="venues" data-testid="tab-venues">Venues</TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Quote Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="text-center py-8">Loading quotes...</div>
                ) : quotes && quotes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="pb-3 text-sm font-medium text-slate-600">Client</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Event</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Date</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Status</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Value</th>
                          <th className="pb-3 text-sm font-medium text-slate-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {quotes.map((quote: any) => (
                          <tr key={quote.id} data-testid={`quote-row-${quote.id}`}>
                            <td className="py-4">
                              <div>
                                <div className="text-sm font-medium text-slate-800">{quote.name}</div>
                                <div className="text-sm text-slate-600">{quote.email}</div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="text-sm font-medium text-slate-800">{quote.eventType}</div>
                              <div className="text-sm text-slate-600">{quote.guestCount} guests</div>
                            </td>
                            <td className="py-4 text-sm text-slate-600">
                              {new Date(quote.eventDate).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                              <Select 
                                value={quote.status} 
                                onValueChange={(status) => 
                                  updateQuoteStatusMutation.mutate({ id: quote.id, status })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="reviewing">Reviewing</SelectItem>
                                  <SelectItem value="quoted">Quoted</SelectItem>
                                  <SelectItem value="accepted">Accepted</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-4 text-sm font-medium text-slate-800">
                              ${quote.estimatedCost ? parseFloat(quote.estimatedCost).toLocaleString() : "-"}
                            </td>
                            <td className="py-4">
                              <Button size="sm" variant="outline" data-testid={`view-quote-${quote.id}`}>
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    No quote requests found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Messages Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="text-center py-8">Loading messages...</div>
                ) : contacts && contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((message: any) => (
                      <Card key={message.id} data-testid={`message-${message.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-slate-800">
                                  {message.firstName} {message.lastName}
                                </h3>
                                <Badge 
                                  variant={message.status === "unread" ? "default" : "secondary"}
                                >
                                  {message.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{message.email}</p>
                              <p className="text-sm font-medium text-slate-800 mb-2">
                                Subject: {message.subject}
                              </p>
                              <p className="text-slate-600">{message.message}</p>
                              <p className="text-sm text-slate-500 mt-2">
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {message.status === "unread" && (
                                <Button 
                                  size="sm" 
                                  onClick={() => 
                                    updateContactStatusMutation.mutate({ id: message.id, status: "read" })
                                  }
                                  data-testid={`mark-read-${message.id}`}
                                >
                                  Mark Read
                                </Button>
                              )}
                              <Button size="sm" variant="outline" data-testid={`reply-${message.id}`}>
                                Reply
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    No contact messages found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Blog Posts
                  </CardTitle>
                  <Button data-testid="create-blog-post">
                    Create New Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blogLoading ? (
                  <div className="text-center py-8">Loading blog posts...</div>
                ) : blogPosts && blogPosts.length > 0 ? (
                  <div className="space-y-4">
                    {blogPosts.map((post: any) => (
                      <Card key={post.id} data-testid={`blog-post-${post.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium text-slate-800">{post.title}</h3>
                                <Badge variant={post.published ? "default" : "secondary"}>
                                  {post.published ? "Published" : "Draft"}
                                </Badge>
                                <Badge variant="outline">{post.category}</Badge>
                              </div>
                              <p className="text-slate-600 line-clamp-2">{post.excerpt}</p>
                              <p className="text-sm text-slate-500 mt-2">
                                Created: {new Date(post.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid={`edit-post-${post.id}`}>
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`delete-post-${post.id}`}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    No blog posts found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Image className="mr-2 h-5 w-5" />
                    Gallery Items
                  </CardTitle>
                  <Button data-testid="upload-gallery-item">
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {galleryLoading ? (
                  <div className="text-center py-8">Loading gallery...</div>
                ) : galleryItems && galleryItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item: any) => (
                      <Card key={item.id} data-testid={`gallery-item-${item.id}`}>
                        <div className="aspect-video">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-slate-800 mb-1">{item.title}</h3>
                          <Badge variant="outline" className="mb-2">{item.category}</Badge>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline">Delete</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    No gallery items found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Venues
                  </CardTitle>
                  <Button data-testid="add-venue">
                    Add Venue
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {venuesLoading ? (
                  <div className="text-center py-8">Loading venues...</div>
                ) : venues && venues.length > 0 ? (
                  <div className="space-y-4">
                    {venues.map((venue: any) => (
                      <Card key={venue.id} data-testid={`venue-${venue.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-800 mb-1">{venue.name}</h3>
                              <p className="text-sm text-slate-600 mb-2">
                                {venue.city}, {venue.state}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>Capacity: {venue.capacity}</span>
                                <span>Price: ${venue.pricePerDay}/day</span>
                                <span>Rating: {venue.rating} ({venue.reviewCount} reviews)</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid={`edit-venue-${venue.id}`}>
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" data-testid={`delete-venue-${venue.id}`}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-600">
                    No venues found.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
