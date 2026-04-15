import "./globals.css";
import type { ReactNode } from "react";
import { NavTabs } from "../components/nav-tabs";

export const metadata = {
  title: "Skamby",
  description: "Marketplace de economia circular"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <header className="bg-primary text-white p-4 font-semibold">Skamby</header>
          <NavTabs />
          <main className="mx-auto max-w-6xl p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
