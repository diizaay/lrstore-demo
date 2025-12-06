from fastapi import (
    FastAPI,
    APIRouter,
    HTTPException,
    Query,
    status,
    Depends,
    Header,
    UploadFile,
    File,
)
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from passlib.context import CryptContext
import os
import logging
import random
import uuid
import math

from models import (
    # categorias / produtos
    Category,
    CategoryResponse,
    Product,
    ProductResponse,
    SingleProductResponse,
    # pedidos / pagamentos
    Order,
    OrderCreate,
    OrderResponse,
    PaymentReferenceRequest,
    PaymentReferenceResponse,
    PaymentExpressRequest,
    PaymentExpressResponse,
    PaymentStatusResponse,
    Payment,
    # user / auth
    UserCreate,
    UserLogin,
    UserOut,
    LoginResponse,
    UserUpdate,
    PasswordChange,
    # endereços
    AddressCreate,
    AddressOut,
    # novos modelos
    Cart,
    CartItem,
    Favorite,
    Notification,
    ActivityLog,
    AdminOrderUpdate,
    AdminUserUpdate,
    SupportMessageCreate,
    SupportMessage,
    SupportMessageUpdate,
)
from database import (
    db,
    categories_collection,
    products_collection,
    orders_collection,
    payments_collection,
    users_collection,
    addresses_collection,
    carts_collection,
    favorites_collection,
    notifications_collection,
    activity_logs_collection,
    support_messages_collection,
    init_indexes,
)
from seed_data import categories_data, products_data

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


ROOT_DIR = Path(__file__).parent
UPLOADS_DIR = ROOT_DIR / "uploads"
load_dotenv(ROOT_DIR / ".env")

# Create the main app without a prefix
app = FastAPI(title="LR Store API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/admin", tags=["Admin"])


def normalize_slug(slug: str) -> str:
    if not slug:
        return ""
    return slug.strip().lower().replace(" ", "-")


def parse_admin_flag(value: Optional[str]) -> bool:
    if value is None:
        return False
    return str(value).strip().lower() in {"1", "true", "yes", "on"}


def build_pagination(total: int, page: int, limit: int) -> Dict[str, Any]:
    limit = max(1, limit)
    page = max(1, page)
    total_pages = max(math.ceil(total / limit), 1) if total else 1
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "pages": total_pages,
        "has_next": page < total_pages,
        "has_prev": page > 1,
    }


def parse_iso_date(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        # Accept both YYYY-MM-DD and ISO strings
        if len(value) == 10:
            return datetime.fromisoformat(value)
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use ISO format (YYYY-MM-DD).",
        )


async def save_uploaded_file(file: UploadFile) -> str:
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    extension = Path(file.filename or "").suffix.lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOADS_DIR / filename
    content = await file.read()
    with open(file_path, "wb") as buffer:
        buffer.write(content)
    return f"/uploads/{filename}"


async def get_current_admin_user(
    x_user_id: Optional[str] = Header(default=None, alias="X-User-Id"),
    x_is_admin: Optional[str] = Header(default=None, alias="X-Is-Admin"),
):
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing admin user header.",
        )

    if not parse_admin_flag(x_is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    user_doc = await users_collection.find_one({"id": x_user_id})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin user not found.",
        )

    if not user_doc.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return UserOut(**user_doc)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# =====================================================================
# STARTUP
# =====================================================================
@app.on_event("startup")
async def startup_event():
    logger.info("Starting LR Store API...")
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
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


# =====================================================================
# ROOT
# =====================================================================
@api_router.get("/")
async def root():
    return {
        "message": "LR Store API",
        "version": "1.0.0",
        "status": "online",
    }


