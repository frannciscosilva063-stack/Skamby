"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { apiGet } from "../../lib/api";

type Product = {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  state: string;
  city: string;
  images: Array<{ id: string; url: string }>;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (stateFilter) params.set("state", stateFilter);

    setLoading(true);
    apiGet<{ items: Product[] }>(`/products?${params.toString()}`)
      .then((res) => setProducts(res.items))
      .finally(() => setLoading(false));
  }, [category, stateFilter]);

  const content = useMemo(() => {
    if (loading) return <p>Carregando produtos...</p>;
    if (!products.length) return <p>Nenhum produto encontrado.</p>;

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((item) => (
          <article key={item.id} className="rounded border bg-white p-3 shadow-sm">
            <div className="relative mb-2 h-44 w-full overflow-hidden rounded bg-base">
              {item.images[0]?.url ? (
                <Image
                  src={item.images[0].url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm text-gray-500">Sem imagem</div>
              )}
            </div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.city} - {item.state}</p>
            <p className="text-sm text-gray-600">{item.category}</p>
            <p className="mt-2 font-bold text-primary">R$ {(item.priceCents / 100).toFixed(2)}</p>
          </article>
        ))}
      </div>
    );
  }, [loading, products]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-deep">Produtos</h1>
      <div className="grid gap-2 md:grid-cols-2">
        <input
          className="rounded border p-2"
          placeholder="Categoria"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filtrar por categoria"
        />
        <input
          className="rounded border p-2"
          placeholder="UF (ex: SP)"
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value.toUpperCase())}
          maxLength={2}
          aria-label="Filtrar por UF"
        />
      </div>
      {content}
    </section>
  );
}
