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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

// Form schemas
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  featuredImage: z.string().optional(),
  published: z.boolean().default(false),
});

const galleryItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().min(1, "Image URL is required"),
  category: z.string().min(1, "Category is required"),
  eventType: z.string().optional(),
  featured: z.boolean().default(false),
});

const venueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  capacity: z.number().min(1, "Capacity is required"),
  pricePerDay: z.number().min(0, "Price must be positive"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  available: z.boolean().default(true),
});

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string()).default([]),
  color: z.string().default("primary"),
  icon: z.string().default("Calendar"),
  imageUrl: z.string().optional(),
  active: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [activeEditDialog, setActiveEditDialog] = useState<string | null>(null);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch all data
  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ["/api/quotes"],
    retry: false,
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/contact"],
    retry: false,
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["/api/blog"],
    queryFn: async () => {
      const response = await fetch("/api/blog?published=false");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
    retry: false,
  });

  const { data: galleryItems = [], isLoading: galleryLoading } = useQuery({
    queryKey: ["/api/gallery"],
    retry: false,
  });

  const { data: venues = [], isLoading: venuesLoading } = useQuery({
    queryKey: ["/api/venues"],
    retry: false,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services"],
    retry: false,
  });

  // Calculate dashboard stats
  const totalQuotes = Array.isArray(quotes) ? quotes.length : 0;
  const pendingQuotes = Array.isArray(quotes) ? quotes.filter((q: any) => q.status === 'pending').length : 0;
  const completedQuotes = Array.isArray(quotes) ? quotes.filter((q: any) => q.status === 'completed').length : 0;
  const totalRevenue = Array.isArray(quotes) ? quotes.reduce((sum: number, q: any) => sum + (parseFloat(q.estimatedCost) || 0), 0) : 0;

  // CRUD mutations
  const createBlogMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/blog", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post created successfully" });
      setActiveEditDialog(null);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => await apiRequest("PUT", `/api/blog/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post updated successfully" });
      setActiveEditDialog(null);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => await apiRequest("DELETE", `/api/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Blog post deleted successfully" });
    },
  });

  const createGalleryMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/gallery", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Gallery item created successfully" });
      setActiveEditDialog(null);
    },
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => await apiRequest("DELETE", `/api/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Gallery item deleted successfully" });
    },
  });

  const createVenueMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/venues", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
      toast({ title: "Venue created successfully" });
      setActiveEditDialog(null);
    },
  });

  const updateVenueMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => await apiRequest("PUT", `/api/venues/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
      toast({ title: "Venue updated successfully" });
      setActiveEditDialog(null);
    },
  });

  const deleteVenueMutation = useMutation({
    mutationFn: async (id: string) => await apiRequest("DELETE", `/api/venues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
      toast({ title: "Venue deleted successfully" });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => await apiRequest("POST", "/api/services", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service created successfully" });
      setActiveEditDialog(null);
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => await apiRequest("PUT", `/api/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service updated successfully" });
      setActiveEditDialog(null);
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => await apiRequest("DELETE", `/api/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service deleted successfully" });
    },
  });

  const updateQuoteStatusMutation = useMutation({
    mutationFn: async ({ id, status, estimatedCost }: { id: string, status: string, estimatedCost?: string }) => {
      return apiRequest("PATCH", `/api/quotes/${id}/status`, { status, estimatedCost });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({ title: "Quote updated successfully" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
            <p className="text-slate-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your event business content and monitor performance</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Total Quotes</p>
                  <p className="text-2xl font-bold text-slate-800">{totalQuotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-slate-800">{pendingQuotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-slate-800">{completedQuotes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600">Revenue</p>
                  <p className="text-2xl font-bold text-slate-800">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {/* Quotes Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Quote Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="text-center py-8">Loading quotes...</div>
                ) : Array.isArray(quotes) && quotes.length > 0 ? (
                  <div className="space-y-4">
                    {quotes.map((quote: any) => (
                      <div key={quote.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{quote.name}</h3>
                            <p className="text-sm text-slate-600">{quote.email}</p>
                          </div>
                          <Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>
                            {quote.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">Event: {quote.eventType} - {quote.guestCount} guests</p>
                        <p className="text-sm mb-2">Date: {new Date(quote.eventDate).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <Select 
                            defaultValue={quote.status}
                            onValueChange={(status) => updateQuoteStatusMutation.mutate({ id: quote.id, status })}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No quotes found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Contact Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="text-center py-8">Loading messages...</div>
                ) : Array.isArray(contacts) && contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((contact: any) => (
                      <div key={contact.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{contact.firstName} {contact.lastName}</h3>
                            <p className="text-sm text-slate-600">{contact.email}</p>
                          </div>
                          <Badge variant={contact.status === 'unread' ? 'secondary' : 'default'}>
                            {contact.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{contact.subject}</h4>
                        <p className="text-sm text-slate-600">{contact.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No messages found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blogs Tab */}
          <TabsContent value="blogs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Blog Posts
                </CardTitle>
                <CreateBlogDialog 
                  trigger={<Button className="flex items-center gap-2"><Plus className="h-4 w-4" />New Post</Button>}
                  onSubmit={(data) => createBlogMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                {blogLoading ? (
                  <div className="text-center py-8">Loading blog posts...</div>
                ) : Array.isArray(blogPosts) && blogPosts.length > 0 ? (
                  <div className="space-y-4">
                    {blogPosts.map((post: any) => (
                      <div key={post.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{post.title}</h3>
                            <p className="text-sm text-slate-600">{post.excerpt}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={post.published ? 'default' : 'secondary'}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => updateBlogMutation.mutate({ id: post.id, data: { ...post, published: !post.published } })}>
                              {post.published ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteBlogMutation.mutate(post.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No blog posts found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Gallery Items
                </CardTitle>
                <CreateGalleryDialog 
                  trigger={<Button className="flex items-center gap-2"><Plus className="h-4 w-4" />New Item</Button>}
                  onSubmit={(data) => createGalleryMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                {galleryLoading ? (
                  <div className="text-center py-8">Loading gallery...</div>
                ) : Array.isArray(galleryItems) && galleryItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((item: any) => (
                      <div key={item.id} className="border rounded-lg overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{item.category}</p>
                          <div className="flex justify-between">
                            <Badge variant={item.featured ? 'default' : 'secondary'}>
                              {item.featured ? 'Featured' : 'Regular'}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => deleteGalleryMutation.mutate(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No gallery items found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Venues Tab */}
          <TabsContent value="venues">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Venues
                </CardTitle>
                <CreateVenueDialog 
                  trigger={<Button className="flex items-center gap-2"><Plus className="h-4 w-4" />New Venue</Button>}
                  onSubmit={(data) => createVenueMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                {venuesLoading ? (
                  <div className="text-center py-8">Loading venues...</div>
                ) : Array.isArray(venues) && venues.length > 0 ? (
                  <div className="space-y-4">
                    {venues.map((venue: any) => (
                      <div key={venue.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{venue.name}</h3>
                            <p className="text-sm text-slate-600">{venue.address}, {venue.city}, {venue.state}</p>
                            <p className="text-sm">Capacity: {venue.capacity} • ${venue.pricePerDay}/day</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={venue.available ? 'default' : 'secondary'}>
                              {venue.available ? 'Available' : 'Unavailable'}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => deleteVenueMutation.mutate(venue.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No venues found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Services
                </CardTitle>
                <CreateServiceDialog 
                  trigger={<Button className="flex items-center gap-2"><Plus className="h-4 w-4" />New Service</Button>}
                  onSubmit={(data) => createServiceMutation.mutate(data)}
                />
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="text-center py-8">Loading services...</div>
                ) : Array.isArray(services) && services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service: any) => (
                      <div key={service.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-slate-600">{service.description}</p>
                            <p className="text-sm">Features: {service.features?.join(', ')}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={service.active ? 'default' : 'secondary'}>
                              {service.active ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => updateServiceMutation.mutate({ id: service.id, data: { ...service, active: !service.active } })}>
                              {service.active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteServiceMutation.mutate(service.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">No services found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Create Dialog Components
function CreateBlogDialog({ trigger, onSubmit }: { trigger: React.ReactNode; onSubmit: (data: any) => void }) {
  const form = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "",
      featuredImage: "",
      published: false,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                    <Textarea {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Published</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Blog Post</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateGalleryDialog({ trigger, onSubmit }: { trigger: React.ReactNode; onSubmit: (data: any) => void }) {
  const form = useForm({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      category: "",
      eventType: "",
      featured: false,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Gallery Item</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weddings">Weddings</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="social">Social Events</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Featured</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Gallery Item</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateVenueDialog({ trigger, onSubmit }: { trigger: React.ReactNode; onSubmit: (data: any) => void }) {
  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      capacity: 0,
      pricePerDay: 0,
      amenities: [],
      images: [],
      available: true,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Venue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pricePerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Day</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Available</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Venue</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateServiceDialog({ trigger, onSubmit }: { trigger: React.ReactNode; onSubmit: (data: any) => void }) {
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      features: [],
      color: "primary",
      icon: "Calendar",
      imageUrl: "",
      active: true,
      displayOrder: 0,
    },
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      form.setValue('features', updatedFeatures);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
    form.setValue('features', updatedFeatures);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Features</FormLabel>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature"
                />
                <Button type="button" onClick={addFeature}>Add</Button>
              </div>
              <div className="space-y-1">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{feature}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeFeature(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="accent">Accent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">Create Service</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}