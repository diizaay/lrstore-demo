import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminUsers, updateAdminUser } from "@/services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers({
        page,
        search: search || undefined,
      });
      setUsers(data.users || []);
      setPagination(data.pagination || null);
      setError(null);
    } catch {
      setError("Não foi possível carregar os utilizadores.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadUsers();
  };

  const toggleAdmin = async (user) => {
    try {
      await updateAdminUser(user.id, { is_admin: !user.is_admin });
      loadUsers();
    } catch {
      setError("Falha ao atualizar permissões.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">Utilizadores</h1>
        <p className="text-sm text-slate-500">
          Veja todos os clientes e defina quem pode acessar o painel admin.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <Input
          placeholder="Pesquisar por nome ou email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="submit" variant="adminOutline" className="sm:w-40">
          Pesquisar
        </Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Criado em</th>
              <th className="px-4 py-3">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  A carregar utilizadores...
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Nenhum resultado encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.is_admin
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.is_admin ? "Sim" : "Não"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("pt-PT")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="adminOutline"
                      onClick={() => toggleAdmin(user)}
                    >
                      {user.is_admin ? "Remover acesso" : "Promover"}
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default AdminUsers;
