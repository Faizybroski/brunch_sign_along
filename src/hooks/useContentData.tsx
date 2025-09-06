
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image_url?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  alt_text: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useContentData = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    }
  };

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (err: any) {
      console.error('Error fetching FAQs:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load FAQs",
        variant: "destructive",
      });
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGalleryItems(data || []);
    } catch (err: any) {
      console.error('Error fetching gallery items:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive",
      });
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    await Promise.all([
      fetchTestimonials(),
      fetchFaqs(),
      fetchGalleryItems()
    ]);
    
    setLoading(false);
  };

  const createTestimonial = async (data: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([data]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
      
      await fetchTestimonials();
      return true;
    } catch (err: any) {
      console.error('Error creating testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to create testimonial",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateTestimonial = async (id: number, data: Partial<Testimonial>) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Testimonial updated successfully",
      });
      
      await fetchTestimonials();
      return true;
    } catch (err: any) {
      console.error('Error updating testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      
      await fetchTestimonials();
      return true;
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
      return false;
    }
  };

  const createFaq = async (data: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .insert([data]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
      
      await fetchFaqs();
      return true;
    } catch (err: any) {
      console.error('Error creating FAQ:', err);
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateFaq = async (id: number, data: Partial<FAQ>) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
      
      await fetchFaqs();
      return true;
    } catch (err: any) {
      console.error('Error updating FAQ:', err);
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteFaq = async (id: number) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
      
      await fetchFaqs();
      return true;
    } catch (err: any) {
      console.error('Error deleting FAQ:', err);
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
      return false;
    }
  };

  const createGalleryItem = async (data: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .insert([data]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gallery item created successfully",
      });
      
      await fetchGalleryItems();
      return true;
    } catch (err: any) {
      console.error('Error creating gallery item:', err);
      toast({
        title: "Error",
        description: "Failed to create gallery item",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateGalleryItem = async (id: number, data: Partial<GalleryItem>) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gallery item updated successfully",
      });
      
      await fetchGalleryItems();
      return true;
    } catch (err: any) {
      console.error('Error updating gallery item:', err);
      toast({
        title: "Error",
        description: "Failed to update gallery item",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteGalleryItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      
      await fetchGalleryItems();
      return true;
    } catch (err: any) {
      console.error('Error deleting gallery item:', err);
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    testimonials,
    faqs,
    galleryItems,
    loading,
    error,
    refreshData: fetchAllData,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    createFaq,
    updateFaq,
    deleteFaq,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  };
};
