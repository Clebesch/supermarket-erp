
import {
  ShoppingCart,
  Package,
  Boxes,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="space-y-6">

      {/* Boas-vindas */}
      <section>
        <h3 className="text-2xl font-bold">
          Bem-vindo ao SuperMarket ERP!
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Acompanhe os principais indicadores do seu negócio.
        </p>
      </section>

      {/* Indicadores */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Vendas do dia
            </span>
            <ShoppingCart className="text-emerald-600" size={23} />
          </div>
          <h3 className="mt-4 text-2xl font-bold">R$ 0,00</h3>
          <p className="mt-2 text-xs text-slate-400">
            Aguardando dados da API
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Produtos cadastrados
            </span>
            <Package className="text-blue-600" size={23} />
          </div>
          <h3 className="mt-4 text-2xl font-bold">0</h3>
          <p className="mt-2 text-xs text-slate-400">
            Total de produtos
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Estoque baixo
            </span>
            <Boxes className="text-amber-500" size={23} />
          </div>
          <h3 className="mt-4 text-2xl font-bold">0</h3>
          <p className="mt-2 text-xs text-slate-400">
            Produtos abaixo do mínimo
          </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Caixa
            </span>
            <CircleDollarSign className="text-purple-600" size={23} />
          </div>
          <h3 className="mt-4 text-2xl font-bold">Fechado</h3>
          <p className="mt-2 text-xs text-slate-400">
            Situação do caixa
          </p>
        </div>
      </section>

      {/* Resumo financeiro e atividades */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        <div className="rounded-xl bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-bold">
            Resumo financeiro
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Indicadores de movimentação
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-lg bg-emerald-50 p-4">
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <ArrowUpRight size={18} />
                Entradas
              </div>
              <p className="mt-3 text-xl font-bold">R$ 0,00</p>
            </div>

            <div className="rounded-lg bg-red-50 p-4">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <ArrowDownRight size={18} />
                Saídas
              </div>
              <p className="mt-3 text-xl font-bold">R$ 0,00</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-sm text-blue-700">
                Resultado
              </div>
              <p className="mt-3 text-xl font-bold">R$ 0,00</p>
            </div>

          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold">
            Atividades recentes
          </h3>

          <div className="mt-5 flex flex-col items-center justify-center py-8 text-center">
            <ClipboardList size={36} className="text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Nenhuma atividade exibida
            </p>

            <p className="mt-1 text-xs text-slate-400">
              As movimentações aparecerão aqui.
            </p>
          </div>
        </div>

      </section>

      <footer className="py-3 text-center text-xs text-slate-400">
        SuperMarket ERP © 2026 — Sistema de Gestão de Supermercado
      </footer>

    </div>
  );
}

export default Dashboard;
