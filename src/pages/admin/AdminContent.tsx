import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Testimonial {
  id?: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image_url?: string;
  active: boolean;
}

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  active: boolean;
}

interface GalleryItem {
  id?: number;
  title: string;
  image_url: string;
  alt_text: string;
  description?: string;
  active: boolean;
}

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState<"testimonials" | "faqs" | "gallery">("testimonials");
  const [editingItem, setEditingItem] = useState<any>(null);
  const queryClient = useQueryClient();

  // Testimonials queries and mutations
  const { data: testimonials = [], refetch: refetchTestimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createTestimonialMutation = useMutation({
    mutationFn: async (testimonial: Omit<Testimonial, 'id'>) => {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(testimonial)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Testimonial created successfully!");
      refetchTestimonials();
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error creating testimonial:', error);
      toast.error("Failed to create testimonial");
    }
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, ...testimonial }: Testimonial) => {
      const { data, error } = await supabase
        .from('testimonials')
        .update(testimonial)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Testimonial updated successfully!");
      refetchTestimonials();
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error updating testimonial:', error);
      toast.error("Failed to update testimonial");
    }
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Testimonial deleted successfully!");
      refetchTestimonials();
    },
    onError: (error) => {
      console.error('Error deleting testimonial:', error);
      toast.error("Failed to delete testimonial");
    }
  });

  // FAQs queries and mutations
  const { data: faqs = [], refetch: refetchFAQs } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const createFAQMutation = useMutation({
    mutationFn: async (faq: Omit<FAQ, 'id'>) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("FAQ created successfully!");
      refetchFAQs();
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error creating FAQ:', error);
      toast.error("Failed to create FAQ");
    }
  });

  const updateFAQMutation = useMutation({
    mutationFn: async ({ id, ...faq }: FAQ) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(faq)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("FAQ updated successfully!");
      refetchFAQs();
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error updating FAQ:', error);
      toast.error("Failed to update FAQ");
    }
  });

  const deleteFAQMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("FAQ deleted successfully!");
      refetchFAQs();
    },
    onError: (error) => {
      console.error('Error deleting FAQ:', error);
      toast.error("Failed to delete FAQ");
    }
  });

  // Gallery queries and mutations
  const { data: gallery = [], refetch: refetchGallery } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createGalleryMutation = useMutation({
    mutationFn: async (item: Omit<GalleryItem, 'id'>) => {
      const { data, error } = await supabase
        .from('gallery')
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Gallery item created successfully!");
      refetchGallery();
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error creating gallery item:', error);
      toast.error("Failed to create gallery item");
    }
  });

  const updateGalleryMutation = useMutation({
    mutationFn: async ({ id, ...item }: GalleryItem) => {
      const { data, error } = await supabase
        .from('gallery')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Gallery item updated successfully!");
      refetchGallery();
      setEditingItem(null);
    },
    onError: (error) => {
      console.error('Error updating gallery item:', error);
      toast.error("Failed to update gallery item");
    }
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Gallery item deleted successfully!");
      refetchGallery();
    },
    onError: (error) => {
      console.error('Error deleting gallery item:', error);
      toast.error("Failed to delete gallery item");
    }
  });

  const handleCreateTestimonial = () => {
    const newTestimonial: Omit<Testimonial, 'id'> = {
      name: editingItem?.name || "",
      role: editingItem?.role || "",
      quote: editingItem?.quote || "",
      rating: editingItem?.rating || 5,
      image_url: editingItem?.image_url || "",
      active: true
    };

    createTestimonialMutation.mutate(newTestimonial);
  };

  const handleCreateFAQ = () => {
    const newFAQ: Omit<FAQ, 'id'> = {
      question: editingItem?.question || "",
      answer: editingItem?.answer || "",
      category: editingItem?.category || "general",
      order_index: editingItem?.order_index || 1,
      active: true
    };

    createFAQMutation.mutate(newFAQ);
  };

  const handleCreateGallery = () => {
    const newGalleryItem: Omit<GalleryItem, 'id'> = {
      title: editingItem?.title || "",
      image_url: editingItem?.image_url || "",
      alt_text: editingItem?.alt_text || "",
      description: editingItem?.description || "",
      active: true
    };

    createGalleryMutation.mutate(newGalleryItem);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Content Management</h1>
            <p className="text-gray-600 mt-1">Manage testimonials, FAQs, and gallery content</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
          {(["testimonials", "faqs", "gallery"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "testimonials" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Testimonials</CardTitle>
                <Button
                  onClick={() => setEditingItem({})}
                  className="bg-brunch-purple hover:bg-brunch-purple-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingItem && (
                <div className="mb-6 space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">
                    {editingItem.id ? "Edit Testimonial" : "Add New Testimonial"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={editingItem.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        placeholder="Customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={editingItem.role || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                        placeholder="Customer role/title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Select value={editingItem.rating?.toString() || "5"} onValueChange={(value) => setEditingItem({ ...editingItem, rating: parseInt(value) })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={editingItem.image_url || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Quote</Label>
                    <Textarea
                      value={editingItem.quote || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                      placeholder="Customer testimonial..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingItem.id ? () => updateTestimonialMutation.mutate(editingItem) : handleCreateTestimonial}
                      disabled={createTestimonialMutation.isPending || updateTestimonialMutation.isPending}
                      className="bg-brunch-purple hover:bg-brunch-purple-dark"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingItem.id ? "Update" : "Create"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell className="font-medium">{testimonial.name}</TableCell>
                      <TableCell>{testimonial.role}</TableCell>
                      <TableCell>{testimonial.rating} ⭐</TableCell>
                      <TableCell>
                        <Badge variant={testimonial.active ? "default" : "secondary"}>
                          {testimonial.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(testimonial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteTestimonialMutation.mutate(testimonial.id)}
                            disabled={deleteTestimonialMutation.isPending}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* FAQ Tab Content */}
        {activeTab === "faqs" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>FAQs</CardTitle>
                <Button
                  onClick={() => setEditingItem({})}
                  className="bg-brunch-purple hover:bg-brunch-purple-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add FAQ
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingItem && (
                <div className="mb-6 space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">
                    {editingItem.id ? "Edit FAQ" : "Add New FAQ"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={editingItem.category || "general"} onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="tickets">Tickets</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                          <SelectItem value="food">Food Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Order Index</Label>
                      <Input
                        type="number"
                        value={editingItem.order_index || 1}
                        onChange={(e) => setEditingItem({ ...editingItem, order_index: parseInt(e.target.value) || 1 })}
                        placeholder="Display order"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={editingItem.question || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                      placeholder="Frequently asked question..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={editingItem.answer || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                      placeholder="Answer to the question..."
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingItem.id ? () => updateFAQMutation.mutate(editingItem) : handleCreateFAQ}
                      disabled={createFAQMutation.isPending || updateFAQMutation.isPending}
                      className="bg-brunch-purple hover:bg-brunch-purple-dark"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingItem.id ? "Update" : "Create"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium">{faq.question}</TableCell>
                      <TableCell className="capitalize">{faq.category}</TableCell>
                      <TableCell>{faq.order_index}</TableCell>
                      <TableCell>
                        <Badge variant={faq.active ? "default" : "secondary"}>
                          {faq.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(faq)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteFAQMutation.mutate(faq.id)}
                            disabled={deleteFAQMutation.isPending}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Gallery Tab Content */}
        {activeTab === "gallery" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gallery</CardTitle>
                <Button
                  onClick={() => setEditingItem({})}
                  className="bg-brunch-purple hover:bg-brunch-purple-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Gallery Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingItem && (
                <div className="mb-6 space-y-4 rounded-lg border p-4">
                  <h3 className="text-lg font-semibold">
                    {editingItem.id ? "Edit Gallery Item" : "Add New Gallery Item"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={editingItem.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        placeholder="Image title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alt Text</Label>
                      <Input
                        value={editingItem.alt_text || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, alt_text: e.target.value })}
                        placeholder="Alt text for accessibility"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Image URL</Label>
                    <Input
                      value={editingItem.image_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={editingItem.description || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="Image description..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={editingItem.id ? () => updateGalleryMutation.mutate(editingItem) : handleCreateGallery}
                      disabled={createGalleryMutation.isPending || updateGalleryMutation.isPending}
                      className="bg-brunch-purple hover:bg-brunch-purple-dark"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {editingItem.id ? "Update" : "Create"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingItem(null)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gallery.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.alt_text}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.active ? "default" : "secondary"}>
                          {item.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingItem(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteGalleryMutation.mutate(item.id)}
                            disabled={deleteGalleryMutation.isPending}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
