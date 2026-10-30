
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Boxes,
  ClipboardList,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

const menuItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Vendas", path: "/vendas", icon: ShoppingCart },
  { label: "Produtos", path: "/produtos", icon: Package },
  { label: "Estoque", path: "/estoque", icon: Boxes },
  { label: "Clientes", path: "/clientes", icon: Users },
  { label: "Fornecedores", path: "/fornecedores", icon: Truck },
  { label: "Compras", path: "/compras", icon: ClipboardList },
  { label: "Caixa", path: "/caixa", icon: Wallet },
  { label: "Relatórios", path: "/relatorios", icon: BarChart3 },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col bg-slate-900 text-white md:flex">
          <div className="border-b border-slate-700 p-6">
            <h1 className="text-2xl font-bold">
              <span className="text-emerald-400">Super</span>Market
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Sistema de Gestão
            </p>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Menu principal
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                      isActive
                        ? "bg-emerald-500 text-white"
                        : "text-slate-300 hover:bg-slate-800"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-slate-700 p-4">
            <a
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800"
            >
              <Settings size={19} />
              Configurações
            </a>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <h2 className="text-xl font-bold">SuperMarket ERP</h2>
              <p className="text-sm text-slate-500">
                Sistema de Gestão
              </p>
            </div>

            <button
              type="button"
              aria-label="Notificações"
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <Bell size={21} />
            </button>
          </header>

          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
