from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from typing import Optional, List
from datetime import datetime, timedelta
import random

from models import (
    Category, CategoryResponse, Product, ProductResponse, SingleProductResponse,
    Order, OrderCreate, OrderResponse, PaymentReferenceRequest, PaymentReferenceResponse,
    PaymentExpressRequest, PaymentExpressResponse, PaymentStatusResponse, Payment
)
from database import (
    categories_collection, products_collection, orders_collection, 
    payments_collection, init_indexes
)
from seed_data import categories_data, products_data

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app without a prefix
app = FastAPI(title="LR Store API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting LR Store API...")
    await init_indexes()
    
    # Seed data if collections are empty
    if await categories_collection.count_documents({}) == 0:
        logger.info("Seeding categories...")
        await categories_collection.insert_many(categories_data)
        logger.info(f"✓ Inserted {len(categories_data)} categories")
    
    if await products_collection.count_documents({}) == 0:
        logger.info("Seeding products...")
        await products_collection.insert_many(products_data)
        logger.info(f"✓ Inserted {len(products_data)} products")
    
    logger.info("✓ LR Store API ready!")

# Root endpoint
@api_router.get("/")
async def root():
    return {
        "message": "LR Store API",
        "version": "1.0.0",
        "status": "online"
    }

# ==================== CATEGORIES ====================

@api_router.get("/categories", response_model=CategoryResponse)
async def get_categories():
    """Get all categories"""
    try:
        categories = await categories_collection.find().to_list(100)
        return {"categories": [Category(**cat) for cat in categories]}
    except Exception as e:
        logger.error(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail="Error fetching categories")

@api_router.get("/categories/{slug}")
async def get_category_by_slug(slug: str):
    """Get category by slug"""
    category = await categories_collection.find_one({"slug": slug})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return Category(**category)

# ==================== PRODUCTS ====================

@api_router.get("/products", response_model=ProductResponse)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    featured: Optional[bool] = Query(None, description="Filter featured products")
):
    """Get all products with optional filters"""
    try:
        query = {}
        
        if category:
            query["category"] = category
        
        if featured is not None:
            query["featured"] = featured
        
        if search:
            query["$text"] = {"$search": search}
        
        products = await products_collection.find(query).to_list(1000)
        return {"products": [Product(**prod) for prod in products]}
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        raise HTTPException(status_code=500, detail="Error fetching products")

@api_router.get("/products/{product_id}", response_model=SingleProductResponse)
async def get_product_by_id(product_id: str):
    """Get single product by ID"""
    product = await products_collection.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"product": Product(**product)}

# ==================== ORDERS ====================

@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    try:
        # Generate order number
        order_number = str(random.randint(100000, 999999))
        
        # Check if order number already exists
        while await orders_collection.find_one({"order_number": order_number}):
            order_number = str(random.randint(100000, 999999))
        
        # Create order object
        order = Order(
            order_number=order_number,
            customer=order_data.customer,
            items=order_data.items,
            payment_method=order_data.payment_method,
            total=order_data.total
        )
        
        # Insert into database
        order_dict = order.dict()
        await orders_collection.insert_one(order_dict)
        
        logger.info(f"Order created: {order_number}")
        return {"order": order}
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Error creating order")

@api_router.get("/orders/{order_number}", response_model=OrderResponse)
async def get_order(order_number: str):
    """Get order by order number"""
    order = await orders_collection.find_one({"order_number": order_number})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order": Order(**order)}

# ==================== PAYMENTS ====================

@api_router.post("/payments/multicaixa/reference", response_model=PaymentReferenceResponse)
async def generate_payment_reference(request: PaymentReferenceRequest):
    """Generate Multicaixa payment reference (MOCKED)"""
    try:
        # Mock reference generation
        reference = str(random.randint(100000000, 999999999))
        entity = "11111"  # Mock entity
        expiry_date = (datetime.utcnow() + timedelta(days=3)).isoformat()
        
        # Create payment record
        payment = Payment(
            transaction_id=f"REF-{reference}",
            order_number=request.order_number,
            method="multicaixa-reference",
            amount=request.amount,
            status="pending",
            reference=reference
        )
        
        await payments_collection.insert_one(payment.dict())
        
        # Update order with payment reference
        await orders_collection.update_one(
            {"order_number": request.order_number},
            {"$set": {"payment_reference": reference}}
        )
        
        logger.info(f"Payment reference generated: {reference} for order {request.order_number}")
        
        return PaymentReferenceResponse(
            reference=reference,
            entity=entity,
            expiry_date=expiry_date
        )
    except Exception as e:
        logger.error(f"Error generating payment reference: {e}")
        raise HTTPException(status_code=500, detail="Error generating payment reference")

@api_router.post("/payments/multicaixa/express", response_model=PaymentExpressResponse)
async def process_express_payment(request: PaymentExpressRequest):
    """Process Multicaixa Express payment (MOCKED)"""
    try:
        # Mock transaction
        transaction_id = f"EXP-{random.randint(1000000, 9999999)}"
        
        # Create payment record
        payment = Payment(
            transaction_id=transaction_id,
            order_number=request.order_number,
            method="multicaixa-express",
            amount=request.amount,
            status="pending",
            phone=request.phone
        )
        
        await payments_collection.insert_one(payment.dict())
        
        logger.info(f"Express payment initiated: {transaction_id} for order {request.order_number}")
        
        return PaymentExpressResponse(
            transaction_id=transaction_id,
            status="pending"
        )
    except Exception as e:
        logger.error(f"Error processing express payment: {e}")
        raise HTTPException(status_code=500, detail="Error processing express payment")

@api_router.get("/payments/status/{transaction_id}", response_model=PaymentStatusResponse)
async def get_payment_status(transaction_id: str):
    """Get payment status (MOCKED)"""
    payment = await payments_collection.find_one({"transaction_id": transaction_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment_obj = Payment(**payment)
    
    return PaymentStatusResponse(
        transaction_id=payment_obj.transaction_id,
        status=payment_obj.status,
        order_number=payment_obj.order_number
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)