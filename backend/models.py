from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Category Models
class Category(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    image: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryResponse(BaseModel):
    categories: List[Category]

# Product Models
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    price: float
    original_price: Optional[float] = None
    image: str
    description: str
    stock: int
    colors: List[str]
    featured: bool = False
    rating: float = 4.5
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductResponse(BaseModel):
    products: List[Product]

class SingleProductResponse(BaseModel):
    product: Product

# Order Models
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

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
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

# Payment Models
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
