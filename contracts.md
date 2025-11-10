# LR Store - Contracts & Implementation Plan

## Overview
E-commerce platform for glow-in-the-dark and neon party supplies with Multicaixa Express payment integration.

## Frontend Mock Data (To Be Replaced)
Location: `/app/frontend/src/data/mockData.js`

### Current Mock Data:
1. **Categories** (8 items)
   - Bastões Luminosos, Copos e Taças, Tiaras e Coroas, Pulseiras e Colares
   - Óculos Neon, Decorações, Pintura Corporal, Adereços para Festas

2. **Products** (12 items)
   - Each with: id, name, category, price, originalPrice, image, description, stock, colors, featured, rating

3. **Cart State**
   - Stored in localStorage: `lrstore_cart`
   - Items with: id, quantity, selectedColor

4. **Orders**
   - Stored in localStorage: `order_{orderNumber}`

## API Contracts

### Base URL
`/api` prefix required for all endpoints

### 1. Categories API

#### GET /api/categories
**Response:**
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "image": "string",
      "description": "string"
    }
  ]
}
```

### 2. Products API

#### GET /api/products
**Query Parameters:**
- `category` (optional): Filter by category slug
- `search` (optional): Search in name/description
- `featured` (optional): Boolean

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": "number",
      "originalPrice": "number",
      "image": "string",
      "description": "string",
      "stock": "number",
      "colors": ["string"],
      "featured": "boolean",
      "rating": "number"
    }
  ]
}
```

#### GET /api/products/:id
**Response:**
```json
{
  "product": { /* same as above */ }
}
```

### 3. Orders API

#### POST /api/orders
**Request:**
```json
{
  "customer": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string"
  },
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "selectedColor": "string",
      "price": "number"
    }
  ],
  "paymentMethod": "multicaixa-express | multicaixa-reference",
  "total": "number"
}
```

**Response:**
```json
{
  "order": {
    "orderNumber": "string",
    "status": "pending",
    "date": "ISO date string",
    "paymentReference": "string (if multicaixa-reference)",
    "customer": { /* customer info */ },
    "items": [ /* order items */ ],
    "total": "number"
  }
}
```

#### GET /api/orders/:orderNumber
**Response:**
```json
{
  "order": { /* same as POST response */ }
}
```

### 4. Payment API (Multicaixa Integration)

#### POST /api/payments/multicaixa/reference
**Request:**
```json
{
  "orderNumber": "string",
  "amount": "number"
}
```

**Response:**
```json
{
  "reference": "string",
  "entity": "string",
  "expiryDate": "ISO date string"
}
```

#### POST /api/payments/multicaixa/express
**Request:**
```json
{
  "orderNumber": "string",
  "phone": "string",
  "amount": "number"
}
```

**Response:**
```json
{
  "transactionId": "string",
  "status": "pending | completed | failed"
}
```

#### GET /api/payments/status/:transactionId
**Response:**
```json
{
  "transactionId": "string",
  "status": "pending | completed | failed",
  "orderNumber": "string"
}
```

## Database Schema

### Collections

#### categories
```python
{
  "_id": ObjectId,
  "name": str,
  "slug": str,
  "image": str,
  "description": str,
  "created_at": datetime
}
```

#### products
```python
{
  "_id": ObjectId,
  "name": str,
  "category_slug": str,
  "price": float,
  "original_price": float,
  "image": str,
  "description": str,
  "stock": int,
  "colors": List[str],
  "featured": bool,
  "rating": float,
  "created_at": datetime,
  "updated_at": datetime
}
```

#### orders
```python
{
  "_id": ObjectId,
  "order_number": str,
  "customer": {
    "name": str,
    "email": str,
    "phone": str,
    "address": str,
    "city": str
  },
  "items": [
    {
      "product_id": str,
      "name": str,
      "quantity": int,
      "selected_color": str,
      "price": float,
      "image": str
    }
  ],
  "payment_method": str,
  "payment_status": str,  # pending, completed, failed
  "payment_reference": str (optional),
  "total": float,
  "status": str,  # pending, processing, shipped, delivered, cancelled
  "created_at": datetime,
  "updated_at": datetime
}
```

#### payments
```python
{
  "_id": ObjectId,
  "transaction_id": str,
  "order_number": str,
  "method": str,  # multicaixa-express, multicaixa-reference
  "amount": float,
  "status": str,  # pending, completed, failed
  "reference": str (optional),
  "phone": str (optional),
  "created_at": datetime,
  "updated_at": datetime
}
```

## Backend Implementation Plan

### Phase 1: Database Models
1. Create Pydantic models for all schemas
2. Create MongoDB indexes

### Phase 2: Core APIs
1. Categories CRUD endpoints
2. Products CRUD endpoints
3. Orders management

### Phase 3: Payment Integration
1. Mock Multicaixa Express integration (for demo)
2. Generate payment references
3. Payment status tracking

### Phase 4: Frontend Integration
1. Replace mockData imports with API calls using axios
2. Update components to use real data:
   - Home.js: Fetch categories and featured products
   - Products.js: Fetch all products with filters
   - CategoryPage.js: Fetch products by category
   - Checkout.js: Create order via API
   - OrderConfirmation.js: Fetch order details

## Frontend Changes Required

### Files to Update:
1. **Home.js**
   - Remove: `import { categories, featuredProducts, testimonials } from '../data/mockData'`
   - Add: API calls to fetch categories and products
   - useEffect to load data on mount

2. **Products.js**
   - Remove: `import { products, categories } from '../data/mockData'`
   - Add: API call with query parameters for filtering

3. **CategoryPage.js**
   - Remove: `import { products, categories } from '../data/mockData'`
   - Add: API calls for category and products

4. **Checkout.js**
   - Update: handleSubmit to POST order to API
   - Add: Payment reference generation

5. **OrderConfirmation.js**
   - Remove: localStorage retrieval
   - Add: API call to fetch order details

## Environment Variables
Backend `.env` additions:
```
MULTICAIXA_API_KEY=mock_key_for_demo
MULTICAIXA_ENTITY=11111
```

## Notes
- All data currently in mockData.js will be seeded into MongoDB
- Cart functionality remains client-side (localStorage) for MVP
- Payment integration is MOCKED for demo purposes (ProxyPay requires merchant contract)
- All prices in Angolan Kwanza (AOA)
