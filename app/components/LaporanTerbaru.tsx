
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LaporanTerbaru() {
  const laporan = await prisma.report.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
    include: {
      category: true,
    },
  });

  return (
    <section className="bg-slate-50 px-5 py-14 sm:px-8 md:px-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* JUDUL SECTION */}
        <div className="mb-9">
          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold tracking-widest text-blue-700">
            INFORMASI TERBARU
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Laporan Terbaru
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Informasi barang hilang dan temuan yang baru dilaporkan.
          </p>
        </div>

        {/* JIKA BELUM ADA LAPORAN */}
        {laporan.length === 0 ? (
          <div className="rounded-3xl border border-blue-100 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
              📦
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-slate-900">
              Belum Ada Laporan
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Laporan barang akan muncul di sini.
            </p>
          </div>
        ) : (
          /* DAFTAR KARTU LAPORAN */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laporan.map((item) => {
              const tanggal = new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(item.tanggalKejadian);

              const barangHilang = item.jenisLaporan === "Hilang";

              return (
                <Link
                  key={item.id}
                  href={`/laporan/${item.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/70"
                >
                  {/* FOTO BARANG */}
                  <div className="relative h-44 shrink-0 overflow-hidden bg-linear-to-br from-blue-50 via-sky-50 to-indigo-100">
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={item.namaBarang}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        📦
                      </div>
                    )}

                    {/* LABEL JENIS BARANG */}
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-xs font-extrabold shadow-sm backdrop-blur ${
                        barangHilang
                          ? "bg-rose-50/95 text-rose-700"
                          : "bg-emerald-50/95 text-emerald-700"
                      }`}
                    >
                      {barangHilang ? "● Barang Hilang" : "● Barang Temuan"}
                    </span>
                  </div>

                  {/* INFORMASI BARANG */}
                  <div className="flex flex-1 flex-col p-5">
                    <div>
                      <h3 className="line-clamp-1 text-lg font-extrabold text-slate-900 transition group-hover:text-blue-700">
                        {item.namaBarang}
                      </h3>

                      <span className="mt-2 inline-flex rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.category.namaKategori}
                      </span>
                    </div>

                    {/* LOKASI DAN TANGGAL */}
                    <div className="mt-4 space-y-2.5">
                      <div className="flex items-start gap-2.5 text-sm text-slate-600">
                        <span className="shrink-0">📍</span>
                        <span className="line-clamp-1">
                          {item.lokasi}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <span>📅</span>
                        <span>{tanggal}</span>
                      </div>
                    </div>

                    {/* DESKRIPSI */}
                    <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                      {item.deskripsi || "Belum ada deskripsi tambahan."}
                    </p>

                    {/* TOMBOL DETAIL */}
                    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm font-extrabold text-blue-700">
                        Lihat Detail
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition duration-300 group-hover:translate-x-1 group-hover:bg-blue-700 group-hover:text-white">
                        →
                      </span>
                    </div>

                    {/* STATUS */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        Status:
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {item.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* TOMBOL BARANG HILANG DAN TEMUAN */}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/barang-hilang"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-md"
          >
            Lihat Selengkapnya Barang Hilang <span>→</span>
          </Link>

          <Link
            href="/barang-temuan"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
          >
            Lihat Selengkapnya Barang Temuan <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
