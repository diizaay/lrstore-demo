from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# =====================================================================
# HELPERS
# =====================================================================

def generate_id() -> str:
    return str(uuid.uuid4())

# =====================================================================
# USER UPDATE / PASSWORD CHANGE (usados no server.py)
# =====================================================================

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None


class PasswordChange(BaseModel):
    # usado na rota /auth/change-password
    email: EmailStr
    current_password: str
    new_password: str

# =====================================================================
# CATEGORY MODELS
# =====================================================================

class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    image: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CategoryResponse(BaseModel):
    categories: List[Category]

# =====================================================================
# PRODUCT MODELS
# =====================================================================

class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str                       # slug ou id da categoria
    price: float
    original_price: Optional[float] = None
    image: str
    description: str
    stock: int
    colors: List[str]
    featured: bool = False
    is_new: bool = False
    is_promo: bool = False
    rating: float = 4.5
    gallery: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProductResponse(BaseModel):
    products: List[Product]


class SingleProductResponse(BaseModel):
    product: Product

# =====================================================================
# ORDER MODELS (baseados no que já tens em server.py)
# =====================================================================

class OrderCustomer(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    city: str


class OrderItem(BaseModel):
    product_id: str
    name: str
    quantity: int
    selected_color: Optional[str] = None
    price: float
    image: str


class OrderCreate(BaseModel):
    customer: OrderCustomer
    items: List[OrderItem]
    payment_method: str
    total: float
    user_id: Optional[str] = None


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    user_id: Optional[str] = None
    customer: OrderCustomer
    items: List[OrderItem]
    payment_method: str
    payment_status: str = "pending"
    payment_reference: Optional[str] = None
    total: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class OrderResponse(BaseModel):
    order: Order


class AdminOrderUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None

# =====================================================================
# PAYMENT MODELS (Multicaixa mock, já usados)
# =====================================================================

class PaymentReferenceRequest(BaseModel):
    order_number: str
    amount: float


class PaymentReferenceResponse(BaseModel):
    reference: str
    entity: str
    expiry_date: str


class PaymentExpressRequest(BaseModel):
    order_number: str
    phone: str
    amount: float


class PaymentExpressResponse(BaseModel):
    transaction_id: str
    status: str


class PaymentStatusResponse(BaseModel):
    transaction_id: str
    status: str
    order_number: str


class Payment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transaction_id: str
    order_number: str
    method: str
    amount: float
    status: str
    reference: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentExpressRequest(BaseModel):
    order_number: str   # número do pedido (string)
    amount: float       # valor a pagar (float)
    phone: str          # telefone Multicaixa Express


class PaymentExpressResponse(BaseModel):
    transaction_id: str
    status: str  # "pending", "paid", "failed"


class PaymentStatusResponse(BaseModel):
    transaction_id: str
    status: str
    order_number: Optional[str] = None    

# =====================================================================
# USER / AUTH MODELS
# =====================================================================

class UserBase(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    pass


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class AdminUserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    is_admin: Optional[bool] = None

# =====================================================================
# ADDRESS MODELS (endereços de entrega)
# =====================================================================

class AddressBase(BaseModel):
    contact_name: str
    phone: str
    province: str
    municipality: str
    neighborhood: str
    street: str


class AddressCreate(AddressBase):
    user_id: str   # id do usuário dono do endereço


class AddressOut(AddressBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

# =====================================================================
# CART MODELS (carrinho na DB)
# =====================================================================

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1
    selected_color: Optional[str] = None


class Cart(BaseModel):
    id: str = Field(default_factory=generate_id)
    user_id: str
    items: List[CartItem] = Field(default_factory=list)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CartResponse(BaseModel):
    cart: Cart

# =====================================================================
# FAVORITES MODELS – favoritos na DB
# =====================================================================

class Favorite(BaseModel):
    id: str = Field(default_factory=generate_id)
    user_id: str
    product_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class FavoritesResponse(BaseModel):
    favorites: List[Favorite]

# =====================================================================
# NOTIFICATIONS (para futuro painel/Admin, emails, etc.)
# =====================================================================

class Notification(BaseModel):
    id: str = Field(default_factory=generate_id)
    user_id: str
    title: str
    message: str
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class NotificationsResponse(BaseModel):
    notifications: List[Notification]

# =====================================================================
# ACTIVITY LOGS (registo de ações do utilizador/admin)
# =====================================================================

class ActivityLog(BaseModel):
    id: str = Field(default_factory=generate_id)
    user_id: Optional[str] = None
    action: str
    details: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ActivityLogsResponse(BaseModel):
    logs: List[ActivityLog]


# =====================================================================
# SUPPORT / CONTACT MESSAGES
# =====================================================================

class SupportMessageBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str


class SupportMessageCreate(SupportMessageBase):
    user_id: Optional[str] = None


class SupportMessage(SupportMessageBase):
    id: str = Field(default_factory=generate_id)
    user_id: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class SupportMessageUpdate(BaseModel):
    status: Optional[str] = None
