
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function LaporBarang() {
  const [jenis, setJenis] = useState("Hilang");
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Elektronik");
  const [lokasi, setLokasi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kontakPelapor, setKontakPelapor] = useState("");
  const [consentKontak, setConsentKontak] = useState(false);
  const [foto, setFoto] = useState("");
  const [pesan, setPesan] = useState("");
  const [errorFoto, setErrorFoto] = useState("");
  const [memeriksaLogin, setMemeriksaLogin] = useState(true);
  const [mengirim, setMengirim] = useState(false);

  const inputFotoRef = useRef<HTMLInputElement>(null);

  // MEMERIKSA LOGIN
  useEffect(() => {
    async function cekAkses() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          window.location.replace("/login");
          return;
        }

        setMemeriksaLogin(false);
      } catch {
        window.location.replace("/login");
      }
    }

    cekAkses();
  }, []);

  // MEMILIH FOTO
  function pilihFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setErrorFoto("");
    setPesan("");

    if (!file.type.startsWith("image/")) {
      setErrorFoto("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setErrorFoto(
        "Ukuran foto maksimal 1 MB. Silakan pilih foto yang lebih kecil."
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFoto(reader.result);
      }
    };

    reader.onerror = () => {
      setErrorFoto("Foto gagal dibaca. Silakan pilih foto lain.");
    };

    reader.readAsDataURL(file);
  }

  // MENGHAPUS FOTO
  function hapusFoto() {
    setFoto("");
    setErrorFoto("");

    if (inputFotoRef.current) {
      inputFotoRef.current.value = "";
    }
  }

  // MENGIRIM LAPORAN
  async function kirimLaporan(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setPesan("");
    setMengirim(true);

    try {
      const response = await fetch("/api/laporan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jenis,
          nama: nama.trim(),
          kategori,
          lokasi: lokasi.trim(),
          tanggal,
          deskripsi: deskripsi.trim(),
          kontakPelapor: kontakPelapor.trim(),
          consentKontak,
          foto,
        }),
      });

      const hasil = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Silakan login terlebih dahulu.");
          window.location.href = "/login";
          return;
        }

        setPesan(hasil.message || "Laporan gagal disimpan.");
        return;
      }

      setPesan(
        `Laporan "${nama.trim()}" berhasil disimpan ke database!`
      );

      setNama("");
      setJenis("Hilang");
      setKategori("Elektronik");
      setLokasi("");
      setTanggal("");
      setDeskripsi("");
      setKontakPelapor("");
      setConsentKontak(false);
      setFoto("");
      setErrorFoto("");

      if (inputFotoRef.current) {
        inputFotoRef.current.value = "";
      }
    } catch (error) {
      console.error("Kesalahan mengirim laporan:", error);
      setPesan("Tidak dapat terhubung ke server.");
    } finally {
      setMengirim(false);
    }
  }

  // TAMPILAN PEMERIKSAAN LOGIN
  if (memeriksaLogin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-white to-cyan-100">
        <div className="rounded-3xl border border-blue-100 bg-white px-10 py-8 text-center shadow-lg shadow-blue-100/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            🔐
          </div>
          <p className="mt-4 font-bold text-blue-700">
            Memeriksa sesi login...
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Mohon tunggu sebentar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100">
        <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full border-45 border-blue-300/40" />
        <div className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />

        <div className="relative mx-auto flex min-h-67.5 max-w-7xl flex-col items-center justify-center px-5 py-12 text-center md:px-10 md:py-14 lg:px-12">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-sm font-bold text-blue-700 shadow-sm">
            FINDIT LOST & FOUND CAMPUS
          </span>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl md:text-5xl">
            Buat Laporan <span className="text-blue-600">Barang</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-700 md:text-base">
            Bantu komunitas kampus menemukan barang hilang dan
            mengembalikan barang yang ditemukan kepada pemiliknya.
          </p>
        </div>
      </section>

      {/* FORMULIR */}
      <section className="px-5 py-12 md:px-10 md:py-14 lg:px-12">
        <div className="mx-auto grid max-w-6xl items-start gap-7 lg:grid-cols-[1fr_300px]">

          {/* FORM UTAMA */}
          <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40 md:p-8">

            <div className="border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                  📝
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Formulir Laporan
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lengkapi informasi barang dengan benar.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={kirimLaporan} className="mt-7 space-y-6">

              {/* JENIS LAPORAN */}
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Jenis Laporan *
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setJenis("Hilang")}
                    className={`rounded-2xl border p-5 text-left transition duration-200 ${
                      jenis === "Hilang"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                        🔎
                      </span>

                      {jenis === "Hilang" && (
                        <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
                          ✓ Dipilih
                        </span>
                      )}
                    </div>

                    <span className="mt-4 block font-extrabold text-slate-900">
                      Barang Hilang
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      Saya kehilangan barang.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setJenis("Temuan")}
                    className={`rounded-2xl border p-5 text-left transition duration-200 ${
                      jenis === "Temuan"
                        ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100 shadow-sm"
                        : "border-slate-200 bg-white hover:border-cyan-300 hover:bg-cyan-50/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-2xl">
                        🎒
                      </span>

                      {jenis === "Temuan" && (
                        <span className="rounded-full bg-cyan-700 px-3 py-1 text-xs font-bold text-white">
                          ✓ Dipilih
                        </span>
                      )}
                    </div>

                    <span className="mt-4 block font-extrabold text-slate-900">
                      Barang Temuan
                    </span>

                    <span className="mt-1 block text-sm text-slate-500">
                      Saya menemukan barang milik orang lain.
                    </span>
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* NAMA BARANG */}
              <div>
                <label htmlFor="nama" className="mb-2 block text-sm font-bold text-slate-800">
                  Nama Barang *
                </label>

                <input
                  id="nama"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Dompet hitam"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* KATEGORI */}
              <div>
                <label htmlFor="kategori" className="mb-2 block text-sm font-bold text-slate-800">
                  Kategori Barang *
                </label>

                <select
                  id="kategori"
                  required
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                >
                  <option>Elektronik</option>
                  <option>Aksesori</option>
                  <option>Alat Tulis</option>
                  <option>Buku</option>
                  <option>Perlengkapan</option>
                  <option>Lainnya</option>
                </select>
              </div>

              {/* LOKASI */}
              <div>
                <label htmlFor="lokasi" className="mb-2 block text-sm font-bold text-slate-800">
                  Lokasi Kejadian *
                </label>

                <input
                  id="lokasi"
                  required
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Contoh: Perpustakaan kampus"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* TANGGAL */}
              <div>
                <label htmlFor="tanggal" className="mb-2 block text-sm font-bold text-slate-800">
                  Tanggal Kejadian *
                </label>

                <input
                  id="tanggal"
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label htmlFor="deskripsi" className="mb-2 block text-sm font-bold text-slate-800">
                  Deskripsi Barang *
                </label>

                <textarea
                  id="deskripsi"
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan warna, ciri-ciri, atau informasi lain tentang barang..."
                  rows={5}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* KONTAK WHATSAPP */}
              <div className="border-t border-slate-100 pt-6">
                <label
                  htmlFor="kontakPelapor"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Nomor WhatsApp Pelapor (Wajib Diisi)
                </label>

                <input
                  id="kontakPelapor"
                  type="tel"
                  value={kontakPelapor}
                  onChange={(e) => setKontakPelapor(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  maxLength={20}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Masukkan nomor WhatsApp aktif agar orang yang memiliki informasi
                  tentang barang dapat menghubungi kamu.
                </p>

                <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-green-200 bg-green-50/70 p-4">
                  <input
                    type="checkbox"
                    checked={consentKontak}
                    onChange={(e) => setConsentKontak(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-green-600"
                  />
                  <span className="text-sm leading-6 text-slate-700">
                    <span className="font-bold text-slate-900">
                      Saya bersedia nomor WhatsApp saya ditampilkan
                    </span>
                    <br />
                    Saya mengizinkan pengunjung melihat nomor kontak dan
                    menghubungi saya melalui WhatsApp pada halaman detail laporan.
                  </span>
                </label>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Jika tidak dicentang, nomor WhatsApp tidak akan ditampilkan
                  kepada pengunjung.
                </p>
              </div>

              {/* UPLOAD FOTO */}
              <div>
                <label htmlFor="foto" className="mb-2 block text-sm font-bold text-slate-800">
                  Foto Barang (Opsional)
                </label>

                <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-linear-to-br from-blue-50/80 to-cyan-50/60 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                      📷
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Tambahkan Foto Barang
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Pilih foto dari perangkatmu.
                      </p>
                    </div>
                  </div>

                  <input
                    ref={inputFotoRef}
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={pilihFoto}
                    className="block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-700 file:px-4 file:py-3 file:font-semibold file:text-white file:transition hover:file:bg-blue-800"
                  />

                  <p className="mt-3 text-xs text-slate-500">
                    Format JPG, PNG, atau WEBP. Ukuran maksimal 1 MB.
                  </p>

                  {errorFoto && (
                    <p
                      role="alert"
                      className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
                    >
                      {errorFoto}
                    </p>
                  )}

                  {foto && (
                    <div className="mt-5">
                      <p className="mb-3 text-sm font-bold text-slate-800">
                        Pratinjau Foto
                      </p>

                      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-2">
                        <img
                          src={foto}
                          alt="Pratinjau foto barang"
                          className="max-h-72 w-full rounded-xl object-contain"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={hapusFoto}
                        className="mt-3 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Hapus Foto
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* TOMBOL KIRIM */}
              <button
                type="submit"
                disabled={mengirim}
                className="w-full rounded-xl bg-linear-to-r from-blue-700 to-indigo-700 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-800 hover:to-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mengirim ? "Mengirim Laporan..." : "Kirim Laporan →"}
              </button>

              {/* PESAN */}
              {pesan && (
                <div
                  role="status"
                  className={`rounded-xl border p-4 ${
                    pesan.includes("berhasil")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                >
                  <p className="font-bold">
                    {pesan.includes("berhasil")
                      ? "✓ Berhasil!"
                      : "Belum Berhasil"}
                  </p>

                  <p className="mt-1 text-sm leading-6">{pesan}</p>
                </div>
              )}
            </form>
          </div>

          {/* PANEL INFORMASI */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            
            {/* TIPS */}
            <div className="rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                💡
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                Tips Membuat Laporan
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Perhatikan beberapa hal berikut agar laporan lebih mudah dipahami.
              </p>

              <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    1
                  </span>
                  Tuliskan nama barang dengan jelas.
                </li>

                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    2
                  </span>
                  Cantumkan lokasi kejadian yang spesifik.
                </li>

                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    3
                  </span>
                  Pilih tanggal kejadian yang sesuai.
                </li>

                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    4
                  </span>
                  Jelaskan ciri-ciri barang secara rinci.
                </li>

                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    5
                  </span>
                  Tambahkan foto agar mudah dikenali.
                </li>

                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                    6
                  </span>
                  <span>
                    <span className="font-bold text-slate-800">
                      Nomor WhatsApp wajib diisi.
                    </span>
                    {" "}Gunakan nomor WhatsApp aktif dan centang persetujuan agar orang
                    yang memiliki informasi tentang barang dapat menghubungi kamu.
                  </span>
                </li>
              </ul>
            </div>

            {/* TENTANG FINDIT */}
            <div className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-2xl">
                💙
              </div>

              <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-blue-700">
                Tentang FindIt
              </p>

              <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                Saling Membantu di Lingkungan Kampus
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                FindIt membantu mengumpulkan informasi barang hilang dan
                temuan agar lebih mudah dicari.
              </p>

              <Link
                href="/tentang-kami"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3"
              >
                Tentang Kami →
              </Link>
            </div>
          </aside>
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

                <Link href="/barang-hilang" className="transition hover:text-cyan-300">
                  Barang Hilang
                </Link>

                <Link href="/barang-temuan" className="transition hover:text-cyan-300">
                  Barang Temuan
                </Link>

                <Link href="/tentang-kami" className="transition hover:text-cyan-300">
                  Tentang Kami
                </Link>

                <Link href="/lapor" className="transition hover:text-cyan-300">
                  Buat Laporan
                </Link>
              </div>
          </div>

          <div className="mt-9 border-t border-white/15 pt-6 text-center text-xs leading-6 text-blue-200 sm:text-sm">
            © {new Date().getFullYear()} FindIt — Sistem Informasi Barang Hilang dan Temuan Kampus
          </div>
        </div>
      </footer>
    </main>
  );
}