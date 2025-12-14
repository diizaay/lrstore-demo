import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getAdminSupportMessages,
  updateAdminSupportMessage,
} from "@/services/api";

const statusOptions = [
  { value: "pending", label: "Pendente" },
  { value: "in_progress", label: "Em atendimento" },
  { value: "resolved", label: "Resolvido" },
];

const AdminSupport = () => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminSupportMessages({
        page,
        status: filterStatus || undefined,
      });
      setMessages(data.messages || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError("Não foi possível carregar as mensagens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [page, filterStatus]);

  const handleStatusChange = async (messageId, status) => {
    try {
      await updateAdminSupportMessage(messageId, { status });
      loadMessages();
    } catch (err) {
      setError("Falha ao atualizar o estado da mensagem.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Mensagens</h1>
        <p className="text-sm text-slate-500">
          Acompanha os contactos recebidos através do formulário Fala Connosco.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm">
          <label className="text-slate-500">Estado</label>
          <select
            value={filterStatus}
            onChange={(event) => {
              setFilterStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="adminOutline" onClick={loadMessages}>
          Atualizar lista
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Mensagem</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  A carregar mensagens...
                </td>
              </tr>
            )}
            {!loading && messages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Ainda não existem mensagens.
                </td>
              </tr>
            )}
            {!loading &&
              messages.map((message) => (
                <tr key={message.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">
                      {message.name}
                    </p>
                    <p className="text-xs text-slate-500">{message.email}</p>
                    {message.phone && (
                      <p className="text-xs text-slate-400">{message.phone}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {message.subject || "--"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {message.message}
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={message.status}
                      onChange={(event) =>
                        handleStatusChange(message.id, event.target.value)
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-slate-500">
                    {message.created_at
                      ? new Date(message.created_at).toLocaleString("pt-PT")
                      : "--"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
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
  );
};

export default AdminSupport;
