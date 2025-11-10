from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'lrstore')]

# Collections
categories_collection = db['categories']
products_collection = db['products']
orders_collection = db['orders']
payments_collection = db['payments']

async def init_indexes():
    """Create indexes for better query performance"""
    # Categories
    await categories_collection.create_index('slug', unique=True)
    
    # Products
    await products_collection.create_index('category')
    await products_collection.create_index('featured')
    await products_collection.create_index([('name', 'text'), ('description', 'text')])
    
    # Orders
    await orders_collection.create_index('order_number', unique=True)
    await orders_collection.create_index('customer.email')
    await orders_collection.create_index('status')
    
    # Payments
    await payments_collection.create_index('transaction_id', unique=True)
    await payments_collection.create_index('order_number')
    
    print("✓ Database indexes created")
