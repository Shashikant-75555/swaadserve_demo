# Food Delivery Platform - Technical Architecture & Implementation Guide

## Platform Overview

**Name Suggestion**: `HotelEats` / `RoomService Connect` / `NearbyBites`

**Business Model**: B2B2C Platform connecting Restaurants → Hotels → End Customers

**Core Value Proposition**: 
- Hotels without restaurants can offer food service to guests
- Restaurants get additional revenue stream
- Property owners earn 10% commission on every order

---

## System Architecture

### 1. Tech Stack Recommendation

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + TypeScript + Vite + Tailwind CSS + shadcn/ui | Customer app, Restaurant panel, Owner dashboard |
| **Backend** | Node.js + Express OR Firebase | API server, business logic |
| **Database** | PostgreSQL (primary) + Redis (cache/sessions) | Data persistence |
| **Real-time** | Socket.io OR Firebase Realtime DB | Live order updates |
| **Auth** | Firebase Auth OR Auth0 | User authentication |
| **File Storage** | AWS S3 / Cloudinary | Menu images, QR codes |
| **Payments** | Razorpay / Stripe | Payment processing |
| **QR Codes** | qrcode.js (frontend) + sharp (backend) | QR generation |
| **Hosting** | Vercel (frontend) + Railway/Render (backend) | Deployment |

---

## Database Schema Design

### Core Entities

```sql
-- Users Table (Multi-role authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('super_admin', 'restaurant_owner', 'property_owner', 'customer') NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    delivery_radius_km INT DEFAULT 5,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Platform commission
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties (Hotels) Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    total_rooms INT DEFAULT 0,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Owner commission
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Property-Rooms Table (for QR code management)
CREATE TABLE property_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id),
    room_number VARCHAR(50) NOT NULL,
    qr_code_url VARCHAR(500),
    qr_code_data VARCHAR(500), -- Encoded data in QR
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, room_number)
);

-- Property-Restaurant Partnerships
CREATE TABLE property_restaurant_partnerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id),
    restaurant_id UUID REFERENCES restaurants(id),
    is_active BOOLEAN DEFAULT true,
    partnership_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(property_id, restaurant_id)
);

-- Menu Categories
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

-- Menu Items
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    category_id UUID REFERENCES menu_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_vegetarian BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    preparation_time_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    property_id UUID REFERENCES properties(id),
    room_id UUID REFERENCES property_rooms(id),
    restaurant_id UUID REFERENCES restaurants(id),
    
    -- Order Status
    status ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    
    -- Financial Breakdown
    subtotal DECIMAL(10, 2) NOT NULL, -- Item total
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_charge DECIMAL(10, 2) DEFAULT 0,
    platform_fee DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Commission Breakdown
    property_commission DECIMAL(10, 2) DEFAULT 0, -- 10% to property owner
    platform_commission DECIMAL(10, 2) DEFAULT 0, -- Platform cut
    restaurant_payout DECIMAL(10, 2) DEFAULT 0,   -- Amount to restaurant
    
    -- Delivery
    delivery_type ENUM('restaurant_self', 'third_party') DEFAULT 'restaurant_self',
    delivery_partner VARCHAR(50), -- 'rapido', 'ola_bike', etc.
    delivery_partner_order_id VARCHAR(255),
    delivery_tracking_url VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    prepared_at TIMESTAMP,
    out_for_delivery_at TIMESTAMP,
    delivered_at TIMESTAMP,
    
    -- Payment
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(255)
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT
);

-- Property Owner Earnings
CREATE TABLE property_earnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id),
    order_id UUID REFERENCES orders(id),
    order_amount DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL,
    status ENUM('pending', 'paid', 'withdrawn') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

-- Delivery Partners Configuration
CREATE TABLE delivery_partner_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    partner_name VARCHAR(50) NOT NULL, -- 'rapido', 'ola_bike'
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Application Structure

### 1. Customer-Facing App (Mobile-First)
**Route**: `https://yourapp.com/menu/:propertyId/:roomId`

```
src/
├── customer/
│   ├── pages/
│   │   ├── MenuPage.tsx          # Main menu with categories
│   │   ├── CartPage.tsx          # Cart review
│   │   ├── CheckoutPage.tsx      # Payment & confirmation
│   │   └── OrderTrackingPage.tsx # Live order status
│   ├── components/
│   │   ├── MenuItemCard.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── QRScanner.tsx         # Optional: Camera scan
│   │   └── OrderStatusBadge.tsx
│   └── hooks/
│       ├── useMenu.ts
│       ├── useCart.ts
│       └── useOrderTracking.ts
```

### 2. Restaurant Partner Panel
**Route**: `https://yourapp.com/restaurant/dashboard`

