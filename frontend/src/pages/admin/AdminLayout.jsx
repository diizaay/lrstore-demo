import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/lr.png";

const navItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Produtos", to: "/admin/products" },
  { label: "Categorias", to: "/admin/categories" },
  { label: "Pedidos", to: "/admin/orders" },
  { label: "Usuários", to: "/admin/users" },
  { label: "Suporte", to: "/admin/support" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const renderNavLink = (item, mode = "sidebar") => (
    <NavLink
      key={item.to}
      to={item.to}
      end={item.to === "/admin"}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) => {
        const base =
          mode === "sidebar"
            ? "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            : "px-3 py-2 rounded-lg text-sm font-medium transition-colors";
        const activeClasses =
          mode === "sidebar"
            ? "bg-white/10 text-white shadow-sm"
            : "bg-indigo-50 text-indigo-600";
        const inactiveClasses =
          mode === "sidebar"
            ? "text-slate-300 hover:bg-white/5 hover:text-white"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100";
        return [base, isActive ? activeClasses : inactiveClasses].join(" ");
      }}
    >
      {item.label}
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          <img
            src={logo}
            alt="LR Store"
            className="h-8 w-8 object-contain drop-shadow"
          />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-white">
            LR Store Admin
          </p>
          <p className="text-xs text-slate-300">
            Controlo total num painel elegante
          </p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => renderNavLink(item, "sidebar"))}
      </nav>
      <div className="mt-auto text-xs text-slate-400">
        © {currentYear} LR Store. Todos os direitos reservados.
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="relative hidden lg:block lg:w-72">
        <div className="fixed inset-y-0 hidden w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 px-6 py-8 lg:flex">
          <SidebarContent />
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute inset-y-0 left-0 w-72 bg-slate-950 px-6 py-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-6 text-slate-400 transition hover:text-white"
              aria-label="Fechar menu"
            >
              ✕
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
              >
                ☰
              </button>
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  Painel administrativo
                </p>
                <p className="text-xs text-slate-500">
                  Bem-vindo de volta, {user?.name || "admin"}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex gap-2 text-sm text-slate-500">
                {navItems.map((item) => renderNavLink(item, "header"))}
              </div>
              <div className="rounded-2xl border border-slate-200 px-4 py-2 text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Administrador"}
                </p>
                <p className="text-xs text-slate-500">
                  {user?.email || "admin@lrstore.com"}
                </p>
              </div>
              <Button variant="adminOutline" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
