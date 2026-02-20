import { useState } from 'react';
import { 
  LayoutDashboard, ClipboardList, QrCode, Building2, 
  LogOut, Bell, TrendingUp, IndianRupee, 
  Download, Plus, Search, Filter,
  ChevronRight, BedDouble,
  CheckCircle, Clock, ChefHat, Package, Bike
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockProperty, mockRooms, mockOrders, mockEarnings, mockPropertyStats } from '@/data/mockData';
import type { Order, OrderStatus, PropertyRoom } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: ChefHat },
  ready: { label: 'Ready', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: Package },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-indigo-600', bgColor: 'bg-indigo-100', icon: Bike },
  delivered: { label: 'Delivered', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bgColor: 'bg-red-100', icon: Clock },
};

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PropertyRoom | null>(null);

  const totalEarnings = mockEarnings.reduce((sum, e) => sum + e.commissionAmount, 0);
  const pendingEarnings = mockEarnings
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.commissionAmount, 0);

  return (
    <div className="min-h-screen bg-green-50/50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-green-100 z-40 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">{mockProperty.name}</h2>
              <p className="text-xs text-gray-500">Property Owner</p>
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
          />
          <SidebarItem 
            icon={QrCode} 
            label="Room QR Codes" 
            active={activeTab === 'rooms'}
            onClick={() => setActiveTab('rooms')}
          />
          <SidebarItem 
            icon={IndianRupee} 
            label="Earnings" 
            active={activeTab === 'earnings'}
            onClick={() => setActiveTab('earnings')}
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
                {activeTab === 'rooms' && 'Room Management'}
                {activeTab === 'earnings' && 'Earnings'}
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
                  GP
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-green-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
                    <p className="text-green-100">
                      You have earned <span className="font-bold text-white">₹{totalEarnings.toFixed(2)}</span> in commission so far.
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <IndianRupee className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Orders"
                  value={mockPropertyStats.totalOrders}
                  change="All time orders"
                  icon={ClipboardList}
                  color="green"
                />
                <StatCard
                  title="Today's Orders"
                  value={mockPropertyStats.todayOrders}
                  change="+2 from yesterday"
                  icon={TrendingUp}
                  color="emerald"
                />
                <StatCard
                  title="Total Commission"
                  value={`₹${totalEarnings.toLocaleString()}`}
                  change="Lifetime earnings"
                  icon={IndianRupee}
                  color="amber"
                />
                <StatCard
                  title="Pending Commission"
                  value={`₹${pendingEarnings.toFixed(2)}`}
                  change="To be paid"
                  icon={Clock}
                  color="blue"
                />
              </div>

              {/* Recent Orders & Quick Actions */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600"
                        onClick={() => setActiveTab('orders')}
                      >
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                      <div className="p-4 pt-0 space-y-3">
                        {mockOrders.slice(0, 5).map((order) => (
                          <OrderCard 
                            key={order.id} 
                            order={order} 
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <QuickActionCard
                        icon={QrCode}
                        title="Generate QR"
                        description="Create QR codes for rooms"
                        onClick={() => setActiveTab('rooms')}
                      />
                      <QuickActionCard
                        icon={ClipboardList}
                        title="View Orders"
                        description="Check all hotel orders"
                        onClick={() => setActiveTab('orders')}
                      />
                      <QuickActionCard
                        icon={IndianRupee}
                        title="Earnings"
                        description="View commission details"
                        onClick={() => setActiveTab('earnings')}
                      />
                      <QuickActionCard
                        icon={Download}
                        title="Reports"
                        description="Download order reports"
                        onClick={() => alert('Report download coming soon!')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrdersTab orders={mockOrders} onOrderClick={setSelectedOrder} />
          )}

          {activeTab === 'rooms' && (
            <RoomsTab 
              rooms={mockRooms} 
              onGenerateQR={(room) => {
                setSelectedRoom(room);
                setShowQRDialog(true);
              }}
            />
          )}

          {activeTab === 'earnings' && (
            <EarningsTab earnings={mockEarnings} />
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
                  {/* Order Info */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Restaurant</span>
                        <span className="font-medium">{selectedOrder.restaurantName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room</span>
                        <span className="font-medium">{selectedOrder.roomNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Customer</span>
                        <span className="font-medium">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Time</span>
                        <span className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                        </span>
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

                  {/* Commission Highlight */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Your Commission (10%)</p>
                        <p className="text-2xl font-bold">₹{selectedOrder.propertyCommission.toFixed(2)}</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <IndianRupee className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">QR Code for Room {selectedRoom?.roomNumber}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-64 h-64 bg-white border-4 border-green-500 rounded-2xl flex items-center justify-center mb-6 shadow-green">
              {/* Placeholder QR Code */}
              <div className="text-center">
                <QrCode className="w-32 h-32 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-400">QR Code Placeholder</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">
              Scan this QR code to access the menu for Room {selectedRoom?.roomNumber}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="border-green-200">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Print QR Code
              </Button>
            </div>
          </div>
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
  onClick 
}: { 
  icon: React.ElementType; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-green-500 text-white shadow-green' 
          : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>
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

// Quick Action Card Component
function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-gray-50 hover:bg-green-50 rounded-xl transition-colors text-left"
    >
      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-green-600" />
      </div>
      <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </button>
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
          <p className="text-xs text-gray-500">{order.restaurantName}</p>
        </div>
        <Badge className={`${status.bgColor} ${status.color} border-0 text-xs`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {status.label}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Room {order.roomNumber}</span>
        <span className="font-semibold text-green-700">₹{order.totalAmount.toFixed(0)}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
        <span className="text-xs text-green-600 font-medium">
          +₹{order.propertyCommission.toFixed(0)} commission
        </span>
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({ orders, onOrderClick }: { orders: Order[]; onOrderClick: (order: Order) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <Button variant="outline" className="border-green-200">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      
      <div className="grid gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onClick={() => onOrderClick(order)} />
        ))}
      </div>
    </div>
  );
}

// Rooms Tab Component
function RoomsTab({ rooms, onGenerateQR }: { rooms: PropertyRoom[]; onGenerateQR: (room: PropertyRoom) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className="bg-white border border-green-100 rounded-xl p-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-green-600" />
                <span className="font-semibold">{room.roomNumber}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${room.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-green-200 text-green-600 hover:bg-green-50"
              onClick={() => onGenerateQR(room)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              View QR
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Earnings Tab Component
function EarningsTab({ earnings }: { earnings: typeof mockEarnings }) {
  const totalEarned = earnings.reduce((sum, e) => sum + e.commissionAmount, 0);
  const pendingAmount = earnings.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.commissionAmount, 0);
  const paidAmount = earnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.commissionAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-100 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-5">
            <p className="text-green-100 text-sm mb-1">Total Earnings</p>
            <p className="text-3xl font-bold">₹{totalEarned.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-600">₹{pendingAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-green-100">
          <CardContent className="p-5">
            <p className="text-gray-500 text-sm mb-1">Paid</p>
            <p className="text-2xl font-bold text-green-600">₹{paidAmount.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings List */}
      <Card className="border-green-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Commission History</CardTitle>
            <Button variant="outline" size="sm" className="border-green-200">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {earnings.map((earning) => (
              <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm">Order #{earning.orderId.slice(-3)}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(earning.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">+₹{earning.commissionAmount.toFixed(2)}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      earning.status === 'paid' 
                        ? 'border-green-200 text-green-600' 
                        : 'border-amber-200 text-amber-600'
                    }`}
                  >
                    {earning.status === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
