
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Navbar from "../components/Navbar";
import MarkAllNotificationsRead from "../components/MarkAllNotificationsRead";

export default async function RiwayatPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const laporan = await prisma.report.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      category: true,
      statusHistory: {
        orderBy: {
          changedAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Menghitung semua notifikasi yang belum dibaca
  const jumlahBelumDibaca = laporan.reduce(
    (total, barang) =>
      total +
      barang.statusHistory.filter(
        (notifikasi) => !notifikasi.isRead
      ).length,
    0
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100 px-5 py-12 sm:px-8 md:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl py-5">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-bold tracking-wider text-blue-700">
            AKUN PENGGUNA
          </span>

          <h1 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl md:text-5xl">
            Riwayat Laporan Saya
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Pantau semua laporan barang hilang dan barang temuan
            yang pernah kamu buat melalui FindIt.
          </p>
        </div>
      </section>

      {/* DAFTAR LAPORAN */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:px-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-sm font-semibold text-blue-600">
              AKTIVITAS KAMU
            </span>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
              Daftar Laporan
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Kamu memiliki{" "}
              <span className="font-bold text-blue-700">
                {laporan.length} laporan
              </span>
            </p>

            {/* TOMBOL TANDAI SEMUA DIBACA */}
            <div className="mt-4">
              <MarkAllNotificationsRead
                jumlah={jumlahBelumDibaca}
              />
            </div>
          </div>

          <Link
            href="/lapor"
            className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800"
          >
            + Buat Laporan
          </Link>
        </div>

        {laporan.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
              📋
            </div>

            <h2 className="mt-6 text-xl font-extrabold text-slate-900">
              Belum Ada Laporan
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              Kamu belum pernah membuat laporan barang hilang atau
              barang temuan. Yuk, buat laporan pertamamu!
            </p>

            <Link
              href="/lapor"
              className="mt-7 inline-flex rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Buat Laporan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {laporan.map((barang) => {
              const notifikasiBelumDibaca =
                barang.statusHistory.filter(
                  (notifikasi) => !notifikasi.isRead
                );

              const riwayatStatus = [
                ...barang.statusHistory,
              ].reverse();

              return (
                <article
                  key={barang.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* FOTO BARANG */}
                  <div className="relative h-48 overflow-hidden bg-blue-50">
                    {barang.foto ? (
                      <img
                        src={barang.foto}
                        alt={barang.namaBarang}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-6xl">
                        📦
                      </div>
                    )}

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold ${
                        barang.jenisLaporan === "Temuan"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {barang.jenisLaporan}
                    </span>
                  </div>

                  {/* INFORMASI BARANG */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {barang.category.namaKategori}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                          barang.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700"
                            : barang.status === "Tersedia"
                            ? "bg-green-50 text-green-700"
                            : barang.status === "Dalam Proses Pengambilan"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {barang.status}
                      </span>
                    </div>

                    <h3 className="mt-4 line-clamp-1 text-lg font-extrabold text-slate-900">
                      {barang.namaBarang}
                    </h3>

                    {/* RIWAYAT PERUBAHAN STATUS */}
                    {barang.statusHistory.length > 0 && (
                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🔔</span>

                            <p className="text-sm font-bold text-blue-800">
                              Riwayat Perubahan Status
                            </p>
                          </div>

                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                            {barang.statusHistory.length} pembaruan
                          </span>
                        </div>

                        <div className="mt-4 space-y-4">
                          {riwayatStatus.map((notifikasi) => (
                            <div
                              key={notifikasi.id}
                              className="relative border-l-2 border-blue-300 pl-4"
                            >
                              <div className="absolute -left-1.25 top-1 h-2 w-2 rounded-full bg-blue-600" />

                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-bold text-slate-800">
                                  {notifikasi.statusBaru}
                                </p>

                                {!notifikasi.isRead && (
                                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                                    Belum Dibaca
                                  </span>
                                )}

                                {notifikasi.isRead && (
                                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                    Sudah Dibaca
                                  </span>
                                )}
                              </div>

                              {notifikasi.statusSebelumnya && (
                                <p className="mt-1 text-xs text-slate-600">
                                  Dari: {notifikasi.statusSebelumnya}
                                </p>
                              )}

                              {notifikasi.catatan && (
                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                  Catatan: {notifikasi.catatan}
                                </p>
                              )}

                              <p className="mt-1 text-xs text-slate-400">
                                {new Date(
                                  notifikasi.changedAt
                                ).toLocaleString("id-ID", {
                                  dateStyle: "long",
                                  timeStyle: "short",
                                })}
                              </p>
                            </div>
                          ))}
                        </div>

                        {notifikasiBelumDibaca.length > 0 && (
                          <p className="mt-4 border-t border-blue-200 pt-3 text-xs font-semibold text-blue-700">
                            Ada {notifikasiBelumDibaca.length} notifikasi
                            belum dibaca pada laporan ini.
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 space-y-3 text-sm text-slate-500">
                      <p className="flex items-start gap-2">
                        <span>📍</span>
                        <span>{barang.lokasi}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <span>📅</span>
                        <span>
                          {new Date(
                            barang.tanggalKejadian
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>

                    <div className="mt-auto pt-6">
                      <Link
                        href={`/laporan/${barang.id}`}
                        className="block rounded-xl border border-blue-200 py-3 text-center text-sm font-bold text-blue-700 transition hover:border-blue-700 hover:bg-blue-50"
                      >
                        Lihat Detail →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-blue-100 sm:justify-start">
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

              <Link
                href="/lapor"
                className="transition hover:text-cyan-300"
              >
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
