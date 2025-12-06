from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
db_name = os.environ.get("DB_NAME", "lrstore")

client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# ----------------------------
# Collections
# ----------------------------
categories_collection = db["categories"]
products_collection = db["products"]

orders_collection = db["orders"]
payments_collection = db["payments"]

users_collection = db["users"]
addresses_collection = db["addresses"]

carts_collection = db["carts"]
favorites_collection = db["favorites"]
notifications_collection = db["notifications"]
activity_logs_collection = db["activity_logs"]
support_messages_collection = db["support_messages"]


async def init_indexes():
    """Inicializa todos os índices necessários."""

    await categories_collection.create_index("slug", unique=True)

    await products_collection.create_index("category")
    await products_collection.create_index("featured")
    await products_collection.create_index([("name", "text"), ("description", "text")])
    await products_collection.create_index("price")
    await products_collection.create_index("rating")
    await products_collection.create_index("is_new")
    await products_collection.create_index("is_promo")

    await orders_collection.create_index("order_number", unique=True)
    await orders_collection.create_index("customer.email")
    await orders_collection.create_index("status")
    await orders_collection.create_index("created_at")
    await orders_collection.create_index("user_id", sparse=True)

    await payments_collection.create_index("transaction_id", unique=True)
    await payments_collection.create_index("order_number")

    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("phone", sparse=True)
    await users_collection.create_index("is_admin")

    await addresses_collection.create_index("user_id")
    await addresses_collection.create_index("province")
    await addresses_collection.create_index("municipality")

    await carts_collection.create_index("user_id", unique=True)

    await favorites_collection.create_index(
        [("user_id", 1), ("product_id", 1)],
        unique=True,
    )

    await notifications_collection.create_index("user_id")
    await notifications_collection.create_index("is_read")
    await notifications_collection.create_index("created_at")

    await activity_logs_collection.create_index("user_id")
    await activity_logs_collection.create_index("action")
    await activity_logs_collection.create_index("created_at")

    await support_messages_collection.create_index("email")
    await support_messages_collection.create_index("status")
    await support_messages_collection.create_index("created_at")

    print("✓ All database indexes created successfully")
