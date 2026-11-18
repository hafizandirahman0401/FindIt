import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    q?: string;
    jenis?: string;
  }>;
};

export default async function CariPage({ searchParams }: Props) {
  const params = await searchParams;

  const q = (params.q || "").trim();
  const jenis = params.jenis || "semua";

  const laporan = await prisma.report.findMany({
    where: {
      ...(jenis === "hilang"
        ? { jenisLaporan: "Hilang" }
        : jenis === "temuan"
        ? { jenisLaporan: "Temuan" }
        : {}),

      ...(q
        ? {
            OR: [
              {
                namaBarang: {
                  contains: q,
                },
              },
              {
                lokasi: {
                  contains: q,
                },
              },
              {
                category: {
                  namaKategori: {
                    contains: q,
                  },
                },
              },
            ],
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <nav className="flex items-center justify-between border-b bg-white px-6 py-5 md:px-12">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          FindIt
        </Link>

        <Link
          href="/"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          ← Kembali
        </Link>
      </nav>

      <section className="bg-linear-to-br from-blue-800 via-blue-700 to-indigo-800 px-6 py-12 text-white md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-blue-200">
            HASIL PENCARIAN FINDIT
          </p>

          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
            {q ? `Hasil untuk "${q}"` : "Semua Barang"}
          </h1>

          <p className="mt-3 text-blue-100">
            Temukan informasi barang hilang dan barang temuan di kampus.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-12">
        <form
          action="/cari"
          method="GET"
          className="mb-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cari nama barang, lokasi, atau kategori..."
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            name="jenis"
            defaultValue={jenis}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="semua">Semua Barang</option>
            <option value="hilang">Barang Hilang</option>
            <option value="temuan">Barang Temuan</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Cari
          </button>
        </form>

        <p className="mb-6 text-sm text-slate-500">
          Ditemukan <strong>{laporan.length}</strong> hasil
        </p>

        {laporan.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-4xl">🔎</p>

            <h2 className="mt-4 text-xl font-bold">
              Barang tidak ditemukan
            </h2>

            <p className="mt-2 text-slate-500">
              Coba kata kunci lain atau pilih jenis barang yang berbeda.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {laporan.map((barang) => (
              <Link
                key={barang.id}
                href={`/laporan/${barang.id}`}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {barang.foto ? (
                  <img
                    src={barang.foto}
                    alt={barang.namaBarang}
                    className="h-44 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center rounded-xl bg-blue-50 text-5xl">
                    📦
                  </div>
                )}

                <span
                  className={`mt-5 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    barang.jenisLaporan === "Temuan"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  Barang {barang.jenisLaporan}
                </span>

                <h2 className="mt-3 text-xl font-bold group-hover:text-blue-700">
                  {barang.namaBarang}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  📍 {barang.lokasi}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  🏷️ {barang.category.namaKategori}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  📅{" "}
                  {new Date(barang.tanggalKejadian).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <p className="mt-3 text-sm font-semibold text-blue-700">
                  Lihat Detail →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}