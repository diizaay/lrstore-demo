import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAdminOrder,
  getAdminOrders,
  updateAdminOrderStatus,
} from "@/services/api";

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    payment_status: "",
    date_from: "",
    date_to: "",
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminOrders({
        page,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value)
        ),
      });
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
      setError(null);
    } catch {
      setError("Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    loadOrders();
  };

  const openOrderDetails = async (orderNumber) => {
    try {
      const data = await getAdminOrder(orderNumber);
      setSelectedOrder(data.order);
    } catch {
      setError("Não foi possível carregar os detalhes do pedido.");
    }
  };

  const handleUpdateOrder = async (updates) => {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const data = await updateAdminOrderStatus(
        selectedOrder.order_number,
        updates
      );
      setSelectedOrder(data.order);
      loadOrders();
    } catch {
      setError("Erro ao atualizar o pedido.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
        <p className="text-sm text-slate-500">
          Acompanhe o ciclo completo e mantenha clientes informados.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={applyFilters}
        className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Pagamento</label>
          <select
            name="payment_status"
            value={filters.payment_status}
            onChange={handleFilterChange}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Data inicial</label>
          <Input
            type="date"
            name="date_from"
            value={filters.date_from}
            onChange={handleFilterChange}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-500">Data final</label>
          <Input
            type="date"
            name="date_to"
            value={filters.date_to}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex flex-col justify-end gap-2">
        <Button type="submit" variant="admin" className="w-full">
          Filtrar
        </Button>
          <Button
            type="button"
            variant="adminOutline"
            onClick={() => {
              setFilters({
                status: "",
                payment_status: "",
                date_from: "",
                date_to: "",
              });
              setPage(1);
              loadOrders();
            }}
          >
            Limpar
          </Button>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      A carregar pedidos...
                    </td>
                  </tr>
                )}
                {!loading && orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      Não existem pedidos com estes filtros.
                    </td>
                  </tr>
                )}
                {!loading &&
                  orders.map((order) => (
                    <tr
                      key={order.order_number}
                      className="cursor-pointer transition hover:bg-slate-50"
                      onClick={() => openOrderDetails(order.order_number)}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        #{order.order_number}
                      </td>
                      <td className="px-4 py-3">{order.customer?.name}</td>
                      <td className="px-4 py-3">
                        {Number(order.total || 0).toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "AOA",
                        })}
                      </td>
                      <td className="px-4 py-3 capitalize">{order.status}</td>
                      <td className="px-4 py-3 capitalize">
                        {order.payment_status}
                      </td>
                      <td className="px-4 py-3">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString("pt-PT")
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {pagination && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
              <p>
                Página {pagination.page} de {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="adminOutline"
                  size="sm"
                  disabled={!pagination.has_prev}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Anterior
                </Button>
                <Button
                  variant="adminOutline"
                  size="sm"
                  disabled={!pagination.has_next}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {!selectedOrder ? (
            <div className="text-sm text-slate-500">
              Selecione um pedido para ver os detalhes completos.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase text-slate-400">Pedido</p>
                <p className="text-lg font-semibold text-slate-900">
                  #{selectedOrder.order_number}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedOrder.created_at
                    ? new Date(selectedOrder.created_at).toLocaleString(
                        "pt-PT"
                      )
                    : ""}
                </p>
              </div>
              <div className="grid gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-slate-400">
                    Cliente
                  </p>
                  <p className="font-medium text-slate-900">
                    {selectedOrder.customer?.name}
                  </p>
                  <p className="text-slate-500">
                    {selectedOrder.customer?.email}
                  </p>
                  <p className="text-slate-500">
                    {selectedOrder.customer?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400">Endereço</p>
                  <p className="text-slate-600">
                    {selectedOrder.customer?.address}
                  </p>
                  <p className="text-slate-600">
                    {selectedOrder.customer?.city}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400 mb-1">
                  Itens
                </p>
                <div className="space-y-3 text-sm">
                  {(selectedOrder.items || []).map((item) => (
                    <div
                      key={`${item.product_id}-${item.selected_color || ""}`}
                      className="rounded-lg border border-slate-100 p-3"
                    >
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-slate-500">
                        Qtde: {item.quantity} · Cor:{" "}
                        {item.selected_color || "-"}
                      </p>
                      <p className="text-slate-700">
                        {Number(item.price || 0).toLocaleString("pt-PT", {
                          style: "currency",
                          currency: "AOA",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-400">
                  Estado do pedido
                </label>
                <select
                  value={selectedOrder.status || ""}
                  onChange={(e) =>
                    handleUpdateOrder({ status: e.target.value })
                  }
                  disabled={updating}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-400">
                  Pagamento
                </label>
                <select
                  value={selectedOrder.payment_status || ""}
                  onChange={(e) =>
                    handleUpdateOrder({ payment_status: e.target.value })
                  }
                  disabled={updating}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-lg bg-indigo-50 p-4 text-sm text-indigo-700">
                Total:{" "}
                <span className="font-semibold">
                  {Number(selectedOrder.total || 0).toLocaleString("pt-PT", {
                    style: "currency",
                    currency: "AOA",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
