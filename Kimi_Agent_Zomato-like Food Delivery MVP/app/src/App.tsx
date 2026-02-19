import { useState } from 'react';
import { Utensils, Store, Building2, ArrowRight, CheckCircle, QrCode, Bike, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartProvider } from '@/hooks/useCart';
import MenuPage from '@/customer/pages/MenuPage';
import RestaurantDashboard from '@/restaurant/pages/Dashboard';
import OwnerDashboard from '@/owner/pages/Dashboard';

export type AppView = 'landing' | 'customer' | 'restaurant' | 'owner';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {currentView === 'landing' && <LandingPage onNavigate={setCurrentView} />}
        {currentView === 'customer' && <MenuPage />}
        {currentView === 'restaurant' && <RestaurantDashboard />}
        {currentView === 'owner' && <OwnerDashboard />}
      </div>
    </CartProvider>
  );
}

// Landing Page Component
function LandingPage({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-white border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SwaadServe</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-green-700"
              onClick={() => onNavigate('restaurant')}
            >
              Restaurant Login
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-green-700"
              onClick={() => onNavigate('owner')}
            >
              Owner Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10" />
        <div className="max-w-6xl mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Now Serving in Bangalore
              </div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Food Delivery for{' '}
                <span className="text-gradient-green">Hotels</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect your hotel with nearby restaurants. Guests scan, order, and enjoy 
                delicious meals delivered right to their room.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-8 py-6 text-lg shadow-green"
                  onClick={() => onNavigate('customer')}
                >
                  Try Demo Menu
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-green-200 text-green-700 hover:bg-green-50 rounded-xl px-8 py-6 text-lg"
                  onClick={() => onNavigate('restaurant')}
                >
                  Restaurant Portal
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-green-700">50+</p>
                  <p className="text-sm text-gray-500">Partner Hotels</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-700">25+</p>
                  <p className="text-sm text-gray-500">Restaurants</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-700">10K+</p>
                  <p className="text-sm text-gray-500">Orders Delivered</p>
                </div>
              </div>
            </div>

            {/* Hero Image / Demo */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl opacity-20 blur-2xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100">
                <div className="bg-green-500 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Spice Garden</p>
                    <p className="text-green-100 text-xs">Grand Plaza Hotel - Room 101</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Butter Chicken</p>
                      <p className="text-xs text-gray-500">Tender chicken in rich gravy</p>
                      <p className="text-green-700 font-bold text-sm mt-1">₹349</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Paneer Tikka</p>
                      <p className="text-xs text-gray-500">Grilled cottage cheese</p>
                      <p className="text-green-700 font-bold text-sm mt-1">₹249</p>
                    </div>
                  </div>
                  <div className="bg-green-500 text-white rounded-xl p-3 text-center font-semibold">
                    View Full Menu →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple 3-step process for hotels to offer food delivery service to their guests
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              icon={QrCode}
              title="Scan QR Code"
              description="Guest scans the QR code placed in their hotel room"
            />
            <StepCard
              number="2"
              icon={Utensils}
              title="Browse & Order"
              description="Browse the menu from partnered restaurants and place order"
            />
            <StepCard
              number="3"
              icon={Bike}
              title="Delivery to Room"
              description="Food is prepared and delivered directly to the room"
            />
          </div>
        </div>
      </section>

      {/* For Restaurants */}
      <section className="py-20 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                For Restaurants
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Expand Your Reach to Hotel Guests
              </h2>
              <p className="text-gray-600 mb-8">
                Partner with hotels and tap into a new customer base. Our platform connects 
                you with guests who want quality food delivered to their rooms.
              </p>
              <ul className="space-y-4 mb-8">
                <FeatureItem text="Real-time order notifications" />
                <FeatureItem text="Integrated delivery options (Self/Rapido/Ola)" />
                <FeatureItem text="Detailed analytics and reporting" />
                <FeatureItem text="Easy menu management" />
              </ul>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-8"
                onClick={() => onNavigate('restaurant')}
              >
                Access Restaurant Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl opacity-10 blur-2xl" />
              <Card className="relative border-green-100 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Today's Overview</h3>
                    <Badge className="bg-green-100 text-green-700">Live</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-green-700">12</p>
                      <p className="text-sm text-gray-600">New Orders</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-green-700">₹8.5K</p>
                      <p className="text-sm text-gray-600">Revenue</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-amber-700">3</p>
                      <p className="text-sm text-gray-600">Preparing</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-2xl font-bold text-blue-700">2</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* For Property Owners */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl opacity-10 blur-2xl" />
              <Card className="relative border-green-100 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Commission Earnings</h3>
                    <IndianRupee className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-center py-6">
                    <p className="text-5xl font-bold text-gradient-green mb-2">10%</p>
                    <p className="text-gray-600">Commission on every order</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">This Month</span>
                      <span className="font-bold text-green-700">₹12,580</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="font-bold text-amber-700">₹2,340</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                For Property Owners
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Earn Commission on Every Order
              </h2>
              <p className="text-gray-600 mb-8">
                Offer food delivery service to your guests without the hassle of managing 
                a restaurant. Earn 10% commission on every order placed through your hotel.
              </p>
              <ul className="space-y-4 mb-8">
                <FeatureItem text="Zero setup cost - we provide QR codes" />
                <FeatureItem text="Real-time order tracking dashboard" />
                <FeatureItem text="Transparent commission reporting" />
                <FeatureItem text="Multiple restaurant partnerships" />
              </ul>
              <Button 
                className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-8"
                onClick={() => onNavigate('owner')}
              >
                Access Owner Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join our network of hotels and restaurants. Start offering seamless 
            food delivery to your guests today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50 rounded-xl px-8"
              onClick={() => onNavigate('customer')}
            >
              Try Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 rounded-xl px-8"
              onClick={() => alert('Contact form coming soon!')}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                  <Utensils className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">SwaadServe</span>
              </div>
              <p className="text-sm">
                SwaadServe connects hotels with restaurants for seamless room service.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('customer')} className="hover:text-white">Customer App</button></li>
                <li><button onClick={() => onNavigate('restaurant')} className="hover:text-white">Restaurant Portal</button></li>
                <li><button onClick={() => onNavigate('owner')} className="hover:text-white">Owner Dashboard</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">About Us</button></li>
                <li><button className="hover:text-white">Careers</button></li>
                <li><button className="hover:text-white">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Help Center</button></li>
                <li><button className="hover:text-white">Terms of Service</button></li>
                <li><button className="hover:text-white">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 SwaadServe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Step Card Component
function StepCard({ 
  number, 
  icon: Icon, 
  title, 
  description 
}: { 
  number: string; 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div className="bg-white border border-green-100 rounded-2xl p-8 pt-10 hover:shadow-lg transition-shadow">
        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Feature Item Component
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-4 h-4 text-green-600" />
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

export default App;
