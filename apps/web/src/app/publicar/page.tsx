"use client";

import Link from "next/link";
import { useSessionStore } from "../../store/session";

export default function PublicarPage() {
  const { isLoggedIn } = useSessionStore();

  if (!isLoggedIn) {
    return (
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-deep">Publicar</h1>
        <p>Você precisa estar logado para publicar anúncios.</p>
        <Link className="inline-block rounded bg-primary px-4 py-2 text-white" href="/login">
          Fazer login
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-deep">Publicar produto</h1>
      <p>Fluxo de publicação habilitado para usuários logados. Próximo passo: formulário completo.</p>
    </section>
  );
}
