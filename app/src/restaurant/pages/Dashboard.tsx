import { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, Utensils, Settings, 
  LogOut, Bell, TrendingUp, Clock, Package, IndianRupee,
  CheckCircle, ChefHat, Bike, MapPin, Phone, User,
  Filter, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockRestaurant, mockOrders, mockRestaurantStats } from '@/data/mockData';
import type { Order, OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: ChefHat },
  ready: { label: 'Ready', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Package },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: Bike },
  delivered: { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', icon: Clock },
};

export default function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, [`${newStatus}At`]: new Date().toISOString() }
          : order
      )
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  return (
    <div className="min-h-screen bg-green-50/50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-green-100 z-40 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{mockRestaurant.name}</h2>
              <p className="text-xs text-gray-500">Restaurant Partner</p>
            </div>
          </div>
        </div>
        
        <nav className="px-4 py-4 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem 
            icon={ClipboardList} 
            label="Orders" 
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            badge={pendingOrders.length}
          />
          <SidebarItem 
            icon={Utensils} 
            label="Menu" 
            active={activeTab === 'menu'}
            onClick={() => setActiveTab('menu')}
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-green-100">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'orders' && 'Orders'}
                {activeTab === 'menu' && 'Menu Management'}
                {activeTab === 'settings' && 'Settings'}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-green-50 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Avatar className="w-10 h-10 border-2 border-green-200">
                <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                  SG
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Today's Orders"
                  value={mockRestaurantStats.todayOrders}
                  change="+3 from yesterday"
                  icon={ClipboardList}
                  color="green"
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${mockRestaurantStats.totalRevenue.toLocaleString()}`}
                  change="+12% this week"
                  icon={IndianRupee}
                  color="emerald"
                />
                <StatCard
                  title="Pending Orders"
                  value={mockRestaurantStats.pendingOrders}
                  change="Needs attention"
                  icon={Clock}
                  color="amber"
                />
                <StatCard
                  title="Avg Order Value"
                  value={`₹${mockRestaurantStats.averageOrderValue}`}
                  change="+5% this month"
                  icon={TrendingUp}
                  color="blue"
                />
              </div>

              {/* Live Orders Section */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Orders */}
                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        Pending ({pendingOrders.length})
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="p-4 pt-0 space-y-3">
                        {pendingOrders.map((order) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                        {pendingOrders.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            No pending orders
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Preparing Orders */}
                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-orange-500" />
                        Preparing ({preparingOrders.length})
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="p-4 pt-0 space-y-3">
                        {preparingOrders.map((order) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                        {preparingOrders.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            No orders being prepared
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Ready for Delivery */}
                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-500" />
                        Ready ({readyOrders.length})
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="p-4 pt-0 space-y-3">
                        {readyOrders.map((order) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                        {readyOrders.length === 0 && (
                          <div className="text-center py-8 text-gray-400 text-sm">
                            No orders ready
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrdersTab orders={orders} onOrderClick={setSelectedOrder} />
          )}

          {activeTab === 'menu' && (
            <MenuTab />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </main>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-hidden">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-bold">
                    Order {selectedOrder.orderNumber}
                  </DialogTitle>
                  <Badge className={`${statusConfig[selectedOrder.status].bgColor} ${statusConfig[selectedOrder.status].color} border-0`}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-4 pr-4">
                  {/* Customer Info */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Customer Details</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-green-600" />
                        <span>{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span>{selectedOrder.customerPhone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>Room {selectedOrder.roomNumber} - {selectedOrder.propertyName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-sm">₹{item.totalPrice}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>₹{selectedOrder.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Platform Fee</span>
                      <span>₹{selectedOrder.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-green-700">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Commission Info */}
                  <div className="bg-amber-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-amber-800 mb-2">Commission Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between text-amber-700">
                        <span>Property Commission (10%)</span>
                        <span>₹{selectedOrder.propertyCommission.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-amber-700">
                        <span>Platform Commission (5%)</span>
                        <span>₹{selectedOrder.platformCommission.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-amber-900 pt-1 border-t border-amber-200">
                        <span>Your Payout</span>
                        <span>₹{selectedOrder.restaurantPayout.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                {selectedOrder.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      Reject
                    </Button>
                    <Button 
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    >
                      Accept Order
                    </Button>
                  </>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Start Preparing
                  </Button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <Button 
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Mark as Ready
                  </Button>
                )}
                {selectedOrder.status === 'ready' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'out_for_delivery')}
                    >
                      <Bike className="w-4 h-4 mr-2" />
                      Self Delivery
                    </Button>
                    <Button 
                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      <Bike className="w-4 h-4 mr-2" />
                      Book Rapido
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ 
  icon: Icon, 
  label, 
  active, 
  onClick,
  badge 
}: { 
  icon: React.ElementType; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-green-500 text-white shadow-green' 
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </div>
      {badge ? (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          active ? 'bg-white text-green-600' : 'bg-red-500 text-white'
        }`}>
          {badge}
        </span>
      ) : null}
    </button>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  change: string; 
  icon: React.ElementType; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
  };

  return (
    <Card className="border-green-100 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-green-600 mt-1">{change}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Order Card Component
function OrderCard({ order, onClick }: { order: Order; onClick: () => void }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-green-200 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-sm">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">Room {order.roomNumber}</p>
        </div>
        <Badge className={`${status.bgColor} ${status.color} border-0 text-xs`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{order.items.length} items</span>
        <span className="font-semibold text-green-700">₹{order.totalAmount.toFixed(0)}</span>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, onOrderClick }: { orders: Order[]; onOrderClick: (order: Order) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-green-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={() => onOrderClick(order)} />
        ))}
      </div>
    </div>
  );
}

// Menu Tab Component
function MenuTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </div>
      
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Menu Management</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Add, edit, and manage your menu items. Organize them into categories for easy browsing.
        </p>
      </div>
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  return (
    <div className="space-y-6">
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-base">Restaurant Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
              <input 
                type="text" 
                defaultValue={mockRestaurant.name}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input 
                type="text" 
                defaultValue={mockRestaurant.phone}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <textarea 
                defaultValue={mockRestaurant.address}
                rows={3}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-base">Delivery Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bike className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Rapido</p>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-green-200 text-green-600">
                Connect
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bike className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Ola Bike</p>
                  <p className="text-xs text-gray-500">Not connected</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-green-200 text-green-600">
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