# =====================================================================
# AUTH / USERS
# =====================================================================
@api_router.post("/auth/register", response_model=UserOut)
async def register_user(user_data: UserCreate):
    """Registar novo utilizador"""
    existing = await users_collection.find_one(
        {"email": user_data.email.lower()}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Email já registado.")

    hashed_password = get_password_hash(user_data.password)

    user_doc = {
        "id": str(uuid.uuid4()),
        "name": user_data.name,
        "email": user_data.email.lower(),
        "phone": user_data.phone,
        "is_admin": False,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    await users_collection.insert_one(user_doc)
    return UserOut(**user_doc)


@api_router.post("/auth/login", response_model=LoginResponse)
async def login_user(credentials: UserLogin):
    """Login simples de utilizador"""
    user_doc = await users_collection.find_one(
        {"email": credentials.email.lower()}
    )
    if not user_doc:
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    if not verify_password(
        credentials.password, user_doc.get("hashed_password", "")
    ):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    user = UserOut(**user_doc)
    token = "dummy-token"  # placeholder enquanto não há JWT

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user,
    )


@api_router.post("/auth/change-password")
async def change_password(data: PasswordChange):
    """
    Alterar a senha do utilizador.
    Usa o email para identificar o utilizador.
    """
    user_doc = await users_collection.find_one(
        {"email": data.email.lower()}
    )
    if not user_doc:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado.")

    hashed_password = user_doc.get("hashed_password")
    if not hashed_password or not verify_password(
        data.current_password, hashed_password
    ):
        raise HTTPException(status_code=400, detail="Senha atual incorreta.")

    new_hashed = get_password_hash(data.new_password)

    await users_collection.update_one(
        {"email": data.email.lower()},
        {"$set": {"hashed_password": new_hashed, "updated_at": datetime.utcnow()}},
    )

    return {"detail": "Senha atualizada com sucesso."}


@api_router.get("/users/{user_id}", response_model=UserOut)
async def get_user_by_id(user_id: str):
    """Obter dados de um utilizador pelo ID."""
    user_doc = await users_collection.find_one({"id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado.")
    return UserOut(**user_doc)


@api_router.patch("/users/{user_id}", response_model=UserOut)
async def update_user(user_id: str, data: UserUpdate):
    """
    Atualizar dados básicos do utilizador (nome, telefone).
    """
    user_doc = await users_collection.find_one({"id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado.")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        return UserOut(**user_doc)

    update_data["updated_at"] = datetime.utcnow()

    await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data},
    )

    user_doc.update(update_data)
    return UserOut(**user_doc)


# =====================================================================
# ORDERS (MEUS PEDIDOS - STUB)
# =====================================================================
@api_router.get("/orders/my")
async def get_my_orders(
    user_id: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    """
    List orders for the current shopper.
    Accepts either user_id (preferred) or email as a fallback.
    """
    filters: List[Dict[str, Any]] = []
    if user_id:
        filters.append({"user_id": user_id})
    if email:
        filters.append({"customer.email": email.lower()})

    if not filters:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id or email is required to fetch orders.",
        )

    if len(filters) == 1:
        query = filters[0]
    else:
        query = {"$or": filters}

    cursor = (
        orders_collection.find(query)
        .sort("created_at", -1)
        .limit(limit)
    )
    orders = [Order(**doc) async for doc in cursor]
    return {"orders": orders}


# =====================================================================
# ADDRESSES
# =====================================================================
@api_router.post("/addresses", response_model=AddressOut)
async def create_address(address: AddressCreate):
    """
    Criar um novo endereço para um utilizador.
    O frontend deve enviar user_id e os campos base.
    """
    user = await users_collection.find_one({"id": address.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Utilizador não encontrado.")

    addr_id = str(uuid.uuid4())
    now = datetime.utcnow()

    addr_doc = {
        "id": addr_id,
        "user_id": address.user_id,
        "contact_name": address.contact_name,
        "phone": address.phone,
        "province": address.province,
        "municipality": address.municipality,
        "neighborhood": address.neighborhood,
        "street": address.street,
        "created_at": now,
        "updated_at": now,
    }

    await addresses_collection.insert_one(addr_doc)
    return AddressOut(**addr_doc)


@api_router.post("/users/me/addresses", response_model=AddressOut)
async def create_my_address(address: AddressCreate):
    """
    Alias para criar endereço via /users/me/addresses.
    """
    return await create_address(address)


@api_router.get("/addresses", response_model=List[AddressOut])
async def list_addresses(user_id: str = Query(...)):
    """
    Listar endereços de um utilizador.
    GET /api/addresses?user_id=XYZ
    """
    docs = await addresses_collection.find({"user_id": user_id}).to_list(100)
    return [AddressOut(**doc) for doc in docs]


@api_router.get("/users/me/addresses", response_model=List[AddressOut])
async def list_my_addresses(user_id: str = Query(...)):
    """
    Alias de /addresses para compatibilidade com o frontend.
    GET /api/users/me/addresses?user_id=XYZ
    """
    return await list_addresses(user_id=user_id)


@api_router.put("/addresses/{address_id}", response_model=AddressOut)
async def update_address(address_id: str, address: AddressCreate):
    """
    Atualizar um endereço existente.
    """
    existing = await addresses_collection.find_one({"id": address_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Endereço não encontrado.")

    # opcionalmente garantir user_id igual
    if existing["user_id"] != address.user_id:
        raise HTTPException(status_code=400, detail="Utilizador não corresponde.")

    update_doc = {
        "contact_name": address.contact_name,
        "phone": address.phone,
        "province": address.province,
        "municipality": address.municipality,
        "neighborhood": address.neighborhood,
        "street": address.street,
        "updated_at": datetime.utcnow(),
    }

    await addresses_collection.update_one(
        {"id": address_id},
        {"$set": update_doc},
    )

    existing.update(update_doc)
    return AddressOut(**existing)


@api_router.put("/users/me/addresses/{address_id}", response_model=AddressOut)
async def update_my_address(address_id: str, address: AddressCreate):
    """
    Alias de /addresses/{address_id} para compatibilidade.
    """
    return await update_address(address_id, address)


@api_router.delete("/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_address(address_id: str, user_id: Optional[str] = None):
    """
    Remover um endereço. Opcionalmente valida o user_id.
    """
    query = {"id": address_id}
    if user_id:
        query["user_id"] = user_id

    result = await addresses_collection.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Endereço não encontrado.")

    return None


@api_router.delete(
    "/users/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_my_address(address_id: str, user_id: Optional[str] = None):
    """
    Alias de /addresses/{address_id}.
    """
    return await delete_address(address_id, user_id=user_id)


# =====================================================================
# FAVORITES (APENAS BACKEND, AINDA NÃO LIGADO AO FRONT)
# =====================================================================
# =====================================================================
# FAVORITES (ligado ao Mongo, compatível com o frontend)
# =====================================================================
from typing import List  # já deve estar importado em cima

@api_router.get("/users/{user_id}/favorites", response_model=List[Favorite])
async def get_favorites(user_id: str):
    """
    Lista de favoritos de um utilizador.
    Remove o _id (ObjectId) de cada documento antes de devolver.
    """
    docs = await favorites_collection.find({"user_id": user_id}).to_list(200)
    favorites: List[Favorite] = []

    for doc in docs:
        doc.pop("_id", None)  # remove ObjectId do Mongo
        favorites.append(Favorite(**doc))

    return favorites


@api_router.post("/users/{user_id}/favorites", response_model=Favorite)
async def add_favorite(user_id: str, product_id: str = Query(...)):
    """
    Adiciona um produto aos favoritos do utilizador.
    Se já existir, devolve o existente.
    """
    # garantir que o produto existe
    product = await products_collection.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    # já existe favorito?
    existing = await favorites_collection.find_one(
        {"user_id": user_id, "product_id": product_id}
    )
    if existing:
        existing.pop("_id", None)
        return Favorite(**existing)

    fav_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "product_id": product_id,
        "created_at": datetime.utcnow(),
    }

    await favorites_collection.insert_one(fav_doc)
    return Favorite(**fav_doc)


@api_router.delete("/users/{user_id}/favorites/{product_id}")
async def remove_favorite(user_id: str, product_id: str):
    """
    Remove um produto dos favoritos do utilizador.
    """
    result = await favorites_collection.delete_one(
        {"user_id": user_id, "product_id": product_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorito não encontrado.")

    return {"detail": "Favorito removido."}


# =====================================================================
# CART (APENAS BACKEND, PARA LIGAR AO FRONT MAIS TARDE)
# =====================================================================
async def _get_or_create_cart(user_id: str) -> Cart:
    """
    Devolve o carrinho do user. Se não existir, cria.
    Remove o campo _id (ObjectId) para não quebrar o Pydantic/FastAPI.
    """
    cart_doc = await carts_collection.find_one({"user_id": user_id})
    if not cart_doc:
        cart = Cart(id=str(uuid.uuid4()), user_id=user_id, items=[])
        await carts_collection.insert_one(cart.dict())
        return cart

    # remover o _id do Mongo
    cart_doc.pop("_id", None)
    return Cart(**cart_doc)



@api_router.get("/users/{user_id}/cart", response_model=Cart)
async def get_cart(user_id: str):
    return await _get_or_create_cart(user_id)


@api_router.post("/users/{user_id}/cart/items", response_model=Cart)
async def add_cart_item(
    user_id: str,
    item: CartItem,
):
    cart = await _get_or_create_cart(user_id)

    # se já existir item com o mesmo product_id, acumula quantidade
    updated = False
    for it in cart.items:
        if it.product_id == item.product_id and it.selected_color == item.selected_color:
            it.quantity += item.quantity
            updated = True
            break
    if not updated:
        cart.items.append(item)

    cart.updated_at = datetime.utcnow()
    await carts_collection.update_one(
        {"id": cart.id},
        {"$set": cart.dict()},
        upsert=True,
    )
    return cart


@api_router.put("/users/{user_id}/cart/items/{product_id}", response_model=Cart)
async def update_cart_item(
    user_id: str,
    product_id: str,
    quantity: int = Query(..., gt=0),
    selected_color: Optional[str] = None,
):
    cart = await _get_or_create_cart(user_id)

    for it in cart.items:
        if it.product_id == product_id and it.selected_color == selected_color:
            it.quantity = quantity
            break

    cart.updated_at = datetime.utcnow()
    await carts_collection.update_one(
        {"id": cart.id},
        {"$set": cart.dict()},
        upsert=True,
    )
    return cart


@api_router.delete("/users/{user_id}/cart/items/{product_id}", response_model=Cart)
async def remove_cart_item(
    user_id: str,
    product_id: str,
    selected_color: Optional[str] = None,
):
    cart = await _get_or_create_cart(user_id)
    cart.items = [
        it
        for it in cart.items
        if not (it.product_id == product_id and it.selected_color == selected_color)
    ]
    cart.updated_at = datetime.utcnow()
    await carts_collection.update_one(
        {"id": cart.id},
        {"$set": cart.dict()},
        upsert=True,
    )
    return cart


@api_router.delete("/users/{user_id}/cart", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(user_id: str):
    cart = await _get_or_create_cart(user_id)
    cart.items = []
    cart.updated_at = datetime.utcnow()
    await carts_collection.update_one(
        {"id": cart.id},
        {"$set": cart.dict()},
        upsert=True,
    )
    return None


# =====================================================================
# CATEGORIES
# =====================================================================
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


# =====================================================================
# PRODUCTS
# =====================================================================
@api_router.get("/products", response_model=ProductResponse)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    is_new: Optional[bool] = Query(None, description="Filter new arrivals"),
    is_promo: Optional[bool] = Query(None, description="Filter promotional products"),
):
    """Get all products with optional filters"""
    try:
        query = {}

        if category:
            query["category"] = category

        if featured is not None:
            query["featured"] = featured
        if is_new is not None:
            query["is_new"] = is_new
        if is_promo is not None:
            query["is_promo"] = is_promo

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


# =====================================================================
# ORDERS
# =====================================================================
@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    try:
        order_number = str(random.randint(100000, 999999))

        while await orders_collection.find_one({"order_number": order_number}):
            order_number = str(random.randint(100000, 999999))

        customer_payload = order_data.customer.copy()
        if customer_payload.email:
            customer_payload.email = customer_payload.email.lower()

        order = Order(
            order_number=order_number,
            user_id=order_data.user_id,
            customer=customer_payload,
            items=order_data.items,
            payment_method=order_data.payment_method,
            total=order_data.total,
        )

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


# =====================================================================
# SUPPORT MESSAGES
# =====================================================================
@api_router.post("/support-messages", response_model=SupportMessage)
async def create_support_message(payload: SupportMessageCreate):
    """Store a contact message to be reviewed by admins."""
    data = payload.dict()
    if data.get("email"):
        data["email"] = data["email"].lower()

    message = SupportMessage(**data)
    await support_messages_collection.insert_one(message.dict())
    return message


# =====================================================================
# PAYMENTS
# =====================================================================
@api_router.post(
    "/payments/multicaixa/reference", response_model=PaymentReferenceResponse
)
async def generate_payment_reference(request: PaymentReferenceRequest):
    """Generate Multicaixa payment reference (MOCKED)"""
    try:
        reference = str(random.randint(100000000, 999999999))
        entity = "11111"
        expiry_date = (datetime.utcnow() + timedelta(days=3)).isoformat()

        payment = Payment(
            transaction_id=f"REF-{reference}",
            order_number=request.order_number,
            method="multicaixa-reference",
            amount=request.amount,
            status="pending",
            reference=reference,
        )

        await payments_collection.insert_one(payment.dict())

        # marca o pedido como pendente de pagamento
        await orders_collection.update_one(
            {"order_number": request.order_number},
            {
                "$set": {
                    "payment_reference": reference,
                    "payment_method": "multicaixa-reference",
                    "payment_status": "pending",
                    "updated_at": datetime.utcnow(),
                }
            },
        )

        logger.info(
            f"Payment reference generated: {reference} for order {request.order_number}"
        )

        return PaymentReferenceResponse(
            reference=reference,
            entity=entity,
            expiry_date=expiry_date,
        )
    except Exception as e:
        logger.error(f"Error generating payment reference: {e}")
        raise HTTPException(
            status_code=500, detail="Error generating payment reference"
        )


@api_router.post(
    "/payments/multicaixa/express", response_model=PaymentExpressResponse
)
async def process_express_payment(request: PaymentExpressRequest):
    """Process Multicaixa Express payment (MOCKED)"""
    try:
        transaction_id = f"EXP-{random.randint(1000000, 9999999)}"

        payment = Payment(
            transaction_id=transaction_id,
            order_number=request.order_number,
            method="multicaixa-express",
            amount=request.amount,
            status="pending",
            phone=request.phone,
        )

        await payments_collection.insert_one(payment.dict())

        # marca o pedido como pendente de pagamento
        await orders_collection.update_one(
            {"order_number": request.order_number},
            {
                "$set": {
                    "payment_method": "multicaixa-express",
                    "payment_status": "pending",
                    "updated_at": datetime.utcnow(),
                }
            },
        )

        logger.info(
            f"Express payment initiated: {transaction_id} for order {request.order_number}"
        )

        return PaymentExpressResponse(
            transaction_id=transaction_id,
            status="pending",
        )
    except Exception as e:
        logger.error(f"Error processing express payment: {e}")
        raise HTTPException(
            status_code=500, detail="Error processing express payment"
        )

@api_router.post(
    "/payments/mock/pay/{transaction_id}", response_model=PaymentStatusResponse
)
async def mock_pay_transaction(transaction_id: str):
    """
    Endpoint de desenvolvimento para SIMULAR que o pagamento foi concluído com sucesso.
    Usa pelo Swagger clicando neste endpoint.
    """
    payment = await payments_collection.find_one(
        {"transaction_id": transaction_id}
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # marca o pagamento como pago
    await payments_collection.update_one(
        {"transaction_id": transaction_id},
        {
            "$set": {
                "status": "paid",
                "updated_at": datetime.utcnow(),
            }
        },
    )

    pay_doc = await payments_collection.find_one(
        {"transaction_id": transaction_id}
    )
    payment_obj = Payment(**pay_doc)

    # atualiza o pedido associado
    await orders_collection.update_one(
        {"order_number": payment_obj.order_number},
        {
            "$set": {
                "payment_status": "paid",
                "status": "confirmed",
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return PaymentStatusResponse(
        transaction_id=payment_obj.transaction_id,
        status=payment_obj.status,
        order_number=payment_obj.order_number,
    )


# =====================================================================
# ORDERS
# =====================================================================
@api_router.post("/orders", response_model=OrderResponse)
async def create_order(order_data: OrderCreate):
    """Create a new order"""
    try:
        # Gera número de pedido de 6 dígitos (garantindo unicidade)
        order_number = str(random.randint(100000, 999999))
        while await orders_collection.find_one({"order_number": order_number}):
            order_number = str(random.randint(100000, 999999))

        now = datetime.utcnow()

        # Preenche o modelo Order.
        # Assumindo que o modelo Order tem campos opcionais como:
        # status, payment_status, created_at, updated_at
        order = Order(
            order_number=order_number,
            customer=order_data.customer,
            items=order_data.items,
            payment_method=order_data.payment_method,
            total=order_data.total,
            status="new",
            payment_status="pending",
            created_at=now,
            updated_at=now,
        )

        order_dict = order.dict()
        await orders_collection.insert_one(order_dict)

        logger.info(f"Order created: {order_number}")
        return {"order": order}
    except Exception as e:
        logger.error(f"Error creating order: {e}")
        raise HTTPException(status_code=500, detail="Error creating order")


# =====================================================================
# ADMIN ROUTES
# =====================================================================
@admin_router.get("/categories", response_model=CategoryResponse)
async def admin_list_categories(
    current_admin: UserOut = Depends(get_current_admin_user),
):
    cursor = categories_collection.find().sort("created_at", -1)
    categories = [Category(**doc) async for doc in cursor]
    return {"categories": categories}


@admin_router.post("/categories", response_model=Category)
async def admin_create_category(
    category: Category, current_admin: UserOut = Depends(get_current_admin_user)
):
    slug = normalize_slug(category.slug or category.name)
    existing = await categories_collection.find_one({"slug": slug})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category slug already exists.",
        )

    category_data = category.dict()
    category_data["slug"] = slug
    await categories_collection.insert_one(category_data)
    return Category(**category_data)


@admin_router.put("/categories/{category_id}", response_model=Category)
async def admin_update_category(
    category_id: str,
    category: Category,
    current_admin: UserOut = Depends(get_current_admin_user),
):
    existing = await categories_collection.find_one({"id": category_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Category not found.")

    slug = normalize_slug(category.slug or existing.get("slug", ""))
    if slug != existing.get("slug"):
        slug_conflict = await categories_collection.find_one({"slug": slug})
        if slug_conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category slug already exists.",
            )

    update_fields = {
        "name": category.name,
        "slug": slug,
        "image": category.image,
        "description": category.description,
    }

    await categories_collection.update_one(
        {"id": category_id},
        {"$set": update_fields},
    )

    updated = await categories_collection.find_one({"id": category_id})
    return Category(**updated)


@admin_router.delete("/categories/{category_id}")
async def admin_delete_category(
    category_id: str, current_admin: UserOut = Depends(get_current_admin_user)
):
    result = await categories_collection.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found.")
    return {"status": "deleted"}


@admin_router.get("/products")
async def admin_list_products(
    current_admin: UserOut = Depends(get_current_admin_user),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
):
    filters: Dict[str, Any] = {}
    if search:
        filters["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    total = await products_collection.count_documents(filters)
    cursor = (
        products_collection.find(filters)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    products = [Product(**doc) async for doc in cursor]

    return {
        "products": products,
        "pagination": build_pagination(total, page, limit),
    }


@admin_router.get("/products/{product_id}", response_model=SingleProductResponse)
async def admin_get_product(
    product_id: str, current_admin: UserOut = Depends(get_current_admin_user)
):
    product = await products_collection.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"product": Product(**product)}


@admin_router.post("/products", response_model=SingleProductResponse)
async def admin_create_product(
    product: Product, current_admin: UserOut = Depends(get_current_admin_user)
):
    product_data = product.dict()
    product_data["created_at"] = datetime.utcnow()
    product_data["updated_at"] = datetime.utcnow()
    await products_collection.insert_one(product_data)
    return {"product": Product(**product_data)}


@admin_router.put("/products/{product_id}", response_model=SingleProductResponse)
async def admin_update_product(
    product_id: str,
    product: Product,
    current_admin: UserOut = Depends(get_current_admin_user),
):
    existing = await products_collection.find_one({"id": product_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Product not found.")

    updated_data = product.dict()
    updated_data["id"] = product_id
    updated_data["created_at"] = existing.get("created_at", datetime.utcnow())
    updated_data["updated_at"] = datetime.utcnow()

    await products_collection.update_one(
        {"id": product_id},
        {"$set": updated_data},
    )

    refreshed = await products_collection.find_one({"id": product_id})
    return {"product": Product(**refreshed)}


@admin_router.delete("/products/{product_id}")
async def admin_delete_product(
    product_id: str, current_admin: UserOut = Depends(get_current_admin_user)
):
    result = await products_collection.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found.")
    return {"status": "deleted"}


@admin_router.get("/orders")
async def admin_list_orders(
    current_admin: UserOut = Depends(get_current_admin_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    payment_status: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    filters: Dict[str, Any] = {}
    if status_filter:
        filters["status"] = status_filter
    if payment_status:
        filters["payment_status"] = payment_status

    date_filter: Dict[str, Any] = {}
    start_date = parse_iso_date(date_from)
    end_date = parse_iso_date(date_to)
    if start_date:
        date_filter["$gte"] = start_date
    if end_date:
        # Include the entire day by adding one day and subtracting a microsecond
        end_range = end_date + timedelta(days=1)
        date_filter["$lt"] = end_range
    if date_filter:
        filters["created_at"] = date_filter

    total = await orders_collection.count_documents(filters)
    cursor = (
        orders_collection.find(filters)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    orders = [Order(**doc) async for doc in cursor]

    return {
        "orders": orders,
        "pagination": build_pagination(total, page, limit),
    }


@admin_router.get("/orders/{order_number}", response_model=OrderResponse)
async def admin_get_order(
    order_number: str, current_admin: UserOut = Depends(get_current_admin_user)
):
    order = await orders_collection.find_one({"order_number": order_number})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return {"order": Order(**order)}


@admin_router.patch("/orders/{order_number}", response_model=OrderResponse)
async def admin_update_order(
    order_number: str,
    payload: AdminOrderUpdate,
    current_admin: UserOut = Depends(get_current_admin_user),
):
    update_data = payload.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )

    update_data["updated_at"] = datetime.utcnow()

    result = await orders_collection.update_one(
        {"order_number": order_number},
        {"$set": update_data},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found.")

    refreshed = await orders_collection.find_one({"order_number": order_number})
    return {"order": Order(**refreshed)}


@admin_router.get("/users")
async def admin_list_users(
    current_admin: UserOut = Depends(get_current_admin_user),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    filters: Dict[str, Any] = {}
    if search:
        filters["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    total = await users_collection.count_documents(filters)
    cursor = (
        users_collection.find(filters)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    users = [UserOut(**doc) async for doc in cursor]

    return {
        "users": users,
        "pagination": build_pagination(total, page, limit),
    }


@admin_router.get("/users/{user_id}", response_model=UserOut)
async def admin_get_user(
    user_id: str, current_admin: UserOut = Depends(get_current_admin_user)
):
    user_doc = await users_collection.find_one({"id": user_id})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserOut(**user_doc)


@admin_router.patch("/users/{user_id}", response_model=UserOut)
async def admin_update_user(
    user_id: str,
    payload: AdminUserUpdate,
    current_admin: UserOut = Depends(get_current_admin_user),
):
    update_data = payload.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )

    await users_collection.update_one(
        {"id": user_id},
        {"$set": update_data},
    )

    updated = await users_collection.find_one({"id": user_id})
    if not updated:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserOut(**updated)


@admin_router.get("/support-messages")
async def admin_list_support_messages(
    current_admin: UserOut = Depends(get_current_admin_user),
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    filters: Dict[str, Any] = {}
    if status_filter:
        filters["status"] = status_filter

    total = await support_messages_collection.count_documents(filters)
    cursor = (
        support_messages_collection.find(filters)
        .sort("created_at", -1)
        .skip((page - 1) * limit)
        .limit(limit)
    )
    messages = [SupportMessage(**doc) async for doc in cursor]

    return {
        "messages": messages,
        "pagination": build_pagination(total, page, limit),
    }


@admin_router.patch("/support-messages/{message_id}", response_model=SupportMessage)
async def admin_update_support_message(
    message_id: str,
    payload: SupportMessageUpdate,
    current_admin: UserOut = Depends(get_current_admin_user),
):
    update_data = payload.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update.",
        )

    result = await support_messages_collection.update_one(
        {"id": message_id},
        {"$set": update_data},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found.")

    updated = await support_messages_collection.find_one({"id": message_id})
    return SupportMessage(**updated)


@admin_router.get("/dashboard/summary")
async def admin_dashboard_summary(
    current_admin: UserOut = Depends(get_current_admin_user),
):
    total_users = await users_collection.count_documents({})
    total_orders = await orders_collection.count_documents({})
    total_products = await products_collection.count_documents({})

    total_revenue = 0.0
    async for paid_order in orders_collection.find(
        {"payment_status": "paid"}, {"total": 1}
    ):
        total_revenue += paid_order.get("total", 0.0)

    today = datetime.utcnow().date()
    last_7_days_orders: List[Dict[str, Any]] = []
    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        start = datetime.combine(day, datetime.min.time())
        end = start + timedelta(days=1)
        count = await orders_collection.count_documents(
            {"created_at": {"$gte": start, "$lt": end}}
        )
        last_7_days_orders.append(
            {
                "date": day.isoformat(),
                "count": count,
            }
        )

    top_products_cursor = orders_collection.aggregate(
        [
            {"$unwind": "$items"},
            {
                "$group": {
                    "_id": "$items.product_id",
                    "count": {"$sum": "$items.quantity"},
                    "revenue": {
                        "$sum": {
                            "$multiply": ["$items.quantity", "$items.price"]
                        }
                    },
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 5},
        ]
    )

    raw_top_products = await top_products_cursor.to_list(length=5)
    top_products = []
    for entry in raw_top_products:
        product = await products_collection.find_one({"id": entry["_id"]})
        top_products.append(
            {
                "product_id": entry["_id"],
                "name": product["name"] if product else "Produto",
                "count": entry.get("count", 0),
                "revenue": entry.get("revenue", 0.0),
            }
        )

    return {
        "total_users": total_users,
        "total_orders": total_orders,
        "total_products": total_products,
        "total_revenue": round(total_revenue, 2),
        "last_7_days_orders": last_7_days_orders,
        "top_products": top_products,
    }


@admin_router.post("/uploads")
async def admin_upload_file(
    file: UploadFile = File(...),
    current_admin: UserOut = Depends(get_current_admin_user),
):
    allowed_types = {"image/png", "image/jpeg", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Use PNG, JPG or WEBP.",
        )

    relative_path = await save_uploaded_file(file)
    return {"url": relative_path}


# =====================================================================
# INCLUDE ROUTER / CORS
# =====================================================================
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
api_router.include_router(admin_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
