
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

type Barang = {
  id?: number;
  nama: string;
  lokasi: string;
  tanggal: string;
  kategori: string;
  simbol?: string;
  jenis?: string;
  deskripsi?: string;
  foto?: string;
};

const barangContoh: Barang[] = [
  {
    nama: "Dompet Hitam",
    lokasi: "Perpustakaan Kampus",
    tanggal: "10 Oktober 2026",
    kategori: "Aksesori",
    simbol: "👛",
    jenis: "Hilang",
    deskripsi:
      "Dompet berwarna hitam yang dilaporkan hilang di area perpustakaan kampus.",
  },
  {
    nama: "Botol Minum",
    lokasi: "Ruang Kelas",
    tanggal: "11 Oktober 2026",
    kategori: "Perlengkapan",
    simbol: "🧴",
    jenis: "Hilang",
    deskripsi: "Botol minum yang diduga tertinggal di ruang kelas.",
  },
  {
    nama: "Buku Catatan",
    lokasi: "Kantin Kampus",
    tanggal: "12 Oktober 2026",
    kategori: "Alat Tulis",
    simbol: "📒",
    jenis: "Hilang",
    deskripsi:
      "Buku catatan yang dilaporkan hilang di sekitar kantin kampus.",
  },
  {
    nama: "Flashdisk 32GB",
    lokasi: "Laboratorium Komputer",
    tanggal: "10 Oktober 2026",
    kategori: "Elektronik",
    simbol: "💾",
    jenis: "Temuan",
    deskripsi:
      "Flashdisk berkapasitas 32GB yang ditemukan di laboratorium komputer.",
  },
  {
    nama: "Payung Biru",
    lokasi: "Parkiran Kampus",
    tanggal: "11 Oktober 2026",
    kategori: "Aksesori",
    simbol: "☂️",
    jenis: "Temuan",
    deskripsi:
      "Payung berwarna biru yang ditemukan di area parkiran kampus.",
  },
  {
    nama: "Buku Pemrograman",
    lokasi: "Perpustakaan Kampus",
    tanggal: "12 Oktober 2026",
    kategori: "Buku",
    simbol: "📚",
    jenis: "Temuan",
    deskripsi:
      "Buku pemrograman yang ditemukan di perpustakaan kampus.",
  },
];

export default function DetailBarang() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const nama = searchParams.get("nama");
  const jenis = searchParams.get("jenis");

  const [semuaBarang, setSemuaBarang] =
    useState<Barang[]>(barangContoh);

  useEffect(() => {
    try {
      const data: Barang[] = JSON.parse(
        localStorage.getItem("findit-laporan") || "[]"
      );

      setSemuaBarang([...barangContoh, ...data]);
    } catch {
      setSemuaBarang(barangContoh);
    }
  }, []);

  const barang = semuaBarang.find((item) => {
    if (id) {
      return item.id !== undefined && String(item.id) === id;
    }

    return item.nama === nama && item.jenis === jenis;
  });

  const halamanSebelumnya =
    jenis === "Temuan" ? "/barang-temuan" : "/barang-hilang";

  if (!barang) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar active={halamanSebelumnya} />

        <section className="relative flex min-h-[65vh] items-center justify-center overflow-hidden bg-linear-to-br from-blue-50 via-white to-cyan-100 px-5 py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

          <div className="relative w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-xl shadow-blue-100/50 md:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
              🔎
            </div>

            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              Barang Tidak Ditemukan
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              Informasi barang tidak tersedia atau laporan tidak ditemukan.
              Silakan kembali ke daftar barang.
            </p>

            <Link
              href={halamanSebelumnya}
              className="mt-7 inline-flex rounded-xl bg-blue-700 px-6 py-3 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-800"
            >
              ← Kembali ke Daftar Barang
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* NAVBAR */}
      <Navbar active={halamanSebelumnya} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100">
        <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full border-45 border-blue-300/40" />
        <div className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 text-center md:px-10 md:py-16 lg:px-12">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-sm font-bold text-blue-700 shadow-sm">
            {barang.jenis === "Temuan"
              ? "🎁 Informasi Barang Temuan"
              : "🔎 Informasi Barang Hilang"}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
            Detail Laporan
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-8 text-slate-600 md:text-lg">
            Informasi lengkap mengenai barang yang dilaporkan di lingkungan
            kampus.
          </p>
        </div>
      </section>

      {/* DETAIL BARANG */}
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-10 md:py-16 lg:px-12">
        <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/50">
          {/* FOTO BARANG */}
          <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-indigo-100 p-6 md:min-h-96">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-cyan-200/40 blur-2xl" />

            {barang.foto ? (
              <img
                src={barang.foto}
                alt={`Foto ${barang.nama}`}
                className="relative max-h-112.5 w-full rounded-2xl object-contain"
              />
            ) : (
              <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border border-white/70 bg-white/70 text-7xl shadow-lg backdrop-blur">
                {barang.simbol || "📦"}
              </div>
            )}
          </div>

          {/* INFORMASI BARANG */}
          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full px-4 py-2 text-xs font-extrabold ${
                  barang.jenis === "Temuan"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                }`}
              >
                {barang.jenis === "Temuan"
                  ? "● Barang Temuan"
                  : "● Barang Hilang"}
              </span>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
                {barang.kategori}
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {barang.nama}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-500">
              Informasi barang berdasarkan laporan yang tersedia di FindIt.
            </p>

            {/* LOKASI DAN TANGGAL */}
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6 transition hover:shadow-md hover:shadow-blue-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                    📍
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    Lokasi Kejadian
                  </p>
                </div>

                <p className="mt-4 text-base font-extrabold text-slate-900">
                  {barang.lokasi}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-100 bg-linear-to-br from-cyan-50 to-white p-6 transition hover:shadow-md hover:shadow-cyan-100/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-xl">
                    📅
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    Tanggal Kejadian
                  </p>
                </div>

                <p className="mt-4 text-base font-extrabold text-slate-900">
                  {barang.tanggal}
                </p>
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="mt-7 rounded-2xl border border-blue-100 bg-slate-50/70 p-6 md:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                  📝
                </div>

                <h3 className="text-lg font-extrabold text-slate-900">
                  Deskripsi Barang
                </h3>
              </div>

              <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-600">
                {barang.deskripsi?.trim() ||
                  "Belum ada deskripsi tambahan untuk barang ini."}
              </p>
            </div>

            {/* TOMBOL */}
            <div className="mt-9 flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row">
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
      <Footer />
    </main>
  );
}

function Footer() {
  return (
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
  );
}