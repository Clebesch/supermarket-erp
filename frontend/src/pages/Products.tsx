
import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";

import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.barcode}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  function formatPrice(price: string) {
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie os produtos cadastrados no supermercado.
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold">
            Lista de produtos ({filteredProducts.length})
          </h2>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar produto ou código..."
              className="w-64 max-w-full text-sm outline-none"
            />
          </div>
        </div>

        {loading && (
          <p className="py-8 text-center text-slate-500">
            Carregando produtos...
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3">Produto</th>
                  <th className="p-3">Código de barras</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3">Estoque</th>
                  <th className="p-3">Situação</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-3 font-medium">
                      {product.name}
                    </td>

                    <td className="p-3 text-slate-500">
                      {product.barcode}
                    </td>

                    <td className="p-3">
                      {product.category.name}
                    </td>

                    <td className="p-3 font-medium">
                      {formatPrice(product.salePrice)}
                    </td>

                    <td className="p-3">
                      <span
                        className={
                          product.stock <= product.minStock
                            ? "font-semibold text-red-600"
                            : "text-slate-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="py-10 text-center text-slate-500">
                <Package className="mx-auto mb-2" size={30} />
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
