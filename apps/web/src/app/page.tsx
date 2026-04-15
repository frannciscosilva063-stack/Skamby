import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-deep">Marketplace Sustentável Local</h1>
      <p>Venda, troque, doe e compre produtos sustentáveis no seu município.</p>
      <Link href="/products" className="inline-block rounded bg-primary px-4 py-2 text-white">
        Ver produtos
      </Link>
    </section>
  );
}
