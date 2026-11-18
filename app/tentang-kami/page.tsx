import Link from "next/link";
import Navbar from "../components/Navbar";

const pengembang = [
  {
    nama: "M. Hafiz Andirahman",
    peran: "Pengembang Sistem",
    emoji: "👨🏻‍💻",
    nomor: "01",
    deskripsi:
      "Berperan dalam pengembangan dan perancangan sistem informasi FindIt.",
    warna: "from-blue-600 to-cyan-400",
  },
  {
    nama: "Moch. Andika Afif Al Abkhori",
    peran: "Pengembang Sistem",
    emoji: "👨🏽‍💻",
    nomor: "02",
    deskripsi:
      "Berperan dalam pengembangan fitur dan penyempurnaan tampilan FindIt.",
    warna: "from-indigo-600 to-blue-400",
  },
];

const tujuan = [
  "Memudahkan pencarian barang hilang dan temuan.",
  "Menyediakan informasi barang yang terorganisasi.",
  "Membantu menghubungkan barang dengan pemiliknya.",
  "Mendukung lingkungan kampus yang peduli dan tertib.",
];

export default function TentangKamiPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar active="/tentang-kami" />
      
      {/* HERO - ABSTRAK BIRU PUTIH */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-100 via-sky-50 to-cyan-100">
        {/* Dekorasi geometris */}
        <div className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full border-45 border-blue-300/40" />
        <div className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rounded-full bg-blue-300/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-300/40 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-12 h-32 w-32 rounded-full border-18 border-indigo-200/50" />

        <div className="relative mx-auto flex min-h-97.5 max-w-7xl flex-col items-center justify-center px-5 py-20 text-center md:min-h-110 md:px-10 md:py-24 lg:px-12">
          <span className="inline-flex rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-sm font-bold text-blue-700 shadow-sm">
            Mengenal FindIt Lebih Dekat
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl md:text-6xl">
            Tentang <span className="text-blue-600">FindIt</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
            Membantu menemukan kembali barang yang hilang dan mempertemukan
            barang temuan dengan pemiliknya di lingkungan kampus.
          </p>

          <div className="mt-9 grid w-full max-w-md grid-cols-2 gap-3">
            <Link
              href="/barang-hilang"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-700 px-3 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-800"
            >
              Jelajahi Barang →
            </Link>

            <Link
              href="/lapor"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-blue-300 bg-white/90 px-3 py-3 text-center text-sm font-bold text-blue-800 shadow-sm transition hover:-translate-y-1 hover:bg-white"
            >
              + Buat Laporan
            </Link>
          </div>
        </div>
      </section>

      {/* TENTANG SISTEM */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
              Tentang Sistem
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
              Satu Tempat untuk Membantu Menemukan Barang
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              FindIt merupakan sistem informasi barang hilang dan temuan
              yang dirancang untuk membantu mahasiswa mencari informasi
              barang di lingkungan kampus dengan lebih mudah, cepat, dan
              terorganisasi.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Melalui FindIt, pengunjung dapat mencari informasi barang
              dan mengirimkan laporan. Admin bertugas mengelola laporan
              agar informasi yang tersedia lebih tertata.
            </p>

            <Link
              href="/barang-temuan"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:gap-3 hover:text-blue-900"
            >
              Lihat Barang Temuan <span>→</span>
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-blue-100 blur-2xl" />

            <div className="relative rounded-3xl border border-blue-100 bg-linear-to-br from-white via-blue-50 to-cyan-50 p-8 shadow-xl shadow-blue-100/60 md:p-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 text-3xl shadow-lg shadow-blue-200">
                🔎
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-slate-900">
                Tujuan FindIt
              </h3>

              <p className="mt-2 text-sm leading-7 text-slate-500">
                Menghadirkan kemudahan dalam pengelolaan informasi barang
                hilang dan temuan di lingkungan kampus.
              </p>

              <ul className="mt-6 space-y-4">
                {tujuan.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
                      ✓
                    </span>
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TIM PENGEMBANG */}
      <section className="border-y border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
              Tim Pengembang
            </p>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Kenali Tim Kami
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              FindIt dikembangkan oleh dua mahasiswa dengan tujuan
              menghadirkan solusi sederhana untuk permasalahan barang
              hilang dan temuan di lingkungan kampus.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-7 md:grid-cols-2">
            {pengembang.map((orang) => (
              <article
                key={orang.nomor}
                className="group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100/70"
              >
                <div className={`relative flex h-36 items-center justify-center bg-linear-to-br ${orang.warna}`}>
                  <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/15" />
                  <div className="absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-white/10" />

                  <span className="relative text-6xl drop-shadow-lg">
                    {orang.emoji}
                  </span>

                  <span className="absolute right-6 top-5 text-sm font-extrabold tracking-widest text-white/70">
                    {orang.nomor}
                  </span>
                </div>

                <div className="p-7">
                  <p className="text-sm font-bold text-blue-600">
                    {orang.peran}
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold leading-snug text-slate-900">
                    {orang.nama}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {orang.deskripsi}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-10 md:px-10 lg:px-12">
        <div className="relative mx-auto flex min-h-69 max-w-7xl items-center overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-blue-800 to-indigo-900 px-7 py-10 shadow-xl shadow-blue-200 md:px-10 md:py-12">
          <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/10" />

          <div className="relative flex w-full flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold tracking-widest text-blue-200">
                BERSAMA FINDIT
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">
                Bersama, Bantu Temukan yang Hilang
              </h2>

              <p className="mt-3 text-sm leading-7 text-blue-100 md:text-base">
                Setiap informasi dapat membantu seseorang menemukan kembali
                barang miliknya. Mari manfaatkan FindIt untuk saling membantu.
              </p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 md:w-80 md:shrink-0">
  <Link
    href="/barang-hilang"
    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-3 py-3 text-center text-sm font-bold text-blue-800 shadow-md transition hover:-translate-y-0.5 hover:bg-blue-50"
  >
    Cari Barang
  </Link>

  <Link
    href="/lapor"
    className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-3 py-3 text-center text-sm font-bold text-white transition hover:bg-white/20"
  >
    Buat Laporan
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