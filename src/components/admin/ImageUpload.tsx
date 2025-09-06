
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

const ImageUpload = ({ 
  currentImageUrl, 
  onImageChange, 
  label = "Event Image",
  placeholder = "Enter image URL or upload an image"
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `lovable-uploads/${fileName}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      
      // Set preview and update form
      setPreviewUrl(publicUrl);
      onImageChange(publicUrl);
      toast.success('Image uploaded successfully');

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setPreviewUrl(url);
    onImageChange(url);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel>{label}</FormLabel>
      
      {/* URL Input */}
      <Input
        placeholder={placeholder}
        value={previewUrl || ''}
        onChange={(e) => handleUrlChange(e.target.value)}
        disabled={uploading}
      />
      
      {/* Upload Button */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
        
        {previewUrl && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={clearImage}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview */}
      {previewUrl && (
        <div className="mt-4">
          <FormLabel className="text-sm text-gray-600">Preview:</FormLabel>
          <div className="mt-2 border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Event preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
