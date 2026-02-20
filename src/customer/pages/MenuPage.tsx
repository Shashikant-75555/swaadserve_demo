import { useState, useMemo } from 'react';
import { 
  ShoppingCart, Plus, Minus, MapPin, Clock, Star, 
  ChevronRight, Leaf, Info, X, Utensils 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useCart } from '@/hooks/useCart';
import { mockRestaurant, mockCategories, mockMenuItems, mockProperty } from '@/data/mockData';
import type { MenuItem } from '@/types';

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addItem, totalItems, subtotal } = useCart();

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return mockMenuItems;
    return mockMenuItems.filter((item) => item.categoryId === selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem(selectedItem, itemQuantity, specialInstructions);
      setSelectedItem(null);
      setItemQuantity(1);
      setSpecialInstructions('');
    }
  };

  const openItemDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setItemQuantity(1);
    setSpecialInstructions('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-green">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900 leading-tight">
                  {mockRestaurant.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[150px]">{mockProperty.name}</span>
                </div>
              </div>
            </div>
            
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="relative border-green-200 hover:bg-green-50 hover:border-green-300"
                >
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-white">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-green-800">
                    <ShoppingCart className="w-5 h-5" />
                    Your Cart
                  </SheetTitle>
                </SheetHeader>
                <CartSheetContent onClose={() => setIsCartOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Restaurant Info Bar */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 bg-green-100 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 text-green-600 fill-green-600" />
                <span className="text-sm font-semibold text-green-700">{mockRestaurant.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-green-500" />
              <span>{mockRestaurant.deliveryTime}</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              Free Delivery
            </Badge>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="sticky top-[88px] z-30 bg-white/95 backdrop-blur-sm border-b border-green-100">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 px-4 py-3 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-green-500 text-white shadow-green'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Items
            </button>
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-green-500 text-white shadow-green'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Menu Items */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-32">
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openItemDialog(item)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  {item.isVegetarian && (
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Leaf className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-green-700">₹{item.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.preparationTimeMinutes} mins</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        openItemDialog(item);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 shadow-lg z-40">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-3.5 px-4 flex items-center justify-between transition-all shadow-green"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-semibold">{totalItems} items</span>
                  <span className="text-green-100 text-sm ml-2">₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">View Cart</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden">
          {selectedItem && (
            <>
              <div className="relative h-48">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {selectedItem.isVegetarian && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-medium">
                    <Leaf className="w-3.5 h-3.5" />
                    Vegetarian
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <DialogHeader className="text-left mb-4">
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    {selectedItem.name}
                  </DialogTitle>
                  <p className="text-gray-500 text-sm mt-1">{selectedItem.description}</p>
                </DialogHeader>
                
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-green-500" />
                    {selectedItem.preparationTimeMinutes} mins
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Info className="w-4 h-4 text-green-500" />
                    Customizable
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-medium text-gray-700">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                      className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-lg">{itemQuantity}</span>
                    <button
                      onClick={() => setItemQuantity(itemQuantity + 1)}
                      className="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-green-600" />
                    </button>
                  </div>
                </div>
                
                {/* Special Instructions */}
                <div className="mb-5">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Less spicy, no onions..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                
                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-6 text-base font-semibold shadow-green"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Cart - ₹{(selectedItem.price * itemQuantity).toFixed(2)}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Cart Sheet Content Component
function CartSheetContent({ onClose }: { onClose: () => void }) {
  const { items, removeItem, updateQuantity, subtotal, taxAmount, platformFee, totalAmount, clearCart } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-sm mb-6">Add some delicious items to get started!</p>
        <Button onClick={onClose} className="bg-green-500 hover:bg-green-600 text-white">
          Browse Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-4 py-4">
          {items.map((item) => (
            <div key={item.menuItem.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
              <img
                src={item.menuItem.imageUrl}
                alt={item.menuItem.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{item.menuItem.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">₹{item.menuItem.price}</p>
                {item.specialInstructions && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{item.specialInstructions}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="text-red-500 hover:text-red-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (5%)</span>
          <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Platform Fee</span>
          <span className="font-medium">₹{platformFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-700">₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <Button 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl py-6 text-base font-semibold shadow-green"
          onClick={() => {
            alert('Order placed successfully! Redirecting to payment...');
            clearCart();
            onClose();
          }}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
