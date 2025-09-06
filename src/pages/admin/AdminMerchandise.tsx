
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Loader2, PackageCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ImageUpload from '@/components/admin/ImageUpload';
import { useDynamicMerchandise, DynamicMerchandiseItem } from '@/hooks/useDynamicMerchandise';

const AdminMerchandise = () => {
  const { 
    merchandiseItems, 
    isLoading, 
    createMerchandise, 
    updateMerchandise, 
    deleteMerchandise, 
    createVariant 
  } = useDynamicMerchandise();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<DynamicMerchandiseItem | null>(null);
  const [currentVariantItem, setCurrentVariantItem] = useState<DynamicMerchandiseItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    image_url: '',
    active: true
  });

  const [variantForm, setVariantForm] = useState({
    size: '',
    color: '',
    inventory: ''
  });

  const handleEditItem = (item: DynamicMerchandiseItem) => {
    setIsEditing(true);
    setCurrentItem(item);
    setProductForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      inventory: item.inventory.toString(),
      image_url: item.image_url || '',
      active: item.active
    });
    setIsDialogOpen(true);
  };

  const handleNewItem = () => {
    setIsEditing(false);
    setCurrentItem(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      inventory: '',
      image_url: '',
      active: true
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      await deleteMerchandise(id);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const data = {
      name: productForm.name,
      description: productForm.description || undefined,
      price: parseFloat(productForm.price),
      inventory: parseInt(productForm.inventory) || 0,
      image_url: productForm.image_url || undefined,
      active: productForm.active
    };

    let success = false;

    if (isEditing && currentItem) {
      success = await updateMerchandise({ id: currentItem.id, ...data });
    } else {
      success = await createMerchandise(data);
    }

    if (success) {
      setIsDialogOpen(false);
    }

    setIsSubmitting(false);
  };

  const handleAddVariant = (item: DynamicMerchandiseItem) => {
    setCurrentVariantItem(item);
    setVariantForm({
      size: '',
      color: '',
      inventory: ''
    });
    setIsVariantDialogOpen(true);
  };

  const handleSubmitVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!variantForm.size || !variantForm.inventory || !currentVariantItem) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const success = await createVariant(currentVariantItem.id, {
      size: variantForm.size,
      color: variantForm.color || undefined,
      inventory: parseInt(variantForm.inventory)
    });

    if (success) {
      setIsVariantDialogOpen(false);
    }

    setIsSubmitting(false);
  };

  const handleImageChange = (url: string) => {
    setProductForm(prev => ({ ...prev, image_url: url }));
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Merchandise Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and inventory</p>
        </div>
        <Button 
          className="bg-brunch-purple hover:bg-brunch-purple-dark"
          onClick={handleNewItem}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Product
        </Button>
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Manage your merchandise products</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-brunch-purple" />
                  <span className="ml-2 text-gray-600">Loading merchandise...</span>
                </div>
              ) : merchandiseItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first merchandise item</p>
                  <Button onClick={handleNewItem} className="bg-brunch-purple hover:bg-brunch-purple-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchandiseItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded overflow-hidden">
                              <img 
                                src={item.image_url || '/placeholder.svg'}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            </div>
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                {item.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <PackageCheck className="h-4 w-4 text-gray-500 mr-1" />
                            {item.inventory}
                            {item.variants && item.variants.length > 0 && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({item.variants.length} variants)
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddVariant(item)}
                            >
                              Add Variant
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track stock levels and variants</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-brunch-purple" />
                  <span className="ml-2 text-gray-600">Loading inventory...</span>
                </div>
              ) : merchandiseItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No products available. Add products first to manage inventory.
                </div>
              ) : (
                <div className="space-y-6">
                  {merchandiseItems.map((product) => (
                    <div key={product.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="text-sm text-gray-500">
                          Total Inventory: {product.inventory}
                        </div>
                      </div>
                      
                      {product.variants && product.variants.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Size</TableHead>
                              <TableHead>Color</TableHead>
                              <TableHead>Inventory</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {product.variants.map((variant) => (
                              <TableRow key={variant.id}>
                                <TableCell>{variant.size}</TableCell>
                                <TableCell>{variant.color || '-'}</TableCell>
                                <TableCell>{variant.inventory}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No variants found. Add variants to track detailed inventory.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Track merchandise sales performance</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">Total Sales</div>
                  <div className="text-2xl font-bold text-brunch-purple">$4,250.00</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">Units Sold</div>
                  <div className="text-2xl font-bold text-brunch-purple">182</div>
                  <div className="text-xs text-green-600 mt-1">+8% from last month</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">Best Seller</div>
                  <div className="text-2xl font-bold text-brunch-purple">T-Shirt</div>
                  <div className="text-xs text-gray-500 mt-1">42 units sold</div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Sales by Product</h3>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-brunch-purple" />
                  </div>
                ) : merchandiseItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No sales data available yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {merchandiseItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <img 
                              src={item.image_url || '/placeholder.svg'}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">${item.price.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {Math.floor(Math.random() * 50) + 5} units
                          </div>
                          <div className="text-sm text-gray-500">
                            ${((Math.floor(Math.random() * 50) + 5) * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update your product information below.' 
                : 'Fill in the product details to add it to your inventory.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitProduct} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input 
                id="name" 
                value={productForm.name} 
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="Enter product name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={productForm.description} 
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Enter product description"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input 
                  id="price" 
                  value={productForm.price} 
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inventory">Inventory *</Label>
                <Input 
                  id="inventory" 
                  value={productForm.inventory} 
                  onChange={(e) => setProductForm({...productForm, inventory: e.target.value})}
                  placeholder="0"
                  type="number"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <ImageUpload
              currentImageUrl={productForm.image_url}
              onImageChange={handleImageChange}
              label="Product Image"
              placeholder="Enter image URL or upload an image"
            />
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={productForm.active}
                onCheckedChange={(checked) => setProductForm({...productForm, active: checked})}
              />
              <Label htmlFor="active">Active Product</Label>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-brunch-purple hover:bg-brunch-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditing ? 'Update Product' : 'Add Product'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Variant Dialog */}
      <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product Variant</DialogTitle>
            <DialogDescription>
              Create a variant for {currentVariantItem?.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitVariant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="size">Size *</Label>
              <Input 
                id="size" 
                value={variantForm.size} 
                onChange={(e) => setVariantForm({...variantForm, size: e.target.value})}
                placeholder="e.g., S, M, L, One Size"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input 
                id="color" 
                value={variantForm.color} 
                onChange={(e) => setVariantForm({...variantForm, color: e.target.value})}
                placeholder="Black, Red, Blue, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variantInventory">Inventory *</Label>
              <Input 
                id="variantInventory" 
                value={variantForm.inventory} 
                onChange={(e) => setVariantForm({...variantForm, inventory: e.target.value})}
                placeholder="0"
                type="number"
                min="0"
                required
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsVariantDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-brunch-purple hover:bg-brunch-purple-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Variant'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMerchandise;
