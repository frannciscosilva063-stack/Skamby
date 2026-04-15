"use client";

import Link from "next/link";
import { useSessionStore } from "../store/session";

export function NavTabs() {
  const { isLoggedIn } = useSessionStore();

  const visitorTabs = [
    { href: "/products", label: "Produtos" },
    { href: "/pesquisar", label: "Pesquisar" },
    { href: "/publicar", label: "Publicar" }
  ];

  const userTabs = [
    { href: "/products", label: "Produtos" },
    { href: "/publicar", label: "Publicar" },
    { href: "/favoritos", label: "Favoritos" },
    { href: "/chat", label: "Chat" },
    { href: "/perfil", label: "Perfil" }
  ];

  return (
    <nav className="border-b bg-white">
      <ul className="mx-auto flex max-w-6xl gap-3 px-4 py-3 text-sm">
        {(isLoggedIn ? userTabs : visitorTabs).map((tab) => (
          <li key={tab.href}>
            <Link className="rounded px-3 py-2 hover:bg-base" href={tab.href}>
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
