import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "../../components/Navbar";
import TombolWhatsApp from "../../components/TombolWhatsApp";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetailLaporan({ params }: Props) {
  const { id } = await params;
  const laporanId = Number(id);

  if (!Number.isInteger(laporanId) || laporanId <= 0) {
    notFound();
  }

  const laporan = await prisma.report.findUnique({
    where: {
      id: laporanId,
    },
    include: {
      category: true,
      user: {
        select: {
          nama: true,
        },
      },
      statusHistory: {
        orderBy: {
          changedAt: "asc",
        },
      },
    },
  });

  if (!laporan) {
    notFound();
  }

  const tanggal = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(laporan.tanggalKejadian);

  const halamanSebelumnya =
    laporan.jenisLaporan === "Temuan"
      ? "/barang-temuan"
      : "/barang-hilang";

  // Siapkan nomor WhatsApp dalam format internasional Indonesia.
  const nomorWhatsApp = (laporan.kontakPelapor || "").replace(/\D/g, "");
  const nomorWhatsAppInternasional = nomorWhatsApp.startsWith("0")
    ? `62${nomorWhatsApp.slice(1)}`
    : nomorWhatsApp.startsWith("8")
      ? `62${nomorWhatsApp}`
      : nomorWhatsApp;

  const linkWhatsApp =
    nomorWhatsAppInternasional.length >= 10 &&
    nomorWhatsAppInternasional.length <= 15
      ? `https://wa.me/${nomorWhatsAppInternasional}?text=${encodeURIComponent(
          `Halo, saya melihat laporan "${laporan.namaBarang}" di FindIt. Saya ingin menanyakan informasi lebih lanjut.`
        )}`
      : null;

  // Riwayat status dimulai dari saat laporan dibuat.
  const riwayatStatus = [
    {
      id: "awal",
      statusBaru:
        laporan.statusHistory.length > 0
          ? laporan.statusHistory[0].statusSebelumnya ||
            "Menunggu Verifikasi"
          : "Menunggu Verifikasi",
      catatan: "Laporan berhasil dikirim ke sistem FindIt.",
      changedAt: laporan.createdAt,
    },
    ...laporan.statusHistory.map((riwayat) => ({
      id: riwayat.id,
      statusBaru: riwayat.statusBaru,
      catatan: riwayat.catatan,
      changedAt: riwayat.changedAt,
    })),
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar active={halamanSebelumnya} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100 px-5 py-10 sm:px-8 md:px-12">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl py-3 text-center">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-xs font-bold text-blue-700 shadow-sm">
            {laporan.jenisLaporan === "Temuan"
              ? "🎁 INFORMASI BARANG TEMUAN"
              : "🔎 INFORMASI BARANG HILANG"}
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl md:text-5xl">
            Detail <span className="text-blue-600">Laporan</span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Informasi lengkap mengenai barang yang dilaporkan
            melalui sistem FindIt.
          </p>
        </div>
      </section>

      {/* DETAIL LAPORAN */}
      <section className="mx-auto max-w-5xl px-5 py-9 sm:px-8 md:px-12 md:py-11">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-blue-100/50">

          {/* FOTO BARANG */}
          <div className="relative flex min-h-64 items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-indigo-100 p-5 sm:min-h-80 md:min-h-96">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-cyan-200/40 blur-2xl" />

            {laporan.foto ? (
              <img
                src={laporan.foto}
                alt={laporan.namaBarang}
                className="relative max-h-96 w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/70 bg-white/70 text-6xl shadow-lg backdrop-blur">
                📦
              </div>
            )}
          </div>

          {/* INFORMASI UTAMA */}
          <div className="p-5 sm:p-7 md:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  laporan.jenisLaporan === "Hilang"
                    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                    : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                }`}
              >
                {laporan.jenisLaporan === "Hilang"
                  ? "● Barang Hilang"
                  : "● Barang Temuan"}
              </span>

              <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
                Status: {laporan.status}
              </span>
            </div>

            <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {laporan.namaBarang}
            </h2>

            <p className="mt-2 text-sm font-semibold text-blue-700">
              ID Laporan: #{laporan.id}
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Informasi barang berdasarkan laporan yang tersedia di FindIt.
            </p>

            {/* INFORMASI BARANG */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                    🏷️
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    Kategori Barang
                  </p>
                </div>
                <p className="mt-3 font-bold text-slate-900">
                  {laporan.category.namaKategori}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-lg">
                    📍
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    Lokasi Kejadian
                  </p>
                </div>
                <p className="mt-3 font-bold text-slate-900">
                  {laporan.lokasi}
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                    📅
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    Tanggal Kejadian
                  </p>
                </div>
                <p className="mt-3 font-bold text-slate-900">
                  {tanggal}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-lg">
                    👤
                  </div>
                  <p className="text-sm font-semibold text-slate-500">
                    Nama Pelapor
                  </p>
                </div>
                <p className="mt-3 font-bold text-slate-900">
                  {laporan.user.nama}
                </p>
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                  📝
                </div>
                <h3 className="font-extrabold text-slate-900">
                  Deskripsi Barang
                </h3>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {laporan.deskripsi || "Belum ada deskripsi tambahan."}
              </p>
            </div>

            {/* RIWAYAT PERUBAHAN STATUS */}
            <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  🔔
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900">
                    Riwayat Perkembangan Laporan
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Pantau setiap perubahan status laporan kamu.
                  </p>
                </div>
              </div>

              <div className="mt-7">
                {riwayatStatus.map((riwayat, index) => {
                  const terakhir =
                    index === riwayatStatus.length - 1;

                  return (
                    <div
                      key={riwayat.id}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {/* GARIS TIMELINE */}
                      {!terakhir && (
                        <div className="absolute left-3.75 top-8 h-full w-0.5 bg-blue-100" />
                      )}

                      {/* TITIK TIMELINE */}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                          terakhir
                            ? "bg-blue-700 text-white ring-4 ring-blue-100"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {terakhir ? "✓" : "●"}
                      </div>

                      {/* INFORMASI STATUS */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {riwayat.statusBaru}
                          </h4>

                          {terakhir && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                              STATUS TERKINI
                            </span>
                          )}
                        </div>

                        {riwayat.catatan && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {riwayat.catatan}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(
                            riwayat.changedAt
                          ).toLocaleString("id-ID", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* KONTAK PELAPOR */}
            {laporan.consentKontak && laporan.kontakPelapor && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                    📞
                  </div>
                  <h3 className="font-extrabold text-blue-900">
                    Kontak Pelapor
                  </h3>
                </div>

                <p className="mt-3 text-sm font-semibold text-blue-800">
                  {laporan.kontakPelapor}
                </p>

                {linkWhatsApp ? (
                  <TombolWhatsApp
                    href={linkWhatsApp}
                    reportId={laporan.id}
                  />
                ) : (
                  <p className="mt-3 text-xs leading-5 text-blue-700">
                    Nomor kontak belum memiliki format yang valid untuk tautan WhatsApp.
                  </p>
                )}
              </div>
            )}

            {/* TOMBOL */}
            <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row">
              <Link
                href={halamanSebelumnya}
                className="inline-flex justify-center rounded-xl border border-blue-200 bg-white px-6 py-3.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
              >
                ← Kembali ke Daftar
              </Link>

              <Link
                href="/lapor"
                className="inline-flex justify-center rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"
              >
                + Buat Laporan
              </Link>
            </div>
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
