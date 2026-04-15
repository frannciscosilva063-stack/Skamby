"use client";

import { useSessionStore } from "../../store/session";

export default function ProfilePage() {
  const { isLoggedIn, userId } = useSessionStore();

  if (!isLoggedIn) return <p>Faça login para ver o perfil.</p>;

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-deep">Perfil</h1>
      <p>ID do usuário: {userId}</p>
      <p>Perfil público e privado separados na API (`/profile/me` e `/users/:id/public`).</p>
    </section>
  );
}
