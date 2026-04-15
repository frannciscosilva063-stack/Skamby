"use client";

import { useSessionStore } from "../../store/session";

export default function ChatPage() {
  const { isLoggedIn } = useSessionStore();

  if (!isLoggedIn) return <p>Faça login para acessar o chat em tempo real.</p>;

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold text-deep">Chat</h1>
      <p>Gateway Socket.io já está preparado no backend para `chat:join` e `chat:message:send`.</p>
    </section>
  );
}