```
src/
├── restaurant/
│   ├── pages/
│   │   ├── Dashboard.tsx         # Overview with stats
│   │   ├── OrdersPage.tsx        # Order management
│   │   ├── MenuManager.tsx       # CRUD for menu
│   │   ├── DeliverySettings.tsx  # 3rd party config
│   │   └── EarningsPage.tsx      # Payouts & history
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── OrderDetailsModal.tsx
│   │   ├── MenuItemForm.tsx
│   │   ├── DeliveryPartnerSetup.tsx
│   │   └── LiveOrderStream.tsx   # Socket.io integration
│   └── hooks/
│       ├── useOrders.ts
│       ├── useMenuManager.ts
│       └── useDeliveryPartners.ts
```

### 3. Property Owner Dashboard
**Route**: `https://yourapp.com/owner/dashboard`

```
src/
├── owner/
│   ├── pages/
│   │   ├── Dashboard.tsx         # Commission overview
│   │   ├── OrdersPage.tsx        # Property orders only
│   │   ├── RoomManagement.tsx    # QR code generation
│   │   ├── RestaurantPartners.tsx# Partner restaurants
│   │   └── EarningsPage.tsx      # Commission history
│   ├── components/
│   │   ├── EarningsChart.tsx
│   │   ├── QRCodeGenerator.tsx
│   │   ├── RoomList.tsx
│   │   └── OrderFilter.tsx       # Filter by date/room
│   └── hooks/
│       ├── usePropertyOrders.ts
│       ├── useEarnings.ts
│       └── useRooms.ts
```

### 4. Shared Components
```
src/
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   └── auth/
│       ├── LoginForm.tsx
│       ├── RegisterForm.tsx
│       └── RoleSwitcher.tsx
├── lib/
│   ├── api.ts                    # API client
│   ├── socket.ts                 # Socket.io client
│   ├── utils.ts
│   └── constants.ts
└── types/
    ├── user.ts
    ├── order.ts
    ├── menu.ts
    └── index.ts
```

---

## Key Features Implementation

### 1. QR Code System

**QR Code Data Structure**:
```json
{
  "v": "1.0",
  "p": "property-uuid",
  "r": "room-uuid",
  "url": "https://yourapp.com/menu/property-uuid/room-uuid"
}
```

**Generation Flow**:
1. Property owner adds rooms in dashboard
2. Backend generates unique QR for each room
3. QR codes printed and pasted on room doors
4. Scan redirects to menu page with pre-filled property/room

**Tech**: `qrcode` npm package + Canvas API

### 2. Real-Time Order Updates

**Socket Events**:
```javascript
// Restaurant joins their room
socket.emit('join-restaurant', restaurantId);

// New order notification
socket.emit('new-order', { order, restaurantId });

// Status updates
socket.emit('order-status-update', { orderId, status, timestamp });

// Property owner updates
socket.emit('join-property', propertyId);
```

### 3. Delivery Partner Integration

**Rapido API Integration**:
```javascript
// Create delivery request
const deliveryRequest = {
  pickup: {
    lat: restaurant.lat,
    lng: restaurant.lng,
    address: restaurant.address,
    phone: restaurant.phone
  },
  dropoff: {
    lat: property.lat,
    lng: property.lng,
    address: property.address,
    phone: customerPhone,
    notes: `Room: ${roomNumber}`
  },
  package_value: order.total_amount,
  payment_method: 'PREPAID' // Restaurant pays
};
```

**Ola Bike API**: Similar structure with Ola's partner API

### 4. Commission Calculation

```javascript
// On order completion
function calculateCommission(orderTotal) {
  const propertyCommission = orderTotal * 0.10;  // 10% to hotel
  const platformCommission = orderTotal * 0.05;  // 5% platform fee
  const restaurantPayout = orderTotal - propertyCommission - platformCommission;
  
  return {
    property: propertyCommission,
    platform: platformCommission,
    restaurant: restaurantPayout
  };
}
```

---

## API Endpoints Structure

