import React, { useEffect, useMemo, useState } from "react";
import { getAdminDashboardSummary } from "@/services/api";

const currencyFormatter = new Intl.NumberFormat("pt-AO", {
  style: "currency",
  currency: "AOA",
  maximumFractionDigits: 2,
});

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getAdminDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError("Não foi possível carregar o resumo.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const maxOrders = useMemo(() => {
    if (!summary?.last_7_days_orders?.length) return 1;
    return Math.max(
      ...summary.last_7_days_orders.map((item) => item.count || 0),
      1
    );
  }, [summary]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">Carregando dados...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 border border-red-200 p-6 text-red-600">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const stats = [
    { label: "Utilizadores", value: summary.total_users },
    { label: "Pedidos", value: summary.total_orders },
    { label: "Produtos", value: summary.total_products },
    { label: "Receita", value: currencyFormatter.format(summary.total_revenue) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Visão geral das métricas chave dos últimos dias.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Últimos 7 dias</p>
              <h2 className="text-lg font-semibold text-slate-900">
                Pedidos por dia
              </h2>
            </div>
          </div>
          <div className="mt-6 flex items-end gap-4">
            {summary.last_7_days_orders?.map((day) => {
              const height = ((day.count || 0) / maxOrders) * 140;
              const label = new Date(day.date).toLocaleDateString("pt-PT", {
                weekday: "short",
              });
              return (
                <div key={day.date} className="flex flex-col items-center">
                  <div
                    className="w-8 rounded-t-md bg-indigo-500 transition-all"
                    style={{ height: `${height || 8}px` }}
                  />
                  <span className="mt-2 text-xs font-medium text-slate-500">
                    {label}
                  </span>
                  <span className="text-xs text-slate-400">{day.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Top produtos</p>
              <h2 className="text-lg font-semibold text-slate-900">
                Mais vendidos
              </h2>
            </div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-slate-500">
                  <th className="pb-2">Produto</th>
                  <th className="pb-2">Qtde</th>
                  <th className="pb-2">Receita</th>
                </tr>
              </thead>
              <tbody>
                {(summary.top_products || []).map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-t border-slate-100"
                  >
                    <td className="py-3">{product.name}</td>
                    <td className="py-3">{product.count}</td>
                    <td className="py-3">
                      {currencyFormatter.format(product.revenue || 0)}
                    </td>
                  </tr>
                ))}
                {!summary.top_products?.length && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      Ainda não existem pedidos suficientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
