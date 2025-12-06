import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {
  Archive,
  Heart,
  LogOut,
  MapPin,
  Shield,
  ShoppingBag,
  UserRound,
  Plus,
  PenLine,
  Trash2,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  api,
  updateProfile,
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  changeUserPassword,
  getMyOrders,
} from "../services/api";
import { Button } from "../components/ui/button";
import { toast } from "../hooks/use-toast";

const ORDER_STATUS_STEPS = [
  { id: "pending", label: "Recebido" },
  { id: "processing", label: "Em preparação" },
  { id: "shipped", label: "Enviado" },
  { id: "delivered", label: "Entregue" },
];

function OrderStatusTracker({ status }) {
  const normalized = (status || "pending").toLowerCase();
  if (normalized === "cancelled" || normalized === "canceled") {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3 text-sm text-rose-700">
        Este pedido foi cancelado. Se isto for um engano, fala connosco para
        ajudarmos.
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.findIndex((step) =>
    normalized.includes(step.id)
  );
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        Progresso do pedido
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <div className="flex items-center">
          {ORDER_STATUS_STEPS.map((step, index) => {
            const active = index <= activeIndex;
            const nextActive = index < activeIndex;
            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${
                    active
                      ? "bg-emerald-500 text-white shadow"
                      : "border border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {index + 1}
                </div>
                {index < ORDER_STATUS_STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-1 flex-1 rounded-full ${
                      nextActive ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          {ORDER_STATUS_STEPS.map((step) => (
            <span key={step.id} className="flex-1 text-center">
              {step.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const menuItems = [
  { id: "profile", label: "Dados pessoais", icon: UserRound },
  { id: "addresses", label: "Endereços", icon: MapPin },
  { id: "security", label: "Segurança", icon: Shield },
  { id: "recent-orders", label: "Meus pedidos", icon: ShoppingBag },
  { id: "old-orders", label: "Pedidos antigos", icon: Archive },
  { id: "wishlist", label: "Lista de desejos", icon: Heart },
];

const emptyAddress = {
  id: null,
  contactName: "",
  phone: "",
  province: "",
  municipio: "",
  bairro: "",
  street: "",
};

const normalizeApiText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((item) => item?.msg || item?.message || JSON.stringify(item))
      .join(" | ");
  }
  if (typeof value === "object") {
    return value.msg || value.message || JSON.stringify(value);
  }
  return String(value);
};

const translateOrderMessage = (message) => {
  const normalized = normalizeApiText(message);
  if (!normalized) return "";
  if (normalized.toLowerCase().includes("order not found")) {
    return "Pedido não encontrado.";
  }
  return normalized;
};

const getApiErrorMessage = (error, fallback) => {
  const detail = normalizeApiText(error?.response?.data?.detail);
  if (detail) return detail;
  const message = normalizeApiText(error?.response?.data?.message);
  if (message) return message;
  if (typeof error?.response?.data === "string") {
    return error.response.data;
  }
  const normalizedData = normalizeApiText(error?.response?.data);
  if (normalizedData) return normalizedData;
  const general = normalizeApiText(error?.message);
  if (general) return general;
  return fallback;
};

const AccountPage = () => {
  const { user, isAuthenticated, logout, loading, updateUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeSection, setActiveSection] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    phone: "",
    taxId: "",
  });
  const [savingPersonal, setSavingPersonal] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [savingAddress, setSavingAddress] = useState(false);

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setPersonalForm({
      name: user.name || user.full_name || user.fullName || "",
      email: user.email || "",
      phone: user.phone || user.phone_number || "",
      taxId: user.tax_id || user.nif || "",
    });
  }, [user]);

  const loadAddresses = useCallback(async () => {
    if (!user?.id) return;
    setAddressesLoading(true);
    try {
      const data = await getUserAddresses(user.id);
      const parsed = Array.isArray(data)
        ? data
        : Array.isArray(data?.addresses)
        ? data.addresses
        : [];
      setAddresses(parsed);
    } catch (err) {
      console.error("[AccountPage] Erro ao carregar endereços:", err);
      toast({
        title: "Erro ao carregar endereços",
        description: getApiErrorMessage(
          err,
          "Não foi possível obter os endereços agora."
        ),
        variant: "destructive",
      });
    } finally {
      setAddressesLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadAddresses();
    }
  }, [isAuthenticated, user?.id, loadAddresses]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) return;
      setOrdersLoading(true);
      setOrdersError("");

      try {
        const data = await getMyOrders({
          user_id: user?.id,
          email: user?.email,
        });
        const normalized = Array.isArray(data) ? data : [];
        normalized.sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || a.date || 0);
          const dateB = new Date(b.created_at || b.createdAt || b.date || 0);
          return dateB - dateA;
        });
        setOrders(normalized);
      } catch (err) {
        console.error("[AccountPage] Erro ao carregar pedidos:", err);
        setOrdersError(
          translateOrderMessage(
            err.response?.data?.detail ||
              err.response?.data?.message ||
              "Não foi possível carregar os pedidos."
          )
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
  const oldOrders = useMemo(() => orders.slice(3), [orders]);

  const handlePersonalSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) return;
    setSavingPersonal(true);
    try {
      const payload = {
        full_name: personalForm.name.trim(),
        email: personalForm.email.trim(),
        phone_number: personalForm.phone.trim(),
        tax_id: personalForm.taxId.trim(),
      };
      const updatedUserData = await updateProfile(user.id, payload);
      if (updatedUserData) {
        updateUser(updatedUserData);
      }
      toast({
        title: "Dados atualizados",
        description: "As informações foram guardadas com sucesso.",
      });
    } catch (err) {
      console.error("[AccountPage] Erro ao atualizar perfil:", err);
      toast({
        title: "Erro ao atualizar",
        description: getApiErrorMessage(
          err,
          "Não foi possível guardar as alterações."
        ),
        variant: "destructive",
      });
    } finally {
      setSavingPersonal(false);
    }
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) return;

    const payload = {
      contactName: addressForm.contactName.trim(),
      phone: addressForm.phone.trim(),
      province: addressForm.province.trim(),
      municipio: addressForm.municipio.trim(),
      bairro: addressForm.bairro.trim(),
      street: addressForm.street.trim(),
    };

    if (Object.values(payload).some((value) => !value)) {
      toast({
        title: "Campos obrigatórios",
        description: "Preenche todas as informações do endereço.",
        variant: "destructive",
      });
      return;
    }

    setSavingAddress(true);
    try {
      if (editingAddressId) {
        await updateUserAddress(user.id, editingAddressId, payload);
        toast({
          title: "Endereço atualizado",
          description: "Os dados do endereço foram guardados.",
        });
      } else {
        await createUserAddress(user.id, payload);
        toast({
          title: "Endereço adicionado",
          description: "Novo endereço disponível para as próximas compras.",
        });
      }
      setAddressForm(emptyAddress);
      setEditingAddressId(null);
      loadAddresses();
    } catch (err) {
      console.error("[AccountPage] Erro ao guardar endereço:", err);
      toast({
        title: "Erro ao guardar endereço",
        description: getApiErrorMessage(
          err,
          "Não foi possível guardar este endereço."
        ),
        variant: "destructive",
      });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      id: address.id,
      contactName:
        address.contact_name || address.contactName || address.label || "",
      phone: address.phone || "",
      province: address.province || "",
      municipio: address.municipality || address.municipio || address.city || "",
      bairro: address.neighborhood || address.bairro || "",
      street: address.street || "",
    });
  };

  const handleDeleteAddress = async (addressId) => {
    if (!user?.id) return;
    try {
      await deleteUserAddress(user.id, addressId);
      toast({
        title: "Endereço removido",
        description: "O endereço foi eliminado da sua conta.",
      });
      if (editingAddressId === addressId) {
        setAddressForm(emptyAddress);
        setEditingAddressId(null);
      }
      loadAddresses();
    } catch (err) {
      console.error("[AccountPage] Erro ao eliminar endereço:", err);
      toast({
        title: "Erro ao eliminar endereço",
        description: getApiErrorMessage(
          err,
          "Não foi possível remover este endereço."
        ),
        variant: "destructive",
      });
    }
  };

  const handleSecuritySubmit = async (event) => {
    event.preventDefault();
    if (!user?.email) return;

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "As palavras-passe não coincidem",
        description: "Confirma os dados antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      await changeUserPassword({
        email: user.email,
        current_password: securityForm.currentPassword,
        new_password: securityForm.newPassword,
      });
      toast({
        title: "Palavra-passe atualizada",
        description: "A tua segurança está em dia.",
      });
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("[AccountPage] Erro ao mudar senha:", err);
      toast({
        title: "Erro ao atualizar palavra-passe",
        description: getApiErrorMessage(
          err,
          "Não foi possível alterar a palavra-passe."
        ),
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const renderOrdersList = (list, emptyMessage) => {
    if (ordersLoading) {
      return (
        <p className="text-sm text-gray-500 animate-pulse">
          A carregar pedidos...
        </p>
      );
    }

    if (ordersError) {
      return (
        <p className="text-sm text-red-600" role="alert">
          {ordersError}
        </p>
      );
    }

    if (list.length === 0) {
      return <p className="text-sm text-gray-500">{emptyMessage}</p>;
    }

    return (
      <div className="space-y-4">
        {list.map((order) => (
          <div
            key={order.id || order._id || order.code}
            className="space-y-4 rounded-2xl border border-gray-100 bg-white/90 p-5 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-gray-500">Pedido</p>
                <p className="text-lg font-semibold text-gray-900">
                  #{order.code || order.id || order._id}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(
                    order.created_at ||
                      order.createdAt ||
                      order.date ||
                      Date.now()
                  ).toLocaleString("pt-PT")}
                </p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500">Total</p>
                <p className="font-semibold text-emerald-600">
                  {order.totalFormatted ||
                    order.total_label ||
                    new Intl.NumberFormat("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                    }).format(order.total || 0)}
                </p>
              </div>
              <div className="text-sm text-right">
                <p className="text-gray-500">Estado atual</p>
                <p className="font-semibold text-purple-700">
                  {order.status || "Em processamento"}
                </p>
              </div>
            </div>
            <OrderStatusTracker status={order.status} />
          </div>
        ))}
      </div>
    );
  };

  const renderWishlist = () => {
    if (wishlist.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 p-6 text-center text-sm text-pink-700">
          A tua lista de desejos está vazia. Toca no coração dos produtos para
          guardá-los aqui.
        </div>
      );
    }

    return (
      <div className="grid gap-4">
        {wishlist.map((item) => {
          const identifier = item.slug || item._id || item.id;
          const productLink = "/produto/" + identifier;
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 rounded-2xl border border-gray-100 p-4 bg-white"
            >
              <Link
                to={productLink}
                className="w-full sm:w-32 h-32 overflow-hidden rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <img
                  src={item.imageUrl || item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase text-gray-400">
                      Ref: {String(item.id).toUpperCase()}
                    </p>
                    <Link
                      to={productLink}
                      className="text-lg font-semibold text-gray-900 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Remover da lista de desejos"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-500">
                  {item.categoryName || item.category || "Produto LR Store"}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-purple-900">
                    {new Intl.NumberFormat("pt-AO", {
                      style: "currency",
                      currency: "AOA",
                    }).format(item.promoPrice || item.price || 0)}
                  </span>
                  {item.promoPrice && (
                    <span className="text-xs line-through text-gray-400">
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      }).format(item.price || 0)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => addToCart(item, 1)}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold"
                  >
                    Adicionar ao carrinho
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-xs"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        A preparar a sua conta...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 via-white to-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-3xl bg-white shadow-2xl border border-purple-100 p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center text-2xl font-bold">
              {(user?.name || user?.email || "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500">Bem-vindo(a)</p>
              <h1 className="text-2xl font-black text-gray-900">
                {personalForm.name || "Conta LR Store"}
              </h1>
              <p className="text-sm text-gray-500">{personalForm.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveSection("wishlist")}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Favoritos ({wishlist.length})
            </Button>
            <Button
              onClick={logout}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              <LogOut className="w-4 h-4" />
              Terminar sessão
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl bg-white shadow-md border border-gray-100 p-4 h-fit">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <section className="space-y-6">
            {activeSection === "profile" && (
              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center">
                    <UserRound className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Dados pessoais
                    </h2>
                    <p className="text-sm text-gray-500">
                      Garante que os teus dados estão atualizados.
                    </p>
                  </div>
                </div>

                <form className="grid gap-4" onSubmit={handlePersonalSubmit}>
                  <label className="text-sm font-medium text-gray-700">
                    Nome completo
                    <input
                      type="text"
                      value={personalForm.name}
                      onChange={(event) =>
                        setPersonalForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </label>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                      <input
                        type="email"
                        value={personalForm.email}
                        onChange={(event) =>
                          setPersonalForm((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                        disabled
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Telefone
                      <input
                        type="tel"
                        value={personalForm.phone}
                        onChange={(event) =>
                          setPersonalForm((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </label>
                  </div>

                  <label className="text-sm font-medium text-gray-700">
                    NIF / Documento
                    <input
                      type="text"
                      value={personalForm.taxId}
                      onChange={(event) =>
                        setPersonalForm((prev) => ({
                          ...prev,
                          taxId: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                    />
                  </label>

                  <Button
                    type="submit"
                    disabled={savingPersonal}
                    className="self-start bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold disabled:opacity-60"
                  >
                    {savingPersonal ? "A guardar..." : "Guardar alterações"}
                  </Button>
                </form>
              </div>
            )}

            {activeSection === "addresses" && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Endereços
                      </h2>
                      <p className="text-sm text-gray-500">
                        Mantém os endereços sempre atualizados para entregas
                        rápidas.
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      <MapPin className="w-4 h-4" />
                      {addresses.length} guardado(s)
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {addressesLoading ? (
                      <p className="text-sm text-gray-500">
                        A carregar endereços...
                      </p>
                    ) : addresses.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        Ainda não adicionaste endereços. Usa o formulário
                        abaixo para criar o primeiro.
                      </p>
                    ) : (
                      addresses.map((address) => (
                        <div
                          key={address.id}
                          className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {address.contact_name ||
                                  address.contactName ||
                                  "Contacto"}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {address.phone}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditAddress(address)}
                                className="text-gray-500 hover:text-purple-600 text-xs font-semibold inline-flex items-center gap-1"
                              >
                                <PenLine className="w-4 h-4" />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street},{" "}
                            {address.bairro || address.neighborhood} -{" "}
                            {address.municipality ||
                              address.municipio ||
                              address.city}
                            , {address.province}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-dashed border-purple-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-600" />
                    {editingAddressId
                      ? "Atualizar endereço"
                      : "Adicionar endereço"}
                  </h3>

                  <form
                    className="mt-4 grid gap-4"
                    onSubmit={handleAddressSubmit}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">
                        Nome de contacto
                        <input
                          type="text"
                          value={addressForm.contactName}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              contactName: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                          placeholder="Nome de contacto"
                          required
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700">
                        Número de telefone
                        <input
                          type="tel"
                          value={addressForm.phone}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              phone: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">
                        Província
                        <input
                          type="text"
                          value={addressForm.province}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              province: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700">
                        Município
                        <input
                          type="text"
                          value={addressForm.municipio}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              municipio: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <label className="text-sm font-medium text-gray-700">
                        Bairro
                        <input
                          type="text"
                          value={addressForm.bairro}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              bairro: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </label>
                      <label className="text-sm font-medium text-gray-700">
                        Rua
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(event) =>
                            setAddressForm((prev) => ({
                              ...prev,
                              street: event.target.value,
                            }))
                          }
                          className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                          required
                        />
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={savingAddress}
                      className="self-start bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold disabled:opacity-60"
                    >
                      {savingAddress
                        ? "A guardar..."
                        : editingAddressId
                        ? "Guardar alterações"
                        : "Adicionar endereço"}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {activeSection === "security" && (
              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Segurança
                    </h2>
                    <p className="text-sm text-gray-500">
                      Define uma palavra-passe forte para proteger a tua conta.
                    </p>
                  </div>
                </div>

                <form className="grid gap-4" onSubmit={handleSecuritySubmit}>
                  <label className="text-sm font-medium text-gray-700">
                    Palavra-passe atual
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(event) =>
                        setSecurityForm((prev) => ({
                          ...prev,
                          currentPassword: event.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                      required
                    />
                  </label>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Nova palavra-passe
                      <input
                        type="password"
                        value={securityForm.newPassword}
                        onChange={(event) =>
                          setSecurityForm((prev) => ({
                            ...prev,
                            newPassword: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                      Confirmar palavra-passe
                      <input
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={(event) =>
                          setSecurityForm((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                        required
                      />
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={savingPassword}
                    className="self-start bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold disabled:opacity-60"
                  >
                    {savingPassword ? "A atualizar..." : "Atualizar palavra-passe"}
                  </Button>
                </form>
              </div>
            )}

            {activeSection === "recent-orders" && (
              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-purple-600" />
                      Meus pedidos
                    </h2>
                    <p className="text-sm text-gray-500">
                      Últimas compras realizadas.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection("old-orders")}
                    className="text-xs"
                  >
                    Ver pedidos antigos
                  </Button>
                </div>
                {renderOrdersList(
                  recentOrders,
                  "Ainda não tens pedidos registados. Que tal aproveitar uma promoção hoje?"
                )}
              </div>
            )}

            {activeSection === "old-orders" && (
              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Archive className="w-5 h-5 text-gray-600" />
                      Pedidos antigos
                    </h2>
                    <p className="text-sm text-gray-500">
                      Histórico completo de compras.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection("recent-orders")}
                    className="text-xs"
                  >
                    Voltar aos pedidos recentes
                  </Button>
                </div>
                {renderOrdersList(
                  oldOrders,
                  "Ainda não há pedidos antigos. Assim que fizeres mais compras eles aparecerão aqui."
                )}
              </div>
            )}

            {activeSection === "wishlist" && (
              <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Lista de desejos
                    </h2>
                    <p className="text-sm text-gray-500">
                      Guarda produtos favoritos para comprar mais tarde.
                    </p>
                  </div>
                </div>
                {renderWishlist()}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;




