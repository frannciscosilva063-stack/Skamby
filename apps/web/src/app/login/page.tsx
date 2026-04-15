"use client";

import { FormEvent, useState } from "react";
import { apiPost } from "../../lib/api";
import { useSessionStore } from "../../store/session";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useSessionStore();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const data = await apiPost<{ userId: string; accessToken: string; refreshToken: string }>("/auth/login", {
        email,
        password
      });
      setSession(data);
    } catch {
      setError("Não foi possível entrar com essas credenciais.");
    }
  }

  return (
    <section className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold text-deep">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3 rounded border bg-white p-4">
        <label className="block">
          <span className="mb-1 block text-sm">Email</span>
          <input
            className="w-full rounded border p-2"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">Senha</span>
          <input
            className="w-full rounded border p-2"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <button className="rounded bg-primary px-4 py-2 text-white" type="submit">
          Entrar
        </button>
      </form>
    </section>
  );
}
