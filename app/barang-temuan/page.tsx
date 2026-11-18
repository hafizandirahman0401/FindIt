import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "../components/Navbar";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BarangTemuan({ searchParams }: Props) {
  const params = await searchParams;
  const pencarian = (params.q || "").trim();

  const laporan = await prisma.report.findMany({
    where: {
      jenisLaporan: "Temuan",
      ...(pencarian
        ? {
            OR: [
              { namaBarang: { contains: pencarian } },
              { lokasi: { contains: pencarian } },
              {
                category: {
                  namaKategori: { contains: pencarian },
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
    <main className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <Navbar active="/barang-temuan" />

      {/* HERO ABSTRAK MODERN */}
      <section className="relative isolate overflow-hidden bg-linear-to-br from-blue-50 via-white to-indigo-50">
        {/* Dekorasi abstrak */}
        <div className="pointer-events-none absolute -left-32 -top-28 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-10 md:py-20 lg:px-12">
          {/* BAGIAN TEKS */}
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold tracking-wider text-blue-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              INFORMASI BARANG TEMUAN
            </div>

            <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Barang Temuan?
              <span className="mt-2 block bg-linear-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Mari Kembalikan ke Pemiliknya.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              Cari informasi barang yang ditemukan di lingkungan kampus.
              Informasi yang tepat dapat membantu barang kembali kepada
              pemiliknya.
            </p>

            {/* KOLOM PENCARIAN */}
            <form
              action="/barang-temuan"
              method="GET"
              className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-100/90 p-3 shadow-xl shadow-blue-200/50 sm:flex-row"
            >
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-blue-100 bg-white/90 px-3 shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-blue-600"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                  type="text"
                  name="q"
                  defaultValue={pencarian}
                  placeholder="Cari nama barang, kategori, atau lokasi..."
                  className="w-full bg-transparent py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-linear-to-r from-blue-700 to-indigo-700 px-7 py-3 font-bold text-white shadow-lg shadow-blue-300/60 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-indigo-800"
              >
                Cari Barang
              </button>
            </form>

            {/* INFORMASI */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">
                  ✓
                </span>
                Pencarian praktis
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">
                  ✓
                </span>
                Informasi barang
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">
                  ✓
                </span>
                Untuk komunitas kampus
              </span>
            </div>
          </div>

          {/* ILUSTRASI ABSTRAK MODERN */}
          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-8">
            {/* Lingkaran luar */}
            <div className="absolute h-80 w-80 rounded-full border border-blue-200/70 md:h-105 md:w-105" />
            <div className="absolute h-64 w-64 rounded-full border border-indigo-200/70 md:h-85 md:w-85" />

            {/* Lingkaran cahaya */}
            <div className="absolute h-64 w-64 rounded-full bg-linear-to-br from-blue-200/70 to-indigo-200/50 blur-2xl md:h-80 md:w-80" />

            {/* Kartu utama */}
            <div className="relative z-10 flex h-72 w-72 items-center justify-center rounded-[3rem] border border-white/80 bg-white/50 shadow-2xl shadow-blue-200/60 backdrop-blur-2xl md:h-85 md:w-85">
              <div className="absolute inset-5 rounded-[2.5rem] border border-white/80 bg-linear-to-br from-white/80 to-blue-50/70" />

              {/* Ikon barang ditemukan */}
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-12 border-blue-200/70 bg-linear-to-br from-blue-500 to-indigo-700 shadow-2xl shadow-blue-300/60 md:h-52 md:w-52">
                <div className="absolute inset-3 rounded-full border border-white/30" />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100"
                  height="100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10 drop-shadow-lg md:h-28 md:w-28"
                >
                  <path d="M5 8.5 12 4l7 4.5v10a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5z" />
                  <path d="M5 8.5 12 13l7-4.5" />
                  <path d="M12 13v7" />
                  <path d="m9 15 2 2 4-4" />
                </svg>
              </div>

              {/* Kilau */}
              <div className="absolute right-12 top-12 h-5 w-5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-200" />
              <div className="absolute bottom-14 left-12 h-3 w-3 rounded-full bg-indigo-400" />
            </div>

            {/* Kartu melayang */}
            <div className="absolute -left-1 top-10 z-20 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-xl shadow-blue-100/70 backdrop-blur-xl md:-left-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  🔍
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Barang Temuan
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Informasi tersedia
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-1 bottom-12 z-20 rounded-2xl border border-white/80 bg-white/85 p-4 shadow-xl shadow-indigo-100/70 backdrop-blur-xl md:-right-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                  📍
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Area Kampus
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Lokasi ditemukan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAFTAR BARANG TEMUAN */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:px-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-bold tracking-wider text-blue-700">
              DAFTAR TEMUAN
            </span>

            <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
              Barang Temuan Terbaru
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Informasi barang yang ditemukan di lingkungan kampus.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {laporan.length} laporan ditemukan
          </div>
        </div>

        {laporan.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center">
            <div className="text-5xl">🔎</div>

            <h3 className="mt-5 text-xl font-bold text-slate-800">
              Belum Ada Barang Temuan
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
              {pencarian
                ? `Tidak ada laporan barang temuan yang cocok dengan pencarian "${pencarian}".`
                : "Saat ini belum ada laporan barang temuan. Silakan cek kembali nanti."}
            </p>

            {pencarian && (
              <Link
                href="/barang-temuan"
                className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Lihat Semua Laporan
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laporan.map((item) => (
              <Link
                key={item.id}
                href={`/laporan/${item.id}`}
                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100"
              >
                <div className="relative h-52 overflow-hidden bg-slate-100">
                  {item.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.foto}
                      alt={item.namaBarang}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 text-5xl">
                      📦
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Barang Temuan
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs font-semibold text-blue-700">
                    {item.category.namaKategori}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-slate-800 transition group-hover:text-blue-700">
                    {item.namaBarang}
                  </h3>

                  <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <span>📍</span>
                    <span className="line-clamp-1">{item.lokasi}</span>
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>

                    <span className="text-sm font-bold text-blue-700">
                      Lihat Detail →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="px-5 pb-10 md:px-10 lg:px-12">
        <div className="relative mx-auto flex min-h-69 max-w-7xl items-center overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 px-7 py-10 shadow-xl shadow-blue-200 md:px-10 md:py-12">
          {/* Ornamen lingkaran kanan */}
          <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-widest text-blue-200">
                BARANG TEMUAN
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">
                Menemukan Barang Milik Orang Lain?
              </h2>

              <p className="mt-3 text-sm leading-7 text-blue-100 md:text-base">
                Bantu pemiliknya menemukan kembali barang tersebut dengan membuat
                laporan barang temuan.
              </p>
            </div>

            <Link
              href="/lapor"
              className="shrink-0 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
            >
              + Buat Laporan
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative overflow-hidden bg-linear-to-br from-blue-800 via-blue-900 to-indigo-950 px-5 py-12 text-white sm:px-8 md:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="text-center sm:text-left">
              <Link
                href="/"
                className="text-3xl font-extrabold tracking-tight text-white"
              >
                FindIt<span className="text-cyan-300">.</span>
              </Link>

              <p className="mt-3 max-w-sm text-sm leading-7 text-blue-100">
                Membantu menemukan barang di lingkungan kampus. Bersama kita
                membangun lingkungan kampus yang peduli.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-blue-100">
              <Link href="/" className="transition hover:text-cyan-300">
                Beranda
              </Link>
              <Link
                href="/barang-hilang"
                className="transition hover:text-cyan-300"
              >
                Barang Hilang
              </Link>
              <Link
                href="/barang-temuan"
                className="transition hover:text-cyan-300"
              >
                Barang Temuan
              </Link>
              <Link
                href="/tentang-kami"
                className="transition hover:text-cyan-300"
              >
                Tentang Kami
              </Link>
              <Link href="/lapor" className="transition hover:text-cyan-300">
                Buat Laporan
              </Link>
            </div>
          </div>

          <div className="mt-9 border-t border-white/15 pt-6 text-center text-xs leading-6 text-blue-200 sm:text-sm">
            © 2026 FindIt — Sistem Informasi Barang Hilang dan Temuan Kampus
          </div>
        </div>
      </footer>
    </main>
  );
}