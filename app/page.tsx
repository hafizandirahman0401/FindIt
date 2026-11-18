export const dynamic = "force-dynamic";

import LaporanTerbaru from "./components/LaporanTerbaru";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">

      {/* NAVBAR */}
      <Navbar active="/" showAuth={true} />

      {/* HERO - ABSTRACT MODERN FULL CENTER */}
      <section className="relative isolate flex min-h-170 items-center justify-center overflow-hidden bg-linear-to-br from-[#eaf3ff] via-white to-[#f0eaff] px-5 py-16 sm:px-8 md:min-h-175 lg:px-12">

        {/* ABSTRACT BACKGROUND */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[112.5] w-[112.5] rounded-full bg-blue-300/30 blur-[100px]" />
        <div className="pointer-events-none absolute -right-40 -top-20 h-[125] w-[125] rounded-full bg-violet-300/30 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[112.5] w-[112.5] rounded-full bg-cyan-200/40 blur-[110px]" />

        {/* ABSTRACT SHAPES */}
        <div className="pointer-events-none absolute left-[8%] top-[15%] h-24 w-24 rotate-12 rounded-4xl border border-blue-300/40 bg-blue-200/10 sm:h-32 sm:w-32" />
        <div className="pointer-events-none absolute right-[8%] top-[18%] h-28 w-28 -rotate-12 rounded-full border border-violet-300/40 bg-violet-200/10 sm:h-40 sm:w-40" />
        <div className="pointer-events-none absolute bottom-[12%] left-[15%] h-20 w-20 rotate-12 rounded-full border border-cyan-300/50 sm:h-28 sm:w-28" />
        <div className="pointer-events-none absolute bottom-[13%] right-[14%] h-24 w-24 -rotate-12 rounded-4xl border border-indigo-300/40 bg-indigo-200/10 sm:h-32 sm:w-32" />

        {/* FLOATING BACKGROUND OBJECTS */}
        <div className="pointer-events-none absolute left-[8%] top-[34%] rotate-[-15deg] text-4xl opacity-25 sm:left-[15%] sm:text-6xl">
          🎒
        </div>
        <div className="pointer-events-none absolute right-[8%] top-[35%] rotate-12 text-4xl opacity-25 sm:right-[15%] sm:text-6xl">
          📚
        </div>
        <div className="pointer-events-none absolute bottom-[18%] left-[28%] rotate-12 text-3xl opacity-20 sm:text-5xl">
          🔑
        </div>
        <div className="pointer-events-none absolute bottom-[20%] right-[27%] -rotate-12 text-3xl opacity-20 sm:text-5xl">
          👛
        </div>

        {/* DECORATIVE DOTS */}
        <div className="pointer-events-none absolute left-[25%] top-[20%] h-3 w-3 rounded-full bg-blue-400/50" />
        <div className="pointer-events-none absolute right-[25%] top-[25%] h-4 w-4 rounded-full bg-violet-400/50" />
        <div className="pointer-events-none absolute bottom-[25%] left-[10%] h-3 w-3 rounded-full bg-cyan-500/50" />
        <div className="pointer-events-none absolute bottom-[30%] right-[10%] h-3 w-3 rounded-full bg-indigo-400/50" />

        {/* CENTER CONTENT */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">

          <div className="inline-flex items-center justify-center gap-3 rounded-full border border-blue-200 bg-white/80 px-5 py-2.5 shadow-lg shadow-blue-100/60 backdrop-blur-xl">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-blue-700 sm:text-xs">
              SISTEM INFORMASI BARANG KAMPUS
            </span>
          </div>

          <h1 className="mt-7 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Kehilangan Barang?
            <span className="mt-3 block bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Temukan Kembali di Sini.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base md:text-lg">
            Platform informasi barang hilang dan temuan di lingkungan
            kampus. Cari barangmu, laporkan kehilangan, dan bantu
            sesama menemukan barangnya kembali.
          </p>

          {/* FORM PENCARIAN */}
          <form
            action="/cari"
            method="GET"
            className="mt-8 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-blue-200/80 bg-white/90 p-2 shadow-xl shadow-blue-100/70 backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <span className="text-2xl">🔎</span>
              <input
                type="text"
                name="q"
                placeholder="Cari nama barang atau lokasi..."
                aria-label="Cari nama barang atau lokasi"
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
              />
            </div>

            <select
              name="jenis"
              defaultValue="semua"
              aria-label="Pilih jenis barang"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="semua">Semua Barang</option>
              <option value="hilang">Barang Hilang</option>
              <option value="temuan">Barang Temuan</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-blue-800"
            >
              Cari Barang →
            </button>
          </form>
          
          {/* TOMBOL NAVIGASI */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/barang-hilang"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white/90 px-5 py-3 text-xs font-bold text-blue-700 shadow-md backdrop-blur-md transition hover:-translate-y-1 hover:bg-white sm:px-6 sm:py-3.5 sm:text-sm"
            >
              🔎 Barang Hilang
            </a>

            <a
              href="/barang-temuan"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-slate-950 shadow-md transition hover:-translate-y-1 hover:bg-cyan-300 sm:px-6 sm:py-3.5 sm:text-sm"
            >
              🎒 Barang Temuan
            </a>
          </div>

          {/* INFORMASI */}
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-600 sm:text-sm">
            <span>✓ Mudah digunakan</span>
            <span>✓ Pencarian praktis</span>
            <span>✓ Untuk komunitas kampus</span>
          </div>
        </div>
      </section>

      {/* LAPORAN TERBARU */}
      <LaporanTerbaru />

      {/* JELAJAHI FINDIT */}
      <section className="px-5 py-16 sm:px-8 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-700">
              JELAJAHI FINDIT
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Apa yang ingin kamu lakukan?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Pilih layanan yang kamu butuhkan untuk mencari atau
              melaporkan barang di lingkungan kampus.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* CARD BARANG HILANG */}
            <a
              href="/barang-hilang"
              className="group overflow-hidden rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 via-white to-blue-100 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/60 sm:p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-700 text-3xl shadow-lg shadow-blue-200 transition group-hover:scale-110">
                🔎
              </div>
              <p className="mt-6 text-xs font-bold tracking-widest text-blue-700">CARI BARANG</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Barang Hilang</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Telusuri laporan kehilangan untuk mencari informasi
                barang yang mungkin sesuai dengan barangmu.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition group-hover:gap-3">
                Lihat daftar <span>→</span>
              </span>
            </a>

            {/* CARD BARANG TEMUAN */}
            <a
              href="/barang-temuan"
              className="group overflow-hidden rounded-2xl border border-cyan-200 bg-linear-to-br from-cyan-50 via-white to-sky-100 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-200/60 sm:p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-sky-600 text-3xl shadow-lg shadow-cyan-200 transition group-hover:scale-110">
                🎒
              </div>
              <p className="mt-6 text-xs font-bold tracking-widest text-cyan-700">TEMUKAN PEMILIK</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Barang Temuan</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Lihat barang yang ditemukan di sekitar kampus dan
                bantu mengembalikannya kepada pemiliknya.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-700 transition group-hover:gap-3">
                Lihat daftar <span>→</span>
              </span>
            </a>

            {/* CARD BUAT LAPORAN */}
            <a
              href="/lapor"
              className="group overflow-hidden rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 via-white to-indigo-100 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-200/60 sm:p-7"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-indigo-700 text-3xl shadow-lg shadow-violet-200 transition group-hover:scale-110">
                📝
              </div>
              <p className="mt-6 text-xs font-bold tracking-widest text-violet-700">BANTU KOMUNITAS</p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Buat Laporan</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Laporkan barang yang hilang atau ditemukan dengan
                mengisi informasi melalui formulir yang tersedia.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-violet-700 transition group-hover:gap-3">
                Buat laporan <span>→</span>
              </span>
            </a>

          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="border-y border-blue-100 bg-linear-to-br from-blue-50 via-white to-sky-50 px-5 py-16 sm:px-8 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-100/70 px-4 py-2 text-xs font-bold tracking-widest text-blue-700">
              CARA MENGGUNAKAN
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Mudah dalam Tiga Langkah
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Cari informasi, periksa detail, lalu buat laporan jika
              kamu kehilangan atau menemukan barang.
            </p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-3">

            {/* LANGKAH 1 */}
            <div className="group rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 via-white to-blue-100 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/60 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-blue-800 text-base font-extrabold text-white shadow-lg shadow-blue-200">
                01
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Cari Informasi
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Gunakan kolom pencarian atau buka daftar barang hilang
                dan barang temuan.
              </p>
            </div>

            {/* LANGKAH 2 */}
            <div className="group rounded-2xl border border-cyan-200 bg-linear-to-br from-cyan-50 via-white to-sky-100 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-200/60 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-sky-700 text-base font-extrabold text-white shadow-lg shadow-cyan-200">
                02
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Periksa Informasi
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Cocokkan nama barang, lokasi, tanggal, dan deskripsi
                laporan yang tersedia.
              </p>
            </div>

            {/* LANGKAH 3 */}
            <div className="group rounded-2xl border border-violet-200 bg-linear-to-br from-violet-50 via-white to-indigo-100 p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-200/60 sm:p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-800 text-base font-extrabold text-white shadow-lg shadow-violet-200">
                03
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Buat Laporan
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Isi formulir laporan jika kehilangan barang atau
                menemukan barang milik orang lain.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* AJAKAN MELAPOR */}
      <section className="px-5 py-16 sm:px-8 md:px-12 md:py-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900 px-6 py-10 text-white shadow-xl shadow-blue-200/70 sm:px-10 md:px-14 md:py-14">
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 right-1/3 h-56 w-56 rounded-full bg-sky-400/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-widest text-blue-100">
                BERSAMA KITA BISA MEMBANTU
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Kehilangan atau Menemukan Barang?
              </h2>
              <p className="mt-4 text-sm leading-7 text-blue-100 sm:text-base">
                Jangan biarkan barang hilang begitu saja. Buat laporan
                di FindIt agar informasi dapat membantu proses pencarian.
              </p>
            </div>

            <a
              href="/lapor"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-blue-800 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Buat Laporan Sekarang <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* TIM PENGEMBANG */}
      <section className="border-t border-blue-100 bg-linear-to-br from-sky-50 via-white to-indigo-50 px-5 py-16 sm:px-8 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full border border-blue-100 bg-blue-100/70 px-4 py-2 text-xs font-bold tracking-widest text-blue-700">
              TIM PENGEMBANG
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Mengenal Tim FindIt
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              FindIt dikembangkan untuk membantu warga kampus melaporkan
              dan mencari barang hilang maupun temuan dengan lebih mudah.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">

            {/* PENGEMBANG 1 */}
            <div className="group overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-200/60">
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br from-blue-500 via-blue-600 to-indigo-700">
                <div className="absolute -left-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -right-8 h-48 w-48 rounded-full bg-cyan-300/20" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-7xl shadow-xl backdrop-blur-sm transition duration-300 group-hover:scale-110">
                  👨🏻‍💻
                </div>
                <span className="absolute bottom-4 right-5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold tracking-widest text-white backdrop-blur-md">
                  DEVELOPER
                </span>
              </div>
              <div className="p-7 text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  M. Hafiz Andirahman
                </h3>
                <p className="mt-2 text-sm text-blue-600">
                  Pengembang FindIt
                </p>
                <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-400" />
              </div>
            </div>

            {/* PENGEMBANG 2 */}
            <div className="group overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-200/60">
              <div className="relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br from-indigo-600 via-blue-700 to-sky-600">
                <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-sky-300/20" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-7xl shadow-xl backdrop-blur-sm transition duration-300 group-hover:scale-110">
                  👨🏽‍💻
                </div>
                <span className="absolute bottom-4 right-5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold tracking-widest text-white backdrop-blur-md">
                  DEVELOPER
                </span>
              </div>
              <div className="p-7 text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  Moch. Andika Afif Al Abkhori
                </h3>
                <p className="mt-2 text-sm text-indigo-600">
                  Pengembang FindIt
                </p>
                <div className="mx-auto mt-5 h-1 w-12 rounded-full bg-linear-to-r from-indigo-500 to-sky-400" />
              </div>
            </div>

          </div>

          <div className="mt-9 text-center">
            <a
              href="/tentang-kami"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
            >
              Selengkapnya Tentang Kami <span>→</span>
            </a>
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
              <a href="/" className="text-3xl font-extrabold tracking-tight text-white">
                FindIt<span className="text-cyan-300">.</span>
              </a>
              <p className="mt-3 max-w-sm text-sm leading-7 text-blue-100">
                Membantu menemukan barang di lingkungan kampus.
                Bersama kita membangun lingkungan kampus yang peduli.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-blue-100">
              <a href="/" className="transition hover:text-cyan-300">Beranda</a>
              <a href="/barang-hilang" className="transition hover:text-cyan-300">Barang Hilang</a>
              <a href="/barang-temuan" className="transition hover:text-cyan-300">Barang Temuan</a>
              <a href="/tentang-kami" className="transition hover:text-cyan-300">Tentang Kami</a>
              <a href="/riwayat" className="transition hover:text-cyan-300">Riwayat</a>
              <a href="/lapor" className="transition hover:text-cyan-300">Buat Laporan</a>
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