### Authentication
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
POST /api/auth/logout
```

### Customer
```
GET  /api/menu/:propertyId              # Get menu for property
POST /api/orders                        # Create order
GET  /api/orders/:orderId/track         # Track order status
```

### Restaurant
```
GET    /api/restaurant/orders           # List orders
PATCH  /api/restaurant/orders/:id/status # Update status
GET    /api/restaurant/menu             # Get menu
POST   /api/restaurant/menu             # Add item
PATCH  /api/restaurant/menu/:id         # Update item
DELETE /api/restaurant/menu/:id         # Delete item
POST   /api/restaurant/delivery/order   # Book 3rd party delivery
GET    /api/restaurant/earnings         # Payout summary
```

### Property Owner
```
GET  /api/owner/orders                  # Orders for property only
GET  /api/owner/earnings                # Commission summary
GET  /api/owner/rooms                   # List rooms
POST /api/owner/rooms                   # Add room + generate QR
GET  /api/owner/rooms/:id/qr            # Download QR code
GET  /api/owner/restaurants             # Partner restaurants
```

---

## Hosting & Infrastructure

### Recommended Setup

| Service | Provider | Cost Estimate |
|---------|----------|---------------|
| **Frontend Hosting** | Vercel | Free tier → $20/mo |
| **Backend Hosting** | Railway / Render | $5-25/mo |
| **Database** | Railway PostgreSQL / Supabase | $0-25/mo |
| **File Storage** | Cloudinary / AWS S3 | Free tier → $5-10/mo |
| **Authentication** | Firebase Auth | Free tier → $0.01/verification |
| **Real-time** | Socket.io on same server / Firebase | Included |
| **Payments** | Razorpay | 2% per transaction |
| **Domain** | Namecheap / Cloudflare | $10-15/year |
| **SSL** | Let's Encrypt (free) | Free |

### Total Monthly Cost (Startup)
- **MVP Phase**: $0-30/month
- **Growth Phase**: $50-100/month
- **Scale Phase**: $200-500/month

---

## Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
**Goal**: Basic ordering flow

**Week 1: Setup & Auth**
- [ ] Initialize React project with shadcn/ui
- [ ] Setup Node.js backend with Express
- [ ] Setup PostgreSQL database
- [ ] Implement JWT authentication
- [ ] Create user roles (restaurant, owner)

**Week 2: Core Entities**
- [ ] Restaurant CRUD APIs
- [ ] Property CRUD APIs
- [ ] Menu management system
- [ ] Room management with QR generation

**Week 3: Order Flow**
- [ ] Customer menu page (mobile-first)
- [ ] Cart functionality
- [ ] Order creation API
- [ ] Basic order status tracking

**Week 4: Restaurant Panel**
- [ ] Restaurant dashboard
- [ ] Order management UI
- [ ] Menu manager
- [ ] Real-time order notifications (Socket.io)

### Phase 2: Commission & Payments (Weeks 5-6)
**Goal**: Monetization

**Week 5: Payment Integration**
- [ ] Razorpay integration
- [ ] Payment flow for customers
- [ ] Webhook handling

**Week 6: Commission System**
- [ ] Automatic commission calculation
- [ ] Property owner dashboard
- [ ] Earnings tracking
- [ ] Payout system (manual initially)

### Phase 3: Delivery Integration (Weeks 7-8)
**Goal**: 3rd party delivery

**Week 7: Rapido Integration**
- [ ] Rapido partner API integration
- [ ] Delivery booking flow
- [ ] Tracking integration

**Week 8: Ola Bike & Polish**
- [ ] Ola Bike API integration
- [ ] Delivery settings UI
- [ ] Order tracking for customers

### Phase 4: Scale & Optimize (Weeks 9-10)
**Goal**: Production readiness

**Week 9: Analytics & Reporting**
- [ ] Order analytics dashboard
- [ ] Sales reports for restaurants
- [ ] Commission reports for owners

**Week 10: Optimization**
- [ ] Performance optimization
- [ ] Image optimization (CDN)
- [ ] Caching strategy (Redis)
- [ ] Security hardening

---

## Getting Started - Step by Step

### Step 1: Project Setup (Day 1)

```bash
# 1. Create project directory
mkdir hotel-food-delivery && cd hotel-food-delivery

# 2. Initialize frontend (using webapp-building skill)
bash /app/.kimi/skills/webapp-building/scripts/init-webapp.sh "HotelEats"

# 3. Setup backend
mkdir backend && cd backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken pg sequelize socket.io
npm install -D nodemon typescript @types/express @types/node

# 4. Initialize TypeScript
npx tsc --init
```

### Step 2: Database Setup (Day 2)

```bash
# Using Docker for local development
docker run -d \
  --name hotel-eats-db \
  -e POSTGRES_USER=hoteluser \
  -e POSTGRES_PASSWORD=hotelpass \
  -e POSTGRES_DB=hotel_eats \
  -p 5432:5432 \
  postgres:15
```

### Step 3: Run Development Servers

```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Database (if using local)
docker start hotel-eats-db
```

---

## Security Considerations

1. **Authentication**: JWT with refresh tokens, role-based access control
2. **API Security**: Rate limiting, input validation, SQL injection prevention
3. **Payment Security**: PCI compliance via Razorpay/Stripe (never store card data)
4. **Data Privacy**: Encrypt sensitive data, GDPR compliance for customer data
5. **QR Code Security**: Signed URLs with expiration (optional for MVP)

---

## Next Steps

1. **Validate Idea**: Test with 1 restaurant + 1 hotel before building
2. **Create Wireframes**: Design UI/UX for all three user types
3. **Find Pilot Partners**: Secure initial restaurant and hotel partners
4. **Build MVP**: Follow Phase 1 roadmap
5. **Iterate**: Gather feedback and improve

---

## Useful Resources

- **Rapido Partner API**: Contact Rapido for partner documentation
- **Ola Bike API**: Ola for Business portal
- **Razorpay Docs**: https://razorpay.com/docs/
- **Socket.io**: https://socket.io/docs/
- **shadcn/ui**: https://ui.shadcn.com/docs
