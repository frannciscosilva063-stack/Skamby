"use client";

import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";
import { useSessionStore } from "../../store/session";

type Favorite = {
  id: string;
  product: {
    id: string;
    title: string;
    priceCents: number;
  };
};

export default function FavoritesPage() {
  const { isLoggedIn, accessToken } = useSessionStore();
  const [items, setItems] = useState<Favorite[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !accessToken) return;
    apiGet<Favorite[]>("/favorites", accessToken).then(setItems).catch(() => setItems([]));
  }, [isLoggedIn, accessToken]);

  if (!isLoggedIn) return <p>Faça login para ver favoritos.</p>;

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-deep">Favoritos</h1>
      {!items.length ? <p>Nenhum favorito ainda.</p> : null}
      <ul className="space-y-2">
        {items.map((fav) => (
          <li key={fav.id} className="rounded border bg-white p-3">
            <p className="font-medium">{fav.product.title}</p>
            <p className="text-sm">R$ {(fav.product.priceCents / 100).toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
